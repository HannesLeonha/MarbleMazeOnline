import {amountOfLevels} from "../Constants.js";

const timeElement = document.querySelector("#timer > p");
const levelElement = document.querySelector("#level > p");

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

export {setTime, setLevelCompletion};