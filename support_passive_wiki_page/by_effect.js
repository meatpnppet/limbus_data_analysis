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
const effectKeywords = {
    '{{Icons|Pierce}}': [/pierce(?! dmg up)/i],
    '{{Icons|Slash}}': [/slash/i],
    '{{Icons|Blunt}}': [/blunt(?! dmg up)/i],
    '{{StatusEffect|Tremor}}': [/tremor/i],
    '{{StatusEffect|Defense Level Down}}': [/defense level down/i],
    '{{Icons|SP Healing}}': [/heals? .+ sp[\. ]/i],
    '{{StatusEffect|Clash Power Up}}': [/\+[0-9] clash power/i, /clash power \+[0-9]/i],
    '{{StatusEffect|Bleed}}': [/bleed/i],
    '{{StatusEffect|Poise}}': [/poise/i, /critical/i],
    '{{StatusEffect|Rupture}}': [/rupture/i],
    '{{StatusEffect|Sinking}}': [/sinking/i],
    '{{StatusEffect|Charge}}': [/(?<!highest |lowest )charge/i],
    '{{StatusEffect|Burn}}': [/burn/i],
    '{{StatusEffect|Ammo}}': [/ammo/i],
    '{{StatusEffect|Damage Up}}': [/deals? .*damage/i, /bonus damage/i, /damage up/i],
    '{{StatusEffect|Discard}}': [/discard/i],
    '{{StatusEffect|Offense Level Down}}': [/offense level down/i],
    '{{StatusEffect|Defense Power Up}}': [/defense power up/i, /defense skill final power/i],
    '{{StatusEffect|Fanatic}}': [/fanatic/i],
    '{{StatusEffect|Defense Level Up}}': [/defense level up/i],
    '{{StatusEffect|Clash Power Down}}': [/-[0-9] clash power/i, /lowers the clash/i],
    '{{StatusEffect|Power Up}}': [/\+[0-9] final power/i, /counter skill final power/i, /guard skill final power/i],
    '{{StatusEffect|Blunt DMG Up}}': [/blunt dmg up/i],
    '{{StatusEffect|Pierce DMG Up}}': [/pierce dmg up/i],
    '{{StatusEffect|Gloom DMG Up}}': [/gloom dmg up/i],
    '{{Icons|HP Healing}}': [/heals? [0-9]+ hp/i],
    '{{StatusEffect|Protection}}': [/takes? -.+ damage/i, /protection/i, /shield(?! damage)/i],
    '{{StatusEffect|Fragile}}': [/takes \+.+ damage/i],
    '{{StatusEffect|Haste}}': [/haste/i, /max speed/i],
    '{{StatusEffect|Attack Power Up}}': [/attack power up/i],
    '{{StatusEffect|K Corp Ampule}}': [/k corp ampule/i],
    '{{StatusEffect|Nails}}': [/nails/i],
    '{{StatusEffect|Talisman}}': [/talisman/i],
};
const targetKeywords = {
    'Low HP': [/lowest hp percentage/i, /least hp/i],
    'Least SP': [/least sp/i],
    'High Max HP': [/(highest|most) max hp/i],
    'Most SP': [/most sp/i, /highest sp /i],
    'Low Max HP': [/lowest max hp/i],
    'High Speed': [/highest speed/i, /fastest speed/i, /fastest ally/i],
    'Low Speed': [/lowest speed/i, /slowest(?! enemy)/i],
    'High {{StatusEffect|Charge|b}}': [/highest charge count/i, /most \{\{StatusEffect\|Charge\|b\}\} Count/i],
    'High {{StatusEffect|Bleed|d}}': [/highest sum of \{\{StatusEffect\|Bleed/i],
    'High {{StatusEffect|Poise|b}}': [/most \{\{StatusEffect\|Poise\|b\}\}/i, /most poise/i],
    'Low {{StatusEffect|Charge|b}}': [/least \{\{StatusEffect\|Charge\|b\}\}/i],
    '1st Deployed': [/first deployed/i, /#1 deployed/i, /#1 Sinner to be Deployed/i],
    'High {{StatusEffect|Aggro|r}}': [/highest \{\{StatusEffect\|Aggro\|b\}\}/i],
    'Low {{StatusEffect|Poise|b}}': [/least \{\{StatusEffect\|Poise\|b\}\}/i],
    'Last Deployed': [/deployed last/i],
    'Low {{StatusEffect|Ammo|r}}': [/least ammo/i],
    'High HP Disparity': [/greatest disparity of HP/i],
    'Team': [/when an ally hits/i],
    'High HP': [/most hp/i],
    'High {{StatusEffect|Tremor|b}}': [/most tremor count/i],
};

let data = {};
let output = `{{TabbedHeader
| subpages = 1
| rootpage = Identity Support Passives
| tab1 = Support Passives by Sinner
| tab2 = Support Passives by Effect}}

{| class="lcbtable2 mw-collapsible sortable" style="width:100%; margin:auto" cellpadding="3"
! Effect
! Target
! width="15%" | Identity
! width="10%" | Name
! width="40px" | Sin
! width="40px" | Type
! Description
`;

for (let s of sinner) {
    data[s] = [];
}

for (let x of DATA) {
    data[sinner[x['characterId'] - 1]].push(x);
}

for (let s of sinner) {
    // rows
    for (x of data[s]) {
        let passiveName = '';
        let uptie3 = '';
        let uptie4 = null;
        let sin = '';
        let count = 0;
        let type = '';
        let title = x['description']['EN']['title'];
        let effects = [];
        let targets = [];

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

        // Parse status effects
        for (let i in effectKeywords) {
            for (let j of effectKeywords[i]) {
                if (uptie4 && uptie4.search(j) !== -1) {
                    effects.push(i);
                    break;
                } else if (uptie3.search(j) !== -1) {
                    effects.push(i);
                    break;
                }
            }
        }

        // Parse targets
        for (let i in targetKeywords) {
            for (let j of targetKeywords[i]) {
                if (uptie4 && uptie4.search(j) !== -1) {
                    targets.push(i);
                    break;
                } else if (uptie3.search(j) !== -1) {
                    targets.push(i);
                    break;
                }
            }
        }

        output += template(s,
            title,
            passiveName,
            sin,
            count,
            type,
            uptie3,
            uptie4,
            effects,
            targets
        );
    }
}
output += '|}';

fs.writeFileSync('generated/support_passive_wiki_effects.txt', output, { encoding: 'utf-8', flag: 'w' });

function template(character, id, name, sin, count, type, uptie3, uptie4, effects, targets) {
    return `|-\n`
        + `| ${effects.join('')} || ${targets.join(' / ')}\n`
        + `| [[${id} ${character}]] || ${name}\n`
        + `| {{Icons|${affinity[sin]}}} x ${count} || ${type}\n`
        + `| `
        + ((uptie4 !== null)
            ? `'''Uptie III''': ${uptie3} <br/> '''Uptie IV''': ${uptie4}`
            : `${uptie3}`)
        + `\n`;
}