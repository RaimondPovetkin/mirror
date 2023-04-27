<template>
  <div class="slider text">
    <div class="title">Работы наших креативных клиентов</div>

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

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-button.button{
  margin-top: 5px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  padding: 8px;
}
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
grid-gap: 3%;
grid-template-columns: 1fr 1fr 1fr 1fr;
}
.card-item{
height: 90%;
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
pointer-events: none;
width: 100%;
height: 100%;
background-position: center center;
background-size: cover;
border-radius: 20px 20px 0 0;
}
.card-sign{
font-size: 12px;
line-height: 1.2em;
padding-top: 22px;
}
.card-button{
color: #231f20;
background-color: white;
font-size: 12px;
border: 1px solid #231f20;
line-height: 1em;
}
.card-button:hover{
color: white;
background-color: #231f20;
}
@media (max-width: 1024px) {
  /*.card-image{*/
  /*  height: 200px;*/
  /*}*/
  /*.card-item{*/
  /*  height: 295px;*/
  /*}*/
  .card-sign{
    font-size: 10px;
    padding-top: 13px;
  }
  .card-button.button{
    font-size: 9px;
    letter-spacing: 2px;
    width: 70%;
  }
}
@media (max-width: 768px) {
.card-image{
  height: 75%;
}
.content-row{
grid-template-columns: 1fr 1fr;
}
.card-button{
width: 60%;
}
.title{
font-size: 23px;
}
.card-sign{
  font-size: 12px;
  padding-top: 5%;
}
.card-button.button{
  font-size: 11px;
  letter-spacing: 3px;
  padding: 1em;
}
}
@media (max-width: 640px) {
  .card-sign{
    font-size: 10px;
    padding-top: 5%;
  }
  .card-button.button{
    font-size: 9px;
    letter-spacing: 2px;
    padding: .8em;
  }
}
@media (max-width: 412px) {
.title{
font-size: 16px;
}
.card-sign{
  font-size: 7px;
}
.card-button.button{
  font-size: 6px;
  letter-spacing: 2px;
  padding: .8em;
}
}
@media (max-width: 280px) {
.title{
font-size: 14px;
}
.card-sign{
  font-size: 5px;
}
.card-button.button{
  font-size: 4px;
  letter-spacing: 2px;
  padding: .8em;
}
}
</style>
