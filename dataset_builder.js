const fs = require('node:fs');

const folder = 'json';
const languages = ['EN', 'JP', 'KR'];
const sinners = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
];
const DEBUG = true;
const WRITE_TO_FILE = true;


function main() {
    try {
        let data = {};

        // Get list of all IDs
        const idDataList = getIdData();
        const passiveDataList = getIdPassiveMap();
        const passiveDataList2 = getPassiveData();
        const skillDataList = getSkillData();
        const idTextList = combineTextLists(getIdTextList);
        const passiveTextList = combineTextLists(getPassiveTextList);
        const skillTextList = combineTextLists(getSkillTextList);

        const idList = combineIdLists(idDataList, idTextList);
        const skillList = combineSkillLists(skillDataList, skillTextList);
        // Multiple passives per ID, so needs to be a special case
        const passiveList = combinePassiveLists(passiveDataList, passiveDataList2, passiveTextList);

        // Finalize list
        data = combineIntoIdList(idList, passiveList, skillList);

        let originalDataSize = JSON.stringify(data).length;
        console.log("Dataset Size: %d", originalDataSize);

        if (!DEBUG) {
            data = cleanData(data);
            let cleanedDataSize = JSON.stringify(data).length;
            console.log(
                "Cleaned Size: %d (%f%)",
                cleanedDataSize,
                ((cleanedDataSize / originalDataSize) * 100).toFixed(2)
            );
        }

        // Create/overwrite file and write DATA object
        if (WRITE_TO_FILE) {
            fs.writeFileSync(
                'generated/data.js',
                `const DATA = ${JSON.stringify(data, null, DEBUG ? 2 : 0)};` +
                `module.exports = { DATA };`,
                { encoding: 'utf-8', flag: 'w' }
            );
        }
    } catch (err) {
        console.log(err);
    }
}


function cleanData(list) {
    let newList = [...list];

    for (x of newList) {
        cleanIdData(x);
        cleanIdText(x['desc']);
        for (y of x['attributeList']) {
            cleanSkillData(y);
        }
        cleanPassiveData(x['passive']);
    }

    return newList;
}


function cleanIdData(obj) {
    const toDelete = [
        'appearance',
        'panicType',
        'season',
        'defenseSkillIDList',
        'panicSkillOnErosion',
        'rank',
        'uniqueAttribute',
        'breakSection',
        'resistInfo',
        'mentalConditionInfo',
    ];
    for (let key of toDelete) {
        delete obj[key];
    }
}


function cleanIdText(obj) {
    const toDelete = [
        'id',
        'nameWithTitle',
        'desc'
    ];
    delete obj['id'];
    for (lang of languages) {
        for (let key of toDelete) {
            delete obj[lang][key];
        }
        obj[lang]['title'] = obj[lang]['title'].replace('\n', ' ');
    }
}


function cleanSkillData(obj) {
    const skillDataToDelete = [
        'canTeamKill',
        'canDuel',
        'canChangeTarget',
        'skillMotion',
        'viewType',
        'parryingCloseType',
        'skillTargetType'
    ];
    delete obj['id'];
    delete obj['skillId'];
    delete obj['skillType'];
    for (let skill of obj['skillData']) {
        for (let key of skillDataToDelete) {
            delete skill[key];
        }
    }
    delete obj['desc']['id'];
    for (let lang of languages) {
        delete obj['desc'][lang]['id'];
        for (let item of obj['desc'][lang]['levelList']) {
            delete item['desc'];
        }
    }
}


function cleanPassiveData(obj) {
    delete obj['personalityId'];
    for (let list of ['battlePassiveList', 'supporterPassiveList']) {
        for (let p of obj[list]) {
            delete p['passiveIDList'];
            for (let x of p['passiveList']) {
                delete x['id'];
                for (let lang of languages) {
                    delete x[lang]['id'];
                }
            }
        }
    }
}


// ID Data
// personality-YY.json
// Data Structure: { "list": [...] }
function getIdData() {
    try {
        const filenames = sinners.map((n) => `${folder}/personality-${n}.json`);
        return filenames.flatMap((f) => JSON.parse(fs.readFileSync(f))['list']);
    } catch (err) {
        console.error(err);
        return [];
    }
}


// ID to Passive Map
// personality-passive-YY.json
// Data Structure: { "list": [...] }
function getIdPassiveMap() {
    try {
        const filenames = sinners.map((v) => `${folder}/personality-passive-${v}.json`);
        return filenames.flatMap((f) => JSON.parse(fs.readFileSync(f))['list']);
    } catch (err) {
        console.error(err);
        return [];
    }
}


// Passive Data
// passive.json / passive_check4.json (Uptie 4)
// Data Structure: { "list": [...] }
function getPassiveData() {
    try {
        return JSON.parse(fs.readFileSync(`${folder}/passive.json`))['list']
            .concat(JSON.parse(fs.readFileSync(`${folder}/passive_check4.json`))['list']);
    } catch (err) {
        console.log(err);
    }
    return [];
}


// Skill Data
// personality-skill-YY.json
// Data Structure: { "list": [...] }
function getSkillData() {
    try {
        const filenames = sinners.map((v) => `${folder}/personality-skill-${v}.json`);
        return filenames.flatMap((f) => JSON.parse(fs.readFileSync(f))['list']);
    } catch (err) {
        console.log(err);
    }
    return [];
}


function getIdTextList(lang) {
    // XX_Personalities.json
    // Data Structure: { "dataList": [...] }
    try {
        let text = fs.readFileSync(`${folder}/${lang}_Personalities.json`, { encoding: 'utf-8' });
        text = text.replaceAll('\\n', ' ');
        const obj = JSON.parse(text);
        return [].concat(obj['dataList']);
    } catch (err) {
        console.log(err);
    }
    return [];
}


function getPassiveTextList(lang) {
    // XX_Passives.json
    // Data Structure: { "dataList": [...] }
    try {
        let text = fs.readFileSync(`${folder}/${lang}_Passives.json`, { encoding: 'utf-8' });
        const skillTags = getSkillTagList(lang);
        for (tag of skillTags) {
            text = text.replaceAll('[' + tag['id'] + ']', '[' + tag['name'] + ']');
        }
        const obj = JSON.parse(text);
        return [].concat(obj['dataList']);
    } catch (err) {
        console.log(err);
    }
    return [];
}


function getSkillTextList(lang) {
    // XX_Skills.json
    // XX_Skills_personality-YY.json
    // Data Structure: { "dataList": [...] }
    const files = sinners.map((v) => `${folder}/${lang}_Skills_personality-${v}.json`);
    try {
        let obj = JSON.parse(
            fs.readFileSync(`${folder}/${lang}_Skills.json`)
        );
        let list = [].concat(obj['dataList']);
        for (let f of files) {
            obj = JSON.parse(fs.readFileSync(f));
            list = list.concat(obj['dataList']);
        }
        return list;
    } catch (err) {
        console.log(err);
    }
    return [];
}


function getSkillTagList(lang) {
    // XX_SkillTag.json
    // XX_BattleKeywords.json
    // XX_BattleKeywords-walpu4.json
    // Data Structure: { "dataList": [...] }
    try {
        let list = [];
        let obj = JSON.parse(
            fs.readFileSync(`${folder}/${lang}_SkillTag.json`)
        );
        list = list.concat(obj['dataList']);
        obj = JSON.parse(
            fs.readFileSync(`${folder}/${lang}_BattleKeywords.json`)
        );
        list = list.concat(obj['dataList']);
        obj = JSON.parse(
            fs.readFileSync(`${folder}/${lang}_BattleKeywords-walpu4.json`)
        );
        list = list.concat(obj['dataList']);
        return list;
    } catch (err) {
        console.log(err);
    }
    return [];
}


function combineTextLists(func) {
    let lists = {};
    let returnList = [];
    for (lang of languages) {
        lists[lang] = func(lang);
    }
    for (lang in lists) {
        if (returnList.length === 0) {
            returnList = lists[lang].map(
                (obj) => {
                    let newObj = { 'id': obj['id'] };
                    newObj[lang] = obj;
                    return newObj;
                }
            );
        } else {
            for (i of returnList) {
                for (j of lists[lang]) {
                    if (i['id'] === j['id']) {
                        i[lang] = j;
                    }
                }
            }
        }
    }
    return returnList;
}


function combineIdLists(data, text) {
    let returnList = [];
    for (i of data) {
        for (j of text) {
            if (i['id'] === j['id']) {
                let newObj = { ...i };
                newObj['desc'] = { ...j };
                returnList.push(newObj);
            }
        }
    }
    return returnList;
}


function combineSkillLists(data, text) {
    let returnList = [];
    for (i of data) {
        for (j of text) {
            if (i['id'] === j['id']) {
                let newObj = { ...i };
                newObj['desc'] = { ...j };
                returnList.push(newObj);
            }
        }
    }
    return returnList;
}


function combinePassiveLists(data1, data2, text) {
    let returnList = [];
    for (i of data1) {
        let newObj = { ...i };
        for (bp of newObj['battlePassiveList']) {
            bp['passiveList'] = [];
            for (p of bp['passiveIDList']) {
                for (j of text) {
                    if (j['id'] === p) {
                        for (k of data2) {
                            if (k['id'] === p) {
                                bp['passiveList'].push({ ...j, ...k });
                            }
                        }
                    }
                }
            }
        }
        for (bp of newObj['supporterPassiveList']) {
            bp['passiveList'] = [];
            for (p of bp['passiveIDList']) {
                for (j of text) {
                    if (j['id'] === p) {
                        for (k of data2) {
                            if (k['id'] === p) {
                                bp['passiveList'].push({ ...j, ...k });
                            }
                        }
                    }
                }
            }
        }
        returnList.push(newObj);
    }
    return returnList;
}


function combineIntoIdList(idList, passiveList, skillList) {
    let finalList = [];
    for (id of idList) {
        let newObj = { ...id };
        for (p of passiveList) {
            if (p['personalityID'] === id['id']) {
                newObj['passive'] = { ...p };
            }
        }
        for (let i = 0; i < id['attributeList'].length; ++i) {
            for (s of skillList) {
                let a = id['attributeList'][i];
                if (a['skillId'] === s['id']) {
                    newObj['attributeList'][i] = { ...a, ...s }
                }
            }
        }
        finalList.push(newObj);
    }
    return finalList;
}


main();