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





    <!-- <div v-show="count" class="wrapper-block appear">
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
    </div> -->





    <div class="trigger"></div>
  </div>
</template>

<script>

// let observer = new window.IntersectionObserver(this.returnOnEntry,this.options);
export default {
  name: 'HelloWorld',
  data: () => ({
    count: 0,
    observer: null,
    // row1:[
    //   {
    //     name: "Ольга Иванова г.Москва",
    //     img: "../assets/collection/mir1.jpg",
    //     path: "",
    //     price: "",
    //   },
    //   {
    //     name: "Ольга Иванова г.Москва",
    //     img: "../assets/collection/mir2.jpg",
    //     path: "",
    //     price: "",
    //   },
    //   {
    //     name: "Ольга Иванова г.Москва",
    //     img: "../assets/collection/mir3.jpg",
    //     path: "",
    //     price: "",
    //   },
    //   {
    //     name: "Ольга Иванова г.Москва",
    //     img: "../assets/collection/mir4.jpg",
    //     path: "",
    //     price: "",
    //   },
    // ]
  }),
  watch: {
    count() {
      console.log(document);
    }
  },
  props: {
    msg: String
  },
  computed: {

  },
  mounted() {
    this.observer = new IntersectionObserver(
      this.returnOnEntry(), 
      {
        threshold: [0.9],
      }
    );
    this.observer.observe(document.getElementsByClassName('trigger')[0]);
  },
  methods: {
    returnOnEntry(){
      let scope = this
      return function (entry) {
        entry.forEach(change => {
          if (change.isIntersecting) {
            scope.count++
            //change.target.classList.add('element-show');
          }
        });
      }
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.appear{
  opacity: 0;
  transform: translateY(20px);
  opacity: 1;
}
.appear.element-show {
  opacity: 1;
  transition: all 1.5s;
  transform: translateY(0%);
}



.appear{

}
.appear.element-show {

}
/* .trigger{
  height: 300px;
  background-color: aqua;
} */
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
font-size: 15px;
line-height: 1.2em;
padding-top: 28px;
padding-bottom: 12px;
}
.card-button{
color: #231f20;
background-color: white;
font-size: 15px;
border: 1px solid #231f20;
line-height: 1.5em;
}
.card-button:hover{
color: white;
background-color: #231f20;
}
@media (max-width: 1465px) {
  .card-sign{
    padding-top: 22px;
    padding-bottom: 0px;
  }
  .card-button{
    line-height: 1.5em;
    font-size: 13px;
    font-weight: 900;
  }
}
@media (max-width: 1024px) {
  /*.card-image{*/
  /*  height: 200px;*/
  /*}*/
  /*.card-item{*/
  /*  height: 295px;*/
  /*}*/
  .card-sign{
    font-size: 14px;
    padding-top: 13px;
  }
  .card-button{
    line-height: 1em;
  }
  .card-button.button{
    font-size: 12px;
    letter-spacing: 2px;
    width: 70%;
  }
}
@media (max-width: 870px) {
  .card-sign{
    font-size: 12px;
    padding-top: 13px;
  }
  .card-button.button{
    font-size: 10px;
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
  font-size: 15px;
  padding-top: 5%;
}
.card-button.button{
  font-size: 14px;
  letter-spacing: 3px;
  padding: 1em;
}
}
@media (max-width: 640px) {
  .card-sign{
    font-size: 13px;
    padding-top: 5%;
  }
  .card-button.button{
    font-size: 12px;
    letter-spacing: 2px;
    padding: .8em;
    margin-bottom: 17px;
  }
 .card-item{
   height: 100%;
 }
 .card-image{
   /*max-height: 213px;*/
 }
}
@media (max-width: 412px) {
.title{
font-size: 20px;
}
.card-sign{
  font-size: 11px;
}
.card-button.button{
  font-size: 8px;
  letter-spacing: 2px;
  padding: 1.2em;
  margin-bottom: 7px;
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
