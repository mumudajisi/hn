import http from "@/utils/http";
export default {
    // 分页列表查询
    resourceQuery(params) {
        return http.post("/resource/query", params)
    },
    // 新增
    resourceAdd(params) {
        return http.post("/resource/add", params)
    },
    // 修改
    resourceEdit(params) {
        return http.post("/resource/edit", params)
    },
    // 删除
    resourceDelete(params) {
        return http.post("/resource/delete", params)
    },
    // 查询详情
    resourceQueryDetail(params) {
        return http.post("/resource/query/detail", params)
    },
}

