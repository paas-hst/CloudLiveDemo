import Vue from 'vue'
import Router from 'vue-router'
import Base from '../views/Base.vue'
import LiveManager from '../views/LiveManager.vue';
import LivePlayer from '../views/LivePlayer.vue';
import Login from '../views/Login.vue';

Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/live',
            component: Base,
            children: [{
                    path: 'manager',
                    name: 'manager',
                    component: LiveManager
                },
                {
                    path: 'player',
                    name: 'player',
                    component: LivePlayer
                }
            ]
        },
        {
            path: '/login',
            component: Login,
            name: 'login',
        }
    ]
})

router.beforeEach((to, from, next) => {
    document.title = "好视通云通信-云直播DEMO";
    next();
})

export default router;