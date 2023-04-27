<template>
  <div>
    <!-- button toggles -->
    <div class="row mt-5">
      <div class="col-5" />
      <div class="col-2">
        <button class="btn btn-primary btn-block" @click.prevent="clearHandler">CLEAR</button>
      </div>
      <div>
        <input type="range" id="volume" name="volume"
               min="2" max="150" :disabled="canDraw" v-model="simpValue">
        <label for="volume">Volume</label>{{simpValue}}
      </div>
      <div class="col-5"/>
    </div>

    <!-- canvas single -->
    <div class="row mt-5">
      <div class="col-2"/>
      <div class="col-8">
        <canvas-paper
            :clear="clear"
            :simpValue="simpValue"
            :dragMode="!canDraw"
            @clearCanvas="reset"
            @clearSimp="clearSimp"
            :canvas-id="'canvas-one'"
            ref="childCanvas"
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
    simpValue: 2,
    canDraw: true,
    buttons: ['Simple', 'Separate', 'Replicated'],
    single: true,
    clear: false
  }),
  methods: {
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