import * as THREE from "/three/build/three.module.js";
import { ColladaLoader } from "/three/examples/jsm/loaders/ColladaLoader.js";
import { OrbitControls } from "/three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// var sunlight = new THREE.DirectionalLight(0xffffff, 1);
// sunlight.position.set(10, 10, 10);
// sunlight.decay = 1;
// sunlight.castShadow = true;
// sunlight.shadow.mapSize.width = 1024;
// sunlight.shadow.mapSize.height = 1024;
// sunlight.shadow.camera.top = 15;
// sunlight.shadow.camera.bottom = -15;
// sunlight.shadow.camera.left = -15;
// sunlight.shadow.camera.right = 15;
// scene.add(sunlight);

let light = new THREE.SpotLight(0xffffff, 4);
light.position.set(-50, 50, 50);
light.castShadow = true;
light.shadow.bias = -0.0001;
light.shadow.mapSize.width = 1024 * 4;
light.shadow.mapSize.height = 1024 * 4;
scene.add(light);

// let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
// scene.add(hemiLight);

let canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});

renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const material = new THREE.MeshPhysicalMaterial();

let loader = new ColladaLoader();
loader.load("/dreamtech_alt_revised_22.dae", function (collada) {
  let avatar = collada.scene;

  avatar.geometry = collada.scene.children[0].children[0].geometry;
  avatar.material = collada.scene.children[0].children[0].material;
  avatar.material = material;

  avatar.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material.map) {
        child.material.map.anisotropy = 1;
        child.material = new THREE.MeshPhongMaterial({
          side: THREE.DoubleSide,
        });
      }
    }
  });
  avatar.scale.set(0.01, 0.01, 0.01);

  scene.add(avatar);
  console.log(avatar);
});

let oribitControls = new OrbitControls(camera, renderer.domElement);
camera.position.set(100, 100, 100);
oribitControls.update();

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
}

animate();
