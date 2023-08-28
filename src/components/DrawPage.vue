<template>
  <div style="width: 100%; height:100%; display: flex;" class="draw-page">
    <router-link to="/">
      <el-button @mouseover="upHere = true" @mouseleave="upHere = false" class="button-home" v-if="widthScreen>570">
        <el-icon class="arrow-left" :size="20" style="margin-top: -5px;" :style="(upHere && widthScreen>570) ? 'transform: translateX(-7px);  transition: .5s;': ''">
          <ArrowLeft />
        </el-icon>
        <span v-if="widthScreen>890">Белое зеркало</span>
      </el-button>
    </router-link>

    <div style="height:100vh; width: 100%">
      <el-carousel ref="carousel" style="height:100%" direction="vertical" :autoplay="false">
        <el-carousel-item>
          <!-- <h3 text="2xl" justify="center">111</h3> -->
          <master-paper
            @changeIndex="setActiveItem"
            @setPathCurveExternal="setPathCurveExternal"
            :returnLastVertionTrigger="returnLastVertionTrigger"
          />
        </el-carousel-item>
        <el-carousel-item>
          <!-- <h3 text="2xl" justify="center">222</h3> -->
          <main-wrap
            @changeIndex="setActiveItem"
            :pathCurve="pathCurve"
            :pathCurveExternal="pathCurveExternal"
          />
        </el-carousel-item>
        <el-carousel-item>
          <h3 text="2xl" justify="center">333</h3>
        </el-carousel-item>
      </el-carousel>
    
    </div>
  </div>



</template>

<script>
import mainWrap from "@/components/MainWrap";
import masterPaper from "@/components/MasterPaper";
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue';

export default {
  name: "DrawPage",
  data: () => ({
    returnLastVertionTrigger:false,
    upHere:false,
    pathCurve: null,
    pathCurveExternal: null,
    widthScreen:window.innerWidth
  }),
  components:{
    masterPaper, mainWrap,ArrowLeft
  },
  // computed: {
  //   widthScreen(){
  //     return window.innerWidth
  //   }
  // },
  methods: {
    setPathCurveExternal(val){
      console.log(val)
      this.pathCurveExternal = val
    },
    setActiveItem(index, val) {
        this.pathCurve=val
        if(index==0){
          this.returnLastVertionTrigger = !this.returnLastVertionTrigger
        }
        this.$refs.carousel.setActiveItem(index);
      }
  }

}
</script>

<style>
.el-carousel__indicators{
  display: none;
}
.draw-page{
  animation: 1s linear 0s alternate opacity-animation;
}
@keyframes opacity-animation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
/*.slide-fade-enter-active {*/
/*  transition: all .3s ease;*/
/*}*/
/*.slide-fade-leave-active {*/
/*  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
/*}*/
/*.slide-fade-enter, .slide-fade-leave-active {*/
/*  padding-left: 10px;*/
/*  opacity: 0;*/
/*}*/
.button-home{
  width: 200px;
  height: 50px;
  border: 1px solid #231f20;
  border-radius: 50px;
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  letter-spacing: 3px;
  color: #231f20;
  background-color: white;
  border: 1px solid #231f20;
  line-height: 1.5em;
  position: absolute;
  left: 3.5%;
  top: 10%;
  transform: translateY(-50%);
  z-index: 10;
}
.button-home:hover{
  cursor: url('../assets/frames/pointer.png'),pointer;
/* color: white;
background-color: #231f20; */
color: #231f20;
  background-color: white;
  border: 1px solid #231f20;
}
.el-carousel__container {
  height: 100%;
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 50px;
  margin: 0;
  text-align: center;
}
/* 
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
} */
@media (max-width: 1465px) {
  .button-home{
  width: 160px;
  height: 40px;
  font-size: 12px;
  letter-spacing: 2px;
  top: 7%;
}
}
@media (max-width: 1024px) {
  .button-home{
  width: 150px;
  height: 35px;
  font-size: 11px;
  letter-spacing: 2px;
  top: 6%;
}
}
@media (max-width: 890px) {
  .button-home{
    width: 50px;
    height: 35px;
    font-size: 11px;
    letter-spacing: 2px;
    top: 6%;
  }
}
@media (max-width: 570px) {
  .button-home{
    width: 30px;
    height: 30px;
    font-size: 8px;
    letter-spacing: 2px;
    top: 3.5%;
  }

  .arrow-left-icon .material-design-icon__svg{
    width: 17px !important;
    height: 17px !important;
    margin-bottom: 2px;
    margin-left: 1px;
  }
  .delete-icon .material-design-icon__svg{
    margin-left: 1px;
  }
  .undo-icon .material-design-icon__svg{
    margin-left: 1px;
  }
  .redo-icon .material-design-icon__svg{
    margin-left: 1px;
  }
  .vector-curve-icon .material-design-icon__svg{
    margin-left: 1px;
  }
  .arrow-expand-icon .material-design-icon__svg{
    margin-left: 1px;
  }
}
</style>