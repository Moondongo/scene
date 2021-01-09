import * as THREE from './modulos/three.module.js';
import {OrbitControls} from './modulos/OrbitControls.js';
import {GLTFLoader} from './modulos/GLTFLoader.js';
import {RGBELoader} from './modulos/RGBELoader.js';
let scene, camera, renderer, controls;
let pmremGenerator;
let loadingManager;
init();
function init(){
    createScene();
    createCamera();
    createRenderer();
    loadManager();
    createControls();
    //cargarModelo('3dmodel/smile/WaterBottle.glb');
    cargarModelo('3dmodel/horno/horno.glb');
    lighting();
    render();
    window.addEventListener('resize', onWindowResize, false);
}

function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x352847);
    loadHDRI();
}
function createCamera(){
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.z = 2;
    camera.position.y = 0.9;
    camera.position.x = 1;
}
function createRenderer(){
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    pmremGenerator = new THREE.PMREMGenerator( renderer );
	pmremGenerator.compileEquirectangularShader();
}
function createControls(){
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 4;
    controls.enableDamping = true;
    controls.dampingFactor = 0.22;
    controls.addEventListener('change', render);
}
function render(){
    renderer.render(scene, camera);
}

function cargarModelo(patch){
    const loader = new GLTFLoader(loadingManager);
    loader.load(patch, gltf =>{
        scene.add(gltf.scene);
        render();
    }, undefined, error =>{
        console.error(error);
    });
}

function lighting(){
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    scene.add(directionalLight);

    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x352847);
    scene.add(ambient);
}

function loadHDRI(){
    new RGBELoader()
        .setDataType(THREE.UnsignedByteType)
        .setPath('hdri/')
        .load('studio.hdr', texture =>{
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            scene.background = envMap;
            scene.environment = envMap;
            texture.dispose();
            pmremGenerator.dispose();
            render();
        });
}

function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );
    render();
}

function loadManager(){
    loadingManager = new THREE.LoadingManager(()=>{
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        loadingScreen.addEventListener('transitionend', e =>{
            e.target.remove();
        });
    });
}