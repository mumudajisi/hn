import http from "@/utils/http";

export default {
    getDataShow(params) {
        return http.post("/index/data/show", params);
    },
}
