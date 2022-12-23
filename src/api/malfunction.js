import http from "@/utils/http";

export default {
    // 分页列表查询
    hitch(params) {
        return http.post("/hitch/query", params)
    },
    //    新增
    hitchAdd(params) {
        return http.post("/hitch/add", params)
    },
    // 编辑
    hitchEdit(params) {
        return http.post("/hitch/edit", params)
    },
    // 删除
    hitchDelete(params) {
        return http.post("/hitch/delete", params)
    }
}

