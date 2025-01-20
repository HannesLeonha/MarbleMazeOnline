import * as THREE from "three";
import {resetTilt, updateBoardTilt} from "./TiltHandler.js";
import {changeMazeSize, initializeGameMaze, updateGameMaze} from "./maze/Maze.js";
import {initializeBall, resetBall, updateBall} from "./maze/Ball.js";
import {checkGoalCollision, initializeGoal, setGoalPosition} from "./maze/Goal.js";
import {initializeEnvironment} from "./environment/Environment.js";
import {amountOfLevels, setSize, size, startSize} from "../Constants.js";
import {completeRun, resetTimer, setTimerIsRunning, time, timerIsRunning, updateTimer} from "./Timer.js";
import {getAxis} from "../systems/input/InputHandler.js";
import {setLevelCompletion} from "./UIManager.js";

let gameObject;
let ballSide = false;

function initializeGameManager() {
    gameObject = new THREE.Object3D();

    gameObject.add(initializeEnvironment());

    let maze = initializeGameMaze();
    maze.add(initializeBall());
    maze.add(initializeGoal());
    gameObject.add(maze);

    resetTimer();
    setTimerIsRunning(false);
    setLevelCompletion(1);

    return gameObject;
}

function updateGameManager(delta, camera) {
    // Start Timer
    if(time === 0 && !timerIsRunning && (getAxis("Vertical") !== 0 || getAxis("Horizontal") !== 0)) setTimerIsRunning(true);

    // Update Components
    updateBoardTilt(delta, camera);

    updateGameMaze(delta);
    updateBall();
    updateTimer(delta);

    // Update Level when goal is hit
    if(checkGoalCollision()) {
        setSize(size+1);

        if(size-startSize >= amountOfLevels) {
            completeRun();
            setSize(size-1);
            resetTilt();
            resetBall();
            return;
        }

        setLevelCompletion(size-startSize+1);

        ballSide = !ballSide;

        changeMazeSize();
        resetBall();
        resetTilt();
        setGoalPosition();
    }
}

export {initializeGameManager, updateGameManager, ballSide};