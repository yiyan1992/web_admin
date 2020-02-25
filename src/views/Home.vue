<template>
    <div id="banner">
        <el-row>
            <el-col :span="4">
                管理后台
            </el-col>
            <el-col :span="1" :offset="17">
                <el-badge :value="messageNumber" class="item" id="msg">
                    <el-button icon="el-icon-message-solid" circle></el-button>
                </el-badge>
            </el-col>
            <el-col :span="1">
                <el-dropdown>
                    <span>
                        <i class="el-icon-user-solid"></i>张三
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click="toMy">我的</el-dropdown-item>
                        <el-dropdown-item @click="toPwd">密码</el-dropdown-item>
                        <el-dropdown-item @click="logout">注销</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
        <el-divider/>
        <div id="left">
            <el-menu class="el-menu-vertical-demo" router>
                <el-submenu index="0">
                    <template slot="title">
                        <i class="el-icon-location"/>
                        <span slot="title">导航一</span>
                    </template>
                    <el-menu-item index="/401">选项1</el-menu-item>
                    <el-menu-item index="/about">选项2</el-menu-item>
                    <el-menu-item index="/dataSource">数据源</el-menu-item>
                    <el-menu-item index="/sysRole">角色</el-menu-item>
                    <el-menu-item index="/sysMenu">菜单</el-menu-item>
                    <el-menu-item index="/sysUser">用户</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
        <div id="right">
            <router-view/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Result} from "@/entity/Base";
    import {CheckTokenResponse} from "@/entity/Login";
    import {SysUser} from "@/entity/Sys";

    @Component
    export default class App extends Vue {

        private messageNumber: number = 0;

        private user: SysUser = new SysUser();

        mounted() {
            this.messageNumber = 2;

            let item = sessionStorage.getItem("Authorization");
            if (item != null && item.length > 0) {
                this.axios.get("checkToken").then(result => {

                    let v = new Result(result);
                    if (v.code == 200) {
                        let data: CheckTokenResponse = v.data;
                        this.user = data.user;
                    } else {
                        this.$router.replace("/login")
                    }
                });
            } else {
                this.$router.replace("/login")
            }
        }

        toMy() {

        }

        toPwd() {

        }

        logout() {
            this.axios.get("logout");
            sessionStorage.removeItem("Authorization");
            this.$router.replace("/login")
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
