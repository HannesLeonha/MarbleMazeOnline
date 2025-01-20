import * as THREE from "three";
import {ballDiameter, floorThickness, size} from "../../Constants.js";
import {getBallPosition} from "./Ball.js";
import {ballSide} from "../GameManager.js";

let goalObject;

function initializeGoal() {
    goalObject = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        roughness: 0.5
    }));
    goalObject.castShadow = true;
    goalObject.receiveShadow = true;

    setGoalPosition();

    return goalObject;
}

function setGoalPosition() {
    goalObject.position.set((((ballSide ? -1 : 1) * size)/2 + (!ballSide ? -1/2 : 1/2)), ballDiameter/2+floorThickness/2, ((ballSide ? -1 : 1) * size)/2 + (!ballSide ? -1/2 : 1/2));
}

function checkGoalCollision() {
    return getBallPosition().clone().add(goalObject.position.clone().negate()).length() <= 0.2;
}

export {initializeGoal, setGoalPosition, checkGoalCollision};