import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import VueAxios from "vue-axios";

Vue.config.productionTip = false;

Vue.prototype.hasPermission = function (str: string) {
    if (str=="aaa"){
        return false;
    }
    return true;
}

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
