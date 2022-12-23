<template>
    <div class="train-retrieval">
        <base-form :components="components" :model="form" show-search size="small" @search="getList" />
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button icon="el-icon-plus" size="mini" type="primary" @click="showAddEditDialog('add', null)">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button :disabled="selection.length <= 0" icon="el-icon-delete" size="mini" type="danger" @click="deleteChoseRoles">
                    删除
                </el-button>
            </el-col>
        </el-row>
        <basic-table :columns="columns" :data="trainList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" />
            <el-table-column align="left" label="培训标题" prop="trainTitle" show-overflow-tooltip width="400px" />
            <el-table-column align="left" label="培训地点" prop="trainAddr" width="300px" />
            <el-table-column label="培训时间" prop="trainTime" width="300px" align="left" />
            <el-table-column align="center" label="当前状态" prop="statusLabel" width="180px" />
            <el-table-column align="left" label="创建时间" prop="createTime" width="180px" />
            <el-table-column align="left" label="操作" width="180px">
                <template #default="{ row }">
                    <el-button v-if="getJurisdiction('train:detail')" icon="el-icon-connection" size="mini" type="text" @click="Detail(row.id)">详情</el-button>
                    <el-button icon="el-icon-edit" size="mini" type="text" @click="showAddEditDialog('edit', row)">编辑</el-button>
                    <el-button icon="el-icon-delete" size="mini" type="text" @click="deleteRoles([row.id])">删除</el-button>
                </template>
            </el-table-column>
        </basic-table>
        <pagination :limit.sync="paging.pageSize" :page.sync="paging.pageNo" :total="paging.total" @pagination="getList" />
        <train-manage :row="row" :type="addEditType" :visible.sync="addEditVisible" @success="getList" />
    </div>
</template>

<script>
import BaseForm from "@/components/BaseForm/BaseForm.vue";
import BasicTable from "@/components/BaseTable/BasicTable.vue";
import train from "@/api/train";
import TrainManage from "@/views/mock/train/train-manage";
import { dict } from "@/api";
import { Console } from "console";

export default {
    name: "TrainIndex",
    components: { TrainManage, BaseForm, BasicTable },
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
    computed: {
        getJurisdiction() {
            return function (val) {
                return this.$store.getters["menux/buttonList"].find(item => item.perms === val);
            }
        },
    },
    created() {
        this.initCom();
        this.gitTrainModeOptions()
    },
    methods: {
        // 新增或者编辑弹框
        showAddEditDialog(type, row) {
            this.addEditVisible = true;
            this.addEditType = type;
            this.row = row ? Object.assign(row) : row;
        },
        Detail(id) {
            this.$router.push({
                path: "detail",
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
                    tranCode: "332003",
                    // lecturer: this.form.lecturer,
                    pageNum: this.paging.pageNo,
                    pageSize: this.paging.pageSize,
                    startTime: this.form.date.length ? this.form.date[0] : "",
                    endedTime: this.form.date.length ? this.form.date[1] : "",
                    status: this.form.status,
                    trainTitle: this.form.trainTitle
                }
                await train.trainQuery(params).then(res => {
                    if (res.respType === 1) {
                        res.respData?.list?.forEach(item => {
                            item.trainTime = item.startTime + "-" + item.closeTime
                            console.log(item)
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
        // 删除多个
        deleteChoseRoles() {
            const ids = this.selection.map((item) => item.id);
            this.deleteRoles(ids, () => {
                this.selection = [];
            });
        },
        // 删除
        deleteRoles(ids, fn) {
            this.$modal.confirm("是否确认删除培训编号为\"" + ids + "\"的数据项？").then(async () => {
                try {
                    await train.trainDelete({
                        busiCode: 1003,
                        tranCode: "332004",
                        ids: ids,
                        type: 1
                    });
                    await this.getList();
                    this.$modal.msgSuccess("删除成功");
                    fn?.();
                } catch (error) {
                    console.log(error);
                }
            });
        },
        // 多选框选中数据
        handleSelectionChange(value) {
            this.selection = value;
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

<style lang="scss" scoped>
</style>
