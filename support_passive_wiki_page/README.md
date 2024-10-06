# Support Passive Wiki Page

Scripts for generating the [Identity Support Passives](https://limbuscompany.wiki.gg/wiki/Identity_Support_Passives) and [Identity Support Passives by Effect](https://limbuscompany.wiki.gg/wiki/Identity_Support_Passives/Support_Passives_by_Effect) pages on the [Limbus Company Wiki](https://limbuscompany.wiki.gg/wiki/Limbus_Company_Wiki). This was a side project I started because I needed a reference for support passives for solo runs.

Both scripts require `generated/data.js` and `generated/keywords.js` to exist to generate the pages. See the [dataset builder project](../dataset_builder/README.md) for more details.

## main.js

Run `node main.js` to generate the [Identity Support Passives](https://limbuscompany.wiki.gg/wiki/Identity_Support_Passives) page. This writes to `generated/support_passive_wiki.txt`.

## by_effect.js

Run `node by_effect.js` to generate the [Identity Support Passives by Effect](https://limbuscompany.wiki.gg/wiki/Identity_Support_Passives/Support_Passives_by_Effect) page. This writes to `generated/support_passive_wiki_effects.txt`.