import {completeGame, setTime} from "./UIManager.js";

let timerIsRunning = true;

let devChallengeTime = 186.61;
let time = 0;

function updateTimer(delta) {
    if(!timerIsRunning) return;

    time += delta;
    setTime(time);
}

function resetTimer() {
    time = 0;
    setTime(time);
}

function completeRun() {
    timerIsRunning = false;
    completeGame(time, time < devChallengeTime);
}

function setTimerIsRunning(bool) {
    timerIsRunning = bool;
}

export {updateTimer, resetTimer, completeRun, timerIsRunning, setTimerIsRunning, time};