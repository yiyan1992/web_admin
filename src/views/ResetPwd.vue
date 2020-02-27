<template>
    <div id="banner">
        <el-form :model="resetPwdForm" :rules="rules" ref="resetPwdForm" label-width="110px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="旧密码" prop="oldPwd">
                        <el-input v-model="resetPwdForm.oldPwd" clearable/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="6">
                    <el-form-item label="新密码" prop="newPwd">
                        <el-input v-model="resetPwdForm.newPwd" clearable/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="6">
                    <el-form-item label="新密码确认" prop="newPwdAgain">
                        <el-input v-model="resetPwdForm.newPwdAgain" clearable/>
                    </el-form-item>
                </el-col>
            </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" @click="submit('resetPwdForm')">确认修改</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {ResetPwd} from "@/entity/Sys";
    import {Message} from "element-ui";

    @Component
    export default class App extends Vue {

        private resetPwdForm = new ResetPwd();

      private rules = {
        oldPwd: [
          {required: true, message: "请输入旧密码", trigger: "blur"},
          {min: 6, max: 20, message: "长度在 6到 20 个字符", trigger: "blur"}
        ],
        newPwd: [
          {required: true, message: "请输入新密码", trigger: "blur"},
          {min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur"}
        ],
        newPwdAgain: [
          {required: true, message: "请再次输入新密码", trigger: "blur"},
          {min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur"}
        ],
      };


      submit(resetPwdForm: string) {
        let ref: any;
        ref = this.$refs[resetPwdForm];
        ref.validate((valid: boolean) => {
          if (valid) {
            if (this.resetPwdForm.newPwd == this.resetPwdForm.newPwdAgain) {
              this.axios.post("resetPwd", this.resetPwdForm).then(result => {
                if (result.data.code != 200) {
                  Message.error(result.data.msg);
                } else {
                  Message.success("修改成功!");
                }
              });
            } else {
              Message.error("新密码两次输入不一致！");
              return false;
            }
          }
        });
      }
    }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
