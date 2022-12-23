<template>
    <el-dialog
        visible
        :title="titleType === 'add' ? '新增故障' : '编辑故障'"
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
                        :multiple="item.multiple"
                        filterable
                        clearable
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
                    <ImageUpload
                        v-else-if="item.type === 'img'"
                        :value="form.data[item.bind]"
                        :limit="1"
                        :file-size="1024"
                        :is-show-tip="false"
                        dirname="/images/1003/malfunction/manage"
                        :f-name="imgName"
                        @uploadImage="uploadImageBk"
                    />
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
import ImageUpload from "@/components/ImageUpload";
import api from "@/api/resource";
import hitchApi from "@/api/malfunction"

export default {
    name: "AddOrEdit",
    components: { ImageUpload },
    props: {
        hideDialog: {
            type: Function,
            default() {
                return () => {
                };
            },
        },
        row: {
            type: Object,
            default() {
                return {};
            }
        },
        titleType: {
            type: String,
            default() {
                return "";
            }
        },
        modelTypeOptions: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            imgName: "", // 编辑的时候传图片名称
            form: {
                data: {
                    modelType: "",
                    hitchCode: "",
                    hitchName: "",
                    needTest: [],
                    hitchSymptom: []
                },
                config: [
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
                        type: "text",
                        name: "故障代码",
                        placeholder: "请输入故障代码,例如：BYQ-01",
                        bind: "hitchCode",
                    },
                    {
                        col: 12,
                        type: "text",
                        name: "故障名称",
                        placeholder: "请输入故障名称",
                        bind: "hitchName",
                    },
                    {
                        col: 12,
                        type: "select",
                        name: "所需实验",
                        placeholder: "请选择所需实验",
                        bind: "needTest",
                        multiple: true,
                        dataList: "needTestList",
                        focusBc: this.focusBc
                    },
                    {
                        col: 24,
                        type: "img",
                        name: "故障现象",
                        placeholder: "请添加故障现象",
                        bind: "hitchSymptom",
                    },
                ],
                enums: {
                    modelTypeList: this.modelTypeOptions,
                    needTestList: []
                },
                rules: {
                    modelType: [{ required: true, message: "请选择模型类型", triangle: "change" }],
                    hitchCode: [{ required: true, message: "请输入故障代码", triangle: "change" }, { max: 10, message: "故障代码字符长度不能超过10位" }],
                    hitchName: [{ required: true, message: "请输入故障名称", triangle: "change" }],
                    needTest: [{ type: "array", required: true, message: "请选择所需实验", triangle: "change" }],
                    hitchSymptom: [{ type: "array", required: true, message: "请添加故障现象", triangle: "change" }]
                }
            },
            BYQList: [], // 变压器的
            DLQList: [], // 断路器的
            hitchCode: "", // 临时的故障代码用来判断是否切换
        };
    },
    mounted() {
        if (this.titleType === "edit") {
            this.edit();
        }
    },
    methods: {
        submitForm() {
            this.$refs["form"].validate((valid) => {
                this.url = this.form.data.hitchSymptom;
                if (valid) {
                    this.loading = true;
                    const params = {
                        busiCode: 1003,
                        tranCode: this.titleType === "edit" ? "335002" : "335001",
                        needTest: this.form.data.needTest,
                        modelType: this.form.data.modelType,
                        hitchCode: this.form.data.hitchCode,
                        hitchName: this.form.data.hitchName,
                        hitchSymptom: this.form.data.hitchSymptom[0].dirname + "/" + this.form.data.hitchSymptom[0].name
                    }
                    const urlApi = this.titleType === "edit" ? hitchApi.hitchEdit : hitchApi.hitchAdd
                    if (this.titleType === "edit") {
                        params.id = this.row.id
                    }
                    urlApi(params).then(res => {
                        if (res.respType === 1) {
                            this.$message.success(this.titleType === "edit" ? "编辑成功" : "新增成功")
                            this.hideDialog()
                            this.$emit("success")
                        }
                    })
                }
            })
        },
        // 编辑
        edit() {
            this.form.data.modelType = this.row.modelType;
            this.form.data.hitchCode = this.row.hitchCode;
            this.form.data.hitchName = this.row.hitchName;
            this.form.data.needTest = JSON.parse(this.row.needTest);
            const imgDirname = this.row.hitchSymptom.substring(this.row.hitchSymptom.lastIndexOf("/"), 0)
            const imgName = this.row.hitchSymptom.substring(this.row.hitchSymptom.lastIndexOf("/"))
            this.form.data.hitchSymptom = [{
                dirname: imgDirname,
                name: imgName.split("/")[1],
                url: process.env.VUE_APP_RESOURCE_SERVER + this.row.hitchSymptom + "?" + Math.random(),
            }]
            this.imgName = imgName.split("/")[1]
            this.changeBc({ bind: "modelType" }, this.form.data.modelType)
        },
        // 图片上传返回的参数
        uploadImageBk(data) {
            if (data.length) {
                this.imgName = data[0].name
            }
            this.form.data.hitchSymptom = data
        },
        // 表单点击事件
        async changeBc(item, bind) {
            if (item.bind === "modelType" && this.form.data.modelType) {
                if (!this.form.data.hitchCode || this.form.data.hitchCode === this.hitchCode) {
                    this.hitchCode = bind
                    this.form.data.hitchCode = bind
                }
                let arr = []
                if (bind === "BYQ") {
                    arr = this.BYQList.length ? this.BYQList : await this.getDict(bind)
                    this.BYQList = arr
                } else if (bind === "DLQ") {
                    arr = this.DLQList.length ? this.DLQList : await this.getDict(bind)
                    this.DLQList = arr
                }
                this.form.enums.needTestList = arr
            } else {
                this.form.enums.needTestList = []
                this.form.data.needTest = []
            }
        },
        async getDict(type) {
            const params = {
                busiCode: "1003",
                pageNum: 1,
                pageSize: 99999,
                resourceType: 1,
                modelType: type,
                tranCode: "331003",
            }
            const arr = []
            await api.resourceQuery(params).then(res => {
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
        // 表单聚焦事件
        focusBc(item, bind) {
            if (item.bind === "needTest" && !this.form.data.modelType) {
                this.$message.warning("请先选择模型类型")
            }
        },
    }
}
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
