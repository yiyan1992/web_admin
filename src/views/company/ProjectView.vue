<template>
    <div>
        <el-button @click="toAdd">新建项目</el-button>
        <el-divider/>
        <el-table stripe :data="table" row-key="id" border>
            <el-table-column prop="name" label="项目名称"/>
            <el-table-column prop="createTime" label="创建时间"/>
            <el-table-column prop="user.name" label="管理员"/>
            <el-table-column prop="description" label="描述"/>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="toUpdate(scope.$index, scope.row)" type="text">编辑</el-button>
                    <el-button @click.prevent="toDelete(scope.$index, scope.row)" type="text">删除</el-button>
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
                <!--<el-form-item label="负责人" prop="companyManager">
                    <el-input v-model="dialog.form.user.id" autocomplete="off" @focus="selectManager"></el-input>
                </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.show = false">取 消</el-button>
                <el-button type="primary" @click="dialogSave('dialogForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    import {JpaPage, Result} from '@/entity/Base';
    import {Company, Project} from "@/entity/Company";
    import {Message} from "element-ui";
    import SelectUser from "@/components/SelectUser.vue";

    @Component({
        components: {
            SelectUser
        }
    })
    export default class ProjectView extends Vue {


        private form: Project = new Project();

        private table: Project[] = [];

        private page: JpaPage = new JpaPage();

        private dialog = {
            show: false,
            title: "公司添加",
            form: new Project(),
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
            this.dialog.title = "新增项目";
            this.dialog.form = new Project();
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
    }


</script>

<style scoped>
</style>
