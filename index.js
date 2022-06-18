const exec = require('child_process').exec;
const fs = require('fs');
class AsteriskController {
    constructor(asteriskPath = "/etc/asterisk", commandExecutionPrefix = "") {
        this.extensionFilePath = asteriskPath + "/extensions.conf";
        this.sipFilePath = asteriskPath + "/sip.conf";
        this.commandExecutionPrefix = commandExecutionPrefix;
    };

    AppendToSipFile(text, cb) {
        fs.readFile(this.sipFilePath, 'utf8', (e, r) => {
            if (e) {
                cb(e, null);
            } else {
                let sipFileText = r;
                sipFileText += "\n";
                sipFileText += text;
                fs.writeFile(this.sipFilePath, sipFileText, (e, r) => cb(e, r));
            }
        });
    }

    AppendToExtensionsFile(text, cb) {
        fs.readFile(this.extensionFilePath, 'utf8', (e, r) => {
            if (e) {
                cb(e, null);
            } else {
                let extensionFileText = r;
                extensionFileText += "\n";
                extensionFileText += text;
                fs.writeFile(this.extensionFilePath, extensionFileText, (e, r) => cb(e, r));
            }
        });
    }

    ReloadSip(callback) {
        let command = 'asterisk -rx “sip reload”'
        if (this.commandExecutionPrefix !== "") command = this.commandExecutionPrefix + " " + command;
        exec(command, function(error, stdout, stderr) { callback(error, stdout); });

    }

    ReloadDialplan(callback) {
        let command = 'asterisk -rx "dialplan reload"';
        if (this.commandExecutionPrefix !== "") command = this.commandExecutionPrefix + " " + command;
        exec(command, function(error, stdout, stderr) { callback(error, stdout); });
    }

    AddNewContext(contextString, callback) {
        this.AppendToExtensionsFile(contextString, function(errorWrite, resultWrite) {
            if (!errorWrite) {
                this.ReloadDialplan((errorAsterisk, stdout) => {
                    callback(errorAsterisk, stdout);
                });
            } else {
                callback(errorWrite, null);
            };
        });
    };

    GetContextString(context) {
        let newContext = new AsteriskText(context);
        newContext.AppendExtenRule("_X.,1,Dial(SIP/${EXTEN})");
        return newContext.GetText();
    }

    AddNewSipExtension(sipExtensionString, callback) {
        this.AppendToSipFile(sipExtensionString, function(errorWrite, resultWrite) {
            if (!errorWrite) {
                this.ReloadSip((errorAsterisk, stdout) => {
                    callback(errorAsterisk, stdout);
                });
            } else {
                callback(errorWrite, null);
            };
        });
    };

    GetSipExtensionString(extension, secret, context, type = "friend", callerId = extension, qualify = "yes", host = "dynamic", canReinvite = "no") {
        let newSip = new AsteriskText(extension);
        newSip.AppendKeyValue("type", type);
        newSip.AppendKeyValue("secret", secret);
        newSip.AppendKeyValue("callerid", callerId);
        newSip.AppendKeyValue("qualify", qualify);
        newSip.AppendKeyValue("host", host);
        newSip.AppendKeyValue("canreinvite", canReinvite);
        newSip.AppendKeyValue("dial", "SIP/" + extension);
        newSip.AppendKeyValue("context", context);
        return newSip.GetText();
    }
}

module.exports = AsteriskController;

class AsteriskText {
    constructor(start) {
        this.text = "[" + start + "]";
    }

    Append(line) {
        this.text += line + "\n";
    }

    AppendExtenRule(rule) {
        this.text += "exten=>" + rule + "\n";
    }

    AppendKeyValue(key, value) {
        this.text += key + "=" + value + "\n";
    }

    GetText() {
        return "\n" + this.text + "\n";
    }
}