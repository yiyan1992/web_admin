import Vue from 'vue'
import './plugins/axios'
import "vue-axios";
import router from './router'
import './plugins/element.js'
import App from './App.vue'


Vue.config.productionTip = false;

Vue.prototype.hasPermission = function (str: string): boolean {
    if (str == null || str.length == 0) return false;
    let item = sessionStorage.getItem("permission");
    if (item == null || item.length == 0) return false;
    let strings = item.split(",");
    let set = new Set(strings);
    return set.has(str);
}

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
