<template>
  <div class="app-container" v-loading.body="loading" element-loading-text="拼命加载中">
      <div style="margin-left: 25px;margin-right: 30px;margin-top: 10px;line-height: 30px; color: #48576a;">
        <div >
          <div style="margin-bottom: 5px;font-weight: bold;font-size: 15px;border-bottom:1px solid rgb(238, 246, 244);color: #009751;">亲爱的同学：</div>
              <div style="">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                不断的提高教学质量，是您和我们共同的期盼，对辅导员，教官的授课和课程进行客观的、公正的评价，
                将有关的信息反馈到学校有关部门和院系，是提高教学质量的有效保证。
                请您给您所在班级的辅导员在教学方面的工作进行评价。
              </div>
              

        </div>
        <div style="margin-top:30px; border-bottom: 1px solid rgb(238, 246, 244);font-weight: bold;font-size: 15px;color: #009751;">教官信息</div>

        <div class="instorInfo" v-if="classInfo.armyInstor != undefined">
           <el-row>
            <el-col :span="8">系别/连队：{{ classInfo.dept.diName}}/{{classInfo.dept.company}}</el-col>
            <el-col :span="8">连排：{{classInfo.clRowname}}</el-col>
            <el-col :span="8">管理班级：{{classInfo.clName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">工号：{{classInfo.armyInstor.tcNum}}</el-col>
            <el-col :span="8"> 姓名：{{classInfo.armyInstor.tcName}}</el-col>
            <el-col :span="8">联系方式：{{classInfo.armyInstor.tcTel}}</el-col>
          </el-row>
        </div>
        <div v-if="classInfo.armyInstor == undefined" style="text-align: center;margin-top: 5px;">暂无教官信息</div>
        <div style="margin-top:30px;margin-bottom:10px; border-bottom: 1px solid rgb(238, 246, 244);font-weight: bold;font-size: 15px;color: #009751;">教学课程评价</div>
        <div style="margin-top:30px;margin-bottom:15px;padding-bottom: 10px; border-bottom: 1px solid rgb(238, 246, 244);font-weight: bold;font-size: 15px;color: #009751;vertical-align: top;">评价课程名称：
            <el-select v-model="courseItem" placeholder="请选择评价课程" style="width:160px;">
                <el-option
                  v-for="item in courseInfoList"
                  :key="item.siCourse.ciCode"
                  :label="item.siCourse.ciName"
                  :value="item.siCourse.ciCode">
                </el-option>
              </el-select>
        </div>
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
                <el-input-number :disabled="instorEi==1" size="mini" v-model="scope.row.eiValue" controls-position="right" @change="handleChange(scope.row.eiValue)" :min="1" :max="10">
                </el-input-number><!---->
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: right;padding-right: 30px;padding-top: 10px;font-weight: bold;">总评成绩：<span>{{total}}
          &nbsp</span>分</div>
            <div >
               <span style="vertical-align: top;font-weight: bold;">其它建议：</span>
               <el-input :disabled="instorEi==1" type="textarea" v-model="otherAdvise" id="otherAdvise" style="width: 100%;height: 64px;"></el-input>
            </div>
      </div>
      <div style="text-align: right">
        <el-button :disabled="instorEi==1" type="primary" class="submitButton"  @click="submit()">提交</el-button>
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
        classInfo:{armyInstor:{tcNum:0,tcName:"",tcTel:""},dept:{}},
        instorEi:0,
        courseInfoList: [],
        stuUserId:0,
        courseItem:"",
        eiContent: [{
           type: '教学态度',
            content: '遵守教学纪律，不擅自调课、停课，上课期间不随意接听电话或拨打手机',
            eiValue:5
          },{
            type: '教学态度',
            content: '上课期间精神饱满，充分有效利用上课时间',
            eiValue:5
          },{
             type: '教学态度',
            content: '督促同学们完成训练任务，对军训期学生出现的不规范的错误给予指导和修正',
            eiValue:5
          },{
             type: '教学态度',
            content: '经常与与学生交流，倾听学生意见和建议，及时改进训练方式和方法',
            eiValue:5
          },{
            type: '教学内容',
            content: '根据培养目标组织训练，训练内容符合大纲要求，重点突出，不随意减少训练内容',
            eiValue:5
          },{
             type: '教学内容',
            content: '不讲与训练内容或者能力培养无关的题外话，不随意传授与训练内容无关的内容',
            eiValue:5
          },{
             type: '教学方法',
            content: '训练言语规范，注重训练方式，能激发学生对训练内容的兴趣',
            eiValue:5
          },{
             type: '教学方法',
            content: '关注同学们在训练中的表链，维护训练中应有的秩序，学生训练出勤率高',
            eiValue:5
          },{
             type: '教学效果',
            content: '能够掌控训练课堂氛围，充分调动学生们的训练积极性',
            eiValue:5
          },{
             type: '教学效果',
            content: '教官训练有自己的特点，训练内容很受欢迎，学生吸收程度高',
            eiValue:5
          }]
    }
  },
  mounted() {
    let vm = this;
    vm.stuUserId = vm.userInfo.stuUserid;//vm.$store.getters.userInfo.tcUserid;
    vm.getClassInfo();
    if(vm.instorEi == 1){
      vm.$notify({
          title: '教学评价通知',
          message: '本学期您已经对辅导员进行教学评价' //教学评价功能暂未开放，请等待开放后再进行评价操作
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
                    vm.getTeachedCi();
                    vm.loading = false;
               }else{
                    vm.loading = false;
                    Message({
                        showClose: true,
                        message: res.data.message,
                        type: 'info'
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
    getTeachedCi() {
        let vm = this;
        var armyInstor = vm.classInfo.armyInstor;
        var stuId = vm.stuUserId;
        if(armyInstor == undefined){
           return;
        }
        global.post( api.getTeachedCi,{tcUserId:armyInstor.tcUserid,stuId:stuId},{header:{"Content-type":"application/json"}},function(res){
               var data = res.data;
               if(res.code == 200){ 
                  console.log(vm.courseInfoList);
                    vm.courseInfoList = data.list;
                    vm.loading = false;
               }else{
                    vm.loading = false;
                    Message({
                        showClose: true,
                        message: res.data.message,
                        type: 'info'
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
    submit(){
      let vm = this;
      console.log(vm.courseItem);
      if(vm.courseItem == ""){
        Message({
            showClose: true,
            message: "请选择评价课程",
            type: 'info'
        });
        return;
      }
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
      evalution.eiTarget = vm.classInfo.clArmyInstor;
      evalution.eiTime = global.formatDate2(new Date().getTime());
      evalution.eiScore = vm.total;
      evalution.eiContent = vm.otherAdvise;
      evalution.eiCiCode = vm.courseItem;
      global.post( api.addInstorEi,evalution,{header:{"Content-type":"application/json"}},function(res){
               var data = res.data;
               if(res.code == 200){ 
                    Message({
                        showClose: true,
                        message: data.message,
                        type: 'success'
                    });
                    //vm.instorEi = 1;
                    location.reload();
                    vm.loading = false;
               }else{
                    vm.loading = false;
                    Message({
                        showClose: true,
                        message: data.message,
                        type: 'info'
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
      console.log(value);
      let vm = this;
      vm.$nextTick(function(){
        vm.cacuTotal();
      })
      
    },
    cacuTotal(){
      let vm = this;
      var eiContent = vm.eiContent;
      var total = 0;
      console.log(eiContent);
      for(var i = 0; i < eiContent.length;i++){
         total += vm.eiContent[i].eiValue;
      }
      console.log(total);
      vm.total = total;
    }
  }
};
</script>
<style>
  .instorInfo{margin-bottom: 10px;font-weight: bolder;margin-left: 30px;}


  .el-input-number__decrease, .el-input-number__increase{line-height: 22px;height: 22px;font-size: 11px;}
  .el-input-number{width: 120px;}
  .submitButton{
    margin-top: 16px;
    margin-right: 30px;
    width: 100px;
  }

</style>