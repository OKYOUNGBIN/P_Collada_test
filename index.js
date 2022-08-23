import * as THREE from "/three/build/three.module.js";
import { WebGLRenderer } from "/three/build/three.module.js";
import { ColladaLoader } from "/three/examples/jsm/loaders/ColladaLoader.js";
import { OrbitControls } from "/three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "/three/examples/jsm/postprocessing/EffectComposer.js";
import { OBJLoader } from "/three/examples/jsm/loaders/OBJLoader.js"
import { RenderPass } from "/three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "/three/examples/jsm/postprocessing/GlitchPass.js";
import { ShaderPass } from '/three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from '/three/examples/jsm/shaders/GammaCorrectionShader.js';
import { GUI } from '/dat.gui/build/dat.gui.module.js'
import { Sky } from '/three/examples/jsm/objects/Sky.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
// hemiLight.color.setHSL( 0.6, 1, 0.6 );
// hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
// hemiLight.position.set( 0, 1000, 0 );
// scene.add( hemiLight );

// const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
// scene.add( hemiLightHelper );

// //

// const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
// dirLight.color.setHSL( 0.1, 1, 0.95 );
// dirLight.position.set( - 1, 1.75, 1 );
// dirLight.position.multiplyScalar( 30 );
// scene.add( dirLight );

// dirLight.castShadow = true;

// dirLight.shadow.mapSize.width = 2048;
// dirLight.shadow.mapSize.height = 2048;

// const d = 100;

// dirLight.shadow.camera.left = - d;
// dirLight.shadow.camera.right = d;
// dirLight.shadow.camera.top = d;
// dirLight.shadow.camera.bottom = - d;

// dirLight.shadow.camera.far = 3500;
// dirLight.shadow.bias = - 0.0001;

// const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
// scene.add( dirLightHelper );
const light = new THREE.DirectionalLight( 0xFFFFFF );
const helper = new THREE.DirectionalLightHelper( light, 5 );
scene.add( helper );

// let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
// scene.add(hemiLight);

// let light = new THREE.SpotLight(0xffa95c,4);
// light.position.set(100,100,100);
// light.castShadow = true;
// light.shadow.bias = -0.0001;
// light.shadow.mapSize.width = 1024*4;
// light.shadow.mapSize.height = 1024*4;
// scene.add( light );

const material = new THREE.MeshPhysicalMaterial()

const gui = new GUI()
const materialFolder = gui.addFolder('THREE.Material')
materialFolder.add(material, 'opacity', 0, 1, 0.01)
// materialFolder.add(material, 'depthTest')
// materialFolder.add(material, 'depthWrite')
materialFolder.add(material, 'metalness')
materialFolder.add(material, 'roughness')
materialFolder.add(material, 'reflectivity')
materialFolder.add(material, 'clearcoat')
materialFolder.add(material, 'clearcoatRoughness')
materialFolder.add(helper.position.x, 'x')
materialFolder.add(helper.position.y, 'y')
materialFolder.add(helper.position.z, 'z')

let loader = new ColladaLoader();
loader.load("/dreamtech_alt_revised_22.dae", function (collada) {
  let avatar = collada.scene;
  avatar.geometry = collada.scene.children[0].geometry;
  avatar.material = collada.scene.children[0].material;
  avatar.material = material
  avatar.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material.map){
        child.material.map.anisotropy = 16;
        child.material = material
      }
    }
  });
  scene.add(avatar);
  avatar.scale.set(0.001,0.001,0.001)
  console.log(avatar)
});

let canvas = document.getElementById("c");
const renderer = new WebGLRenderer({
  canvas,
  alpha: true,
	powerPreference: "high-performance",
	antialias: true,
	stencil: true,
	depth: true
});

const composer = new EffectComposer( renderer );
renderer.autoClear = true;
renderer.debug.checkShaderErrors = true
renderer.shadowMap.type = THREE.VSMShadowMap
renderer.shadowMap.enabled = true
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.2;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

let oribitControls = new OrbitControls(camera, renderer.domElement);
oribitControls.update();
camera.position.set(10,10,10)

function resizeRendererToDisplaySize(renderer) {
  canvas = renderer.domElement;
  let width = window.innerWidth;
  let height = window.innerHeight;

  let canvasPixelWidth = canvas.width / window.devicePixelRatio;
  let canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  if (resizeRendererToDisplaySize(renderer)) {
    canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateWorldMatrix();
  }
  light.position.set( 
    camera.position.x + 10,
    camera.position.y + 10,
    camera.position.z + 10,
  );
  composer.render();
  
}

animate();
