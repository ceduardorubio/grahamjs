function GetSipExtensions(sipConfFileContent) {
    let lines = sipConfFileContent.split('\n');
    let noComments = lines.filter((line) => line.indexOf(';') != 0);
    let noEmptyLines = noComments.filter((line) => line.length > 0);
    let noEmptyLinesTrimmed = noEmptyLines.map((line) => line.trim());
    let fileContent = noEmptyLinesTrimmed.join('\n');
    let bracketsBlocks = fileContent.split('[');
    let extensionBlocks = bracketsBlocks.filter(item => item.indexOf(']') > -1);
    let extensions = extensionBlocks.map(item => {
        let [name, content] = item.split(']');
        let extension = content.split('\n').reduce((acc, line) => {
            let noComment = line.split(';').shift();
            let [key, value] = noComment.split('=');
            acc[key] = value;
            return acc;
        }, { name });
        return extension;
    });
    return extensions;
};


module.exports = GetSipExtensions;