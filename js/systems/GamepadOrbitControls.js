import {OrbitControls} from 'three/examples/jsm/Addons.js';
import {controlsPanSpeed} from "../Constants.js";
import {getAxis} from "./input/InputHandler.js";

class GamepadOrbitControls extends OrbitControls {
    constructor(object, domElement = null) {
        super(object, domElement);
    }

    update(deltaTime = null) {
        let verticalAxis = getAxis("LookVertical");
        let horizontalAxis = getAxis("LookHorizontal");

        if(Math.abs(verticalAxis) > 0.2) verticalAxis = (verticalAxis + (verticalAxis>0 ? -0.2 : 0.2)) / 0.8;
        else verticalAxis = 0;

        if(Math.abs(horizontalAxis) > 0.2) horizontalAxis = (horizontalAxis + (horizontalAxis>0 ? -0.2 : 0.2)) / 0.8;
        else horizontalAxis = 0;

        this._rotateUp(verticalAxis * deltaTime * controlsPanSpeed);
        this._rotateLeft(horizontalAxis * deltaTime * controlsPanSpeed);

        return super.update(deltaTime);
    }
}

export {GamepadOrbitControls};