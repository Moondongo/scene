import * as THREE from './modulos/three.module.js';
import {OrbitControls} from './modulos/OrbitControls.js';
import {GLTFLoader} from './modulos/GLTFLoader.js';

let scene, camera, renderer, controls;

init();
function init(){
    createScene();
    createCamera();
    createRenderer();
    createControls();
    cargarModelo('3dmodel/cube/untitled.gltf');
    cargarModelo('3dmodel/sphere/sphere.gltf');
    render();
}

function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x151826);
}
function createCamera(){
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.z = 5;
}
function createRenderer(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}
function createControls(){
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.enableDamping = true;
    controls.dampingFactor = 0.22;
    controls.addEventListener('change', render);
}
function render(){
    renderer.render(scene, camera);
}

function cargarModelo(patch){
    const loader = new GLTFLoader();
    loader.load(patch, gltf =>{
        scene.add(gltf.scene);
        render();
    }, undefined, error =>{
        console.error(error);
    });
}