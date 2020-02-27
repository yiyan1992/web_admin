"use strict";

import Vue from 'vue';
import axios from "axios";
import router from "../router";
import {Result} from "../entity/Base";
import {Message} from "element-ui";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const PREFIX = "Bearer ";
console.log(process.env.VUE_APP_BASE_URL)
let config = {
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 60 * 1000, // Timeout
    withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
    function (config) {
        let item = sessionStorage.getItem("Authorization");
        if (item != null && item.length > 0) {
            config.headers['Authorization'] = PREFIX + item;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
_axios.interceptors.response.use(
    function (response) {
        let v = new Result(response);
        if (v.code === 400) {
            sessionStorage.clear();
            router.replace("/login").then(r => {
                Message.warning("登录已过期,请重新登录!");
            });
        } else if (v.code === 500) {
            Message.warning(v.msg);
        }
        return response;
    },
    function (error) {
        // Do something with response error
        return Promise.reject(error);
    }
);

Plugin.install = function (Vue, options) {
    Vue.axios = _axios;
    window.axios = _axios;
    Object.defineProperties(Vue.prototype, {
        axios: {
            get() {
                return _axios;
            }
        },
        $axios: {
            get() {
                return _axios;
            }
        },
    });
};

Vue.use(Plugin);

export default Plugin;