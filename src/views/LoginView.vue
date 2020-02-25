<template>
    <div id="app">
        <img alt="Vue logo" src="../assets/logo.png">
        <el-form :model="form" :rules="rules" hide-required-asterisk label-width="70px" ref="form" size="small">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username"/>
            </el-form-item>
            <el-form-item label="密 码" prop="password">
                <el-input show-password v-model="form.password"/>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="form.remember">记住登录</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit('form')">登陆</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Login} from '@/entity/Login'
    import {Message} from "element-ui";

    @Component
    export default class LoginView extends Vue {

        private form: Login = new Login();

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
                    this.axios.post("login", this.form).then(result => {
                        if (result.data.code == 200) {
                            Message.success("登录成功!");
                            sessionStorage.setItem("Authorization", result.data.data);
                            this.$router.replace("/");
                        }
                    });
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
