<template>
    <div>
        <el-tree
                :data="treeData"
                default-expand-all
                show-checkbox
                :default-checked-keys="defaultCheckedKeys"
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
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {SysMenu} from "@/entity/Sys";
    import {Result} from "@/entity/Base";
    import {Message} from "element-ui";

    @Component
    export default class SelectMenu extends Vue {

        @Prop() private roleId!: bigint;

        private treeData: SysMenu[] = [];

        private defaultCheckedKeys: bigint[] = [];

        created() {
            this.loadTree();
        }

        loadTree() {
            this.axios.get("sys/menu/findForTree", {}).then((result) => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.treeData = v.data;
                    this.loadSelect();
                } else {
                    Message.error("加载失败!");
                }
            });
        }

        loadSelect() {
            if (this.roleId > 0) {
                this.axios.get("sys/menu/findAllByRoleId/" + this.roleId, {timeout: 500}).then((result) => {
                    let v = new Result(result);
                    if (v.code == 200) {
                        let arr: SysMenu[] = v.data
                        this.defaultCheckedKeys = [];

                        arr.flatMap(e => {
                            this.defaultCheckedKeys.push(e.id);
                        })

                    } else {
                        Message.error("加载失败!");
                    }
                });
            }
        }

        submit() {

            let tree = (this as any).$refs.tree;
            let checkedKeys = tree.getCheckedKeys(false);
            if (checkedKeys == null || checkedKeys.length == 0) {
                Message.warning("请先选择节点!");
                return;
            }

            this.axios.post("sys/menu/saveRoleMenu", {roleId: this.roleId, menuIds: checkedKeys})
                .then(result => {
                    let v = new Result(result);
                    if (v.code == 200) {
                        Message.success("保存成功!")
                    }
                });

        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #banner {

    }
</style>
