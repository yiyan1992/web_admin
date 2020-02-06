<template>
    <div>
        <el-row>
            <el-col :span="8">
                <el-menu class="el-menu-vertical-demo" @open="menuOpen" router>
                    <el-submenu index="0">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span slot="title">导航一</span>
                        </template>
                        <el-menu-item index="/about">选项1</el-menu-item>
                        <el-menu-item index="/about1">选项2</el-menu-item>
                    </el-submenu>
                </el-menu>
                <el-col :span="16">
                    <router-view></router-view>
                </el-col>
            </el-col>
        </el-row>
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
    #menus {
        float: left;
        width: 20%;
    }

    #content {
        float: left;
        clear: right;
        width: 80%;
    }
</style>
