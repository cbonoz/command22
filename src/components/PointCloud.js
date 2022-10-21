import React, {useState, useEffect} from 'react'
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";

import * as THREE from "three";
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { TEST_INTEREST_POINTS } from '../util/constants';
import { Interaction } from 'three.interaction';


var camera, stats, controls, scene, renderer;

const plyLoader = new PLYLoader();

const SCALE = 1;



function initPly(activeFile, cb) {
  console.log('init', activeFile)
  if (!activeFile) {
    return;
  }

  plyLoader.load(activeFile, function(geometry) {
    geometry.computeVertexNormals();

    // var material = new THREE.MeshStandardMaterial({
    //   wireframe: false
    // });
    const material = new THREE.PointsMaterial( 
      { size: 0.02 , vertexColors: true }//, color: 0xffffff } 
    )
    // const mesh = new THREE.Mesh(geometry, material);
    const mesh = new THREE.Points(geometry, material)

    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 0;
    mesh.scale.multiplyScalar(SCALE);
    mesh.name = activeFile;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);
    cb && cb()
  });
}

function initScene(width, height) {
  // container = document.createElement("div");
  // document.body.appendChild(container);
  const container = document.getElementById('render-area');
//   const height = window.innerHeight - HEADER_FOOTER_HEIGHT

  // stats = new Stats();
  // container.appendChild( stats.dom );

  camera = new THREE.PerspectiveCamera(
    35,
    width / height,
    0.1,
    1000
  );
  // camera.position.set(3, 0.15, 3);
  camera.position.z = SCALE * 100

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x72645b);
  // scene.fog = new THREE.Fog(0x72645b, 2, 15);
  scene.add(camera)


  // // Ground
  // var plane = new THREE.Mesh(
  //   new THREE.PlaneBufferGeometry(40, 40),
  //   new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
  // );
  // plane.position.y = -0.5;
  // plane.receiveShadow = true;
  // scene.add(plane);

  // Lights
  scene.add(new THREE.HemisphereLight(0x443333, 0x111122));

  // addShadowedLight(1, 1, 1, 0xffffff, 1.35);
  // addShadowedLight(0.5, 1, -1, 0xffaa00, 1);
  // const light = new THREE.AmbientLight( 0x404040 ); // soft white light
  // scene.add( light );

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.outputEncoding = THREE.sRGBEncoding;
  // renderer.shadowMap.enabled = true;

  container.appendChild(renderer.domElement);

  // https://medium.com/geekculture/how-to-control-three-js-camera-like-a-pro-a8575a717a2
  // 2. Initiate FlyControls with various params
  controls = new FlyControls( camera, renderer.domElement );
  controls.movementSpeed = SCALE*40;
  controls.rollSpeed = Math.PI / 15;
  controls.autoForward = false;
  controls.dragToLook = true;

  // Onclick
  //
  // https://stackoverflow.com/questions/34698393/get-mouse-clicked-points-3d-coordinate-in-three-js
  // renderer.domElement.
    const interaction = new Interaction(renderer, scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  render();
   // 3. update controls with a small step value to "power its engines"
   controls.update(0.01)
    // https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
   stats && stats.update();
}

function render() {
  renderer.render(scene, camera);
}

function PointCloud({width, height, plyFile, interestPoints, onPointSelect}) {
  const [loading ,setLoading] = useState(false)
  // const [activeMarker, setActiveMarker] = useState()
    // const [plyFile, setPlyFile] = useState('')

  // function removeEntity(name) {
  //   var selectedObject = scene.getObjectByName(name);
  //   scene.remove( selectedObject );
  //   animate();
  // }

  function addClickableSphere(marker) {
    if (!scene) {
      return
    }
  
    // https://threejs.org/docs/#api/en/geometries/SphereGeometry
    const geometry = new THREE.SphereGeometry( SCALE, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const sphere = new THREE.Mesh( geometry, material );

    // TODO: specify location using Lat/Lng -> ply file coordinate mapping function.
    const randomOffset = 50*SCALE
    // x,y,z
    sphere.position.set(
      Math.random()*randomOffset,
      Math.random()*randomOffset,
      0
    )
    scene.add( sphere );
  
    // https://stackoverflow.com/questions/7984471/how-to-get-clicked-element-in-three-js
    sphere.cursor = 'pointer';

    sphere.on('click', function(ev) {
      console.log('onClick', ev, marker)
      onPointSelect && onPointSelect(marker)
    });
    
  }
  
    useEffect(() => {
      if (!scene && width && height) {
        initScene(width, height)
      } else if (scene) {
        onResize()
      }
      // animate()
    }, [width, height])
  
    useEffect(() => {
      if (plyFile && scene) {
        setLoading(true)
        initPly(plyFile, () => {
          // console.log('loaded', plyFile)
          // TODO: pull interest points from live source/feed.
          TEST_INTEREST_POINTS.forEach(p => {
            addClickableSphere(p)
          })
          setLoading(false)
          animate()
        })
      }
    }, [plyFile])

    function onResize() {
        if (!camera) {
          return
        }
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
