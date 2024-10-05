const { KEYWORDS } = require('../generated/keywords.js');

const helper = {
    cleanUptieDesc: (desc) => {
        let newDesc = desc;
        newDesc = newDesc.replaceAll('\n', '. ');
        newDesc = newDesc.replaceAll(/<[^>]+>/g, '');
        newDesc = newDesc.replaceAll(/^- /g, '');
        // Change bullet points into sentence breaks
        newDesc = newDesc.replaceAll(' - ', '. ');
        // Fix weird periods
        newDesc = newDesc.replaceAll('..', '.');
        newDesc = newDesc.replaceAll(' .', '.');
        // Format status effects
        for (let keyword of KEYWORDS['EN']) {
            newDesc = newDesc.replaceAll(`[${keyword['id']}]`, `[${keyword['name']}]`);
        }
        newDesc = newDesc.replaceAll(/\[(Offense Level Down) \]/g, '{{StatusEffect|$1|b}}');
        newDesc = newDesc.replaceAll(/\[([^\]]+)\]/g, '{{StatusEffect|$1|b}}');
        return newDesc;
    }
};

module.exports = helper;