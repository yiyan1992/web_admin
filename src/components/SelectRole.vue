<template>
    <div>
        <el-table stripe :data="table" row-key="id" @selection-change="handleSelectionChange" ref="table">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="名称" sortable/>
            <el-table-column prop="description" label="描述" sortable/>
        </el-table>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {SysRole} from "@/entity/Sys";
    import {Result} from "@/entity/Base";
    import {Message} from "element-ui";

    @Component
    export default class SelectMenu extends Vue {

        @Prop() private userId!: bigint;

        private table: SysRole[] = [];

        private selected: SysRole[] = [];

        created() {
            this.loadRole();
        }

        loadRole() {
            this.axios.get("sys/role/findAll", {}).then((result) => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.table = v.data;
                    this.loadUserRole();
                } else {
                    Message.error("加载失败!");
                }
            });
        }

        loadUserRole() {
            if (this.userId > 0) {
                this.axios.get("sys/role/findByUserId/" + this.userId, {timeout: 500}).then((result) => {
                    let v = new Result(result);
                    if (v.code == 200) {
                        let t: any = this.$refs.table;
                        // t.toggleRowSelection(this.table[0]);
                        let data: SysRole[] = v.data;

                        data.flatMap(e => {

                            let sysRoles = this.table.filter(e2 => {
                                return e.id == e2.id;
                            });

                            sysRoles.forEach(e3 => {
                                t.toggleRowSelection(e3);
                            });

                        });
                    } else {
                        Message.error("加载失败!");
                    }
                });
            }
        }

        handleSelectionChange(val: SysRole[]) {
            this.selected = val;
        }

        submit() {
            let arr: bigint[] = [];

            this.selected.flatMap(e => {
                arr.push(e.id);
            });

            this.axios.post("sys/role/saveUserRole", {userId: this.userId, roleIds: arr}).then(result => {
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
