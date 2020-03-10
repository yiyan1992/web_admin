<template xmlns:el-col="http://www.w3.org/1999/html">
    <div id="dataSource">

        <div id="left">
            <span>数据连接</span>
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
                      <el-button @click.stop="() => addDataSource(node,data)" style="font-size: 20px;" type="text"
                                 v-if="data.type==-1">+</el-button>
                      <el-button @click.stop="() => remove(node, data)" style="font-size: 20px;"
                                 type="text">-</el-button>
                    </span>
                  </span>
            </el-tree>
        </div>
        <div id="right">
            <el-tabs type="card" v-model="defaultTab" stretch>
                <el-tab-pane label="基本信息" name="first">
                    <!--文件夹 form-->
                    <el-form :model="dataSourceForm" :rules="rules" label-width="100px" ref="folderForm"
                             v-if="visibleMap.folderFormVisible">
                        <el-form-item label="文件夹名称" prop="name">
                            <el-input v-model="dataSourceForm.name"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="createFolder('folderForm')">创建</el-button>
                            <el-button @click="visibleMap.folderFormVisible = false">取 消</el-button>
                        </el-form-item>
                    </el-form>

                    <!--MYSQL form-->
                    <el-form :model="dataSourceForm" :rules="rules" label-width="100px"
                             ref="mysqlForm" v-if="visibleMap.mysqlFormVisible">
                        <el-form-item label="数据源名称" prop="name">
                            <el-input v-model="dataSourceForm.name"/>
                        </el-form-item>
                        <el-form-item label="服务器" prop="serverAddress">
                            <el-input v-model="dataSourceForm.serverAddress"/>
                        </el-form-item>
                        <el-form-item label="端口" prop="port">
                            <el-input v-model="dataSourceForm.port"/>
                        </el-form-item>
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="dataSourceForm.username"/>
                        </el-form-item>
                        <el-form-item label="密 码" prop="password">
                            <el-input v-model="dataSourceForm.password"/>
                        </el-form-item>
                        <el-form-item label="数据库名称" prop="databaseName" v-if="visibleMap.showDataBaseName">
                            <el-select v-model="dataSourceForm.databaseName" placeholder="请选择数据库" style="width:100%">
                                <el-option
                                        v-for="item in dataBaseData"
                                        :key="item.dataBaseName"
                                        :label="item.dataBaseName"
                                        :value="item.dataBaseName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button :type="visibleMap.buttonType" @click="createdSqlDataSource('mysqlForm')">连接
                            </el-button>
                            <el-button @click="visibleMap.mysqlFormVisible=false">取消</el-button>
                        </el-form-item>
                    </el-form>

                    <!--ORACLE form-->
                    <el-form :model="dataSourceForm" :rules="rules" label-width="100px"
                             ref="oracleForm" v-if="visibleMap.oracleFormVisible">
                        <el-form-item label="数据源名称" prop="name">
                            <el-input v-model="dataSourceForm.name"/>
                        </el-form-item>
                        <el-form-item label="服务器" prop="serverAddress">
                            <el-input v-model="dataSourceForm.serverAddress"/>
                        </el-form-item>
                        <el-form-item label="端口" prop="port">
                            <el-input v-model="dataSourceForm.port"/>
                        </el-form-item>
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="dataSourceForm.username"/>
                        </el-form-item>
                        <el-form-item label="密 码" prop="password">
                            <el-input v-model="dataSourceForm.password"/>
                        </el-form-item>
                        <el-form-item label="SID" prop="password">
                            <el-input v-model="dataSourceForm.sId"/>
                        </el-form-item>
                        <el-form-item label="数据库名称" prop="databaseName" v-if="visibleMap.showDataBaseName">
                            <el-select v-model="dataSourceForm.databaseName" placeholder="请选择数据库" style="width:100%">
                                <el-option
                                        v-for="item in dataBaseData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="createdSqlDataSource('oracleForm')">连接</el-button>
                            <el-button @click="visibleMap.oracleFormVisible=false">取消</el-button>
                        </el-form-item>
                    </el-form>

                    <!--Excel form-->
                    <el-form :model="dataSourceForm" :rules="rules" label-width="100px"
                             ref="excelForm" v-if="visibleMap.excelFormVisible">
                        <el-form-item label="数据源名称" prop="name">
                            <el-input v-model="dataSourceForm.name"/>
                        </el-form-item>
                        <el-form-item>
                            <el-upload
                                    :before-upload="beforeUpload"
                                    :action="uploadAction()"
                                    :headers="uploadHeader()"
                                    class="upload-demo"
                                    drag
                                    :file-list="fileList"
                                    :on-success="uploadSuccess"
                                    :on-error="uploadError"
                                    :on-remove="uploadRemove"
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

                    <!--ftp form-->
                    <el-form :model="dataSourceForm" :rules="rules" label-width="200px"
                             ref="ftpForm" v-if="visibleMap.ftpFormVisible">
                        <el-form-item label="数据源名称" prop="name">
                            <el-input v-model="dataSourceForm.name"/>
                        </el-form-item>
                        <el-form-item label="服务器" prop="serverAddress">
                            <el-input v-model="dataSourceForm.serverAddress"/>
                        </el-form-item>
                        <el-form-item label="端口" prop="port">
                            <el-input v-model="dataSourceForm.port"/>
                        </el-form-item>
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="dataSourceForm.username"/>
                        </el-form-item>
                        <el-form-item label="密 码" prop="password">
                            <el-input v-model="dataSourceForm.password"/>
                        </el-form-item>
                        <el-form-item label="文件/文件夹名称" prop="databaseName" v-if="visibleMap.showFtpSelectFile">
                            <el-select v-model="dataSourceForm.databaseName" placeholder="请选择文件或文件夹" style="width:100%">
                                <el-option
                                        v-for="item in ftpFileName"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="createFtp('ftpForm')">连接</el-button>
                            <el-button @click="visibleMap.ftpFormVisible=false">取消</el-button>
                        </el-form-item>
                    </el-form>

                </el-tab-pane>
                <el-tab-pane label="表信息" name="second">
                    <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                              style="width: 100%">
                        <el-table-column prop="tableName" label="表名" width="240"/>
                        <el-table-column prop="status" label="状态" width="180"/>
                        <el-table-column prop="update" label="是否抽取">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.update">
                                    <el-option
                                            v-for="item in updateOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="operation" label="操作">
                            <template slot-scope="scope">
                                <el-popover ref="popover" placement="top" trigger="click" v-if="scope.row.update ==  0">
                                    <el-radio-group v-model="defaultUpdateType" type="vertical"
                                                    @change="showUpdateType">
                                        <el-radio :label="0">全量覆盖抽取</el-radio>
                                        <el-radio :label="1">全量追加抽取</el-radio>
                                    </el-radio-group>
                                </el-popover>
                                <el-button v-popover:popover type="text" v-if="scope.row.update ==  0">抽取方式
                                </el-button>
                                <el-button type="text" v-if="scope.row.update ==  0"
                                           @click="extractSetting(scope.row)">抽取设置
                                </el-button>
                                <el-button type="text" v-if="scope.row.update ==  0"
                                           @click="update(scope.row)" :loading="visibleMap.loading">立即执行
                                </el-button>
                                <el-button type="text" @click="del(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :current-page="currentPage"
                                   :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                                   :total="tableData.length">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="操作记录" name="third">
                    <el-table stripe
                              :data="operationLogTable.slice((operationLogPage.number)*(operationLogPage.size),(operationLogPage.number+1)*(operationLogPage.size))"
                              row-key="id">
                        <el-table-column prop="createTime" label="操作时间" sortable>
                            <template slot-scope="scope">
                                {{scope.row.createTime| timeUtils}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="user.name" label="操作者"/>
                        <el-table-column prop="user.email" label="账号"/>
                        <el-table-column prop="title" label="操作记录"/>
                    </el-table>
                    <el-pagination @size-change="handleLogSizeChange"
                                   @current-change="handleLogCurrentChange"
                                   :current-page="operationLogPage.number"
                                   :page-size="operationLogPage.size" layout="total, sizes, prev, pager, next, jumper"
                                   :total="operationLogTable.length">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!---->
        <el-dialog :visible.sync="visibleMap.createDialogVisible" center title="添加" width="40%">
            <el-row>
                <el-col :span="5">
                    <el-button @click="createDataSource(-1)">文件夹</el-button>
                </el-col>
                <el-col :span="5">
                    <el-button @click="createDataSource(0)">MYSQL</el-button>
                </el-col>
                <el-col :span="5">
                    <el-button @click="createDataSource(1)">ORACLE</el-button>
                </el-col>
                <el-col :span="5">
                    <el-button @click="createDataSource(2)">EXCEL</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button @click="createDataSource(3)">FTP</el-button>
                </el-col>
            </el-row>
            <span class="dialog-footer" slot="footer">
                <el-button @click="visibleMap.createDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="visibleMap.extractSettingVisible" center width="60%">
            <div slot="title" class="header-title">
                <span>抽取表信息设置</span>
            </div>
            <el-table :data="tableColumns" ref="tableColumns">
                <el-table-column prop="columnName" label="字段名"/>
                <el-table-column prop="columnTypeName" label="类型"/>
                <el-table-column label="本次保存">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.save"
                                active-text="保存"
                                inactive-text="不保存">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div>
                            <el-col :span="6">
                                <el-button @click="selectAlgorithm(scope.row)">算法</el-button>
                            </el-col>
                            <el-col :span="18">
                                <el-input v-model="scope.row.algorithm.name" disabled/>
                            </el-col>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="targetColumnName" label="目标字段">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.targetColumnName" placeholder="请选择">
                            <el-option :value="scope.row.columnName"/>
                            <el-option-group label="时间">
                                <el-option value="放款月份"/>
                                <el-option value="应还时间"/>
                                <el-option value="还款时间"/>
                                <el-option value="放款时间"/>
                                <el-option value="实际还款时间"/>
                            </el-option-group>

                            <el-option-group label="期数">
                                <el-option value="总期数"/>
                                <el-option value="当前期数"/>
                            </el-option-group>

                            <el-option-group label="笔数">
                                <el-option value="已还笔数"/>
                                <el-option value="应还笔数"/>
                                <el-option value="已还金额"/>
                                <el-option value="应还金额"/>
                            </el-option-group>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visibleMap.extractSettingVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveTableColumnMapping">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="visibleMap.algorithmDialog" center width="60%">
            <div slot="title" class="header-title">
                <span>选择算法</span>
            </div>
            <select-algorithm ref="selectAlgorithm"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visibleMap.algorithmDialog = false">取 消</el-button>
                <el-button type="primary" @click="saveAlgorithm">确 定</el-button>
            </div>
        </el-dialog>

    </div>

</template>


<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {DataSource, DataSourceLog, DataTable, DataTableColumnMapping} from "@/entity/DataSource";
    import {JpaPage, Result} from "@/entity/Base";
    import {Message, MessageBox} from "element-ui";
    import SelectAlgorithm from "@/components/SelectAlgorithm.vue";

    @Component({
        components: {SelectAlgorithm}
    })
    export default class DataSourceView extends Vue {

        private defaultTab = 'first';

        //树数据
        private treeData = [];

        private tableColumns: DataTableColumnMapping[] = [];

        created() {
            this.loadTree();
        }

        /**
         * 加载树形结构
         **/
        loadTree() {
            this.axios.post("dataSource/queryByUser", {}).then((result) => {
                if (result.data.code == 200) {
                    this.treeData = result.data.data;
                }
            });
        }

        private dataSourceForm: DataSource = new DataSource();

        private operationLogTable: DataSourceLog[] = [];

        private dataBaseData = [];

        private ftpFileName = [];

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
            loading: false,
            folderFormVisible: false,
            mysqlFormVisible: false,
            oracleFormVisible: false,
            excelFormVisible: false,
            ftpFormVisible: false,
            createDialogVisible: false,
            extractSettingVisible: false,
            showDataBaseName: false,
            buttonType: '',
            algorithmDialog: false,
            showFtpSelectFile: false,
        };


        private fileList: UploadFile[] = [];

        private rules = {
            name: [
                {required: true, message: "请输入名称", trigger: "blur"},
                {min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur"}
            ],
            serverAddress: [{required: true, message: "请输入服务地址", trigger: "blur"},],
            port: [{required: true, message: "请输入端口号", trigger: "blur"},],
            username: [{required: true, message: "请输入用户名", trigger: "blur"}],
            password: [{required: true, message: "请输入密码", trigger: "blur"}]
        };

        /**
         * 当前节点
         */
        private currentData: any;


        /**
         * 新增节点
         */
        addDataSource(node: any, data: any) {
            this.defaultTab = 'first';
            this.currentData = data;
            this.dataSourceForm = new DataSource();
            this.dataSourceForm.parentId = data.id;
            this.visibleMap.createDialogVisible = true;
            this.visibleMap.showDataBaseName = false;
            this.visibleMap.buttonType = 'primary';
        }

        /**
         * 删除节点
         */
        remove(node: any, data: any) {
            if (data.children == undefined || data.children.length == 0) {
                MessageBox.confirm('此操作将删除该数据源, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios.post("/dataSource/del", data).then(result => {
                        if (result.data.code == 200) {
                            this.loadTree();
                            this.hideForm();
                        }
                    });
                }).catch(() => {
                    Message.info("已取消删除");
                });
            } else {
                Message.error('请先删除子节点!');
            }
        }

        showDialog(type: number) {
            this.defaultTab = 'first';
            this.currentData = {};
            this.dataSourceForm = new DataSource();
            this.visibleMap.createDialogVisible = true;
            this.visibleMap.buttonType = "primary";
        }

        createDataSource(createType: any) {
            this.hideForm();
            this.dataSourceForm.type = createType
            switch (createType) {
                case -1:
                    this.visibleMap.createDialogVisible = false;
                    this.visibleMap.folderFormVisible = true;
                    break;
                case 0:
                    this.visibleMap.createDialogVisible = false;
                    this.visibleMap.mysqlFormVisible = true;
                    this.dataSourceForm.driverClass = "com.mysql.cj.jdbc.Driver";
                    break;
                case 1:
                    this.visibleMap.createDialogVisible = false;
                    this.visibleMap.oracleFormVisible = true;
                    this.dataSourceForm.driverClass = "com.mysql.cj.jdbc.Driver";
                    break;
                case 2:
                    this.visibleMap.createDialogVisible = false;
                    this.visibleMap.excelFormVisible = true;
                    break;
                case 3:
                    this.visibleMap.createDialogVisible = false;
                    this.visibleMap.ftpFormVisible = true;
                    this.fileList = [];
                    break;
                default:
            }
        }

        //创建文件夹保存
        createFolder(form: string) {
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    this.axios.post("dataSource/save", this.dataSourceForm).then(result => {
                        if (result.data.code == 200) {
                            this.visibleMap.folderFormVisible = false;
                            this.loadTree();
                        }
                    });
                }
            });
        }

        createdSqlDataSource(form: string) {
            let f = this.dataSourceForm;
            if (form == "mysqlForm") {
                if (f.databaseName != null) {
                    f.url = "jdbc:mysql://" + this.dataSourceForm.serverAddress + ":" + this.dataSourceForm.port + "/" +
                        this.dataSourceForm.databaseName + "?useUnicode=true&characterEncoding=utf-8&allowMultiQueries=true";
                } else {
                    f.url = "jdbc:mysql://" + this.dataSourceForm.serverAddress + ":" + this.dataSourceForm.port +
                        "?useUnicode=true&characterEncoding=utf-8&allowMultiQueries=true";
                }

            } else {
                f.url = "jdbc:oracle:thin:@" + this.dataSourceForm.serverAddress + ":" + this.dataSourceForm.port + ":" +
                    this.dataSourceForm.databaseName;
                f = this.dataSourceForm;
            }
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    this.checkDataSourceConnect(f);
                } else {
                    Message.error("请填写完整相关信息！")
                    ref.resetFields();
                }
            });
        }

        checkDataSourceConnect(f: DataSource) {
            this.axios.post("dataSource/checkConnection", f).then(result => {
                if (result.data.code == 200) {
                    this.dataBaseData = result.data.data.allDataBase;
                    if (f.databaseName != null) {
                        Message.success("数据库：" + f.databaseName + "连接成功！")
                    } else {
                        this.dataSourceForm.id = result.data.data.id
                        Message.success("数据源连接成功！")
                    }
                    this.visibleMap.showDataBaseName = true;
                    this.loadTree();
                }
            });
        }

        createExcelSource(form: string) {
            this.hideForm();
            if (this.dataSourceForm.id > 0 && this.currentData != null) {
                this.dataSourceForm.parentId = this.currentData.id;
            }
            const f = this.dataSourceForm;
            if (this.fileList.length == 0) {
                (this as any).$message.error("请先上传文件!");
                return;
            }
            let pathStr = "";
            let nameStr = "";
            let sizeStr = "";
            for (let i = 0; i < this.fileList.length; i++) {
                pathStr += (this.fileList[i] as any).url + ",";
                nameStr += (this.fileList[i] as any).name + ",";
                sizeStr += (this.fileList[i] as any).size + ",";
            }
            f.url = pathStr;
            f.databaseName = nameStr;
            f.username = sizeStr;
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    this.axios.post("dataSource/save", f).then(result => {
                        if (result.data.code == 200) {
                            this.visibleMap.oracleFormVisible = false;
                            this.visibleMap.excelFormVisible = false;
                            this.loadTree();
                        } else {
                            (this as any).$message.error('创建成功!');
                        }
                    });
                }
            });
        }


        createFtp(form: string) {
            if (this.dataSourceForm.id > 0 && this.currentData != null) {
                this.dataSourceForm.parentId = this.currentData.id;
            }
            const ref: any = this.$refs[form];
            ref.validate((valid: boolean) => {
                if (valid) {
                    this.checkDataSourceConnect(this.dataSourceForm);
                }
            });
        }

        uploadAction() {
            return process.env.VUE_APP_UPLOAD_URL;
        }

        uploadHeader() {
            return {
                Authorization: "Bearer " + sessionStorage.getItem("Authorization")
            };
        }

        beforeUpload(file: any) {
            let flag = true;

            this.fileList.forEach((e) => {
                if (e.name == file.name && e.size == file.size) {
                    flag = false;
                    (this as any).$message.warning("文件已存在!");
                }
            });

            if (!flag) {
                return false;
            }

            const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === "application/vnd.ms-excel");
            const isOver = file.size / 1024 / 1024 < 10;
            if (!isExcel) {
                Message.error('上传只能是EXCEL文件!');
                return false;
            }

            if (!isOver) {
                Message.error('上传只能是小于10M!');
                return false;
            }
            return true;
        }

        transformFileList(fileList: any) {
            this.fileList = [];
            for (let i = 0; i < fileList.length; i++) {
                this.fileList.push({
                    name: fileList[i].name,
                    url: fileList[i].response == null ? fileList[i].url : fileList[i].response.data,
                    size: fileList[i].size
                });
            }
        }

        uploadSuccess(response: any, file: any, fileList: any) {
            debugger
            this.transformFileList(fileList);
        }

        uploadError(err: any, file: any, fileList: any) {
            (this as any).$message.error("文件上传失败")
            this.transformFileList(fileList);
        }

        uploadRemove(file: any, fileList: any) {
            this.transformFileList(fileList);
            const fileName: string = file.name;
            let number = fileName.lastIndexOf(".");
            this.axios.post("file/delUploadFile/" + file.size + fileName.substring(0, number)
                + "/" + fileName.substring(number + 1));
        }

        hideForm() {
            this.visibleMap.excelFormVisible = false;
            this.visibleMap.folderFormVisible = false;
            this.visibleMap.oracleFormVisible = false;
            this.visibleMap.mysqlFormVisible = false;
            this.visibleMap.ftpFormVisible = false;
            this.visibleMap.showDataBaseName = false;
        }


        handleNodeClick(data: any, node: any, ev: any) {
            this.hideForm();
            this.visibleMap.buttonType = "";
            switch (data.type) {
                case -1:
                    this.visibleMap.folderFormVisible = true;
                    this.dataSourceForm = data;
                    break;
                case 0:
                    this.checkDataSourceConnect(data);
                    if (data.url.startsWith("jdbc:mysql")) {
                        this.visibleMap.mysqlFormVisible = true;
                        this.dataSourceForm = data;
                    } else {
                        this.visibleMap.oracleFormVisible = true;
                        this.dataSourceForm = data;
                    }
                    if (data.databaseName != null) {
                        this.getDataSourceTable(data.id);
                        this.tabClick(data.id)
                    }
                    break;
                case 2:
                    this.visibleMap.excelFormVisible = true;
                    this.dataSourceForm = data;
                    var str1 = this.dataSourceForm.url.split(",");
                    var str2 = this.dataSourceForm.databaseName.split(",");
                    var str3 = this.dataSourceForm.username.split(",");

                    this.fileList = [];
                    for (var i = 0; i < str1.length; i++) {
                        if (str1[i] == "") {
                            continue;
                        }
                        this.fileList.push({
                            name: str2[i],
                            url: str1[i],
                            size: str3[i]
                        });
                    }
                    this.getDataSourceTable(data.id);
                    break;
                case 3:
                    this.getDataSourceTable(data.id);
                    this.visibleMap.ftpFormVisible = true;
                    this.dataSourceForm = data;
                    if (data.databaseName !== null) {
                        this.visibleMap.showFtpSelectFile = true;
                    }
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

            this.axios.post("dataSource/save", draggingNode.data).then(result => {
                if (result.data.code == 200) {
                    this.loadTree();
                }
            });

        }

        allowDrop(draggingNode: any, dropNode: any, type: any) {
            return dropNode.data.type == -1;
        }

        allowDrag(draggingNode: any) {
            return true;
        }

        tabClick(id: any) {
            this.operationLogPage = new JpaPage();
            this.axios.post("dataSource/findAll7DaysLog/" + id).then(result => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.operationLogTable = v.data;
                }
            });
        }

        private tableData: DataTable[] = [];

        private currentPage = 1;

        private pageSize = 10;

        handleSizeChange(val: any) {
            this.pageSize = val;
        }

        handleCurrentChange(val: any) {
            this.currentPage = val;
        }

        /**
         * 是否更新
         */
        private updateOptions = [{
            value: '0',
            label: '是'
        }, {
            value: '1',
            label: '否'
        }];

        //
        private updateOptionsValue = "0";

        //默认抽取方式
        private defaultUpdateType = 0;

        //更新类型
        private updateType = 0;

        /**
         * 抽取方式选择弹窗
         */
        showUpdateType(value: any) {
            let t: any = this;
            if (value == 0) {
                Message.success("你选择 全量覆盖抽取方式");
            } else {
                Message.success("你选择 全量追加抽取方式");
            }
        }


        /**
         * 根据sourceId查询table
         */
        getDataSourceTable(id: any) {
            this.axios.post("tableInfo/findTable", this.dataSourceForm).then((result) => {
                if (result.data.code == 200) {
                    this.tableData = result.data.data;
                }
            });
        }

        /**
         * 删除
         * @param row
         */
        del(row: DataTable) {
            MessageBox.confirm('此操作将删除本地数据库中表, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.post("tableInfo/delete", {
                    'name': row.tableName,
                    'dataSourceId': this.dataSourceForm.id
                }).then((result) => {
                    if (result.data.code == 200) {
                        Message.success("删除成功");
                        this.getDataSourceTable(this.dataSourceForm.id);
                    } else {
                        Message.error(result.data.msg);
                    }
                });
            })
        }

        /**
         * 数据表映射设置
         */
        extractSetting(row: DataTable) {
            this.visibleMap.extractSettingVisible = true;
            this.axios.post("tableInfo/findTableColumnMapping", {
                dataSourceId: this.dataSourceForm.id,
                tableName: row.tableName
            }).then(result => {
                let v = new Result(result);
                if (v.code == 200) {
                    this.tableColumns = v.data;
                }
            });
        }

        private dataTable = new DataTable();

        /**
         * 立即执行
         * @param row
         */
        update(row: any) {
            this.visibleMap.loading = true;
            this.dataTable.id = this.dataSourceForm.id;
            this.dataTable.tableName = row.tableName;
            this.dataTable.updateType = this.updateType;
            this.axios.post("tableInfo/update", this.dataTable).then((result) => {
                if (result.data.code == 200) {
                    Message.success("数据抽取成功");
                    let type: any = this.dataSourceForm.type;
                    this.getDataSourceTable(row.id);
                } else {
                    Message.error(result.data.msg);
                }
                this.visibleMap.loading = false;
            });
        }

        private currentDataTableMapping!: DataTableColumnMapping;

        selectAlgorithm(row: DataTableColumnMapping) {
            this.visibleMap.algorithmDialog = true;
            this.currentDataTableMapping = row;
            let selectAlgorithm: any = this.$refs.selectAlgorithm;
            selectAlgorithm.clear();
        }

        saveAlgorithm() {
            let selectAlgorithm: any = this.$refs.selectAlgorithm;
            let result = selectAlgorithm.submit();
            this.currentDataTableMapping.algorithm = result;
            this.visibleMap.algorithmDialog = false;
        }

        saveTableColumnMapping() {
            let tableColumns = this.tableColumns;
            if (tableColumns.length == 0) {
                return;
            }
            this.axios.post("tableInfo/saveTableColumnMapping", tableColumns.filter(e => e.save)).then(result => {
                let v = new Result(result);
                if (v.code == 200) {
                    Message.success("保存成功!");
                    this.visibleMap.extractSettingVisible = false;
                }
            });
        }


        private operationLogPage = new JpaPage();

        handleLogSizeChange(val: any) {
            this.operationLogPage.size = val;
        }

        handleLogCurrentChange(val: any) {
            this.operationLogPage.number = val - 1;
        }
    }

    class UploadFile {
        public name!: string;
        public url!: string;
        public size!: string;

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
