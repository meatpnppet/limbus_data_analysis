const { DATA } = require('./generated/data');
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
let output = '';


for (let s of sinner) {
    data[s] = [];
}

for (let x of DATA) {
    data[sinner[x['characterId'] - 1]].push(x);
}

for (let s of sinner) {
    output += `== ${s} ==\n`;
    output += `{| class="lcbtable2 mw-collapsible ` + (COLLAPSED ? `mw-collapsed ` : ``) + `sortable" `;
    output += `style="width:100%; margin:auto" cellpadding="3"\n`;
    output += `! width="15%" | Identity \n`;
    output += `! width="10%" | Name \n`;
    output += `! width="40px" | Sin \n`;
    output += `! width="40px" | Type \n`;
    output += `! Description\n`;
    // rows
    for (x of data[s]) {
        let passiveName = '';
        let uptie3 = '';
        let uptie4 = null;
        let sin = '';
        let count = 0;
        let type = '';
        let title = x['desc']['EN']['title'];

        for (y of x['passive']['supporterPassiveList']) {
            if (y['level'] === 3) {
                passiveName = y['passiveList'][0]['EN']['name'];
                uptie3 = y['passiveList'][0]['EN']['desc'];
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
                    uptie4 = y['passiveList'][0]['EN']['desc'];
                }
            }
        }

        uptie3 = uptie3.replaceAll('\n', '. ');
        uptie3 = uptie3.replaceAll(/<[^>]+>/g, '');
        // Change bullet points into sentence breaks
        uptie3 = uptie3.replaceAll(' - ', '. ');
        // Fix weird periods
        uptie3 = uptie3.replaceAll('..', '.');
        uptie3 = uptie3.replaceAll(' .', '.');
        // Format status effects
        uptie3 = uptie3.replaceAll(/\[(Offense Level Down) \]/g, '{{StatusEffect|$1|b}}');
        uptie3 = uptie3.replaceAll(/\[([^\]]+)\]/g, '{{StatusEffect|$1|b}}');

        if (uptie4) {
            uptie4 = uptie4.replaceAll('\n', '. ');
            uptie4 = uptie4.replaceAll(/<[^>]+>/g, '');
            // Change bullet points into sentence breaks
            uptie4 = uptie4.replaceAll(' - ', '. ');
            // Fix weird periods
            uptie4 = uptie4.replaceAll('..', '.');
            uptie4 = uptie4.replaceAll(' .', '.');
            // Format status effects
            uptie4 = uptie4.replaceAll(/\[(Offense Level Down) \]/g, '{{StatusEffect|$1|b}}');
            uptie4 = uptie4.replaceAll(/\[([^\]]+)\]/g, '{{StatusEffect|$1|b}}');
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
    output += `|}\n`;
}

fs.writeFileSync('generated/support_passive_wiki.txt', output, { encoding: 'utf-8', flag: 'w' });


function template(character, id, name, sin, count, type, uptie3, uptie4) {
    return `|-\n`
        + `| [[${id} ${character}]] `
        + `|| ${name} `
        + `|| {{Icons|${affinity[sin]}}} x ${count} `
        + `|| ${type} `
        + ((uptie4 !== null) ? `|| '''Uptie III''': ${uptie3} ` : `|| ${uptie3} `)
        + ((uptie4 !== null) ? `<br/> '''Uptie IV''': ${uptie4}` : ``)
        + `\n`;
}