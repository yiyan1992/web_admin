<template>
    <div>
        <el-form :model="form" ref="form" label-width="110px">

            <el-col :span="6">
                <el-form-item label="名称">
                    <el-input v-model="form.name" clearable/>
                </el-form-item>
            </el-col>
        </el-form>
        <el-button class="el-button--primary" @click="searchForm('form')">查询</el-button>
        <el-button @click="toAdd">添加</el-button>
        <el-divider/>
        <el-table stripe :data="table" row-key="id">
            <el-table-column prop="name" label="名称" sortable/>
            <el-table-column prop="expression" label="表达式"/>
            <el-table-column prop="description" label="描述"/>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="toUpdate(scope.$index, scope.row)" type="text">编辑</el-button>
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
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dialog.form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="表达式" prop="expression">
                    <el-input v-model="dialog.form.expression" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="dialog.form.description" autocomplete="off"></el-input>
                </el-form-item>

                <el-tag>测试表达式</el-tag>

                <el-form-item label="参数" prop="parameter">
                    <el-input v-model="dialog.form.parameter" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="结果">
                    <el-input v-model="dialog.result" autocomplete="off" disabled></el-input>
                </el-form-item>

                <el-divider/>

                <p>1.参数为 X (大写) 如表达式 X+1</p>
                <p>2.+(加),-(减),*(乘),/(除),%(取余),^(平方),sin(90)(sin),</p>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.show = false">取 消</el-button>
                <el-button @click="expressionTest">测 试</el-button>
                <el-button type="primary" @click="dialogSave('dialog.form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import {Algorithm} from "@/entity/Algorithm";
    import {JpaPage, Result} from "@/entity/Base";
    import BaseView from "@/entity/BaseView";
    import {Message, MessageBox} from "element-ui";
    import {Company} from "@/entity/Company";

    @Component
    export default class SysAlgorithmView extends BaseView {

        protected currentCompany!: Company;

        protected form: Algorithm = new Algorithm();

        private table: Algorithm[] = [];

        private page: JpaPage = new JpaPage();


        private dialog = {
            show: false,
            title: "添加",
            form: new Algorithm(),
            rules: {
                name: [
                    {required: true, message: "请输入名称", trigger: "blur"},
                    {max: 20, message: "长度 最大 20 个字符", trigger: "blur"}
                ],
            },
            result: ""
        };

        mounted() {
            this.searchForm("form");
        }

        searchForm(form: string) {
            let company = this.globalData.company;
            console.log(company.name)
            this.axios.post("algorithm/findForPage", this.form).then(result => {
                let v = new Result(result);
                this.page = v.translateJpa();
                this.table = v.data.content;
            });
        }

        toAdd() {
            this.dialog.show = true;
            this.dialog.title = "添加";
            this.dialog.form = new Algorithm();
            this.dialog.result = "";
        }

        expressionTest() {
            this.axios.post("algorithm/testAlgorithm", this.dialog.form).then(result => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.dialog.result = v.data;
                }
            });
        }

        toUpdate(index: number, row: any) {
            this.dialog.title = "修改";
            this.axios.get("algorithm/findById/" + row.id).then(result => {
                let v = new Result(result);
                this.dialog.form = v.data;
            });
            this.dialog.show = true;
            this.dialog.result = "";
        }

        dialogSave(form: string) {
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    this.axios.post("algorithm/save", this.dialog.form).then(result => {
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