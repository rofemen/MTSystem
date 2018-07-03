<template>
  <div class="app-container">
    <div class="mainContainer1">
       <el-row  style="font-weight: bold;margin-top:25px;margin-bottom: 10px;border-bottom: 1px solid rgb(238, 246, 244);padding-bottom: 5px;font-size: 15px;">
          <el-col :span="2" style="text-align: right;">主&nbsp&nbsp&nbsp题：</el-col><el-col :span="20">{{emailDetail.emTheme}}</el-col></el-row>
       <el-row style="font-size: 12px;color: #999;margin-bottom: 10px;">
        <el-col :span="2" style="text-align: right;">发件人：</el-col>
        <el-col :span="20">{{emailDetail.senderName}}(
          <span v-if="senderType=='tc'">教师&nbsp&nbsp&nbsp工号为：{{emailDetail.emSender}}</span>
          <span v-if="senderType=='stu'">学生&nbsp&nbsp&nbsp学号为：{{emailDetail.emSender}}</span>
          )
        </el-col>
       </el-row>
       <el-row style="font-size: 12px;color: #999;margin-bottom: 10px;"><el-col :span="2" style="text-align: right;">时&nbsp&nbsp&nbsp间：</el-col><el-col :span="20">{{emailDetail.emTime}}</el-col>
       </el-row>
       <el-row style="font-size: 12px;color: #999;margin-bottom: 10px;border-bottom: 1px solid rgb(238, 246, 244);padding-bottom: 10px;"><el-col :span="2" style="text-align: right;">收件人：</el-col><el-col :span="20">
        {{emailDetail.receiverName}}(
          <span v-if="receiveType=='tc'">教师&nbsp&nbsp&nbsp工号为：{{emailDetail.emReceiver}}</span>
          <span v-if="receiveType=='stu'">学生&nbsp&nbsp&nbsp学号为：{{emailDetail.emReceiver}}</span>
          )
        </el-col></el-row>

       <el-row style="margin-bottom: 10px;line-height: 30px;border-bottom: 1px solid rgb(238, 246, 244);padding-bottom: 55px;"><el-col :span="2" style="text-align: right;font-size: 15px;font-weight: bold;">内&nbsp&nbsp&nbsp容：</el-col>
        <el-col :span="20" style="font-size: 14px;font-weight: bold;margin-top: 2px;">{{emailDetail.emContent}}</el-col>
      </el-row>
      <el-row style="text-align: right;margin-right: 120px;margin-top: 20px;margin-bottom: 20px;"><el-button type="primary" style="width: 100px" @click="back">返回</el-button></el-row>
      
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
       emailDetail:{},
       senderType:"",
       receiveType:""
    }
  },
  computed: {
        ...mapGetters({
            // 映射 this.personalInfo_init 为 store.getters.userInfo
            userInfo:'userInfo',
            userType:'userType',
        })
  },
  mounted() {
    var vm = this;
    if(vm.$route.query.emailDetail == undefined){
      vm.$router.push({ path:"/index/myEmail"});
      return;
    }else{
      vm.emailDetail = vm.$route.query.emailDetail;
      var type = vm.emailDetail.emType;
      var types = type.split("-");
      vm.senderType = types[0];
      vm.receiveType = types[1];
    }
  },
  methods: {
    back(){
      this.$router.back();      
    }
  }
};
</script>
<style type="text/css">
  .mainContainer1{
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
    margin-bottom: 20px;
    box-shadow: 1px 1px 2px rgb(238, 246, 244);
  }
  
</style>