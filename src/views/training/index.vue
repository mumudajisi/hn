<template>
    <div class="train-retrieval">
        <base-form :components="components" :model="form" show-search size="small" @search="getList" />
        <basic-table :columns="columns" :data="trainList">
            <el-table-column align="center" label="序号" style="width:150px" type="index" :hidden="true" />
            <el-table-column align="left" label="培训标题" prop="trainTitle" width="300px" />
            <el-table-column align="left" label="培训地点" prop="trainAddr" width="300px" />
            <el-table-column label="培训时间" prop="trainTime" width="300px" />
            <el-table-column align="center" label="当前状态" prop="statusLabel" width="180px" />
            <el-table-column align="left" label="创建时间" prop="createTime" width="180px" />
            <el-table-column align="center" label="操作" width="180px">
                <template #default="{ row }">
                    <el-button v-if="getJurisdiction('train:detail')" icon="el-icon-connection" size="mini" type="text" @click="Detail(row.id)">详情</el-button>
                </template>
            </el-table-column>
        </basic-table>
        <pagination :limit.sync="paging.pageSize" :page.sync="paging.pageNo" :total="paging.total" @pagination="getList" />
    </div>
</template>
<script>
import BaseForm from "@/components/BaseForm/BaseForm.vue";
import BasicTable from "@/components/BaseTable/BasicTable.vue";
import myTrain from "@/api/train";
import { dict } from "@/api";

export default {
    name: "TrainIndex",
    components: { BaseForm, BasicTable },
    data() {
        return {
            addEditVisible: false,
            addEditType: "add",
            row: null,
            form: {
                trainTitle: "",
                // lecturer: "",
                status: "",
                date: [],
            },
            trainList: [],
            columns: [],
            components: [],
            paging: {
                total: 0,
                pageNo: 1,
                pageSize: 20,
            },
            trainStatusOptions: [], // 当前状态选项
            trainModeOptions: [], // 培训人员类型
            selection: [],
        };
    },
    // 计算权限
    computed: {
        getJurisdiction() {
            return function (val) {
                return this.$store.getters["menux/buttonList"].find((item) => item.perms === val)
            }
        }
    },
    created() {
        this.initCom();
        this.gitTrainModeOptions()
    },
    methods: {
        Detail(id) {
            this.$router.push({
                path: "/train/detail",
                query: {
                    id: id
                }
            })
        },
        // 获取培训人员类别字典
        gitTrainModeOptions() {
            dict.getDictDataList({
                pageNum: 1,
                pageSize: 10000,
                dictCode: "train_mode",
            }).then(res => {
                if (res.respType === 1) {
                    this.trainModeOptions = res.respData.list
                }
            })
        },
        // 获取数据列表
        async getList() {
            try {
                const params = {
                    busiCode: 1003,
                    tranCode: "332029",
                    id: +this.$store.getters["userx/userId"],
                    pageNum: this.paging.pageNo,
                    pageSize: this.paging.pageSize,
                    status: this.form.status,
                    trainTitle: this.form.trainTitle
                }
                await myTrain.myTrain(params).then(res => {
                    if (res.respType === 1) {
                        res.respData?.list?.forEach(item => {
                            item.trainTime = item.startTime + "-" + item.closeTime
                            this.trainStatusOptions.forEach(val => {
                                if (item.status === val.dictValue) {
                                    item.statusLabel = val.dictLabel
                                }
                            })
                            this.trainModeOptions.forEach(val => {
                                if (item.trainType === val.dictValue) {
                                    item.trainTypeLabel = val.dictLabel
                                }
                            })
                        })
                        this.paging.total = res.respData.total
                        this.$set(this, "trainList", res.respData.list)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        },
        initCom() {
            this.components = [
                {
                    label: "培训标题：",
                    prop: "trainTitle",
                    component: "el-input",
                    componentProp: {
                        placeholder: "请输入培训名称",
                    },
                },
                {
                    label: "当前状态：",
                    prop: "status",
                    component: "BaseSelect",
                    componentProp: {
                        placeholder: "请选择当前状态",
                        type: "train_status"
                    },
                    on: {
                        finished: (res) => {
                            this.trainStatusOptions = res
                            this.getList()
                        },
                    },
                },
                {
                    component: "el-date-picker",
                    label: "创建时间：",
                    prop: "date",
                    componentProp: {
                        width: "250px",
                        type: "daterange",
                        startPlaceholder: "开始日期",
                        endPlaceholder: "结束日期",
                        valueFormat: "yyyy-MM-dd",
                    },
                },
            ];
        },
    },
};
</script>
