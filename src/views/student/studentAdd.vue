<template>
  <div class="app-container">
    <!-- 搜索条件 -->

    <div class="filter-container">
      <div style="display: inline-block;height: 36px;line-height: 36px;color: rgb(72, 106, 95);font-weight: bold;">当前只支持excel文件的xls,xlsx后缀文件批量上传导入</div>
      <div style="float: right;">
      <a :href="downloadTemplate" style="color: #FFFFFF;"><el-button class="filter-item" type="primary" icon="document">导入模板下载</el-button></a>
      <el-button class="filter-item" type="primary" icon="document" @click="handleBatchUpload">学生信息批量导入</el-button>
    </div>
    </div>
    <!-- 表格 -->
    <div style="color: rgb(72, 106, 95);margin-top:10px;margin-bottom: 10px;font-weight: bold;">导入成功后的记录：</div>
    <el-table id = "listInfo" type="expand" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row  >

         <el-table-column type="expand">
          <template scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="连队">
                  <span>{{ scope.row.dept.company }}</span>
                </el-form-item>
                <el-form-item label="连排名">
                  <span>{{ scope.row.classInfo.clRowname }}</span>
                </el-form-item>

                <el-form-item label="出生日期">
                  <span>{{scope.row.stuBirthday}}</span>
                </el-form-item>
                <el-form-item label="邮箱">
                   <span>{{scope.row.stuEmail}}</span>
                </el-form-item>
                <el-form-item label="联系方式">
                   <span>{{ scope.row.stuTel }}</span>
                </el-form-item>
                <el-form-item label="总评成绩">
                  <span v-if="scope.row.stuFinalscore==-1">未评定</span>
                  <span v-if="scope.row.stuFinalscore < 60 && scope.row.stuFinalscore >= 0">
                    不及格（{{scope.row.stuFinalscore}}）
                  </span>
                  <span v-if="scope.row.stuFinalscore < 70 && scope.row.stuFinalscore >= 60">
                    及格（{{scope.row.stuFinalscore}}）
                  </span>
                  <span v-if="scope.row.stuFinalscore < 80 && scope.row.stuFinalscore >= 70">
                    C（{{scope.row.stuFinalscore}}）
                  </span>
                  <span v-if="scope.row.stuFinalscore < 90 && scope.row.stuFinalscore >= 80">
                    B（{{scope.row.stuFinalscore}}）
                  </span>
                  <span v-if="scope.row.stuFinalscore <= 100 && scope.row.stuFinalscore >= 90">
                    A（{{scope.row.stuFinalscore}}）
                  </span>
                </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column align="center"  label="学号" width="140px" sortable>
              <template scope="scope">
                <span>{{scope.row.stuNum}}</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="姓名" width="120px">
            <template scope="scope">
            {{scope.row.stuName}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="性别" width="90px">
            <template scope="scope">
              <span v-if="scope.row.stuSex == 0">男</span>
              <span v-if="scope.row.stuSex == 1">女</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="系别" >
            <template scope="scope">
              {{scope.row.dept.diName}}
            </template>
          </el-table-column>

          <el-table-column align="center"  label="班级" width="180">
            <template scope="scope">
              {{scope.row.classInfo.clName}}
            </template>
          </el-table-column>

          <el-table-column align="center"  label="联系方式">
            <template scope="scope">
              <span>{{scope.row.stuTel}}</span>
            </template>
          </el-table-column>
      
          <el-table-column align="center"  label="操作"  width="160px">
              <template scope="scope">
                 <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
          </el-table-column>
         
    </el-table>
    
    <!-- 新增弹窗 -->

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
          <el-form class="small-space"  label-position="left" label-width="90px">
              <el-row style="margin-top:10px;margin-bottom: 10px;">
                <span style="font-weight: bold;">温馨提示：</span><span>当前只支持excel文件的xls,xlsx后缀文件批量上传导入</span>
              </el-row>
              <el-row>
                <el-upload class="avatar-uploader"
                     action="http://localhost:8080/gp/stuUserController/batchUploadStuInfo"
                     :data = "uploadData"
                     ref="upload"
                     :on-success="handleAvatarSuccess"
                     :auto-upload="false"
                     :on-change="uploadChange"  
                     :before-upload="beforeAvatarUpload">
                  <el-button slot="trigger"  type="primary" @click="choiceFunc">选取文件</el-button>
                  <el-button style="margin-left: 10px;background:#009751;border-color: #009751;" type="success" @click="submitUpload">开始批量导入</el-button>
                </el-upload> 
              </el-row>
             <el-row class="resultMessageBox">
              <div v-if="resultMessage.length==0">
                <span  style="font-weight: bold;">批量添加结果显示：</span>
                <span>暂无操作记录</span>
              </div>
              <div v-if="resultMessage.length!=0">
                <div  style="font-weight: bold;">批量添加结果显示：</div>
                <div style="margin-left:10px;" v-for="item in resultMessage">{{item}}</div>
              </div>
              <div style="margin-top:5px;margin-bottom: 5px;">
                <span  style="font-weight: bold;">添加成功的记录数有：</span>
                <span>{{successCount}}</span>条
              </div>
             </el-row>
          </el-form>


            <el-row style="margin-top:60px;">
              <el-col style="width:50%" align="center"><el-button @click="dialogFormVisible = false">取 消</el-button></el-col>
              <el-col style="width:50%" align="center"><el-button type="primary" @click="handleCreateSubmit">完  成</el-button></el-col>
            </el-row>


    </el-dialog>

  </div>
</template>

<script>
// import { getList } from 'api/article';
import {global} from 'src/global/global';
import {api} from 'src/global/api';

import { Message } from 'element-ui';
import md5 from 'blueimp-md5';
export default {
  data() {
    return {
        list: null,//表格list [].push({})
        total: null,
        listLoading: false,
        listQuery: {
            currPage: 1,
            pageSize: 10,
        },
        total:0,
        downloadTemplate:api.downloadTemplateExcelStu,
        dialogFormVisible:false,
        dialogTitle:"学生信息批量导入",
        uploadData:{fileId:0},
        resultMessage:[],
        successCount:0,
        successNum:[],
        isChooice:false
    }
  },
  mounted() {
    let vm = this;
    vm.listLoading = false;
  },
  methods: {
    handleDownload() {
        let vm = this;
        
    },
    getList(){

    },
    choiceFunc(){
      this.isChooice = true;
    },
    //操作分页
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    //操作分页
    handleCurrentChange(val) {

      this.listQuery.currPage = val;
      this.getList();
    },
    //单个删除
    handleDelete(index,row){
        let vm = this;
        this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          global.post(api.delectStudentById,{stuUserid:row.stuUserid,stuClass:row.stuClass},{header:{"Content-type":"application/json"}},function(res){
            if(res.code == 200){ 
              vm.list.splice(index,1)
            }  
            Message({
                showClose: true,
                message: res.data.message,
                type: 'info'
              });     
          },function(res){  
             Message({
                      showClose: true,
                      message: "服务器异常",
                      type: 'error'
             });
          },false);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

    },
    handleBatchUpload(){
      let vm = this;
      vm.dialogFormVisible = true;
      vm.resultMessage = [];
      vm.successCount = 0;
      if(vm.$refs.upload != undefined){
        vm.$refs.upload.clearFiles();
      }
    },
    handleCreateSubmit(){
      let vm = this;
      vm.dialogFormVisible = false;
      vm.successCount = 0;
      if(vm.$refs.upload != undefined){
        vm.$refs.upload.clearFiles();
      }
    },
    uploadChange(file, fileList){
        var vm = this ;
        if(fileList.length>1){
          this.$message.info('最多只能上传1个文件');
          fileList.splice(1,1);
        }
    },
    beforeAvatarUpload(file) {
      let vm = this;
      var fileName = file.name;
      var isExcel = true;
      if(fileName.indexOf("xlsx") == -1 && fileName.indexOf("xls") == -1 ){
        isExcel = false;
         Message({
                showClose: true,
                message: "上传失败，文件格式占时只支持xlsx,xls格式的文件",
                type: 'info'
        });
      }
      vm.uploadData.fileId = file.uid;
      vm.uploadData.roleType = 1;
      vm.isChooice = false;
      return isExcel;
    },
    submitUpload() {
      let vm = this;
      if(!vm.isChooice){
        vm.$message.info("请选择上传文件");
        return;
      }
      vm.listLoading = true;
      this.$refs.upload.submit();
    },
    handleAvatarSuccess(res, file){
      let vm = this;
      console.log(res);
      if(res.code == 200){
        var data = res.data;
        vm.resultMessage = [];
        for(var item in data){
          vm.resultMessage.push(data[item]);
        }
        vm.successCount = res.successCount;
        vm.successNum =  res.successNum
        vm.getBatchSuccessNum(vm.successNum);
        vm.listLoading = false;
      }else{
        vm.resultMessage.push("上传文件内容格式错误，请参考模板");
        vm.successCount = res.successCount;
        vm.successNum = [];
        vm.listLoading = false;
      }
      if(vm.$refs.upload != undefined){
        vm.$refs.upload.clearFiles();
      }
    },
    getBatchSuccessNum(successNum){
      let vm = this;
      vm.listLoading = true;
      if(successNum == null || successNum.length == 0){vm.listLoading = false; return;}
      global.post(api.getBatchStuInfo,{stuNumList:successNum},{header:{"Content-type":"application/json"}},function(res){
          if(res.code == 200){
            let data = res.data;
            vm.list = data.list;
            vm.listLoading = false;
          }else{
            let data = res.data;
            vm.list = [];
            vm.listLoading = false;
          }
          
      },function(res){
          vm.listLoading = false;
      },false)
    }
  }
};
</script>
<style type="text/css">
  .filter-container{
    
  }
  .resultMessageBox{
    margin-top: 20px;
    margin-bottom: 10px;
    background: rgb(238, 246, 244);
    min-height: 120px;
    padding-top: 10px;
    padding-left: 8px;
    border-radius: 8px;
  }
    .demo-table-expand {
    font-size: 0;
    margin: auto;
  }
  .demo-table-expand label {
    width: 90px;
    color: #009751;
    text-align:right;
    margin-left: 10px;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 32%;

  }

  .el-form--inline .el-form-item__label {text-align: right;}
  .el-table__header tr{height: 70px;font-size: 15px;}
  .el-table__body-wrapper tr{height: 45px;font-family: 微软雅黑;font-weight: bold;}
  .app-container{height: 100%;}
</style>