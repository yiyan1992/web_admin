<template>
    <div>

        <div id="left">
            <el-button @click="toAddParent">添加顶级菜单</el-button>
            <el-button @click="toAddNode">添加选择节点子菜单</el-button>
            <el-button @click="toRemoveNode">删除选择节点</el-button>
            <el-divider/>

            <el-tree
                    :allow-drag="allowDrag"
                    :allow-drop="allowDrop"
                    :data="treeData"
                    @node-click="handleNodeClick"
                    @node-drop="handleDrop"
                    default-expand-all
                    draggable
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
            <el-form :model="form" :rules="rules" label-width="100px" ref="form" v-if="formShow">
                <el-form-item label="所属公司" prop="companyName">
                    <el-input v-model="companyName" :disabled="true"/>
                </el-form-item>
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="form.name"/>
                </el-form-item>
                <el-form-item label="部门描述" prop="description">
                    <el-input v-model="form.description"/>
                </el-form-item>
                <el-form-item>
                    <el-button @click="save('form')">保存</el-button>
                    <el-button @click="formShow=false">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    import {SysMenu} from '../../entity/Sys';
    import {Result, JpaPage} from '../../entity/Base';
    import {Message, MessageBox} from "element-ui";
    import {Department} from "@/entity/Company";

    @Component
    export default class DepartmentView extends Vue {

        private treeData: Department[] = [];

        private formShow: boolean = false;

        private form: Department = new Department();

        private companyName = '';

        private showFatherDep = false;

        private rules = {
            name: [
                {required: true, message: "请输入部门名称", trigger: "blur"},
                {min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur"}
            ],
        }

        created() {
            this.loadTree();
        }

        loadTree() {
            this.axios.get("department/findForTree", {}).then((result) => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.treeData = v.data;
                } else {
                    Message.error("加载失败!");
                }
            });
        }

        save(form: string) {
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    this.axios.post("department/save", this.form).then(result => {
                        let v = new Result(result);
                        if (v.code == 200) {
                            Message.success("保存成功!");
                            this.formShow = false;
                            this.loadTree();
                        }
                    });
                }
            });
        }

        toAddParent() {
            this.formShow = true;
            this.form = new Department();
        }

        toAddNode() {
            let tree = (this as any).$refs.tree;
            let currentNode = tree.getCurrentNode();
            this.companyName = currentNode.company.name
            if (currentNode == null) {
                Message.warning("先选择一个节点!");
                return;
            } else {
                if (currentNode.button) {
                    Message.warning("按钮节点不能添加子节点!");
                    return;
                }

                this.formShow = true;
                this.form = new Department();
                this.form.parentId = currentNode.id;
            }
        }

        toRemoveNode() {

            let tree = (this as any).$refs.tree;
            let currentNode = tree.getCurrentNode();
            if (currentNode == null) {
                Message.warning("先选择一个节点!");
                return;
            }
            if (currentNode.children != null && currentNode.children.length != 0) {
                Message.warning("先删除子节点!");
                return;
            }

            MessageBox.confirm('此操作将删除该部门, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.post("department/deleteById/" + currentNode.id).then(result => {
                    let v = new Result(result);
                    if (v.code == 200) {
                        this.loadTree();
                        Message.success("删除成功!");
                        this.formShow = false;
                    }
                });
            }).catch(() => {
                Message.info("已取消删除");
            });
        }

        handleNodeClick(data: Department, node: any, ev: any) {
            this.formShow = true;
            this.form = data;
            this.companyName = data.company.name;
        }

        handleDrop(draggingNode: any, dropNode: any, dropType: any, ev: any) {

            if (dropType == "inner") {
                draggingNode.data.parentId = dropNode.data.id;
            } else {
                draggingNode.data.parentId = dropNode.data.parentId;
            }

            this.axios.post("/department/save", draggingNode.data).then(result => {
                if (result.data.code == 200) {
                    this.loadTree();
                }
            });

        }

        allowDrop(draggingNode: any, dropNode: any, type: any) {
            return !dropNode.data.button;
        }

        allowDrag(draggingNode: any) {
            return true;
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
