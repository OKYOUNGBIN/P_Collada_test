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
const light = new THREE.DirectionalLight(0x000000);

scene.add(light);

let canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
document.body.prepend(renderer.domElement);

var loader = new ColladaLoader();
loader.load("/Handgun_dae.dae", function (collada) {
  var animations = collada.animations;
  var avatar = collada.scene;

  scene.add(avatar);
});

camera.position.z = 5;

let oribitControls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1, 1);
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

animate();
