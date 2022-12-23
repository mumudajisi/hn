<template>
    <el-dialog :visible.sync="dialogVisible" append-to-body title="设置时间">
        <el-form ref="ruleForm" label-width="auto">
            <el-form-item label="开始时间" prop="examStartTime">
                <el-date-picker
                    v-model="examStartTime"
                    :default-value="defaultTime"
                    :picker-options="setDateRange"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="change"
                />
            </el-form-item>
            <el-form-item label="考试总时长" prop="examTimes">
                <el-input v-model="examTimes" :disabled="timer" style="width: 220px" />
            </el-form-item>
            <el-form-item label="结束时间" prop="examEndTime">
                <el-date-picker
                    v-model="examEndTime"
                    :disabled="overtime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                />
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sure()">确 定</el-button>
            <el-button @click="cancel()">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import trainApi from "@/api/train.js";
import settingConfirm from "@/api/train.js";
import moment from "moment";
export default {
    data() {
        return {
            tableData: null,
            dialogVisible: false, // 外弹框
            examTimes: "",
            examEndTime: "",
            examStartTime: "",
            defaultTime: null,
            timer: true, // 开始时间
            overtime: true, // 结束时间
            setDateRange: {
                disabledDate: (time) => {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            },
        };
    },
    created() {
        this.defaultTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.change(this.examStartTime);
    },
    methods: {
        async table(type) {
            const params = {
                busiCode: "1003",
                tranCode: "332009",
                type: 1,
                trainId: +this.$route.query.id,
                examTimes: this.examTimes,
                examEndTime: this.examEndTime,
                examStartTime: this.examStartTime,
            };
            await trainApi.trainlist(params).then((res) => {
                if (res.respType === 1) {
                    this.tableData = res.respData;
                    this.examTimes = this.tableData.examTimes;
                    this.examStartTime = this.tableData.examStartTime;
                    this.examEndTime = this.tableData.examEndTime;
                    if (type === 1 && this.examTimes === 0) {
                        this.$message.error("请先设置项目参数配置")
                    } else if (type === 1) {
                        this.dialogVisible = true
                        this.change(this.examStartTime)
                    }
                }
            });
        },
        change(date) {
            const times = Date.parse(date); // 转换毫秒
            const timelong = times + this.examTimes * 60000;
            const end = new Date(timelong);
            this.examEndTime = moment(end).format("YYYY-MM-DD HH:mm:ss");
        },
        // 确定
        async sure() {
            if (this.examStartTime !== "" && this.examStartTime >= this.defaultTime && this.examTimes > 0) {
                const params = {
                    tranCode: 332027,
                    busiCode: "1003",
                    id: +this.$route.query.id,
                    examTimes: this.examTimes,
                    examEndTime: this.examEndTime,
                    examStartTime: this.examStartTime,
                };
                await settingConfirm.settingConfirm(params).then((res) => {
                    if (res.respType === 1) {
                        this.$emit("changeTime", { start: this.examStartTime, end: this.examEndTime });
                        this.$message({
                            message: "设置成功",
                            type: "success",
                        });
                    }
                    this.dialogVisible = false; // 1.关闭弹框
                });
            } else {
                this.$message({
                    message: "考试时间设置错误或者考试时长未设置",
                    type: "error"
                });
            }
        },
        //    取消
        cancel() {
            this.dialogVisible = false; // 1.关闭弹框
        },
    },
};
</script>
<style lang="scss" scoped>
.el-dialog__wrapper {
    width: 1200px;
    height: 600px;
    margin: 0 auto !important;
}
</style>
