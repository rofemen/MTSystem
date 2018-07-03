<template>
<div v-cloak>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="课程名称" prop="ciName" >
            <el-col :span="6" >
                <el-input v-model="ruleForm.ciName" :disabled = "disabled"></el-input>
            </el-col>
      </el-form-item>
      <el-form-item label="课程类型" prop="ciType" title='由于指定专业技术科需要指定任课老师，所以此处不给予修改'>
        <el-radio-group v-model="ruleForm.ciType" :disabled="type == 'edit'||type == 'show'" >
          <el-radio :label="0">通用课</el-radio>
          <el-radio :label="1" :disabled ="type == 'add'">专业技术课</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="考试类型" prop="ciExam" >
        <el-radio-group v-model="ruleForm.ciExam" :disabled = "disabled">
          <el-radio :label="0" value="0">无考核</el-radio>
          <el-radio :label="1" value="1">笔试</el-radio>
          <el-radio :label="2" value="2">实操</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="开课时间" >
        <el-col :span="5" >
          <el-form-item prop="ciStarttime" >
            <el-date-picker type="date" :disabled="type != 'add'" placeholder="选择开课时间" v-model="ruleForm.ciStarttime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>  
      </el-form-item>

      <el-form-item label="课程时长" prop="ciTimelong">
            <el-col :span="5" >
                <el-select v-model="ruleForm.ciTimelong" placeholder="课程时长" :disabled = "disabled" >
                  <el-option v-for="item in timeLong" :key="item.value" :label="item.name" :value="item.value">
                    {{ item.name }}
                  </el-option>
                </el-select>
             </el-col>
      </el-form-item>
      
      <el-form-item label="授课位置" prop="ciExtra1">
            <el-col :span="5" >
                <el-select v-model="ruleForm.ciExtra1" placeholder="授课位置"  :disabled = "disabled">
                  <el-option v-for="item in tcPlace" :key="item.value" :label="item.name" :value="item.value">
                    {{ item.name }}
                  </el-option>
                </el-select>
             </el-col>
      </el-form-item>
      
      <el-form-item label="课程描述" prop="ciDes" style="margin-top:30px;">
            <el-col :span="10" >
                <el-input :disabled = "disabled" type="textarea" :rows="4" placeholder="关于这门课程....." v-model="ruleForm.ciDes"></el-input>
            </el-col>    
      </el-form-item>
      <el-form-item style="margin-top: 40px;">
        <el-button style="margin-right: 60px;" :disabled = "disabled" v-if="type=='show'">申请开课</el-button>
        <el-button type="primary" @click="undoApplyCourse()" v-if="type=='show'">撤销申报</el-button>
        <el-button style="margin-right: 60px;width: 100px;" type="primary" v-if="type=='edit'||type=='add'" @click="submitForm('ruleForm')">提交</el-button>
        <el-button style="width: 100px;" @click="backF()" v-if="type=='edit'||type=='add'">返回</el-button>
      </el-form-item>
    </el-form>
</div>
</template>
<script>
    import { Message } from 'element-ui';
    import {global} from 'src/global/global';
    import {api} from 'src/global/api';
    import { validatDate } from 'utils/validate';
    export default {
        data() {
          const validateEmail = (rule, value, callback) => {
            if (!validatDate(value)) {
              callback(new Error('请选择正确的开课时间'));
            } else {
              callback();
            }
          };
          return {
            disabled:true,
            type:"",
            ruleForm: {
              ciName: '',        
              ciStarttime:'', 
              ciTimelong: 5,
              ciDes: '',
              ciExam:0,
              ciType:0,
              ciTcnum:0,
              ciExtra1:"足球场"
            },
            timeLong:[{name:'五周',value:5},{name:'六周',value:6},{name:'七周',value:7},{name:'八周',value:8},{name:'九周',value:9},{name:'十周',value:10},{name:'十一周',value:11}],
            tcPlace:[{name:'足球场',value:'足球场'},{name:'新篮球场',value:'新篮球场'},{name:'旧篮球场',value:'旧篮球场'},{name:'千人大礼堂',value:'千人大礼堂'}],
            rules: {
              ciName: [
                { required: true, message: '请输入课程名称', trigger: 'blur' },
                { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
              ],
              ciDes: [
                 { required: true, required: true, message: '输入课程简述', trigger: 'blur' }
               ]
            }
          };
        },
        mounted() {
            var vm = this;
            console.log(vm.$route.query);
            if(vm.$route.query.courseInfo == undefined && vm.$route.query.type != 'add'){
              vm.$router.push({ path: '/course/courseInfo', query: {type:"add"} });
              return;
            }else{
              vm.type = vm.$route.query.type;
              if(vm.type == "edit"){
                if(vm.$route.query.courseInfo == undefined){
                  vm.disabled = false;
                }else{
                  vm.disabled = false;
                  vm.ruleForm = vm.$route.query.courseInfo;
                }
                
              }else if(vm.type == "add"){
                vm.disabled = false;
              }else{
                vm.ruleForm = vm.$route.query.courseInfo;
              }
            }
            
        },
        methods: {
           undoApplyCourse:function(){
              let vm = this;
              let ciCode = vm.ruleForm.ciCode;
              global.post(api.undoCourseApply,{ciCode:ciCode},null,function(res){
                        let data = res.data;
                        if(res.code == 200){
                          Message({
                              showClose: true,
                              message: data.message,
                              type: 'success'
                          })
                          vm.$router.push({ path: '/course/courseApply'});
                        }else{
                           Message({
                              showClose: true,
                              message: data.message,
                              type: 'error'
                          })
                        }
                    },function(){
                        Message({
                              showClose: true,
                              message: "服务器异常，请稍后重试",
                              type: 'error'
                          })
                    }) 
           },
           backF(){
             this.$router.back();
           },
           submitForm(formName) {
              let that = this;
              
              this.$refs[formName].validate((valid) => {
                if (valid) {
                  if(that.ruleForm.ciStarttime == ""){
                    that.$message.info("请选择正确的开课时间");
                    return;
                  }
                  var targetUrl = api.updateCourseInfo;
                    if(that.type == "add"){
                      targetUrl = api.addCourseInfo;
                      that.ruleForm.ciStatus = 1;
                    }
                    global.post(targetUrl,that.ruleForm,null,function(res){
                        let data = res.data;
                        if(res.code == 200){
                          Message({
                              showClose: true,
                              message: data.message,
                              type: 'success'
                          })
                          that.$router.push({ path: '/course/courseList'});
                        }else{
                           Message({
                              showClose: true,
                              message: data.message,
                              type: 'error'
                          })
                        }
                    },function(){
                        Message({
                              showClose: true,
                              message: "服务器异常，请稍后重试",
                              type: 'error'
                          })
                    }) 
                } else {
                  return false;
                }
              });
            },
            resetForm(formName) {
              this.$refs[formName].resetFields();
            }
        }
      }
</script>