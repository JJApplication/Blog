<template>
    <div class="like-card">
        <p style="padding: 10px">点赞量统计</p>
        <el-table
            :data="like_list"
            max-height="calc(100vh - 150px)"
            border
            style="width: 100%;overflow-y: auto">
            <el-table-column
                prop="primary_id"
                label="ID"
                sortable
                width="80"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="文章URL"
                sortable
                width="200">
            </el-table-column>
            <el-table-column
                sortable
                width="150"
                align="center"
                label="点赞数">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.like"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="handleUpdate(scope.$index, scope.row.name, scope.row.like)">更新</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row.name)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import api_dash from "../api/dashboard";
    export default {
        name: "Like_card",
        data(){
            return{
                like_list: []
            }
        },
        mounted() {
            this.get_like_list();
        },
        methods: {
            get_like_list(){
                this.$http.get(api_dash.like + "?name=all&type=data").then(res => {
                    if (res.data.data) {
                        this.like_list = res.data.data
                    }else {
                        this.$message.error("获取点赞列表失败");
                    }
                })
            },
            handleUpdate(index, name, count){
                this.$http.put(api_dash.like, {"name": name, "count": parseInt(count, 10),}).then(res => {
                    if (res.data.data && res.data.data === "success") {
                        this.$message.success("更新成功");
                        this.get_like_list();
                    }else {
                        this.$message.error("更新失败");
                    }
                })
            },
            handleDelete(index, name){
                this.$http.delete(api_dash.like, {data: {"name": name}}).then(res => {
                    if (res.data.data && res.data.data === "success") {
                        this.$message.success("删除成功");
                        this.get_like_list();
                    }else {
                        this.$message.error("删除失败");
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>