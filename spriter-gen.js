const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas((70 * 16), 70);
const ctx = canvas.getContext("2d");

let recurs = (files, callb, index = 0, x = 0) => {
    if (files[index]) {
        loadImage("./images/"+files[index]).then((image) => {
            ctx.drawImage(image, x, 0, 70, 70);
            recurs(files, callb, index + 1, x + 70);
        }).catch(() => {
            recurs(files, callb, index + 1, x + 70);
        });
    } else {
        callb({pic: canvas.toDataURL(), files});
    }
}

module.exports.getSprite = recurs;