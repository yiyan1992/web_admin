<template>
    <div id="banner">
        <el-row>
            <el-col :span="4">
                {{title}}
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
                        <el-dropdown-item>我的</el-dropdown-item>
                        <el-dropdown-item>密码</el-dropdown-item>
                        <el-dropdown-item>注销</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
        <el-divider/>


    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class Banner extends Vue {

        @Prop() private title!: string;

        @Prop() private username!: string;

        @Prop() private token!: string;

        private messageNumber!: number;

        created() {
            this.messageNumber = 2;
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #banner {

    }
</style>
