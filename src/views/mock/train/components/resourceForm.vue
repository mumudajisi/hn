<template>
    <el-dialog :before-close="clearForm" :title="title" :visible.sync="dialogVisible" append-to-body>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm" label-width="auto">
            <el-form-item label="项目名称" label-width="auto" prop="projectName">
                <el-input v-model="ruleForm.projectName" placeholder="请输入项目名称" style="width: 100%" />
            </el-form-item>
            <el-form-item label="学习" prop="learnRid">
                <el-select v-model="ruleForm.learnRid" filterable placeholder="请选择学习内容" style="width: 100%" @change="selectLearn">
                    <el-option v-for="item in showTime" :key="item.id" :label="item.resourceName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="练习" prop="practiceRid">
                <el-select v-model="ruleForm.practiceRid" :disabled="true" placeholder="请选择练习内容" style="width: 100%">
                    <el-option v-for="item in showTime" :key="item.id" :label="item.resourceName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="考试" prop="examRid">
                <el-select v-model="ruleForm.examRid" :disabled="true" placeholder="请选择考试内容" style="width: 100%">
                    <el-option v-for="item in showTime" :key="item.id" :label="item.resourceName" :value="item.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <template slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm()">确 定</el-button>
            <el-button @click="clearForm">取 消</el-button>
        </template>
    </el-dialog>
</template>
<script>
import chooseSelect from "@/api/train.js";
import ChooseAdd from "@/api/train.js";
import ChooseEdit from "@/api/train.js";

export default {
    props: {
        title: {
            type: String,
            default: "添加培训项目",
        },
        date: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        return {
            dialogVisible: false, // 外弹框
            result: [],
            ruleForm: {
                learnRid: "",
                examRid: "",
                practiceRid: "",
                shows: "",
            },
            rules: {
                projectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
                learnRid: [{ required: true, message: "请选择学习内容", trigger: "blur" }],
                practiceRid: [{ required: true, message: "请选择练习内容", trigger: "blur" }],
                examRid: [{ required: true, message: "请选择考试内容", trigger: "blur" }],
            },
            showTime: [], // 演示菜单
            practiceTime: [], // 练习菜单
            examTime: [], // 考试菜单
        };
    },
    // 监听器--编辑
    watch: {
        date(val) {
            this.ruleForm = val;
            // const showmObj = this.showList.find((item) => +item.key === +val.learnRid);
            // if (!showmObj) {
            //     val.learnRid = null;
            // }
        },
    },
    methods: {
        selectLearn(el) {
            this.ruleForm.examRid = el
            this.ruleForm.practiceRid = el
        },
        //    清除表单提示
        formRules() {
            this.$nextTick(() => {
                this.$refs["ruleForm"].clearValidate();
            })
        },
        // 确定
        submitForm() {
            const params = {
                busiCode: 1003,
                tranCode: 333001,
                trainId: +this.$route.query.id,
                projectName: this.ruleForm.projectName,
                learnRid: this.ruleForm.learnRid,
                practiceRid: this.ruleForm.practiceRid,
                examRid: this.ruleForm.examRid,
            };
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if (this.title === "添加培训项目") {
                        ChooseAdd.ChooseAdd(params).then((res) => {
                            if (res.respType === 1) {
                                this.$emit("table");
                                this.$message({
                                    message: "添加成功",
                                    type: "success",
                                });
                                this.dialogVisible = false; // 1.关闭弹框
                                this.clearForm();
                            }
                        });
                    } else {
                        const params = {
                            busiCode: 1003,
                            tranCode: 333002,
                            id: this.date.id,
                            trainId: +this.$route.query.id,
                            projectName: this.ruleForm.projectName,
                            learnRid: this.ruleForm.learnRid,
                            practiceRid: this.ruleForm.practiceRid,
                            examRid: this.ruleForm.examRid,
                        };
                        ChooseEdit.ChooseEdit(params).then((res) => {
                            if (res.respType === 1) {
                                this.$emit("table");
                                this.$message({
                                    message: "修改成功",
                                    type: "success",
                                });
                                this.dialogVisible = false; // 1.关闭弹框
                                this.clearForm();
                            }
                        });
                    }
                }
            });
        },
        // 清空表单数据
        clearForm() {
            this.dialogVisible = false; // 1.关闭弹框
            this.formRules();
            this.ruleForm = {
                projectName: "",
                learnRid: "",
                practiceRid: "",
                examRid: "",
            };
        },
        // 下拉菜单接口
        async getList() {
            const params = {
                busiCode: "1003",
                tranCode: "331010",
                // resourceType: 1,
            };
            await chooseSelect
                .chooseSelect(params)
                .then((res) => {
                    if (res.respType === 1) {
                        this.showTime = res.respData.showTime;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
    float: right;
    margin-top: -28px;
}
</style>
