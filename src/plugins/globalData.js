import {CheckTokenResponse} from "@/entity/Login";
import Vue from 'vue'

let _res = new CheckTokenResponse();

Plugin.install = function (Vue, options) {
    console.log(_res)
    Vue.globalData = _res;
    window.globalData = _res;
    Object.defineProperties(Vue.prototype, {
        globalData: {
            get() {
                return _res;
            },
            set(v) {
                _res = v;
            }
        },
        $globalData: {
            get() {
                return _res;
            },
            set(v) {
                _res = v;
            }
        }
    });
};

Vue.use(Plugin);

export default Plugin;