import {amountOfLevels} from "../Constants.js";
import {resetGame} from "./GameManager.js";

const timeElement = document.querySelector("#timer > p");
const levelElement = document.querySelector("#level > p");

const endBackdropElement = document.querySelector("#endBackdrop");
const winElement = document.querySelector("#winScreen");
const trueWinElement = document.querySelector("#trueWinScreen");
const trueWinTimeElement = document.querySelector("#trueWinScreen #winTime");
const winScreenPlayAgainButton = document.querySelectorAll(".playAgain");
const winScreenBackButton = document.querySelectorAll(".back");

function timeToString(time) {
    let zentiSekunden = Math.floor((time - Math.floor(time)) * 100);
    let sekunden = Math.floor(time)%60;
    let minuten = Math.floor(time/60);

    return `${minuten.toString().padStart(2, "0")}:${sekunden.toString().padStart(2, "0")}:${zentiSekunden.toString().padStart(2, "0")}`;
}

function setTime(seconds) {
    timeElement.innerHTML = `Time:&nbsp;${timeToString(seconds)}`;
}

function setLevelCompletion(levels) {
    levelElement.innerHTML = `Level:&nbsp;${levels}/${amountOfLevels}`;
}

function completeGame(time, trueEnding) {
    if(trueEnding) setTrueEndVisibility(true, time);
    else setWinVisibility(true);
    setBackdropVisibility(true);
}

function resetCompletion() {
    setBackdropVisibility(false);
    setWinVisibility(false);
    setTrueEndVisibility(false);
}

function setBackdropVisibility(visible) {
    endBackdropElement.style.opacity = visible ? 1 : 0;
    endBackdropElement.style.pointerEvents = visible ? "all" : "none";
}

function setWinVisibility(visible) {
    winElement.style.opacity = visible ? 1 : 0;
    winElement.style.pointerEvents = visible ? "all" : "none";
}

function setTrueEndVisibility(visible, time) {
    trueWinElement.style.opacity = visible ? 1 : 0;
    trueWinElement.style.pointerEvents = visible ? "all" : "none";

    trueWinTimeElement.innerText = timeToString(time);
}

winScreenPlayAgainButton.forEach(button => {
    button.onclick = function() {
        resetGame();
    }
});

winScreenBackButton.forEach(button => {
    button.onclick = function() {
        let location = window.location.href;

        while(location.charAt(location.length-1) !== '/') {
            location.slice(0, -1);
        }

        window.location = location;
    }
});

// setWinVisibility(true);

export {setTime, setLevelCompletion, completeGame, resetCompletion};