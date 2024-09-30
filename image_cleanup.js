const fs = require('node:fs');

const folder = 'id_art';

try {
    const subfolders = fs.readdirSync(folder);
    for (const subfolder of subfolders) {
        fs.rmSync(`${folder}/${subfolder}/EGO`, { 'force': true, 'recursive': true });
        const idFolders = fs.readdirSync(`${folder}/${subfolder}/Identities`);
        for (const idFolder of idFolders) {
            const files = fs.readdirSync(`${folder}/${subfolder}/Identities/${idFolder}`);
            for (const file of files) {
                if (!file.includes('profile.png')) {
                    fs.rmSync(`${folder}/${subfolder}/Identities/${idFolder}/${file}`, { 'force': true });
                }
            }
        }
    }
} catch (err) {
    console.log(err);
}
