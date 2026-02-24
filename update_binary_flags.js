const fs = require('fs');
const path = require('path');

function replaceInBinary(filePath, oldPattern, newFlag) {
    const data = fs.readFileSync(filePath);
    const oldBuffer = Buffer.from(oldPattern);

    const index = data.indexOf(oldBuffer);
    if (index === -1) {
        console.log(`✗ Pattern not found in ${path.basename(filePath)}`);
        return;
    }

    // Match lengths exactly
    let newPadded = newFlag;
    if (newFlag.length < oldPattern.length) {
        newPadded = newFlag.padEnd(oldPattern.length, ' ');
    } else if (newFlag.length > oldPattern.length) {
        console.error(`ERROR: New flag "${newFlag}" (${newFlag.length}) is longer than old pattern (${oldPattern.length})`);
        return;
    }

    const newBuffer = Buffer.from(newPadded);
    data.set(newBuffer, index);
    fs.writeFileSync(filePath, data);
    console.log(`✓ Updated ${path.basename(filePath)} at index ${index}`);
}

// Flag 5: JPEG EXIF
replaceInBinary(
    './flag5/challenge.jpg',
    'ARTIMAS{3x1f_m3t4d4t4_r3v34l3d}', // FROM
    'ARTIMAS{location_identified_correctly}' // TO
);

// Flag 9: PDF Metadata
replaceInBinary(
    './flag9/challenge.pdf',
    'ARTIMAS{pdf_m3t4_d4t4_f0un}', // FROM
    'ARTIMAS{metadata_tells_all}' // TO
);
