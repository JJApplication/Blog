<template>
    <div class="overview">
        <h2 @click="$router.push('/')">总览</h2>
        <div style="max-width: 960px;margin: 20px auto 0;">
            <el-row :gutter="10" style="margin-left: 0;margin-right: 0">
                <el-col>
                    <div class="grid-content">
                        <p style="color: #9f9f9f;">总体架构</p>
                        <img src="../assets/server.png">
                    </div>
                </el-col>
            </el-row>
            <p style="color: #9f9f9f;margin-top: 40px;margin-bottom: 20px">查看部分redis缓存是否命中</p>
            <el-button round @click="test">Test Redis</el-button>
            <el-dialog
                    title="缓存测试"
                    :visible.sync="dialogVisible"
                    class="dg">
                <span>测试文章pin</span>
                <p><span>缓存测试结果: </span><span style="color: red">{{hit}}</span></p>
                <p>自定义测试: /api/sys/checkredis?name=<span style="color:#4bff67;">文章地址</span></p>
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
              </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import api_statistic from "../api/statistic";
    export default {
        name: "overview",
        data(){
            return{
                dialogVisible: false,
                hit: ""
            }
        },
        methods:{
            test(){
                this.$http.get(api_statistic.api_statistic_check,{params:{"name":"pin"}}).then(res=>{
                    this.hit = res.data;
                    this.dialogVisible = true;
                }).catch(err=>{
                    this.hit = "error"
                })
            }
        }
    }
</script>

<style scoped>
    .overview {
        padding: 20px 10px;
    }
    img{
        max-width: 95%;
    }
    @media (max-width: 460px) {
        img{
            max-width: 100%;
        }
    }
    .overview /deep/ .dg{
        width: 60%;
        margin: 0 auto;
    }
    .overview /deep/ .el-dialog{
        width: 100%;
    }
    @media (max-width: 460px){
        .overview /deep/ .dg{
            width: 90%;
            margin: 0 auto;
        }
        .overview /deep/ .el-dialog{
            width: 100%;
        }
    }
    .overview .grid-content {
        padding: 10px 0;
        background-color: var(--post-background);
    }
</style>
<style>
    @import "../custom/custom.css";
</style>