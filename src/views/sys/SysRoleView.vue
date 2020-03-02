<template>
    <div>
        <el-form :model="form" ref="form" label-width="110px">

            <el-col :span="6">
                <el-form-item label="角色名称">
                    <el-input v-model="form.name" clearable/>
                </el-form-item>
            </el-col>
        </el-form>
        <el-button class="el-button--primary" @click="searchForm('form')">查询</el-button>
        <el-button @click="toAdd">添加</el-button>
        <el-divider/>
        <el-table stripe :data="table" row-key="id">
            <el-table-column prop="name" label="名称" sortable/>
            <el-table-column prop="description" label="描述" sortable/>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="toUpdate(scope.$index, scope.row)" type="text">编辑</el-button>
                    <el-button @click="toUpdateMenu(scope.$index, scope.row)" type="text">菜单</el-button>
                    <el-button @click.prevent="toDelete(scope.$index, scope.row)" type="text">删除</el-button>
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
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="dialog.form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                    <el-input v-model="dialog.form.description" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.show = false">取 消</el-button>
                <el-button type="primary" @click="dialogSave('dialog.form')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="selectMenu.show">
            <div slot="title" class="header-title">
                <span> 选择菜单</span>
            </div>
            <select-menu v-bind:role-id="selectMenu.roleId" ref="selectMenu"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="selectMenu.show = false">取 消</el-button>
                <el-button type="primary" @click="menuSelect">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    import {SysRole} from '@/entity/Sys';
    import {Result, JpaPage} from '@/entity/Base';
    import {Message, MessageBox} from "element-ui";
    import SelectMenu from "@/components/SelectMenu.vue";

    @Component({
        components: {
            SelectMenu
        }
    })

    export default class SysRoleView extends Vue {

        form: SysRole = new SysRole();

        table: SysRole[] = [];

        private page: JpaPage = new JpaPage();


        private dialog = {
            show: false,
            title: "角色添加",
            form: new SysRole(),
            rules: {
                name: [
                    {required: true, message: "请输入角色名称", trigger: "blur"},
                    {min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur"}
                ],
            }
        };

        private selectMenu = {
            roleId: null,
            show: false
        }

        mounted() {
            this.searchForm("form");
        }

        searchForm(form: string) {
            this.axios.post("sys/role/findForPage", this.form).then(result => {
                let v = new Result(result);
                this.page = v.translateJpa();
                this.table = v.data.content;
            });
        }

        toAdd() {
            this.dialog.show = true;
            this.dialog.title = "添加";
            this.dialog.form = new SysRole();
        }

        toUpdate(index: number, row: any) {
            this.dialog.title = "修改";
            this.axios.get("sys/role/findById/" + row.id).then(result => {
                let v = new Result(result);
                this.dialog.form = v.data;
            });
            this.dialog.show = true;
        }

        toUpdateMenu(index: number, row: any) {
            this.selectMenu.show = true;
            this.selectMenu.roleId = row.id;
        }

        menuSelect() {
            let selectMenu: any = this.$refs.selectMenu;
            selectMenu.submit();
            this.selectMenu.show = false;
        }

        toDelete(index: number, row: any) {
            MessageBox.confirm('此操作将删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.post("sys/role/deleteById/" + row.id).then(result => {
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

        handleSizeChange(val: number) {
            this.form.size = val;
            this.searchForm("form");
        }

        handleCurrentChange(val: number) {
            this.form.page = val - 1;
            this.searchForm("form");
        }

        resetForm(formName: string) {
            (this.$refs[formName] as any).resetFields();
        }

        dialogSave(form: string) {
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    this.axios.post("sys/role/save", this.dialog.form).then(result => {
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

    }


</script>
