const datasetCombiner = {
    addDescriptionsToIds: (ids, lang, descs) => {
        let newList = ids.map((id) => {
            let newId = { ...id };
            newId['description'] ??= {};
            newId['description'][lang] = {};
            return newId;
        });
        for (let id of newList) {
            for (let desc of descs) {
                if (id['id'] === desc['id']) {
                    id['description'][lang] = desc;
                }
            }
        }
        return newList;
    },

    addDescriptionsToSkills: (skills, lang, descs) => {
        let newList = skills.map((skill) => {
            let newSkill = { ...skill };
            newSkill['description'] ??= {};
            newSkill['description'][lang] = {};
            return newSkill;
        });
        for (let skill of newList) {
            for (let desc of descs) {
                if (skill['id'] === desc['id']) {
                    skill['description'][lang] = desc;
                }
            }
        }
        return newList;
    },

    addDescriptionsToPassives: (passives, lang, descs) => {
        let newList = passives.map((passive) => {
            let newPassive = { ...passive };
            newPassive['description'] ??= {};
            newPassive['description'][lang] = {};
            return newPassive;
        });
        for (let passive of newList) {
            for (let desc of descs) {
                if (passive['id'] === desc['id']) {
                    passive['description'][lang] = desc;
                }
            }
        }
        return newList;
    },

    combineIdPassiveLists: (ids, map, passives) => {
        let newList = ids.map((id) => {
            let newId = { ...id };
            newId['passive'] = {};
            return newId;
        });
        for (let id of newList) {
            for (let entry of map) {
                if (id['id'] === entry['personalityID']) {
                    id['passive'] = entry;
                    for (let i of id['passive']['battlePassiveList']) {
                        i['passiveList'] = [];
                    }
                    for (let i of id['passive']['supporterPassiveList']) {
                        i['passiveList'] = [];
                    }
                }
            }
        }
        for (let id of newList) {
            for (let passive of passives) {
                for (let i of id['passive']['battlePassiveList']) {
                    if (i['passiveIDList'].includes(passive['id'])) {
                        i['passiveList'].push(passive);
                    }
                }
                for (let i of id['passive']['supporterPassiveList']) {
                    if (i['passiveIDList'].includes(passive['id'])) {
                        i['passiveList'].push(passive);
                    }
                }
            }
        }
        return newList;
    },

    combineIdSkillLists: (ids, skills) => {
        let newList = ids.map((id) => id);
        for (let id of newList) {
            for (let att in id['attributeList']) {
                for (let skill of skills) {
                    if (id['attributeList'][att]['skillId'] === skill['id']) {
                        id['attributeList'][att] = { ...id['attributeList'][att], ...skill };
                    }
                }
            }
        }
        return newList;
    }
};

module.exports = datasetCombiner;