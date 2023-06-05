<template>
  <title-page/>
  <slider-home/>
</template>

<script>
import sliderHome from "@/components/sliderHome";
import TitlePage from "@/components/titlePage";
export default {
  name: "FirstPage",
  components: {TitlePage, sliderHome}
}
</script>

<style scoped>

</style>