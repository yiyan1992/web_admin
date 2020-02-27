<template>
    <div>
        <div class="left">A</div>
        <div class="right">B</div>
    </div>
</template>

<script>
    import {Component, Vue} from "vue-property-decorator";

    @Component({
        components: {}
    })

    export default class TargetDataSourceView extends Vue {

    }
</script>

<style scoped>
    #left {
        float: left;
        width: 20%;
    }

    #right {
        float: left;
        clear: right;
        width: 80%;
    }
</style>