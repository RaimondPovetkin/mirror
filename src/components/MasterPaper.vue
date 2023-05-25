<template>
  <div>

    <!-- canvas single -->
    <div class="row" style="margin-top: 50px;">
      <div class="col-2"/>
      <div class="col-8">
        <canvas-paper
            :clear="clear"
            :dragMode="!canDraw"
            @clearCanvas="reset"
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
    clear: false
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
    reset() {
      this.canDraw = false
      this.$refs.childCanvas.reset();
      this.simpValue = 2;
      this.clear = !this.clear
    },
    clearHandler(){
      this.canDraw = true
      this.$refs.childCanvas.reset();
      this.simpValue = 2;
      this.clear = !this.clear
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