import {Vector2} from "three";

let heldKeys = [];

let pressedMouseButtons = 0;
const mousePosition = new Vector2(0, 0);

document.addEventListener('keyup', (event) => {
    heldKeys = heldKeys.filter((element) => element !== event.code);
});

document.addEventListener('keydown', (event) => {
    if(!heldKeys.includes(event.code)) heldKeys.push(event.code);
});

document.addEventListener('mousemove', (event) => {
    mousePosition.set(event.clientX, event.clientY);
    pressedMouseButtons = event.buttons;
});

document.addEventListener('mouseup', (event) => {
    pressedMouseButtons = event.buttons;
});

document.addEventListener('mousedown', (event) => {
    pressedMouseButtons = event.buttons;
});

document.addEventListener('blur', () => {
    heldKeys.splice(0, heldKeys.length);
    pressedMouseButtons = 0;
});

function isButtonPressed(button) {
    return heldKeys.includes(button);
}

function isMouseButtonPressed(buttonCode) {
    return pressedMouseButtons&buttonCode !== 0;
}

function areMouseButtonsPressed(binaryButton) {
    return pressedMouseButtons === binaryButton
}

// Implement value listener because bad
function addButtonListener(button, callback) {
    document.addEventListener("keydown", (event) => {
        if(event.code === button) {
            callback(1);
        }
    });
}

export {isButtonPressed, isMouseButtonPressed, areMouseButtonsPressed, addButtonListener, mousePosition};