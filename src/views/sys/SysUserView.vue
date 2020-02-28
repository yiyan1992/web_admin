<template>
    <div>
        <el-form :model="form" ref="form" label-width="110px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="姓名">
                        <el-input v-model="form.name" clearable/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="用户名">
                        <el-input v-model="form.username" clearable/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="邮箱">
                        <el-input v-model="form.email" clearable/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="电话">
                        <el-input v-model="form.phone" clearable/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-button class="el-button--primary" @click="searchForm('form')">查询</el-button>
        <el-button @click="toAdd">添加</el-button>
        <el-table stripe :data="table" row-key="id">
            <el-table-column prop="name" label="姓名" sortable/>
            <el-table-column prop="username" label="用户名" sortable/>
            <el-table-column prop="email" label="邮箱" sortable/>
            <el-table-column prop="phone" label="电话" sortable/>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="toUpdate(scope.$index, scope.row)" type="text">编辑</el-button>
                    <el-button @click="toUpdateRole(scope.$index, scope.row)" type="text">角色</el-button>
                    <el-button @click.prevent="toDelete(scope.$index, scope.row)" type="text">删除</el-button>
                    <el-button @click.prevent="toRestPwd(scope.$index, scope.row)" type="text">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page.number"
                :page-size="page.size"
                :total="page.totalElements"
                layout="total, prev, pager, next,sizes">
        </el-pagination>


        <el-dialog :visible.sync="dialog.show">
            <div slot="title" class="header-title">
                <span> {{ dialog.title }}</span>
            </div>
            <el-form :model="dialog.form" label-width="110px" :rules="dialog.rules" ref="dialog.form"
                     style="width: 50%;margin-left: 25%;margin-right: 25%;">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="dialog.form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="dialog.form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="dialog.form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="dialog.form.phone" autocomplete="off"></el-input>
                    <el-tag>新增用户密码为手机号后6位</el-tag>
                </el-form-item>
                <el-form-item label="所属公司" prop="companyId">
                    <el-select v-model="dialog.form.companyId" filterable placeholder="请选择所属公司" style="width:100%">
                        <el-option
                                v-for="item in companyData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.show = false">取 消</el-button>
                <el-button type="primary" @click="dialogSave('dialog.form')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="selectRole.show">
            <div slot="title" class="header-title">
                <span>选择角色</span>
            </div>
            <select-role v-bind:user-id="selectRole.userId" ref="selectRole"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="selectRole.show = false">取 消</el-button>
                <el-button type="primary" @click="roleSelect">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    import {SysUser} from '@/entity/Sys';
    import {JpaPage, Result} from '@/entity/Base';
    import {Message, MessageBox} from "element-ui";
    import SelectRole from "@/components/SelectRole.vue";
    import {Company} from "@/entity/Company";

    @Component({
        components: {
            SelectRole
        }
    })

    export default class SysUserView extends Vue {

        private form: SysUser = new SysUser();

        private table: SysUser[] = [];

        private companyData: Company[] = [];

        private page: JpaPage = new JpaPage();


        private dialog = {
            show: false,
            title: "用户",
            form: new SysUser(),
            rules: {
                name: [
                    {required: true, message: "请输入姓名", trigger: "blur"},
                    {min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur"}
                ],
                username: [
                    {required: true, message: "请输入用户名", trigger: "blur"},
                    {min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur"}
                ],
                email: [
                    {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                ],
                phone: [
                    {required: true, message: "请输入电话", trigger: "blur"},
                    {min: 11, max: 11, message: "请输入电话", trigger: "blur"}
                ],
                companyId:[
                    {required: true, message: "请选择所属公司", trigger: "blur"},
                ]
            }
        };

        private selectRole = {
            userId: null,
            show: false
        }

        created() {
            this.searchForm("form");
        }

        toAdd() {
            this.dialog.show = true;
            this.dialog.title = "添加";
            this.dialog.form = new SysUser();
            this.findAllCompany();
        }

        toUpdate(index: number, row: any) {
            this.dialog.title = "修改";
            this.axios.get("sys/user/findById/" + row.id).then(result => {
                let v = new Result(result);
                this.dialog.form = v.data;
            });
            this.dialog.show = true;
        }

        toUpdateRole(index: number, row: any) {
            this.selectRole.show = true;
            this.selectRole.userId = row.id;
        }

        roleSelect() {
            let selectRole: any = this.$refs.selectRole;
            selectRole.submit();
            this.selectRole.show = false;
        }

        toDelete(index: number, row: any) {
            MessageBox.confirm('此操作将删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.post("sys/user/deleteById/" + row.id).then(result => {
                    let v = new Result(result);
                    if (v.code == 200) {
                        Message.success("删除成功!");
                        this.searchForm("form");
                    }
                });
            }).catch(() => {
                Message.info("已取消删除");
            });
        }

        toRestPwd(index: number, row: any) {
            MessageBox.confirm('此操作将重置用户密码为手机号后六位, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.post("sys/user/restPwd/" + row.id).then(result => {
                    let v = new Result(result);
                    if (v.code == 200) {
                        Message.success("重置成功!");
                        this.searchForm("form");
                    }
                });
            }).catch(() => {
                Message.info("已取消重置!");
            });
        }

        dialogSave(form: string) {
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    this.axios.post("sys/user/save", this.dialog.form).then(result => {
                        let v = new Result(result);
                        if (v.code == 200) {
                            this.dialog.show = false;
                            this.searchForm("form");
                            Message.success('保存成功!');
                        } else {
                            Message.error('保存失败!');
                        }
                    });
                }
            });
        }

        searchForm(form: string) {
            this.axios.post("sys/user/findForPage", this.form).then(result => {
                let v = new Result(result);
                this.page = v.translateJpa();
                this.table = v.data.content;
            });
        }

        handleSizeChange(val: number) {
            this.form.size = val - 1;
            this.searchForm("form");
        }

        handleCurrentChange(val: number) {
            this.form.page = val - 1;
            this.searchForm("form");
        }

        findAllCompany() {
            this.axios.post("company/findForPage", this.form).then(result => {
                let v = new Result(result);
                this.companyData = v.data.content;
            });
        }

    }


</script>
