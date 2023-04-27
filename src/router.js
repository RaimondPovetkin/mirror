import {createRouter, createWebHistory} from "vue-router";
import firstPage from "@/components/FirstPage.vue";
import drawPage from "@/components/DrawPage.vue";
//import VueRouter from 'vue-router'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {path:'/', component: firstPage},
        {path:'/draw', component: drawPage},
    ]
})


// let router = new createRouter({
//     history: createWebHistory(),
//     routes:[
//         {
//             path: '/',
//             name: 'home',
//             component: firstPage
//         },
//         {
//             path: '/draw',
//             name: 'draw',
//             component: drawPage
//         }
//     ]
// })
//
// export default router