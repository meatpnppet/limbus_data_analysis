
const cleanIdData = (obj) => {
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
};

const cleanIdText = (obj) => {
    const toDelete = [
        'id',
        'nameWithTitle',
        'desc'
    ];
    delete obj['id'];
    for (lang in obj) {
        for (let key of toDelete) {
            delete obj[lang][key];
        }
    }
};

const cleanSkillData = (obj) => {
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
    delete obj['description']['id'];
    for (let lang in obj['description']) {
        delete obj['description'][lang]['id'];
        for (let item of obj['description'][lang]['levelList']) {
            if (item['desc'] === '') {
                delete item['desc'];
            }
            for (let coinObj of item['coinlist']) {
                if (coinObj['coindescs']) {
                    let empty = true;
                    for (let coin of coinObj['coindescs']) {
                        if (coin['desc'] === '') {
                            delete coin['desc'];
                        }
                        if (Object.keys(coin).length !== 0) {
                            empty = false;
                        }
                    }
                    if (empty) {
                        delete coinObj['coindescs'];
                    }
                }
            }
        }
    }
};

const cleanPassiveData = (obj) => {
    delete obj['personalityId'];
    for (let list of ['battlePassiveList', 'supporterPassiveList']) {
        for (let p of obj[list]) {
            delete p['passiveIDList'];
            for (let x of p['passiveList']) {
                delete x['id'];
                for (let lang in x) {
                    delete x[lang]['id'];
                }
            }
        }
    }
};

const datasetCleaner = {
    cleanData: (list) => {
        let newList = [...list];
        for (x of newList) {
            cleanIdData(x);
            cleanIdText(x['description']);
            for (y of x['attributeList']) {
                cleanSkillData(y);
            }
            cleanPassiveData(x['passive']);
        }
        return newList;
    }
};

module.exports = datasetCleaner;