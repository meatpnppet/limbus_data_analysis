const fs = require('node:fs');
const sinners = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const datasetReader = {
    // ID Data
    // personality-YY.json
    // Data Structure: { "list": [...] }
    getIdData: (folder) => {
        const filenames = sinners.map((n) => `${folder}/personality-${n}.json`);
        return filenames.flatMap((f) => JSON.parse(fs.readFileSync(f))['list']);
    },

    // ID to Passive Map
    // personality-passive-YY.json
    // Data Structure: { "list": [...] }
    getIdPassiveMap: (folder) => {
        const filenames = sinners.map((v) => `${folder}/personality-passive-${v}.json`);
        return filenames.flatMap((f) => JSON.parse(fs.readFileSync(f))['list']);
    },

    // Passive Data
    // passive.json / passive_check4.json (Uptie 4)
    // Data Structure: { "list": [...] }
    getPassiveData: (folder) => {
        return JSON.parse(fs.readFileSync(`${folder}/passive.json`))['list']
            .concat(JSON.parse(fs.readFileSync(`${folder}/passive_check4.json`))['list']);
    },

    // Skill Data
    // personality-skill-YY.json
    // Data Structure: { "list": [...] }
    getSkillData: (folder) => {
        const filenames = sinners.map((v) => `${folder}/personality-skill-${v}.json`);
        return filenames.flatMap((f) => JSON.parse(fs.readFileSync(f))['list']);
    },

    // ID Descriptions
    // XX_Personalities.json
    // Data Structure: { "dataList": [...] }
    getIdDescriptions: (folder, lang) => {
        return JSON.parse(fs.readFileSync(`${folder}/${lang}_Personalities.json`, { encoding: 'utf-8' }))['dataList'];
    },

    // Passive Descriptions
    // XX_Passives.json
    // Data Structure: { "dataList": [...] }
    getPassiveDescriptions: (folder, lang) => {
        return JSON.parse(fs.readFileSync(`${folder}/${lang}_Passives.json`, { encoding: 'utf-8' }))['dataList']
            .concat(JSON.parse(fs.readFileSync(`${folder}/${lang}_Passives_check4.json`, { encoding: 'utf-8' }))['dataList']);
    },

    // Skill Descriptions
    // XX_Skills.json
    // XX_Skills_personality-YY.json
    // Data Structure: { "dataList": [...] }
    getSkillDescriptions: (folder, lang) => {
        const filenames = sinners.map((v) => `${folder}/${lang}_Skills_personality-${v}.json`);
        return JSON.parse(fs.readFileSync(`${folder}/${lang}_Skills.json`))['dataList']
            .concat(filenames.flatMap((f) => JSON.parse(fs.readFileSync(f))['dataList']));
    },

    // XX_SkillTag.json
    // XX_BattleKeywords.json
    // XX_BattleKeywords-walpu4.json
    // Data Structure: { "dataList": [...] }
    getKeywords: (folder, lang) => {
        return JSON.parse(fs.readFileSync(`${folder}/${lang}_SkillTag.json`))['dataList']
            .concat(JSON.parse(fs.readFileSync(`${folder}/${lang}_BattleKeywords.json`))['dataList'])
            .concat(JSON.parse(fs.readFileSync(`${folder}/${lang}_BattleKeywords-walpu4.json`))['dataList']);
    }
}

module.exports = datasetReader;