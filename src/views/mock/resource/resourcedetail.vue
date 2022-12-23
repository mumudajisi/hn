<template>
    <div class="detail">
        <!-- 上半部分 -->
        <div class="detail-top">
            <!-- 标题 -->
            <div class="detail-title">
                <p>基础信息</p>
            </div>
            <!-- 详情 -->
            <div class="detail-section">
                <div class="section-left">
                    <div v-for="(item, index) in formList" :key="index" class="section-item">
                        <span>{{ item.label }}：</span>
                        <span>{{ dataList[item.bind] }}</span>
                    </div>
                </div>
                <div class="section-right">
                    <!-- 书里面内容 -->
                    <div class="book-container">
                        <div class="book-left">
                            <div class="books-left-container">
                                <div class="books" style="margin-top: 80px">
                                    <img src="@/assets/images/down.png">
                                    <a :href="'http://10.64.1.108' + remotePath + '/' + fileName">
                                        <div class="title">下载</div>
                                    </a>
                                </div>
                                <div class="books">
                                    <img src="@/assets/images/see.png">
                                    <div class="title3">预览</div>
                                </div>
                            </div>
                        </div>
                        <!-- 右边 -->
                        <div class="book-right">
                            <div class="box" :style="{ backgroundImage: `url(${dataList.imgUrl})` }" />
                            <p class="down-title">国家电网电气仿真实验室</p>
                            <p class="down-user">{{ createUser }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 下半部分 -->
        <div class="detail-down">
            <!-- 标题 -->
            <div class="detail-title">
                <p>资源简介</p>
            </div>
            <!-- 内容 -->
            <div class="down-container" style="width: 100%; background-color: #ffff">
                <p>{{ dataList.introduce }}</p>
            </div>
        </div>
    </div>
</template>
<script>
import resource from "@/api/resource";
import { dict } from "@/api";

export default {
    name: "Detail",
    data() {
        return {
            fileName: "", // 资源名称
            remotePath: "", // 地址
            createUser: "",
            formList: [
                {
                    label: "资源代码",
                    bind: "busiCode",
                },
                {
                    label: "资源名称",
                    bind: "resourceName",
                },
                {
                    label: "资源类型",
                    bind: "resourceTypeLabel",
                },
                {
                    label: "文件名称",
                    bind: "fileName",
                },
                {
                    label: "文件大小",
                    bind: "resourceSize",
                },
                {
                    label: "文件类型",
                    bind: "fileType",
                },
                {
                    label: "远程路径",
                    bind: "remotePath",
                },
                {
                    label: "解压路径",
                    bind: "runzipPath",
                },
                {
                    label: "创建时间",
                    bind: "createTime",
                },
                {
                    label: "创建人",
                    bind: "createUser",
                },
            ],
            dataList: {
                busiCode: 1003,
                resourceName: "",
                resourceTypeLabel: "",
                fileName: "",
                resourceSize: "",
                fileType: "",
                remotePath: "",
                runzipPath: "",
                createTime: "",
                createUser: "",
            },
        };
    },
    // 监听detail id
    watch: {
        $route: {
            handler() {
                this.id = this.$route.query.id;
                this.getDetail();
            },
            deep: true,
        }
    },
    mounted() {
        this.gertResourceType();
    },
    methods: {
        // 获取资源类型
        gertResourceType() {
            dict.getDictDataList({
                pageNum: 1,
                pageSize: 10000,
                dictCode: "simu_resource",
            }).then((res) => {
                if (res.respType === 1) {
                    this.resourceTypeOptions = res.respData.list;
                    this.getDetail();
                }
            });
        },
        getDetail() {
            const params = {
                busiCode: "1003",
                tranCode: "331009",
                id: this.$route.query.id,
            };
            resource.resourceQueryDetail(params).then((res) => {
                if (res.respType === 1) {
                    console.log(res.respData);
                    this.fileName = res.respData.fileName; // 资源名称
                    this.remotePath = res.respData.remotePath; // 地址
                    this.createUser = res.respData.createUser;
                    this.resourceTypeOptions?.forEach((val) => {
                        if (res.respData.resourceType === val.dictValue) {
                            res.respData.resourceTypeLabel = val.dictLabel;
                        }
                    });
                    res.respData.imgUrl = process.env.VUE_APP_RESOURCE_SERVER + res.respData.resourceIcon;
                    this.dataList = res.respData;
                }
            });
        },
    },
};
</script>

<style scoped lang="scss">
// 详细信息
.detail-title > p {
    font-size: 12px;
    color: #888;
}
.down-container > p {
    font-size: 14px;
    margin-top: 55px;
    margin-left: 15px;
}
.detail {
    width: 100%;
    .detail-top {
        height: 275px;
    }
    .detail-title {
        width: 100%;
        height: 33px;
        display: flex;
        align-items: center;
        padding-left: 24px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        margin-bottom: 20px;
    }
    .detail-section {
        width: 100%;
        height: 213px;
        background-color: #fff;
        display: flex;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        margin-bottom: 20px;
    }
    .section-left {
        width: 710px;
        display: flex;
        flex-wrap: wrap;
        .section-item {
            width: 270px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            // background-color: green;
            color: #000;
            font-size: 14px;
            padding-top: 10px;
            padding-left: 15px;
        }
    }
    .section-right {
        width: 642px;
        height: 411px;
        background-image: url("../../../assets/images/book.png");
        background-size: contain;
        background-repeat: no-repeat;
        opacity: 75%;
        margin-top: -70px;
        margin-left: 10px;
        .book-container {
            width: 476px;
            height: 213px;
            display: flex;
            align-items: center;
            justify-content: space-around;
        }
        .books,
        .title,
        .title1,
        .title2,
        .title3 {
            width: 70px;
            height: 20px;
            background-color: #90c0be;
            text-align: center;
            font-size: 12px;
            color: #006e6b;
            line-height: 20px;
            cursor: pointer;

            border: 1px solid green;
        }
        .books {
            margin-left: 20px;
            margin-top: 30px;
        }
        .title {
            position: absolute;
            top: 134px;
            right: 14px;
        }
        .title1 {
            position: absolute;
            top: 185px;
            right: 13px;
        }
        .title3 {
            position: absolute;
            top: 185px;
            right: 11px;
        }
        .book-left {
            padding-top: 50px;
            padding-left: 20px;
            width: 168px;
            position: relative;
            // height: 100%;
            // opacity: 0.3;
        }
        .books > img {
            width: 18px;
            height: 18px;
            margin-left: -10px;
            margin-top: 1px;
        }
        .box {
            width: 196px;
            height: 135px;
            box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
            margin-top: 180px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center center;
        }
        .book-right {
            width: 200px;
        }
        .down-title {
            padding-top: 15px;
        }
        // 下面内容部分
        .down-title,
        .down-user {
            font-size: 12px;
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
