import React, {useState, useEffect} from 'react'
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";

import * as THREE from "three";
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'


var camera, controls, scene, renderer;

const loader = new PLYLoader();


function initPly(activeFile) {
  console.log('init', activeFile)
  if (!activeFile) {
    return;
  }

  loader.load(activeFile, function(geometry) {
    geometry.computeVertexNormals();

    var material = new THREE.MeshStandardMaterial({
      wireframe: false
    });
    var mesh = new THREE.Mesh(geometry, material);

    // mesh.position.x = -0.2;
    // mesh.position.y = -0.02;
    // mesh.position.z = -0.2;
    mesh.scale.multiplyScalar(0.1);
    mesh.name = activeFile;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);
  });
}

function initScene(width, height) {
  // container = document.createElement("div");
  // document.body.appendChild(container);
  const container = document.getElementById('render-area');
//   const height = window.innerHeight - HEADER_FOOTER_HEIGHT

  camera = new THREE.PerspectiveCamera(
    35,
    width / height,
    1,
    15
  );
  camera.position.set(3, 0.15, 3);


  // const cameraTarget = new THREE.Vector3(0, -0.1, 0);
  const cameraTarget =new THREE.Vector3(0,0,0)

  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0x72645b);
  // scene.fog = new THREE.Fog(0x72645b, 2, 15);

  // Ground

  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(40, 40),
    new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
  );
  // plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.5;
  scene.add(plane);
  scene.add(camera)

  plane.receiveShadow = true;

  // Uncomment to render second ply point cloud.
  // loader.load("dolphins_be.ply", function(geometry) {
  //   geometry.computeVertexNormals();

  //   var material = new THREE.MeshStandardMaterial({
  //     wireframe: true
  //   });
  //   var mesh = new THREE.Mesh(geometry, material);

  //   mesh.position.y = -0.2;
  //   mesh.position.z = 0.3;
  //   mesh.scale.multiplyScalar(0.001);

  //   mesh.castShadow = true;
  //   mesh.receiveShadow = true;

  //   scene.add(mesh);
  // });


  // Lights

  scene.add(new THREE.HemisphereLight(0x443333, 0x111122));

  addShadowedLight(1, 1, 1, 0xffffff, 1.35);
  addShadowedLight(0.5, 1, -1, 0xffaa00, 1);

  // renderer

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.outputEncoding = THREE.sRGBEncoding;

  renderer.shadowMap.enabled = true;

  container.appendChild(renderer.domElement);

    // https://medium.com/geekculture/how-to-control-three-js-camera-like-a-pro-a8575a717a2
    // 2. Initiate FlyControls with various params
    controls = new FlyControls( camera, renderer.domElement );
    controls.movementSpeed = 10;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = true;
  

//   window.addEventListener("resize", onWindowResize, false);
}

function addShadowedLight(x, y, z, color, intensity) {
  var directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(x, y, z);
  scene.add(directionalLight);

  directionalLight.castShadow = true;

  var d = 1;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 4;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  directionalLight.shadow.bias = -0.001;
}


function animate() {
  requestAnimationFrame(animate);
  render();
   // 3. update controls with a small step value to "power its engines"
   controls.update(0.01)
}

const ROTATION_RATE = 0.0001; // was .0005

function render() {
  var timer = Date.now() * ROTATION_RATE;

  // camera.position.x = Math.sin(timer) * 2.5;
  // camera.position.z = Math.cos(timer) * 2.5;

  // camera.lookAt(cameraTarget);

  renderer.render(scene, camera);
}


function PointCloud({width, height, plyFile}) {
    // const [plyFile, setPlyFile] = useState('')

  // function removeEntity(name) {
  //   var selectedObject = scene.getObjectByName(name);
  //   scene.remove( selectedObject );
  //   animate();
  // }
  
    useEffect(() => {
      initScene(width, height)
      animate()
    }, [width])
  
    useEffect(() => {
      initPly(plyFile)
    }, [plyFile])

    function onResize() {
        camera.aspect = width / height
        camera.updateProjectionMatrix();
      
        renderer.setSize(width, height);
      }
      

    useEffect(() => {
        onResize()
    }, [width, height])

  return (<>
    <div id="render-area"/>
        </>
  )
}

export default PointCloud
