<template>
    <div>
        <el-form :inline="true" :model="user" align="left">
            <el-form-item>
                <el-input v-model="user.name" placeholder="请输入用户姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="selectUser">查询</el-button>
            </el-form-item>
        </el-form>
        <el-divider/>
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
            >
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="联系电话"
            >
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
    import {SysUser} from "@/entity/Sys";
    import {JpaPage, Result} from "@/entity/Base";
    import {Message} from "element-ui";

    @Component
    export default class SelectUser extends Vue {

        @Prop() private companyId!: bigint;

        private tableData: SysUser[] = [];

        private selectUsers: SysUser[] = [];

        private user: SysUser = new SysUser();

        private userSelectForm: SysUser = new SysUser();

        private pages: JpaPage = new JpaPage();

        created() {
            this.selectUsers = [];
            const {companyId} = this;
            if (companyId > 0) {
                this.loadEmployee();
            } else {
                this.loadTableData();
            }


        }

        /**
         * 加载用户
         */
        loadTableData() {
            this.axios.post("sys/user/findForPage", this.user).then((result) => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.pages = v.translateJpa();
                    this.tableData = v.data.content;
                } else {
                    Message.error("加载失败!");
                }
            });
        }

        loadEmployee() {
            this.axios.post("sys/user/findEmployee/" + this.companyId).then((result) => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.tableData =v.data;
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
            this.selectUsers = val;
        }

        /**
         * 分页事件
         * @param val
         */
        handleCurrentChange(val: any) {
            this.user.page = val - 1;
            this.loadTableData();
        }

        /**
         * 用户查询点击事件
         */
        selectUser() {
            this.loadTableData();
        }


        getselectUsers() {
            let sysUsers = this.selectUsers;
            return sysUsers;
        }


    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #banner {

    }
</style>
