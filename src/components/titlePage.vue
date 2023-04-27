<template>
  <div class="video-container">
<!--    <video autoplay muted loop>
      <source src="../assets/video.mp4" type="video/mp4" />
    </video>-->
    <div class="caption">
      <div class="title_container text">
        <div class="first-word">Белое зеркало</div>
        <div class="second-row">
          <span class="second-word">Создай своё </span>&nbsp;
          <span class="third-word"> уникальное зеркало</span>
        </div>
        <div class="second-row">
          <span class="description">Нарисуй форму, выбери раму, цвет и крепление. А мы приедем и установим его в удобное время</span>&nbsp;
        </div>
        <div class="second-row">
          
          <router-link to="/draw">
            <button class="button">СОЗДАТЬ</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitlePage',
  methods: {
    goDraw(){
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
  font-size: 19px;
  line-height: 1.4em;
}
@media (max-width: 768px) {
  .first-word{
    font-size: 23px;
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
    font-size: 23px;
    line-height: 1.2em;
  }
  .third-word{
    font-size: 23px;
    line-height: 1.2em;
  }
  .description{
    font-size: 15px;
    margin-top: 0px;
  }
}
@media (max-width: 412px) {
  .first-word{
    font-size: 16px;
  }
  .second-word{
    font-size: 16px;
  }
  .third-word{
    font-size: 16px;
  }
  .description{
    font-size: 12px;
  }
}
@media (max-width: 280px) {
  .first-word{
    font-size: 12px;
  }
  .second-word{
    font-size: 12px;
  }
  .third-word{
    font-size: 12px;
  }
  .description{
    font-size: 12px;
  }
}
</style>
