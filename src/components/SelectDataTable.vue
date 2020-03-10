<template>
    <div>
        <el-table :data="table.slice((currentPage-1)*pageSize,currentPage*pageSize)" highlight-current-row
                  @current-change="handleCurrentRowChange" ref="table">
            <el-table-column prop="name" label="表名"/>
        </el-table>
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-size="pageSize" layout="total, sizes, prev, pager, next"
                       :total="table.length">
        </el-pagination>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Result} from "@/entity/Base";
    import {Message} from "element-ui";
    import {DataSourceTable} from "@/entity/DataSource";

    @Component
    export default class SelectDataTable extends Vue {

        @Prop() private dataSourceId!: bigint;

        private table: DataSourceTable[] = [];

        private currentRow!: DataSourceTable;


        created() {
            this.loadData();
        }

        loadData() {
            this.axios.post("tableInfo/findTableByDataSourceId/" + this.dataSourceId).then((result) => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.table = v.data;
                } else {
                    Message.error("加载失败!");
                }
            });
        }

        handleCurrentRowChange(val: DataSourceTable) {
            this.currentRow = val;
        }

        submit(): DataSourceTable {
            if (!this.currentRow) {
                return new DataSourceTable();
            }
            return this.currentRow;
        }

        private currentPage = 1;

        private pageSize = 10;

        handleSizeChange(val: any) {
            this.pageSize = val;
        }

        handleCurrentChange(val: any) {
            this.currentPage = val;
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #banner {

    }
</style>
