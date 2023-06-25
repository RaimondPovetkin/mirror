<template>
  <div class="first-page" id="butter">
    <title-page/>
    <slider-home/>
  </div>
</template>

<script>
import sliderHome from "@/components/sliderHome";
import TitlePage from "@/components/titlePage";
export default {
  name: "FirstPage",
  components: {TitlePage, sliderHome},
  mounted() {
    var options = {
      wrapperDamper: 0.05,
      cancelOnTouch: true
    };
    window.butter.init(options);
  }
}
</script>

<style scoped>
.first-page{
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
</style>