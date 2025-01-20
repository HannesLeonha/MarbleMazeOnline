import * as THREE from 'three';
import {size} from "../../Constants.js";

const directions = {
    "UP": new THREE.Vector2(0, 1),
    "DOWN": new THREE.Vector2(0, -1),
    "LEFT": new THREE.Vector2(-1, 0),
    "RIGHT": new THREE.Vector2(1, 0)
}

class Connection {
    constructor(point, direction) {
        this.startPoint = point;
        this.direction = direction;
    }

    endPoint() {
        return this.startPoint.clone().add(this.direction);
    }

    connectionIsAlongSameWall(connection) {
        return (this.startPoint.equals(connection.startPoint) && this.direction.equals(connection.direction)) ||
            (this.endPoint().equals(connection.startPoint) && connection.endPoint().equals(this.startPoint));
    }
}

const origin = new THREE.Vector2(0, 0);
let connectionGrid = [];

function initializeMaze() {
    origin.set(0, 0);
    connectionGrid = [];

    for(let x = size-1; x > 0; x--) {
        for(let y = size-1; y >= 0; y--) {
            connectionGrid.push(new Connection(new THREE.Vector2(x, y), directions.LEFT));
        }
    }

    for(let y = size-1; y > 0; y--) {
        connectionGrid.push(new Connection(new THREE.Vector2(0, y), directions.DOWN));
    }
}

function originShiftMaze() {
    let startPoint = origin.clone();

    let availableDirections = [];

    if(origin.y !== size-1) availableDirections.push(directions.UP);
    if(origin.y !== 0) availableDirections.push(directions.DOWN);
    if(origin.x !== 0) availableDirections.push(directions.LEFT);
    if(origin.x !== size-1) availableDirections.push(directions.RIGHT);

    let direction = availableDirections[Math.floor(Math.random()*availableDirections.length)];
    origin.add(direction);

    let newConnection = new Connection(startPoint, direction);

    connectionGrid = connectionGrid.filter(connection => !connection.startPoint.equals(origin));

    connectionGrid.push(newConnection);
}

function scrambleMaze(instant = true, callback = (()=>{})) {
    for(let i = 0; i < size * size * 10; i++) {
        originShiftMaze();
        callback();
    }
}

export {connectionGrid, Connection, directions, initializeMaze, originShiftMaze, scrambleMaze};