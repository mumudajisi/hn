import Vue from "vue"
import DataDict from "@/utils/dict"

function install() {
    Vue.use(DataDict, {
        metas: {
            "*": {
                labelField: "dictLabel",
                valueField: "dictValue",
                request(dictMeta) {},
            },
        },
    })
}

export default {
    install,
}
