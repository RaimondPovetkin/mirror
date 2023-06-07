<!--console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');-->
<template>
  <div style="margin-top: 15px; margin-bottom: 15px;">
  </div>
  <div style=" display: flex; justify-content: center;">
    <div  style="height: 80%; width: 45%;" >
    <canvas key=countRerender :width="calcWidth()" :height="calcHeight()" :id="canvasId" class="canvas-style" resize="true" v-on:mousedown="mouseDown"/>
    <!-- 1162 500    1745 -->
    <!-- <canvas key=countRerender width="568" height="500" :id="canvasId" class="canvas-style" resize="true" v-on:mousedown="mouseDown"/> 860-->
  </div>
  <div class="buttons-block">
    <div class="buttons-wrap">
      <el-button @click="clearPaper" class="btn-wrap btn-tool">
      <el-icon :size="20" style="margin-top: -5px; margin-right: 3px;">
        <Delete />
      </el-icon>
      ОЧИСТИТЬ</el-button>
    <el-button @click="back" class="btn-wrap btn-tool">
      <el-icon :size="20" style="margin-top: -5px; margin-right: 3px;">
        <Undo />
      </el-icon>
      НАЗАД
    </el-button>
    <el-button @click="forward" class="btn-wrap btn-tool">
      <el-icon :size="20" style="margin-top: -5px; margin-right: 3px;">
        <Redo />
      </el-icon>
      ВПЕРЁД
    </el-button>
    <el-button @click="changeScale" class="btn-wrap btn-tool">
      <el-icon :size="20" style="margin-top: -5px; margin-right: 3px;">
        <ArrowExpand />
      </el-icon>
      МАСШТАБ
    </el-button>

      <el-button @click="rotateHandler" class="btn-wrap btn-tool">
        <el-icon :size="20" style="margin-top: -5px; margin-right: 3px;">
          <ArrowExpand />
        </el-icon>
        Поворот
      </el-button>

      <el-button @click="curveEditorHandler" class="btn-wrap btn-tool">
        <el-icon :size="20" style="margin-top: -5px; margin-right: 3px;">
          <VectorCurve />
        </el-icon>
        КРИВЫЕ {{ curveEditorMode }}
      </el-button>

    <div style=" display: flex; flex-direction: column;">
      <label for="volume">СГЛАЖИВАНИЕ</label>
      <input type="range" id="volume" name="volume" min="2" max="30" :disabled="!dragMode || fewSegments" v-model="simpValue">
      
    </div>

    <el-button @click="goToDrawPage">
        NEXT
      </el-button>
    </div>



  </div>
  </div>

</template>

<script>
import Undo from 'vue-material-design-icons/Undo.vue';
import Redo from 'vue-material-design-icons/Redo.vue';
import Delete from 'vue-material-design-icons/Delete.vue';
import ArrowExpand from 'vue-material-design-icons/ArrowExpand.vue';
import VectorCurve from 'vue-material-design-icons/VectorCurve.vue';
const paper = require('paper');
export default {
  name: "CanvasPaper",
  components: {
    Undo, Redo, Delete, ArrowExpand, VectorCurve
  },
  props: {
    canvasId:String,
    clear: Boolean,
    dragMode: Boolean,
  },
  emits: ['clearCanvas', 'clearSimp', 'clearHandler', 'nextButton'],
  data: () => ({
    countRerender:1,

    simpArr: null,
    pathHistory: [],
    currentIndex: 0,

    pathExtra:null,

    curveEditorMode: false,
    scaleMode: false,
    strokeScaleNumber: null,
    cornerScale: null,

    simpValue: 2,
    fewSegments: false,
    segment: null,
    segmentDot: null,
    segmentPointNumber: 0,
    movePath: false,
    path2: null,
    hitOptions: {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: 10
    },


    crossed: false,
    loop: 0,
    currentArr: [],
    crossedArr: [],
    FinArr: [],
    startCoord: {
      x: null,
      y: null,
    },
    path: null,
    scope: null,
    finishArr: []
  }),
  methods: {
    rotateHandler(){
      console.log(this.scope.project._children[0]._children.find(i=>i.className == "Path"))
      let path = this.scope.project._children[0]._children.find(i=>i.className == "Path")
      let radius = path.bounds.width > path.bounds.height ? path.bounds.width/2 : path.bounds.height/2

          let shape = new paper.Shape.Circle({
        center: [path.position.x, path.position.y],
        radius: radius,
        strokeColor: 'black'
      });
      shape.name = 'rotate'
    },
    curveEditorHandler(){
      let self = this;
      if(this.curveEditorMode){
        self.path.fullySelected = false;
        this.curveEditorMode = false
        this.deleteMiniPathCircles()
        this.drawCircles()
      } else {
        if(this.scaleMode){
          this.changeScale()
        }
        self.path.fullySelected = true;
        this.drawCirclesCurves()
        this.curveEditorMode = true
        this.deletePathCircles()
      }
    },
    goToDrawPage(){
      this.scope.project._children[0]._children.find(i=>i.className == "Path").flatten(1);
      this.$emit('nextButton',this.scope.project._children[0]._children.find(i=>i.className == "Path").segments)
    },
    toNormalSizeChildren(){
      //this.scope.project._children[0]._children.find(i=>i.id == hitResult.item.id).radius = 20
      for(let i=0; i< this.scope.project._children[0]._children.length;i++){
        if(this.scope.project._children[0]._children[i].type == "circle" && this.scope.project._children[0]._children[i].radius > 5){
          this.scope.project._children[0]._children[i].radius = 10
        } else if(!this.scope.project._children[0]._children[i].type){
          this.scope.project._children[0]._children.find(i=>i.className == "Path").strokeWidth = 1
        }
      }
    },  
    deleteScaleRectangle(){
      var children = this.scope.project.activeLayer.children;
      if(children['csaleRectangle'] && children['topLeft'] && children['topRight'] && children['bottomLeft'] && children['bottomRight']){
        children['csaleRectangle'].remove()
        children['topLeft'].remove()
        children['topRight'].remove()
        children['bottomLeft'].remove()
        children['bottomRight'].remove()
      }
    },
    drawScaleRectangle(){

      let pathGeneral = this.scope.project._children[0]._children.find(i=>i.className == "Path")
      let topLeft = pathGeneral.bounds

      var rectangle = new paper.Rectangle(new paper.Point(topLeft.topLeft.x, topLeft.topLeft.y), new paper.Size(topLeft.width, topLeft.height));
      var path = new paper.Path.Rectangle(rectangle);
      path.name = 'csaleRectangle'
      path.strokeColor = 'black';
      path.dashArray = [10, 12];

      var topLeftShape = new paper.Shape.Circle(new paper.Point(pathGeneral.bounds.topLeft.x,pathGeneral.bounds.topLeft.y), 5);
      topLeftShape.name = 'topLeft'
      topLeftShape.strokeColor = 'rgba(0,38,32,0.5)';
      topLeftShape.fillColor = 'rgba(0,255,217,0.2)';

      var topRightShape = new paper.Shape.Circle(new paper.Point(pathGeneral.bounds.topRight.x,pathGeneral.bounds.topRight.y), 5);
      topRightShape.name = 'topRight'
      topRightShape.strokeColor = 'rgba(0,38,32,0.5)';
      topRightShape.fillColor = 'rgba(0,255,217,0.2)';

      var bottomLeftShape = new paper.Shape.Circle(new paper.Point(pathGeneral.bounds.bottomLeft.x,pathGeneral.bounds.bottomLeft.y), 5);
      bottomLeftShape.name = 'bottomLeft'
      bottomLeftShape.strokeColor = 'rgba(0,38,32,0.5)';
      bottomLeftShape.fillColor = 'rgba(0,255,217,0.2)';

      var bottomRightShape = new paper.Shape.Circle(new paper.Point(pathGeneral.bounds.bottomRight.x,pathGeneral.bounds.bottomRight.y), 5);
      bottomRightShape.name = 'bottomRight'
      bottomRightShape.strokeColor = 'rgba(0,38,32,0.5)';
      bottomRightShape.fillColor = 'rgba(0,255,217,0.2)';
    },
    calcHeight(){
      return (document.body.clientWidth / 100) * 42
    },
    calcWidth(){
      let num = (document.body.clientWidth / 100) * 64
      return document.body.clientWidth - num
    },
    deleteMiniPathCircles(){
      while(this.scope.project.activeLayer.children['circlePahtMini']){
        this.scope.project.activeLayer.children['circlePahtMini'].remove()
      }
    },
    deletePathCircles(){
      while(this.scope.project.activeLayer.children['circlePaht']){
        this.scope.project.activeLayer.children['circlePaht'].remove()
      }
    },
    changeScale(){
      if(this.scaleMode) {
        this.scaleMode = false
        var children = this.scope.project.activeLayer.children;
        children['csaleRectangle'].remove()
        children['topLeft'].remove()
        children['topRight'].remove()
        children['bottomLeft'].remove()
        children['bottomRight'].remove()
        this.drawCircles()
      } else {
        this.scaleMode = true

        this.deleteScaleRectangle()

        this.drawScaleRectangle()

        this.deletePathCircles()
        let self = this;
        self.path.fullySelected = false;
        this.curveEditorMode = false
        this.deleteMiniPathCircles()
        self.path.selected = false;
      }
        console.log(this.scope.project);
    },
    forward(){
      this.scaleMode = false
      if(this.currentIndex<this.pathHistory.length-1){
        this.currentIndex++
        if(this.pathHistory[this.currentIndex] && this.pathHistory[this.currentIndex].simplify){
          this.forward()
        } else {
          this.$emit('clearSimp')
          self.path = new paper.Path(this.pathHistory[this.currentIndex].data)
          self.path.strokeColor = 'black';
          self.path.fillColor = 'red';
          self.path.closed = true;
        }
      }
    },
    drawCirclesCurves(){
      if(!this.scaleMode){
        let path = this.scope.project._children[0]._children.find(i=>i.className == "Path")
        console.log(path)
        if(path._segments){
          for(let i=0 ; i<path._segments.length ; i++){

            var shape192 = new paper.Shape.Circle(new paper.Point(path._segments[i].curve.points[1].x,path._segments[i].curve.points[1].y), 3);
            shape192.name = 'circlePahtMini';
            shape192.fillColor = 'rgba(0,157,236)';

            var shape145 = new paper.Shape.Circle(new paper.Point(path._segments[i].curve.points[2].x,path._segments[i].curve.points[2].y), 3);
            shape145.name = 'circlePahtMini';
            shape145.fillColor = 'rgba(0,157,236)';
          }
        }
        console.log(path)
        if(path._segments.length>3){
          this.fewSegments = false
        } else {
          this.fewSegments = true
        }
      }
    },
    drawCircles(){
      if(!this.scaleMode){
        let path = this.scope.project._children[0]._children.find(i=>i.className == "Path")
        console.log(path)
        if(path._segments){
          for(let i=0 ; i<path._segments.length ; i++){
            var shape19 = new paper.Shape.Circle(new paper.Point(path._segments[i].point.x,path._segments[i].point.y), 10);
            shape19.strokeColor = 'rgba(0,38,32,0.5)';
            shape19.name = 'circlePaht';
            shape19.fillColor = 'rgba(0,255,217,0.2)';
          }
        }
        console.log(path)
        if(path._segments.length>3){
          this.fewSegments = false
        } else {
          this.fewSegments = true
        }
      }
    },
    clearPaper(){
      this.simpArr= null
      this.pathHistory= []
      this.currentIndex= 0
      this.scaleMode = false
      this.curveEditorMode = false
      this.simpValue = 2
      this.$emit('clearHandler')
    },
    back(){
      this.scaleMode = false
      this.curveEditorMode = false
      if(this.currentIndex>0){
        this.currentIndex--
        if(this.pathHistory[this.currentIndex-1] && this.pathHistory[this.currentIndex-1].simplify){
          this.back()
        } else {
          let self = this;
          this.$emit('clearSimp')
          self.path = new paper.Path(this.pathHistory[this.currentIndex].data)
          self.path.strokeColor = 'black';
          self.path.fillColor = 'red';
          //self.path.simplify(1);
          self.path.closed = true;
          if(this.simpValue>0){
            //self.path.simplify(this.simpValue);
          }
        }
      }
    },
    cutCrossings(readyPointsGo){

      let routNumbers=[]
      // первое нахождение пересечений в массиве
      for(let i=0; i<this.crossedArr.length; i++){
        let distanceTotal = 10000
        let index = null
        for(let j=0; j<readyPointsGo.length; j++){
          let distanceX = Math.abs(readyPointsGo[j].x - this.crossedArr[i]._point.x)
          let distanceY = Math.abs(readyPointsGo[j].y - this.crossedArr[i]._point.y)
          if(distanceY + distanceX < distanceTotal) {
            distanceTotal = distanceY + distanceX
            index = j
          }
        }
        routNumbers.push({firstIndex:index, indexCross:i, point:{x:this.crossedArr[i]._point.x, y:this.crossedArr[i]._point.y}})
        readyPointsGo[index].cross = true
        readyPointsGo[index].crossIndex = i
      }

      // второе нахождение пересечений в массиве
      for(let i=0; i<this.crossedArr.length; i++){
        let distanceTotal = 10000
        let index = null
        let agreeableIndex = true
        for(let j=0; j<readyPointsGo.length; j++){
          agreeableIndex = true
          if(readyPointsGo[j+1]){
            if(readyPointsGo[j+1].cross){
              agreeableIndex = false
            }
          }
          if(readyPointsGo[j-1]){
            if(readyPointsGo[j-1].cross){
              agreeableIndex = false
            }
          }
          if(!readyPointsGo[j].cross && agreeableIndex){
            let distanceX = Math.abs(readyPointsGo[j].x - this.crossedArr[i]._point.x)
            let distanceY = Math.abs(readyPointsGo[j].y - this.crossedArr[i]._point.y)
            if(distanceY + distanceX < distanceTotal) {
              distanceTotal = distanceY + distanceX
              index = j
            }
          }
        }
        if(readyPointsGo[index]){
          readyPointsGo[index].crossDouble = true
          readyPointsGo[index].crossIndex = i
          routNumbers.find(k=>k.indexCross == i).secondIndex=index
        }
      }
      // нахождение точек между пересечениями
      for(let i=0;i<routNumbers.length;i++){
        routNumbers[i].count = Math.abs(routNumbers[i].firstIndex - routNumbers[i].secondIndex)
      }
      // нахождение начальной и конечной линии
      let nArr = JSON.parse(JSON.stringify(readyPointsGo))
      nArr.reverse()

      routNumbers.push({
        count: nArr.indexOf(nArr.find(i=>i.crossIndex !== undefined)) + readyPointsGo.indexOf(readyPointsGo.find(i=>i.crossIndex !== undefined)),
        end: readyPointsGo.length - nArr.indexOf(nArr.find(i=>i.crossIndex !== undefined))-1,
        start: readyPointsGo.indexOf(readyPointsGo.find(i=>i.crossIndex !== undefined))
      })

      // нахождение минимального пересечения
      let minCount=Infinity
      let minCountIdx=null
      for(let i=0;i<routNumbers.length;i++){
        if(routNumbers[i].count < minCount){
          minCount = routNumbers[i].count
          minCountIdx = i
        }
      }

      // режем массив
      let cutPointsArray = JSON.parse(JSON.stringify(readyPointsGo))

      if(minCountIdx == routNumbers.length-1){
        console.log('хвостик')
        cutPointsArray.splice(0,routNumbers[routNumbers.length-1].start+1)
        cutPointsArray.splice(routNumbers[routNumbers.length-1].end - routNumbers[routNumbers.length-1].start,10000)
      } else {
        console.log('петля')
        cutPointsArray.splice(Math.min(routNumbers[minCountIdx].firstIndex,routNumbers[minCountIdx].secondIndex), minCount+1, routNumbers[minCountIdx].point);
      }

      this.FinArr = cutPointsArray







      self.path = new paper.Path()

      for(let i=0; i<this.FinArr.length; i++){
        self.path.add(new paper.Point(this.FinArr[i].x, this.FinArr[i].y));
      }
      self.path.closed = true;

      this.crossedArr = self.path.getCrossings(self.path)

      if(this.crossedArr.length == 0 ||
          (
              this.crossedArr.length ==1 &&
              this.crossedArr[0]._point.x == this.FinArr[this.FinArr.length-1].x &&
              this.crossedArr[0]._point.y == this.FinArr[this.FinArr.length-1].y
          )
      ) {
        console.log('last')
      } else {
        this.loop++
        this.cutCrossings(this.FinArr)
      }


      return cutPointsArray

    },
    getCrossIndex(Arr,x,y){
      let distanceTotal = 10000
      let index = null
      for(let i=0; i<Arr.length; i++){
        let distanceX = Math.abs(Arr[i].x - x)
        let distanceY = Math.abs(Arr[i].y - y)
        if(distanceY + distanceX < distanceTotal) {
          distanceTotal = distanceY + distanceX
          index = i
        }
      }
      return index
    },
    reset() {
      this.scope.project.activeLayer.removeChildren();
    },
    pathCreate(scope) {
      scope.activate();
      return new paper.Path({

        strokeColor: "rgb(77,77,77)",
        strokeJoin: 'round',
        strokeWidth: 2,
      })
    },



    createTool(scope) {
      scope.activate();
      return new paper.Tool();
    },
    mouseDown() {
      let self = this;
      if(!this.dragMode){
        if (this.path) {
          //this.path.selected = false;
        }
        this.tool = this.createTool(this.scope);
      }
      this.tool.onMouseDown = (event) => {
        this.strokeScaleNumber = null
        this.cornerScale = null
        if(!this.dragMode) {
          self.path = self.pathCreate(self.scope);
          self.path.add(event.point);
        } else {
          if(this.scaleMode){

            this.path2 = null;
            let hitResult = this.scope.project.hitTest(event.point, this.hitOptions);
            if(hitResult && hitResult.type == 'stroke' && hitResult.item.name == "csaleRectangle"){
              this.strokeScaleNumber = hitResult.item.curves.findIndex(i=>i.point1.x == hitResult.location.curve.point1.x && i.point1.y == hitResult.location.curve.point1.y)
              this.path2 = this.scope.project._children[0]._children.find(i=>i.className == "Path")
            }
            if(hitResult && hitResult.type == 'fill'){
              this.path2 = hitResult.item
            }
            let frameCircles = this.scope.project.activeLayer.children.filter(i=>i.name && i.type == 'circle')
            let index = null
            let distanceTotal = 10000
            for(let i=0; i<frameCircles.length; i++){
              let distanceX = Math.abs(event.point.x - frameCircles[i].position.x)
              let distanceY = Math.abs(event.point.y - frameCircles[i].position.y)
              if(distanceY + distanceX < distanceTotal) {
                distanceTotal = distanceY + distanceX
                index = i
              }
            }
            if(distanceTotal<40){
              let currr = frameCircles[index]
              this.cornerScale = currr.name
              this.path2 = this.scope.project._children[0]._children.find(i=>i.className == "Path")
            }
            if(!this.path2){
              this.changeScale()
            }
          } else {


          this.segment = null;
          this.path2 = null;
          this.segmentDot = null;
          this.segmentPointNumber = 0
          let hitResult = this.scope.project.hitTest(event.point, this.hitOptions);

          if (!hitResult){
            this.curveEditorHandler()
            return;
          }

          if (event.modifiers.shift) {
            if (hitResult.type == 'segment') {
              hitResult.segment.remove();
            }
            return;
          }


          if (hitResult) {
            this.path2 = hitResult.item;
            if(hitResult.type == 'fill' || hitResult.item._type == "circle"){
              this.path2 = this.scope.project._children[0]._children.find(i=>i.className == "Path")



              if(hitResult.item._type == "circle"){
                if(hitResult.item.radius == 3){

                  let index = null
                  let distanceTotal = 10000
                  for(let i=0; i<this.path2._segments.length; i++){
                    let distanceX = Math.abs(hitResult.item.position.x - this.path2._segments[i].curve.points[1].x)
                    let distanceY = Math.abs(hitResult.item.position.y - this.path2._segments[i].curve.points[1].y)
                    if(distanceY + distanceX < distanceTotal) {
                      distanceTotal = distanceY + distanceX
                      this.segmentPointNumber = 1
                      index = i
                    }

                    distanceX = Math.abs(hitResult.item.position.x - this.path2._segments[i].curve.points[2].x)
                    distanceY = Math.abs(hitResult.item.position.y - this.path2._segments[i].curve.points[2].y)
                    if(distanceY + distanceX < distanceTotal) {
                      distanceTotal = distanceY + distanceX
                      this.segmentPointNumber = 2
                      index = i
                    }
                  }
                  this.segmentDot = this.path2._segments[index]



                } else {
                  let index = null
                  let distanceTotal = 10000
                  for(let i=0; i<this.path2._segments.length; i++){
                    let distanceX = Math.abs(hitResult.item.position.x - this.path2._segments[i].point.x)
                    let distanceY = Math.abs(hitResult.item.position.y - this.path2._segments[i].point.y)
                    if(distanceY + distanceX < distanceTotal) {
                      distanceTotal = distanceY + distanceX
                      index = i
                    }
                  }
                  this.segment = this.path2._segments[index]
                }
              }
            }



            if (hitResult.type == 'segment') {
              this.segment = hitResult.segment;
            } else if (hitResult.type == 'stroke' && hitResult.item._type != "circle") {
              console.log(hitResult)
              let location = hitResult.location;
              this.segment = this.path2.insert(location.index + 1, event.point);
              //this.path2.smooth();
            }


            // if(hitResult.item._type == "circle"){
            //   this.path2 = this.scope.project._children[0]._children[0]
            //   this.segment = this.path2._segments.find(i=>i.point.x == hitResult.item.position.x && i.point.y == hitResult.item.position.y)
            // }
            // console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');
            // console.log(this.segment)
          }


          this.movePath = hitResult.type == 'fill';
          if (this.movePath)
            this.scope.project.activeLayer.addChild(hitResult.item);
            }
        }
      };


      this.tool.onMouseMove= (event) => {
        this.toNormalSizeChildren()
        //this.scope.project.activeLayer.selected = false;
        // if (event.item){
        //   event.item.selected = true;
        // }
        let hitResult = this.scope.project.hitTest(event.point, this.hitOptions);
        if(hitResult && hitResult.item.type == 'circle' && hitResult.item.radius == 10){
          this.scope.project._children[0]._children.find(i=>i.id == hitResult.item.id).radius = 15
        } else if(hitResult && hitResult.type == 'stroke' && !this.scaleMode) {
          this.scope.project._children[0]._children.find(i=>i.className == "Path").strokeWidth = 3;
        }
      }

      this.tool.onMouseDrag = (event) => {

        this.deletePathCircles()
        this.deleteMiniPathCircles()
        if(this.curveEditorMode){
          self.path.fullySelected = true;
        }

        if(!this.dragMode) {

          self.path.add(event);
          self.path.fillColor = '#efefef';

          if (this.crossedArr.length) {
            this.crossed = true
          }
        } else {
          if(this.scaleMode){
            if(this.cornerScale){
              switch(this.cornerScale) {
                case 'topRight':
                  if((event.delta.x > 0 && event.delta.y < 0) || (event.delta.x < 0 && event.delta.y > 0)){
                    event.delta.x > 0 ? this.path2.scale(1.02, 1) : this.path2.scale(0.98, 1)
                    event.delta.y < 0 ? this.path2.scale(1, 1.02) : this.path2.scale(1, 0.98)
                  }
                  break;
                case 'topLeft':
                  if((event.delta.x > 0 && event.delta.y > 0) || (event.delta.x < 0 && event.delta.y < 0)){
                    event.delta.y < 0 ? this.path2.scale(1, 1.02) : this.path2.scale(1, 0.98)
                    event.delta.x < 0 ? this.path2.scale(1.02, 1) : this.path2.scale(0.98, 1)
                  }
                  break;
                case 'bottomRight':
                  if((event.delta.x > 0 && event.delta.y > 0) || (event.delta.x < 0 && event.delta.y < 0)){
                    event.delta.y > 0 ? this.path2.scale(1, 1.02) : this.path2.scale(1, 0.98)
                    event.delta.x > 0 ? this.path2.scale(1.02, 1) : this.path2.scale(0.98, 1)
                  }
                  break;
                case 'bottomLeft':
                  if((event.delta.x > 0 && event.delta.y < 0) || (event.delta.x < 0 && event.delta.y > 0)){
                    event.delta.x < 0 ? this.path2.scale(1.02, 1) : this.path2.scale(0.98, 1)
                    event.delta.y > 0 ? this.path2.scale(1, 1.02) : this.path2.scale(1, 0.98)
                  }
                  break;
              }
              this.deleteScaleRectangle()
              this.drawScaleRectangle()
            } else if (this.path2 && this.strokeScaleNumber === null) {
              this.path2.position.x += event.delta.x;
              this.path2.position.y += event.delta.y;
              this.deleteScaleRectangle()
              this.drawScaleRectangle()
            } else if(this.strokeScaleNumber !== null) {
              switch(this.strokeScaleNumber) {
                case 0:
                  event.delta.x < 0 ? this.path2.scale(1.03, 1) : this.path2.scale(0.97, 1)
                  break;
                case 1:
                  event.delta.y < 0 ? this.path2.scale(1, 1.04) : this.path2.scale(1, 0.97)
                  break;
                case 2:
                  event.delta.x > 0 ? this.path2.scale(1.03, 1) : this.path2.scale(0.97, 1)
                  break;
                case 3:
                  event.delta.y > 0 ? this.path2.scale(1, 1.04) : this.path2.scale(1, 0.97)
                  break;
              }
              this.deleteScaleRectangle()
              this.drawScaleRectangle()
            }
          } else {
            if (this.segmentDot){
              if(this.segmentPointNumber == 1){
                this.segmentDot.curve.handle1.x += event.delta.x;
                this.segmentDot.curve.handle1.y += event.delta.y;
              } else if(this.segmentPointNumber == 2){
                this.segmentDot.curve.handle2.x += event.delta.x;
                this.segmentDot.curve.handle2.y += event.delta.y;
              }
              console.log(this.segmentDot.curve.points[2])
            } else {
              if (this.segment) {
                this.segment.point.x += event.delta.x;
                this.segment.point.y += event.delta.y;
              } else if (this.path2) {
                this.path2.position.x += event.delta.x;
                this.path2.position.y += event.delta.y;
              }
            }

          }
        }

      };
      this.tool.onMouseUp = () => {
        let self = this;


        if(!this.dragMode) {
          // завершаем линию
          self.path.add(new paper.Point(self.path.curves[0].point1._x, self.path.curves[0].point1._y))
          // формируем массив пересечений
          this.crossedArr = self.path.getCrossings(self.path)


          // формируем массив точек всей линии
          let readyPointsGo = []
          for (let i = 0; i < self.path.curves.length; i++) {
            for (let j = 0; j < self.path.curves[i].points.length; j++) {
              if (readyPointsGo[readyPointsGo.length - 1]) {
                if (readyPointsGo[readyPointsGo.length - 1].x == self.path.curves[i].points[j].x && readyPointsGo[readyPointsGo.length - 1].y == self.path.curves[i].points[j].y) {
                  continue
                }
              }
              readyPointsGo.push({x: self.path.curves[i].points[j].x, y: self.path.curves[i].points[j].y,})
            }
          }


          if (this.crossedArr.length) {
            this.cutCrossings(readyPointsGo)
          } else {
            this.FinArr = readyPointsGo
          }


          this.$emit('clearCanvas')

          self.path = new paper.Path()
          self.path.strokeColor = 'black';

          for (let i = 0; i < this.FinArr.length; i++) {
            self.path.add(new paper.Point(this.FinArr[i].x, this.FinArr[i].y));
          }
          self.path.closed = true;
          self.path.fillColor = { hue: Math.random() * 360, saturation: 1, lightness: (Math.random() - 0.5) * 0.4 + 0.4 };




          self.path.simplify(30);


          this.simpArr=this.scope.project._children[0]._children.find(i=>i.className == "Path").pathData
          if(this.currentIndex != this.pathHistory.length-1){
            this.pathHistory.splice(this.currentIndex+1,Infinity)
          }
          this.pathHistory.push({data:this.scope.project._children[0]._children.find(i=>i.className == "Path").pathData})
          this.currentIndex = this.pathHistory.length-1
          console.log('HISTORY')
          console.log(this.scope.project._children[0]._children.find(i=>i.className == "Path"))


          // let rer = []
          // if(this.scope.project._children[0]._children[0].curves){
          //
          //   for(let i=0 ; i<this.scope.project._children[0]._children[0].curves.length ; i++){
          //     for(let j=1 ; j<this.scope.project._children[0]._children[0].curves[i].points.length ; j++){
          //       rer.push({
          //         x:this.scope.project._children[0]._children[0].curves[i].points[j].x,
          //         y:this.scope.project._children[0]._children[0].curves[i].points[j].y
          //       })
          //     }
          //   }
          //
          //
          //   for(let i=0;i<rer.length;i++){
          //     var shape193 = new paper.Shape.Circle(new paper.Point(rer[i].x,rer[i].y), 10);
          //     shape193.strokeColor = 'rgba(0,0,0,0.5)';
          //     shape193.fillColor = 'rgba(255,2,2,0.5)';
          //   }
          //
          //
          // }
          console.log(this.scope.project._children[0]._children.find(i=>i.className == "Path"))


          this.pathExtra = self.path

        } else {
          this.simpArr=this.scope.project._children[0]._children.find(i=>i.className == "Path").pathData
          if(this.currentIndex != this.pathHistory.length-1){
            this.pathHistory.splice(this.currentIndex+1,Infinity)
          }
          this.pathHistory.push({data:this.scope.project._children[0]._children.find(i=>i.className == "Path").pathData})
          this.currentIndex = this.pathHistory.length-1
          console.log('HISTORY')
          console.log(this.scope.project._children[0]._children.find(i=>i.className == "Path"))
        }
        //self.path.selected = false;
        this.deletePathCircles()
        if(this.curveEditorMode){
          this.drawCirclesCurves()  
        } else {
          this.drawCircles()
        }
      }
    }
  },
  mounted() {
    this.scope = new paper.PaperScope();
    this.scope.setup(this.canvasId);
    console.log(document.body.clientWidth);
  },
  watch:{
    clear(){
      this.currentArr = [];
      this.finishArr = []
    },
    simpValue(val, oldVal){

      if(this.scope.project._children[0]._children.find(i=>i.className == "Path")){
        this.pathHistory.push({data:this.scope.project._children[0]._children.find(i=>i.className == "Path").pathData, simplify:true})
        this.currentIndex++

        // this.pathHistory.push({data:this.scope.project._children[0]._children[0].pathData})
        // this.currentIndex++


        this.simpArr=this.pathHistory[this.pathHistory.length-1].data

        this.$emit('clearSimp')
        self.path = new paper.Path(this.simpArr)
        self.path.strokeColor = 'black';
        self.path.fillColor = 'red';
        if(val>oldVal){
          self.path.flatten(1);
          self.path.simplify();
        } else {
          //self.path.simplify();
          self.path.flatten(40/val);
        }
        this.pathHistory.push({data:this.scope.project._children[0]._children.find(i=>i.className == "Path").pathData, simplify:true})
        this.currentIndex++


        this.drawCircles()
        //self.path.fullySelected = true;
      }

    }
  }
}
</script>

<style scoped>
input[type=range] {
  height: 30px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 30px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #353535;
  background: #b4a4a1;
  border-radius: 30px;
  border: 1px solid #000000;
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #353535;
  border: 0px solid #f3c846;
  height: 28px;
  width: 28px;
  border-radius: 29px;
  background: #231f20;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: 0px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #b4a4a1;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 30px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #353535;
  background: #b4a4a1;
  border-radius: 30px;
  border: 1px solid #000000;
}
input[type=range]::-moz-range-thumb {
  box-shadow: 0px 0px 0px #353535;
  border: 0px solid #f3c846;
  height: 28px;
  width: 28px;
  border-radius: 29px;
  background: #231f20;
  cursor: pointer;
}
input[type=range]::-ms-track {
  width: 100%;
  height: 30px;
  cursor: pointer;
  animate: 0.2s;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: #b4a4a1;
  border: 1px solid #000000;
  border-radius: 29px;
  box-shadow: 0px 0px 0px #353535;
}
input[type=range]::-ms-fill-upper {
  background: #b4a4a1;
  border: 1px solid #000000;
  border-radius: 29px;
  box-shadow: 0px 0px 0px #353535;
}
input[type=range]::-ms-thumb {
  margin-top: 1px;
  box-shadow: 0px 0px 0px #353535;
  border: 0px solid #f3c846;
  height: 28px;
  width: 28px;
  border-radius: 29px;
  background: #231f20;
  cursor: pointer;
}
input[type=range]:focus::-ms-fill-lower {
  background: #b4a4a1;
}
input[type=range]:focus::-ms-fill-upper {
  background: #b4a4a1;
}
input[type="range" i]:disabled {
    background-color: initial;
    color: rgb(197, 197, 197);
}


input[type=range]:disabled::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #353535;
  height: 28px;
  width: 28px;
  border-radius: 29px;
  background: #6d6265;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: 0px;
}
input[type=range]:disabled::-webkit-slider-runnable-track {
  width: 100%;
  height: 30px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #353535;
  background: #dbc8c4;
  border-radius: 30px;
  border: 1px solid #464646;
}


.buttons-block{
  display: flex;
    flex-direction: column;
}
.buttons-wrap{
  display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
}
.btn-wrap{
  margin-bottom: 30px;
}
.btn-tool{
  font-family: 'Roboto', sans-serif;
    font-size: 15px;
    letter-spacing: 3px;
  width: 280px;
  height: 40px;
}
.el-button+.el-button {
    margin-left: 0px;
}
.el-button{
  border-radius: 50px;
  color: #231f20;
  background-color: white;
  border: 1px solid #231f20;
}
.el-button:hover{
  color: white;
  background-color: #231f20;
}
.canvas-style {
  height: 350px;
  cursor: crosshair;
  border-radius: 10px;
  display: block;
  margin: auto;
  -webkit-box-shadow: 0px 5px 10px 5px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 5px 10px 5px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 5px 10px 5px rgba(34, 60, 80, 0.2);
}
canvas[resize] {
    width: 80%;
    height: 100%;
}
</style>