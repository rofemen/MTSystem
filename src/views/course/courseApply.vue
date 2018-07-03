<template>
<div v-cloak>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading.body="listLoading">
      <el-form-item label="课程名称" prop="ciName">
            <el-col :span="6" >
                <el-input v-model="ruleForm.ciName"></el-input>
            </el-col>
      </el-form-item>
      <el-form-item label="课程类型" prop="ciType" >
        <el-radio-group v-model="ruleForm.ciType" @change="getCiTypeForTcId">
          <el-radio label="0">通用课</el-radio>
          <el-radio label="1">专业技术课</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="考试类型" prop="ciExam">
        <el-radio-group v-model="ruleForm.ciExam">
          <el-radio label="0" value="0">无考核</el-radio>
          <el-radio label="1" value="1">笔试</el-radio>
          <el-radio label="2" value="2">实操</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="开课时间" >
        <el-col :span="5" >
          <el-form-item prop="ciStarttime" >
            <el-date-picker type="date" placeholder="选择开课时间" v-model="ruleForm.ciStarttime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>  
      </el-form-item>

      <el-form-item label="课程时长" prop="ciTimelong">
            <el-col :span="5" >
                <el-select v-model="ruleForm.ciTimelong" placeholder="课程时长"  >
                  <el-option v-for="item in timeLong" :key="item.value" :label="item.name" :value="item.value">
                    {{ item.name }}
                  </el-option>
                </el-select>
             </el-col>
      </el-form-item>

      <el-form-item label="授课位置" prop="ciExtra1">
            <el-col :span="5" >
                <el-select v-model="ruleForm.ciExtra1" placeholder="授课位置"  >
                  <el-option v-for="item in tcPlace" :key="item.value" :label="item.name" :value="item.value">
                    {{ item.name }}
                  </el-option>
                </el-select>
             </el-col>
      </el-form-item>
     
      
      <el-form-item label="课程描述" prop="ciDes" style="margin-top:30px;">
            <el-col :span="10" >
                <el-input type="textarea" :rows="4" placeholder="关于这门课程......" v-model="ruleForm.ciDes"></el-input>
            </el-col>    
      </el-form-item>
      <el-form-item style="margin-top: 40px;">
        <el-button style="margin-right: 60px;" type="primary" @click="submitForm('ruleForm')">申请开课</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
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
            ruleForm: {
              ciName: '',        
              ciStarttime:'', 
              ciTimelong: 5,
              ciStatus: 0,
              ciDes: '',
              ciExam:"0",
              ciType:"0",
              ciTcnum:0,
              ciExtra1:"足球场",
             
            },
            listLoading:false,
            timeLong:[{name:'五周',value:5},{name:'六周',value:6},{name:'七周',value:7},{name:'八周',value:8},{name:'九周',value:9},{name:'十周',value:10},{name:'十一周',value:11}]
            ,
            tcPlace:[{name:'足球场',value:'足球场'},{name:'新篮球场',value:'新篮球场'},{name:'旧篮球场',value:'旧篮球场'},{name:'千人大礼堂',value:'千人大礼堂'}],
            rules: {
              ciName: [
                { required: true, message: '请输入课程名称', trigger: 'blur' },
                { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
              ],
              ciStarttime: [
                 { type: 'date', message: '请选择正确的开课时间( > 今天)', trigger: 'change' ,validator:validateEmail }
              ],
              ciDes: [
                 { required: true, required: true, message: '输入课程简述', trigger: 'blur' }
               ]
            }
          };
        },
        mounted() {
            var vm = this;

            //修改时再调用
            //vm.getFormData();

        },
        methods: {
            //根据id查询表单数据
            getFormData:function(){
                var vm = this;
                var data = this.$route.query;
            },
            getCiTypeForTcId(item){
              let vm = this;
              if(item == 1){
                vm.ruleForm.ciTcnum = vm.$store.getters.userInfo.tcUserid;
              }else{
                vm.ruleForm.ciTcnum = 0;
              }
            }
            ,
            submitForm(formName) {
              let that = this;
              that.listLoading = true;
              this.$refs[formName].validate((valid) => {
                if (valid) {
                    global.post(api.addCourseInfo,that.ruleForm,null,function(res){
                        let data = res.data;
                        if(res.code == 200){
                          Message({
                              showClose: true,
                              message: data.message,
                              type: 'success'
                          })
                          setTimeout(()=>{
                              that.listLoading = false;
                              that.$router.push({ path: '/course/applySuccess', query: {courseInfo:data.courseInfo} });
                          },2000)
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

<style scoped>
[v-cloak] {
  display: none;
}
.component-item{
  margin-top: 100px;
}
.code-part{
  margin-top: 20px;
}
.demo-ruleForm{margin-top: 20px;margin-left: 20px;}
</style>
