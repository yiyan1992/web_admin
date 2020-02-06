<template>
    <div id="app">
        <img alt="Vue logo" src="../assets/logo.png">
        <el-form :model="form" :rules="rules" ref="form" label-width="70px" hide-required-asterisk="true" size="small">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密 码" prop="password">
                <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit('form')">登陆</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class Login extends Vue {

        private form = {
            username: "",
            password: ""
        };

        private rules = {
            username: [
                {required: true, message: "请输入用户名", trigger: "blur"},
                {min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur"}
            ],
            password: [{required: true, message: "请输入密码", trigger: "blur"}]
        };

        submit(form: string) {
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    console.log(this.form.username)
                }
            });
        }

        reset(form: string) {
            const ref: any = this.$refs[form];
            ref.resetFields();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #app {
        width: 30%;
        margin: 0 auto;
    }
</style>
