
import http from "@/utils/http";

const know = {
    getList(params) {
        return http.post("/know/index", {
            busiCode: "1002",
            tranCode: "361400",
            ...params,
        });
    },
    getTree() {
        return http.post("/know/tree", {
            busiCode: "1002",
            tranCode: "361409",
        });
    }
}
const mock = {}
const model = {
    getList(params) {
        return http.post("/model/index", {
            busiCode: "1002",
            tranCode: "361600",
            ...params,
        });
    },
    getTree() {
        return http.post("/model/tree", {
            busiCode: "1002",
            tranCode: "361609",
        });
    }
}

export {
    know,
    mock,
    model
};

export default {

};
