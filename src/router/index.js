import Vue from 'vue'
import VueRouter from 'vue-router'
import firstPage from "@/components/FirstPage";
import drawPage from "@/components/DrawPage";


Vue.use(VueRouter)
Vue.use(VueMomentLib);
let router = new VueRouter({
    mode: 'history',
    routes:[
        {
            path: '/',
            name: 'home',
            component: firstPage
        },
        {
            path: '/draw',
            name: 'draw',
            component: drawPage
        }
    ]
})

export default router