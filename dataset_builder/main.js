const fs = require('node:fs');
const reader = require('./dataset_reader.js');
const combiner = require('./dataset_combiner.js');
const cleaner = require('./dataset_cleaner.js');

const languages = ['EN', 'JP', 'KR'];

let options = {
    debug: false,
    writeToFile: true,
    clean: true,
    filename: 'generated/data.js',
    folder: 'json'
};

function main() {
    if (process.argv.length > 2 && process.argv[2] === 'help') {
        console.log('Usage:\n'
            + '    node .\\dataset_builder\\main.js [options...]\n'
            + 'Options:\n'
            + '    --output=[filename]: Change output file (default: generated/data.js)\n'
            + '    --input=[folder]: Change JSON input folder (default: json)\n'
            + '    -w: Output JSON file with whitespace\n'
            + '    -d: Dry run, or run without writing to file\n'
            + '    --clean=[true/false]: Clean extra properties in output (default: true)');
        return;
    }

    for (const arg of process.argv) {
        if (arg === '-w') {
            options.debug = true;
            console.log('-w: Output with whitespace');
        } else if (arg === '-d') {
            options.writeToFile = false;
            console.log('-d: Dry run, or run without writing to file');
        } else if (arg.startsWith('--clean=')) {
            let substring = arg.substring('--clean='.length);
            if (substring === 'true') {
                options.clean = true;
            } else if (substring === 'false') {
                options.clean = false;
                console.log('--clean=false: Do not clean extra properties in output');
            } else {
                console.log('Invalid boolean value');
                return;
            }
        } else if (arg.startsWith('--output=')) {
            options.filename = arg.substring('--output='.length);
        } else if (arg.startsWith('--input=')) {
            options.folder = arg.substring('--input='.length);
        }
    }

    if (options.writeToFile) {
        try {
            fs.writeFileSync(options.filename, '');
        } catch (err) {
            console.error(err);
            return;
        }
    }

    try {
        // Get list of all IDs
        let idDataList = reader.getIdData(options.folder);
        let passiveDataList = reader.getPassiveData(options.folder);
        let skillDataList = reader.getSkillData(options.folder);
        for (lang of languages) {
            idDataList = combiner.addDescriptionsToIds(
                idDataList, lang, reader.getIdDescriptions(options.folder, lang));
            skillDataList = combiner.addDescriptionsToSkills(
                skillDataList, lang, reader.getSkillDescriptions(options.folder, lang));
            passiveDataList = combiner.addDescriptionsToPassives(
                passiveDataList, lang, reader.getPassiveDescriptions(options.folder, lang));
        }
        idDataList = combiner.combineIdPassiveLists(idDataList, reader.getIdPassiveMap(options.folder), passiveDataList);
        idDataList = combiner.combineIdSkillLists(idDataList, skillDataList);

        let jsonText = JSON.stringify(idDataList, null, options.debug ? 2 : 0);
        console.log("Dataset Size: %d characters", jsonText.length);

        if (options.clean) {
            let originalDataSize = jsonText.length;
            idDataList = cleaner.cleanData(idDataList);
            jsonText = JSON.stringify(idDataList, null, options.debug ? 2 : 0);
            let cleanedDataSize = jsonText.length;
            console.log(
                "Cleaned Size: %d (%f% of original)",
                cleanedDataSize,
                ((cleanedDataSize / originalDataSize) * 100).toFixed(2)
            );
        }

        // Create/overwrite file and write DATA object
        if (options.writeToFile) {
            fs.writeFileSync(
                options.filename,
                `const DATA = ` +
                `${jsonText}; ` +
                `module.exports = { DATA };`,
                { encoding: 'utf-8', flag: 'w' }
            );
        }
    } catch (err) {
        console.log(err);
    }
}

main();