<template>
  <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="8">
                
                <div class="user_img" >
                    
                    <img v-if="newImageUrl" :src="newImageUrl" alt="用户头像" >
                    <img v-else :src="userIcon" alt="用户头像" >
                    
                    <el-upload class="avatar-uploader"
                     action="http://localhost:8080/gp/commonController/uploadStuIcon"
                     :data = "uploadData"
                     ref="upload"
                     :on-success="handleAvatarSuccess"
                     :auto-upload="true"
                     :before-upload="beforeAvatarUpload">
                     <button type="button" class="el-button filter-item el-button--primary" style="margin-top:10px">
                            <i class="fa fa-cloud-upload" aria-hidden="true"></i><span>上传头像</span>
                        </button>
                       
                    </el-upload>

                </div>
                
            </el-col>

            <el-col :span="16">
                <div class="user_info">
                    <h2>个人信息 </h2>
                    <div class="user_info_form" v-if="editable">

                        <el-form label-position="right" label-width="100px" :model="personalInfo">

                              <el-form-item label="昵称">
                                <el-input v-model="personalInfo.tcName"></el-input>
                              </el-form-item>
                              <el-form-item label="真实姓名">
                                <el-input v-model="personalInfo.tcName"></el-input>
                              </el-form-item>
                              <el-form-item label="性别">
                                    <el-radio-group v-model="personalInfo.sex">
                                          <el-radio label="0">男</el-radio>
                                          <el-radio label="1">女</el-radio>
                                    </el-radio-group>
                              </el-form-item>
                              <el-form-item label="邮件地址" >
                                <el-input v-model="personalInfo.tcEmail" disabled=""></el-input>

                              </el-form-item>
                              <el-form-item label="个人简介">
                                <el-input type="textarea" v-model="personalInfo.introduction"></el-input>
                              </el-form-item>

                              <el-form-item>
                                 <el-button type="primary" @click="submitForm()">提交</el-button>
                                 <el-button @click="resetForm()">取消</el-button>
                               </el-form-item>

                        </el-form>

                    </div>

                    <div class="user_info_text" v-else>
                        <el-form label-position="right" label-width="100px" :model="userInfo">
                              <el-row v-if="userType=='stu'">
                              <el-col :span="10">
                                <el-form-item label="系别/连队：">
                                {{ userInfo.dept.diName}}/{{userInfo.dept.company}}
                                </el-form-item>
                              </el-col> 
                             
                              <el-col :span="10">
                                <el-form-item label="班级/排号：">
                                {{ userInfo.classInfo.clName}}/{{userInfo.classInfo.clRowname}}</el-form-item>
                              </el-col> 
                            </el-row>

                            <el-row>
                              <el-col :span="10">
                                <el-form-item v-if="userType == 'tc'" label="工号：">
                                {{ userInfo.num}}
                                </el-form-item>
                                <el-form-item v-if="userType == 'stu'" label="学号：">
                                {{ userInfo.num }}</el-form-item>
                              </el-col> 
                            <el-col :span="10">
                                <el-form-item label="身份：">
                                  <span v-if="userInfo.role == '0'">管理员</span>
                                  <span v-else-if="userInfo.role == '1'">教官</span>
                                  <span v-else-if="userInfo.role == '2'">导师</span>
                                  <span v-else>学生</span>
                                </el-form-item>
                              
                              </el-col> 
                            </el-row>

                            <el-row v-if="userType == 'stu'">
                              <el-col :span="10">
                                <el-form-item label="辅导员：">
                                  <span v-if="userInfo.classInfo.instor == undefined">无</span>
                                  <span v-else>{{userInfo.classInfo.instor.tcName}}</span>
                                </el-form-item>
                              </el-col> 
                              <el-col :span="10">
                                <el-form-item label="教官：">
                                  <span v-if="userInfo.classInfo.armyInstor == undefined">无</span>
                                  <span v-else>{{userInfo.classInfo.armyInstor.tcName}}</span>
                                </el-form-item>
                              </el-col> 
                            </el-row>

                            <el-row>
                              <el-col :span="10">
                                <el-form-item label="姓名：">
                                {{ userInfo.realName }}
                              </el-form-item>
                              </el-col> 
                            <el-col :span="10">
                              <el-form-item label="性别：">
                                <span v-if="userInfo.sex == '0'">男</span>
                                <span v-else>女</span>
                              </el-form-item>
                              </el-col> 
                            </el-row>
                              
                            <el-row>
                              <el-col :span="10">
                                <el-form-item label="邮件地址：">
                                {{ userInfo.email }}
                                </el-form-item>
                              </el-col> 
                            <el-col :span="10">
                                <el-form-item label="联系方式：">
                                 {{ userInfo.tel }}
                                </el-form-item>
                             
                              </el-col> 
                            </el-row>
                            <el-row  v-if="userType == 'stu'">
                              <el-col :span="10">
                                <el-form-item label="军训成绩：">
                                  <span v-if="userInfo.stuFinalscore==-1">未评定</span>
                                  <span style="color: red;" v-if="userInfo.stuFinalscore < 60 && userInfo.stuFinalscore >= 0">
                                    不及格（{{userInfo.stuFinalscore}}分）
                                  </span>
                                  <span v-if="userInfo.stuFinalscore < 70 && userInfo.stuFinalscore >= 60">
                                    及格（{{userInfo.stuFinalscore}}）
                                  </span>
                                  <span v-if="userInfo.stuFinalscore < 80 && userInfo.stuFinalscore >= 70">
                                    C（{{userInfo.stuFinalscore}}）
                                  </span>
                                  <span v-if="userInfo.stuFinalscore < 90 && userInfo.stuFinalscore >= 80">
                                    B（{{userInfo.stuFinalscore}}）
                                  </span>
                                  <span v-if="userInfo.stuFinalscore <= 100 && userInfo.stuFinalscore >= 90">
                                    A（{{userInfo.stuFinalscore}}）
                                  </span>
                                </el-form-item>
                              </el-col> 
                            
                            </el-row>
                        </el-form>
                    </div>
                </div>

            </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top:20px;">
            <el-col :span="8">
                <div id="income">
                  
                </div>
            </el-col>

            <el-col :span="12">
                <div id="interest">
                  
                </div>
            </el-col>

        </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {global} from 'src/global/global';
import {api} from 'src/global/api';
import { Message } from 'element-ui';

var echarts = require('echarts');

export default {
  data() {
    return {
        uploadData:{},
        editable:false,
        newImageUrl: '',
        userIcon:'',
        userInfo:{dept:{},classInfo:{instor:{},tutor:{}}}
        //personalInfo_init:store.getters.userInfo //115行相当于这个效果
    }
  },
  computed: {
        ...mapGetters({
            // 映射 this.personalInfo_init 为 store.getters.userInfo
            personalInfo:'userInfo',
            userType:'userType',
        })
    },
  mounted() {
        var vm = this;
        var userType = vm.userType;
        console.log("personalInfo",vm.personalInfo);
        if(userType == "tc"){
          vm.uploadData.userId = vm.personalInfo.tcUserid;
          vm.uploadData.role = vm.personalInfo.tcRole;
          vm.userIcon = api.tcIconBaseUrl + vm.personalInfo.tcExtra1+"?time="+new Date().getTime();
          vm.userInfo.realName = vm.personalInfo.tcName;
          vm.userInfo.num = vm.personalInfo.tcNum;
          vm.userInfo.tel = vm.personalInfo.tcTel;
          vm.userInfo.sex = vm.personalInfo.tcSex;
          vm.userInfo.email = vm.personalInfo.tcEmail;
          vm.userInfo.role = vm.personalInfo.tcRole
        }else{
          vm.uploadData.userId = vm.personalInfo.stuUserid;
          vm.uploadData.role = vm.personalInfo.stuRole
          vm.userIcon = api.stuIconBaseUrl + vm.personalInfo.stuExtra1;
          vm.userInfo.realName = vm.personalInfo.stuName;
          vm.userInfo.num = vm.personalInfo.stuNum;
          vm.userInfo.tel = vm.personalInfo.stuTel;
          vm.userInfo.sex = vm.personalInfo.stuSex;
          vm.userInfo.email = vm.personalInfo.stuEmail;
          vm.userInfo.role = vm.personalInfo.stuRole
          vm.userInfo.clTutor = vm.personalInfo.clTutor
          vm.userInfo.instor = vm.personalInfo.instor
          vm.userInfo.tutor = vm.personalInfo.tutor
          vm.userInfo.classInfo = vm.personalInfo.classInfo
          vm.userInfo.stuFinalscore = vm.personalInfo.stuFinalscore
        }

        vm.userInfo.dept = vm.personalInfo.dept;
        vm.uploadData.userType = userType;
        vm.resetForm();

        // 基于准备好的dom，初始化echarts实例
        var myChart1 = echarts.init(document.getElementById('income'));
        var myChart2 = echarts.init(document.getElementById('interest'));
        // 绘制收入图表
        myChart1.setOption({
            title: { text: '最近工作时数' },
            tooltip: {},
            xAxis: {
                data: ["7月","8月","9月","10月","11月","12月"]

            },
            yAxis: {},
            series: [{
                name: '收入',
                type: 'bar',
                data: [220, 200,190, 250, 266, 276]
            }]
        });
        // 绘制兴趣图表
        myChart2.setOption({
            title: { text: '兴趣爱好' },
            series : [
                {
                    name: '兴趣',
                    type: 'pie',
                    radius: '55%',
                    data:[
                        {value:450, name:'代码'},
                        {value:250, name:'睡觉'},
                        {value:100, name:'出门'},
                        {value:100, name:'学校事情'},
                        {value:50, name:'其他'}
                    ]
                }
            ]
        })

   },
  methods: {
    //提交表单
    submitForm() {
        var vm = this;
        vm.editable = false;
        var par = {
            "account":  vm.personalInfo.account,
            "nickname": vm.personalInfo.nickname,
            "trueName": vm.personalInfo.trueName,
            "sex": vm.personalInfo.sex,
            "email": vm.personalInfo.email,
            "introduction": vm.personalInfo.introduction,
        };

        console.log('修改信息入参为：',par)
    },
    //重置表单
    resetForm() {
        var vm = this;
        vm.editable = false;
        console.log(vm.personalInfo);
    },
    //上传头像
    uploadAvatar(){
        alert('稍后补上')
    },

    handleAvatarSuccess(res, file) {
       let vm = this;
       console.log(res);
       var data = res.data;
       if(res.code == 200){
          Message({
            showClose: true,
            message: data.message,
            type: 'info'
          });
          vm.newImageUrl = URL.createObjectURL(file.raw);
          var src = $("#userIconId").attr("src");
          $("#userIconId").attr("src",URL.createObjectURL(file.raw));

       }else{
          Message({
            showClose: true,
            message: data.message,
            type: 'info'
          });
       }
      
       

    },
    beforeAvatarUpload(file) {
       const isJPG = file.type === 'image/jpeg';
       const isLt2M = file.size / 1024 / 1024 < 2;

       if (!isJPG) {
         this.$message.error('上传头像图片只能是 JPG 格式!');
       }
       if (!isLt2M) {
         this.$message.error('上传头像图片大小不能超过 2MB!');
       }
       return isJPG && isLt2M;
    },
    submitUpload() {
      this.$refs.upload.submit();
    }

  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .user_img{
        /*width: 80%;*/
        padding: 20px;
        text-align: center;
        border: 1px solid #dee1e2;
        img{
            width: 150px;
            height: 150px;
            border-radius: 50%;
        }
    }
    .user_info{
        /*padding-bottom: 20px;*/
        border: 1px solid #dee1e2;
        h2{
            margin: 0;
            font-weight: bold;
            color: #48576a;
            font-size: 17px;
            padding: 10px 20px;
            border-bottom: 1px solid #dee1e2;
            .i_edit{
                float: right;
                font-size: 16px;
                color: #7ab8ed;
            }
        }
    }
    .user_info_form,.user_info_text{
        padding: 20px;
    }
    #income,#interest{
        width: 100%;
        height: 400px;
    }

    .el-form-item{
      margin-bottom: 0;
    }
    .avatar-uploader{
      margin-bottom: 32px;
    }
</style>
