const fs = require('node:fs');
const reader = require('./dataset_reader.js');
const combiner = require('./dataset_combiner.js');
const cleaner = require('./dataset_cleaner.js');

const languages = ['EN', 'JP', 'KR'];

let options = {
    debug: false,
    writeToFile: true,
    clean: false,
    format: true,
    filename: 'generated/data.js',
    folder: 'json'
};

function main() {
    if (process.argv.length < 4) {
        console.log('Usage:\n'
            + '    node .\\dataset_builder\\main.js [JSON folder] [output file] [options...]\n'
            + 'Options:\n'
            + '    -w: Output JSON file with whitespace\n'
            + '    -r: Run without writing to file\n'
            + '    -c: Clean extra properties in output');
        return;
    }

    if (!fs.existsSync(process.argv[2])) {
        console.error('No JSON directory (run without args for usage)');
        return;
    }

    for (const arg of process.argv) {
        if (arg === '-w') {
            options.debug = true;
            console.log('-w: Output with whitespace');
        } else if (arg === '-r') {
            options.writeToFile = false;
            console.log('-r: Run without writing to file');
        } else if (arg === '-c') {
            options.clean = true;
            console.log('-c: Clean extra properties in output');
        }
    }

    if (options.writeToFile) {
        try {
            fs.writeFileSync(process.argv[3], '');
            options.filename = process.argv[3];
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

        if (!options.clean) {
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