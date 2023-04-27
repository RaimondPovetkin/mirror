<!--console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');-->
<template>
  {{clear}}{{simpValue}}
  <button @click="getCanvas">getCanvas</button>
  <div>
    <canvas :id="canvasId" class="canvas-style" v-on:mousedown="mouseDown"
    />
  </div>
  <canvas id="canvas2" class="canvas-style"></canvas>
</template>

<script>

const paper = require('paper');
export default {
  name: "CanvasPaper",
  props: {
    simpValue: Number,
    canvasId:String,
    clear: Boolean,
    dragMode: Boolean,
  },
  data: () => ({

    pathExtra:null,

    segment: null,
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
    getCanvas() {
      const canvas = document.getElementById("canvas-one");
      const ctx = canvas.getContext("2d")
      let canvArr = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data

      const canvas2 = document.getElementById("canvas2");
      canvas2.width = canvas.width;
      canvas2.height = canvas.height;
      let ctx2 = canvas2.getContext('2d');
      ctx2.drawImage(canvas, 0, 0)

      var c = document.getElementById("canvas2");
      var ctx7 = c.getContext("2d");
      var imgData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
      var i;
      for (i = 0; i < imgData.data.length; i += 4) {
        if (canvArr[i + 1] == 128 && canvArr[i + 3] == 255) {
          imgData.data[i + 0] = 55;
          imgData.data[i + 1] = 65;
          imgData.data[i + 2] = 34;
          imgData.data[i + 3] = 255;
        } else {
          imgData.data[i + 0] = 255;
          imgData.data[i + 1] = 255;
          imgData.data[i + 2] = 255;
          imgData.data[i + 3] = 255;
        }
      }
      ctx7.putImageData(imgData, 0, 0);

      //let canvArr7 = ctx7.getImageData(0, 0, ctx7.canvas.width, ctx7.canvas.height).data

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
          this.path.selected = false;
        }
        this.tool = this.createTool(this.scope);
      }
      this.tool.onMouseDown = (event) => {
        if(!this.dragMode) {
          self.path = self.pathCreate(self.scope);
          self.path.add(event.point);
        } else {
          this.segment = null;
          this.path2 = null;
          let hitResult = this.scope.project.hitTest(event.point, this.hitOptions);

          if (!hitResult)
            return;


          if (event.modifiers.shift) {
            if (hitResult.type == 'segment') {
              hitResult.segment.remove();
            }
            return;
          }

          if (hitResult) {
            this.path2 = hitResult.item;
            if(hitResult.type == 'fill' || hitResult.item._type == "circle"){
              this.path2 = this.scope.project._children[0]._children[0]



              if(hitResult.item._type == "circle"){
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



            if (hitResult.type == 'segment') {
              this.segment = hitResult.segment;
            } else if (hitResult.type == 'stroke' && hitResult.item._type != "circle") {
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
      };


      this.tool.onMouseMove= (event) => {
        this.scope.project.activeLayer.selected = false;
        if (event.item){
          event.item.selected = true;
        }
      }

      this.tool.onMouseDrag = (event) => {

        while(this.scope.project._children[0]._children.find(i=>i.type=="circle")){
          for(let i=0 ; i<this.scope.project._children[0]._children.length ; i++){
            if(this.scope.project._children[0]._children[i].type=="circle"){
              this.scope.project._children[0]._children[i].remove()
            }
          }
        }



        if(!this.dragMode) {

          self.path.add(event);
          self.path.fillColor = '#efefef';

          if (this.crossedArr.length) {
            this.crossed = true
          }
        } else {
          if(this.path2._segments){
            for(let i=0 ; i<this.path2._segments.length ; i++){
              var shape19 = new paper.Shape.Circle(new paper.Point(this.path2._segments[i].point.x,this.path2._segments[i].point.y), 10);
              shape19.strokeColor = 'rgba(0,38,32,0.5)';
              shape19.fillColor = 'rgba(0,255,217,0.5)';
            }
          }
          if (this.segment) {

            this.segment.point.x += event.delta.x;
            this.segment.point.y += event.delta.y;
            //this.path2.smooth();
          } else if (this.path2) {
            this.path2.position.x += event.delta.x;
            this.path2.position.y += event.delta.y;
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
          self.path.simplify(2);

          if(self.path._segments){
            for(let i=0 ; i<self.path._segments.length ; i++){
              var shape19 = new paper.Shape.Circle(new paper.Point(self.path._segments[i].point.x,self.path._segments[i].point.y), 10);
              shape19.strokeColor = 'rgba(0,38,32,0.5)';
              shape19.fillColor = 'rgba(0,255,217,0.5)';
            }
          }


          this.pathExtra = self.path

        }
      }
    }
  },
  mounted() {
    this.scope = new paper.PaperScope();
    this.scope.setup(this.canvasId);
  },
  watch:{
    clear(){
      this.currentArr = [];
      this.finishArr = []
    },
    simpValue(val){
      console.log(this.pathExtra)
      console.log(val)

      let self = this;


      if(this.path2){
        //this.path2.simplify(val);




        this.$emit('clearSimp')

        self.path = new paper.Path()
        self.path.strokeColor = 'black';

        for (let i = 0; i < this.FinArr.length; i++) {
          self.path.add(new paper.Point(this.FinArr[i].x, this.FinArr[i].y));
        }
        self.path.closed = true;
        self.path.fillColor = { hue: 0.5 * 360, saturation: 1, lightness: (0.5 - 0.5) * 0.4 + 0.4 };
        self.path.simplify(val);

      } else {
        this.path.simplify(val);
      }
    }
  }
}
</script>

<style scoped>
.canvas-style {
  cursor: crosshair;
  width: 50% !important;
  height: 500px !important;
  border: 5px solid black;
  border-radius: 10px;
  display: block;
  margin: auto;
  box-shadow: 0 10px 8px -8px black;
}
</style>