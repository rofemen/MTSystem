<template>
  <div class="app-container">
    <div class="changeMainContainer">
       <el-row>
          <el-col :span="4" style="text-align:right;height: 36px;line-height: 36px;font-weight: bold;">修改人身份：</el-col>
          <el-col :span="18">
            <el-select  placeholder="请选择" clearable style="width: 200px;" v-model="targetUserType">
                <el-option label="教官/教师" :key="1" :value="1"></el-option>
                <el-option label="学生" :key="2" :value="2"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="4"  style="text-align:right;height: 36px;line-height: 36px;font-weight: bold;">修改人的工号/学号：</el-col>
          <el-col :span="18">
            <el-input v-model="userNum" style ="display: inline-block;width: 200px;" placeholder="工号/学号"></el-input>
            <el-button type="primary" style="width: 100px;" @click="selectUserInfo">查询</el-button>
          </el-col>
        </el-row>

        <div v-loading.body="listLoading" style="margin-top: 30px;margin-bottom:20px;text-align: center;font-size: 15px;border-top: 1px solid rgb(238, 246, 244);padding-top: 20px;font-weight: bold;" v-if="!isExistUser">
          暂无该用户
        </div>
        <div  v-if="isExistUser" v-loading.body="listLoading" style="margin-top: 30px;margin-bottom:20px;border-top: 1px solid rgb(238, 246, 244);padding-top: 20px;font-weight: bold;">
          <el-row>
            <el-col :span="10"  style="text-align:right;height: 36px;line-height: 36px;font-weight: bold;">修改人的工号/学号：</el-col>
            <el-col :span="12" style="margin-top: 7px;">
              <span v-if="targetUserInfo.tcNum != undefined">{{targetUserInfo.tcNum}}</span>
              <span v-if="targetUserInfo.stuNum != undefined">{{targetUserInfo.stuNum}}</span>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;">
            <el-col :span="10"  style="text-align:right;height: 36px;line-height: 36px;font-weight: bold;">新密码：</el-col>
            <el-col :span="12">
              <el-input type="password" v-model="firstPassword" style ="display: inline-block;width: 200px;" placeholder="新密码"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px;">
          <el-col :span="10"   style="text-align:right;height: 36px;line-height: 36px;font-weight: bold;">再次输入新密码：</el-col>
          <el-col :span="12">
            <el-input type="password" v-model="secondPassword" style ="display: inline-block;width: 200px;" placeholder="再次输入新密码"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;text-align:center; ">
          <el-button type="primary" style="width: 100px;" @click="changePassword">提交</el-button> <el-button type="reset" style="width: 100px;">重置</el-button>
        </el-row>
        </div>
    </div>
  </div>
</template>

<script>
// import { getList } from 'api/article';
import {global} from 'src/global/global';
import {api} from 'src/global/api';
import { mapGetters } from 'vuex';
import { Message } from 'element-ui';
import md5 from 'blueimp-md5';
export default {
  data() {
    return {
       targetUserType:null,
       userNum:null,
       isExistUser:false,
       targetUserInfo:{},
       listLoading:false,
       firstPassword:"",
       secondPassword:""
    }
  },
  computed: {
        ...mapGetters({
            // 映射 this.personalInfo_init 为 store.getters.userInfo
            userType:'userType',
        })
  },
  mounted() {
    var vm = this;
    
  },
  methods: {
    selectUserInfo() {
        let vm = this;
        if(vm.targetUserType == null || vm.targetUserType == ""){
          vm.$message.info("请选择修改对象身份");
          return;
        }
        if(vm.userNum == null || vm.userNum == ""){
          vm.$message.info("请输入修改人的工号/学号");
          return;
        }
        if(!parseInt(vm.userNum) ){
           vm.$message.info("请正确输入人的工号/学号");
          return;
        }
        vm.listLoading = true;
        var targetUrl = api.getTeacherInfoByTcNum;
        if(vm.targetUserType == 2){
          targetUrl = api.getStudentInfoByStuNum;
        }
        
        global.post(targetUrl,{num:vm.userNum},{header:{"Content-type":"application/json"}},function(res){
               let data = res.data;
               if(res.code == 200){ 
                    vm.targetUserInfo = data.userInfo;
                    vm.isExistUser = true;
                    vm.listLoading = false;
               }else{
                    vm.isExistUser = false;
                    vm.targetUserInfo = {};
                    vm.listLoading = false;
                    Message({
                      showClose: true,
                      message: "暂无该用户",
                      type: 'info'
                    });
               }          
        },function(res){
            Message({
              showClose: true,
              message: "服务器异常，请稍后重试",
              type: 'error'
            });
            vm.listLoading = false;
        },false)
    },
    changePassword(){
      let vm = this; 
      if(vm.firstPassword==""){
        vm.$message.info("请输入新密码");
        return;
      }
      if(vm.firstPassword != vm.secondPassword){
        vm.$message.info("两次输入密码不一致，请重新输入");
        return;
      }
      vm.listLoading = true;
      var params = {};
      if(vm.targetUserInfo.tcNum != undefined){
        params.userType = "tc"
        params.newPassword = md5(vm.firstPassword);
        params.prePassword = vm.targetUserInfo.tcPassword;
        params.userName = vm.targetUserInfo.tcUsername;
        params.userId = vm.targetUserInfo.tcUserid;
      }else{
        params.userType = "stu"
        params.newPassword = md5(vm.firstPassword);
        params.prePassword = vm.targetUserInfo.stuPassword;
        params.userName = vm.targetUserInfo.stuUsername;
        params.userId = vm.targetUserInfo.stuUserid;
      }
      global.post(api.systemResetPassWord,params,{header:{"Content-type":"application/json"}},function(res){
               let data = res.data;
               if(res.code == 200){ 
                    vm.firstPassword = "";
                    vm.secondPassword ="";
                    Message({
                      showClose: true,
                      message: "重置密码成功",
                      type: 'info'
                    });
               }else{
                   Message({
                      showClose: true,
                      message: "重置密码失败，请稍后重试",
                      type: 'info'
                    });
               } 
                vm.listLoading = false;         
        },function(res){
            Message({
              showClose: true,
              message: "服务器异常，请稍后重试",
              type: 'error'
            });
            vm.listLoading = false;
        },false)
    }

  }
};
</script>
<style type="text/css">
  .changeMainContainer{
    width: 95%;
    margin-top:10px;
    margin-left: 2.5%;
    border:1px solid ;
    padding-top: 20px;
    padding-left: 25px;
    padding-bottom: 25px;
    padding-right: 45px;
    color: #48576a;
    border:1px solid rgb(238, 246, 244);
    border-radius: 4px;
    margin-bottom: 40px;
    box-shadow: 1px 1px 2px rgb(238, 246, 244);
  }
  
</style>