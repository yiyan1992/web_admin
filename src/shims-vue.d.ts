declare module '*.vue' {
    import Vue from "vue";
    export default Vue
}

declare function hasPermission(str: string): boolean;
