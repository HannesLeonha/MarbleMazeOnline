// Physics
const matterScale = 100;
const tiltStrength = 11;

// Controls
const controlsPanSpeed = 1;

// Maze
const floorThickness = 0.1;
const wallThickness = 0.1;
const wallHeight = 0.5;
const tiltSensitivity = 0.8;
const maxTiltRange = 0.25;

// Ball
const ballDiameter = 0.6;

// Game
const startSize = 5;
const amountOfLevels = 12;
let size = startSize;

function setSize(newSize) {
    size = newSize;
}

export {matterScale, tiltStrength, controlsPanSpeed, size, floorThickness, wallThickness, wallHeight, ballDiameter, startSize, amountOfLevels, setSize, tiltSensitivity, maxTiltRange};