<template>
    <div class="resource-retrieval">
        <base-form size="small" :model="form" show-search :components="components" @search="getList" />
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="showAddEditDialog('add', null)">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="selection.length <= 0" @click="deleteChoseRoles">
                    删除
                </el-button>
            </el-col>
        </el-row>
        <basic-table :data="resourceList" :columns="columns" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="100px" align="center" />
            <el-table-column label="" prop="resourceIcon" width="50px" align="left">
                <template slot-scope="{row}">
                    <img width="100%" :src="baseUrl + row.resourceIcon + '?' + Math.random()" alt="">
                </template>
            </el-table-column>
            <el-table-column align="left" label="资源名称" prop="resourceName" show-overflow-tooltip width="200px" />
            <el-table-column label="资源类型" prop="resourceTypeLabel" width="100px" align="left" />
            <el-table-column align="left" label="模型类型" prop="modelTypeLabel" width="100px" />
            <el-table-column label="文件名称" prop="fileName" width="350px" align="left" />
            <el-table-column label="文件大小" prop="resourceSize" width="100px" align="left" />
            <el-table-column label="创建时间" prop="createTime" width="180px" align="left" />
            <el-table-column label="更新时间" prop="updateTime" width="180px" align="left" />
            <el-table-column label="操作" width="200px">
                <template #default="{ row }">
                    <el-button v-if="getJurisdiction('resource:detail')" icon="el-icon-connection" size="mini" type="text" @click="Detail(row)">运行
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="showAddEditDialog('edit', row)">编辑</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </basic-table>
        <pagination :total="paging.total" :page.sync="paging.pageNo" :limit.sync="paging.pageSize" @pagination="getList" />
        <mock-resource :visible.sync="addEditVisible" :type="addEditType" :row="row" @success="getList" />
    </div>
</template>

<script>
import BaseForm from "@/components/BaseForm/BaseForm.vue";
import BasicTable from "@/components/BaseTable/BasicTable.vue";
import MockResource from "./resource-manage";
import resource from "@/api/resource";
import study from "@/api/train";

export default {
    name: "ResourceIndex",
    components: { MockResource, BaseForm, BasicTable },
    data() {
        return {
            baseUrl: process.env.VUE_APP_RESOURCE_SERVER,
            addEditVisible: false,
            addEditType: "add",
            row: null,
            form: {
                resourceName: "",
                resourceType: "",
                resourceId: "",
                modelType: "",
                date: [],
            },
            resourceList: [],
            columns: [],
            components: [],
            resourceTypeOptions: [],
            modeTypeOptions: [],
            paging: {
                total: 0,
                pageNo: 1,
                pageSize: 20,
            },
            selection: [],
        };
    },
    computed: {
        getJurisdiction() {
            return function (val) {
                return this.$store.getters["menux/buttonList"].find((item) => item.perms === val);
            };
        },
    },
    created() {
        this.initCom();
    },
    methods: {
        // 新增或者编辑
        showAddEditDialog(type, row) {
            this.addEditVisible = true;
            this.addEditType = type;
            this.row = row ? Object.assign(row) : row;
        },
        // 查询列表
        async getList() {
            const params = {
                busiCode: "1003",
                tranCode: "331003",
                pageNum: this.paging.pageNo, // 页码
                pageSize: this.paging.pageSize, // 页容
                resourceName: this.form.resourceName, // 资源名称
                resourceType: this.form.resourceType, // 资源类型
                modelType: this.form.modelType,
                resourceId: this.form.resourceId, // 资源ID
                startTime: this.form.date.length ? this.form.date[0] : "", // 开始时间
                endedTime: this.form.date.length ? this.form.date[1] : "", // 结束时间
            }
            resource.resourceQuery(params).then(res => {
                if (res.respType === 1) {
                    res.respData.list.forEach(item => {
                        this.resourceTypeOptions.forEach(val => {
                            if (item.resourceType === val.dictValue) {
                                item.resourceTypeLabel = val.dictLabel
                            }
                        })
                        this.modeTypeOptions.forEach(val => {
                            if (item.modelType === val.dictValue) {
                                item.modelTypeLabel = val.dictLabel
                            }
                        })
                    })
                    this.paging.total = res.respData.total
                    this.$set(this, "resourceList", res.respData.list)
                }
            })
        },
        // 删除单个
        handleDelete(row) {
            this.deleteResource([row.id])
        },
        // 运行模型
        async Detail(row) {
            const params = {
                busiCode: "1003",
                tranCode: "332301",
                ftpId: 1,
                trainRid: row.id,
                mode: 4,
            };
            await study.study(params).then(res => {
                if (res.respType === 1) {
                    window.open(process.env.VUE_APP_RESOURCE_SERVER + res.respData)
                }
            })
        },
        // 批量删除
        deleteChoseRoles() {
            const ids = this.selection.map((item) => item.id);
            this.deleteResource(ids, () => {
                this.selection = [];
            });
        },
        deleteResource(ids, fn) {
            this.$modal.confirm("是否确认删除资源编号为\"" + ids + "\"的数据项？").then(async () => {
                try {
                    await resource.resourceDelete({
                        busiCode: 1003,
                        tranCode: "331004",
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
        // 多选框选中数据
        handleSelectionChange(value) {
            this.selection = value;
        },
        /**
         * 搜索框的配置项初始化直接赋值
         */
        initCom() {
            this.components = [
                {
                    label: "资源名称：",
                    prop: "resourceName",
                    component: "el-input",
                    componentProp: {
                        placeholder: "请输入资源名称",
                    },
                },
                {
                    label: "资源类型：",
                    prop: "resourceType",
                    component: "BaseSelect",
                    componentProp: {
                        placeholder: "请选择资源类型",
                        type: "simu_resource",
                    },
                    on: {
                        finished: (res) => {
                            this.resourceTypeOptions = res
                            this.getList()
                        },
                    },
                },
                {
                    label: "模型类型：",
                    prop: "modelType",
                    component: "BaseSelect",
                    componentProp: {
                        placeholder: "请选择模型类型",
                        type: "model_type",
                    },
                    on: {
                        finished: (res) => {
                            this.modeTypeOptions = res
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
