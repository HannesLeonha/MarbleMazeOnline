function isGamepadButtonPressed(button) {
    if(button === "" || navigator.getGamepads()[0] === null) return 0;

    let direction = 0;

    let buttonType = button.charAt(0);
    let buttonIndex = +button.slice(1);

    for(let gamepad of navigator.getGamepads()) {
        if(gamepad === null) return;

        switch(buttonType) {
            case 'A': // Axis
                if(gamepad.axes === null || gamepad.axes.length <= buttonIndex) continue;
                direction += gamepad.axes[buttonIndex];

                break;
            case 'B': // Button
                if(gamepad.buttons === null || gamepad.buttons.length <= buttonIndex) continue;
                direction += gamepad.buttons[buttonIndex].value;

                break;
        }
    }

    return Math.min(Math.max(direction, -1), 1);
}

export { isGamepadButtonPressed };