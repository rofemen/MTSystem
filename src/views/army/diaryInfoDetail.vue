<template>
  <div class="app-container">
    <div class="mainContainerDiary" v-loading.body="listLoading">
      <el-row  style="font-weight: bold;margin-top:25px;margin-bottom: 10px;border-bottom: 1px solid rgb(238, 246, 244);padding-bottom: 8px;font-size: 17px;text-align: center;">
        <span v-if="type=='add'||type=='edit'">
          标题：<el-input v-model="diaryInfo.diaryTitle" style ="display: inline-block;width: 240px;" placeholder="日记标题"></el-input>
        </span>
        <span v-if="type=='show'">
          {{diaryInfo.diaryTitle}}
        </span>
      </el-row>
      <el-row  style="line-height: 31px;padding-left: 30px;padding-right: 30px;">
        <span v-if="type=='show'">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{{diaryInfo.diaryContent}}</span>
        <span v-if="(type=='add'||type=='edit')">
          <el-input  type="textarea" v-model="diaryInfo.diaryContent" :rows="12" placeholder="日记内容..." id="shareContent" style="margin-top: 10px;"></el-input>
        </span>
      </el-row>
      <el-row  style="   text-align: right;padding-right: 40px;margin-top: 30px">
          <el-col :span="21" style="line-height: 36px;">
            <span v-if="(type=='add'||type=='edit')&& userType=='tc'">作者学号：</span>
            <span v-if="type=='show'">来自于：</span>
          </el-col>
          <el-col :span="3" style="text-align: left;">
           <span v-if="type=='show'" style="line-height: 36px;">
              {{diaryInfo.publicer.stuName}}
            </span>
            <span v-if="(type=='add'||type=='edit')&& userType=='tc'">
              <el-input v-model="diaryInfo.diaryPublicer"  style ="display: inline-block;width: 130px;" placeholder="学号"></el-input>
            </span>
          </el-col>
      </el-row>
      <el-row  style="   text-align: right;padding-right: 40px;padding-bottom: 40px;margin-top:10px;border-bottom: 1px solid rgb(238, 246, 244);">
        <el-col :span="21" style="line-height: 36px;">记录时间：</el-col><el-col :span="3" style="text-align: left;">
          <span v-if="type=='show'" style="line-height: 36px;">
              {{diaryInfo.diaryTime}}
            </span>
            <span v-if="type=='add'||type=='edit'">
              <el-date-picker type="date" style="width: 130px;vertical-align: middle;" format="yyyy-MM-dd" placeholder="选择日期" v-model="diaryInfo.diaryTime" ></el-date-picker>
            </span>

        </el-col>
      </el-row>
      <el-row style="text-align: right;margin-right: 80px;margin-top: 20px;margin-bottom: 20px;text-align: right;">
            <span v-if="type=='add'||type=='edit'" style="margin-right: 10px;">
              <el-button type="primary" style="width: 100px" @click="submit">提交</el-button>
            </span>
            <span>
              <el-button type="primary" style="width: 100px" @click="back">返回</el-button>
            </span>
      </el-row>
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
       diaryInfo:{
        diaryTime:"",
        diaryPublicer:"",
        diaryTitle:"",
        diaryContent:""
       },
       type:"add",
       listLoading:false
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
    if(vm.$route.query.diaryInfo == undefined){
      vm.type = "add";
    }else{
      vm.type = vm.$route.query.type;
      vm.diaryInfo.diaryId = vm.$route.query.diaryInfo.diaryId;
      vm.diaryInfo.diaryTime = vm.$route.query.diaryInfo.diaryTime;
      vm.diaryInfo.diaryPublicer = vm.$route.query.diaryInfo.diaryPublicer;
      vm.diaryInfo.diaryTitle = vm.$route.query.diaryInfo.diaryTitle;
      vm.diaryInfo.diaryContent = vm.$route.query.diaryInfo.diaryContent;
      vm.diaryInfo.publicer = vm.$route.query.diaryInfo.publicer;
    }
  },
  methods: {
    back(){
      this.$router.back();
    },
    submit(){
      let vm = this;
      if(vm.diaryInfo.diaryTitle == ''){
        vm.$message.info("请输入标题");
        return;
      }
      if(vm.diaryInfo.diaryContent == ''){
        vm.$message.info("请输入日记内容");
        return;
      }
      if(vm.userType == 'stu'){
        vm.diaryInfo.diaryPublicer = vm.userInfo.stuNum;
      }
      if(vm.diaryInfo.diaryPublicer == ''){
        vm.$message.info("作者学号");
        return;
      }
      vm.listLoading = true;
      global.post(api.getStudentInfoByStuNum,{num:vm.diaryInfo.diaryPublicer},{header:{"Content-type":"application/json"}},function(res){
               let data = res.data;
               if(res.code == 200){
                   vm.createOrUepdate();
               }else{
                   Message({
                        showClose: true,
                        message: "该作者学号不存在",
                        type: 'info'
                    });
                    vm.listLoading = false;
               }          
        },function(res){
            vm.listLoading = false;
            Message({
                        showClose: true,
                        message: "服务器异常，请稍后重试",
                        type: 'info'
                    });
        },false)
    },
    createOrUepdate() {
        let vm = this;
        var targetUrl = api.addDiaryInfo;

        if(vm.type == 'edit'){
          targetUrl = api.updateDiaryInfo
        }
        vm.listLoading = true;
        global.post(targetUrl,vm.diaryInfo,{header:{"Content-type":"application/json"}},function(res){
                let data = res.data;
               if(res.code == 200){
                    Message({
                        showClose: true,
                        message: data.message,
                        type: 'info'
                    });
                    setTimeout(function(){
                      vm.listLoading = false;
                      if(vm.userType == 'stu'){
                        vm.$router.push({ path:"/student/myDiaryList"});
                      }else{
                        vm.$router.push({ path:"/army/diaryList"});
                      }
                      
                    },1000);
                    
               }else{
                   Message({
                        showClose: true,
                        message: data.message,
                        type: 'info'
                    });
                    vm.listLoading = false;
               }          
        },function(res){
            vm.listLoading = false;
            Message({
              showClose: true,
              message: "服务器异常，请稍后重试",
              type: 'info'
            });
        },false)
    },
  }
};
</script>
<style type="text/css">
  .mainContainerDiary{
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