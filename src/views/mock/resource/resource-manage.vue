<template>
    <el-dialog v-bind="$attrs" :title="`${titleText}`" width="500px" :close-on-click-modal="false" append-to-body v-on="$listeners" @open="open">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item v-if="type === 'edit'" label="资源ID">
                <el-input v-model="form.resourceId" placeholder="请输入资源ID" disabled maxlength="300" />
            </el-form-item>
            <el-form-item label="资源名称" prop="resourceName">
                <el-input v-model="form.resourceName" placeholder="请输入资源名称" maxlength="300" />
            </el-form-item>
            <el-form-item label="资源类型" prop="resourceType">
                <BaseSelect v-model="form.resourceType" type="simu_resource" placeholder="请输入资源类型" />
            </el-form-item>
            <el-form-item label="模型类型" prop="modelType">
                <BaseSelect v-model="form.modelType" placeholder="请选择模型类型" type="model_type" />
            </el-form-item>
            <el-form-item label="资源图片" prop="resourceIcon">
                <ImageUpload
                    :value="form.resourceIcon"
                    :limit="1"
                    :file-size="1024"
                    :is-show-tip="false"
                    dirname="/images/1003/resource/manage"
                    :f-name="imgName"
                    @uploadImage="uploadImageBk"
                />
            </el-form-item>
            <el-form-item label="文件上传" prop="files">
                <FileUpload
                    :value="form.files"
                    :limit="1"
                    :file-size="1024 * 5"
                    :is-show-tip="false"
                    dirname="/images/1003/resource/manage"
                    :f-name="form.fileName"
                    :file-type="['zip']"
                    :is-verify-file-type="true"
                    :is-check-file-type="true"
                    @uploadFiles="uploadFilesBk"
                />
            </el-form-item>
            <el-form-item v-show="downUzip" label="是否解压">
                <el-switch v-model="form.delivery" :disabled="true" />
            </el-form-item>
            <el-form-item label="解压路径" prop="runzipPath">
                <el-input v-model="form.runzipPath" placeholder="请输入解压路径" maxlength="300" :disabled="true" />
            </el-form-item>
            <el-form-item label="资源简介">
                <el-input v-model="form.introduce" type="textarea" placeholder="请输入资源简介" maxlength="300" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="loading" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import ImageUpload from "@/components/ImageUpload";
import FileUpload from "@/components/FileUpload";
import resource from "@/api/resource";
import { v4 as uuidv4 } from "uuid";

export default {
    name: "ParamManage",
    components: { ImageUpload, FileUpload },
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
            loading: false,
            downUzip: false,
            form: {
                busiCode: 1003, // 业务类型
                resourceName: "", // 资源名称
                resourceIcon: [], // 资源图片
                resourceType: "", // 资源类型
                fileType: "", // 文件类型
                files: [], // 文件上传
                fileName: "", // 文件名称
                modelType: "",
                remotePath: "/images/1003/resource/manage", // 远程路径
                runzipPath: "", // 解压路径
                introduce: "", // 资源简介
                resourceId: "", // 资源id
                isUnzip: 0, // 是否已解压
                delivery: false
            },
            imgName: "", // 编辑的时候传图片名称
            rules: {
                resourceName: [{ required: true, message: "请输入资源名称", trigger: "blur" }],
                resourceType: [{ required: true, message: "请选择资源类型", trigger: "blur" }],
                resourceIcon: [{ required: true, message: "请上传资源图片", trigger: "change" }],
                files: [{ required: true, message: "请上传文件", trigger: "change" }],
                modelType: [{ required: true, message: "请选择模型类型", trigger: "change" }],
            }, // 规则配置
        };
    },
    computed: {
        titleText() {
            return {
                add: "新增资源",
                edit: "修改资源",
            }[this.type];
        },
    },
    created() {
    },
    methods: {
        // 图片上传返回的参数
        uploadImageBk(data) {
            if (data.length) {
                this.imgName = data[0].name
            }
            this.form.resourceIcon = data
        },
        formRules() {
            this.$nextTick(() => {
                this.$refs["form"].clearValidate();
            })
        },
        // 文件上传返回的参数
        uploadFilesBk(data) {
            if (data.length) {
                this.form.files = data
                this.form.runzipPath = data[0].dirname;
                this.$set(this.form, "fileType", data[0].name.split(".")[1])
                this.form.isUnzip = 0
                this.form.fileName = data[0].name
            } else {
                this.form.fileType = ""
            }
        },
        submitForm() {
            this.$refs["form"].validate(async (valid) => {
                if (valid) {
                    try {
                        this.loading = true;
                        const params = {
                            busiCode: 1003, // 业务类型
                            tranCode: "331001",
                            resourceName: this.form.resourceName, // 资源名称
                            resourceIcon: this.form.resourceIcon.length ? this.form.resourceIcon[0].dirname + "/" + this.form.resourceIcon[0].name : "", // 资源图片
                            resourceType: this.form.resourceType, // 资源类型
                            resourceSize: this.form.files.length ? this.form.files[0].fileSize : "",
                            fileType: this.form.fileType, // 文件类型
                            fileName: this.form.files.length ? this.form.files[0].name : "", // 文件名称
                            remotePath: this.form.files.length ? this.form.files[0].dirname : "", // 远程路径
                            runzipPath: this.form.runzipPath, // 解压路径
                            introduce: this.form.introduce, // 资源简介
                            resourceId: this.form.resourceId ? this.form.resourceId : uuidv4().replace(/-/g, ""),
                            isUnzip: this.form.isUnzip,
                            modelType: this.form.modelType
                        }
                        let url = resource.resourceAdd
                        if (this.type === "edit") {
                            url = resource.resourceEdit
                            params.tranCode = "331002"
                            params.id = this.form.id
                        }
                        url(params).then(res => {
                            if (res.respType === 1) {
                                this.cancel();
                                this.$emit("success", params);
                            }
                            this.$modal.msgSuccess(`${this.titleText}成功`);
                        })
                    } catch (error) {
                        console.log(error);
                    } finally {
                        this.loading = false;
                    }
                }
            });
        },
        cancel() {
            this.rest()
            this.formRules()
            this.$emit("update:visible", false);
        },
        open() {
            let obj = this.row;
            if (!obj) {
                obj = {
                    resourceType: "1"
                }
            }
            this.rest()
            this.form = Object.assign(this.form, obj);
            if (this.type === "edit") {
                console.log(this.row)
                this.downUzip = true
                this.form.delivery = true
                const iconDirname = this.row.resourceIcon.substring(this.row.resourceIcon.lastIndexOf("/"), 0)
                const iconName = this.row.resourceIcon.substring(this.row.resourceIcon.lastIndexOf("/"))
                this.form.resourceIcon = [{
                    dirname: iconDirname,
                    name: iconName.split("/")[1],
                    url: process.env.VUE_APP_RESOURCE_SERVER + this.row.resourceIcon + "?" + Math.random(),
                    status: "success"
                }]
                this.imgName = iconName.split("/")[1]
                this.form.files = [{
                    fileSize: this.row.resourceSize,
                    dirname: this.row.remotePath,
                    name: this.row.fileName,
                    url: process.env.VUE_APP_RESOURCE_SERVER + this.row.remotePath + "/" + this.row.fileName + "?" + Math.random(),
                    status: "success"
                }]
            }
            if (this.type === "add") {
                this.downUzip = false
            }
        },
        rest() {
            this.imgName = ""
            this.form = {
                busiCode: 1003, // 业务类型
                resourceName: "", // 资源名称
                resourceIcon: [], // 资源图片
                resourceType: "", // 资源类型
                fileType: "", // 文件类型
                modelType: "",
                files: [], // 文件上传
                fileName: "", // 文件名称
                remotePath: "/files/1003/resource/manage", // 远程路径
                runzipPath: "", // 解压路径
                introduce: "", // 资源简介
                resourceId: "", // 资源id
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px solid #000;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader {
    width: 380px;
    height: 36px;
    background-color: #fff;
    border: 1px solid #ccc;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    background-color: #fff;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.flex {
    display: flex;
    justify-content: space-around;
}
</style>
