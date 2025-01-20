import * as THREE from 'three';
import {resources} from "../../systems/ResourceManager.js";
import {floorThickness, matterScale, size, wallHeight, wallThickness} from "../../Constants.js";
import * as Matter from "matter-js";
import {Connection, connectionGrid, directions, initializeMaze, scrambleMaze} from "./MazeGenerator.js";
import {initializeBall, updateBall} from "./Ball.js";
import {initializeGoal} from "./Goal.js";
import {addPhysicsBodies, removePhysicsBodies, updateDebugView} from "../PhysicsManager.js";
import {boardTilt} from "../TiltHandler.js";

let wallMaterial;

let floorObject;
let mazeObject;
let mazeWallsObject;
let mazeWallPhysicsObjects = [];

function initializeGameMaze() {
    mazeObject = new THREE.Object3D();
    mazeWallsObject = new THREE.Object3D();

    mazeObject.add(mazeWallsObject);

    // Floor
    let maps = ["diff", "ao", "nor", "rough"];

    for(let key of maps) {
        resources.image["herringbone_pavement"][key].wrapS = THREE.RepeatWrapping;
        resources.image["herringbone_pavement"][key].wrapT = THREE.RepeatWrapping;
        resources.image["herringbone_pavement"][key].repeat.set(2, 2);
    }

    let boardMaterial = new THREE.MeshStandardMaterial({
        map: resources.image["herringbone_pavement"]["diff"],
        aoMap: resources.image["herringbone_pavement"]["ao"],
        normalMap: resources.image["herringbone_pavement"]["nor"],
        roughnessMap: resources.image["herringbone_pavement"]["rough"],
    });

    for(let key of maps) {
        resources.image["dark_wood"][key].wrapS = THREE.RepeatWrapping;
        resources.image["dark_wood"][key].wrapT = THREE.RepeatWrapping;
        resources.image["dark_wood"][key].repeat.set(2, 1);
    }

    wallMaterial = new THREE.MeshStandardMaterial({
        map: resources.image["dark_wood"]["diff"],
        aoMap: resources.image["dark_wood"]["ao"],
        normalMap: resources.image["dark_wood"]["nor"],
        roughnessMap: resources.image["dark_wood"]["rough"],
    });

    floorObject = new THREE.Mesh(new THREE.BoxGeometry(), boardMaterial);
    floorObject.castShadow = true;
    floorObject.receiveShadow = true;
    mazeObject.add(floorObject);

    // Maze
    changeMazeSize(size);

    return mazeObject;
}

function changeMazeSize() {
    initializeMaze();
    scrambleMaze();
    buildMaze();
}

function buildMaze() {
    floorObject.scale.set(size+wallThickness, floorThickness, size+wallThickness);

    if(mazeWallPhysicsObjects.length !== 0) removePhysicsBodies(mazeWallPhysicsObjects);
    mazeWallPhysicsObjects = [];
    mazeWallsObject.clear();

    generateOuterWalls();
    generateWalls();

    addPhysicsBodies(mazeWallPhysicsObjects);
    updateDebugView(mazeWallPhysicsObjects);
}

function generateOuterWalls() {
    for(let x = -1; x < 3; x+=2) {
        let box = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, size+wallThickness), wallMaterial);
        box.position.set(x*(size/2), wallHeight/2+floorThickness/2, 0);
        box.castShadow = true;
        box.receiveShadow = true;

        mazeWallsObject.add(box);
        mazeWallPhysicsObjects.push(Matter.Bodies.rectangle(x*(size/2) * matterScale, 0, wallThickness * matterScale, (size+wallThickness) * matterScale, {isStatic: true}));
    }

    for(let y = -1; y < 3; y+=2) {
        let box = new THREE.Mesh(new THREE.BoxGeometry(size+wallThickness, wallHeight, wallThickness), wallMaterial);
        box.position.set(0, wallHeight/2+floorThickness/2, y*(size/2));
        box.castShadow = true;
        box.receiveShadow = true;

        mazeWallsObject.add(box);
        mazeWallPhysicsObjects.push(Matter.Bodies.rectangle(0, y*(size/2) * matterScale, (size+wallThickness) * matterScale, wallThickness * matterScale, {isStatic: true}));
    }
}

function generateWalls() {
    // North - South Walls
    for(let y = 0; y < size; y++) {
        for(let x = 0; x < size-1; x++) {
            if(connectionGrid.filter(connection => connection.connectionIsAlongSameWall(new Connection(new THREE.Vector2(x, y), directions.RIGHT))).length !== 0) continue;

            let startingPosition = new THREE.Vector2(-size/2 + 1, -size/2 + 0.5);

            let box = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, 1+wallThickness), wallMaterial);
            box.position.set(startingPosition.x+x, wallHeight/2+floorThickness/2, startingPosition.y+y);
            box.castShadow = true;
            box.receiveShadow = true;

            mazeWallsObject.add(box);
            mazeWallPhysicsObjects.push(Matter.Bodies.rectangle((startingPosition.x+x) * matterScale, (startingPosition.y+y) * matterScale, wallThickness * matterScale, (1+wallThickness) * matterScale, {isStatic: true}));
        }
    }

    // West - East Walls
    for(let x = 0; x < size; x++) {
        for(let y = 0; y < size-1; y++) {
            if(connectionGrid.filter(connection => connection.connectionIsAlongSameWall(new Connection(new THREE.Vector2(x, y), directions.UP))).length !== 0) continue;

            let startingPosition = new THREE.Vector2(-size/2 + 0.5, -size/2 + 1);

            let box = new THREE.Mesh(new THREE.BoxGeometry(1+wallThickness, wallHeight, wallThickness), wallMaterial);
            box.position.set(startingPosition.x+x, wallHeight/2+floorThickness/2, startingPosition.y+y);
            box.castShadow = true;
            box.receiveShadow = true;

            mazeWallsObject.add(box);
            mazeWallPhysicsObjects.push(Matter.Bodies.rectangle((startingPosition.x+x) * matterScale, (startingPosition.y+y) * matterScale, (1+wallThickness) * matterScale, wallThickness * matterScale, {isStatic: true}));
        }
    }
}

function updateGameMaze(delta) {
    let targetRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(boardTilt.x, 0, boardTilt.y, "XYZ"));
    mazeObject.quaternion.rotateTowards(targetRotation, delta);
}

export {initializeGameMaze, updateGameMaze, changeMazeSize};