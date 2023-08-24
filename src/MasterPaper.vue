<template>
  <div>

    <!-- canvas single -->
    <div class="row" style="margin-top: 50px;">
      <div class="col-2"/>
      <div class="col-8">
        <canvas-paper
            :dragMode="!canDraw"
            @clearSimp="clearSimp"
            :canvas-id="'canvas-one'"
            ref="childCanvas"
            @clearHandler="clearHandler"
            @nextButton="changeIndex"
            @setPathCurveExternal="setPathCurveExternal"
            :externalPathCurveCall="externalPathCurveCall"
        />
      </div>
      <div class="col-2"/>
    </div>
  </div>
</template>

<script>
import CanvasPaper from "@/components/CanvasPaper";
export default {
  name: "MasterPaper",
  data: () => ({
    canDraw: true,
  }),
  props: {
    externalPathCurveCall: Boolean,
  },
  methods: {
    setPathCurveExternal(val){
      this.$emit('setPathCurveExternal',val)
    },
    changeIndex(val){
      this.$emit('changeIndex',1,val)
    },
    clearHandler(can){
      this.canDraw = can
      this.$refs.childCanvas.reset();
    },
    clearSimp(){
      this.$refs.childCanvas.reset();
    }
  },
  components: {
    CanvasPaper
  }
}
</script>

<style scoped>
</style>