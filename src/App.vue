<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
// import MainWrap from './components/MainWrap.vue'
// import MasterPaper from "@/components/MasterPaper";
//import FirstPage from "@/components/FirstPage";
//import DrawPage from "@/components/DrawPage";

export default {
  name: 'App',
  components: {
    // DrawPage,
    // MainWrap,
    // MasterPaper,
    //FirstPage
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Kelly+Slab&family=Sofia+Sans:ital,wght@1,300&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Kelly+Slab&family=Roboto:wght@300&family=Sofia+Sans:ital,wght@1,300&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Kelly+Slab&family=Poiret+One&family=Roboto:wght@300&family=Sofia+Sans:ital,wght@1,300&display=swap');

@font-face {
  font-family: 'Poiret One';
  src: url('assets/PoiretOne-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Sofia Sans';
  src: url('assets/SofiaSans-Italic-VariableFont_wght.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Bahamas Heavy';
  src: url('assets/bahamasheavyboldcyr_boldcyr.otf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
body {
  cursor: url('assets/frames/reload.png'),auto;
}
*{
  margin: 0;
  padding: 0;
  scroll-behavior: smooth;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/* width */
::-webkit-scrollbar {
  width: 20px;
}

/* Track */
::-webkit-scrollbar{
  width: 10px;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #3b3536;
  border-radius: 10px;
  width: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #231f20;
  width: 5px;
}
.button{
  margin-top: 15px;
  padding: 15px;
  padding-left: 21px;
  padding-right: 21px;
  color: white;
  background-color: #231f20;
  border-radius: 50px;
  border: 1px solid rgba(255, 0, 0, .0);
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  letter-spacing: 3px;
}
.button:hover{
  color: #231f20;
  background-color: white;
  border: 1px solid #231f20;
  cursor: url('assets/frames/pointer.png'),pointer;
}
.text{
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently*/
  font-family: 'Sofia Sans', sans-serif;
  line-height: 1.5em;
  font-weight: normal;
  font-size: 35px;
}


input[type=range] {
  height: 30px;
  -webkit-appearance: none;
  margin: 10px auto;
  width: 60%;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 30px;
  cursor: url('assets/frames/pointer.png'),pointer;
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
  cursor: url('assets/frames/pointer.png'),pointer;
  -webkit-appearance: none;
  margin-top: 0px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #b4a4a1;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 30px;
  cursor: url('assets/frames/pointer.png'),pointer;
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
  cursor: url('assets/frames/pointer.png'),pointer;
}
input[type=range]::-ms-track {
  width: 100%;
  height: 30px;
  cursor: url('assets/frames/pointer.png'),pointer;
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
  cursor: url('assets/frames/pointer.png'),pointer;
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
  cursor: url('assets/frames/pointer.png'),pointer;
  -webkit-appearance: none;
  margin-top: 0px;
}
input[type=range]:disabled::-webkit-slider-runnable-track {
  width: 100%;
  height: 30px;
  cursor: url('assets/frames/pointer.png'),pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #353535;
  background: #dbc8c4;
  border-radius: 30px;
  border: 1px solid #464646;
}


@media (max-width: 768px) {
  .button {
    font-size: 13px;
    padding: 13px;
    padding-left: 19px;
    padding-right: 19px;
  }
}
@media (max-width: 412px) {
  .button {
    font-size: 10px;
    padding: 12px;
    padding-left: 18px;
    padding-right: 18px;
  }
}

/*.fade-leave-active {*/

/*  transition: opacity 2s;*/
/*}*/
/*.fade-enter-active  {*/

/*  transition: opacity 2s;*/
/*  opacity: 0;*/
/*}*/
/*.fade-enter-to{*/

/*  opacity: 1;*/
/*}*/
/*.fade-leave{*/

/*}*/
/*.fade-enter {*/
/*}*/
/*.fade-leave-to,.fade-enter-from {*/
/*  opacity: 0;*/
/*}*/





/*.fade-enter-active,*/
/*.fade-leave-active {*/
/*  transition: opacity 1s ease;*/
/*}*/

/*.fade-enter-from,.fade-leave-to{*/
/*  opacity: 0;*/
/*}*/


</style>
