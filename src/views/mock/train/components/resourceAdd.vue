<template>
    <el-dialog
        visible
        :title="titleType"
        width="800px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        destroy-on-close
        append-to-body
        @close="hideDialog"
    >
        <el-form ref="form" :model="form.data" :rules="form.rules" label-width="80px" inline label-position="right">
            <template v-for="(item, index) in form.config">
                <el-form-item
                    v-if="item.showHide ? item.showHide(item) : true"
                    :key="index"
                    :label="item.name"
                    :prop="item.bind"
                    :class="['col-' + (item.col ? item.col : 12), 'relative']"
                    style="padding-left: 80px;"
                >
                    <el-input
                        v-if="item.type === 'text'"
                        v-model="form.data[item.bind]"
                        :placeholder="item.placeholder"
                    />
                    <el-select
                        v-else-if="item.type === 'select'"
                        v-model="form.data[item.bind]"
                        :placeholder="item.placeholder"
                        style="width: 100%;"
                        @focus="item.focusBc && item.focusBc(item, form.data[item.bind])"
                        @change="item.changeBc && item.changeBc(item, form.data[item.bind])"
                    >
                        <el-option
                            v-for="el in form.enums[item.dataList]"
                            :key="el.dictValue"
                            :label="el.dictLabel"
                            :value="el.dictValue"
                        />
                    </el-select>
                </el-form-item>
            </template>
        </el-form>
        <template slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm()">确 定</el-button>
            <el-button @click="hideDialog">取 消</el-button>
        </template>
    </el-dialog>
</template>

<script>
import api from "@/api/dict"
import resApi from "@/api/resource"
import hitchApi from "@/api/malfunction"
import trainApi from "@/api/train.js";

export default {
    name: "ResourceAdd",
    props: {
        // 关闭方法
        hideDialog: {
            type: Function,
            default() {
                return () => {};
            },
        },
        // 新增或者编辑
        resourceType: {
            type: String,
            default() {
                return ""
            }
        },
        // 编辑时的数据
        resourceObj: {
            type: Object,
            default() {
                return {}
            }
        },
        titleType: {
            type: String,
            default() {
                return "";
            }
        },
    },
    data() {
        return {
            form: {
                data: {
                    projectName: "",
                    modelType: null,
                    resourceType: "",
                    modelResource: "",
                    hitchCode: "",
                },
                config: [
                    {
                        col: 12,
                        type: "text",
                        name: "项目名称",
                        placeholder: "请输入项目名称",
                        bind: "projectName",
                    },
                    {
                        col: 12,
                        type: "select",
                        name: "模型类型",
                        placeholder: "请选择模型类型",
                        bind: "modelType",
                        dataList: "modelTypeList",
                        changeBc: this.changeBc
                    },
                    {
                        col: 12,
                        type: "select",
                        name: "资源类型",
                        placeholder: "请选择资源类型",
                        bind: "resourceType",
                        dataList: "resourceTypeList",
                        changeBc: this.changeBc
                    },
                    {
                        col: 12,
                        type: "select",
                        name: "模型资源",
                        placeholder: "请选择模型资源",
                        bind: "modelResource",
                        dataList: "modelResourceList",
                        focusBc: this.focusBc
                    },
                    {
                        col: 12,
                        type: "select",
                        name: "故障代码",
                        placeholder: "请选择故障代码",
                        bind: "hitchCode",
                        showHide: this.showHide, // 控制显示隐藏的
                        dataList: "faultCodeList",
                        focusBc: this.focusBc
                    },
                ],
                enums: {
                    modelTypeList: [], // 模型类型
                    resourceTypeList: [], // 资源类型
                    modelResourceList: [], // 模型资源
                    faultCodeList: [], // 故障代码
                },
                rules: {
                    projectName: [{ required: true, message: "请输入项目名称", triangle: "change" }],
                    modelType: [{ required: true, message: "请选择模型类型", triangle: "change" }],
                    resourceType: [{ required: true, message: "请选择资源类型", triangle: "change" }],
                    modelResource: [{ type: "number", required: true, message: "请选择模型资源", triangle: "change" }],
                    hitchCode: [{ required: true, message: "请选择故障代码", triangle: "change" }],
                }
            }
        };
    },
    created() {
        this.getDictList()
    },
    mounted() {
        if (this.resourceType === "edit") {
            this.resourceObj.modelResource = this.resourceObj.learnRid
            this.form.data = Object.assign(this.form.data, this.resourceObj)
            this.changeBc({ bind: "modelType" })
        }
    },
    methods: {
        submitForm() {
            this.$refs["form"].validate(async (valid) => {
                if (valid) {
                    const params = {
                        trainId: this.$route.query.id,
                        busiCode: 1003,
                        tranCode: this.resourceType === "edit" ? 333002 : 333001,
                        ...this.form.data
                    }
                    params.hitchRId = params.learnRid = params.practiceRid = params.examRid = this.form.data.modelResource
                    const urlApi = this.resourceType === "edit" ? trainApi.ChooseEdit : trainApi.ChooseAdd
                    urlApi(params).then(res => {
                        if (res.respType === 1) {
                            this.$message.success(this.resourceType === "edit" ? "编辑成功" : "新增成功")
                            this.hideDialog()
                            this.$emit("success");
                        }
                    })
                }
            })
        },
        // 获取字典数据
        getDictList() {
            const params = {
                typeList: ["simu_resource", "model_type"]
            }
            api.getDictDataTypes(params).then(res => {
                if (res.respType === 1) {
                    this.form.enums.modelTypeList = res.respData.model_type
                    this.form.enums.resourceTypeList = res.respData.simu_resource
                }
            })
        },
        // 控制显示隐藏
        showHide(item) {
            if (item.bind === "hitchCode") {
                return +this.form.data.resourceType === 3;
            }
        },
        // 表单点击事件
        async changeBc(item, bind) {
            if (item.bind === "modelType" || item.bind === "resourceType") {
                if (this.form.data.resourceType === "3" || (this.form.data.modelType && this.form.data.resourceType)) {
                    this.form.enums.modelResourceList = await this.getResourceList(this.form.data.resourceType === "3" ? "" : this.form.data.modelType, this.form.data.resourceType)
                } else {
                    this.form.enums.modelResourceList = []
                    this.form.enums.modelResource = ""
                }
                if (this.form.data.modelType && this.form.data.resourceType === "3") {
                    this.form.enums.faultCodeList = await this.getHitchCode(this.form.data.modelType)
                }
            }
        },
        // 表单聚焦事件
        focusBc(item, bind) {
            if (item.bind === "modelResource" && this.form.data.resourceType !== "3" && (!this.form.data.resourceType || !this.form.data.modelType)) {
                this.$message.warning("请先选择模型类型和资源类型")
            } else if (item.bind === "hitchCode" && !this.form.data.modelType) {
                this.$message.warning("请先选择模型类型")
            }
        },
        // 获取模型资源
        async getResourceList(modelType, resourceType) {
            const params = {
                busiCode: "1003",
                pageNum: 1,
                pageSize: 99999,
                resourceType: resourceType,
                modelType: modelType,
                tranCode: "331003",
            }
            const arr = []
            await resApi.resourceQuery(params).then(res => {
                if (res.respType === 1) {
                    res.respData.list?.forEach(item => {
                        arr.push({
                            dictLabel: item.resourceName,
                            dictValue: item.id
                        })
                    })
                }
            })
            return arr
        },
        // 获取故障代码
        async getHitchCode(modelType) {
            const params = {
                busiCode: "1003",
                tranCode: "335003",
                pageNum: 1,
                pageSize: 99999,
                modelType: modelType
            }
            const arr = []
            await hitchApi.hitch(params).then(res => {
                if (res.respType === 1) {
                    res.respData.list?.forEach(item => {
                        arr.push({
                            dictLabel: item.hitchName + "(" + item.hitchCode + ")",
                            dictValue: item.hitchCode
                        })
                    })
                }
            })
            return arr
        }
    },
};
</script>

<style lang="scss" scoped>
.relative{
    position:relative;
}
.col-24 {
    width: 100%;
}
.col-12 {
    width: 50%;
}
::v-deep .el-form-item__content {
    width: 100%;
    position: relative;
}
.el-form--inline ::v-deep .el-form-item {
    margin-right: 0;
    padding-right: 10px;
}
::v-deep .el-form-item__label {
    position: absolute;
    top: 0;
    left: 0;
}
</style>
