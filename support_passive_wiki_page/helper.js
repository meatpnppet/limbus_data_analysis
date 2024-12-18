const { KEYWORDS } = require('../generated/keywords.js');

const buffs = [
    'Poise',
    'Charge',
    'Aggro',
    'Ammo',
    'Haste',
    'Insight',
    'Defense Level Up',
    'Blooming Thorn',
    'Gloom DMG Up',
    'Damage Up',
];

const debuffs = [
    'Bleed',
    'Sinking',
    'Butterfly',
    'Tremor',
    'Burn',
    'Rupture',
    'Offense Level Down',
    'Defense Level Down',
];

const helper = {
    cleanUptieDesc: (desc) => {
        let newDesc = desc;
        newDesc = newDesc.replaceAll('\n', '. ');
        newDesc = newDesc.replaceAll(/<Bloodfiend>/g, '[Bloodfiend]');
        newDesc = newDesc.replaceAll(/<[^>]+>/g, '');
        newDesc = newDesc.replaceAll(/\[Bloodfiend\]/g, '<Bloodfiend>'); // I'll fix it later
        newDesc = newDesc.replaceAll(/^- /g, '');
        // Change bullet points into sentence breaks
        newDesc = newDesc.replaceAll(' - ', '. ');
        // Fix weird periods
        newDesc = newDesc.replaceAll('..', '.');
        newDesc = newDesc.replaceAll(' .', '.');
        // Format status effects
        for (let keyword of KEYWORDS['EN']) {
            newDesc = newDesc.replaceAll(`[${keyword['id']}]`, `[${keyword['name'].trim()}]`);
        }
        for (const b of buffs) {
            const regex = new RegExp(`\\\[(${b})\\\]`, 'g');
            newDesc = newDesc.replaceAll(regex, '{{StatusEffect|$1|b}}');
        }
        for (const d of debuffs) {
            const regex = new RegExp(`\\\[(${d})\\\]`, 'g');
            newDesc = newDesc.replaceAll(regex, '{{StatusEffect|$1|d}}');
        }
        newDesc = newDesc.replaceAll(`Blooming Thorn`, `Blooming Thorn (Ally)`);
        return newDesc;
    }
};

module.exports = helper;