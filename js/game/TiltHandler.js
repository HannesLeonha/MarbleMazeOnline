import * as THREE from 'three';
import {getAxis} from "../systems/input/InputHandler.js";
import {maxTiltRange, tiltSensitivity} from "../Constants.js";
import {timerIsRunning} from "./Timer.js";

let boardTilt = new THREE.Vector2();

function updateBoardTilt(delta, camera) {
    let verticalAxis = getAxis("Vertical");
    let horizontalAxis = getAxis("Horizontal");

    if(Math.abs(verticalAxis) > 0.2) verticalAxis = (verticalAxis + ((verticalAxis>0) ? -0.2 : 0.2)) / 0.8;
    else verticalAxis = 0;

    if(Math.abs(horizontalAxis) > 0.2) horizontalAxis = (horizontalAxis + ((horizontalAxis>0) ? -0.2 : 0.2)) / 0.8;
    else horizontalAxis = 0;

    let cameraDirection = new THREE.Vector2(camera.position.x, camera.position.z).normalize();
    let cameraDirectionRotated = cameraDirection.clone().rotateAround(new THREE.Vector2(), Math.PI/2);

    let input = new THREE.Vector2();
    input.add(cameraDirection.multiplyScalar(horizontalAxis));
    input.add(cameraDirectionRotated.multiplyScalar(verticalAxis));
    input.multiplyScalar(delta * tiltSensitivity);

    if(!timerIsRunning) return;

        boardTilt.add(input);
    boardTilt.clampLength(0, maxTiltRange);
}

function resetTilt() {
    boardTilt.set(0, 0);
}

export {boardTilt, updateBoardTilt, resetTilt};