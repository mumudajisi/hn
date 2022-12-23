import http from "@/utils/http";
export default {
    trainlist(params) {
        return http.post("/train/query/detail", params);
    },
    // 培训工作展示
    getUserList(params) {
        return http.post("/train/query", { ...params })
    },
    // 分页列表查询
    trainQuery(params) {
        return http.post("/train/query", { ...params });
    },
    // 培训基础信息新增
    trainAdd(params) {
        return http.post("/train/train/add", { ...params });
    },
    // 培训基础信息修改
    trainEdit(params) {
        return http.post("/train/edit", { ...params });
    },
    // 培训学员新增
    trainStudentAdd(params) {
        return http.post("/train/student/add", { ...params });
    },
    // 培训学员查询
    trainQueryStu(params) {
        return http.post("/train/query/student", { ...params });
    },
    // 培训学员删除
    trainDeleteStu(params) {
        return http.post("/train/delete/student", { ...params });
    },
    // 培训资源添加
    // trainResourceAdd(params) {
    //     return http.post("/train/resource/add", { ...params });
    // },
    // 培训资源查询
    // trainQueryRes(params) {
    //     return http.post("/train/query/resource", { ...params });
    // },
    // 培训列表删除
    trainDelete(params) {
        return http.post("/train/delete", { ...params });
    },
    // 学员报名
    studentSign(params) {
        return http.post("/train/signup", { ...params });
    },
    //    学员报到
    studentCheck(params) {
        return http.post("/train/checkin", { ...params })
    },
    //   考试时间
    teamTime(params) {
        return http.post("/train/param/setting", { ...params });
    },
    // 闭班状态
    closeStatus(params) {
        return http.post("/train/edit/status", { ...params });
    },
    // 选择资源下拉菜单
    chooseSelect(params) {
        return http.post("/resource/query/list", params);
    },
    // 培训项目列表
    ChooseQuery(params) {
        return http.post("/trains/resource/query", params)
    },
    // 培训项目新增
    ChooseAdd(params) {
        return http.post("/trains/resource/add", params);
    },
    // 培训项目删除
    ChooseDelete(params) {
        return http.post("/trains/resource/delete", params)
    },
    //    培训项目修改
    ChooseEdit(params) {
        return http.post("/trains/resource/edit", params)
    },
    //    参数设置确定
    settingConfirm(params) {
        return http.post("/train/param/setting", params)
    },
    // 参数配置
    settingParam(params) {
        return http.post("/trains/param/setting", params)
    },
    // 模型运行
    study(params) {
        return http.post("/train/run", params)
    },
    // 考试列表查询
    examQuery(params) {
        return http.post("/exam/query", params)
    },
    // 考试详情查询
    exmaDetail(params) {
        return http.post("/exam/detail", params)
    },
    // 我的培训
    myTrain(params) {
        return http.post("/train/my", params)
    },
    // 判断是否为故障代码
    hitchRun(params) {
        return http.post("/train/run/hitch", params)
    },
    // 考试模型
    Exam(params) {
        return http.post("/train/run/exam", params)
    }
};
