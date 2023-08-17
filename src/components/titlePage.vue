<template>
  <div class="video-container">
<!--    <video autoplay muted loop>
      <source src="../assets/video.mp4" type="video/mp4" />
    </video>-->
    <div class="caption">
      <div class="title_container text">
        <div class="first-word">Белое зеркало</div>
        <div class="second-row">
          <span class="second-word">Создай своё&nbsp; </span>
          <span class="third-word"> уникальное зеркало</span>
        </div>
        <div class="second-row">
          <span class="description">Нарисуй форму, выбери раму, цвет и крепление. А мы приедем и установим его в удобное время</span>
        </div>
        <div class="second-row">



              <button class="button" @click="toDrawPage">СОЗДАТЬ</button>

        </div>








        <!-- <router-view v-slot="{Component}">
          <transition name="slide" mode="out-in">
            <component :is="Component" :key="$route.path"></component>
          </transition>
        </router-view> -->

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitlePage',
  methods: {
    goDraw(){
    },
    toDrawPage(){
      this.$router.push('/draw')
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

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
/*.fade-enter-active, .fade-leave-active {*/
/*  transition-property: opacity;*/
/*  transition-duration: .25s;*/
/*}*/

/*.fade-enter-active {*/
/*  transition-delay: .25s;*/
/*}*/

/*.fade-enter, .fade-leave-active {*/
/*  opacity: 0*/
/*}*/
.main{
  width: 100vw;
  height: 100vh;
}
.video-container {
  height: 80vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.title_container {
  margin-right: .5em;
  color: #231f20;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 700px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 45px;
}
.second-row{
  display: flex;
  justify-content: center;
}
.video-container video {
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
  z-index: 0;
  transform: translate(-50%,);
}

/* Just styling the content of the div, the *magic* in the previous rules */
.video-container .caption {
  z-index: 1;
  position: relative;
  height: 100%;
  text-align: center;
  background-image: url(../assets/banner2.jpg);
  background-repeat: no-repeat;
  background-color: white;
  background-position: center center;
  background-size: cover;
}
.first-word{
  font-family: 'Poiret One';
  font-size: 32px;
  line-height: 1.3em;
  font-weight: 900;
}
.second-word{
  font-weight: 900;
  font-size: 38px;
}
.third-word{
  font-size: 38px;

}
.description{
  margin-top: 25px;
  margin-bottom: 25px;
  max-width: 400px;
  font-size: 21px;
  line-height: 1.4em;
}
@media (max-width: 768px) {
  .first-word{
    font-size: 28px;
  }
  .video-container {
    height: 70vh;
  }
  .title_container {
    width: 90%;
  }
  .description{
    width: 100%;
    display: flex;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .second-word{
    font-size: 25px;
    line-height: 1.2em;
    margin-top: 8px;
  }
  .third-word{
    font-size: 25px;
    line-height: 1.2em;
    margin-top: 8px;
  }
  .description{
    font-size: 19px;
    margin-top: 0px;
    margin-top: 8px;
  }
}
@media (max-width: 412px) {
  .second-row{
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .first-word{
    font-size: 21px;
  }
  .second-word{
    font-size: 25px;
    line-height: 1em;
  }
  .third-word{
    margin-top: 0px;
    font-size: 25px;
    line-height: 1em;
  }
  .description{
    margin-top: 8px;
    font-size: 17px;
    line-height: 1.2em;
  }
  .button{
    width: 150px;
    font-size: 12px;
  }
  .title_container {
    padding-top: 33px;
  }
}
@media (max-width: 280px) {
  .first-word{
    font-size: 19px;
  }
  .second-word{
    font-size: 20px;
  }
  .third-word{
    font-size: 20px;
  }
  .description{
    font-size: 15px;
  }
  .title_container {
    padding-top: 25px;
  }
}
</style>
