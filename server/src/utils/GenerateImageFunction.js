const {createCanvas} = require("canvas");
module.exports.generateImage = function generateImage(string) {
    const w = 100, h = 100;
    const usernameFirstLetters = string.toUpperCase().split(' ').filter(e => e).map(e => e[0]).join('')
    const canvas = createCanvas(w, h)
    const ctx = canvas.getContext('2d')

    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 255;
        color += ('00' + value.toString(16)).substr(-2);
    }

    ctx.fillStyle = color
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.font = '90px impact'
    ctx.fillText(usernameFirstLetters, w / 2, h / 2 + 35)
    ctx.fillStyle = '#000'
    ctx.strokeText(usernameFirstLetters, w / 2, h / 2 + 35)
    return  canvas.toBuffer('image/png')
}