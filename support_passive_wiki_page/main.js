const { DATA } = require('../generated/data.js');
const helper = require('./helper.js');
const fs = require('node:fs');

const sinner = ['Yi Sang', 'Faust', 'Don Quixote', 'Ryōshū', 'Meursault', 'Hong Lu', 'Heathcliff', 'Ishmael', 'Rodion', 'Sinclair', 'Outis', 'Gregor'];
const affinity = {
    'CRIMSON': 'Wrath',
    'SCARLET': 'Lust',
    'AMBER': 'Sloth',
    'SHAMROCK': 'Gluttony',
    'AZURE': 'Gloom',
    'INDIGO': 'Pride',
    'VIOLET': 'Envy'
};
const COLLAPSED = false;

let data = {};
let output = `{{For|a similar list of E.G.O Passives|E.G.O Passives}}`;

for (let s of sinner) {
    data[s] = [];
}

for (let x of DATA) {
    data[sinner[x['characterId'] - 1]].push(x);
}

for (let s of sinner) {
    output += `\n\n== ${s} ==\n`;
    output += `{| class="lcbtable2 mw-collapsible ` + (COLLAPSED ? `mw-collapsed ` : ``) + `sortable" `;
    output += `style="width:100%; margin:auto" cellpadding="3"\n`;
    output += `! width="15%" | Identity\n`;
    output += `! width="20%" | Name\n`;
    output += `! width="80px" | Conditions\n`;
    output += `! Description\n`;
    // rows
    for (x of data[s]) {
        let passiveName = '';
        let uptie3 = '';
        let uptie4 = null;
        let sin = '';
        let count = 0;
        let type = '';
        let title = x['description']['EN']['title'];

        for (y of x['passive']['supporterPassiveList']) {
            if (y['level'] === 3) {
                passiveName = y['passiveList'][0]['description']['EN']['name'];
                uptie3 = y['passiveList'][0]['description']['EN']['desc'];
                if (y['passiveList'][0]['attributeStockCondition']) {
                    sin = y['passiveList'][0]['attributeStockCondition'][0]['type'];
                    count = y['passiveList'][0]['attributeStockCondition'][0]['value'];
                    type = 'Owned';
                } else if (y['passiveList'][0]['attributeResonanceCondition']) {
                    sin = y['passiveList'][0]['attributeResonanceCondition'][0]['type'];
                    count = y['passiveList'][0]['attributeResonanceCondition'][0]['value'];
                    type = 'Res';
                }
            } else if (y['level'] === 4) {
                if (y['passiveList'].length > 0) {
                    uptie4 = y['passiveList'][0]['description']['EN']['desc'];
                }
            }
        }

        title = title.replaceAll('\n', ' ');
        uptie3 = helper.cleanUptieDesc(uptie3);
        if (uptie4) {
            uptie4 = helper.cleanUptieDesc(uptie4);
        }

        // Fix Walpurgis 4 EGO ID names
        title = title.replaceAll(':: ', '::');

        // Fix Rosespanner Rodion's name
        title = title.replaceAll('Rosespanner Workshop Rep', 'Rosespanner Workshop Rep.');

        output += template(s,
            title,
            passiveName,
            sin,
            count,
            type,
            uptie3,
            uptie4
        );
    }
    output += `|}`;
}
output += `\n[[Category:Lists]]`;

fs.writeFileSync('generated/support_passive_wiki.txt', output, { encoding: 'utf-8', flag: 'w' });

function template(character, id, name, sin, count, type, uptie3, uptie4) {
    return `|-\n`
        + `| [[${id} ${character}]] || {{SkillGrad|def|${name}}}\n`
        + `| {{Icons|${affinity[sin]}}} x ${count} ${type}\n`
        + `| `
        + ((uptie4 !== null)
            ? `'''Uptie III''': ${uptie3} <br/> '''Uptie IV''': ${uptie4}`
            : `${uptie3}`)
        + `\n`;
}