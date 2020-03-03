<template>
    <div>
        <div id="left">
            <el-tree
                    :allow-drag="allowDrag"
                    :allow-drop="allowDrop"
                    :data="treeData"
                    @node-click="handleNodeClick"
                    default-expand-all
                    highlight-current
                    node-key="id" ref="tree">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>
                          <span class="el-icon-folder" v-if="!data.button"/>
                          <span class="el-icon-tickets" v-if="data.button"/>
                          {{ data.name }}
                      </span>
                  </span>
            </el-tree>
        </div>
        <div id="right">
            <el-button @click="toAdd" style="float:left">新增职位</el-button>
            <el-divider/>
            <el-table stripe :data="table" row-key="id" border>
                <el-table-column prop="name" label="职位名称"/>
                <el-table-column prop="department.name" label="所属部门"/>
                <el-table-column prop="description" label="描述"/>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="toUpdate(scope.$index, scope.row)" type="text">编辑</el-button>
                        <el-button @click.prevent="toDelete(scope.$index, scope.row)" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :visible.sync="dialog.show">
            <div slot="title" class="header-title">
                <span> {{ dialog.title }}</span>
            </div>
            <el-form :model="dialog.form" :rules="dialog.rules" label-width="100px" ref="form">
                <el-form-item label="所属部门" prop="department.id">
                    <el-select v-model="dialog.form.department.id" filterable placeholder="请选择所属部门" style="width:100%">
                        <el-option
                                v-for="item in treeData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职位名称" prop="name">
                    <el-input v-model="dialog.form.name"/>
                </el-form-item>
                <el-form-item label="职位描述" prop="description">
                    <el-input v-model="dialog.form.description"/>
                </el-form-item>

                <el-form-item label="职位员工" prop="users">
                    <!--<el-select v-model="dialog.form.department.id" filterable placeholder="请选择所属部门" style="width:100%">
                        <el-option
                                v-for="item in treeData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>-->
                    <el-input v-model="selectUsers" autocomplete="off" @focus="selectManager"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="save('form')">保存</el-button>
                    <el-button @click="dialog.show=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog :visible.sync="selectManagerData.show">
            <div slot="title" class="header-title">
                <span> 选择用户</span>
            </div>
            <select-user v-bind:company-id="companyId" ref="selectUser"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="selectUserData.show = false">取 消</el-button>
                <el-button type="primary" @click="managerSelect">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Result} from '@/entity/Base';
    import {Message, MessageBox} from "element-ui";
    import {Department, Position} from "@/entity/Company";
    import {SysUser} from "@/entity/Sys";
    import SelectUser from "@/components/SelectUser.vue";

    @Component({
        components: {
            SelectUser
        }
    })
    export default class PositionView extends Vue {
        private companyId: string = "";

        private treeData: Department[] = [];

        private table: Position[] = [];

        private users: SysUser[] = [];

        private employee: SysUser[] = [];

        private allTable: Position [] = [];

        private selectUsers: string = "";

        private dialog = {
            show: false,
            title: "",
            form: new Position(),
            rules: {
                name: [
                    {required: true, message: "请输入职位名称", trigger: "blur"},
                    {min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur"}
                ],
                department: {
                    id: [{required: true, message: "请选择所属部门", trigger: "change"}]
                }
            }
        };

        created() {
            this.loadTree();
            this.loadTable();
        }

        loadTree() {
            this.axios.get("department/findForPosition", {}).then((result) => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.treeData = v.data;
                } else {
                    Message.error("加载失败!");
                }
            });
        }

        loadTable() {
            this.axios.get("position/findForPage", {}).then((result) => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.table = v.data;
                    this.allTable = v.data;
                } else {
                    Message.error("加载失败!");
                }
            });
        }

        loadEmployee() {
            let cId = this.treeData[0].company.id;
            this.companyId = cId;
            this.axios.post("sys/user/findEmployee/" + cId).then((result) => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.employee = v.data;
                } else {
                    Message.error("加载失败!");
                }
            });
        }

        handleNodeClick(data: Department, node: any, ev: any) {
            let dId = data.id;
            this.table = this.allTable.filter(e => e.department.id === dId);
            this.dialog.form.department = data;
        }

        toAdd() {
            this.dialog.form = new Position();
            this.dialog.show = true;
            this.dialog.title = "新增职位";
            this.resetForm('form');
            this.loadEmployee();
        }

        save(form: string) {
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    this.axios.post("position/save", this.dialog.form).then(result => {
                        let v = new Result(result);
                        if (v.code == 200) {
                            Message.success("保存成功!");
                            this.dialog.show = false;
                            this.loadTree();
                            this.loadTable();
                        }
                    });
                }
            });
        }

        toUpdate(index: number, row: any) {
            this.loadEmployee();
            this.resetForm("form");
            this.dialog.title = "职位编辑";
            this.dialog.show = true;
            this.dialog.form = row;
        }

        toDelete(index: number, row: any) {
            MessageBox.confirm('此操作将删除该职位, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.post("/position/del", row).then(result => {
                    if (result.data.code == 200) {
                        this.loadTree();
                        this.loadTable();
                    }
                });
            }).catch(() => {
                Message.info("已取消删除");
            });
        }

        allowDrop(draggingNode: any, dropNode: any, type: any) {
            return !dropNode.data.button;
        }

        allowDrag(draggingNode: any) {
            return true;
        }

        resetForm(formName: string) {
            if (this.$refs[formName] === undefined) {
                return;
            }
            (this.$refs[formName] as any).resetFields();
        }

        private selectManagerData = {
            show: false
        }

        selectManager(index: number, row: any) {
            this.selectManagerData.show = true;
        }

        managerSelect() {
            let selectManager: any = this.$refs.selectUser;
            let user = selectManager.getselectUsers();
            console.log(user)
            let names = ""
            user.forEach(u => {
                names = names +  u.name + ",";
                this.dialog.form.users.push(u);
                this.selectManagerData.show = false;
            })
            this.selectUsers = names;
        }

    }


</script>


<style scoped>
    #left {
        float: left;
        width: 30%;
    }

    #right {
        float: left;
        clear: right;
        width: 70%;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
