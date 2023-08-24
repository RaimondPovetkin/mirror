<!--console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');-->
<template>
  <div style=" display: flex; justify-content: center; padding-left: 9%;">
    <div :style="calcSize()">
      <canvas :width="calcWidth()" :height="calcHeight()" :id="canvasId" class="canvas-style" resize="true" v-on:mousedown="mouseDown"/>
      <!-- 1162 500    1745 -->
      <!-- <canvas key=countRerender width="568" height="500" :id="canvasId" class="canvas-style" resize="true" v-on:mousedown="mouseDown"/> 860-->
    </div>
    <div class="buttons-block">
      <div class="buttons-wrap">
        <el-button @click="clearPaper" class="btn-wrap btn-tool">
          <el-icon :size="20" style="margin-top: -5px; margin-right: 3px;">
            <Delete />
          </el-icon>
          ОЧИСТИТЬ
        </el-button>
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <el-button @click="back" class="btn-wrap btn-tool-arrow">
          <el-icon :size="20" style="margin-top: -5px; margin-right: 3px;">
            <Undo />
          </el-icon>
          НАЗАД
        </el-button>
        <el-button @click="forward" class="btn-wrap btn-tool-arrow">
          <el-icon :size="20" style="margin-top: -5px; margin-right: 3px;">
            <Redo />
          </el-icon>
          ВПЕРЁД
        </el-button>
        </div>


        <el-button @click="changeScale" class="btn-wrap btn-tool">
          <el-icon :size="20" style="margin-top: -5px; margin-right: 3px;">
            <ArrowExpand />
          </el-icon>
          МАСШТАБ
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
    dragMode: Boolean,
  },
  emits: ['clearSimp', 'clearHandler', 'nextButton'],
  data: () => ({
    simpArr: null,
    pathHistory: [],
    currentIndex: 0,

    pathExtra:null,

    curveEditorMode: false,
    scaleMode: false,
    currentRotationPant: null,
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
      tolerance: 1
    },
    hitOptions2: {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: 1
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
      let self = this;
      this.scope.project._children[0]._children.find(i=>i.className == "Path").flatten(1);
      console.log(this.scope.project._children[0]._children.find(i=>i.className == "Path"))
      console.log(self.path.getCrossings(self.path))
      //this.$emit('nextButton',this.scope.project._children[0]._children.find(i=>i.className == "Path").segments)
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
    deleteRotationArrows(){
      var children = this.scope.project.activeLayer.children;
      if(children['bottomLeftRot']){
        children['bottomLeftRot'].remove()
      }
      if(children['bottomRightRot']){
        children['bottomRightRot'].remove()
      }
      if(children['topLeftRot']){
        children['topLeftRot'].remove()
      }
      if(children['topRightRot']){
        children['topRightRot'].remove()
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

      // var triangle = new paper.Path.RegularPolygon(new paper.Point(pathGeneral.bounds.topLeft.x,pathGeneral.bounds.topLeft.y), 3, 10);
      // triangle.fillColor = '#e9e9ff';
      // triangle.strokeColor = 'rgba(0,38,32,0.5)';
      // triangle.name = 'topLeft'
      // triangle.rotate(75);

      let pathTopLeft = new paper.Path({
          segments: [
            [pathGeneral.bounds.topLeft.x,pathGeneral.bounds.topLeft.y], 
            [pathGeneral.bounds.topLeft.x+10,pathGeneral.bounds.topLeft.y], 
            [pathGeneral.bounds.topLeft.x+10,pathGeneral.bounds.topLeft.y-10],
            [pathGeneral.bounds.topLeft.x-10,pathGeneral.bounds.topLeft.y-10],
            [pathGeneral.bounds.topLeft.x-10,pathGeneral.bounds.topLeft.y+10],
            [pathGeneral.bounds.topLeft.x,pathGeneral.bounds.topLeft.y+10],
            [pathGeneral.bounds.topLeft.x,pathGeneral.bounds.topLeft.y],
          ],
          strokeColor: 'black',
          fillColor: 'white',
          strokeWidth: 1,
      });
      pathTopLeft.name = 'topLeft'




      let pathTopRight = new paper.Path({
          segments: [
            [pathGeneral.bounds.topRight.x,pathGeneral.bounds.topRight.y], 
            [pathGeneral.bounds.topRight.x,pathGeneral.bounds.topRight.y+10], 
            [pathGeneral.bounds.topRight.x+10,pathGeneral.bounds.topRight.y+10],
            [pathGeneral.bounds.topRight.x+10,pathGeneral.bounds.topRight.y-10],
            [pathGeneral.bounds.topRight.x-10,pathGeneral.bounds.topRight.y-10],
            [pathGeneral.bounds.topRight.x-10,pathGeneral.bounds.topRight.y],
            [pathGeneral.bounds.topRight.x,pathGeneral.bounds.topRight.y],
          ],
          strokeColor: 'black',
          fillColor: 'white',
          strokeWidth: 1,
      });
      pathTopRight.name = 'topRight'




      let pathBottomRight = new paper.Path({
          segments: [
            [pathGeneral.bounds.bottomRight.x,pathGeneral.bounds.bottomRight.y], 
            [pathGeneral.bounds.bottomRight.x,pathGeneral.bounds.bottomRight.y-10], 
            [pathGeneral.bounds.bottomRight.x+10,pathGeneral.bounds.bottomRight.y-10],
            [pathGeneral.bounds.bottomRight.x+10,pathGeneral.bounds.bottomRight.y+10],
            [pathGeneral.bounds.bottomRight.x-10,pathGeneral.bounds.bottomRight.y+10],
            [pathGeneral.bounds.bottomRight.x-10,pathGeneral.bounds.bottomRight.y],
            [pathGeneral.bounds.bottomRight.x,pathGeneral.bounds.bottomRight.y],
          ],
          strokeColor: 'black',
          fillColor: 'white',
          strokeWidth: 1,
      });
      pathBottomRight.name = 'bottomRight'




      let pathBottomLeft = new paper.Path({
          segments: [
            [pathGeneral.bounds.bottomLeft.x,pathGeneral.bounds.bottomLeft.y], 
            [pathGeneral.bounds.bottomLeft.x,pathGeneral.bounds.bottomLeft.y-10], 
            [pathGeneral.bounds.bottomLeft.x-10,pathGeneral.bounds.bottomLeft.y-10],
            [pathGeneral.bounds.bottomLeft.x-10,pathGeneral.bounds.bottomLeft.y+10],
            [pathGeneral.bounds.bottomLeft.x+10,pathGeneral.bounds.bottomLeft.y+10],
            [pathGeneral.bounds.bottomLeft.x+10,pathGeneral.bounds.bottomLeft.y],
            [pathGeneral.bounds.bottomLeft.x,pathGeneral.bounds.bottomLeft.y],
          ],
          strokeColor: 'black',
          fillColor: 'white',
          strokeWidth: 1,
      });
      pathBottomLeft.name = 'bottomLeft'




      // var topLeftShape = new paper.Shape.Circle(new paper.Point(pathGeneral.bounds.topLeft.x,pathGeneral.bounds.topLeft.y), 5);
      // topLeftShape.name = 'topLeft'
      // topLeftShape.strokeColor = 'rgba(0,38,32,0.5)';
      // topLeftShape.fillColor = 'rgba(0,255,217,0.2)';

      // var topRightShape = new paper.Shape.Circle(new paper.Point(pathGeneral.bounds.topRight.x,pathGeneral.bounds.topRight.y), 5);
      // topRightShape.name = 'topRight'
      // topRightShape.strokeColor = 'rgba(0,38,32,0.5)';
      // topRightShape.fillColor = 'rgba(0,255,217,0.2)';

      // var bottomLeftShape = new paper.Shape.Circle(new paper.Point(pathGeneral.bounds.bottomLeft.x,pathGeneral.bounds.bottomLeft.y), 5);
      // bottomLeftShape.name = 'bottomLeft'
      // bottomLeftShape.strokeColor = 'rgba(0,38,32,0.5)';
      // bottomLeftShape.fillColor = 'rgba(0,255,217,0.2)';

      // var bottomRightShape = new paper.Shape.Circle(new paper.Point(pathGeneral.bounds.bottomRight.x,pathGeneral.bounds.bottomRight.y), 5);
      // bottomRightShape.name = 'bottomRight'
      // bottomRightShape.strokeColor = 'rgba(0,38,32,0.5)';
      // bottomRightShape.fillColor = 'rgba(0,255,217,0.2)';
    },
    calcHeight(){
      console.log((document.body.clientWidth / 100) * 40)
      if(document.body.clientWidth<1500){
        return (document.body.clientWidth / 100) * 50
      }
      return (document.body.clientWidth / 100) * 40
    },
    calcWidth(){
      if(document.body.clientWidth<1500){
        let num = (document.body.clientWidth / 100) * 60
      return document.body.clientWidth - num
      }
      let num = (document.body.clientWidth / 100) * 67
      return document.body.clientWidth - num
    },
    calcSize(){
      console.log((document.body.clientWidth / 100) * 40)
      if(document.body.clientWidth<1500){
        return 'height: 80%; width: 59%;'
        //return 'height: 80%; width: 45%;'
      }
      return 'height: 80%; width: 45%;'
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
      this.currentArr = [];
      this.finishArr = []
      this.$emit('clearHandler',true)
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
    drawRotationArrow(eventMove){

      let cornersArr = this.scope.project.activeLayer.children.filter(i=>i.name == 'bottomLeft' || i.name == 'bottomRight' || i.name == 'topLeft' || i.name == 'topRight')
      let distanceTotal = 10000
      let index = null
      for(let i=0; i<cornersArr.length; i++){
        let distanceX = Math.abs(eventMove.point.x - cornersArr[i].position.x)
        let distanceY = Math.abs(eventMove.point.y - cornersArr[i].position.y)
        if(distanceY + distanceX < distanceTotal) {
          distanceTotal = distanceY + distanceX
          index = i
        }
      }
      let corner = cornersArr[index]

              switch(corner.name) {
                case 'topRight':
                  var path1 = new paper.Path.Arc(new paper.Point(corner.position.x-5,corner.position.y-30), new paper.Point(corner.position.x+18,corner.position.y-18), new paper.Point(corner.position.x+30,corner.position.y+5));
                  path1.add(new paper.Point(corner.position.x+20, corner.position.y+5))
                  path1.add(new paper.Point(corner.position.x+35, corner.position.y+20))
                  path1.add(new paper.Point(corner.position.x+50, corner.position.y+5))
                  path1.add(new paper.Point(corner.position.x+40, corner.position.y+5))
                    var handleIn = new paper.Point(42, 0);
                    var handleOut = new paper.Point(3, -3);
                    var firstPoint = new paper.Point(corner.position.x+40, corner.position.y+5);
                    var firstSegment = new paper.Segment(firstPoint, null, handleOut);
                    var secondPoint = new paper.Point(corner.position.x-5,corner.position.y-40);
                    var secondSegment = new paper.Segment(secondPoint, handleIn, null);
                    path1.add(firstSegment)
                    path1.add(secondSegment)
                    path1.add(new paper.Point(corner.position.x-5, corner.position.y-50))
                    path1.add(new paper.Point(corner.position.x-20, corner.position.y-35))
                    path1.add(new paper.Point(corner.position.x-5,corner.position.y-20))
                    path1.add(new paper.Point(corner.position.x-5,corner.position.y-30))

                  path1.strokeColor = 'black';
                  path1.fillColor = 'white';
                  path1.name = 'topRightRot'
                  break;
                case 'topLeft':
                  var path2 = new paper.Path.Arc(new paper.Point(corner.position.x+5,corner.position.y-30), new paper.Point(corner.position.x-18,corner.position.y-18), new paper.Point(corner.position.x-30,corner.position.y+5));
                  path2.add(new paper.Point(corner.position.x-20, corner.position.y+5))
                  path2.add(new paper.Point(corner.position.x-35, corner.position.y+20))
                  path2.add(new paper.Point(corner.position.x-50, corner.position.y+5))
                  path2.add(new paper.Point(corner.position.x-40, corner.position.y+5))
                  var handleIn2 = new paper.Point(-42, 0);
                  var handleOut2 = new paper.Point(-3, -3);
                  var firstPoint2 = new paper.Point(corner.position.x-40, corner.position.y+5);
                  var firstSegment2 = new paper.Segment(firstPoint2, null, handleOut2);
                  var secondPoint2 = new paper.Point(corner.position.x+5,corner.position.y-40);
                  var secondSegment2 = new paper.Segment(secondPoint2, handleIn2, null);
                  path2.add(firstSegment2)
                  path2.add(secondSegment2)
                  path2.add(new paper.Point(corner.position.x+5, corner.position.y-50))
                  path2.add(new paper.Point(corner.position.x+20, corner.position.y-35))
                  path2.add(new paper.Point(corner.position.x+5,corner.position.y-20))
                  path2.add(new paper.Point(corner.position.x+5,corner.position.y-30))
                  path2.strokeColor = 'black';
                  path2.fillColor = 'white';
                  path2.name = 'topLeftRot'
                  break;
                case 'bottomRight':
                  var path3 = new paper.Path.Arc(new paper.Point(corner.position.x+30,corner.position.y-5), new paper.Point(corner.position.x+18,corner.position.y+18), new paper.Point(corner.position.x-5,corner.position.y+30));
                  path3.add(new paper.Point(corner.position.x-5, corner.position.y+20))
                  path3.add(new paper.Point(corner.position.x-20, corner.position.y+35))
                  path3.add(new paper.Point(corner.position.x-5, corner.position.y+50))
                  path3.add(new paper.Point(corner.position.x-5, corner.position.y+40))
                  var handleIn3 = new paper.Point(3, 3);
                  var handleOut3 = new paper.Point(42, 0);
                  var firstPoint3 = new paper.Point(corner.position.x-5, corner.position.y+40);
                  var firstSegment3 = new paper.Segment(firstPoint3, null, handleOut3);
                  var secondPoint3 = new paper.Point(corner.position.x+40,corner.position.y-5);
                  var secondSegment3 = new paper.Segment(secondPoint3, handleIn3, null);
                  path3.add(firstSegment3)
                  path3.add(secondSegment3)
                  path3.add(new paper.Point(corner.position.x+50, corner.position.y-5))
                  path3.add(new paper.Point(corner.position.x+35, corner.position.y-20))
                  path3.add(new paper.Point(corner.position.x+20, corner.position.y-5))
                  path3.add(new paper.Point(corner.position.x+30, corner.position.y-5))
                  path3.strokeColor = 'black';
                  path3.fillColor = 'white';
                  path3.name = 'bottomRightRot'
                  break;
                case 'bottomLeft':
                  var path4 = new paper.Path.Arc(new paper.Point(corner.position.x-30,corner.position.y-5), new paper.Point(corner.position.x-18,corner.position.y+18), new paper.Point(corner.position.x+5,corner.position.y+30));
                  path4.add(new paper.Point(corner.position.x+5, corner.position.y+20))
                  path4.add(new paper.Point(corner.position.x+20, corner.position.y+35))
                  path4.add(new paper.Point(corner.position.x+5, corner.position.y+50))
                  path4.add(new paper.Point(corner.position.x+5, corner.position.y+40))
                  var handleIn4 = new paper.Point(-3, 3);
                  var handleOut4 = new paper.Point(-42, 0);
                  var firstPoint4 = new paper.Point(corner.position.x+5, corner.position.y+40);
                  var firstSegment4 = new paper.Segment(firstPoint4, null, handleOut4);
                  var secondPoint4 = new paper.Point(corner.position.x-40,corner.position.y-5);
                  var secondSegment4 = new paper.Segment(secondPoint4, handleIn4, null);
                  path4.add(firstSegment4)
                  path4.add(secondSegment4)
                  path4.add(new paper.Point(corner.position.x-50, corner.position.y-5))

                  path4.add(new paper.Point(corner.position.x-35, corner.position.y-20))

                  path4.add(new paper.Point(corner.position.x-20, corner.position.y-5))
                  path4.add(new paper.Point(corner.position.x-30, corner.position.y-5))
                  path4.strokeColor = 'black';
                  path4.fillColor = 'white';
                  path4.name = 'bottomLeftRot'
                  break;
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
        this.currentRotationPant = null
        if(!this.dragMode) {
          self.path = self.pathCreate(self.scope);
          self.path.add(event.point);
        } else {
          if(this.scaleMode){

            this.path2 = null;
            let hitResult = this.scope.project.hitTest(event.point, this.hitOptions);
            console.log(hitResult)
            if(hitResult && (hitResult.type == 'stroke' || hitResult.type == 'segment' || hitResult.type == 'fill') && (hitResult.item.name == "topRightRot" || hitResult.item.name == "bottomRightRot" || hitResult.item.name == "bottomLeftRot" || hitResult.item.name == "topLeftRot")){
              console.log(hitResult)
              this.currentRotationPant = hitResult.item.name
              console.log(this.scope.project._children[0]._children)
              this.path2 = this.scope.project._children[0]._children.find(i=>i.className == "Path" && !i.name)
              console.log(this.path2)
            }
            else if(hitResult && hitResult.type == 'stroke' && hitResult.item.name == "csaleRectangle"){
              this.strokeScaleNumber = hitResult.item.curves.findIndex(i=>i.point1.x == hitResult.location.curve.point1.x && i.point1.y == hitResult.location.curve.point1.y)
              this.path2 = this.scope.project._children[0]._children.find(i=>i.className == "Path")
            }
            else if(hitResult && hitResult.type == 'fill'){
              this.path2 = hitResult.item
            }
            let frameCircles = this.scope.project.activeLayer.children.filter(i=>i.name == 'bottomLeft' || i.name == 'bottomRight' || i.name == 'topLeft' || i.name == 'topRight')
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
              this.deleteRotationArrows()
            }
          } else {


          this.segment = null;
          this.path2 = null;
          this.segmentDot = null;
          this.segmentPointNumber = 0
          let hitResult = this.scope.project.hitTest(event.point, this.hitOptions);

          if (!hitResult && this.curveEditorMode){
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


              if(hitResult){
                this.movePath = hitResult.type == 'fill';
                if (this.movePath){
                  this.scope.project.activeLayer.addChild(hitResult.item);
                } 
              }
            }
        }
      };


      this.tool.onMouseMove= (event) => {
        if(this.scaleMode){

          this.deleteRotationArrows()
          this.drawRotationArrow(event)
          





        }
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
                    event.delta.x > 0 ? this.path2.scale(1.01, 1) : this.path2.scale(0.99, 1)
                    event.delta.y < 0 ? this.path2.scale(1, 1.01) : this.path2.scale(1, 0.99)
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
              console.log('444444444444444')
              this.deleteRotationArrows()
              this.drawRotationArrow(event)
            } else if (this.path2 && this.strokeScaleNumber === null) {
              if(this.currentRotationPant){

                console.log(event.point.x)
                console.log(event.point.y)
                console.log('----------')
                console.log(this.path2.bounds.center.x)
                //this.deleteScaleRectangle()
                //this.drawScaleRectangle()

                let rectangle = this.scope.project._children[0]._children['csaleRectangle']
                let arrow = this.scope.project._children[0]._children.find(i=>i.name == 'topRightRot' || i.name == 'topLeftRot' || i.name == 'bottomRightRot' || i.name == 'bottomLeftRot')
                let topRight = this.scope.project._children[0]._children['topRight']
                let topLeft = this.scope.project._children[0]._children['topLeft']
                let bottomRight = this.scope.project._children[0]._children['bottomRight']
                let bottomLeft = this.scope.project._children[0]._children['bottomLeft']

                if (event.point.x<this.path2.bounds.center.x && event.point.y>this.path2.bounds.center.y){
                  if(event.delta.x<0 || event.delta.y<0){
                    this.path2.rotate(1.3);
                    arrow.rotate(1.3,this.path2.bounds.center);
                    rectangle.rotate(1.3,this.path2.bounds.center);
                    bottomLeft.rotate(1.3,this.path2.bounds.center);
                    bottomRight.rotate(1.3,this.path2.bounds.center);
                    topLeft.rotate(1.3,this.path2.bounds.center);
                    topRight.rotate(1.3,this.path2.bounds.center);
                  } else {
                    this.path2.rotate(-1.3);
                    arrow.rotate(-1.3,this.path2.bounds.center);
                    rectangle.rotate(-1.3,this.path2.bounds.center);
                    bottomLeft.rotate(-1.3,this.path2.bounds.center);
                    bottomRight.rotate(-1.3,this.path2.bounds.center);
                    topLeft.rotate(-1.3,this.path2.bounds.center);
                    topRight.rotate(-1.3,this.path2.bounds.center);
                  }
                }else if(event.point.y>this.path2.bounds.center.y){
                  if(event.delta.x<0 || event.delta.y>0){
                    this.path2.rotate(1.3);
                    arrow.rotate(1.3,this.path2.bounds.center);
                    rectangle.rotate(1.3,this.path2.bounds.center);
                    bottomLeft.rotate(1.3,this.path2.bounds.center);
                    bottomRight.rotate(1.3,this.path2.bounds.center);
                    topLeft.rotate(1.3,this.path2.bounds.center);
                    topRight.rotate(1.3,this.path2.bounds.center);
                  } else {
                    this.path2.rotate(-1.3);
                    arrow.rotate(-1.3,this.path2.bounds.center);
                    rectangle.rotate(-1.3,this.path2.bounds.center);
                    bottomLeft.rotate(-1.3,this.path2.bounds.center);
                    bottomRight.rotate(-1.3,this.path2.bounds.center);
                    topLeft.rotate(-1.3,this.path2.bounds.center);
                    topRight.rotate(-1.3,this.path2.bounds.center);
                  }
                } else if (event.point.x<this.path2.bounds.center.x){
                  if(event.delta.x>0 || event.delta.y<0){
                    this.path2.rotate(1.3);
                    arrow.rotate(1.3,this.path2.bounds.center);
                    rectangle.rotate(1.3,this.path2.bounds.center);
                    bottomLeft.rotate(1.3,this.path2.bounds.center);
                    bottomRight.rotate(1.3,this.path2.bounds.center);
                    topLeft.rotate(1.3,this.path2.bounds.center);
                    topRight.rotate(1.3,this.path2.bounds.center);
                  } else {
                    this.path2.rotate(-1.3);
                    arrow.rotate(-1.3,this.path2.bounds.center);
                    rectangle.rotate(-1.3,this.path2.bounds.center);
                    bottomLeft.rotate(-1.3,this.path2.bounds.center);
                    bottomRight.rotate(-1.3,this.path2.bounds.center);
                    topLeft.rotate(-1.3,this.path2.bounds.center);
                    topRight.rotate(-1.3,this.path2.bounds.center);
                  }
                } else {
                  if(event.delta.x>0 || event.delta.y>0){
                    this.path2.rotate(1.3);
                    arrow.rotate(1.3,this.path2.bounds.center);
                    rectangle.rotate(1.3,this.path2.bounds.center);
                    bottomLeft.rotate(1.3,this.path2.bounds.center);
                    bottomRight.rotate(1.3,this.path2.bounds.center);
                    topLeft.rotate(1.3,this.path2.bounds.center);
                    topRight.rotate(1.3,this.path2.bounds.center);
                  } else {
                    this.path2.rotate(-1.3);
                    arrow.rotate(-1.3,this.path2.bounds.center);
                    rectangle.rotate(-1.3,this.path2.bounds.center);
                    bottomLeft.rotate(-1.3,this.path2.bounds.center);
                    bottomRight.rotate(-1.3,this.path2.bounds.center);
                    topLeft.rotate(-1.3,this.path2.bounds.center);
                    topRight.rotate(-1.3,this.path2.bounds.center);
                  }
                }




              } else {
                this.path2.position.x += event.delta.x;
                this.path2.position.y += event.delta.y;
                this.deleteScaleRectangle()
                this.drawScaleRectangle()
                this.deleteRotationArrows()
                this.drawRotationArrow(event)
              }
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
          //this.scope.project._children[0]._children.find(i=>i.className == "Path").name = 'generalPath'
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


          this.$emit('clearHandler', false)

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
          if(this.scaleMode){
            this.deleteScaleRectangle()
            this.drawScaleRectangle()
          }
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
    console.log(window.innerWidth);
    console.log(window.innerHeight);
  },
  watch:{
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
.btn-tool-arrow{
  font-family: 'Roboto', sans-serif;
    font-size: 15px;
    letter-spacing: 3px;
  width: 130px;
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
  
  cursor: crosshair;
  border-radius: 10px;
  display: block;
  margin: auto;
  -webkit-box-shadow: 0px 5px 10px 5px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 5px 10px 5px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 5px 10px 5px rgba(34, 60, 80, 0.2);
}

@media (max-width: 1300px) {
  .btn-tool{
  font-size: 13px;
  width: 230px;
}
.btn-tool-arrow{
  font-size: 13px;
  width: 110px;
}
}
@media (max-width: 1024px) {
  .btn-tool{
  font-family: 'Roboto', sans-serif;
  font-size: 11px;
  letter-spacing: 2px;
  width: 220px;
  height: 35px;
}
.btn-tool-arrow{
  font-family: 'Roboto', sans-serif;
  font-size: 11px;
  letter-spacing: 2px;
  width: 100px;
  height: 35px;
}
}
</style>