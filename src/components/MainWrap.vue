<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

let scene, mesh;
let mouseDown = false,
    mouseX = 0,
    mouseY = 0;
export default {
  name: "MainWrap.vue",
  data() {
    return {
      canvas: null,
      controls: null,
      camera: '', // Create a camera
      renderer: '', // Create a render
      geometry: '', // Create a display object
      material: '', // Create a material
      selectObject: {}, // array intersecting rays
      requestID: '',//Return ID as an animation, use to stop moving when the routing jump off the page
    };
  },
  mounted() {
    this.init();
    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('click', this.onMouseDblclick, false);
    //window.addEventListener('mousemove', this.onMouseMoveT, false);

    document.getElementById('container').addEventListener('mousemove', this.onMouseMove);
    document.getElementById('container').addEventListener('mousedown', this.onMouseDown);
    document.getElementById('container').addEventListener('mouseup', this.onMouseUp);
  },
  beforeUnmount() {
    document.getElementById('container').removeEventListener('resize', this.onWindowResize);
    document.getElementById('container').removeEventListener('click', this.onMouseDblclick);
    document.getElementById('container').removeEventListener('mousemove', this.onMouseMoveT);
    //Use the page to stop animation when leaving
    window.cancelAnimationFrame(this.requestID);
  },
  methods: {
    rotateScene(x,y){
      console.log(x,y)
      scene.rotation.x += y/60;
      scene.rotation.y += x/60;
    },
    onMouseMove(evt) {
      if (!mouseDown) {
        return;
      }
      console.log('move')

      evt.preventDefault();

      var deltaX = evt.clientX - mouseX,
          deltaY = evt.clientY - mouseY;
      mouseX = evt.clientX;
      mouseY = evt.clientY;
      this.rotateScene(deltaX, deltaY);
    },
    onMouseDown(evt) {



      mouseDown = true;
      mouseX = evt.clientX;
      mouseY = evt.clientY;
    },
    onMouseUp() {


      mouseDown = false;
    },
    async init() {
      // Create a scene
      scene = new THREE.Scene();
      // Create a camera
      this.camera = new THREE.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          1,
          500,
      );
      this.camera.up.set(0, -1, 0);
      this.camera.position.z = 39;
      this.camera.position.x = 3;
      this.camera.position.y = 1;
      await this.createGeometry();

      await this.createRender();

      this.controls = new OrbitControls(this.camera,this.canvas);

      //this.controls.target.set( 0, 40, 0 );
      this.controls.maxDistance = 400;
      this.controls.minDistance = 10;
      this.controls.update();

      /*      this.controls.noPan = true;
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.enableZoom = true;*/


      this.animate();

      this.addLight()




    },
    addLight(){
      const light = new THREE.PointLight( 0xffffff );
      light.position.copy( this.camera.position );
      light.position.x = -60
      light.position.y = 20
      light.position.z = -5

      const light2 = new THREE.PointLight( 0xffffff );
      light2.position.copy( this.camera.position );
      light2.position.x = 60
      light2.position.y = -80
      light2.position.z = 50

      scene.add( light2 );
      scene.add( light );
    },
    onMouseMoveT(){
      event.preventDefault();
    },
    // Create a display object and material
    createGeometry() {
      let path = new THREE.Shape();
      path.moveTo(0,10);
      path.bezierCurveTo( 0,15, 20,-10, 3,-18 );
      path.bezierCurveTo( -20,-10, 0,5, 0,10 );

      let extrudeGeom2 = new THREE.ExtrudeGeometry( path, {
        curveSegments: 162,
        depth: 3,
        bevelEnabled: false  // Don't bevel the edges
      });

      //let  geometry = new THREE.PlaneGeometry( 100, 100 );
      const geometry = new THREE.Shape();
      geometry.moveTo(0,10);
      geometry.bezierCurveTo( 0,15, 20,-10, 3,-18 );
      geometry.bezierCurveTo( -20,-10, 0,5, 0,10 );

      const mirrirSurface = new THREE.ShapeGeometry( geometry );

      let verticalMirror = new Reflector( mirrirSurface, {
        clipBias: 0.002,
        color: 0x889999
      } );

      verticalMirror.position.x=-5
      verticalMirror.position.y=1
      verticalMirror.position.z=-7

      verticalMirror.rotation.x=59.9
      verticalMirror.rotation.y=20.65

      verticalMirror.scale.x=0.5
      verticalMirror.scale.y=0.5
      verticalMirror.scale.z=0.5
      scene.add( verticalMirror );

      var material = new THREE.MeshLambertMaterial( { color: 'green', wireframe: false } );
      mesh = new THREE.Mesh( extrudeGeom2, material ) ;
      mesh.position.x=-6.55
      mesh.position.y=1
      mesh.position.z=-7

      mesh.rotation.x=59.9
      mesh.rotation.y=20.65
      //mesh.rotation.z=-0.05

      mesh.scale.x=0.5
      mesh.scale.y=0.5
      mesh.scale.z=0.5
      scene.add( mesh );


      const gltfLoader = new GLTFLoader();
      gltfLoader.load('../../scene.gltf', (gltf) => {
        const root = gltf.scene;
        root.position.x=-35
        root.position.y=42
        root.position.z=-44

        root.scale.x=15
        root.scale.y=15
        root.scale.z=15

        root.rotation.x=60
        root.rotation.y=0.25
        root.rotation.z=-0.05
        scene.add(root);
        console.log('good')
      });



    },
    // Create a render
    createRender() {
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth-30, window.innerHeight);
      this.renderer.setClearColor(0xb9d3ff, 1); // Set background color
      // Here and the official website is different because I want to add an element in Canvas, with the POSITION: Absolute can be the element and the three.js model object to coexist.
      let container = document.getElementById('container');
      container.appendChild(this.renderer.domElement);
      this.canvas = this.renderer.domElement
    },
    // Rendering scene
    animate() {
      this.controls.update();
      this.requestID = requestAnimationFrame(this.animate);
      this.render();
    },
    // Set object behavior
    render() {
      //mesh.rotation.x += 0.006;
      //mesh.rotation.z += 0.006;
      //mesh.rotation.y += 0.01;
      
      this.renderer.render(scene, this.camera);
    },
    // Method for windows change triggers
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    // Method for double-click trigger
    onMouseDblclick(event) {
      console.log(event)
      // Get the array of RayCaster and all models, where the elements are sorted by distance, the closer the more
      var intersects = this.getIntersects(event);
      // Get the selected Mesh object
      if (
          intersects.length != 0 &&
          intersects[0].object instanceof THREE.Mesh
      ) {
        //this.$router.push({ name: 'test' });
      }
    },
// Get an array of objects that intersect rays
    getIntersects(event) {
      event.preventDefault();
      // Declare raycaster and mouse variables
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();

      // Click the position through the mouse, calculate the location of the RayCaster's point, with the screen as central point, range -1 to 1
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // calculate the ray position by clicking the position (two-dimensional coordinate) and the matrix of the current camera
      raycaster.setFromCamera(mouse, this.camera);

      // Get an array of objects intersecting the ray, where the elements are sorted by distance, the closer the more
      var intersects = raycaster.intersectObjects(scene.children);

      // Return to the selected object
      return intersects;
    },
  },
};
</script>

<style scoped>
#container {
  width: 80vw;
  height: 80vh;
}
</style>