
import React, {useEffect, useState} from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import { Layout, Menu, Select } from 'antd';

import * as THREE from "three";
//import { VRButton } from "three/examples/jsm/webxr/VRButton";
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory";
import Stats from "three/examples/jsm/libs/stats.module";
//import { MapControls } from "three/examples/jsm/controls/OrbitControls";

//import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
//import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { APP_NAME, PLY_FILE, PLY_FILES } from "./util/constants";
import logo from "./assets/logo.png";

import 'antd/dist/antd.css';
import "./styles.css";

const { Header, Footer, Sider, Content } = Layout;
const {Option} = Select


var loader = new PLYLoader();

export default function App() {
  const navigate = useNavigate();
  const [plyFile, setPlyFile] = useState('')

  function removeEntity(name) {
    var selectedObject = scene.getObjectByName(name);
    scene.remove( selectedObject );
    animate();
}

  useEffect(() => {
    initScene()
    animate()
  }, [])

  useEffect(() => {
    initPly(plyFile)
  }, [plyFile])

  return <div className='App'><Layout>
  <Header>
  <Menu
            // theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[0, 1]}
          >
            <Menu.Item key={0}>
              <img
                src={logo}
                className="header-logo pointer"
                onClick={() => navigate("/")}
              />
            </Menu.Item>

            <Menu.Item  key={1} onClick={() => navigate("/lidar")}>
              Lidar
            </Menu.Item>
            
            <Menu.Item key={2} onClick={() => navigate("/video")}>
              Video Streams
            </Menu.Item>
            <Menu.Item key={3} onClick={() => navigate("/settings")}>
              Settings
            </Menu.Item>

            <span>
            <Select defaultValue={plyFile} style={{ width: 200 }} onChange={(e) => 
              {
                removeEntity(plyFile)
                setPlyFile(e)}
              }>
              {PLY_FILES.map((option, i) => {
                return <Option value={option} key={i}>{option}</Option>
              })}
              </Select>
            </span>


        </Menu>
  </Header>
  <Layout>
    {/* <Sider>Sider</Sider> */}
    <Content>
      <div id="render-area"></div>
    </Content>
  </Layout>
  <Footer>{APP_NAME} | &copy;2022</Footer>
</Layout>
</div> 
}

var container, stats;
var camera, cameraTarget, scene, renderer;

// init();
// animate();

function initPly(activeFile) {
  console.log('init', activeFile)
  if (!activeFile) {
    return;
  }

  loader.load(activeFile, function(geometry) {
    geometry.computeVertexNormals();
    const isNistDemo = activeFile.indexOf('North') !== -1;

    var material = new THREE.MeshStandardMaterial({
      wireframe: true
    });
    var mesh = new THREE.Mesh(geometry, material);

    // mesh.position.x = -0.2;
    // mesh.position.y = -0.02;
    // mesh.position.z = -0.2;
    mesh.rotation.x = isNistDemo ? -Math.PI / 4 : -Math.PI / 2;
    const scale = isNistDemo ? .02 : .0006;
    mesh.scale.multiplyScalar(scale);//0.0006);
    mesh.name = activeFile;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);
  });
}

function initScene() {
  // container = document.createElement("div");
  // document.body.appendChild(container);
  container = document.getElementById('render-area');

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    15
  );
  camera.position.set(3, 0.15, 3);

  cameraTarget = new THREE.Vector3(0, -0.1, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x72645b);
  scene.fog = new THREE.Fog(0x72645b, 2, 15);

  // Ground

  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(40, 40),
    new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.5;
  scene.add(plane);

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
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  renderer.shadowMap.enabled = true;

  container.appendChild(renderer.domElement);

  // stats

  stats = new Stats();
  // container.appendChild(stats.dom);

  // resize

  window.addEventListener("resize", onWindowResize, false);
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

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

const ROTATION_RATE = 0.0001; // was .0005

function render() {
  var timer = Date.now() * ROTATION_RATE;

  camera.position.x = Math.sin(timer) * 2.5;
  camera.position.z = Math.cos(timer) * 2.5;

  camera.lookAt(cameraTarget);

  renderer.render(scene, camera);
}
