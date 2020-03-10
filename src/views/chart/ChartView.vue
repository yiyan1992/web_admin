<template>
    <div>
        <div id="left">
            <span>图表<el-button @click="showDialog(0)" icon="el-icon-plus" size="mini" circle/></span>
            <el-tree
                    :allow-drag="allowDrag"
                    :allow-drop="allowDrop"
                    :data="treeData"
                    @node-click="handleNodeClick"
                    @node-drop="handleDrop"
                    default-expand-all
                    draggable
                    highlight-current
                    node-key="id">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span><span class="el-icon-folder" v-if="data.dir"/>
                          <span class="el-icon-tickets" v-if="!data.dir"/> {{ data.name }}</span>
                      <el-divider direction="vertical"/>
                    <span>
                      <el-button class="el-icon-plus" @click.stop="addNode(node,data)" type="text" v-if="data.dir"/>
                        <el-button class="el-icon-setting" @click.stop="settingNode(node, data)" type="text"/>
                      <el-button class="el-icon-minus" @click.stop="removeNode(node, data)" type="text"/>
                    </span>
                  </span>
            </el-tree>
        </div>
        <div id="right">

            <el-tabs type="card" v-model="defaultTab" stretch>
                <el-tab-pane label="图" name="first">
                    <el-button @click="showPic">加载图表</el-button>
                    <div id="charts"></div>
                </el-tab-pane>
                <el-tab-pane label="表" name="second">
                    <el-table stripe :data="data.slice((page.number)*(page.size),(page.number+1)*(page.size))">
                        <el-table-column width="150px" sortable :label="item" v-for="item in columns" v-bind:key="item">
                            <template slot-scope="scope">
                                {{scope.row[item] | timeOrString}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination @size-change="handleLogSizeChange"
                                   @current-change="handleLogCurrentChange"
                                   :current-page="page.number"
                                   :page-size="page.size" layout="total, sizes, prev, pager, next"
                                   :total="data.length">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>

        </div>
        <el-dialog :visible.sync="dialog.visible" center width="60%">
            <div slot="title" class="header-title">
                <span>{{dialog.title}}</span>
            </div>
            <el-form :model="dialog.form" label-width="110px" :rules="dialog.rules" ref="dialogForm"
                     style="width: 50%;margin-left: 25%;margin-right: 25%;">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dialog.form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="ranking">
                    <el-input v-model="dialog.form.ranking" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="文件夹" prop="dir">
                    <el-checkbox v-model="dialog.form.dir" @change="dirChange"/>
                </el-form-item>
                <div v-if="dialog.showDir">
                    <el-form-item label="数据源名称" prop="dataSourceName">
                        <el-input v-model="dialog.form.dataSource.name" readonly autocomplete="off"
                                  @focus="showSelectDataSource"></el-input>
                    </el-form-item>
                    <el-form-item label="表名称" prop="tableName">
                        <el-input v-model="dialog.form.tableName" readonly autocomplete="off"
                                  @focus="showSelectDataTable"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span class="dialog-footer" slot="footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button @click="saveDialog('dialogForm')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="selectDataSourceDialog.dataSourceVisible">
            <div slot="title" class="header-title">
                <span>选择数据源</span>
            </div>
            <select-data-source ref="selectDataSource"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="selectDataSourceDialog.dataSourceVisible = false">取 消</el-button>
                <el-button type="primary" @click="dataSourceSelected">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="selectDataSourceDialog.tableVisible">
            <div slot="title" class="header-title">
                <span>选择表</span>
            </div>
            <select-data-table :data-source-id="dialog.form.dataSource.id" ref="selectDataTable"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="selectDataSourceDialog.tableVisible = false">取 消</el-button>
                <el-button type="primary" @click="dataTableSelected">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {JpaPage, Result} from "@/entity/Base";
    import {Chart} from "@/entity/Chart";
    import {Message, MessageBox} from "element-ui";
    import SelectDataSource from "@/components/SelectDataSource.vue";
    import {DataSource, DataSourceTable, DataTable} from "@/entity/DataSource";
    import SelectDataTable from "@/components/SelectDataTable.vue";

    @Component({
        components: {SelectDataSource, SelectDataTable}
    })
    export default class ChartView extends Vue {

        private defaultTab: string = "first";

        private treeData: Chart[] = [];

        private data: Object[] = [];

        private columns: string[] = [];

        private page: JpaPage = new JpaPage();

        private dialog = {
            showDir: false,
            title: "添加文件夹",
            visible: false,
            form: new Chart(),
            rules: {
                name: [{required: true, message: "请输入名称", trigger: "blur"}]
            }
        }

        private selectDataSourceDialog = {
            dataSourceVisible: false,
            tableVisible: false
        }

        private chartData = {
            "columns": [],
            "rows": []
        };

        private x_column: string = "当前期数";

        private y_column: string = "应还金额";

        private options: any = {
            title: {
                text: "折线图"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
            },
            xAxis: {
                type: "category",
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            },
            yAxis: {
                type: "value"
            },
            series: [
                {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: "bar"
                }
            ]
        };

        private mounted() {
            this.loadTree();
        }

        loadTree() {
            this.axios.post("chart/findAllByUser").then(result => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.treeData = v.data;
                }
            });
        }

        showDialog(val: number) {
            this.dialog.form = new Chart();
            this.dialog.visible = true;
            this.dialog.showDir = false;
            switch (val) {
                case 0:
                    this.dialog.title = "添加";
                    break;
                default :
                    this.dialog.title = "修改";
            }
        }

        saveDialog(form: string) {
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    this.axios.post("chart/save", this.dialog.form).then(result => {
                        let v = new Result(result);
                        if (v.code == 200) {
                            this.dialog.visible = false;
                            this.loadTree()
                            Message.success('保存成功!');
                        } else {
                            Message.error('保存失败!');
                        }
                    });
                }
            });
        }

        dirChange() {
            if (this.dialog.form.id) {
                Message.warning("已保存的文件夹类型不可以修改!");
                this.dialog.form.dir = !this.dialog.form.dir;
                return;
            }
            this.dialog.form.dataSource = new DataSource();
            this.dialog.form.tableName = "";
            this.dialog.showDir = !this.dialog.form.dir;
        }

        showSelectDataSource() {
            this.selectDataSourceDialog.dataSourceVisible = true;
            // let selectDataSource: any = this.$refs.selectDataSource;
            // selectDataSource.clearTree()
        }

        dataSourceSelected() {
            let selectDataSource: any = this.$refs.selectDataSource;
            let s = selectDataSource.submit();
            if (!s) {
                s = new DataSource();
            }
            this.dialog.form.dataSource = s;
            this.selectDataSourceDialog.dataSourceVisible = false;
        }

        showSelectDataTable() {
            if (!this.dialog.form.dataSource || !this.dialog.form.dataSource.id) {
                Message.warning("请先选择数据源");
                return;
            }
            this.selectDataSourceDialog.tableVisible = true
        }

        dataTableSelected() {
            let selectDataTable: any = this.$refs.selectDataTable;
            let s: DataSourceTable = selectDataTable.submit();
            if (s) {
                this.dialog.form.tableName = s.name;
                this.dialog.form.targetTableName = s.newName;
            }

            this.selectDataSourceDialog.tableVisible = false;
        }

        handleNodeClick(data: Chart, node: any, ev: any) {
            if (data && data.targetTableName) {
                this.loadData(data.targetTableName);
            }
        }

        addNode(node: any, data: any) {
            let chart = new Chart();
            chart.parentId = data.id;
            this.dialog.form = chart;
            this.showDialog(0);
        }

        settingNode(node: any, data: any) {
            this.axios.post("chart/findById/" + data.id).then(result => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.showDialog(1);
                    this.dialog.form = v.data;
                    this.dialog.showDir = !this.dialog.form.dir;
                }
            });
        }

        removeNode(node: any, data: Chart) {

            if (data.children && data.children.length > 0) {
                Message.warning("请先删除子节点!");
                return;
            }

            MessageBox.confirm('此操作将删除该节点, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.post("chart/deleteById/" + data.id).then(result => {
                    let v = new Result(result);
                    if (v.code == 200) {
                        this.loadTree();
                    }
                });
            }).catch(() => {
                Message.info("已取消删除");
            });
        }

        loadData(targetTableName: string) {
            this.data = [];
            this.axios.post("chart/findTableInfo/" + targetTableName).then(result => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.data = v.data;
                    this.loadTable();
                }
            })
        }

        loadTable() {
            this.columns = [];
            if (this.data.length > 0) {
                let datum = this.data[0];

                for (let p in datum) {
                    this.columns.push(p);
                }
            }
        }


        showPic() {
            const ele: any = document.getElementById("charts");
            const chart: any = (this as any).$echarts.init(ele);
            //调接口获取数据
            this.treatXColumn();
            chart.setOption(this.options);
        }

        private x_column_arr: any[] = [];
        private y_column_arr: any[] = [];


        treatXColumn() {
            let map = this.data.map((e: any) => e[this.x_column]);
            let set = new Set<String>(map);
            let arr: any = [];
            set.forEach(e => {
                arr.push(e);
            })
            this.x_column_arr = arr;
            this.x_column_arr.sort();
            this.options['legend']['data'] = arr;
            this.options['xAxis']['data'] = arr;
            this.treatYColumn();
        }

        treatYColumn() {
            let arr: any = [];
            for (let i = 0; i < this.x_column_arr.length; i++) {
                let object = this.data.filter((e: any) => {
                    return e[this.x_column] = this.x_column_arr[i];
                });
                let sum = 0;
                object.forEach(e => {
                    sum = (e as any)[this.y_column] + sum;
                })
                arr.push(object);
            }
            this.y_column_arr = arr;
            this.options['series']['data'] = arr;
            console.log(this.options)
        }

        handleLogSizeChange(val: any) {
            this.page.size = val;
        }

        handleLogCurrentChange(val: any) {
            this.page.number = val - 1;
        }

        allowDrop(draggingNode: any, dropNode: any, type: any) {
            return dropNode.data.dir;
        }

        allowDrag(draggingNode: any) {
            return !draggingNode.data.dir;
        }

        handleDrop(draggingNode: any, dropNode: any, dropType: any, ev: any) {

            if (dropType == "inner") {
                draggingNode.data.parentId = dropNode.data.id;
            } else {
                draggingNode.data.parentId = dropNode.data.parentId;
            }
            this.axios.post("chart/save", draggingNode.data);
        }

    }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
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

    #charts {
        height: 600px;
        width: 1000px;
    }
</style>
