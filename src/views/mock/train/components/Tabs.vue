<!-- 学员信息-->
<template>
    <el-tabs v-if="getJurisdiction('train:message')" v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="(v,i) in tabList" :key="i" :label=" v.label" :name=" v.name">
            <el-table :data="formList" width="100%">
                <el-table-column align="left" label="学员姓名" prop="userName" width="100px" />
                <el-table-column align="left" label="联系方式" prop="mobile" />
                <el-table-column align="left" label="身份证号" prop="hitchName" />
                <el-table-column align="left" label="报到状态" prop="checkStatus">
                    <template slot-scope="scope">
                        <p>{{ getDictDataList(scope.row) }}</p>
                    </template>
                </el-table-column>
                <el-table-column v-if="signTime" align="left" label="报名时间" prop="signupTime" />
                <el-table-column v-if="signTime" align="left" label="报到时间" prop="approveTime" />
                <el-table-column v-if="handle" align="left" label="操作" prop="hitchName">
                    <template slot-scope="scope">
                        <el-button v-if="getJurisdiction('resource:delete')" type="text" @click="deleteDict(scope.row)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import trainApi from "@/api/train.js";
import dic from "@/api/dict.js";
export default {
    props: {
        detail: {
            type: Function,
            default: () => {
            }
        },
    },
    data() {
        return {
            signTime: false, // 报名按钮
            handle: true, // 操作
            activeName: "first",
            formList: [],
            diclist: [],
            columns: [],
            tabList: [{
                label: "学员信息",
                name: "first"
            },
            {
                label: "报到信息",
                name: "second"
            }]
        };
    },
    // 计算从字典查找
    computed: {
        getDictDataList() {
            return (row) => {
                const res = this.diclist.find((e) => String(e.dictValue) === String(row.checkStatus));
                return res ? res.dictLabel : "";
            };
        },
        getJurisdiction() {
            return function (val) {
                return this.$store.getters["menux/buttonList"].find((item) => item.perms === val);
            };
        },
    },
    created() {
        this.dic();
        this.table();
    },
    methods: {
        // 点击切换
        async handleClick(tab) {
            const params = {
                busiCode: "1003",
                trainId: +this.$route.query.id,
                type: 2,
                step: tab.name === "first" ? 1 : 2,
                tranCode: "332009",
            };
            await trainApi
                .trainlist(params)
                .then((res) => {
                    if (res.respType === 1) {
                        this.formList = res.respData.list;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            if (tab.name === "second") {
                this.$set(this, "signTime", true)
                this.$set(this, "handle", false)
            } else {
                this.$set(this, "signTime", false)
                this.$set(this, "handle", true)
            }
        },
        async deleteDict(row) {
            const params = {
                busiCode: "1003",
                tranCode: "332004",
                type: +2,
                ids: [row.tid],
                trainId: +this.$route.query.id,
            };
            this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(async () => {
                await trainApi.trainDelete(params).then((res) => {
                    if (res.respType === 1) {
                        this.table();
                        this.detail()
                    }
                })
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            }).catch((error) => {
                console.log(error)
            });
        },
        // 调用字典接收获取数据
        async dic() {
            this.diclist = (
                await dic.getDictDataList({
                    dictCode: "check_status",
                })
            ).respData.list;
        },
        async table() {
            const params = {
                busiCode: "1003",
                trainId: +this.$route.query.id,
                type: 2,
                step: 1,
                tranCode: "332009",
            };
            await trainApi
                .trainlist(params)
                .then((res) => {
                    if (res.respType === 1) {
                        this.formList = res.respData.list;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>
<style lang="scss" scoped>
//
::v-deep.el-table .cell {
    text-align: center;
}
.table {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
.el-button {
    border: none;
    font-size: 12px;
}

.el-tabs {
    height: 100%;

    ::v-deep .el-tabs__item {
        height: 50px;
        line-height: 50px;
        font-size: 18px;

        &:hover {
            color: #4856DD;
        }
    }
    ::v-deep .is-active {
        color: #4856DD;
    }
}
</style>

