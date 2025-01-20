let loadingScreenElement = document.getElementById('loading');
let progressMessageElement = document.querySelector('#progress');
let progressBarElement = document.getElementById('progressBar');
let progressBarLabelElement = document.querySelector('label[for="progressBar"]');
let onCompleteCallback;

function initializeProgressbar(max, onComplete) {
    progressBarElement.max = max;
    onCompleteCallback = onComplete;
}

function updateLoadingScreen(progressMessage) {
    progressBarElement.value = +progressBarElement.value + 1;

    if(progressBarElement.value === progressBarElement.max) {
        completeLoadingScreen();
        return;
    }

    progressMessageElement.innerText = progressMessage;
    progressBarLabelElement.innerText = `${Math.round(100*((+progressBarElement.value)/(+progressBarElement.max)))}%`;
}

function completeLoadingScreen() {
    loadingScreenElement.remove();
    onCompleteCallback();
}

export { initializeProgressbar, updateLoadingScreen };