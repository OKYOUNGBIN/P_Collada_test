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


// const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
// scene.add( ambientLight );

// const color = 0xFFFFFF;
// const intensity = 1;
var sunlight=new THREE.DirectionalLight(0xFFFFFF,1);
sunlight.position.set(10,10,10);
sunlight.decay=1;
sunlight.castShadow = true;
sunlight.shadow.mapSize.width=1024;
sunlight.shadow.mapSize.height=1024;
sunlight.shadow.camera.top=15;
sunlight.shadow.camera.bottom=-15;
sunlight.shadow.camera.left=-15;
sunlight.shadow.camera.right=15;
scene.add(sunlight);


let canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
document.body.prepend(renderer.domElement);


renderer.shadowMap.enabled = true;

renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFShadowMap;

var loader = new ColladaLoader();
loader.load("/dreamtech_alt_revised_22.dae", function (collada) {
  // var animations = collada.animations;
  var avatar = collada.scene;
  // let my_material = new THREE.MeshPhongMaterial() //or any other material
  // //set map, shininess, etc. if needed
  // avatar.material = my_material
  avatar.receiveShadow = true;
  avatar.castShadow = true;
  avatar.traverse(function(child) {
    child.castShadow = true;
    child.receiveShadow = true;
    });
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
