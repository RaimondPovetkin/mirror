<!--console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');-->
<template>
  <div style=" display: flex; justify-content: center; padding-left: 14%;">
    <div>
      <canvas :id="canvasId" resize="true" class="canvas-style" v-on:mousedown="mouseDown"/>
    </div>
    <div class="buttons-block">
      <div class="buttons-wrap">
        <el-button :disabled="!dragMode" @click="clearPaper" class="btn-wrap btn-tool">
          <el-icon :size="getIconSize()" style="margin-top: -5px; margin-right: 3px;">
            <Delete />
          </el-icon>
          ОЧИСТИТЬ
        </el-button>
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <el-button @click="back(false)" class="btn-wrap btn-tool-arrow">
          <el-icon :size="getIconSize()" style="margin-top: -5px; margin-right: 3px;">
            <Undo />
          </el-icon>
          НАЗАД
        </el-button>
        <el-button @click="forward" class="btn-wrap btn-tool-arrow">
          <el-icon :size="getIconSize()" style="margin-top: -5px; margin-right: 3px;">
            <Redo />
          </el-icon>
          ВПЕРЁД
        </el-button>
        </div>
        <el-button @click="changeScale" class="btn-wrap btn-tool">
          <el-icon :size="getIconSize()" style="margin-top: -5px; margin-right: 3px;">
            <ArrowExpand />
          </el-icon>
          МАСШТАБ
        </el-button>
        <el-button @click="curveEditorHandler" class="btn-wrap btn-tool">
          <el-icon :size="getIconSize()" style="margin-top: -5px; margin-right: 3px;">
            <VectorCurve />
          </el-icon>
          КРИВЫЕ {{ curveEditorMode }}
        </el-button>
        <div style=" display: flex; flex-direction: column;">
          <label for="volume">СГЛАЖИВАНИЕ</label>
          <input type="range" id="volume" name="volume" min="2" max="30" @input="yyu" :disabled="!dragMode || fewSegments" v-model="simpValue">
        </div>
        <el-button @click="goToDrawPage">
          NEXT
        </el-button>
        currentIndex:{{currentIndex}}
        pathHistory.length:{{ pathHistory.length}}
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
    pathHistory: [],
    currentIndex: 0,
    pathSelected: false,
    curveEditorMode: false,
    scaleMode: false,
    currentRotationPoint: null,
    sideScaleRectangleNumber: null,
    cornerScale: null,
    simpValue: 2,
    fewSegments: false,
    segment: null,
    segmentDot: null,
    segmentPointNumber: 0,
    hitOptions: {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: 1
    },
    hitOptionsExtended: {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: 15
    },

    loop: 0, // кол-во выполнения функции обрезания
    crossedArr: [],
    FinArr: [],
    path: null,
    scope: null
  }),
  methods: {
    yyu(event){
      console.log(event)
    },
    getIconSize(){
      if(window.innerWidth<890){
        return 15
      }
      return 20
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
          this.deleteRotationArrows()
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
    changeNormalSizeChildren(event){
      let childrens =  this.scope.project._children[0]._children

      // приводим детей к обычному виду
      for(let i=0; i< childrens.length;i++){
        if(childrens[i].type == "circle" && childrens[i].radius > 5){
          childrens[i].radius = 10
        } else if(!childrens[i].type){
          childrens.find(i=>i.className == "Path").strokeWidth = 1
        }
      }
      // увеличиваем детей при наведении
      let hitResult = this.scope.project.hitTest(event.point, this.hitOptions);
      if(hitResult && hitResult.item.type == 'circle' && hitResult.item.radius == 10){
        childrens.find(i=>i.id == hitResult.item.id).radius = 15
      } else if(hitResult && hitResult.type == 'stroke' && !this.scaleMode) {
        childrens.find(i=>i.className == "Path").strokeWidth = 3;
      }
    },
    deleteScaleRectangle(){// удаляем прямоугольник и все стрелочки масштаба
      let children = this.scope.project.activeLayer.children;
      if(children['csaleRectangle'] && children['topLeft'] && children['topRight'] && children['bottomLeft'] && children['bottomRight']){
        if(children['csaleRectangle'])children['csaleRectangle'].remove()
        if(children['topLeft'])children['topLeft'].remove()
        if(children['topRight'])children['topRight'].remove()
        if(children['bottomLeft'])children['bottomLeft'].remove()
        if(children['bottomRight'])children['bottomRight'].remove()
        if(children['topTriangle'])children['topTriangle'].remove()
        if(children['bottomTriangle'])children['bottomTriangle'].remove()
        if(children['leftTriangle'])children['leftTriangle'].remove()
        if(children['rightTriangle'])children['rightTriangle'].remove()
      }
    },
    deleteRotationArrows(){// удаляем стрелочки вращения
      let children = this.scope.project.activeLayer.children;
      if(children['bottomLeftRot'])children['bottomLeftRot'].remove()
      if(children['bottomRightRot'])children['bottomRightRot'].remove()
      if(children['topLeftRot'])children['topLeftRot'].remove()
      if(children['topRightRot'])children['topRightRot'].remove()
    },
    drawScaleRectangle(){
      let pathGeneral = this.scope.project._children[0]._children.find(i=>i.className == "Path")
      // рисуем сам прямоугольник
      var rectangle = new paper.Rectangle(new paper.Point(pathGeneral.bounds.topLeft.x, pathGeneral.bounds.topLeft.y), new paper.Size(pathGeneral.bounds.width, pathGeneral.bounds.height));
      var path = new paper.Path.Rectangle(rectangle);
      path.name = 'csaleRectangle'
      path.strokeColor = 'black';
      path.dashArray = [10, 12];
      // рисуем треугольники по бокам
      let rightTriangle = new paper.Path.RegularPolygon(new paper.Point(pathGeneral.bounds.rightCenter.x+6,pathGeneral.bounds.rightCenter.y), 3, 8);
      rightTriangle.fillColor = 'white';
      rightTriangle.strokeColor = 'black';
      rightTriangle.name = 'rightTriangle'
      rightTriangle.rotate(90);

      let topTriangle = new paper.Path.RegularPolygon(new paper.Point(pathGeneral.bounds.topCenter.x,pathGeneral.bounds.topCenter.y-4), 3, 8);
      topTriangle.fillColor = 'white';
      topTriangle.strokeColor = 'black';
      topTriangle.name = 'topTriangle'

      let leftTriangle = new paper.Path.RegularPolygon(new paper.Point(pathGeneral.bounds.leftCenter.x-6,pathGeneral.bounds.leftCenter.y), 3, 8);
      leftTriangle.fillColor = 'white';
      leftTriangle.strokeColor = 'black';
      leftTriangle.name = 'leftTriangle'
      leftTriangle.rotate(-90);

      let bottomTriangle = new paper.Path.RegularPolygon(new paper.Point(pathGeneral.bounds.bottomCenter.x,pathGeneral.bounds.bottomCenter.y+8), 3, 8);
      bottomTriangle.fillColor = 'white';
      bottomTriangle.strokeColor = 'black';
      bottomTriangle.name = 'bottomTriangle'
      bottomTriangle.rotate(180);
      // рисуем треугольники по углам
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
        this.deleteScaleRectangle()
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
    },
    forward(){
      let self = this;
      this.scaleMode = false
      if(this.currentIndex<this.pathHistory.length-1){
        this.currentIndex++
        if(this.pathHistory[this.currentIndex] && this.pathHistory[this.currentIndex].simplify){
          this.forward()
        } else {
          this.$emit('clearSimp')
          // let children = this.scope.project.activeLayer;
          // children.removeChildren(0)
          self.path = new paper.Path(this.pathHistory[this.currentIndex].data)
          self.path.strokeColor = 'black';
          self.path.fillColor = 'red';
          self.path.closed = true;
        }
      } else if(this.currentIndex==this.pathHistory.length-1){
        this.$emit('clearSimp')
        self.path = new paper.Path(this.pathHistory[this.currentIndex].data)
        self.path.strokeColor = 'black';
        self.path.fillColor = 'red';
        self.path.closed = true;
      }
    },
    addHistory(){

    },
    drawCirclesCurves(){
      if(!this.scaleMode){
        if(this.path._segments){
          for(let i=0 ; i<this.path._segments.length ; i++){
            let firstCircle = new paper.Shape.Circle(new paper.Point(this.path._segments[i].curve.points[1].x,this.path._segments[i].curve.points[1].y), 3);
            firstCircle.name = 'circlePahtMini';
            firstCircle.fillColor = 'rgba(0,157,236)';

            let secondCircle = new paper.Shape.Circle(new paper.Point(this.path._segments[i].curve.points[2].x,this.path._segments[i].curve.points[2].y), 3);
            secondCircle.name = 'circlePahtMini';
            secondCircle.fillColor = 'rgba(0,157,236)';
          }
        }
        if(this.path._segments.length>3){
          this.fewSegments = false
        } else {
          this.fewSegments = true
        }
      }
    },
    drawCircles(){
      if(!this.scaleMode){
        let path = this.scope.project._children[0]._children.find(i=>i.className == "Path")
        if(path._segments){
          for(let i=0 ; i<path._segments.length ; i++){
            let circle = new paper.Shape.Circle(new paper.Point(path._segments[i].point.x,path._segments[i].point.y), 10);
            circle.strokeColor = 'rgba(0,38,32,0.5)';
            circle.name = 'circlePaht';
            circle.fillColor = 'rgba(0,255,217,0.2)';
          }
        }
        if(path._segments.length>3){
          this.fewSegments = false
        } else {
          this.fewSegments = true
        }
      }
    },
    clearPaper(){
      this.pathHistory= []
      this.currentIndex= 0
      this.scaleMode = false
      this.curveEditorMode = false
      this.simpValue = 2
      this.$emit('clearHandler',true)
    },
    back(simplify = false){
      this.scaleMode = false
      this.curveEditorMode = false
      if(this.currentIndex>0){
        this.currentIndex--

        console.log(this.pathHistory[this.currentIndex-1] ? this.pathHistory[this.currentIndex-1].simplify : undefined)
        console.log(simplify)
        console.log(this.pathHistory[this.currentIndex-1])
        console.log('---------------')

        if(this.pathHistory[this.currentIndex-1] && this.pathHistory[this.currentIndex-1].simplify && simplify == false){
          console.log('back')
          this.back()
        } else {
          let self = this;
          this.$emit('clearSimp')
          self.path = new paper.Path(this.pathHistory[this.currentIndex].data)
          self.path.strokeColor = 'black';
          self.path.fillColor = 'red';
          //self.path.simplify(1);
          self.path.closed = true;
          if (this.simpValue > 0) {
            //self.path.simplify(this.simpValue);
          }
        }
      }
    },
    drawRotationArrow(eventMove){
      // рисуем стрелку поворота возле ближайшего к мышке угла
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

      if (corner){
        switch(corner.name) {
          case 'topRight':
            var topRightRotPath = new paper.Path.Arc(new paper.Point(corner.position.x-5,corner.position.y-30), new paper.Point(corner.position.x+18,corner.position.y-18), new paper.Point(corner.position.x+30,corner.position.y+5));
            topRightRotPath.add(new paper.Point(corner.position.x+20, corner.position.y+5))
            topRightRotPath.add(new paper.Point(corner.position.x+35, corner.position.y+20))
            topRightRotPath.add(new paper.Point(corner.position.x+50, corner.position.y+5))
            topRightRotPath.add(new paper.Point(corner.position.x+40, corner.position.y+5))
            var handleIn = new paper.Point(42, 0);
            var handleOut = new paper.Point(3, -3);
            var firstPoint = new paper.Point(corner.position.x+40, corner.position.y+5);
            var firstSegment = new paper.Segment(firstPoint, null, handleOut);
            var secondPoint = new paper.Point(corner.position.x-5,corner.position.y-40);
            var secondSegment = new paper.Segment(secondPoint, handleIn, null);
            topRightRotPath.add(firstSegment)
            topRightRotPath.add(secondSegment)
            topRightRotPath.add(new paper.Point(corner.position.x-5, corner.position.y-50))
            topRightRotPath.add(new paper.Point(corner.position.x-20, corner.position.y-35))
            topRightRotPath.add(new paper.Point(corner.position.x-5,corner.position.y-20))
            topRightRotPath.add(new paper.Point(corner.position.x-5,corner.position.y-30))
            topRightRotPath.strokeColor = 'black';
            topRightRotPath.fillColor = 'white';
            topRightRotPath.name = 'topRightRot'
            break;
          case 'topLeft':
            var topLeftRotPath = new paper.Path.Arc(new paper.Point(corner.position.x+5,corner.position.y-30), new paper.Point(corner.position.x-18,corner.position.y-18), new paper.Point(corner.position.x-30,corner.position.y+5));
            topLeftRotPath.add(new paper.Point(corner.position.x-20, corner.position.y+5))
            topLeftRotPath.add(new paper.Point(corner.position.x-35, corner.position.y+20))
            topLeftRotPath.add(new paper.Point(corner.position.x-50, corner.position.y+5))
            topLeftRotPath.add(new paper.Point(corner.position.x-40, corner.position.y+5))
            var handleIn2 = new paper.Point(-42, 0);
            var handleOut2 = new paper.Point(-3, -3);
            var firstPoint2 = new paper.Point(corner.position.x-40, corner.position.y+5);
            var firstSegment2 = new paper.Segment(firstPoint2, null, handleOut2);
            var secondPoint2 = new paper.Point(corner.position.x+5,corner.position.y-40);
            var secondSegment2 = new paper.Segment(secondPoint2, handleIn2, null);
            topLeftRotPath.add(firstSegment2)
            topLeftRotPath.add(secondSegment2)
            topLeftRotPath.add(new paper.Point(corner.position.x+5, corner.position.y-50))
            topLeftRotPath.add(new paper.Point(corner.position.x+20, corner.position.y-35))
            topLeftRotPath.add(new paper.Point(corner.position.x+5,corner.position.y-20))
            topLeftRotPath.add(new paper.Point(corner.position.x+5,corner.position.y-30))
            topLeftRotPath.strokeColor = 'black';
            topLeftRotPath.fillColor = 'white';
            topLeftRotPath.name = 'topLeftRot'
            break;
          case 'bottomRight':
            var bottomRightRotPath = new paper.Path.Arc(new paper.Point(corner.position.x+30,corner.position.y-5), new paper.Point(corner.position.x+18,corner.position.y+18), new paper.Point(corner.position.x-5,corner.position.y+30));
            bottomRightRotPath.add(new paper.Point(corner.position.x-5, corner.position.y+20))
            bottomRightRotPath.add(new paper.Point(corner.position.x-20, corner.position.y+35))
            bottomRightRotPath.add(new paper.Point(corner.position.x-5, corner.position.y+50))
            bottomRightRotPath.add(new paper.Point(corner.position.x-5, corner.position.y+40))
            var handleIn3 = new paper.Point(3, 3);
            var handleOut3 = new paper.Point(42, 0);
            var firstPoint3 = new paper.Point(corner.position.x-5, corner.position.y+40);
            var firstSegment3 = new paper.Segment(firstPoint3, null, handleOut3);
            var secondPoint3 = new paper.Point(corner.position.x+40,corner.position.y-5);
            var secondSegment3 = new paper.Segment(secondPoint3, handleIn3, null);
            bottomRightRotPath.add(firstSegment3)
            bottomRightRotPath.add(secondSegment3)
            bottomRightRotPath.add(new paper.Point(corner.position.x+50, corner.position.y-5))
            bottomRightRotPath.add(new paper.Point(corner.position.x+35, corner.position.y-20))
            bottomRightRotPath.add(new paper.Point(corner.position.x+20, corner.position.y-5))
            bottomRightRotPath.add(new paper.Point(corner.position.x+30, corner.position.y-5))
            bottomRightRotPath.strokeColor = 'black';
            bottomRightRotPath.fillColor = 'white';
            bottomRightRotPath.name = 'bottomRightRot'
            break;
          case 'bottomLeft':
            var bottomLeftRotPath = new paper.Path.Arc(new paper.Point(corner.position.x-30,corner.position.y-5), new paper.Point(corner.position.x-18,corner.position.y+18), new paper.Point(corner.position.x+5,corner.position.y+30));
            bottomLeftRotPath.add(new paper.Point(corner.position.x+5, corner.position.y+20))
            bottomLeftRotPath.add(new paper.Point(corner.position.x+20, corner.position.y+35))
            bottomLeftRotPath.add(new paper.Point(corner.position.x+5, corner.position.y+50))
            bottomLeftRotPath.add(new paper.Point(corner.position.x+5, corner.position.y+40))
            var handleIn4 = new paper.Point(-3, 3);
            var handleOut4 = new paper.Point(-42, 0);
            var firstPoint4 = new paper.Point(corner.position.x+5, corner.position.y+40);
            var firstSegment4 = new paper.Segment(firstPoint4, null, handleOut4);
            var secondPoint4 = new paper.Point(corner.position.x-40,corner.position.y-5);
            var secondSegment4 = new paper.Segment(secondPoint4, handleIn4, null);
            bottomLeftRotPath.add(firstSegment4)
            bottomLeftRotPath.add(secondSegment4)
            bottomLeftRotPath.add(new paper.Point(corner.position.x-50, corner.position.y-5))
            bottomLeftRotPath.add(new paper.Point(corner.position.x-35, corner.position.y-20))
            bottomLeftRotPath.add(new paper.Point(corner.position.x-20, corner.position.y-5))
            bottomLeftRotPath.add(new paper.Point(corner.position.x-30, corner.position.y-5))
            bottomLeftRotPath.strokeColor = 'black';
            bottomLeftRotPath.fillColor = 'white';
            bottomLeftRotPath.name = 'bottomLeftRot'
            break;
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
          if(readyPointsGo[j+1] && readyPointsGo[j+1].cross){
              agreeableIndex = false
          }
          if(readyPointsGo[j-1] && readyPointsGo[j-1].cross){
              agreeableIndex = false
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
      let readyPointsGoReverce = JSON.parse(JSON.stringify(readyPointsGo))
      readyPointsGoReverce.reverse()

      routNumbers.push({
        count: readyPointsGoReverce.indexOf(readyPointsGoReverce.find(i=>i.crossIndex !== undefined)) + readyPointsGo.indexOf(readyPointsGo.find(i=>i.crossIndex !== undefined)),
        end: readyPointsGo.length - readyPointsGoReverce.indexOf(readyPointsGoReverce.find(i=>i.crossIndex !== undefined))-1,
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
        this.tool = this.createTool(this.scope);
      }
      this.tool.onMouseDown = (event) => {
        if(!this.dragMode) {
          //первая точка нашей фигуры
          self.path = self.pathCreate(self.scope);
          self.path.add(event.point);
        } else {
          this.pathSelected = false
          if(this.scaleMode){
            this.sideScaleRectangleNumber = null//сторона прямоугольника (при масштабировании)
            this.cornerScale = null// угол за который тянем (при масштабировании)
            this.currentRotationPoint = null// стрелка за которую тянем (при вращении)
            let hitResult = this.scope.project.hitTest(event.point, this.hitOptions);
            let hitResultExtended = this.scope.project.hitTest(event.point, this.hitOptionsExtended);
            if(hitResult){
              let hitResultType = hitResult.type
              // когда кликаем по самой фигуре
              if(!hitResult.item.name && hitResultType == 'fill'){
                this.pathSelected = true
              }
              // когда кликаем по стрелке вращения
              if(hitResult.item.name == "topRightRot" || hitResult.item.name == "bottomRightRot" || hitResult.item.name == "bottomLeftRot" || hitResult.item.name == "topLeftRot"){
                this.currentRotationPoint = hitResult.item.name
              }
              // когда кликаем по углу прямоугольника
              else if(hitResult.item.name == "topRight" || hitResult.item.name == "topLeft" || hitResult.item.name == "bottomRight" || hitResult.item.name == "bottomLeft"){
                this.cornerScale = hitResult.item.name
              }
              // когда кликаем по прямоугольнику
              else if(hitResultType == 'stroke' && hitResult.item.name == "csaleRectangle"){
                this.sideScaleRectangleNumber = hitResult.item.curves.findIndex(i=>i.point1.x == hitResult.location.curve.point1.x && i.point1.y == hitResult.location.curve.point1.y)
              }
            }
            if(hitResultExtended){
            // когда кликаем по боковой стрелке
              if(hitResultExtended.item.name == "rightTriangle" || hitResultExtended.item.name == "topTriangle" || hitResultExtended.item.name == "bottomTriangle" || hitResultExtended.item.name == "leftTriangle"){
                switch(hitResultExtended.item.name) {
                  case "rightTriangle":
                    this.sideScaleRectangleNumber=2
                    break;
                  case "topTriangle":
                    this.sideScaleRectangleNumber=1
                    break;
                  case "bottomTriangle":
                    this.sideScaleRectangleNumber=3
                    break;
                  case "leftTriangle":
                    this.sideScaleRectangleNumber=0
                    break;
                }
              }
            }
            if(!hitResult && !hitResultExtended){
              this.changeScale()
              this.deleteRotationArrows()
            }
          } else { // если не в режиме масштабирования
            this.segment = null;
            this.segmentDot = null;
            this.segmentPointNumber = 0
            let hitResult = this.scope.project.hitTest(event.point, this.hitOptionsExtended);
            // убираем возможность редактирования кривых, если кликнули по пустому
            if (!hitResult && this.curveEditorMode){
              this.curveEditorHandler()
              return;
            }
            if (hitResult) {
              // когда кликаем по самой фигуре
              if(!hitResult.item.name && hitResult.type == 'fill'){
                this.pathSelected = true
              }

              if(hitResult.item._type === "circle"){
                if(hitResult.item.radius === 3){

                  // определяем нужный маленький кружок для перемещения
                  for(let i=0; i<this.path._segments.length; i++){
                    if(this.path._segments[i].curve.points[1].x == hitResult.item.position.x && this.path._segments[i].curve.points[1].y == hitResult.item.position.y){
                      this.segmentDot = this.path._segments[i]
                      this.segmentPointNumber = 1
                    } else if(this.path._segments[i].curve.points[2].x == hitResult.item.position.x && this.path._segments[i].curve.points[2].y == hitResult.item.position.y){
                      this.segmentDot = this.path._segments[i]
                      this.segmentPointNumber = 2
                    }
                  }
                } else {
                  // определяем нужный большой кружок для перемещения
                  for(let i=0; i<this.path._segments.length; i++){
                    if(Math.trunc(this.path._segments[i].point.x) == Math.trunc(hitResult.item.position.x) && Math.trunc(this.path._segments[i].point.y) == Math.trunc(hitResult.item.position.y)){
                      this.segment = this.path._segments[i]
                    }
                  }
                }
              }
              if (hitResult.type == 'segment') {
                this.segment = hitResult.segment;
              }
              // добавляем сегмент при клике на обводку
              else if (hitResult.type == 'stroke' && hitResult.item._type != "circle") {
                this.segment = this.path.insert(hitResult.location.index + 1, event.point);
              }
            }
          }
        }
      };


      this.tool.onMouseMove= (event) => {
        // рисуем стрелки вращения в зависимости где курсор
        if(this.scaleMode){
          this.deleteRotationArrows()
          this.drawRotationArrow(event)
        }
        this.changeNormalSizeChildren(event)
      }
      this.tool.onMouseDrag = (event) => {
        this.deletePathCircles()
        this.deleteMiniPathCircles()
        if(!this.dragMode) {
          self.path.add(event);
          self.path.fillColor = '#efefef';
        } else {
          if(this.scaleMode){
            if(this.cornerScale){
              switch(this.cornerScale) {
                case 'topRight':
                  if((event.delta.x > 0 && event.delta.y < 0) || (event.delta.x < 0 && event.delta.y > 0)){
                    event.delta.x > 0 ? this.path.scale(1.01, 1) : this.path.scale(0.99, 1)
                    event.delta.y < 0 ? this.path.scale(1, 1.01) : this.path.scale(1, 0.99)
                  }
                  break;
                case 'topLeft':
                  if((event.delta.x > 0 && event.delta.y > 0) || (event.delta.x < 0 && event.delta.y < 0)){
                    event.delta.y < 0 ? this.path.scale(1, 1.02) : this.path.scale(1, 0.98)
                    event.delta.x < 0 ? this.path.scale(1.02, 1) : this.path.scale(0.98, 1)
                  }
                  break;
                case 'bottomRight':
                  if((event.delta.x > 0 && event.delta.y > 0) || (event.delta.x < 0 && event.delta.y < 0)){
                    event.delta.y > 0 ? this.path.scale(1, 1.02) : this.path.scale(1, 0.98)
                    event.delta.x > 0 ? this.path.scale(1.02, 1) : this.path.scale(0.98, 1)
                  }
                  break;
                case 'bottomLeft':
                  if((event.delta.x > 0 && event.delta.y < 0) || (event.delta.x < 0 && event.delta.y > 0)){
                    event.delta.x < 0 ? this.path.scale(1.02, 1) : this.path.scale(0.98, 1)
                    event.delta.y > 0 ? this.path.scale(1, 1.02) : this.path.scale(1, 0.98)
                  }
                  break;
              }
              this.deleteScaleRectangle()
              this.drawScaleRectangle()
              this.deleteRotationArrows()
              this.drawRotationArrow(event)
            } else if (this.sideScaleRectangleNumber === null) { // если выбрана не сторона
              if(this.currentRotationPoint){// если выбрана стрелочка поворота

                let rectangle = this.scope.project._children[0]._children['csaleRectangle']
                let arrow = this.scope.project._children[0]._children.find(i=>i.name == 'topRightRot' || i.name == 'topLeftRot' || i.name == 'bottomRightRot' || i.name == 'bottomLeftRot')
                let topRight = this.scope.project._children[0]._children['topRight']
                let topLeft = this.scope.project._children[0]._children['topLeft']
                let bottomRight = this.scope.project._children[0]._children['bottomRight']
                let bottomLeft = this.scope.project._children[0]._children['bottomLeft']
                let rightTriangle = this.scope.project._children[0]._children['rightTriangle']
                let leftTriangle = this.scope.project._children[0]._children['leftTriangle']
                let bottomTriangle = this.scope.project._children[0]._children['bottomTriangle']
                let topTriangle = this.scope.project._children[0]._children['topTriangle']

                if (event.point.x<this.path.bounds.center.x && event.point.y>this.path.bounds.center.y){
                  if(event.delta.x<0 || event.delta.y<0){
                    this.path.rotate(1.3);
                    arrow.rotate(1.3,this.path.bounds.center);
                    rectangle.rotate(1.3,this.path.bounds.center);
                    bottomLeft.rotate(1.3,this.path.bounds.center);
                    bottomRight.rotate(1.3,this.path.bounds.center);
                    topLeft.rotate(1.3,this.path.bounds.center);
                    topRight.rotate(1.3,this.path.bounds.center);
                    rightTriangle.rotate(1.3,this.path.bounds.center);
                    leftTriangle.rotate(1.3,this.path.bounds.center);
                    bottomTriangle.rotate(1.3,this.path.bounds.center);
                    topTriangle.rotate(1.3,this.path.bounds.center);
                  } else {
                    this.path.rotate(-1.3);
                    arrow.rotate(-1.3,this.path.bounds.center);
                    rectangle.rotate(-1.3,this.path.bounds.center);
                    bottomLeft.rotate(-1.3,this.path.bounds.center);
                    bottomRight.rotate(-1.3,this.path.bounds.center);
                    topLeft.rotate(-1.3,this.path.bounds.center);
                    topRight.rotate(-1.3,this.path.bounds.center);
                    rightTriangle.rotate(-1.3,this.path.bounds.center);
                    leftTriangle.rotate(-1.3,this.path.bounds.center);
                    bottomTriangle.rotate(-1.3,this.path.bounds.center);
                    topTriangle.rotate(-1.3,this.path.bounds.center);
                  }
                }else if(event.point.y>this.path.bounds.center.y){
                  if(event.delta.x<0 || event.delta.y>0){
                    this.path.rotate(1.3);
                    arrow.rotate(1.3,this.path.bounds.center);
                    rectangle.rotate(1.3,this.path.bounds.center);
                    bottomLeft.rotate(1.3,this.path.bounds.center);
                    bottomRight.rotate(1.3,this.path.bounds.center);
                    topLeft.rotate(1.3,this.path.bounds.center);
                    topRight.rotate(1.3,this.path.bounds.center);
                    rightTriangle.rotate(1.3,this.path.bounds.center);
                    leftTriangle.rotate(1.3,this.path.bounds.center);
                    bottomTriangle.rotate(1.3,this.path.bounds.center);
                    topTriangle.rotate(1.3,this.path.bounds.center);
                  } else {
                    this.path.rotate(-1.3);
                    arrow.rotate(-1.3,this.path.bounds.center);
                    rectangle.rotate(-1.3,this.path.bounds.center);
                    bottomLeft.rotate(-1.3,this.path.bounds.center);
                    bottomRight.rotate(-1.3,this.path.bounds.center);
                    topLeft.rotate(-1.3,this.path.bounds.center);
                    topRight.rotate(-1.3,this.path.bounds.center);
                    rightTriangle.rotate(-1.3,this.path.bounds.center);
                    leftTriangle.rotate(-1.3,this.path.bounds.center);
                    bottomTriangle.rotate(-1.3,this.path.bounds.center);
                    topTriangle.rotate(-1.3,this.path.bounds.center);
                  }
                } else if (event.point.x<this.path.bounds.center.x){
                  if(event.delta.x>0 || event.delta.y<0){
                    this.path.rotate(1.3);
                    arrow.rotate(1.3,this.path.bounds.center);
                    rectangle.rotate(1.3,this.path.bounds.center);
                    bottomLeft.rotate(1.3,this.path.bounds.center);
                    bottomRight.rotate(1.3,this.path.bounds.center);
                    topLeft.rotate(1.3,this.path.bounds.center);
                    topRight.rotate(1.3,this.path.bounds.center);
                    rightTriangle.rotate(1.3,this.path.bounds.center);
                    leftTriangle.rotate(1.3,this.path.bounds.center);
                    bottomTriangle.rotate(1.3,this.path.bounds.center);
                    topTriangle.rotate(1.3,this.path.bounds.center);
                  } else {
                    this.path.rotate(-1.3);
                    arrow.rotate(-1.3,this.path.bounds.center);
                    rectangle.rotate(-1.3,this.path.bounds.center);
                    bottomLeft.rotate(-1.3,this.path.bounds.center);
                    bottomRight.rotate(-1.3,this.path.bounds.center);
                    topLeft.rotate(-1.3,this.path.bounds.center);
                    topRight.rotate(-1.3,this.path.bounds.center);
                    rightTriangle.rotate(-1.3,this.path.bounds.center);
                    leftTriangle.rotate(-1.3,this.path.bounds.center);
                    bottomTriangle.rotate(-1.3,this.path.bounds.center);
                    topTriangle.rotate(-1.3,this.path.bounds.center);
                  }
                } else {
                  if(event.delta.x>0 || event.delta.y>0){
                    this.path.rotate(1.3);
                    arrow.rotate(1.3,this.path.bounds.center);
                    rectangle.rotate(1.3,this.path.bounds.center);
                    bottomLeft.rotate(1.3,this.path.bounds.center);
                    bottomRight.rotate(1.3,this.path.bounds.center);
                    topLeft.rotate(1.3,this.path.bounds.center);
                    topRight.rotate(1.3,this.path.bounds.center);
                    rightTriangle.rotate(1.3,this.path.bounds.center);
                    leftTriangle.rotate(1.3,this.path.bounds.center);
                    bottomTriangle.rotate(1.3,this.path.bounds.center);
                    topTriangle.rotate(1.3,this.path.bounds.center);
                  } else {
                    this.path.rotate(-1.3);
                    arrow.rotate(-1.3,this.path.bounds.center);
                    rectangle.rotate(-1.3,this.path.bounds.center);
                    bottomLeft.rotate(-1.3,this.path.bounds.center);
                    bottomRight.rotate(-1.3,this.path.bounds.center);
                    topLeft.rotate(-1.3,this.path.bounds.center);
                    topRight.rotate(-1.3,this.path.bounds.center);
                    rightTriangle.rotate(-1.3,this.path.bounds.center);
                    leftTriangle.rotate(-1.3,this.path.bounds.center);
                    bottomTriangle.rotate(-1.3,this.path.bounds.center);
                    topTriangle.rotate(-1.3,this.path.bounds.center);
                  }
                }
              } else { // если выбрана не стрелочка и не сторона
                this.path.position.x += event.delta.x;
                this.path.position.y += event.delta.y;
                this.deleteScaleRectangle()
                this.drawScaleRectangle()
                this.deleteRotationArrows()
                this.drawRotationArrow(event)
              }
            } else if(this.sideScaleRectangleNumber !== null) {
              switch(this.sideScaleRectangleNumber) {
                case 0:
                  event.delta.x < 0 ? this.path.scale(1.03, 1) : this.path.scale(0.97, 1)
                  break;
                case 1:
                  event.delta.y < 0 ? this.path.scale(1, 1.04) : this.path.scale(1, 0.97)
                  break;
                case 2:
                  event.delta.x > 0 ? this.path.scale(1.03, 1) : this.path.scale(0.97, 1)
                  break;
                case 3:
                  event.delta.y > 0 ? this.path.scale(1, 1.04) : this.path.scale(1, 0.97)
                  break;
              }
              this.deleteScaleRectangle()
              this.drawScaleRectangle()
              this.deleteRotationArrows()
              this.drawRotationArrow(event)
            }
          } else {
            if (this.segmentDot){
              console.log(11)
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
              } else if (this.pathSelected) {
                this.path.position.x += event.delta.x;
                this.path.position.y += event.delta.y;
              }
            }

          }
        }

      };
      this.tool.onMouseUp = () => {
        let self = this;

        if(!this.dragMode) { // если находимся на стадии рисования
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

          // если есть пересечения, избавляемся от них
          if (this.crossedArr.length) {
            this.cutCrossings(readyPointsGo)
          } else {
            this.FinArr = readyPointsGo
          }
          // чистим холст
         this.$emit('clearHandler', false)

          self.path = new paper.Path()
          self.path.strokeColor = 'black';

          // заново рисуем фигуру
          for (let i = 0; i < this.FinArr.length; i++) {
            self.path.add(new paper.Point(this.FinArr[i].x, this.FinArr[i].y));
          }
          self.path.closed = true;
          self.path.fillColor = { hue: Math.random() * 360, saturation: 1, lightness: (Math.random() - 0.5) * 0.4 + 0.4 };

          self.path.simplify(30);

          if(this.currentIndex != this.pathHistory.length-1){
            this.pathHistory.splice(this.currentIndex+1,Infinity)
          }
          this.pathHistory.push({data:this.scope.project._children[0]._children.find(i=>i.className == "Path").pathData})
          this.currentIndex = this.pathHistory.length-1


        } else {
          if(this.scaleMode){
            this.deleteScaleRectangle()
            this.drawScaleRectangle()
          }
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
    // устанавливаем ширину холста согласно вёрстке
    if(window.innerWidth>1465){
      this.scope.project.view.viewSize = ['600', '750'];
    } else if(window.innerWidth>1024){
      this.scope.project.view.viewSize = ['456', '570'];
    } else if(window.innerWidth>890){
      this.scope.project.view.viewSize = ['400', '500'];
    } else if(window.innerWidth>700){
      this.scope.project.view.viewSize = ['320', '400'];
    } else {
      this.scope.project.view.viewSize = ['280', '350'];
    }
  },
  watch:{
    simpValue(val, oldVal){


      let self = this
      if(this.scaleMode){
        this.changeScale()
        this.deleteRotationArrows()
      }

      if(this.scope.project._children[0]._children.find(i=>i.className == "Path")){
        //this.pathHistory.push({data:this.scope.project._children[0]._children.find(i=>i.className == "Path").pathData, simplify:true})
        //this.currentIndex++

        

        if(val>oldVal){

          this.currentIndex++
          let lastPath=this.pathHistory[this.pathHistory.length-1].data

          this.$emit('clearSimp')
          self.path = new paper.Path(lastPath)
          self.path.strokeColor = 'black';
          self.path.fillColor = 'red';


          self.path.flatten(1);
          self.path.simplify(3);




        } else {
          //self.path.simplify();
          //self.path.flatten(40/val);
          this.back(true)
        }
        this.pathHistory.push({data:this.scope.project._children[0]._children.find(i=>i.className == "Path").pathData, simplify:true})
        //this.currentIndex++

        this.drawCircles()
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
  margin-left: 40px;
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
canvas[resize] {
  width: 600px ;
  height: 750px ;
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

@media (max-width: 1465px) {
  canvas[resize] {
    width: 456px;
    height: 570px;
  
}
.btn-wrap{
  margin-bottom: 25px;
}
.buttons-wrap{
  margin-left: 35px;
}
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
  canvas[resize] {
  width: 400px;
  height: 500px;
  
}
.btn-wrap{
  margin-bottom: 23px;
}
.buttons-wrap{
  margin-left: 20px;
}
  .btn-tool{
  font-size: 11px;
  letter-spacing: 2px;
  width: 195px;
  height: 35px;
}
.btn-tool-arrow{
  font-size: 11px;
  letter-spacing: 2px;
  width: 93px;
  height: 35px;
}
}
@media (max-width: 890px) {
  canvas[resize] {
  width: 320px;
  height: 400px;
}
.btn-wrap{
  margin-bottom: 20px;
}
.buttons-wrap{
  margin-left: 15px;
}
  .btn-tool{
  font-size: 9px;
  width: 175px;
  height: 30px;
}
.btn-tool-arrow{
  font-size: 9px;
  width: 82px;
  height: 30px;
}
}
@media (max-width: 700px) {
  .buttons-block{
    height: 80%;
  }
  canvas[resize] {
  width: 280px;
  height: 350px;
}
.btn-wrap{
  margin-bottom: 18px;
}
.buttons-wrap{
  margin-left: 12px;
}
  .btn-tool{
  font-size: 8px;
  width: 155px;
  letter-spacing: 1px;
  height: 26px;
}
.btn-tool-arrow{
  font-size: 8px;
  width: 72px;
  letter-spacing: 1px;
  height: 26px;
}
}
@media (max-width: 570px) {
  .buttons-block{
    height: 80%;
  }
  canvas[resize] {
  width: 280px;
  height: 350px;
}
.btn-wrap{
  margin-bottom: 18px;
}
.buttons-wrap{
  margin-left: 12px;
}
  .btn-tool{
  font-size: 8px;
  width: 155px;
  letter-spacing: 1px;
  height: 26px;
}
.btn-tool-arrow{
  font-size: 8px;
  width: 72px;
  letter-spacing: 1px;
  height: 26px;
}
}
</style>