<!-- 表格 -->
<template>
    <div style="width: 100%">
        <div class="container">
            <div class="title">
                <p>培训项目</p>
            </div>
        </div>
        <basic-table :data="tableData">
            <el-table-column label="项目名称" prop="projectName" />
        </basic-table>
        <!-- 3. 分页 -->
        <pagination :limit.sync="paging.pageSize" :page.sync="paging.pageNo" :total="paging.total" @pagination="table" />
    </div>
</template>
<script>
import ChooseQuery from "@/api/train.js";
import BasicTable from "@/components/BaseTable/BasicTable.vue";
export default {
    components: { BasicTable },
    data() {
        return {
            tableData: [], // 表格数据
            paging: {
                total: 0,
                pageNo: 1,
                pageSize: 20,
            },
        };
    },
    async mounted() {
        await this.table(); // 调用表格数据
    },
    methods: {
        // 调用表格接口
        async table() {
            const params = {
                busiCode: "1003",
                tranCode: "333003",
                trainId: this.$route.query.id,
                pageNum: this.paging.pageNo, // 页码
                pageSize: this.paging.pageSize, // 页容
            };
            await ChooseQuery.ChooseQuery(params).then((res) => {
                if (res.respType === 1) {
                    this.tableData = res.respData?.list;
                    this.paging.total = res.respData.total;
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
::v-deep.el-table .cell {
    text-align: center;
}
.el-form-item {
    display: flex;
}
::v-deep.el-input--medium .el-input__inner {
    font-size: 12px;
}
.el-button {
    border: none;
    font-size: 12px;
}
.container {
    display: flex;
    justify-content: space-between;
    height: 60px;
}
.title,
.lce {
    margin-left: 20px;
    margin-top: 11px;
}
.sketch_content {
    overflow: auto;
    height: 600px;
    border-top: 1px solid #eff1f4;
    border-bottom: 1px solid #eff1f4;
    padding: 0 30px 11px 27px;
    &::-webkit-scrollbar {
        width: 3px;
    }
    &::-webkit-scrollbar-thumb {
        background: #8798af;
        border-radius: 2px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
}
.lce {
    margin-right: 10px;
}
</style>
