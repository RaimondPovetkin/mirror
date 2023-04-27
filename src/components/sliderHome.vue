<template>
  <div class="slider text">
    <div class="title">Работы наших креативных клиентов</div>

<!--    <swiper
        :slidesPerView="3"
        :spaceBetween="30"
        :freeMode="true"
        :pagination="{
      clickable: true,
    }"
        :modules="modules"
        class="mySwiper"
    >
      <swiper-slide><div class="img">666</div></swiper-slide>
      <swiper-slide><div class="img">666</div></swiper-slide>
      <swiper-slide><div class="img">666</div></swiper-slide>
      <swiper-slide><div class="img">666</div></swiper-slide>
      <swiper-slide><div class="img">666</div></swiper-slide>
      <swiper-slide><div class="img">666</div></swiper-slide>
      <swiper-slide><div class="img">666</div></swiper-slide>
      <swiper-slide>Slide 8</swiper-slide>
      <swiper-slide>Slide 9</swiper-slide>
    </swiper>-->
    <div class="wrapper-block">
      <div class="content-row">
        <div class="card-item">
          <div class="card-image">
            <img class="image" src="../assets/collection/mir1.jpg">
          </div>
          <div class="card-sign">Ольга Иванова г.Москва</div>
          <div class="card-button button">ХОЧУ ТАКОЕ ЖЕ</div>
        </div>
        <div class="card-item">
          <div class="card-image">
            <img class="image" src="../assets/collection/mir2.jpg">
          </div>
          <div class="card-sign">Ольга Иванова г.Москва</div>
          <div class="card-button button">ХОЧУ ТАКОЕ ЖЕ</div>
        </div>
        <div class="card-item">
          <div class="card-image">
            <img class="image" src="../assets/collection/mir3.jpg">
          </div>
          <div class="card-sign">Ольга Иванова г.Москва</div>
          <div class="card-button button">ХОЧУ ТАКОЕ ЖЕ</div>
        </div>
        <div class="card-item">
          <div class="card-image">
            <img class="image" src="../assets/collection/mir4.jpg">
          </div>
          <div class="card-sign">Ольга Иванова г.Москва</div>
          <div class="card-button button">ХОЧУ ТАКОЕ ЖЕ</div>
        </div>
      </div>
    </div>

    <div class="wrapper-block">
      <div class="content-row">
        <div class="card-item">
          <div class="card-image">
            <img class="image" src="../assets/collection/mir1.jpg">
          </div>
          <div class="card-sign">Ольга Иванова г.Москва</div>
          <div class="card-button button">ХОЧУ ТАКОЕ ЖЕ</div>
        </div>
        <div class="card-item">
          <div class="card-image">
            <img class="image" src="../assets/collection/mir2.jpg">
          </div>
          <div class="card-sign">Ольга Иванова г.Москва</div>
          <div class="card-button button">ХОЧУ ТАКОЕ ЖЕ</div>
        </div>
        <div class="card-item">
          <div class="card-image">
            <img class="image" src="../assets/collection/mir3.jpg">
          </div>
          <div class="card-sign">Ольга Иванова г.Москва</div>
          <div class="card-button button">ХОЧУ ТАКОЕ ЖЕ</div>
        </div>
        <div class="card-item">
          <div class="card-image">
            <img class="image" src="../assets/collection/mir4.jpg">
          </div>
          <div class="card-sign">Ольга Иванова г.Москва</div>
          <div class="card-button button">ХОЧУ ТАКОЕ ЖЕ</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { Swiper, SwiperSlide } from "swiper/vue";
// import "swiper/css";
//
// import "swiper/css/free-mode";
// import "swiper/css/pagination";
//
// import "./style.css";
//
// import { FreeMode, Pagination } from "swiper";
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  // components: {
  //   Swiper,
  //   SwiperSlide
  // },
  // setup() {
  //   return {
  //     modules: [FreeMode, Pagination],
  //   };
  // },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title{
  color: #231f20;
  padding: 25px;
  font-family: 'Sofia Sans', sans-serif;
  line-height: 1.5em;
  font-size: 38px;
}
.img{
  width: 100%;
  background-image: url(../assets/sliderImg.jpg);
  background-size: cover;
  height: 364px;
}
.wrapper-block{
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}
.content-row{
  width: 90%;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr 1fr 1fr ;
}
.card-item{
  height: 350px;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
}
.card-image{
  height: 70%;
}
.image{
  height: 100%;
  width: 100%;
  border-radius: 20px 20px 0 0;
}
.card-sign{
  font-size: 12px;
  line-height: 1.2em;
  padding-top: 10px;
}
.card-button{
  color: #231f20;
  background-color: white;
  font-size: 12px;
  border: 1px solid #231f20;
  line-height: 1em;
  width: 50%;
  margin: auto;
}
.card-button:hover{
  color: white;
  background-color: #231f20;
}
@media (max-width: 512px) {
  .content-row{
    grid-template-columns: 1fr 1fr;
  }
  .card-button{
    width: 60%;
  }
}
</style>
