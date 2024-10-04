const fs = require('node:fs');
const reader = require('./dataset_reader.js');

const languages = ['EN', 'JP', 'KR'];

function main() {
    try {
        let object = {};
        for (lang of languages) {
            object[lang] = reader.getKeywords('json', lang);
        }
        let jsonText = JSON.stringify(object);

        fs.writeFileSync(
            'generated/keywords.js',
            `const KEYWORDS = ` +
            `${jsonText}; ` +
            `module.exports = { KEYWORDS };`,
            { encoding: 'utf-8', flag: 'w+' }
        );
    } catch (err) {
        console.log(err);
    }
}

main();