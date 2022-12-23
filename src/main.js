import Vue from "vue"

import Cookies from "js-cookie"

import Element from "element-ui"
import "./assets/styles/element-variables.scss"
import "./assets/styles/common.scss"
import "@/assets/styles/index.scss" // global css
import "@/assets/styles/ruoyi.scss" // ruoyi css
import App from "./App"
import store from "./store"
import router from "./router"
import directive from "./directive" // directive
import plugins from "./plugins" // plugins
import service, { download } from "@/utils/request" // 下载方法
import "./assets/icons" // icon
import "./permission" // permission control
import { handleTree, resetForm } from "@/utils/ruoyi";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"

// 富文本组件
import Editor from "@/components/Editor"

// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 字典标签组件
import DictTag from "@/components/DictTag"
// 头部标签组件
import VueMeta from "vue-meta"
// 字典数据组件
import DictData from "@/components/DictData"
import BaseSelect from "@/components/BaseSelect/BaseSelect.vue"
import BaseRadio from "@/components/BaseRadio/BaseRadio.vue"
// 全局方法挂载
Vue.prototype.resetForm = resetForm
Vue.prototype.download = download // 下载
Vue.prototype.handleTree = handleTree
Vue.prototype.$downloadFile = (url, fileName = "", params = {}, method = "post") => {
    const loading = Vue.prototype.$loading({
        lock: true,
        text: "loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
    });
    const fileNames = fileName
    service({
        url: url,
        method: method,
        params: method === "get" ? params : {},
        data: params,
    }).then(res => {
        const blob = new Blob([res]);
        const objectUrl = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = objectUrl;
        link.setAttribute("download", fileNames)
        document.body.appendChild(link)
        link.click()
        // 下载完成移除元素
        document.body.removeChild(link)
        // 释放blob对象
        window.URL.revokeObjectURL(objectUrl)
        loading.close()
    })
}
// 全局组件挂载
Vue.component("DictTag", DictTag)
Vue.component("Pagination", Pagination)
Vue.component("RightToolbar", RightToolbar)
Vue.component("Editor", Editor)
Vue.component("FileUpload", FileUpload)
Vue.component("ImageUpload", ImageUpload)
Vue.component("ImagePreview", ImagePreview)
Vue.component("BaseSelect", BaseSelect)
Vue.component("BaseRadio", BaseRadio)

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
DictData.install()
Vue.use(Element, {
    size: Cookies.get("size") || "medium"
})

Vue.config.productionTip = false

new Vue({
    el: "#app",
    router,
    store,
    beforeCreate() {
        Vue.prototype.$bus = this
        this.$store.state.HomeTitle = process.env["VUE_APP_TITLE"]
    },
    render: h => h(App)
})
