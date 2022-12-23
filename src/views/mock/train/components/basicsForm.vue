<template>
    <el-form ref="form" class="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="培训标题" prop="trainTitle">
            <el-input v-model="form.trainTitle" placeholder="请输入培训标题" />
        </el-form-item>
        <el-row />
        <el-form-item label="培训地点" prop="trainAddr">
            <el-input v-model="form.trainAddr" placeholder="请输入培训地点" />
        </el-form-item>

        <el-row>
            <el-col :span="16">
                <el-form-item label="培训时间" prop="date">
                    <el-date-picker
                        v-model="form.date"
                        style="width: 100%"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="defaultTime"
                    />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item v-if="false" label="允许报名" prop="isPartake">
                    <el-switch v-model="form.isPartake" active-color="#13ce66" inactive-color="#ff4949" />
                </el-form-item>
            </el-col>
        </el-row>

        <el-form-item label="培训封面" prop="trainIcon">
            <ImageUpload
                :value="form.trainIcon"
                :limit="1"
                :file-size="1024"
                :is-show-tip="false"
                dirname="/files/1003/train/manage"
                :f-name="form.imgName"
                @uploadImage="uploadImageBk"
            />
        </el-form-item>

        <el-form-item label="培训内容" prop="content">
            <el-input v-model="form.content" type="textarea" />
        </el-form-item>
    </el-form>
</template>

<script>
import user from "@/api/user";
import moment from "moment";
export default {
    name: "TrainAddOrEdit",
    props: {
        trainId: {
            type: [String, Number],
            default: null
        },
        formData: {
            type: Object,
            default: () => {
                return null
            }
        }
    },
    data() {
        return {
            defaultTime: [moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), moment(new Date()).format("YYYY-MM-DD HH:mm:ss")],
            form: {
                trainTitle: "", // 培训标题
                // trainType: "", // 培训类型
                // lecturer: "", // 培训讲师
                trainAddr: "", // 培训地点
                date: "", // 培训时间
                isPartake: true, // 是否允许报名
                trainIcon: [], // 培训封面
                content: "", // 培训内容
            },
            rules: {
                trainTitle: [{ required: true, message: "请输入培训标题", trigger: "blur" }],
                trainType: [{ required: true, message: "请选择培训类型", trigger: "blur" }],
                date: [{ required: true, message: "请选择培训时间", trigger: "blur" }],
                // lecturer: [{ required: true, message: "请选择培训讲师", trigger: "blur" }],
                trainAddr: [{ required: true, message: "请选择培训地点", trigger: "blur" }],
                trainIcon: [{ required: true, message: "请选择培训封面", trigger: "blur" }]
            }, // 规则配置
            lecturerOptions: [], // 培训讲师人员
        }
    },
    created() {
        this.form.date = new Date();
    },
    methods: {
        // 查询讲师
        getLecturer() {
            user.getUserList({ pageNum: 1, pageSize: 10000 }).then(res => {
                if (res.respType === 1) {
                    const arr = []
                    res.respData.list.forEach(item => {
                        arr.push({
                            label: item.userName,
                            value: item.id
                        })
                    })
                    this.lecturerOptions = arr
                }
            })
        },
        /**
         * 图片上传数据的返回
         * @param data <Array> 文件上传之后返回的数据
         */
        uploadImageBk(data) {
            this.form.trainIcon = data
        },
        // 新增或者编辑
        addOrEdit() {
            let arr = null
            this.$refs["form"].validate(async (valid) => {
                if (valid) {
                    arr = {
                        busiCode: 1003,
                        type: 1,
                        trainTitle: this.form.trainTitle, // 培训标题
                        trainType: this.form.trainType, // 培训类型
                        // lecturer: this.form.lecturer, // 培训讲师
                        trainAddr: this.form.trainAddr, // 培训地点
                        startTime: this.form.date.length ? this.form.date[0] : "",
                        closeTime: this.form.date.length ? this.form.date[1] : "",
                        isPartake: this.form.isPartake ? 1 : 0, // 是否允许报名
                        trainIcon: this.form.trainIcon.length ? this.form.trainIcon[0].dirname + "/" + this.form.trainIcon[0].name : "", // 培训封面
                        content: this.form.content, // 培训内容
                    }
                    if (this.trainId) {
                        arr.id = this.trainId
                    }
                }
            })
            return arr
        },
        open() {
            this.$nextTick(() => {
                this.$refs["form"].clearValidate();
            })
            this.reset();
            if (this.formData) {
                this.form = this.formData
            }
        },
        // 重置页面
        reset() {
            this.form = {
                trainTitle: "", // 培训标题
                trainType: "", // 培训类型
                // lecturer: "", // 培训讲师
                trainAddr: "", // 培训地点
                date: "", // 培训时间
                isPartake: true, // 是否允许报名
                trainIcon: [], // 培训封面
                content: "", // 培训内容
            }
        }
    }
}
</script>

<style scoped>
</style>
