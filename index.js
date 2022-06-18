const exec = require('child_process').exec;
const fs = require('fs');
const SipAnalyzer = require('./SipAnalyzer');
const ReadFile = (filePath, cb) => fs.readFile(filePath, 'utf8', cb);
const WriteFile = (filePath, text, cb) => fs.writeFile(filePath, text, cb);

class AsteriskController {
    constructor(extensionFilePath = "/etc/asterisk/extensions.conf", sipFilePath = "/etc/asterisk/sip.conf", reloadAsteriskCommand = "service asterisk restart") {
        this.extensionFilePath = extensionFilePath;
        this.sipFilePath = sipFilePath;
        this.reloadAsteriskCommand = reloadAsteriskCommand;
    };

    ReadSipFile(cb) {
        ReadFile(this.sipFilePath, cb);
    }

    WriteSipFile(data, cb) {
        WriteFile(this.sipFilePath, data, cb);
    }

    ReadExtensionFile(cb) {
        ReadFile(this.extensionFilePath, cb);
    }

    WriteExtensionFile(data, cb) {
        WriteFile(this.extensionFilePath, data, cb);
    }

    ReloadAsterisk(callback) {
        exec(this.reloadAsteriskCommand, function(error, stdout, stderr) { callback(error, stdout); });
    };

    AddContext(context, callback) {
        this.ReadSipFile((errorRead, sipFileContent) => {
            if (errorRead) {
                callback(errorRead, null);
            } else {
                let TextNewContext = "\n";
                TextNewContext += "[" + o.context + "]" + "\n";
                TextNewContext += "exten=>_X.,1,Dial(SIP/${EXTEN})" + "\n";
                TextNewContext += ";";
                const newSipFileContent = sipFileContent + TextNewContext;
                this.WriteSipFile(newSipFileContent, function(errorWrite, resultWrite) {
                    if (!errorWrite) {
                        this.ReloadAsterisk((errorAsterisk, stdout) => {
                            callback(errorAsterisk, stdout);
                        });
                    } else {
                        callback(errorWrite, null);
                    };
                });
            }
        })
    };

    AddSipExtension(extension, secret, context, callback) {
        this.ReadExtensionFile((errorRead, extensionsFileContent) => {
            if (errorRead) {
                callback(errorRead, null);
            } else {
                let TextNewSip = "\n";
                TextNewSip += "[" + extension + "]" + "\n";
                TextNewSip += "type=friend" + "\n";
                TextNewSip += "secret=" + secret + "\n";
                TextNewSip += "callerid=usuario" + extension + "\n";
                TextNewSip += "qualify=yes" + "\n";
                TextNewSip += "host=dynamic" + "\n";
                TextNewSip += "canreinvite=no" + "\n";
                TextNewSip += "dial=SIP/" + extension + "\n";
                TextNewSip += "context=" + context + "\n";
                TextNewSip += ";";
                const newExtensionsFileContent = extensionsFileContent + TextNewSip;
                WriteExtensions(newExtensionsFileContent, function(errorWrite, resultWrite) {
                    if (!errorWrite) {
                        this.ReloadAsterisk((errorAsterisk, stdout) => {
                            callback(errorAsterisk, stdout);
                        });
                    } else {
                        callback(errorWrite, null);
                    };
                });
            }
        })
    };

    ReloadAsterisk(callback) {
        this.exec(this.reloadAsteriskCommand, (error, stdout, stderr) => { callback(error, stdout); });
    };

    GetExtensionsObjects(cb) {
        this.ReadSipFile((e, sipFileText) => {
            if (e) {
                cb(e, null);
            } else {
                SipAnalyzer(sipFileText, (er, r) => cb(er, r));
            }
        });
    };
}

module.exports = AsteriskController;