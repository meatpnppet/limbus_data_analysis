# Dataset Builder

A project for building a dataset of all sinner IDs, skills, and passives. This is the backbone of the [wiki page project](../support_passive_wiki_page/README.md) as well as another project I am working on.

## main.js

Run `node main.js` to build the main dataset. By default, it reads from the `json` folder (which should only contain JSON asset files) and writes to `generated/data.js`. There are some options that can be run:

```
--output=[filename]: Change output file (default: generated/data.js)
--input=[folder]: Change JSON input folder (default: json)
-w: Output JSON file with whitespace
-d: Dry run, or run without writing to file
--clean=[true/false]: Clean extra properties in output (default: true)
```

## make_tag_file.js

Run `node make_tag_file.js` to build the set of keywords. This reads from the `json` folder and writes to `generated/keywords.js`. There are currently no options that can be run. The main script leaves in skill tags that would be replaced in game with translated keywords. The keyword file is necessary for the [wiki page project](../support_passive_wiki_page/README.md) alongside the main dataset.