<template>
    <div>
        <el-tree
                :data="treeData"
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
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {SysMenu} from "@/entity/Sys";
    import {Result} from "@/entity/Base";
    import {Message} from "element-ui";

    @Component
    export default class SelectDataSource extends Vue {

        private treeData: SysMenu[] = [];

        mounted() {
            this.loadTree();
        }

        loadTree() {
            this.axios.post("dataSource/queryByUser").then((result) => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.treeData = v.data;
                } else {
                    Message.error("加载失败!");
                }
            });

        }

        clearTree(){
            let tree = (this as any).$refs.tree;
            tree.setCurrentKey(null);
        }

        submit() {
            let tree = (this as any).$refs.tree;
            return tree.getCurrentNode();
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #banner {

    }
</style>
