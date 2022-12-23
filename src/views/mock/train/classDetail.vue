<template>
    <div class="wrap">
        <!-- 基础信息 -->
        <div class="message">
            <div class="message-title">
                <p>基础信息</p>
            </div>
            <!-- 基础信息内容 -->
            <div class="message-container">
                <!-- 左边部分 -->
                <div class="message-left">
                    <div class="item">
                        <span>培训名称:</span>
                        <span>{{ trainame }}</span>
                    </div>
                    <div class="item">
                        <span>培训状态:</span>
                        <span>{{ statusLabel(status) }}</span>
                    </div>
                    <div class="item1" style="width: 100%">
                        <span>培训地点:</span>
                        <span>{{ address }}</span>
                    </div>
                    <div class="item1">
                        <span>开班时间:</span>
                        <span>{{ time }}</span>
                    </div>
                    <div class="item2">
                        <span>结束时间:</span>
                        <span>{{ overtime }}</span>
                    </div>
                    <div class="item2">
                        <span>创建时间:</span>
                        <span>{{ create }}</span>
                    </div>
                    <div class="item3">
                        <span>创建人员:</span>
                        <span>{{ user }}</span>
                    </div>
                    <div v-show="remarkshow" class="item3" style="width: 100%">
                        <span>闭班原因</span>
                        <span style="color: red">{{ remark }}</span>
                    </div>
                    <!--        培训内容-->
                    <div class="item5" style="margin-top: 5px">
                        <div class="item6">培训内容:</div>
                        <div class="contents" v-html="content" />
                    </div>
                </div>
                <!-- 上传图片部分 -->
                <div class="message-center">
                    <img :src="imageUrl" alt="">
                </div>
                <!-- 右边部分 -->
                <div class="message-right">
                    <div class="lists">
                        <el-button
                            v-show="getJurisdiction('apply:class')"
                            :disabled="dis" :style="{backgroundColor:dis===true?'#ccc':'#4856DD'}" icon="el-icon-user" type="primary"
                            @click="sign()"
                        >{{ actioname }}
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 培训状态 -->
        <div class="train">
            <!-- 标题 -->
            <div class="resource-title">
                <p>培训状态</p>
            </div>
            <!-- 内容部分 -->
            <div class="train-container">
                <div :style="{ backgroundColor: status >= 1 ? '#4856DD' : '#999' }" class="trainer">已发布</div>
                <div v-show="hr" :style="{ color: status >= 1 ? '#4856DD' : '#000' }" class="hr" />
                <div v-show="classdate" :style="{ backgroundColor: status >= 2 ? '#4856DD' : '#999' }" class="trainer">
                    {{ status >= 2 ? "已开课" : "未开课" }}
                </div>
                <div :style="{ color: status >= 3 ? '#4856DD' : '#000' }" class="hr" />
                <div v-if="overstand" :style="{ backgroundColor: status >= 3 ? '#4856DD' : '#999' }" class="trainer">
                    {{ status >= 3 ? "已结束" : "未结束" }}
                </div>
                <div v-show="navshow" class="trainer" style="background-color: #4856dd">已关闭</div>
            </div>
        </div>
        <!-- 培训资源 -->
        <div class="resource">
            <!-- 内容部分 -->
            <div class="resource-container">
                <classTable ref="table1" class="table1" :status="status" />
            </div>
        </div>
    </div>
</template>
<script>
import classTable from "@/views/mock/train/components/classTable";
import trainApi from "@/api/train"
import api from "@/api/dict"
export default {
    components: { classTable },
    data() {
        return {
            dialogVisible: false, // 外弹框
            trainame: "",
            addEditVisible: "",
            addEditType: "",
            row: null,
            dname: "",
            actioname: "",
            title: "添加培训项目",
            // 闭班弹窗
            closeClass: false,
            hr: true, // 线
            course: "",
            classdate: true, // 闭班展示消失`
            partakeMode: "",
            dis: false, // 报名按钮禁用
            diss: false, // 报到按钮禁用
            teacher: "",
            status: "",
            check: "", // 报到
            signUp: "", // 报名
            overstand: true,
            address: "",
            time: "",
            overtime: "",
            create: "",
            user: "",
            imageUrl: "",
            content: "",
            input: "",
            overdate: "",
            diclist: [],
            resonlist: [],
            trigger_typeshow: false, // 文本域
            dictValue: "", // 双向绑定
            dicshow: false, //
            rid: null,
            closeReason: "",
            closeStatus: "",
            remarkshow: false,
            flagger: false, // 标签
            closeraction: false, // 按钮禁用
            closest: "闭班",
            navshow: false, // 已关闭
            areas: "", // 文本域
            remark: "",
            resourceForm: "", // 基础信息数据
            tableData: []
        };
    },
    computed: {
        getDictDataList() {
            return (row) => {
                const res = this.diclist.find((e) => String(e.dictValue) === String(row.check_status));
                return res ? res.dictLabel : "";
            };
        },
        // 状态
        statusLabel() {
            return function (val) {
                return this.diclist?.find((item) => val === item.dictValue)?.dictLabel;
            };
        },
        getJurisdiction() {
            return function (val) {
                return this.$store.getters["menux/buttonList"].find(item => item.perms === val);
            }
        },
    },
    // 监听detail id
    watch: {
        $route: {
            handler() {
                this.id = this.$route.query.id;
                // this.messager();
                this.$nextTick(() => {
                    this.$refs.table1.table();
                })
            },
            deep: true,
        }
    },
    async mounted() {
        await this.messager(); // 表格信息
        await this.getDictList();// 字典表
        await this.over();
    },
    methods: {
        over() {
            const overStatus = this.status;
            if (overStatus === "31" || overStatus === "30") {
                this.$refs.table1.scoreButton = true;
            }
        },

        TaskArr() {
            if (this.dictValue === "其他") {
                this.trigger_typeshow = true;
                // this.messager();
            } else {
                this.trigger_typeshow = false;
            }
        },
        // 调用字典接口
        getDictList() {
            const params = {
                typeList: ["train_status", "close_reason"]
            }
            api.getDictDataTypes(params).then(res => {
                if (res.respType === 1) {
                    this.diclist = res.respData.train_status
                    this.resonlist = res.respData.close_reason
                }
            })
        },
        // 详情数据
        async messager() {
            const params = {
                busiCode: "1003",
                tranCode: "332009",
                type: 1,
                trainId: +this.$route.query.id,
            };
            await trainApi
                .trainlist(params)
                .then((res) => {
                    if (res.respType === 1) {
                        this.trainame = res.respData?.trainTitle;
                        this.teacher = res.respData?.lecturerName;
                        this.address = res.respData?.trainAddr;
                        this.user = res.respData?.createUser;
                        this.time = res.respData?.startTime;
                        this.content = res.respData?.content;
                        this.overtime = res.respData?.closeTime;// 结束时间
                        this.create = res.respData?.createTime;
                        this.status = res.respData?.status;
                        this.signUp = res.respData?.signUp; // 报名状态
                        this.check = res.respData?.check;
                        this.remark = res.respData?.remark;
                        this.imageUrl = process.env.VUE_APP_RESOURCE_SERVER + res.respData?.trainIcon + "?" + Math.random();
                        if (this.signUp === true) {
                            this.dis = true;
                            this.signUp = "已报名";
                            this.actioname = this.signUp;
                            // this.$refs.Tabs.table();
                        }
                        if (this.signUp === false) {
                            this.dis = false;
                            this.actioname = this.signUp;
                            this.signUp = "报名";
                            this.actioname = this.signUp;
                        }
                        if (this.check === false) {
                            this.diss = false;
                            this.check = "报到";
                            this.dname = this.check;
                        }
                        if (this.check === true) {
                            this.diss = true;
                            this.check = "已报到";
                            this.dname = this.check;
                        }
                        if (+this.status === 31) {
                            this.hr = false;
                            this.dis = true;
                            this.diss = true;
                            this.navshow = true;
                            this.closest = "已闭班";
                            this.remarkshow = true;
                            this.closeraction = true;
                            this.classdate = false;
                            this.overstand = false;
                            // this.$refs.Tabs.table();
                        }
                        if (+this.status === 30) {
                            this.dis = true;
                            this.closest = "已闭班";
                            this.diss = true;
                            this.overstand = true;
                            this.remarkshow = false;
                            this.$refs.Tabs.table();
                        }
                        this.$refs.table1.cExam({ start: res.respData?.examStartTime, end: res.respData?.examEndTime });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        //    报名
        async sign() {
            const params = {
                busiCode: 1003,
                trainId: +this.$route.query.id,
                tranCode: "332020",
            };
            await trainApi
                .studentSign(params)
                .then((res) => {
                    if (res.respType === 1) {
                        this.actioname = "已报名";
                        this.dis = true;
                        this.$message({
                            message: "报名成功",
                            type: "success",
                        });
                        this.$refs.Tabs.table();
                    }
                })
                .catch((error) => {
                    if (error.data.respType === 0) {
                        this.dis = false;
                    }
                });
        },
        // 点击闭班
        close() {
            if (+this.status === 1) {
                this.closeClass = true;
            } else if (+this.status === 2) {
                this.status = 30;
                this.$refs.table1.scoreButton = true;
                this.navshow = false;
            }
            this.closer();
        },
        // 闭班确定
        sure() {
            if (this.dictValue !== "") {
                if (+this.status === 1) {
                    this.status = 31;
                }
                this.closeClass = false;
                this.closer();
            }
        },
        // 取消
        cancels() {
            this.closeClass = false;
            this.remark = "";
        },
        async closer() {
            const params = {
                busiCode: "1003",
                trainId: +this.$route.query.id,
                tranCode: "332028",
                status: this.status,
                reason: this.dictValue.length > 3 ? this.dictValue : this.dictValue.substring(2, 3) + this.remark,
            };
            await trainApi
                .closeStatus(params)
                .then((res) => {
                    if (res.respType === 1) {
                        this.messager();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        // 学员报到
        async action() {
            const params = {
                busiCode: "1003",
                trainId: this.$route.query.id,
                tranCode: "332021",
            };
            await trainApi
                .studentCheck(params)
                .then((res) => {
                    if (res.respType === 1) {
                        this.dname = "已报到";
                        this.diss = true;
                        this.$message({
                            showClose: true,
                            message: "报到成功",
                            type: "success",
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    if (error.data.respType === 0) {
                        this.diss = false;
                    }
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.selection {
    display: flex;
    justify-content: center;
}

.el-dialog__wrapper {
    position: fixed;
    top: 135px !important;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
}

.wrap {
    width: 100%;
    //background-color: #90c0be;
    // 基础信息
    .message-title,
    .resource-title {
        width: 100%;
        height: 60px;
        padding-left: 24px;
        font-size: 12px;
        padding-top: 14px;
        display: flex;

        justify-content: space-between;
    }

    .train-title,
        // 培训内容部分
    .train-container,
    .resource-container {
        width: 100%;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .trainer {
        width: 60px;
        height: 60px;
        border-radius: 100%;
        font-size: 12px;
        text-align: center;
        line-height: 60px;
        color: #fff;
        background-color: #999;
    }

    .message-title,
    .resource-title,
    .train-title > p {
        color: #000000;
        padding: 18px 20px;
        border-bottom: 1px solid #e6ebf5;
        font-size: 16px;
    }

    .train,
    .resource {
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        margin-bottom: 20px;
    }

    // 基础信息内容部分
    .message {
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        margin-bottom: 20px;
    }

    .message-container {
        width: 100%;
        background-color: #fff;
        display: flex;
    }

    .el-button--primary {
        width: 150px;
        margin-top: 10px;
        margin-left: 15px;
        border: none;
    }

    // 培训内容部分
    // 左边一块
    .message-left {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 650px;

        .item,
        .item1,
        .item2,
        .item3 {
            width: 300px;
            margin-left: 20px;
            display: flex;
            font-size: 14px;
            align-items: center;

            span {
                color: #000;
                font-size: 14px;
                margin-left: 15px;
            }
        }
    }

    .item > input {
        font-size: 12px;
        color: #9a9a9a;
        margin-left: 10px;
        text-indent: 10px;
        background-color: #fff;
        border: none !important;
    }

    .item > p {
        font-size: 12px;
        margin-left: 50px;
        margin-top: 10px;
        line-height: 25px;
    }

    .message-center {
        margin-left: 10px;
        margin-top: 10px;
        margin-bottom: 6px;

        img {
            width: 200px;
            height: 200px;
            border-radius: 10px;
            box-shadow: 2px 2px 10px #000;
        }
    }

    // 右边部分
    .message-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

    .lists > img {
        width: 18px;
        height: 18px;
    }

    .lists > p {
        font-size: 12px;
        color: #fff;
        margin-left: 10%;
    }

    .list-detail {
        width: 80px;
        height: 15px;
        margin-left: 13%;
    }

    .contents {
        font-size: 12px;
        margin-top: 5px;
        margin-left: 33px;
    }
    .item1,
    .item2,
    .item3 {
        margin-top: 6px;
    }

    .item {
        margin-top: 5px;
    }
    .item6 {
        font-size: 14px;
        margin-left: 35px;
    }

    .train-resource {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .list-detail > img {
        width: 18px;
        height: 18px;
        margin-left: 10%;
        margin-top: 10%;
    }
    .hr {
        border-top: 1px solid;
        width: 130px;
        margin-left: 10px;
        margin-right: 10px;
    }

}
</style>
