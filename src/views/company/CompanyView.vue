<template>
    <div>
        <div class="container">
            <div class="left">
                <el-form :model="form" ref="form" label-width="110px">
                    <el-col :span="6">
                        <el-form-item label="公司名称">
                            <el-input v-model="form.name" clearable/>
                        </el-form-item>
                    </el-col>
                </el-form>
                <el-button class="el-button--primary" @click="searchForm('form')">查询</el-button>
                <el-button @click="toAdd">添加</el-button>
                <el-divider/>
                <el-table stripe :data="table" row-key="id" border>
                    <el-table-column prop="name" label="名称"/>
                    <el-table-column prop="user.name" label="管理员"/>
                    <el-table-column prop="description" label="描述"/>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="toUpdate(scope.$index, scope.row)" type="text">编辑</el-button>
                            <el-button @click.prevent="toDelete(scope.$index, scope.row)" type="text">删除</el-button>
                            <el-button @click.prevent="showEmployee(scope.$index, scope.row)" type="text">查看员工
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.number"
                        :page-size="page.size"
                        :total="page.totalElements"
                        layout="total, prev, pager, next,sizes">
                </el-pagination>
            </div>
            <div class="right" v-if="employeeTableShow">
            </div>
        </div>

        <el-dialog :visible.sync="employeeTableShow">
            <div slot="title" class="header-title">
                <span>查看员工</span>
            </div>
            <el-table stripe
                      :data="employeeTable.slice((employeeCurrentPage-1)*employeePageSize,employeeCurrentPage*employeePageSize)"
                      row-key="id"
                      border>
                <el-table-column prop="name" label="员工姓名" align="center"/>
                <el-table-column prop="phone" label="联系电话" align="center"/>
                <el-table-column prop="email" label="邮箱" align="center"/>
            </el-table>
            <el-pagination align='center' @size-change="handleEmployeeSizeChange"
                           @current-change="handleEmployeeCurrentChange"
                           :current-page="employeeCurrentPage" :page-sizes="[5,10,20]" :page-size="employeePageSize"
                           layout="total, sizes, prev, pager, next" :total="employeeTable.length">
            </el-pagination>
        </el-dialog>


        <el-dialog :visible.sync="dialog.show">
            <div slot="title" class="header-title">
                <span> {{ dialog.title }}</span>
            </div>
            <el-form :model="dialog.form" label-width="110px" :rules="dialog.rules" ref="dialogForm"
                     style="width: 50%;margin-left: 25%;margin-right: 25%;">
                <el-form-item label="公司名称" prop="name">
                    <el-input v-model="dialog.form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="公司描述" prop="companyDesc">
                    <el-input v-model="dialog.form.description" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="companyManager">
                    <el-input v-model="dialog.form.user.id" autocomplete="off" @focus="selectManager"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.show = false">取 消</el-button>
                <el-button type="primary" @click="dialogSave('dialogForm')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="selectManagerData.show">
            <div slot="title" class="header-title">
                <span> 选择用户</span>
            </div>
            <select-user ref="selectUser"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="selectUserData.show = false">取 消</el-button>
                <el-button type="primary" @click="managerSelect">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    import {JpaPage, Result} from '../../entity/Base';
    import {Company} from "@/entity/Company";
    import {SysUser} from "@/entity/Sys";
    import {Message} from "element-ui";
    import SelectUser from "@/components/SelectUser.vue";

    @Component({
        components: {
            SelectUser
        }
    })
    export default class CompanyView extends Vue {


        private form: Company = new Company();

        private table: Company[] = [];

        private employeeTableShow = false;
        private employeeTable: SysUser[] = [];

        private page: JpaPage = new JpaPage();

        private dialog = {
            show: false,
            title: "公司添加",
            form: new Company(),
            rules: {
                name: [
                    {required: true, message: "请输入公司名称", trigger: "blur"},
                    {min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur"}
                ],
            }
        };

        created() {
            this.searchForm("form");
        }

        toAdd() {
            this.dialog.show = true;
            this.dialog.title = "公司添加";
            this.dialog.form = new Company();
        }

        toUpdate(index: number, row: any) {
            this.dialog.title = "公司编辑";
            this.axios.get("company/findById/" + row.id).then(result => {
                let v = new Result(result);
                this.dialog.form = v.data;
            });
            this.dialog.show = true;
        }

        toDelete(index: number, row: any) {
            (this as any).$confirm('此操作将删除该公司和该公司下所有员工, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.post("company/delete", row).then(result => {
                    let v = new Result(result);
                    if (v.code == 200) {
                        (this as any).$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.searchForm("form");
                    }
                });
            }).catch(() => {
                (this as any).$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }

        dialogSave(form: string) {
            let ref: any;
            ref = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    this.axios.post("company/save", this.dialog.form).then(result => {
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
            this.axios.post("company/findForPage", this.form).then(result => {
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

        /**
         * 显示下属员工
         * @param index
         * @param row
         */
        showEmployee(index: number, row: any) {
            this.axios.post("sys/user/findEmployee/" + row.id).then(result => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.employeeTableShow = true;
                    this.employeeTable = v.data;
                } else {
                    Message.error("获取员工失败！");
                }
            });
        }

        private employeeCurrentPage = 1;
        private employeePageSize = 10;

        handleEmployeeSizeChange(val: any) {
            this.employeePageSize = val;
        }

        handleEmployeeCurrentChange(val: any) {
            this.employeeCurrentPage = val;
        }


        private selectManagerData = {
            show: false
        }

        /**
         * 添加公司负责人
         * @param index
         * @param row
         */
        selectManager(index: number, row: any) {
            this.selectManagerData.show = true;
        }

        /**
         * 用户选择弹窗确认事件
         */
        managerSelect() {
            let selectManager: any = this.$refs.selectUser;
            let user = selectManager.getCompanyManager();
            if (user.length > 1) {
                Message.error("公司负责人只允许存在一位!");
            } else {
                this.selectManagerData.show = false;
                this.dialog.form.user = user[0];
            }
        }
    }


</script>

<style scoped>
    .container {
        display: flex;
        justify-content: space-between;
    }

    .left {
        flex: 0 0 auto;
        width: 70%;
        height: 100px;
    }

    .right {
        flex: 0 0 auto;
        width: 28%;
        height: 100px;
    }
</style>
