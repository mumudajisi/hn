<template>
    <el-dialog
        v-bind="$attrs"
        :title="`${titleText}培训工作`"
        width="846px"
        :close-on-click-modal="false"
        append-to-body
        v-on="$listeners"
        @open="open"
    >
        <el-tabs v-model="activeTabs" type="border-card" :before-leave="handleTabsClick">
            <el-tab-pane label="基础信息" name="basics">
                <basicsForm ref="basicsForm" :form-data="basicsFormData" :train-id="trainID" />
            </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="loading" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import basicsForm from "@/views/mock/train/components/basicsForm";
import train from "@/api/train";

export default {
    name: "TrainManage",
    components: { basicsForm },
    props: {
        type: {
            type: String,
            default: "add",
        },
        row: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            activeTabs: "basics",
            loading: false,
            trainID: null, // 当前数据的id或编辑的id
            basicsFormData: null, // 基础信息的数据
        };
    },
    computed: {
        titleText() {
            return {
                add: "添加",
                edit: "修改",
            }[this.type];
        },
    },
    created() {},
    methods: {
        /** 点击确定 */
        submitForm() {
            if (this.activeTabs === "basics") {
                const params = this.$refs.basicsForm.addOrEdit()
                if (params) {
                    const url = this.trainID ? train.trainEdit : train.trainAdd
                    params.tranCode = this.trainID ? "332002" : "332001"
                    url(params).then(res => {
                        if (res.respType === 1) {
                            this.trainID = res.respData
                            this.activeTabs = "student"
                            this.$modal.msgSuccess(`基础信息${this.titleText}成功`);
                            this.cancel()
                        }
                    })
                }
            }
        },
        // 点击切换tab标签
        handleTabsClick() {
            if (!this.trainID && this.activeTabs === "basics") {
                this.$modal.msgError("请先填写基础信息");
                return false
            }
        },
        // 关闭弹框
        cancel() {
            this.activeTabs = "basics"
            this.$refs.basicsForm.reset() // 重置参数
            // this.$refs.studentForm.reset() // 重置参数
            // this.$refs.resourceForm.reset() // 重置参数
            this.$emit("success")
            this.$emit("update:visible", false);
            this.$nextTick(() => {
                this.trainID = null
            })
        },
        // 打开弹框判断是编辑还是新增
        open() {
            this.basicsFormData = null
            if (this.row && this.row.id) {
                this.trainID = this.row.id
                const iconDirname = this.row.trainIcon.substring(this.row.trainIcon.lastIndexOf("/"), 0)
                const iconName = this.row.trainIcon.substring(this.row.trainIcon.lastIndexOf("/"))
                this.basicsFormData = {
                    trainTitle: this.row.trainTitle, // 培训标题
                    trainType: this.row.trainType, // 培训类型
                    // lecturer: this.row.lecturer, // 培训讲师
                    trainAddr: this.row.trainAddr, // 培训地点
                    date: [this.row.startTime, this.row.closeTime], // 培训时间
                    isPartake: this.row.isPartake === 1, // 是否允许报名
                    trainIcon: [{
                        dirname: iconDirname,
                        name: iconName.split("/")[1],
                        url: process.env.VUE_APP_RESOURCE_SERVER + this.row.trainIcon + "?" + Math.random(),
                        status: "success"
                    }], // 培训封面
                    content: this.row.content, // 培训内容
                    imgName: iconName.split("/")[1]
                }
            }
            this.$nextTick(() => {
                this.$refs.basicsForm.open()
            })
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
