import * as THREE from "three/webgpu";
import { noise } from '@chriscourses/perlin-noise';

let environmentObject;
let width = 1000;
let height = 1000;

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

function toRGBA(d) {
    const l = d.length;
    const rgba = {};
    if (d.slice(0, 3).toLowerCase() === 'rgb') {
        d = d.replace(' ', '').split(',');
        rgba[0] = parseInt(d[0].slice(d[3].toLowerCase() === 'a' ? 5 : 4), 10);
        rgba[1] = parseInt(d[1], 10);
        rgba[2] = parseInt(d[2], 10);
        rgba[3] = d[3] ? parseFloat(d[3]) : -1;
    } else {
        if (l < 6) d = parseInt(String(d[1]) + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? String(d[4]) + d[4] : ''), 16);
        else d = parseInt(d.slice(1), 16);
        rgba[0] = (d >> 16) & 255;
        rgba[1] = (d >> 8) & 255;
        rgba[2] = d & 255;
        rgba[3] = l === 9 || l === 5 ? Math.round((((d >> 24) & 255) / 255) * 10000) / 10000 : -1;
    }
    return rgba;
}

function blend(fromColor, toColor, percentage = 0.5) {
    fromColor = fromColor.trim();
    toColor = toColor.trim();
    const b = percentage < 0;
    percentage = b ? percentage * -1 : percentage;
    const f = toRGBA(fromColor);
    const t = toRGBA(toColor);
    if (toColor[0] === 'r') {
        return 'rgb' + (toColor[3] === 'a' ? 'a(' : '(') +
            Math.round(((t[0] - f[0]) * percentage) + f[0]) + ',' +
            Math.round(((t[1] - f[1]) * percentage) + f[1]) + ',' +
            Math.round(((t[2] - f[2]) * percentage) + f[2]) + (
                f[3] < 0 && t[3] < 0 ? '' : ',' + (
                    f[3] > -1 && t[3] > -1
                        ? Math.round((((t[3] - f[3]) * percentage) + f[3]) * 10000) / 10000
                        : t[3] < 0 ? f[3] : t[3]
                )
            ) + ')';
    }

    return '#' + (0x100000000 + ((
            f[3] > -1 && t[3] > -1
                ? Math.round((((t[3] - f[3]) * percentage) + f[3]) * 255)
                : t[3] > -1 ? Math.round(t[3] * 255) : f[3] > -1 ? Math.round(f[3] * 255) : 255
        ) * 0x1000000) +
        (Math.round(((t[0] - f[0]) * percentage) + f[0]) * 0x10000) +
        (Math.round(((t[1] - f[1]) * percentage) + f[1]) * 0x100) +
        Math.round(((t[2] - f[2]) * percentage) + f[2])
    ).toString(16).slice(f[3] > -1 || t[3] > -1 ? 1 : 3);
}


function environmentHeight(x, y) {
    let hillSizeQuotient = 80;

    x /= hillSizeQuotient;
    y /= hillSizeQuotient;

    let noiseTerrain = Math.pow((1 * noise(1 * x, 1 * y)
        + 0.5 * noise(2 * x, 2 * y)
        + 0.25 * noise(4 * x, 4 * y)) / (1 + 0.5 + 0.25), 1.72);

    let center = {x: width/2/hillSizeQuotient, y: height/2/hillSizeQuotient};
    let distance = Math.sqrt(Math.pow(x-center.x, 2) + Math.pow(y-center.y, 2));
    let maxDistance = 500/hillSizeQuotient;

    let centerFalloff = easeInOutSine(distance/maxDistance);

    if(distance > maxDistance) {
        centerFalloff = 1;
    }

    return (noiseTerrain * centerFalloff) / 0.8;
}

function environmentColor(x, y) {
    let height = environmentHeight(x, y);

    let heightVariation = (noise(x/2, y/2) - 0.5) * 0.2;
    height += heightVariation;

    let colorMap = [
        {position: 0, color: "rgb(45, 206, 20, 255)"},
        {position: 0.1, color: "rgb(35, 252, 46, 255)"},
        {position: 0.3, color: "rgb(94, 94, 94, 255)"},
        {position: 0.5, color: "rgb(68, 68, 68, 255)"},
        {position: 0.8, color: "rgb(254, 254, 254, 255)"}
    ]

    for(let i = 0; i < colorMap.length-1; i++) {
        if(height >= colorMap[i].position && height <= colorMap[i+1].position) {
            return blend(colorMap[i].color, colorMap[i+1].color, (height - colorMap[i].position) / (colorMap[i+1].position - colorMap[i].position));
        }
    }
}

function paintCanvas(canvas, paintFunction) {
    let ctx = canvas.getContext("2d");

    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            ctx.fillStyle = paintFunction(x, y);
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

function initializeEnvironment() {
    // Canvas
    let colorMapCanvas = document.getElementById("colorMap");
    let heightMapCanvas = document.getElementById("heightMap");

    colorMapCanvas.width = width;
    colorMapCanvas.height = height;
    heightMapCanvas.width = width;
    heightMapCanvas.height = height;

    paintCanvas(colorMapCanvas, environmentColor);
    paintCanvas(heightMapCanvas, (x, y) => {
        let height = environmentHeight(x, y);
        let hexString = decimalToHex(Math.round(height*255), 2);

        return `#${hexString}${hexString}${hexString}`;
    });

    // Plane
    const geometry = new THREE.PlaneGeometry(200, 200, width, height);
    geometry.rotateX( - Math.PI * 0.5 );

    const terrain = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
        map: new THREE.CanvasTexture(colorMapCanvas),
        displacementMap: new THREE.CanvasTexture(heightMapCanvas),
        displacementScale: 30
    }));
    terrain.receiveShadow = true;
    terrain.castShadow = true;
    terrain.position.y = -5;

    console.log("Hallo_Hannes_ibins_lg_duwastweribin_hannes_durfte_das_nicht_entfernen (づ￣ 3￣)づ");

    return terrain;
}

export {initializeEnvironment};