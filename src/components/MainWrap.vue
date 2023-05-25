<template>
  <button class="button-form" @click="toDrawPage">форма
  </button>
  <!-- <button class="button-frame">рамка</button> -->



  <el-popover
    ref="popoverFrame"
    placement="left-start"
    title="Title"
    :width="150"
    trigger="click"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <el-button class="button-frame">Рама</el-button>
    </template>
    <div class="frame-content-wrap">
      <div class="frameIMG" :style="frameIndex == 0 ? 'background-color: #7a7b81' : ''" @click="setFrame1">
        <img class="menu-image" src="../assets/frames/frame1.png">
      </div>
      <div class="frameIMG" :style="frameIndex == 1 ? 'background-color: #7a7b81' : ''" @click="setFrame2">
        <img class="menu-image" src="../assets/frames/frame2.png">
      </div>
      <div class="frameIMG" :style="frameIndex == 2 ? 'background-color: #7a7b81' : ''" @click="setFrame3">
        <img class="menu-image" src="../assets/frames/frame3.png">
      </div>
    </div>
  </el-popover>



  <button class="button-fastening" @click="fastening">крепление</button>
  <button class="button-ordering" @click="$emit('changeIndex',2)">оформление</button>
  <div class="preload" v-if="preloader">прелоадер</div>
  <div id="container"></div>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { Reflector } from 'three/examples/jsm/objects/Reflector';
//import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
//import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";

let scene, renderer;
let mouseDown = false,
    mouseX = 0,
    mouseY = 0;
export default {
  name: "MainWrap.vue",
  props: {
    pathCurve:Object
  },
  data() {
    return {
      frameIndex:0,

      segments: [],
      preloader: true,
      firstInit: false,

      canvas: null,
      controls: null,
      camera: '', // Create a camera
      //renderer: '', // Create a render
      geometry: '', // Create a display object
      material: '', // Create a material
      selectObject: {}, // array intersecting rays
      requestID: '',//Return ID as an animation, use to stop moving when the routing jump off the page
    };
  },
  mounted() {
    if(this.pathCurve){
      window.addEventListener('resize', this.onWindowResize, false);
        window.addEventListener('click', this.onMouseDblclick, false);
        //window.addEventListener('mousemove', this.onMouseMoveT, false);

        document.getElementById('container').addEventListener('mousemove', this.onMouseMove);
        document.getElementById('container').addEventListener('mousedown', this.onMouseDown);
        document.getElementById('container').addEventListener('mouseup', this.onMouseUp);
    }
  },
  beforeUnmount() {
    document.getElementById('container').removeEventListener('resize', this.onWindowResize);
    document.getElementById('container').removeEventListener('click', this.onMouseDblclick);
    document.getElementById('container').removeEventListener('mousemove', this.onMouseMoveT);
    //Use the page to stop animation when leaving
    window.cancelAnimationFrame(this.requestID);
  },
  watch:{
    async pathCurve(val){
      if(val && !this.firstInit){
        console.log(val);
        this.firstInit = true
        await this.init();
        window.addEventListener('resize', this.onWindowResize, false);
        window.addEventListener('click', this.onMouseDblclick, false);
        //window.addEventListener('mousemove', this.onMouseMoveT, false);

        document.getElementById('container').addEventListener('mousemove', this.onMouseMove);
        document.getElementById('container').addEventListener('mousedown', this.onMouseDown);
        document.getElementById('container').addEventListener('mouseup', this.onMouseUp);
      } else if(val && this.firstInit){

        this.removeMeshes()

        const objectReflector = scene.getObjectByProperty( 'type', "Reflector" );
        objectReflector.geometry.dispose();
        objectReflector.material.dispose();
        scene.remove( objectReflector );

        const MirorBack = scene.getObjectByProperty( 'name', "MirorBack" );
        if(MirorBack){
          MirorBack.geometry.dispose();
          MirorBack.material.dispose();
          scene.remove( MirorBack );
        }

        console.log(scene);
        renderer.renderLists.dispose();

        await this.createGeometry(false);
      }
    },
  },
  methods: {
    frame3(){
      this.$emit('externalPath')
    },
    toDrawPage(){
      this.$refs.popoverFrame.hide();
      this.$emit('changeIndex',0)
    },
    fastening(){
      this.$refs.popoverFrame.hide();


      this.controls.maxAzimuthAngle = Infinity;
      this.controls.minAzimuthAngle = Infinity;
      this.controls.maxPolarAngle = Math.PI;
      this.controls.minPolarAngle = 0;

      console.log(this.camera)

      let xStep=((this.camera.position.x) - (-30)) /100
      let yStep=((this.camera.position.y) - (-16)) /100
      let zStep=((this.camera.position.z) - (19)) /100

      // this.camera.position.z = 19;
      // this.camera.position.x = -30;
      // this.camera.position.y = -16;
      //
      // console.log(this.camera)

        let count = 0
        let intervalID = setInterval(() => {
          this.camera.position.x -= xStep
          this.camera.position.y -= yStep
          this.camera.position.z -= zStep
          count++
          if(count == 100){
            window.clearInterval(intervalID);
          }
        }, 10);




    },
    rotateScene(){
      //console.log(x,y)
      //scene.rotation.x += y/60;
      //scene.rotation.y += x/60;
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
      this.camera.position.y = -6;
      await this.createGeometry();

      await this.createRender();

      this.controls = new OrbitControls(this.camera,this.canvas);

      //this.controls.target.set( 0, 40, 0 );

      //this.controls.maxDistance = 60;
      //this.controls.minDistance = 10;

      this.controls.rotateSpeed = 0.9;
      this.controls.zoomSpeed = 0.9;
      this.controls.panSpeed = 0;
      this.controls.maxAzimuthAngle = 0.01;
      this.controls.minAzimuthAngle = -2.9;
      this.controls.maxPolarAngle = 2;
      this.controls.minPolarAngle = 1;

      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.1;
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
    createGeometry(render3Dmodel = true) {

      console.log(this.pathCurve);
      //let path = new THREE.Shape();




      var shapeCURVE = new THREE.Shape();

      shapeCURVE.moveTo(this.pathCurve[0].curve.points[0].x /10,this.pathCurve[0].curve.points[0].y /10);
      let ARR = []
      for(let i=0; i<this.pathCurve.length-1;i++){
        //path.bezierCurveTo(this.pathCurve[i].curve.points[1].x / 10, this.pathCurve[i].curve.points[1].y / 10, this.pathCurve[i].curve.points[2].x / 10, this.pathCurve[i].curve.points[2].y / 10, this.pathCurve[i].curve.points[3].x / 10, this.pathCurve[i].curve.points[3].y / 10 );
        ARR.push(new THREE.Vector2(this.pathCurve[i].curve.points[3].x / 10, this.pathCurve[i].curve.points[3].y / 10 ),)
      }
      shapeCURVE.splineThru(ARR);


      const mirrirSurface = new THREE.ShapeGeometry( shapeCURVE,100 );

      let verticalMirror = new Reflector( mirrirSurface, {
        clipBias: 0.002,
        color: 0x889999
      } );

      verticalMirror.position.x=-4.25
      verticalMirror.position.y=-14
      verticalMirror.position.z=8

      verticalMirror.rotation.y=1.57

      verticalMirror.scale.x=0.4
      verticalMirror.scale.y=0.4
      verticalMirror.scale.z=0.4
      scene.add( verticalMirror );



      let extrudeGeom2 = new THREE.ExtrudeGeometry( shapeCURVE, {
        curveSegments: 162,
        depth: 0.3,
        bevelEnabled: false,  // Don't bevel the edges
      });

      var materialMir = new THREE.MeshBasicMaterial( { color: 0x969ea6 } );

      let meshFormMir = new THREE.Mesh( extrudeGeom2, materialMir ) ;
      meshFormMir.position.x=-4.4
      meshFormMir.position.y=-14
      meshFormMir.position.z=8

      meshFormMir.rotation.y=1.57

      meshFormMir.scale.x=0.4
      meshFormMir.scale.y=0.4
      meshFormMir.scale.z=0.4
      meshFormMir.name = 'MirorBack'
      scene.add( meshFormMir );

      this.setFrame1()


        if(render3Dmodel){

          const oBJLoader = new OBJLoader();


          // const mtlLoader = new MTLLoader();
          // mtlLoader.load('../../InteriorTest.mtl', (mtl) => {
          //   mtl.preload();
          //   oBJLoader.setMaterials(mtl);


          oBJLoader.load('../../InteriorTest.obj', (gltf) => {
            const root = gltf;
            root.position.x=32.5
            root.position.y=20
            // root.position.z=-18

            root.scale.x=15
            root.scale.y=15
            root.scale.z=15

            // root.rotation.x=59.7
            // root.rotation.y=0.25
            root.rotation.z= Math.PI
            scene.add(gltf);
            this.preloader = false
            console.log('good')
          });
          //});



        }


    },
    // Create a render
    createRender() {
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth-30, window.innerHeight);
      renderer.setClearColor(0xb9d3ff, 1); // Set background color
      // Here and the official website is different because I want to add an element in Canvas, with the POSITION: Absolute can be the element and the three.js model object to coexist.
      let container = document.getElementById('container');
      container.appendChild(renderer.domElement);
      this.canvas = renderer.domElement
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
      
      renderer.render(scene, this.camera);
    },
    // Method for windows change triggers
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
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
    removeMeshes(){
      for (let i = scene.children.length - 1; i >= 0; i--) {
        if(scene.children[i].type === "Mesh" && scene.children[i].name !== "MirorBack"){
          scene.children[i].geometry.dispose();
          scene.children[i].material[0].dispose();
          scene.children[i].material[1].dispose();
          scene.remove(scene.children[i]);
        }

      }
    },
    setFrame1(){
      console.log('333')

      const MirorBack = scene.getObjectByProperty( 'name', "MirorBack" );
      if(MirorBack){
        MirorBack.geometry.dispose();
        MirorBack.material.dispose();
        scene.remove( MirorBack );
      }

      this.removeMeshes()
      this.frameIndex = 0
      var shapeCURVE = new THREE.Shape();

      shapeCURVE.moveTo(this.pathCurve[0].curve.points[0].x /10,this.pathCurve[0].curve.points[0].y /10);
      let ARR = []
      for(let i=0; i<this.pathCurve.length-1;i++){
        //path.bezierCurveTo(this.pathCurve[i].curve.points[1].x / 10, this.pathCurve[i].curve.points[1].y / 10, this.pathCurve[i].curve.points[2].x / 10, this.pathCurve[i].curve.points[2].y / 10, this.pathCurve[i].curve.points[3].x / 10, this.pathCurve[i].curve.points[3].y / 10 );
        ARR.push(new THREE.Vector2(this.pathCurve[i].curve.points[3].x / 10, this.pathCurve[i].curve.points[3].y / 10 ),)
      }
      shapeCURVE.splineThru(ARR);

      const loader = new THREE.TextureLoader();
      let extrudeGeom2 = new THREE.ExtrudeGeometry( shapeCURVE, {
        curveSegments: 162,
        depth: 3,
        bevelEnabled: false,  // Don't bevel the edges
      });

      let textureFrame = loader.load('../../Texture/treeD.jpg')
      textureFrame.wrapS = textureFrame.wrapT = THREE.RepeatWrapping;
      textureFrame.repeat.set( 1 / 20, 1 / 10 );
      textureFrame.offset.set( 0.1, 0.1 );
      textureFrame.rotation = 1.55;

      let textureFrame1 = loader.load('../../Texture/treeD.jpg')
      textureFrame1.wrapS = textureFrame1.wrapT = THREE.RepeatWrapping;
      textureFrame1.repeat.set( 1 / 20, 1 / 10 );
      textureFrame1.offset.set( 0.1, 0.01 );
      textureFrame1.rotation = 0;

      //var material = new THREE.MeshPhongMaterial( { map: textureFrame} );

      let materials = [
        new THREE.MeshPhongMaterial( { map: textureFrame} ),
        new THREE.MeshPhongMaterial( { map: textureFrame1} )
      ]

      let meshForm = new THREE.Mesh( extrudeGeom2, materials ) ;
      meshForm.position.x=-5.5
      meshForm.position.y=-14
      meshForm.position.z=8

      meshForm.rotation.y=1.57

      meshForm.scale.x=0.4
      meshForm.scale.y=0.4
      meshForm.scale.z=0.4
      scene.add( meshForm );

    },
    setFrame2(){
      this.removeMeshes()
    },
    setFrame3(){

      this.removeMeshes()

      this.frameIndex = 2

      const loader = new THREE.TextureLoader();
      let textureFrame = loader.load('../../Texture/treeD.jpg')
      textureFrame.wrapS = textureFrame.wrapT = THREE.RepeatWrapping;
      textureFrame.repeat.set( 1 / 20, 1 / 10 );
      textureFrame.offset.set( 0.1, 0.1 );
      textureFrame.rotation = 1.55;

      let textureFrame1 = loader.load('../../Texture/treeD.jpg')
      textureFrame1.wrapS = textureFrame1.wrapT = THREE.RepeatWrapping;
      textureFrame1.repeat.set( 1 / 20, 1 / 10 );
      textureFrame1.offset.set( 0.1, 0.01 );
      textureFrame1.rotation = 0;

      let materials = [
        new THREE.MeshPhongMaterial( { map: textureFrame} ),
        new THREE.MeshPhongMaterial( { map: textureFrame1} )
      ]

      let points = []

      points.push(new THREE.Vector3( this.pathCurve[0].curve.points[0].x / 10, this.pathCurve[0].curve.points[0].y / 10, 0 ),)
      for(let i=0; i<this.pathCurve.length-1;i++){
        points.push(new THREE.Vector3( this.pathCurve[i].curve.points[1].x / 10, this.pathCurve[i].curve.points[1].y / 10, 0 ),)
        //path34.bezierCurveTo(this.pathCurve[i].curve.points[1].x / 10, this.pathCurve[i].curve.points[1].y / 10, this.pathCurve[i].curve.points[2].x / 10, this.pathCurve[i].curve.points[2].y / 10, this.pathCurve[i].curve.points[3].x / 10, this.pathCurve[i].curve.points[3].y / 10 );
      }
      points.push(new THREE.Vector3( this.pathCurve[this.pathCurve.length-1].curve.points[3].x / 10, this.pathCurve[this.pathCurve.length-1].curve.points[3].y / 10, 0 ),)
      points.push(new THREE.Vector3( this.pathCurve[1].curve.points[1].x / 10, this.pathCurve[1].curve.points[1].y / 10, 0 ),)

      const curve = new THREE.CatmullRomCurve3(points)

      const extrudeSettings2 = {
        steps: 1400,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSegments: 10,
        bevelSize: 1,
        extrudePath: curve
      };

      let  shape2 = new THREE.Shape();
      shape2.moveTo( -1,-0.8 );
      shape2.lineTo( -1, 1 );
      shape2.lineTo( 1.5, 1 );
      shape2.lineTo( 1.5, -1 );
      shape2.lineTo( -0.8, -1 );
      shape2.lineTo( -0.9, -0.95 );
      shape2.lineTo( -0.95, -0.9 );

      const geometry2 = new THREE.ExtrudeGeometry( shape2, extrudeSettings2 );

      const mesh2 = new THREE.Mesh( geometry2, materials );
      mesh2.position.x=-4.5
      mesh2.position.y=-14
      mesh2.position.z=8

      mesh2.rotation.y=1.57

      mesh2.scale.x=0.4
      mesh2.scale.y=0.4
      mesh2.scale.z=0.4
      scene.add( mesh2 );

    }
  },
};
</script>

<style scoped>
.preload{
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: aliceblue;
  z-index: 15;
}
#container {
  width: 80vw;
  height: 80vh;
}
.menu-image{
  width: 100px;
  height: 100px;
}
.frame-content-wrap{
  display: flex;
  flex-direction: column;
}
.button-form{
  position: absolute;
  right: 10%;
  top: 30%;
  transform: translateY(-50%);
}
.button-frame{
  position: absolute;
  right: 10%;
  top: 40%;
  transform: translateY(-50%);
}
.button-fastening{
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
}
.button-ordering{
  position: absolute;
  right: 10%;
  top: 60%;
  transform: translateY(-50%);
}
.frameIMG{
  width: 100px;
  height: 100px;
  border-radius: 10px;
  cursor: pointer;
}
.frameIMG:hover{
  background-color: #babcc2;
}
</style>