import { TextureLoader } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const textureLoader = new TextureLoader();

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
gltfLoader.setDRACOLoader(dracoLoader);

function loadTexture(filepath, fileExtension, onLoad, onError) {
    textureLoader.load(filepath, onLoad, onError);
}

function loadModel(filepath, fileExtension, onLoad, onError) {
    gltfLoader.load(filepath, onLoad, onError);
}

const resources = {};

const resourceTypes = [
    {
        'folderName': 'images',
        'name': 'image',
        'supportedCodecs': ['png', 'jpg', 'webp', 'bmp', 'jpeg', 'gif', 'dds'],
        'fileLoader': loadTexture
    },
    {
        'folderName': 'models',
        'name': 'model',
        'supportedCodecs': ['glb', 'gltf'], // TODO: Add support for fbx, obj, stl
        'fileLoader': loadModel
    }
];

const fetchPath = 'http://localhost:3000/resources';
const fetchInfo = {method: 'POST', mode: 'cors', headers: {'Content-Type': 'application/json', 'path': 'path'}};

function countRecursiveLoadableFiles(folderContent, supportedCodecs) {
    let counter = 0;

    for(const element of folderContent['files']) {
        if(typeof element == 'string') {
            const path = element.split('/');
            const fullFileName = path[path.length-1];
            const fileExtension = fullFileName.split('.')[1];
            
            if(supportedCodecs.includes(fileExtension)) {
                counter++;
            }
        } else {
            counter += countRecursiveLoadableFiles(element, supportedCodecs);
        }
    }

    return counter;
}

function recursiveFolderOperation(files, operationPerFolder) {
    for(const element of files['files']) {
        if(typeof element == 'string') {
            operationPerFolder(files['path'] + '/' + element);
        } else {
            recursiveFolderOperation(element, operationPerFolder);
        }
    }
}

function insertIntoResourceObject(object, objectName, path, resourceListObject) {
    let current = resourceListObject;

    for (let i = 0; i < path.length; i++) {
        const key = path[i];
        if (!current[key]) {
            current[key] = {};
        }
        current = current[key];
    }

    current[objectName] = object;
}

let totalAmountOfResourcesToLoad = 0;

function loadResource(type, onCompletion, onLoad, onError) {
    let loadedResources = 0;
    resources[type.name] = {};

    fetchInfo.headers.path = type.folderName;
    fetch(fetchPath, fetchInfo).then(response => response.json()).then(folderContent => {
        const amountOfResourcesToLoad = countRecursiveLoadableFiles(folderContent, type.supportedCodecs);
        totalAmountOfResourcesToLoad += amountOfResourcesToLoad;

        if(amountOfResourcesToLoad === 0) {
            onCompletion();
            return;
        }

        recursiveFolderOperation(folderContent, (filepath) => {
            const path = filepath.split('/');
            const fullFileName = path[path.length-1];
            const fileName = fullFileName.split('.')[0];
            const fileExtension = fullFileName.split('.')[1];
            path.shift();
            path.shift();
            path.pop();

            if(!type.supportedCodecs.includes(fileExtension)) {
                onError(`Unsupported ${type.name} format for file: ${filepath}`);
                return;
            }

            type.fileLoader('../' + filepath, fileExtension, (loadedResource) => {
                insertIntoResourceObject(loadedResource, fileName, path, resources[type.name]);
                onLoad(fileName);

                loadedResources++;

                if(loadedResources === amountOfResourcesToLoad) {
                    onCompletion();
                }
            }, onError)
        });
    }).catch(error => onError(error));
}

async function getAmountOfResources() {
    let count = 0;

    for(const resourceType of resourceTypes) {
        fetchInfo.headers.path = resourceType.folderName;
        await fetch(fetchPath, fetchInfo).then(response => response.json()).then(folderContent => {
            count += countRecursiveLoadableFiles(folderContent, resourceType.supportedCodecs);
        }).catch(console.error);
    }

    return count;
}

function loadResources(onLoad, onProgress, onError) {
    let completedResources = 0;

    for(const resourceType of resourceTypes) {
        loadResource(resourceType, () => {
            completedResources++;

            if(completedResources === resourceTypes.length) {
                onLoad();
            }
        }, onProgress, onError);
    }
}

export { resources, loadResources, getAmountOfResources };