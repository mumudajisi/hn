<template>
    <el-upload
        ref="upload"
        class="avatar-uploader"
        :accept="accept"
        :action="action"
        :headers="baseHeaders"
        :show-file-list="false"
        :on-success="onSuccess"
        :on-error="onError"
    >
        <img v-if="value" :src="value" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
</template>

<script>
export default {
    name: "Upload",
    props: {
        action: {
            type: String,
            default: undefined,
        },
        value: {
            type: String,
            default: undefined,
        },
        headers: {
            type: Object,
            default: () => ({}),
        },
        accept: {
            type: String,
            default: ".jpeg,.png,.jpg,.bmp,.gif",
        },
    },
    data() {
        return {};
    },
    computed: {
        baseHeaders() {
            return {
                Authorization: "Bearer " + this.token,
                ...this.headers,
            };
        },
    },
    methods: {
        onSuccess(response, file, fileList) {
            console.log(response, file, fileList);
        },
        onError(err, file, fileList) {
            console.log(err, file, fileList);
        },
    },
};
</script>

<style lang="scss" scoped>
.avatar-uploader::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
}
.avatar {
    width: 100px;
    height: 100px;
    display: block;
}
</style>
