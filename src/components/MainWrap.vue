<template>
  <div class="buttons-block">
    <div class="block-wrap">
      <el-button class="card-button button-form" @click="toDrawPage">форма</el-button>
      <!-- <button class="button-frame">рамка</button> -->

      <el-popover
          v-if="widthScreen > 570"
          ref="popoverFrame"
          placement="left-start"
          :width="frameIndex == 0 || frameIndex == 2 ? 300 : 150"
          trigger="click"
          content="this is content, this is content, this is content"
      >
        <template #reference>
          <el-button class="card-button button-frame">Рама</el-button>
        </template>
        <div style="display: flex;">

          <div style="display: flex; flex-direction: column; align-items: center">
            <div v-if="frameIndex == 0 || frameIndex == 2" style="display: flex; flex-direction: column; align-items: center">
              <label for="height" class="smoothing-label">Высота</label>
              <input v-model="heightFrame" ref="rate" @input="inputHeight" type="range" id="height" min="5" max="30">
            </div>


            <div v-if="frameIndex == 2" style="display: flex; flex-direction: column; margin-top: 20px; align-items: center">
              <label for="height" class="smoothing-label">Ширина</label>
              <input v-model="widthFrame" ref="rate" @input="inputWidth" type="range" id="width" min="0" max="70">
            </div>


            <div v-if="frameIndex == 0 || frameIndex == 2" style="display: flex; flex-direction: column; margin-top: 20px; align-items: center">
              <label for="height" class="smoothing-label" style="margin-bottom: 10px">Цвет</label>
              <div style="display: flex; flex-direction: column">
                <div style="display: flex">
                  <el-button @click="setColor('treeD',)" style="background-color: #a37856; border-radius: 20px"></el-button>
                  <el-button @click="setColor('treeDO')" style="background-color: #c97d3f; border-radius: 20px"></el-button>
                  <el-button @click="setColor('treeDB')" style="background-color: #683323; border-radius: 20px"></el-button>
                </div>
                <div style="display: flex; justify-content: center;">
                  <el-button @click="setColor('treeDR')" style="background-color: #9a3b3b; border-radius: 20px"></el-button>
                  <el-button @click="setColor('treeDW')" style="background-color: #deb387; border-radius: 20px"></el-button>
                </div>
              </div>
            </div>
          </div>



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
        </div>

      </el-popover>
      <el-button class="card-button button-frame" @click="openFrames=true" v-else>Рама</el-button>
      <div class="floatingBlock" :style="openFrames ? 'bottom: -100px' : ''" v-if="widthScreen < 570">
        <div @click="openFrames=false" style="display: flex;justify-content: flex-end; margin-right: 15px;margin-top: 15px;font-size: 20px;">✖</div>
        <div class="frame-content-wrap" >
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
        <div class="range-block" style="display: flex;justify-content: center; margin-top: 30px">
          <div v-if="frameIndex == 0 || frameIndex == 2" style="width: 50%;display: flex; flex-direction: column;">
            <label for="height" class="smoothing-label">Высота</label>
            <input style="width: 50%;" v-model="heightFrame" ref="rate" type="range" id="height" min="10" max="30">
          </div>
          <div v-if="frameIndex == 2" style="width: 50%;display: flex; flex-direction: column;">
            <label for="width" class="smoothing-label">Ширина</label>
            <input style="width: 50%;" v-model="widthFrame" ref="rate" type="range" id="width" min="2" max="30">
          </div>
        </div>

      </div>
    </div>
    <div class="block-wrap">
      <el-button class="card-button button-fastening" @click="fastening">крепление</el-button>
      <el-button class="card-button button-ordering" @click="$emit('changeIndex',2)">оформление</el-button>
    </div>
  </div>

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
      currentColor:'treeD',
      sleep:false,

      widthFrame:5,
      heightFrame:20,

      widthScreen:window.innerWidth,
      openFrames: false,
      correctPath: [],
      startCoord:{},
      xGap:null,
      yGap:null,

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


        console.log(scene);
        renderer.renderLists.dispose();

        await this.createGeometry(false);
      }
    },
  },
  methods: {
    setColor(name){
      this.currentColor=name
      if(this.frameIndex == 2){
        let frame3 = scene.children.find(i=>i.name=="frame3")

        const loader = new THREE.TextureLoader();
        let textureFrame = loader.load('../../Texture/'+name+'.jpg')
        textureFrame.wrapS = textureFrame.wrapT = THREE.RepeatWrapping;
        textureFrame.repeat.set( 1 / 20, 1 / 10 );
        textureFrame.offset.set( 0.1, 0.1 );
        textureFrame.rotation = 1.55;

        let textureFrame1 = loader.load('../../Texture/'+name+'.jpg')
        textureFrame1.wrapS = textureFrame1.wrapT = THREE.RepeatWrapping;
        textureFrame1.repeat.set( 1 / 20, 1 / 10 );
        textureFrame1.offset.set( 0.1, 0.01 );
        textureFrame1.rotation = 0;

        let materials = [
          new THREE.MeshPhongMaterial( { map: textureFrame} ),
          new THREE.MeshPhongMaterial( { map: textureFrame1} )
        ]
        frame3.material = materials
      }
      else if(this.frameIndex == 0){
        let frame1 = scene.children.find(i=>i.name=="frame1")

        const loader = new THREE.TextureLoader();
        let textureFrame = loader.load('../../Texture/'+name+'.jpg')
        textureFrame.wrapS = textureFrame.wrapT = THREE.RepeatWrapping;
        textureFrame.repeat.set( 1 / 20, 1 / 10 );
        textureFrame.offset.set( 0.1, 0.1 );
        textureFrame.rotation = 1.55;

        let textureFrame1 = loader.load('../../Texture/'+name+'.jpg')
        textureFrame1.wrapS = textureFrame1.wrapT = THREE.RepeatWrapping;
        textureFrame1.repeat.set( 1 / 20, 1 / 10 );
        textureFrame1.offset.set( 0.1, 0.01 );
        textureFrame1.rotation = 0;

        let materials = [
          new THREE.MeshPhongMaterial( { map: textureFrame} ),
          new THREE.MeshPhongMaterial( { map: textureFrame1} )
        ]
        frame1.material = materials
      }



    },
    setTimeOut(){
      if(!this.sleep){
        this.sleep = true
        setTimeout(() => {
          this.sleep = false
          console.log("Delayed for 1 second.");
          let frame1 = scene.children.find(i=>i.name=="frame1")
          let frame3 = scene.children.find(i=>i.name=="frame3")
          let mirror = scene.children.find(i=>i.name=="mirror")
          let mirorBack = scene.children.find(i=>i.name=="MirorBack")

          let intermediateVar1 = (Math.abs(0.5-(this.heightFrame/10))*100) / 2.5
          let intermediateVar2 = (5.3 + (intermediateVar1/100 * 1.5))

          if(frame1){
            var shapeCURVE = new THREE.Shape();
            shapeCURVE.moveTo(this.startCoord.x, this.startCoord.y);
            let ARR = []
            for(let i=0; i<this.correctPath.length-1;i++){
              ARR.push(new THREE.Vector2(this.correctPath[i].x, this.correctPath[i].y),)
            }
            shapeCURVE.splineThru(ARR);
            let extrudeGeom2 = new THREE.ExtrudeGeometry( shapeCURVE, {
              curveSegments: 162,
              depth: this.heightFrame/10,
              bevelEnabled: false,  // Don't bevel the edges
            });
              frame1.geometry = extrudeGeom2

            mirror.position.x = (this.heightFrame/10)
            mirror.position.x = mirror.position.x - intermediateVar2
          }
          if(frame3){

            let points = []
            points.push(new THREE.Vector3( this.startCoord.x, this.startCoord.y, 0 ),)
            for(let i=0; i<this.correctPath.length-1;i++){
              points.push(new THREE.Vector3( this.correctPath[i].x, this.correctPath[i].y, 0 ),)
            }
            points.push(new THREE.Vector3( this.correctPath[0].x, this.correctPath[0].y, 0 ),)
            const curve = new THREE.CatmullRomCurve3(points)
            const extrudeSettings2 = {
              steps: 1400,
              bevelEnabled: true,
              bevelThickness: 1,
              bevelSegments: 10,
              bevelSize: 1,
              extrudePath: curve
            };
            let height = this.heightFrame/10
            let width = Math.abs(this.widthFrame/100 - 0.7)
            let  shape2 = new THREE.Shape();
            shape2.moveTo( 1-height,-0.8+width );
            shape2.lineTo( 1-height, 0.8-width );
            shape2.lineTo( 1.05-height, 0.9-width );
            shape2.lineTo( 1.1-height, 0.95-width );
            shape2.lineTo( 1.15-height, 1-width );
            shape2.lineTo( 1.5, 1-width );
            shape2.lineTo( 1.5, -1+width );
            shape2.lineTo( 1.15-height, -1+width );
            shape2.lineTo( 1.1-height, -0.95+width );
            shape2.lineTo( 1.05-height, -0.9+width );

            const geometry2 = new THREE.ExtrudeGeometry( shape2, extrudeSettings2 );
            frame3.geometry = geometry2

            mirorBack.position.x = (this.heightFrame/10)
            mirorBack.position.x = mirorBack.position.x - intermediateVar2-0.25

            mirror.position.x = (this.heightFrame/10)
            mirror.position.x = mirror.position.x - intermediateVar2-0.1
          }

        }, "600");
      }
    },
    inputWidth(){
      this.setTimeOut()
    },
    inputHeight(){
      this.setTimeOut()
    },
    addBackSurface(){
      var planeGeom = new THREE.PlaneGeometry(40, 40);
      var planeMtl = new THREE.MeshPhongMaterial({
        color: 0x89bdd3
      });
      var plane = new THREE.Mesh(planeGeom, planeMtl);
      plane.receiveShadow = true;
      plane.castShadow = true;
      plane.rotation.x = -Math.PI/2;
      plane.rotation.y = Math.PI/2;
      plane.position.set(-4.99, -5, 0);
      scene.add(plane);

    },
    toDrawPage(){
      this.$refs.popoverFrame ? this.$refs.popoverFrame.hide() : null
      this.$emit('changeIndex',0)
    },
    fastening(){
      this.$refs.popoverFrame ? this.$refs.popoverFrame.hide() : null


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

      const light5 = new THREE.HemisphereLight(0xFFFFFF, 0xB97A20, 0.5);
      scene.add(light5);


      const light4 = new THREE.PointLight( 0xffffff, 0.2 );
      light4.position.copy( this.camera.position );
      light4.position.x = -30
      light4.position.y = -50
      light4.position.z = -5
      console.log(light4)



      const light = new THREE.PointLight( 0xffffff, 0.6 );
      light.position.copy( this.camera.position );
      light.position.x = 100
      light.position.y = 150
      light.position.z = -5

      const light2 = new THREE.PointLight( 0xffffff,0.3 );
      light2.position.copy( this.camera.position );
      light2.position.x = -40
      light2.position.y = -50
      light2.position.z = 30

      var spotLight = new THREE.PointLight( 0xffffff, 0.4);
      spotLight.position.set( 15, -20, 10 );
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 4000;
      spotLight.shadow.mapSize.height = 4000;

      scene.add( spotLight );
      //scene.add( light2 );
      //scene.add( light );
      scene.add( light4 );
    },
    onMouseMoveT(){
      event.preventDefault();
    },
    // Create a display object and material
    createGeometry(render3Dmodel = true) {

      console.log(this.pathCurve);
      //let path = new THREE.Shape();
      this.startCoord={}
      this.correctPath=[]



      //координаты в начало
      let xMin = this.xGap = this.pathCurve[0].curve.points[0].x
      let yMin = this.yGap = this.pathCurve[0].curve.points[0].y

      for(let i=0; i<this.pathCurve.length;i++){
        if(this.pathCurve[i].curve.points[3].x < xMin){
          xMin = this.pathCurve[i].curve.points[3].x
        }
        if(this.pathCurve[i].curve.points[3].y < yMin){
          yMin = this.pathCurve[i].curve.points[3].y
        }
      }
      console.log(xMin, yMin);


      for(let i=0; i<this.pathCurve.length;i++){
        let item = {}
        item.x = (this.pathCurve[i].curve.points[3].x - (xMin))/10
        item.y = (this.pathCurve[i].curve.points[3].y - (yMin))/10
        this.correctPath.push(item)
      }


      this.startCoord.x = (this.pathCurve[0].curve.points[0].x - (xMin))/10
      this.startCoord.y = (this.pathCurve[0].curve.points[0].y - (yMin))/10



      var shapeCURVE = new THREE.Shape();

      shapeCURVE.moveTo(this.startCoord.x,this.startCoord.y);
      let ARR = []
      for(let i=0; i<this.correctPath.length-1;i++){
        //path.bezierCurveTo(this.pathCurve[i].curve.points[1].x / 10, this.pathCurve[i].curve.points[1].y / 10, this.pathCurve[i].curve.points[2].x / 10, this.pathCurve[i].curve.points[2].y / 10, this.pathCurve[i].curve.points[3].x / 10, this.pathCurve[i].curve.points[3].y / 10 );
        ARR.push(new THREE.Vector2(this.correctPath[i].x, this.correctPath[i].y),)
      }
      console.log(ARR)
      shapeCURVE.splineThru(ARR);


      const mirrirSurface = new THREE.ShapeGeometry( shapeCURVE,100 );

      let verticalMirror = new Reflector( mirrirSurface, {
        clipBias: 0.002,
        color: 0x889999
      } );

      verticalMirror.position.x=-2.2-this.heightFrame/10
      verticalMirror.position.y=-14
      verticalMirror.position.z=8

      verticalMirror.rotation.y=1.57

      verticalMirror.scale.x=0.4
      verticalMirror.scale.y=0.4
      verticalMirror.scale.z=0.4
      verticalMirror.name='mirror'
      scene.add( verticalMirror );




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
            root.receiveShadow = true;
            root.castShadow = true;
            scene.add(gltf);
            this.preloader = false
            console.log('good4')
          });
          // });



        }


    },
    // Create a render
    createRender() {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xb9d3ff, 1); // Set background color
      renderer.shadowMap.enabled = true;
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
      //console.log(event)
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
    setMirorBack(){
      var shapeCURVE = new THREE.Shape();

      shapeCURVE.moveTo(this.startCoord.x,this.startCoord.y);
      let ARR = []
      for(let i=0; i<this.correctPath.length-1;i++){
        ARR.push(new THREE.Vector2(this.correctPath[i].x, this.correctPath[i].y),)
      }
      shapeCURVE.splineThru(ARR);

      let extrudeGeom2 = new THREE.ExtrudeGeometry( shapeCURVE, {
        curveSegments: 162,
        depth: 0.3,
        bevelEnabled: false,  // Don't bevel the edges
      });

      var materialMir = new THREE.MeshBasicMaterial( { color: 0x969ea6 } );



      let intermediateVar1 = (Math.abs(0.5-(this.heightFrame/10))*100) / 2.5
      let intermediateVar2 = (5.3 + (intermediateVar1/100 * 1.5))

      let meshFormMir = new THREE.Mesh( extrudeGeom2, materialMir ) ;
      meshFormMir.position.x=-4.4
      meshFormMir.position.y=-14
      meshFormMir.position.z=8

      meshFormMir.rotation.y=1.57

      meshFormMir.scale.x=0.4
      meshFormMir.scale.y=0.4
      meshFormMir.scale.z=0.4
      meshFormMir.name = 'MirorBack'
      meshFormMir.receiveShadow = true;
      meshFormMir.castShadow = true;

      console.log(this.frameIndex)

      if(this.frameIndex != 1){
        meshFormMir.position.x = (this.heightFrame/10)
        meshFormMir.position.x = meshFormMir.position.x - intermediateVar2-0.2
      }

      scene.add( meshFormMir );
    },
    removeMeshes(){
      for (let i = scene.children.length - 1; i >= 0; i--) {
        if(scene.children[i].type === "Mesh"){
          console.log(scene.children[i].material);
          scene.children[i].geometry.dispose();
          if(scene.children[i].material.length){
            scene.children[i].material[0].dispose();
            scene.children[i].material[1].dispose();
          } else {
            scene.children[i].material.dispose();
          }
          scene.remove(scene.children[i]);
        }

      }
    },
    setFrame1(){
      const MirorBack = scene.getObjectByProperty( 'name', "MirorBack" );
      if(MirorBack){
        MirorBack.geometry.dispose();
        MirorBack.material.dispose();
        scene.remove( MirorBack );
      }

      this.removeMeshes()
      this.addBackSurface()
      this.frameIndex = 0
      var shapeCURVE = new THREE.Shape();

      shapeCURVE.moveTo(this.startCoord.x, this.startCoord.y);
      let ARR = []
      for(let i=0; i<this.correctPath.length-1;i++){
        ARR.push(new THREE.Vector2(this.correctPath[i].x, this.correctPath[i].y),)
      }
      shapeCURVE.splineThru(ARR);

      const loader = new THREE.TextureLoader();
      let extrudeGeom2 = new THREE.ExtrudeGeometry( shapeCURVE, {
        curveSegments: 162,
        depth: this.heightFrame/10,
        bevelEnabled: false,  // Don't bevel the edges
      });

      let textureFrame = loader.load('../../Texture/'+this.currentColor+'.jpg')
      textureFrame.wrapS = textureFrame.wrapT = THREE.RepeatWrapping;
      textureFrame.repeat.set( 1 / 20, 1 / 10 );
      textureFrame.offset.set( 0.1, 0.1 );
      textureFrame.rotation = 1.55;

      let textureFrame1 = loader.load('../../Texture/'+this.currentColor+'.jpg')
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

      meshForm.name='frame1'

      meshForm.position.x=-5.05
      meshForm.position.y=-14
      meshForm.position.z=8

      meshForm.rotation.y=1.57

      meshForm.scale.x=0.4
      meshForm.scale.y=0.4
      meshForm.scale.z=0.4
      meshForm.receiveShadow = true;
      meshForm.castShadow = true;
      scene.add( meshForm );

      let mirror = scene.children.find(i=>i.name=="mirror")
      let intermediateVar1 = (Math.abs(0.5-(this.heightFrame/10))*100) / 2.5
      let intermediateVar2 = (5.3 + (intermediateVar1/100 * 1.5))

      mirror.position.x = (this.heightFrame/10)
      mirror.position.x = mirror.position.x - intermediateVar2

    },
    setFrame2(){
      this.frameIndex = 1
      this.removeMeshes()
      this.setMirorBack()
      this.addBackSurface()
    },
    setFrame3(){

      this.removeMeshes()
      this.setMirorBack()
      this.addBackSurface()
      this.frameIndex = 2

      const loader = new THREE.TextureLoader();
      let textureFrame = loader.load('../../Texture/'+this.currentColor+'.jpg')
      textureFrame.wrapS = textureFrame.wrapT = THREE.RepeatWrapping;
      textureFrame.repeat.set( 1 / 20, 1 / 10 );
      textureFrame.offset.set( 0.1, 0.1 );
      textureFrame.rotation = 1.55;

      let textureFrame1 = loader.load('../../Texture/'+this.currentColor+'.jpg')
      textureFrame1.wrapS = textureFrame1.wrapT = THREE.RepeatWrapping;
      textureFrame1.repeat.set( 1 / 20, 1 / 10 );
      textureFrame1.offset.set( 0.1, 0.01 );
      textureFrame1.rotation = 0;

      let materials = [
        new THREE.MeshPhongMaterial( { map: textureFrame} ),
        new THREE.MeshPhongMaterial( { map: textureFrame1} )
      ]

      let points = []

      points.push(new THREE.Vector3( this.startCoord.x, this.startCoord.y, 0 ),)
      for(let i=0; i<this.correctPath.length-1;i++){
        points.push(new THREE.Vector3( this.correctPath[i].x, this.correctPath[i].y, 0 ),)
      }
      points.push(new THREE.Vector3( this.correctPath[0].x, this.correctPath[0].y, 0 ),)

      const curve = new THREE.CatmullRomCurve3(points)

      const extrudeSettings2 = {
        steps: 1400,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSegments: 10,
        bevelSize: 1,
        extrudePath: curve
      };
      let height = this.heightFrame/10

      let  shape2 = new THREE.Shape();
      let width = Math.abs(this.widthFrame/100 - 0.7)
      shape2.moveTo( 1-height,-0.8+width );
      shape2.lineTo( 1-height, 0.8-width );
      shape2.lineTo( 1.05-height, 0.9-width );
      shape2.lineTo( 1.1-height, 0.95-width );
      shape2.lineTo( 1.15-height, 1-width );
      shape2.lineTo( 1.5, 1-width );
      shape2.lineTo( 1.5, -1+width );
      shape2.lineTo( 1.15-height, -1+width );
      shape2.lineTo( 1.1-height, -0.95+width );
      shape2.lineTo( 1.05-height, -0.9+width );

      const geometry2 = new THREE.ExtrudeGeometry( shape2, extrudeSettings2 );

      const mesh2 = new THREE.Mesh( geometry2, materials );
      mesh2.position.x=-4.5
      mesh2.position.y=-14
      mesh2.position.z=8

      mesh2.rotation.y=1.57

      mesh2.scale.x=0.4
      mesh2.scale.y=0.4
      mesh2.scale.z=0.4
      mesh2.name='frame3'
      mesh2.receiveShadow = true;
      mesh2.castShadow = true;
      scene.add( mesh2 );

    }
  },
};
</script>

<style scoped>
input[type=range] {
  width: 80%;
}
.card-button{
  width: 140px;
}
.floatingBlock{
  width: 100%;
  height: 360px;
  left: 0px;
  bottom: -400px;
  background-color: white;
  position: absolute;
  z-index: 5;
  transition: all 1s;
}
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
  right: 5%;
  top: 30%;
  transform: translateY(-50%);
}
.button-frame{
  position: absolute;
  right: 5%;
  top: 40%;
  transform: translateY(-50%);
}
.button-fastening{
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
}
.button-ordering{
  position: absolute;
  right: 5%;
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
@media (max-width: 570px) {
  .frame-content-wrap{
    display: flex;
    justify-content: space-evenly;
    flex-direction: row;
  }
  .block-wrap{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .buttons-block{
    display: flex;
    width: 100%;
    position: absolute !important;
    bottom: 5%;
    height: 13%;
    justify-content: space-evenly;
  }
  .button-ordering{
    position: relative;
    right: 0;
    top: 0;
    transform: translateY(0);
    margin: 0;
}
.button-frame{
    position: relative;
    right: 0;
    top: 0;
    transform: translateY(0);
    margin: 0;
}
.button-fastening{
    position: relative;
    right: 0;
    top: 0;
    transform: translateY(0);
    margin: 0;
}
.button-form{
    position: relative;
    right: 0;
    top: 0;
    transform: translateY(0);
    margin: 0;
}
}
</style>