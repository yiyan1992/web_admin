<template>
    <div>
        <el-form :model="form" ref="form" label-width="110px">

            <el-col :span="6">
                <el-form-item label="角色名称">
                    <el-input v-model="form.name" clearable/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="角色名称">
                    <el-input v-model="form.description" clearable/>
                </el-form-item>
            </el-col>
        </el-form>

        <el-button class="el-button--primary" @click="searchForm('form')">查询</el-button>

        <el-divider/>

        <el-table stripe :data="table" row-key="id">
            <el-table-column prop="name" label="名称" sortable/>
            <el-table-column prop="description" label="描述" sortable/>
            <el-table-column label="操作">
                <el-button>aaa</el-button>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page.number"
                :page-count="page.totalPages"
                :total="page.totalElements"
                layout="total, prev, pager, next,sizes">
        </el-pagination>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    import {SysRole, SysMenu} from '../../entity/Sys';
    import {Result, JpaPage} from '../../entity/Base';

    @Component
    export default class SysRoleView extends Vue {

        private form: SysRole = new SysRole();

        private table: SysRole[] = [];

        private page: JpaPage = new JpaPage();

        created() {
            this.searchForm("form");
        }

        searchForm(form: string) {
            this.axios.post("sys/role/findForPage", this.form).then(result => {
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