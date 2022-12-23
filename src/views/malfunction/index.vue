<template>
    <div>
        <base-form :components="components" :model="search" show-search size="small" @search="getList" />
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="addOrEdit({}, 'add')">新增</el-button>
        <el-button icon="el-icon-delete" size="mini" type="danger" @click="onDeletes">批量删除</el-button>
        <basic-table :columns="columns" :data="formList" @selection-change="handleSelectionChange">
            <el-table-column align="center" type="selection" />
            <el-table-column align="left" label="故障名称" prop="hitchName" width="300px" />
            <el-table-column align="left" label="模型类型" prop="modelTypeLabel" width="300px" />
            <el-table-column align="left" label="故障代码" prop="hitchCode" width="300px" />
            <!--<el-table-column align="center" label="故障现象" prop="statusLabel" width="180px" />-->
            <!--<el-table-column align="left" label="所需实验" prop="createTime" width="180px" />-->
            <el-table-column align="center" label="操作" width="180px">
                <template #default="{ row }">
                    <el-button icon="el-icon-connection" size="mini" type="text" @click="addOrEdit(row, 'edit')">编辑</el-button>
                    <el-button icon="el-icon-connection" size="mini" type="text" @click="onDelete([row.id])">删除</el-button>
                </template>
            </el-table-column>
        </basic-table>
        <addOrEdit
            v-if="dialogVisible"
            ref="mockResource"
            :hide-dialog="() => (dialogVisible = false)"
            :model-type-options="modelTypeOptions"
            :title-type="titleType"
            :row="row"
            @success="getList"
        />
        <pagination :limit.sync="paging.pageSize" :page.sync="paging.pageNo" :total="paging.total" @pagination="getList" />
    </div>
</template>
<script>
import BaseForm from "@/components/BaseForm/BaseForm.vue";
import BasicTable from "@/components/BaseTable/BasicTable.vue";
import addOrEdit from "@/views/malfunction/addOrEdit";
import hitchApi from "@/api/malfunction"

export default {
    name: "Malfunction",
    components: { BaseForm, BasicTable, addOrEdit },
    data() {
        return {
            row: null,
            dialogVisible: false,
            titleType: "add",
            components: [],
            search: {
                modelType: "",
                hitchCode: "",
                hitchName: "",
            },
            paging: {
                total: 0,
                pageNo: 1,
                pageSize: 10,
            },
            form: {
                date: [],
            },
            columns: [],
            formList: [],
            modelTypeOptions: [],
            selection: []
        }
    },
    created() {
        this.initCom();
    },
    methods: {
        // 新增或者编辑
        addOrEdit(row, type) {
            this.dialogVisible = true
            this.row = row ? Object.assign(row) : row
            this.titleType = type
        },
        // 表格数据
        async getList() {
            try {
                const params = {
                    busiCode: 1003,
                    tranCode: "335003",
                    pageNum: this.paging.pageNo,
                    pageSize: this.paging.pageSize,
                    modelType: this.search.modelType,
                    hitchCode: this.search.hitchCode,
                    hitchName: this.search.hitchName,
                    startTime: this.form.date.length ? this.form.date[0] : "",
                    endedTime: this.form.date.length ? this.form.date[1] : "",
                }
                await hitchApi.hitch(params).then(res => {
                    if (res.respType === 1) {
                        res.respData.list.forEach(item => {
                            this.modelTypeOptions.forEach(val => {
                                if (item.modelType === val.dictValue) {
                                    item.modelTypeLabel = val.dictLabel
                                }
                            })
                        })
                        this.paging.total = res.respData.total
                        this.$set(this, "formList", res.respData.list)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        },
        // 单个删除
        onDelete(ids, fn) {
            this.$modal.confirm("是否确认删除故障编号为\"" + ids + "\"的数据项？").then(async () => {
                try {
                    await hitchApi.hitchDelete({
                        busiCode: 1003,
                        tranCode: "335004",
                        ids: ids,
                    });
                    await this.getList();
                    this.$modal.msgSuccess("删除成功");
                    fn?.();
                } catch (error) {
                    console.log(error);
                }
            });
        },
        // 批量删除
        onDeletes() {
            const ids = this.selection.map((item) => item.id);
            this.onDelete(ids, () => {
                this.selection = [];
            });
        },
        // 多选框选中数据
        handleSelectionChange(value) {
            this.selection = value;
        },
        // 列表展示
        initCom() {
            this.components = [
                {
                    label: "模型类型",
                    prop: "modelType",
                    component: "BaseSelect",
                    componentProp: {
                        placeholder: "请选择当前状态",
                        type: "model_type"
                    },
                    on: {
                        finished: (res) => {
                            this.modelTypeOptions = res
                            this.getList()
                        },
                    },
                },
                {
                    label: "故障代码",
                    prop: "hitchCode",
                    component: "el-input",
                    componentProp: {
                        placeholder: "请输入故障代码",
                    },
                },
                {
                    label: "故障名称",
                    prop: "hitchName",
                    component: "el-input",
                    componentProp: {
                        placeholder: "请输入故障名称",
                    },
                },
            ];
        },
    }
}
</script>

<style lang="scss" scoped>

</style>
