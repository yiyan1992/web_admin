<template>
    <div>
        <div id="left">
            <el-menu @open="menuOpen" class="el-menu-vertical-demo" router>
                <el-submenu index="0">
                    <template slot="title">
                        <i class="el-icon-location"/>
                        <span slot="title">导航一</span>
                    </template>
                    <el-menu-item index="/401">选项1</el-menu-item>
                    <el-menu-item index="/about">选项2</el-menu-item>
                    <el-menu-item index="/dataSource">数据源</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
        <div id="right">
            <router-view/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class Home extends Vue {

        @Prop() private username!: string;

        @Prop() private token!: string;

        created() {

        }

        menuOpen(key: string, keyPath: string) {
            console.log(key, keyPath);
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
