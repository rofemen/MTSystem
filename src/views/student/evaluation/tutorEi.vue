<template>
  <div class="app-container" v-loading.body="loading" element-loading-text="拼命加载中">
      <div style="margin-left: 25px;margin-right: 30px;margin-top: 10px;line-height: 30px; color: #48576a;">
        <div >
          <div style="margin-bottom: 5px;font-weight: bold;font-size: 15px;border-bottom:1px solid rgb(238, 246, 244);color: #009751;">亲爱的同学：</div>
              <div style="">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                不断的提高教学质量，是您和我们共同的期盼，对辅导员，教官的授课和课程进行客观的、公正的评价，
                将有关的信息反馈到学校有关部门和院系，是提高教学质量的有效保证。
                请您给您所在班级的教师在教学方面的工作进行评价。
              </div>
              

        </div>
        <div style="margin-top:30px; border-bottom: 1px solid rgb(238, 246, 244);font-weight: bold;font-size: 15px;color: #009751;">导师信息</div>

        <div class="instorInfo" v-if="classInfo.tutor != undefined">
          <el-row>
            <el-col :span="8">系别/连队：{{ classInfo.dept.diName}}/{{classInfo.dept.company}}</el-col>
            <el-col :span="8">连排：{{classInfo.clRowname}}</el-col>
            <el-col :span="8">管理班级：{{classInfo.clName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">工号：{{classInfo.tutor.tcNum}}</el-col>
            <el-col :span="8"> 姓名：{{classInfo.tutor.tcName}}</el-col>
            <el-col :span="8">联系方式：{{classInfo.tutor.tcTel}}</el-col>
          </el-row>
        </div>
         <div v-if="classInfo.tutor == undefined" style="text-align: center;margin-top: 5px;">暂无导师信息</div>
        <div style="margin-top:30px;margin-bottom:15px; border-bottom: 1px solid rgb(238, 246, 244);font-weight: bold;font-size: 15px;color: #009751;">导师教学评价</div>
          <el-table
            :data="eiContent"
            border
            style="width: 100%">
            <el-table-column
              prop="type"
              label="评价类型"
              align="center" 
              width="180"
              ></el-table-column>
            <el-table-column
              prop="content"
              label="评价内容"
              ></el-table-column>
            <el-table-column
              label="评分"
              width="160"
              align="center" 
             >
              <template scope="scope">
                <el-input-number :disabled="tutorEi==1" size="mini" v-model="scope.row.eiValue" controls-position="right" @change="handleChange(scope.row.eiValue)" :min="1" :max="10">
                </el-input-number><!---->
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: right;padding-right: 30px;padding-top: 10px;font-weight: bold;">总评成绩：<span>{{total}}
          &nbsp</span>分</div>
            <div style="">
               <span style="vertical-align: top;font-weight: bold;">其它建议：</span>
               <el-input :disabled="tutorEi==1" type="textarea" v-model="otherAdvise" id="otherAdvise" style="width: 100%;height: 64px;"></el-input>
            </div>
      </div>
      <div style="text-align: right">
        <el-button :disabled="tutorEi==1" type="primary" class="submitButton"  @click="submit()">提交</el-button>
      </div>
  </div>
</template>

<script>
// import { getList } from 'api/article';
import {global} from 'src/global/global';
import {api} from 'src/global/api';
import { Message } from 'element-ui';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
        total: 50,
        loading: true,
        otherAdvise:"",
        classInfo:{tutor:{tcNum:0,tcName:"",tcTel:""},dept:{}},
        tutorEi:0,
        eiContent: [{
           type: '工作方面',
            content: '及时的通知学院下放的任务，同时讲任务合理的下放到班委手中',
            eiValue:5
          },{
            type: '生活方面',
            content: '生活方面时常关心班级同学，较全面的把握班级同学的家庭背景以及具体情况',
            eiValue:5
          },{
             type: '学习方面',
            content: '通过开班会等一系列的活动来调动班级的学习氛围',
            eiValue:5
          },{
             type: '学术竞赛方面',
            content: '积极鼓励班级同学参加本专业技能或非本专业技能的竞赛',
            eiValue:5
          },{
            type: '生活方面',
            content: '对有贫困家庭的同学，在不影响起日常生活的情况下重点关注',
            eiValue:5
          },{
             type: '学习方面',
            content: '对班级中经常挂科，成绩较差的同学进行督促指导',
            eiValue:5
          },{
             type: '工作方面',
            content: '定期开展班会，帮助同学们答疑解惑以及对学生行为规范的熟知程度',
            eiValue:5
          },{
             type: '学习方面',
            content: '军训期间，对学生的巡视情况以及学生身体素质的熟知程度',
            eiValue:5
          },{
             type: '学术竞赛方面',
            content: '对学生参与的专业知识竞赛方面提供了宝贵的指导',
            eiValue:5
          },{
             type: '生活方面',
            content: '了解教官和学生之间平时的关系以及亲密程度',
            eiValue:5
          }]

    }
  },
  mounted() {
    let vm = this;
    vm.getClassInfo();
    vm.tutorEi = vm.userInfo.stuTutorEi;
    if(vm.tutorEi == 1){
      vm.$notify({
          title: '教学评价通知',
          message: '本学期您已经对导师进行教学评价' //教学评价功能暂未开放，请等待开放后再进行评价操作
        });
    }

  },
  computed: {
        ...mapGetters({
            // 映射 this.personalInfo_init 为 store.getters.userInfo
            userInfo:'userInfo',
            userType:'userType',
        })
  },
  methods: {
    //获取列表数据
    getClassInfo() {
        let vm = this;
        global.post( api.selectByclCode,{clCode:vm.userInfo.stuClass},{header:{"Content-type":"application/json"}},function(res){
               var data = res.data;
               if(res.code == 200){ 
                    vm.classInfo = data.classInfo;
                    vm.loading = false;
               }else{
                    vm.loading = false;
                    Message({
                        showClose: true,
                        message: res.data.message,
                        type: 'error'
                    });
               }
        },function(res){
             vm.loading = false;
             Message({
                    showClose: true,
                    message: "服务器异常，请稍后重试",
                    type: 'error'
                });

        },false)

    },
    handleChange(value){
      let vm = this;
      vm.$nextTick(function(){
        vm.cacuTotal();
      })
      
    },
    cacuTotal(){
      let vm = this;
      var eiContent = vm.eiContent;
      var total = 0;
      for(var i = 0; i < eiContent.length;i++){
         total += vm.eiContent[i].eiValue;
      }
      vm.total = total;
    },
    submit(){
      let vm = this;
      if(vm.otherAdvise == ""){
        Message({
            showClose: true,
            message: "请输入其它建议",
            type: 'info'
        });
        return;
      }
      var evalution = {};
      evalution.eiPublisher = vm.$store.getters.userInfo.stuUserid;
      evalution.eiTarget = vm.classInfo.clTutor;
      evalution.eiTime = global.formatDate2(new Date().getTime());
      evalution.eiScore = vm.total;
      evalution.eiContent = vm.otherAdvise;
      global.post( api.addInstorEi,evalution,{header:{"Content-type":"application/json"}},function(res){
               var data = res.data;
               if(res.code == 200){ 
                    Message({
                        showClose: true,
                        message: data.message,
                        type: 'success'
                    });
                    vm.tutorEi = 1;
                    vm.loading = false;
                    vm.userInfo.stuTutorEi = 1
                    vm.$store.commit('SET_USERINFO', vm.userInfo);
                    vm.updateStudentInfo();
               }else{
                    vm.loading = false;
                    Message({
                        showClose: true,
                        message: data.message,
                        type: 'error'
                    });
               }
        },function(res){
             vm.loading = false;
             Message({
                    showClose: true,
                    message: "服务器异常，请稍后重试",
                    type: 'error'
                });

      },false)
    },
    updateStudentInfo(){
      let vm = this;
      var params = {stuUserid:vm.userInfo.stuUserid,stuTutorEi:1}
      global.post(api.updateStudentInfo,params,{header:{"Content-type":"application/json"}},function(res){
              var data = res.data;
              if(res.code == 200){
                Message({
                    showClose: true,
                    message:data.message,
                    type: 'success'
                }); 
                vm.listLoading = false;
              }else{
                 Message({
                    showClose: true,
                    message:data.message,
                    type: 'warning'
                }); 
                vm.listLoading = false;
              }
      },function(res){  
           Message({
                    showClose: true,
                    message: "服务器异常",
                    type: 'error'
           });
            vm.listLoading = false;
      },false);
    }
  }
};
</script>
<style>
  .instorInfo{margin-top: 5px;margin-bottom: 10px;}
  .instorInfo .title{font-weight: bolder;font-size: 15px;}
  .instorInfo .value{display:inline-block;width:27%;font-size: 15px;font-weight: bolder;}
  .el-input-number__decrease, .el-input-number__increase{line-height: 22px;height: 22px;font-size: 11px;}
  .el-input-number{width: 120px;}
  .submitButton{
    margin-top: 16px;
    margin-right: 30px;
    width: 100px;
  }

</style>