import {addButtonListener, isButtonPressed, isMouseButtonPressed} from "./types/Keyboard.js";
import {isGamepadButtonPressed} from "./types/Gamepad.js";

import keybindings from './keybinds.json';
const inputs = keybindings.inputs;
const axis = keybindings.axis;

let types = {
    "get": {
        "keyboard": isButtonPressed,
        "mouse": isMouseButtonPressed,
        "gamepad": isGamepadButtonPressed
    },
    "listener": {
        "keyboard": addButtonListener,
        // "mouse": addMouseButtonListener,
        // "gamepad": addGamepadListener
    }
};

function getInput(name) {
    let filteredAxis = inputs.filter(o => o.name === name);
    if(filteredAxis.length !== 1) return false;

    let specifiedAxis = filteredAxis[0];

    for(const option of specifiedAxis.options) {
        if(types.get[option.type](option.key)) return true;
    }

    return false;
}

function addInputListener(name, callback) {
    let filteredInput = inputs.filter(o => o.name === name);
    if(filteredInput.length !== 1) return false;

    let specifiedInput = filteredInput[0];

    for(const option of specifiedInput.options) {
        types.listener[option.type](option.key, callback);
    }
}

function getAxisMagnitude(type, direction) {
    let result = types.get[type](direction);

    return typeof result === 'number' ? result : (result === true ? 1 : 0);
}

function getAxis(name) {
    let filteredAxis = axis.filter(o => o.name === name);
    if(filteredAxis.length !== 1) return 0;

    let specifiedAxis = filteredAxis[0];

    let direction = 0;

    for(const option of specifiedAxis.options) {
        direction += getAxisMagnitude(option.type, option.positive);
        direction -= getAxisMagnitude(option.type, option.negative);
    }

    return Math.min(Math.max(direction, -1), 1);
}

export { getInput, addInputListener, getAxis };