<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script lang="ts">
    import {Vue} from 'vue-property-decorator';

    export default class App extends Vue {
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        margin: 0;
    }
</style>
