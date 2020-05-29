/* eslint-disable no-console */
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import 'normalize.css/normalize.css';
import './plugins/iview.js';
import './css/global.css';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import '../src/lib/streamNo.js';
import axios from 'axios';
import router from './router/router';


Vue.config.productionTip = false;
Vue.use(iView);
Vue.prototype.$axios = axios;

if (process.env.NODE_ENV === 'development') {
    console.log('dev environment...');

    Vue.prototype.RECORD_SERVER_URL = 'http://127.0.0.1:18081'
} else {
    console.log('production environment...');

    Vue.prototype.RECORD_SERVER_URL = '';

    console.log = function () {}
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')