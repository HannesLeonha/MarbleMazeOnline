import * as THREE from "three";
import * as Matter from "matter-js";
import {ballDiameter, floorThickness, matterScale, size} from "../../Constants.js";
import {addPhysicsBodies} from "../PhysicsManager.js";
import {ballSide} from "../GameManager.js";
import {timerIsRunning} from "../Timer.js";

let ballMesh;
let physicsBall;

function initializeBall() {
    ballMesh = new THREE.Mesh(new THREE.SphereGeometry(ballDiameter/2), new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.4
    }));

    ballMesh.receiveShadow = true;
    ballMesh.castShadow = true;

    physicsBall = Matter.Bodies.circle(0, 0, ballDiameter/2 * matterScale);
    physicsBall.frictionAir = 3;
    addPhysicsBodies(physicsBall);
    resetBall();

    return ballMesh;
}

function updateBall() {
    if(timerIsRunning) ballMesh.position.set(physicsBall.position.x / matterScale, ballDiameter/2+floorThickness/2, physicsBall.position.y / matterScale);

    if(ballIsOutsideOfMaze()) {
        resetBall();
    }
}

function resetBall() {
    setBallPosition(new THREE.Vector2((((!ballSide ? -1 : 1) * size)/2 + (ballSide ? -1/2 : 1/2)), ((!ballSide ? -1 : 1) * size)/2 + (ballSide ? -1/2 : 1/2)));
}

function setBallPosition(vector) {
    if(!physicsBall) return;

    Matter.Body.setPosition(physicsBall, Matter.Vector.create(vector.x * matterScale, vector.y * matterScale));
    Matter.Body.setVelocity(physicsBall, Matter.Vector.create(0, 0));

    updateBall();
}

function getBallPosition() {
    updateBall();
    return ballMesh.position.clone();
}

function ballIsOutsideOfMaze() {
    return (Math.abs(ballMesh.position.x) > size/2) ||
        (Math.abs(ballMesh.position.z) > size/2);
}

export {initializeBall, updateBall, resetBall, getBallPosition, ballIsOutsideOfMaze}