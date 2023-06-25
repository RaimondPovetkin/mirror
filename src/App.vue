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
  box-shadow: inset 0 0 5px #b4b4b4;
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
  cursor: pointer;
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
