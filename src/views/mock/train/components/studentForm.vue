<template>
    <div>
        <base-form :components="components" :model="form" show-search size="small" style="width: 100%;" @search="getList" />

        <el-table ref="studentList" :data="studentList" :row-key="getRowKeys" @selection-change="handleSelectionChange">
            <el-table-column :reserve-selection="true" type="selection" />
            <el-table-column label="序号" type="index" />
            <el-table-column label="姓名" prop="userName" />
            <el-table-column label="部门" prop="deptName" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button icon="el-icon-edit" size="mini" type="text" @click="handleStudentAdd(row)">添加</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            :limit.sync="paging.pageSize"
            :page-sizes="[5,10,20,30,50]"
            :page.sync="paging.pageNo"
            :total="paging.total"
            @pagination="getList"
        />

        <div class="list">学员列表</div>
        <basic-table :data="studentAddsList">
            <el-table-column label="序号" type="index" />
            <el-table-column label="姓名" prop="userName" />
            <el-table-column label="部门" prop="deptName" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button icon="el-icon-edit" size="mini" type="text" @click="handleStudentRemove(row)">删除</el-button>
                </template>
            </el-table-column>
        </basic-table>
        <pagination
            :limit.sync="paging1.pageSize"
            :page-sizes="[5,10,20,30,50]"
            :page.sync="paging1.pageNo"
            :total="paging1.total"
            @pagination="getAddStudent"
        />
    </div>
</template>
<script>
import baseForm from "@/components/BaseForm/BaseForm";
import BasicTable from "@/components/BaseTable/BasicTable.vue";
import user from "@/api/user";
import dept from "@/api/dept";
import train from "@/api/train";

export default {
    name: "StudentForm",
    components: { baseForm, BasicTable },
    props: {
        trainId: {
            type: [String, Number],
            default: null
        }
    },
    data() {
        return {
            // 搜索条件
            form: {
                userName: "",
                dept: ""
            },
            // 搜索配置项
            components: [
                {
                    label: "",
                    prop: "userName",
                    component: "el-input",
                    componentProp: {
                        placeholder: "请输入学员姓名",
                    },
                },
                {
                    label: "",
                    prop: "dept",
                    component: "el-select",
                    componentProp: {
                        placeholder: "请选择部门",
                    },
                    selectOption: []
                },
            ],
            // 学员信息
            studentList: [],
            // 学员信息的分页
            paging: {
                total: 0,
                pageNo: 1,
                pageSize: 5,
            },
            // 已添加学员信息的分页
            paging1: {
                total: 0,
                pageNo: 1,
                pageSize: 5,
            },
            selection: [], // 多选的数据
            // 已添加的学员信息
            studentAddsList: []
        }
    },
    created() {
        this.getDept()
    },
    methods: {
        // 单个添加学员的点击方法
        handleStudentAdd(row) {
            if (!this.selection.find((item) => item.id === row.id)) {
                this.selection.push(row)
                this.addOrEdit([{ id: row.id, userName: row.userName }])
            } else {
                this.$modal.msgError("请勿重复添加");
            }
            // this.$refs.studentList.toggleRowSelection(row, true);
        },
        // 删除已添加学员的信息
        handleStudentRemove(row) {
            this.$modal.confirm("是否确认删除姓名为\"" + row.userName + "\"的数据项？").then(async () => {
                try {
                    const params = {
                        busiCode: "1003",
                        ids: [row.tid],
                        tranCode: "332004",
                        type: 2,
                        trainId: this.trainId
                    }
                    train.trainDeleteStu(params).then(res => {
                        if (res.respType === 1) {
                            this.getAddStudent();
                            this.$modal.msgSuccess("删除成功");
                        }
                    })
                } catch (error) {
                    console.log(error);
                }
            });
        },
        // 查询所有部门
        getDept() {
            dept.getDeptList({ pageNum: 1, pageSize: 10000 }).then(res => {
                if (res.respType === 1) {
                    const arr = []
                    res.respData.forEach(item => {
                        arr.push({
                            label: item.deptName,
                            value: item.deptId
                        })
                    })
                    this.$nextTick(() => {
                        this.components[1].selectOption = arr
                    })
                }
            })
        },
        // 查询所有学员用户信息数据
        getList() {
            const params = {
                pageNum: this.paging.pageNo,
                pageSize: this.paging.pageSize,
                dept: this.form.dept,
                userName: this.form.userName
            }
            user.getUserList(params).then(res => {
                if (res.respType === 1) {
                    this.paging.total = res.respData.total
                    this.studentList = res.respData.list
                }
            })
        },
        // 获取已添加的学员信息
        getAddStudent() {
            const params = {
                busiCode: "1003",
                tranCode: "332009",
                type: 2,
                trainId: this.trainId,
                pageNum: this.paging1.pageNo,
                pageSize: this.paging1.pageSize,
            }
            train.trainQueryStu(params).then(res => {
                if (res.respType === 1) {
                    this.paging1.total = res.respData?.total
                    this.studentAddsList = res.respData?.list
                }
            })
        },
        // 表格每列的唯一值
        getRowKeys(row) {
            return row.id;
        },
        // 多选框选中数据
        handleSelectionChange(value) {
            this.selection = value
        },
        // 新增或者编辑
        addOrEdit(data) {
            const arr = []
            this.selection.forEach(item => {
                arr.push({
                    id: item.id,
                    userName: item.userName
                })
            })
            const params = {
                busiCode: 1003,
                tranCode: "332001",
                studentDtos: data || arr,
                trainId: this.trainId,
                type: 2
            }
            train.trainStudentAdd(params).then(res => {
                if (res.respType === 1) {
                    this.activeTabs = "resource"
                    this.$modal.msgSuccess(`学员信息添加成功`);
                    this.getAddStudent()
                }
            })
        },
        open() {
            this.getAddStudent()
            this.getList()
        },
        // 页面重置
        reset() {
            this.form = {
                userName: "",
                dept: ""
            }
            this.studentList = []
            this.paging = {
                total: 0,
                pageNo: 1,
                pageSize: 5,
            }
            this.paging1 = {
                total: 0,
                pageNo: 1,
                pageSize: 5,
            }
            this.selection?.forEach(item => {
                this.$refs.studentList.toggleRowSelection(item, false);
            })
            this.selection = []
            this.studentAddsList = []
        }
    }
}
</script>

<style lang="scss" scoped>
.list {
    margin-top: 40px;
    padding-left: 10px;
    height: 40px;
    line-height: 40px;
    background-color: #bbbbbb;
    font-size: 14px;
    color: #000;
    font-weight: bold;
}
</style>
