import * as THREE from "/three/build/three.module.js";
import { WebGLRenderer } from "/three/build/three.module.js";
//import { ColladaLoader } from "/three/examples/jsm/loaders/ColladaLoader.js";
import { FBXLoader } from "/three/examples/jsm/loaders/FBXLoader.js";
//import { GLTFLoader } from "/three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "/three/examples/jsm/controls/OrbitControls.js";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const light = new THREE.DirectionalLight(0xffffff);
const helper = new THREE.DirectionalLightHelper(light, 5);
scene.add(helper);

// let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
// scene.add(hemiLight);

// let light = new THREE.SpotLight(0xffa95c,4);
// light.position.set(100,100,100);
// light.castShadow = true;
// light.shadow.bias = -0.0001;
// light.shadow.mapSize.width = 1024*4;
// light.shadow.mapSize.height = 1024*4;
// scene.add( light );

let canvas = document.getElementById("c");
const renderer = new WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
const fbxLoader = new FBXLoader();
fbxLoader.load(
  "/dreamtech.fbx",
  (object) => {
    // object.traverse(function (child) {
    //     if ((child as THREE.Mesh).isMesh) {
    //         // (child as THREE.Mesh).material = material
    //         if ((child as THREE.Mesh).material) {
    //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
    //         }
    //     }
    // })
    // object.scale.set(.01, .01, .01)
    object.scale.set(0.01, 0.01, 0.01);
    scene.add(object);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

// let loader = new ColladaLoader();
// loader.load("/dreamtech_alt_revised_22.dae", function (collada) {
//   let avatar = collada.scene;
//   avatar.geometry = collada.scene.children[0].children[0].geometry;
//   avatar.material = collada.scene.children[0].children[0].material;
//   avatar.material = material;
//   avatar.traverse((child) => {
//     if (child.isMesh) {
//       child.castShadow = true;
//       child.receiveShadow = true;
//       if (child.material.map) {
//         child.material.map.anisotropy = 1;
//         child.material = new THREE.MeshPhongMaterial({
//           side: THREE.DoubleSide,
//         });
//       }
//     }
//   });
//   avatar.scale.set(0.01, 0.01, 0.01);

//   scene.add(avatar);
//   console.log(avatar);
// });

let oribitControls = new OrbitControls(camera, renderer.domElement);
camera.position.set(100, 100, 100);
oribitControls.update();
camera.position.set(10, 10, 10);

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
