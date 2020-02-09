<template>
    <div id="dataSource">

        <div id="left">
            <span>数据连接 </span>
            <el-button @click="showDialog(0)" icon="el-icon-plus" size="mini"/>
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
                      <span><span class="el-icon-folder" v-if="data.type==-1"/>
                          <span class="el-icon-tickets" v-if="data.type!=-1"/> {{ data.name }}</span>
                    <span>
                      <el-button @click="() => add(node,data)" style="font-size: 20px;" type="text"
                                 v-if="data.type==-1">+</el-button>
                      <el-button @click="() => remove(node, data)" style="font-size: 20px;" type="text">-</el-button>
                    </span>
                  </span>
            </el-tree>
        </div>
        <div id="right">

            <!--文件夹 form-->
            <el-form :model="folderForm" :rules="rules" label-width="100px" ref="folderForm"
                     v-if="visibleMap.folderFormVisible">
                <el-form-item label="文件夹名称" prop="name">
                    <el-input v-model="folderForm.name"/>
                </el-form-item>
                <el-form-item>
                    <el-button @click="createFolder('folderForm')">创建</el-button>
                    <el-button @click="visibleMap.folderFormVisible = false">取 消</el-button>
                </el-form-item>
            </el-form>

            <!--MYSQL form-->
            <el-form :model="mysqlForm" :rules="rules" label-width="100px"
                     ref="mysqlForm" v-if="visibleMap.mysqlFormVisible">
                <el-form-item label="数据源名称" prop="name">
                    <el-input v-model="mysqlForm.name"/>
                </el-form-item>
                <el-form-item label="服务器" prop="serverAddress">
                    <el-input v-model="mysqlForm.serverAddress"/>
                </el-form-item>
                <el-form-item label="数据库名称" prop="databaseName">
                    <el-input v-model="mysqlForm.databaseName"/>
                </el-form-item>
                <el-form-item label="端口" prop="port">
                    <el-input v-model="mysqlForm.port"/>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="mysqlForm.username"/>
                </el-form-item>
                <el-form-item label="密 码" prop="password">
                    <el-input v-model="mysqlForm.password"/>
                </el-form-item>
                <el-form-item>
                    <el-button @click="createdSqlDataSource('mysqlForm')">连接</el-button>
                    <el-button @click="visibleMap.mysqlFormVisible=false">取消</el-button>
                </el-form-item>
            </el-form>

            <!--ORACLE form-->
            <el-form :model="oracleForm" :rules="rules" label-width="100px"
                     ref="oracleForm" v-if="visibleMap.oracleFormVisible">
                <el-form-item label="数据源名称" prop="name">
                    <el-input v-model="oracleForm.name"/>
                </el-form-item>
                <el-form-item label="服务器" prop="serverAddress">
                    <el-input v-model="oracleForm.serverAddress"/>
                </el-form-item>
                <el-form-item label="数据库名称" prop="databaseName">
                    <el-input v-model="oracleForm.databaseName"/>
                </el-form-item>
                <el-form-item label="端口" prop="port">
                    <el-input v-model="oracleForm.port"/>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="oracleForm.username"/>
                </el-form-item>
                <el-form-item label="密 码" prop="password">
                    <el-input v-model="oracleForm.password"/>
                </el-form-item>
                <el-form-item label="SID" prop="password">
                    <el-input v-model="oracleForm.sId"/>
                </el-form-item>
                <el-form-item>
                    <el-button @click="createdSqlDataSource('oracleForm')">连接</el-button>
                    <el-button @click="visibleMap.oracleFormVisible=false">取消</el-button>
                </el-form-item>
            </el-form>

            <!--Excel form-->
            <el-form :model="excelForm" :rules="rules" label-width="100px"
                     ref="excelForm" v-if="visibleMap.excelFormVisible">
                <el-form-item label="数据源名称" prop="name">
                    <el-input v-model="excelForm.name"/>
                </el-form-item>
                <el-form-item>
                    <el-upload
                            :before-upload="beforeUpload"
                            :file-list="fileList"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            action="http://aaa"
                            class="upload-demo"
                            drag
                            multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传excel文件，且不超过10M</div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button @click="createExcelSource('excelForm')">确 定</el-button>
                    <el-button @click="visibleMap.excelFormVisible=false">取 消</el-button>
                </el-form-item>
            </el-form>

        </div>

        <el-dialog :visible.sync="visibleMap.createDialogVisible" center title="添加" width="30%">
            <el-row>
                <el-col :span="6">
                    <el-button @click="createDataSource(-1)">文件夹</el-button>
                </el-col>
                <el-col :span="6">
                    <el-button @click="createDataSource(0)">MYSQL</el-button>
                </el-col>
                <el-col :span="6">
                    <el-button @click="createDataSource(1)">ORACLE</el-button>
                </el-col>
                <el-col :span="6">
                    <el-button @click="createDataSource(2)">EXCEL</el-button>
                </el-col>
            </el-row>
            <span class="dialog-footer" slot="footer">
                <el-button @click="visibleMap.createDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>

</template>


<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class DataSource extends Vue {

        //树数据
        private treeData = [];
        //数配置
        private treeProp = {
            label: function (data: any, node: any) {
                return data.name;
            },
            children: "children",
            disabled: "disabled",
            isLeaf: "isLeaf"
        };

        //显示flag
        private visibleMap = {
            folderFormVisible: false,
            mysqlFormVisible: false,
            oracleFormVisible: false,
            excelFormVisible: false,
            createDialogVisible: false,
        };

        //文件夹Form
        private folderForm = {
            id: "",
            name: "",
            type: "-1",
            parentId: "",
        };

        private mysqlForm = {
            id: "",
            name: "",
            serverAddress: "",
            databaseName: "",
            driverClass: "com.mysql.cj.jdbc.Driver",
            url: "",
            port: "",
            username: "",
            password: "",
            type: "0",
            parentId: ""
        };

        private oracleForm = {
            id: "",
            name: "",
            serverAddress: "",
            databaseName: "",
            driverClass: "com.mysql.cj.jdbc.Driver",
            url: "",
            port: "",
            username: "",
            password: "",
            sId: "",
            type: "0",
            parentId: ""
        };

        private excelForm = {
            id: "",
            name: "",
            url: "",
            type: "1",
            parentId: "",
        };

        private fileList = [];


        private rules = {
            name: [
                {required: true, message: "请输入名称", trigger: "blur"},
                {min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur"}
            ],
            serverAddress: [{required: true, message: "请输入服务地址", trigger: "blur"},],
            databaseName: [{required: true, message: "请输入数据库名称", trigger: "blur"},],
            port: [{required: true, message: "请输入端口号", trigger: "blur"},],
            username: [{required: true, message: "请输入用户名", trigger: "blur"}],
            password: [{required: true, message: "请输入密码", trigger: "blur"}]
        };

        /**
         * 当前节点
         */
        private currentData: any;

        created() {
            this.loadTree();
        }

        loadTree() {
            this.axios.post("queryDataSourceByUser", {}).then((result) => {
                if (result.data.code == 200) {
                    this.treeData = result.data.data;
                }
            });
        }

        add(node: any, data: any) {
            if (data.type != -1) {
                return;
            }
            this.currentData = data;
            this.showDialog(1);
        }

        remove(node: any, data: any) {
            if (data.children == undefined || data.children.length == 0) {
                this.axios.post("/delDataSource", data).then(result => {
                    if (result.data.code == 200) {
                        this.loadTree();
                    }
                });
            } else {
                (this as any).$message.error('请先删除子节点!');
            }
        }

        showDialog(type: number) {
            if (type == 0) {
                this.currentData = {};
            }
            this.visibleMap.createDialogVisible = true;
        }

        createDataSource(createType: number) {
            switch (createType) {
                case -1:
                    this.visibleMap.createDialogVisible = false;
                    this.visibleMap.folderFormVisible = true;
                    this.folderForm = {
                        id: "",
                        name: "",
                        type: "-1",
                        parentId: "",
                    };
                    break;
                case 0:
                    this.visibleMap.createDialogVisible = false;
                    this.visibleMap.mysqlFormVisible = true;
                    this.oracleForm = {
                        id: "",
                        name: "",
                        serverAddress: "",
                        databaseName: "",
                        driverClass: "oracle.jdbc.driver.OracleDriver",
                        url: "",
                        port: "",
                        username: "",
                        password: "",
                        sId: "",
                        type: "0",
                        parentId: ""
                    };
                    break;
                case 1:
                    this.visibleMap.createDialogVisible = false;
                    this.visibleMap.oracleFormVisible = true;
                    this.mysqlForm = {
                        id: "",
                        name: "",
                        serverAddress: "",
                        databaseName: "",
                        driverClass: "com.mysql.cj.jdbc.Driver",
                        url: "",
                        port: "",
                        username: "",
                        password: "",
                        type: "0",
                        parentId: ""
                    };
                    break;
                case 2:
                    this.visibleMap.createDialogVisible = false;
                    this.visibleMap.excelFormVisible = true;
                    break;
                default:
                    this.createDataSource(0);
            }
        }

        createFolder(form: string) {
            if (this.folderForm.id == "" && this.currentData != null) {
                this.folderForm.parentId = this.currentData.id;
            }
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    this.axios.post("/saveDataSource", this.folderForm).then(result => {
                        if (result.data.code == 200) {
                            this.visibleMap.folderFormVisible = false;
                            this.loadTree();
                        }
                    });
                }
            });
        }

        createdSqlDataSource(form: string) {
            let f = this.mysqlForm;
            if (form == "mysqlForm") {
                f.url = "jdbc:mysql://" + this.mysqlForm.serverAddress + ":" + this.mysqlForm.port + "/" +
                    this.mysqlForm.databaseName + "?useUnicode=true&characterEncoding=utf-8&allowMultiQueries=true";

                if (this.mysqlForm.id == "" && this.currentData != null) {
                    this.mysqlForm.parentId = this.currentData.id;
                }

            } else {
                f.url = "jdbc:oracle:thin:@" + this.oracleForm.serverAddress + ":" + this.oracleForm.port + ":" +
                    this.oracleForm.databaseName;
                f = this.oracleForm;

                if (this.oracleForm.id == "" && this.currentData != null) {
                    this.oracleForm.parentId = this.currentData.id;
                }
            }
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    this.axios.post("/checkConnection", f).then(result => {
                        if (result.data.code == 200) {
                            this.visibleMap.oracleFormVisible = false;
                            this.visibleMap.mysqlFormVisible = false;
                            this.loadTree();
                        } else {
                            (this as any).$message.error('连接异常!');
                        }
                    });
                }
            });
        }

        beforeUpload(file: any) {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const isOver = file.size / 1024 / 1024 < 10;
            if (!isExcel) {
                (this as any).$message.error('上传只能是EXCEL文件!');
                return false;
            }

            if (!isOver) {
                (this as any).$message.error('上传只能是小于10M!');
                return false;
            }
            return true;
        }


        handleNodeClick(data: any, node: any, ev: any) {
            this.visibleMap.excelFormVisible = false;
            this.visibleMap.folderFormVisible = false;
            this.visibleMap.oracleFormVisible = false;
            this.visibleMap.mysqlFormVisible = false;

            switch (data.type) {
                case -1:
                    this.visibleMap.folderFormVisible = true;
                    this.folderForm = data;
                    break;
                case 0:
                    if (data.url.startsWith("jdbc:mysql")) {
                        this.visibleMap.mysqlFormVisible = true;
                        this.mysqlForm = data;
                    } else {
                        this.visibleMap.oracleFormVisible = true;
                        this.oracleForm = data;
                    }
                    break;
                case 1:
                    this.visibleMap.excelFormVisible = true;
                    this.excelForm = data;
                    break;
                default:
            }


        }

        handleDrop(draggingNode: any, dropNode: any, dropType: any, ev: any) {

            if (dropType == "inner") {
                draggingNode.data.parentId = dropNode.data.id;
            } else {
                draggingNode.data.parentId = dropNode.data.parentId;
            }

            this.axios.post("/saveDataSource", draggingNode.data).then(result => {
                if (result.data.code == 200) {
                    this.loadTree();
                }
            });

        }

        allowDrop(draggingNode: any, dropNode: any, type: any) {
            return dropNode.data.type == -1;
        }

        allowDrag(draggingNode: any) {
            console.log(draggingNode);
            return true;
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

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>