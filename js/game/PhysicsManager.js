import * as Matter from "matter-js";
import {matterScale, tiltStrength} from "../Constants.js";
import {boardTilt} from "./TiltHandler.js";
import {time, timerIsRunning} from "./Timer.js";

let matterRunning = true;
let engine, matterRenderer;

function initializePhysics(webDebug = false) {
    engine = Matter.Engine.create();
    engine.gravity.scale = matterScale * tiltStrength;

    document.addEventListener("focus", () => {matterRunning = true;});
    document.addEventListener("blur", () => {matterRunning = false;});

    if(webDebug) {
        matterRenderer = Matter.Render.create({
            element: document.body,
            engine: engine
        });

        Matter.Render.run(matterRenderer);
    }
}

function updateDebugView(bodies) {
    if(!matterRenderer) return;
    Matter.Render.lookAt(matterRenderer, bodies);
}

function updatePhysics(delta) {
    changeGravity(Matter.Vector.create(-boardTilt.y, boardTilt.x));

    if(matterRunning) Matter.Engine.update(engine, delta);
}

function addPhysicsBodies(bodies) {
    if(bodies.constructor !== Array) bodies = [bodies];

    Matter.Composite.add(engine.world, bodies);
}

function removePhysicsBodies(bodies) {
    if(bodies.constructor !== Array) bodies = [bodies];
    Matter.Composite.remove(engine.world, bodies);
}

function changeGravity(vector) {

    engine.gravity.x = vector.x;
    engine.gravity.y = vector.y;
}

export {initializePhysics, updateDebugView, updatePhysics, addPhysicsBodies, removePhysicsBodies};