<template>
  <div style="width: 100%; height:100%; display: flex; ">
    <div style="width: 20%; height:100%;">
      <el-steps direction="vertical" :active="1" style="width: 150px">
      <el-step title="Step 1">
        
      </el-step>
      <el-step title="Step 2">
        
      </el-step>
      <el-step title="Step 3" />
    </el-steps>
    </div>
    <div style="height:100vh; width: 100%">
      <el-carousel ref="carousel" style="height:100%" direction="vertical" :autoplay="false">
        <el-carousel-item>
          <!-- <h3 text="2xl" justify="center">111</h3> -->
          <master-paper
            @changeIndex="setActiveItem"
          />
        </el-carousel-item>
        <el-carousel-item>
          <h3 text="2xl" justify="center">222</h3>
          <main-wrap/>
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
  components:{
    masterPaper, mainWrap
  },
  methods: {
    setActiveItem(index) {
        this.$refs.carousel.setActiveItem(index);
      }
  }

}
</script>

<style>
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

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>