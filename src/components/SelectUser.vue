<template>
    <div>
        <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="联系电话"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱"
                    show-overflow-tooltip>
            </el-table-column>
        </el-table>

        <el-pagination
                @current-change="handleCurrentChange"
                :current-page="pages.number"
                :page-size="pages.size"
                layout="total, prev, pager, next, jumper"
                :total="pages.totalElements"
                background
                align='center'>
        </el-pagination>
    </div>

</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {SysMenu, SysUser} from "@/entity/Sys";
    import {JpaPage, Result} from "@/entity/Base";
    import {Message} from "element-ui";

    @Component
    export default class SelectUser extends Vue {


        private tableData: SysUser[] = [];

        private selectKeys: bigint[] = [];

        private user: SysUser = new SysUser();

        private pages: JpaPage = new JpaPage();

        created() {
            this.loadTableData();
        }

        /**
         * 加载用户
         */
        loadTableData() {
            this.axios.post("sys/user/findForTable", this.user).then((result) => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.pages = v.translateJpa();
                    this.tableData = v.data.content;
                } else {
                    Message.error("加载失败!");
                }
            });
        }

        /**
         * 处理选中用户
         * @param val
         */
        handleSelectionChange(val: Array<any>) {
            this.selectKeys = [];
            val.forEach(e => {
                this.selectKeys.push(e.id);
            })
        }

        /**
         * 分页事件
         * @param val
         */
        handleCurrentChange(val: any) {
            this.user.page = val - 1;
            this.loadTableData();
        }


    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #banner {

    }
</style>
