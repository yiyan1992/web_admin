<template>
    <div id="dataSource">

        <div id="left">
            <span>数据连接 </span>
            <el-button @click="showDialog" circle icon="el-icon-plus" size="small" type="primary"/>
            <el-tree
                    :allow-drag="allowDrag"
                    :allow-drop="allowDrop"
                    :data="tree"
                    @node-click="handleNodeClick"
                    @node-drag-end="handleDragEnd"
                    @node-drag-enter="handleDragEnter"
                    @node-drag-leave="handleDragLeave"
                    @node-drag-over="handleDragOver"
                    @node-drag-start="handleDragStart"
                    @node-drop="handleDrop"
                    default-expand-all
                    draggable
                    node-key="id">
            </el-tree>
        </div>
        <div id="right">
            <el-form :model="treeData" :rules="rules" hide-required-asterisk label-width="70px" ref="treeData"
                     size="small">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="treeData.username"/>
                </el-form-item>
                <el-form-item label="密 码" prop="password">
                    <el-input v-model="treeData.password"/>
                </el-form-item>
                <el-form-item>
                    <el-button @click="submit('form')" type="primary">登陆</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>


<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Axios from "axios";

    @Component
    export default class DataSource extends Vue {

        private tree!: TreeData[];

        private treeData: TreeData = new TreeData(0, "");
        private rules = {
            username: [
                {required: true, message: "请输入用户名", trigger: "blur"},
                {min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur"}
            ],
            password: [{required: true, message: "请输入密码", trigger: "blur"}]
        };

        created() {
            let v = new TreeData(1, "a");
            this.tree = [
                v,
                new TreeData(2, "a"),
                new TreeData(3, "a"),
                new TreeData(4, "a"),
                new TreeData(5, "a"),
            ];
            this.loadTree();
        }

        loadTree() {
            Axios.post("queryDataSourceByUser", {}).then((result) => {
                // console.log(result);
            });
        }

        showDialog() {
            //显示弹窗
        }

        submit(form: string) {
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    console.log(this.treeData.label)
                }
            });
        }


        handleNodeClick(nodeData: any, node: any, ev: any) {
            console.log('node 1', nodeData);
            console.log('node 2', node);
        }

        handleDragStart(node: any, ev: any) {
            console.log('drag start', node);
        }

        handleDragEnter(draggingNode: any, dropNode: any, ev: any) {
            console.log('tree drag enter: ', dropNode.label);
        }

        handleDragLeave(draggingNode: any, dropNode: any, ev: any) {
            console.log('tree drag leave: ', dropNode.label);
        }

        handleDragOver(draggingNode: any, dropNode: any, ev: any) {
            console.log('tree drag over: ', dropNode.label);
        }

        handleDragEnd(draggingNode: any, dropNode: any, dropType: any, ev: any) {
            console.log('tree drag end: ', dropNode && dropNode.label, dropType);
        }

        handleDrop(draggingNode: any, dropNode: any, dropType: any, ev: any) {
            console.log('tree drop: ', dropNode.label, dropType);
        }

        allowDrop(draggingNode: any, dropNode: any, type: any) {
            if (dropNode.data.label === '二级 3-1') {
                return type !== 'inner';
            } else {
                return true;
            }
        }

        allowDrag(draggingNode: any) {
            return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
        }

    }

    class TreeData {
        public id!: number;
        public label!: string;
        public name: string = "";
        public url: string = "";
        public port: string | number = "3306";
        public username: string = "";
        public password: string = "";

        public children: TreeData[] = [];

        public constructor(id: number, label: string) {
            this.id = id;
            this.label = label;
        }

    }


</script>

<style scoped>
    #left {
        float: left;
        width: 20%;
    }

    #right {
        float: left;
        clear: right;
        width: 80%;
    }
</style>