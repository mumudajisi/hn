<!-- 表格 -->
<template>
    <div style="width: 100%">
        <div class="container">
            <div class="title">
                <p>培训项目</p>
            </div>
            <div class="lce">
                <el-button
                    v-if="getJurisdiction('choose:message')"
                    :disabled="Number(status)===31||Number(status)===30"
                    :style="{ backgroundColor:Number(status)===31||Number(status)===30 ? '#ccc' : '#4856dd'}"
                    icon="el-icon-upload el-icon--right"
                    type="primary"
                    @click="resourceAdd"
                >选择培训项目
                </el-button>
                <el-button
                    v-if="getJurisdiction('setting:params')"
                    :disabled="Number(status)===31||Number(status)===30"
                    :style="{ backgroundColor:Number(status)===31||Number(status)===30 ? '#ccc' : '#4856dd'}"
                    icon="el-icon-setting"
                    type="primary"
                    @click="setting()"
                >设置参数
                </el-button>
                <el-button
                    v-if="getJurisdiction('train:delete')"
                    :disabled="sels.length < 1"
                    :style="{ backgroundColor: sels.length < 1 ? '#ffa4a4' : '#ff4949' }"
                    class="btnItem"
                    icon="el-icon-delete"
                    type="primary"
                    @click="batchRemove()"
                >批量删除
                </el-button>
            </div>
        </div>
        <basic-table ref="mytable" :data="tableData" @selection-change="selsChange">
            <el-table-column align="center" show-overflow-tooltip type="selection" />
            <el-table-column align="left" label="项目名称" prop="projectName" show-overflow-tooltip width="500px" />
            <el-table-column align="right" show-overflow-tooltip width="200px">
                <template v-if="numShow(scope.row)" slot-scope="scope">
                    <p>{{ scope.row.hitchCode ? scope.row.hitchCode : "" }}</p>
                </template>
            </el-table-column>
            <el-table-column v-if="getJurisdiction('train:score')" align="left" label="分数" show-overflow-tooltip>
                <template slot-scope="scope">
                    <!--判断又没有考试这个字段-->
                    <el-button :style="{ color: scope.row.score || scope.row.score>=0? '#1890ff' : '#606266' }" size="small" type="text" @click="remark(scope.row)">
                        {{ scope.row.score || scope.row.score>=0 ? scope.row.score : "未考试" }}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column align="left" fixed="right" label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button
                        v-if="getJurisdiction('study:class')&&studyShow(scope.row)"
                        :disabled="studyDisabled" size="small" type="text"
                        @click="study(scope.row)"
                    >
                        {{ scope.row.resourceType==="2"?"学习":(scope.row.learnStatus === 1 ? "已学习" : "未学习") }}
                    </el-button>
                    <el-button
                        v-if="getJurisdiction('practice:class')&&practiceShow(scope.row)"
                        :disabled="studyDisabled"
                        size="small"
                        type="text"
                        @click="practice(scope.row)"
                    >{{ scope.row.practiceStatus === 1 ? "已练习" : "未练习" }}
                    </el-button>
                    <el-button
                        v-if="getJurisdiction('exam:class')&&examShow(scope.row)"
                        :disabled="examDisabled"
                        size="small"
                        type="text"
                        @click="exam(scope.row, scope.$index)"
                    >考试
                    </el-button>
                    <el-button
                        v-if="getJurisdiction('editor:class')" size="small" type="text" @chooseName="handleEdit"
                        @click="handleEdit(scope.$index, scope.row)"
                    >编辑
                    </el-button>
                    <el-button v-if="getJurisdiction('resource:delete')" type="text" @click="handleDelete(scope.row)">移除</el-button>
                    <el-button v-if="getJurisdiction('configuration:class')" type="text" @click="setTime(scope.row)">参数配置</el-button>
                </template>
            </el-table-column>
        </basic-table>
        <el-dialog :visible.sync="parameter" append-to-body title="考试时长">
            <el-form>
                <el-form-item label="考试时长(分钟)">
                    <el-input v-model="timer" placeholder="请输入考试时长(分钟)" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm()">确 定</el-button>
                <el-button @click="cancel()">取 消</el-button>
            </div>
        </el-dialog>
        <MockResource
            v-if="resourceVisible"
            ref="mockResource"
            :hide-dialog="() => (resourceVisible = false)"
            :resource-obj="resourceObj"
            :resource-type="resourceType"
            :title-type="titleName"
            @success="table"
        />
        <setting ref="setting" @changeTime="cExam" />
        <!-- 3. 分页 -->
        <pagination :limit.sync="paging.pageSize" :page.sync="paging.pageNo" :total="paging.total" @pagination="table" />
        <!--        分数弹窗-->
        <el-dialog :title="dialogTitle" :visible.sync="scoreList" append-to-body class="spec-dialog">
            <div class="sketch_content">
                <basic-table :data="gridData">
                    <el-table-column align="left" label="编号" prop="uuid" property="date" width="250">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" @click="PersonId(scope.row)">
                                {{ scope.row.uuid }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="分数" prop="score" width="80" />
                    <el-table-column align="left" label="开始时间" prop="startTime" width="150" />
                    <el-table-column align="left" label="截止时间" property="cutoffTime" width="150" />
                    <el-table-column align="left" label="提交时间" prop="submitTime" width="150" />
                </basic-table>
                <el-drawer
                    ref="drawer"
                    :visible.sync=" drawer"
                    append-to-body
                    custom-class="demo-drawer"
                    direction="rtl"
                    size="50%"
                >
                    <div class="demo-drawer__content">
                        <basic-table :data="examTable">
                            <el-table-column align="center" label="题目序号" prop="seqNo" width="100" />
                            <el-table-column align="center" label="得分" prop="score" width="80" />
                            <el-table-column align="center" label="题目分数" prop="questionScore" width="100" />
                            <el-table-column align="left" label="用户答案" prop="answer" />
                            <el-table-column align="left" label="正确答案" prop="rightKey" />
                        </basic-table>
                    </div>
                </el-drawer>
            </div>
            <span slot="footer" class="scoreDialog">
                <el-button @click="scoreFalse()">取 消</el-button>
                <el-button type="primary" @click="scoreTrue()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import trianApi from "@/api/train.js";
import BasicTable from "@/components/BaseTable/BasicTable.vue";
import MockResource from "./resourceAdd";
import setting from "./setting";

export default {
    components: { BasicTable, MockResource, setting },
    props: {
        status: {
            type: [String, Number],
            default: ""
        },
        signUp: {
            type: Boolean,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: () => {
                return false
            },
        },
        check: {
            type: Boolean,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: () => {
                return false
            },
        }
    },
    data() {
        return {
            titleName: "新增培训项目",
            resourceVisible: false,
            resourceType: "",
            isActive: true,
            resourceObj: {},
            gridData: [],
            dialogTitle: "",
            chooseButton: false,
            learnStatus: "", // 学习状态
            practiceStatus: "", // 练习状态
            scoreButton: false,
            examButton: false,
            scoreList: false,
            drawer: false,
            tableData: [], // 表格数据
            examTable: [], // 表格分数查询
            rowClassName: "",
            parameter: false,
            resId: "",
            timer: "",
            sels: [], // 列表选中列
            multipleSelection: [],
            date: {},
            paging: {
                total: 0,
                pageNo: 1,
                pageSize: 10,
            },
        };
    },
    // 权限
    computed: {
        getJurisdiction() {
            return function (val) {
                return this.$store.getters["menux/buttonList"].find((item) => item.perms === val);
            };
        },
        // 学习按钮
        studyShow(row) {
            return function (row) {
                return row.resourceType === "1" || row.resourceType === "2"
            }
        },
        // 练习按钮
        practiceShow(row) {
            return function (row) {
                return row.resourceType === "1" || row.resourceType === "3"
            }
        },
        // 编号
        numShow(row) {
            return function (row) {
                return row.resourceType === "3"
            }
        },
        // 考试按钮
        // 1.标准过程   2.结构原理   3.状态诊断
        examShow(row) {
            return function (row) {
                return row.resourceType === "1" || row.resourceType === "3"
            }
        },
        examDisabled() {
            let flag;
            // eslint-disable-next-line prefer-const
            flag = !(this.signUp && this.check);
            return !this.scoreButton || flag
        },
        studyDisabled() {
            let flag;
            // eslint-disable-next-line prefer-const
            flag = !(this.signUp && this.check);
            return this.scoreButton || Number(this.status) === 31 || Number(this.status) === 30 || flag
        }
    },
    async mounted() {
        await this.table(); // 调用表格数
    },
    methods: {
        setTime(row) {
            // 点击设置参数
            this.parameter = true;
            this.resId = row.id;
            this.timer = row.examTime;
        },
        // 添加培训项目
        resourceAdd() {
            this.resourceVisible = true
            this.resourceType = "add"
        },
        setting() {
            if (!this.tableData.length) {
                this.$message.error("请先添加培训项目")
                return false
            }
            this.$refs.setting.dialogVisible = true
            this.$refs.setting.table();
        },
        // 编辑操作
        async handleEdit(index, row) {
            this.titleName = "编辑培训项目"
            this.resourceVisible = true
            this.resourceType = "edit"
            this.resourceObj = row
        },
        selsChange(sels) {
            this.sels = sels;
        },
        batchRemove() {
            var ids = this.sels.map((item) => item.id);
            this.$confirm("确认删除选中记录吗?", "提示", {
                type: "warning",
            }).then(async () => {
                const params = {
                    busiCode: 1003,
                    trainId: this.$route.query.id,
                    tranCode: "333004",
                    ids: ids,
                };
                await trianApi.ChooseDelete(params).then((res) => {
                    if (res.respType === 1) {
                        this.$message({
                            type: "success",
                            message: "删除成功!",
                        });
                        this.table();
                    }
                });
            });
        },
        // 删除操作
        handleDelete(row) {
            this.$confirm("此操作将永久删除该培训项目, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(async () => {
                const params = {
                    busiCode: 1003,
                    ids: [row.id],
                    trainId: this.$route.query.id,
                    tranCode: "333004",
                };
                await trianApi.ChooseDelete(params).then((res) => {
                    if (res.respType === 1) {
                        this.$message({
                            type: "success",
                            message: "删除成功!",
                        });
                        this.table();
                    }
                });
            });
        },
        // 取消
        cancel() {
            this.parameter = false;
            this.timer = "";
            this.resId = "";
        },
        // 分数
        async remark(row) {
            console.log(row)
            this.drawDialog = false
            this.dialogTitle = row.projectName;
            if (row.score != null) {
                this.scoreList = true;
                const params = {
                    busiCode: 1003,
                    tranCode: "334003",
                    trainRid: row.examRid,
                    hitchCode: row.hitchCode,
                    userId: this.$store.getters["userx/user"].userId,
                    trainId: +this.$route.query.id,
                };
                await trianApi.examQuery(params).then((res) => {
                    if (res.respType === 1) {
                        this.gridData = res.respData;
                        res.respData.forEach((item) => {
                            item.projectName = row.projectName
                        });
                    }
                });
            }
        },
        // 点击uuid查找
        async PersonId(row) {
            this.drawer = true
            const params = {
                busiCode: "1003",
                tranCode: 334009,
                uuid: row.uuid,
            };
            await trianApi.exmaDetail(params).then((res) => {
                this.examTable = res.respData;
                this.examtable = true;
            });
        },
        // 点击分数确定按钮
        scoreTrue() {
            this.scoreList = false;
        },
        // 点击取消分数按钮
        scoreFalse() {
            this.scoreList = false;
        },
        // 调用表格接口
        async table() {
            const params = {
                busiCode: "1003",
                tranCode: "333003",
                trainId: this.$route.query.id,
                pageNum: this.paging.pageNo, // 页码
                pageSize: this.paging.pageSize, // 页容
            };
            await trianApi.ChooseQuery(params).then((res) => {
                if (res.respType === 1) {
                    this.tableData = res.respData?.list;
                    this.paging.total = res.respData.total;
                }
            });
        },
        // 参数配置
        async confirm() {
            if (+this.timer > 0) {
                const params = {
                    busiCode: "1003",
                    tranCode: "333027",
                    examDuration: this.timer,
                    id: this.resId,
                    trainId: this.$route.query.id,
                };
                await trianApi
                    .settingParam(params)
                    .then((res) => {
                        if (res.respType === 1) {
                            this.parameter = false;
                            this.$message({
                                message: "考试时长设置成功",
                                type: "success",
                            });
                        }
                        this.table();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                this.$message({
                    message: "考试时长需要大于0，请重新设置",
                    type: "warning",
                });
            }
        },
        // 演示
        async study(row) {
            const params = {
                busiCode: "1003",
                tranCode: "332307",
                ftpId: 1,
                hitchCode: row.resourceType === "3" ? row.hitchCode : "",
                trainRid: row.practiceRid,
                trainId: +this.$route.query.id,
                mode: row.resourceType === "3" ? 5 : 1,
            };
            await trianApi.hitchRun(params).then((res) => {
                if (res.respType === 1) {
                    window.open(process.env.VUE_APP_RESOURCE_SERVER + res.respData)
                }
            });
        },
        // 练习
        async practice(row) {
            const params = {
                busiCode: "1003",
                tranCode: "332307",
                ftpId: 1,
                hitchCode: row.resourceType === "3" ? row.hitchCode : "",
                trainRid: row.practiceRid,
                trainId: +this.$route.query.id,
                mode: row.resourceType === "3" ? 5 : 2,
            };
            await trianApi.hitchRun(params).then((res) => {
                if (res.respType === 1) {
                    window.open(process.env.VUE_APP_RESOURCE_SERVER + res.respData)
                }
            })
        },
        // 考试
        async exam(row) {
            const params = {
                busiCode: 1003,
                tranCode: "332302",
                ftpId: 1,
                trainId: +this.$route.query.id,
                trainRid: row.examRid,
                hitchCode: row.resourceType === "3" ? row.hitchCode : "",
                mode: row.resourceType === "3" ? 5 : 3,
            };
            await trianApi.Exam(params).then((res) => {
                if (res.respType === 1) {
                    window.open(process.env.VUE_APP_RESOURCE_SERVER + res.respData)
                }
            });
        },
        cancelForm() {
            this.loading = false;
            this.dialog = false;
            clearTimeout(this.timer);
        },
        // 计算考试时间是否在范围内
        async cExam(obj) {
            const date = new Date();
            const newTime = Date.parse(date);
            this.$nextTick(() => {
                const start = Date.parse(obj?.start);
                const end = Date.parse(obj?.end);
                if (newTime >= start && newTime <= end) {
                    this.$set(this, "scoreButton", true);
                    this.$set(this, "examButton", false);
                } else {
                    this.$set(this, "scoreButton", false);
                    this.$set(this, "examButton", true);
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
::v-deep.el-table .cell {
    text-align: center;
}

.el-form-item {
    display: flex;
}

::v-deep.el-input--medium .el-input__inner {
    font-size: 12px;
}

.el-button {
    border: none;
    font-size: 12px;
}

.container {
    display: flex;
    justify-content: space-between;
    height: 60px;
}

.title,
.lce {
    margin-left: 20px;
    margin-top: 11px;
}

.sketch_content {
    overflow: auto;
    height: 600px;
    border-top: 1px solid #eff1f4;
    border-bottom: 1px solid #eff1f4;
    padding: 0 30px 11px 27px;

    &::-webkit-scrollbar {
        width: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: #8798af;
        border-radius: 2px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }
}

.lce {
    margin-right: 10px;
}
</style>
