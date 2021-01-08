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
    cargarModelo('3dmodel/bankito/Banco.gltf');
    lighting();
    render();
}

function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x352847);
}
function createCamera(){
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.z = 6;
    camera.position.y = 5;
}
function createRenderer(){
    renderer = new THREE.WebGLRenderer({antialias:true});
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

function lighting(){
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.1);
    scene.add(directionalLight);

    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x352847);
    scene.add(ambient);
}