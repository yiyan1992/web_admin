<template>
    <div>
        <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                  style="width: 100%" highlight-current-row @current-change="handleCurrentRowChange">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="name" label="名称"/>
            <el-table-column prop="description" label="描述"/>
        </el-table>
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="tableData.length">
        </el-pagination>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Result} from "@/entity/Base";
    import {Message} from "element-ui";
    import {Algorithm} from "@/entity/Algorithm";

    @Component
    export default class SelectAlgorithm extends Vue {

        private tableData: Algorithm[] = [];

        private currentRow!: Algorithm;

        private currentPage = 1;

        private pageSize = 10;

        created() {
            this.load();
        }

        handleSizeChange(val: any) {
            this.pageSize = val;
        }

        handleCurrentChange(val: any) {
            this.currentPage = val;
        }

        handleCurrentRowChange(val: Algorithm) {
            this.currentRow = val;
        }

        load() {
            this.axios.post("algorithm/findForCompanyId/" + sessionStorage.getItem("company"), {}).then((result) => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.tableData = v.data;
                } else {
                    Message.error("加载失败!");
                }
            });
        }

        submit(): Algorithm {
            if (!this.currentRow) {
                Message.warning("请先选择数据!");
                return new Algorithm();
            }
            return this.currentRow
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #banner {

    }
</style>
