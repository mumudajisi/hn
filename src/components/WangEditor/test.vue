<template>
    <div ref="editor" class="editor" />
</template>

<script>
import E from "wangeditor"
import { v4 as uuidv4 } from "uuid";
export default {
    name: "Test",
    model: {
        prop: "value",
        event: "change"
    },
    props: {
        value: {
            type: String,
            default: ""
        },
        isClear: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            editor: null,
            info_: null,
            imgUrl: ""
        }
    },
    watch: {
        isClear(val) {
            // 触发清除文本域内容
            if (val) {
                this.editor.txt.clear()
                this.info_ = null
            }
        },
        value: function (value) {
            if (value !== this.editor.txt.html()) {
                this.editor.txt.html(this.value)
            }
        }
    },
    mounted() {
        this.setEditor()
        this.editor.txt.html(this.value)
    },
    methods: {
        setEditor() {
            this.editor = new E(this.$refs.editor)
            this.editor.config.uploadImgShowBase64 = false // base 64 存储图片
            this.editor.config.uploadImgServer = process.env.VUE_APP_BASE_API + "/file/upload"// 填写配置服务器端地址
            this.editor.config.uploadImgHeaders = {
                ContentType: "multipart/form-data",
                Authorization: "Bearer " + this.$store.getters["userx/token"]
            }// 自定义 header
            this.editor.config.pasteFilterStyle = false // 关闭样式过滤
            this.editor.config.uploadFileName = "file" // 后端接受上传文件的参数名
            this.editor.config.uploadImgMaxSize = 8 * 1024 * 1024 // 将图片大小限制为 2M
            this.editor.config.uploadImgMaxLength = 6 // 限制一次最多上传 6 张图片
            this.editor.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
            const uuid = uuidv4()
            this.editor.config.uploadImgParams = {
                busiCode: "1001",
                tranCode: "100001",
                roleCode: this.$store.getters["userx/role"].roleKey,
                loginId: this.$store.getters["userx/user"].userId,
                fid: 1,
                dirname: this.dirname || "/files/1003/train/manage",
                // filenames: uuid + "." + file.name.split(".")[1]
            }
            // 自定义 onchange 触发的延迟时间，默认为 200 ms
            this.editor.config.onchangeTimeout = 1000 // 单位 ms

            this.editor.config.onchange = (html) => {
                this.info_ = html // 绑定当前逐渐地值
                this.$emit("change", this.info_) // 将内容同步到父组件中
            }
            // 创建富文本编辑器
            this.editor.create()

            this.editor.config.uploadImgHooks = {
                // 上传图片之前
                before: (xhr, editor, file) => {
                    console.log(xhr)
                    console.log(this.editor.config.uploadImgParams, "随时随地所多")
                    const filename = uuid + "." + file[0].name.split(".")[1]
                    this.editor.config.uploadImgParams.filenames = filename
                    this.imgUrl = process.env.VUE_APP_RESOURCE_SERVER + "/files/1003/train/manage" + "/" + filename
                    // 可阻止图片上传
                    // return {
                    //     prevent: true,
                    //     msg: "需要提示给用户的错误信息"
                    // }
                },
                // 图片上传并返回了结果，图片插入已成功
                success: (xhr) => {
                    console.log("success", xhr)
                },
                // 图片上传并返回了结果，但图片插入时出错了
                fail: (xhr, editor, resData) => {
                    console.log("fail", resData)
                },
                // 上传图片出错，一般为 http 请求的错误
                error: (xhr, editor, resData) => {
                    console.log("error", xhr, resData)
                },
                // 上传图片超时
                timeout: (xhr) => {
                    console.log("timeout")
                },
                // 图片上传并返回了结果，想要自己把图片插入到编辑器中
                // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
                customInsert: (insertImgFn, result) => {
                    // result 即服务端返回的接口
                    console.log("customInsert", result)

                    // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
                    insertImgFn(this.imgUrl)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.editor {
    width: 100%;
    margin: auto;
    position: relative;
}
</style>
