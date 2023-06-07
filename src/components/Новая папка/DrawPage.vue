<template>
  <div style="width: 100%; height:100%; display: flex; ">
    <router-link to="/">
            <button class="button-home">Белое зеркало</button>
    </router-link>

    <div style="height:100vh; width: 100%">
      <el-carousel ref="carousel" style="height:100%" direction="vertical" :autoplay="false">
        <el-carousel-item>
          <!-- <h3 text="2xl" justify="center">111</h3> -->
          <master-paper
            @changeIndex="setActiveItem"
            @setPathCurveExternal="setPathCurveExternal"
            :externalPathCurveCall="externalPathCurveCall"
          />
        </el-carousel-item>
        <el-carousel-item>
          <!-- <h3 text="2xl" justify="center">222</h3> -->
          <main-wrap
            @changeIndex="setActiveItem"
            @externalPath="externalPathCall"
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

export default {
  name: "DrawPage",
  data: () => ({
    pathCurve: null,
    pathCurveExternal: null,
    externalPathCurveCall: false
  }),
  components:{
    masterPaper, mainWrap
  },
  methods: {
    externalPathCall(){
      this.externalPathCurveCall = true
    },
    setPathCurveExternal(val){
      console.log(val)
      this.pathCurveExternal = val
    },
    setActiveItem(index, val) {
        this.pathCurve=val
        this.$refs.carousel.setActiveItem(index);
      }
  }

}
</script>

<style>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-active {
  padding-left: 10px;
  opacity: 0;
}
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
cursor: pointer;
color: white;
background-color: #231f20;
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
@media (max-width: 1300px) {
  .button-home{
  width: 150px;
  height: 40px;
  font-size: 12px;
  letter-spacing: 2px;
  top: 8%;
}
}
@media (max-width: 1024px) {
  .button-home{
  width: 140px;
  height: 35px;
  font-size: 11px;
  letter-spacing: 2px;
  top: 8%;
}
}
</style>