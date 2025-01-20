import * as THREE from 'three';

import {GamepadOrbitControls} from "./systems/GamepadOrbitControls.js";
import {initializeProgressbar, updateLoadingScreen} from './systems/LoadingScreen.js';
import {getAmountOfResources, loadResources, resources} from "./systems/ResourceManager.js";
import {initializePhysics, updatePhysics} from "./game/PhysicsManager.js";
import {initializeGameManager, updateGameManager} from "./game/GameManager.js";

// Three
let threeRenderer, scene, container, camera, clock, controls, board;

async function initialize(onComplete) {
    initializeProgressbar(6 + (await getAmountOfResources()), onComplete);

    // Three JS
    threeRenderer = new THREE.WebGLRenderer({ antialias: true });
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
    threeRenderer.setPixelRatio(window.devicePixelRatio);
    threeRenderer.shadowMap.enabled = true;
    threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    scene = new THREE.Scene();

    container = document.querySelector('#threejsContainer');
    container.appendChild(threeRenderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight,0.01, 500);
    camera.position.set(6, 3, -6);

    clock = new THREE.Clock();

    // Mouse Control
    controls = new GamepadOrbitControls(camera, document.body);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI/2+0.05;
    updateLoadingScreen('Initialized Three JS');

    // Matter Engine
    initializePhysics();
    updateLoadingScreen('Initialized Matter JS');

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        threeRenderer.setSize(window.innerWidth, window.innerHeight);
    });
    updateLoadingScreen('Added listeners');

    // Load resources
    loadResources(() => {
        updateLoadingScreen('Loaded resources');
        initializeScene();
        updateLoadingScreen('Initialized scene');

        resources.image["cloud_skybox"].mapping = THREE.EquirectangularReflectionMapping;
        scene.background = resources.image["cloud_skybox"];
        updateLoadingScreen('Loaded Skybox');
    }, (progress) => { updateLoadingScreen(`Loaded resource: ${progress}`) }, () => {});
}

function initializeScene() {
    scene.add(initializeGameManager());

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    let sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.castShadow = true;
    sunLight.position.set(0.5 * 15, 15, 0.5 * 15);
    sunLight.shadow.camera.top = 15;
    sunLight.shadow.camera.right = 15;
    sunLight.shadow.camera.left = -15;
    sunLight.shadow.camera.bottom = -15;

    scene.add(sunLight);
}

// Animation
function animate() {
    const delta = clock.getDelta();

    // Game
    controls.update(delta);
    updateGameManager(delta, camera);

    // Engines
    updatePhysics(delta);
    threeRenderer.render(scene, camera);

    requestAnimationFrame(animate);
}

initialize(animate);