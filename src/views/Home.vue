<template>
    <div id="banner">
        <el-row>
            <el-col :span="4">
                <span style="font-size: 30px">管理后台</span>
            </el-col>
            <el-col :span="1" :offset="17">
                <el-badge :value="messageNumber" class="item" id="msg">
                    <el-button icon="el-icon-message-solid" circle @click="toMessage"></el-button>
                </el-badge>
            </el-col>
            <el-col :span="1">
                <el-dropdown @command="dropDownHandle">
                    <span style="font-size: 20px">
                        <i class="el-icon-user-solid"></i>{{data.user==undefined?"":data.user.name}}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="my">我的</el-dropdown-item>
                        <el-dropdown-item command="pwd">密码</el-dropdown-item>
                        <el-dropdown-item command="logout">注销</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
        <el-divider/>
        <div id="left">
            <el-menu class="el-menu-vertical-demo" router>

                <el-submenu v-for="menu in menus" v-bind:key="menu.id" :index="menu.name">
                    <template slot="title">
                        <span slot="title">{{menu.name}}</span>
                    </template>
                    <el-menu-item :index="child.url" v-for="child in menu.children" v-bind:key="child.id">
                        {{child.name}}
                    </el-menu-item>
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
    import {SysMenu} from "@/entity/Sys";

    @Component
    export default class App extends Vue {

        private messageNumber: number = 0;

        private data: CheckTokenResponse = new CheckTokenResponse();

        private menus: SysMenu[] = [];

        mounted() {
            this.messageNumber = 2;
            let item = sessionStorage.getItem("Authorization");
            if (item != null && item.length > 0) {
                this.axios.get("checkToken").then(result => {
                    let v = new Result(result);
                    if (v.code == 200) {
                        this.data = v.data;
                        this.resolverMenu();
                        this.permission();
                        return;
                    }
                    this.$router.replace("/login")
                });
            } else
                this.$router.replace("/login")
        }

        resolverMenu() {
            let parents = this.data.menus.filter(e => {
                return e.parentId == null;
            })
            parents = parents.sort((a, b) => {
                if (a.id == b.id) {
                    return 0;
                }
                return a.id > b.id ? 1 : -1;
            });

            parents.forEach(parent => {
                let children = this.data.menus.filter(e => {
                    return parent.id == e.parentId;
                });
                children = children.sort((a, b) => {
                    if (a.id == b.id) {
                        return 0;
                    }
                    return a.id > b.id ? 1 : -1;
                });
                parent.children = children;
            })
            this.menus = parents;
        }

        permission() {
            let arr = this.data.menus.filter(e => {
                return e.permission != null && e.permission.length > 0;
            }).map(e => {
                return e.permission;
            }).join(",");
            sessionStorage.setItem("permission", arr);
        }

        dropDownHandle(val: string) {
            if (val == "logout") {
                this.logout();
            } else if (val == "my") {
                this.toMy();
            } else if (val == "pwd") {
                this.toPwd();
            }
        }

        toMy() {

        }

        toPwd() {

        }

        logout() {
            this.axios.get("logout");
            sessionStorage.clear();
            this.$router.push("/login");
        }

        toMessage() {

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
