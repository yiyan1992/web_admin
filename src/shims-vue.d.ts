import Vue from "vue";
import {CheckTokenResponse} from "@/entity/Login";

declare module '*.vue' {
    export default Vue
}

declare function hasPermission(str: string): boolean;

declare module 'vue/types/vue' {

    interface Vue {
        $globalData: CheckTokenResponse;
        globalData: CheckTokenResponse;
    }
}