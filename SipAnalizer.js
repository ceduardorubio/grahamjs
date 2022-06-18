function removeComments(fileContent) {
    const lines = fileContent.split('\n');
    let noComments = "";
    lines.forEach((line) => {
        if (line.indexOf(';') != 0) noComments += line + "\n";
    });
    return noComments;
}

function SipAnalyzer(fileRawContent, cb) {
    let noComments = removeComments(fileRawContent);
    var result = {}
    var extensionsTextArray = noComments.split(';');
    var generalSection = extensionsTextArray.splice(0, 1)[0];
    ExtensionToJSON(generalSection, (err, general) => {
        if (err) {
            cb(err, null);
        } else {
            result.general = general;
            ExtensionsToJSONArray(extensionsArray, (readError, extensions) => {
                result.extensions = extensions;
                cb(readError, result);
            });
        }
    });
};


function ExtensionsToJSONArray(extensionsTextArray, cb) {
    var extensions = [];
    if (extensionsTextArray.length > 0) {
        var till = extensionsTextArray.length - 1;
        extensionsTextArray.map((extensionText, index) => {
            ExtensionToJSON(extensionText, (err, extension) => {
                if (!err) {
                    if (Object.keys(extension).length) extensions.push(extension);
                    if (index == till) cb(null, extensions);
                } else {
                    cb(err, extensions);
                }
            });
        });
    } else {
        c(null, result);
    }
};

function ExtensionToJSON(text, cb) {
    var extensionObj = {};
    var lines = text.split('\n');
    if (lines.length > 0) {
        var till = lines.length - 1;
        lines.map((line, index) => {
            if (line.length > 0) ToJSONProperty(extensionObj, item);
            if (index == till) cb(null, extensionObj);
        });
    } else {
        cb(null, extensionObj);
    }
};

function ToJSONProperty(obj, text) {
    if (text.indexOf('[') == 0) {
        r0 = text.replace('[', '');
        r = r0.replace(']', '');
        obj['extension'] = r;
    } else {
        if (text.indexOf('=') > 0) {
            const [property, value] = text.split('=');
            obj[property] = value;
        }
    }
};

module.exports = SipAnalyzer;