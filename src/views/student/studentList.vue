<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 160px;margin-right: 5px;" class="filter-item" placeholder="姓名" v-model="listQuery.name">
      </el-input>
      <el-select clearable class="filter-item"  style="width: 130px;margin-right: 5px;" v-model="listQuery.deptValue" placeholder="连队">
        <el-option v-for="item in  typeOptions" :key="item.diId" :label="item.company" :value="item.diId">
           <span style="float: left;font-family: 微软雅黑; font-size: 12px;">{{ item.company }}</span>
          <span style="float: right; color: #8492a6; font-size: 12px">{{ item.diName }}</span>

        </el-option>
      </el-select>
      <el-button class="filter-item"  type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate"  icon="edit">添加</el-button>

      <el-button class="filter-item" type="primary" @click="handleDelAll"  icon="edit">批量删除</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>
    <!-- 表格 -->
    <el-table id = "listInfo" type="expand" @selection-change="handleSelectionChange" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row  >

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
        <el-table-column align="center" type="selection" width="65">
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
                  
                 <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                 <el-button size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                       
              </template>
          </el-table-column>
         
    </el-table>
    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currPage"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
          <el-form class="small-space" :model="temp" label-position="left" label-width="90px">

                <el-row>  
                  <el-col :span="10" >
                    <el-form-item label="学号:" style="margin-left: 28px"  label-width="60px" required>
                      <el-input v-model="dialogFormData.stuNum" :disabled="operateSignal == 'edit'" placeholder="学号" style ="display: inline-block;width: 120px;">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" >
                    <el-form-item label="系别/连队:"  label-width="95px" required>
                            <el-select clearable class="filter-item"  style="width: 130px;margin-right: 5px;" v-model="dialogFormData.stuDeptid" placeholder="连队" @change="stuDepartmentChange">
                            <el-option v-for="item in  typeOptions" :key="item.diId" :label="item.company" :value="item.diId">
                               <span style="float: left;font-family: 微软雅黑; font-size: 12px;">{{ item.company }}</span>
                              <span style="float: right; color: #8492a6; font-size: 12px">{{ item.diName }}</span>
                            </el-option>
                          </el-select>
                    </el-form-item>
                  </el-col>
                 </el-row>
                <el-row>  
                  <el-col :span="10" >
                    <el-form-item label="姓名:" style="margin-left: 28px"  label-width="60px" required>
                        <el-input v-model="dialogFormData.stuName" style ="display: inline-block;width: 120px;" placeholder="姓名"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" >
                    <el-form-item label="性别:"  label-width="60px" required style="margin-left: 35px">
                            <el-select  placeholder="性别" style="width: 80px;" v-model="dialogFormData.stuSex">
                              <el-option label="男" :key="0" :value="0"></el-option>
                              <el-option label="女" :key="1" :value="1"></el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                 </el-row>
                 <el-row>  
                  <el-col :span="10" >
                    <el-form-item label="年级:" clearable label-width="60px" style="margin-left: 28px"required>
                            <el-select  placeholder="年级" style="width: 100px;" v-model="dialogFormData.stuGrade" @change="clGradeChange">
                              <el-option label="2014级" :key="2014" :value="2014"></el-option>
                              <el-option label="2015级" :key="2015" :value="2015"></el-option>
                              <el-option label="2016级" :key="2016" :value="2016"></el-option>
                              <el-option label="2017级" :key="2017" :value="2017"></el-option>
                              <el-option label="2018级" :key="2018" :value="2018"></el-option>
                              <el-option label="2019级" :key="2019" :value="2019"></el-option>
                            </el-select>
                    </el-form-item>
                  
                  </el-col>
                  <el-col :span="10" >
                    <el-form-item label="班级/排:"  label-width="80px" style="margin-left: 15px" required>
                            <el-select  placeholder="班级/排" style="width: 160px;" v-model="dialogFormData.stuClass">
                            <el-option v-for="item in  classList" :key="item.clCode" :label="item.clName" :value="item.clCode">
                               <span style="float: left;font-family: 微软雅黑; font-size: 12px;">{{ item.clName }}</span>
                              <span style="float: right; color: #8492a6; font-size: 12px">{{ item.clRowname }}</span>
                            </el-option>
                            </el-select>
                    </el-form-item>
                  
                  </el-col>
                 </el-row>    
            
            <el-form-item label="联系方式:"  label-width="85px" required>
              <el-input style="width: 200px;" placeholder="联系方式" v-model="dialogFormData.stuTel"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱:"  label-width="85px" required>
              <el-input style="width: 200px;" placeholder="电子邮箱" v-model="dialogFormData.stuEmail"></el-input>
            </el-form-item>
            <el-form-item label="出生年月:" label-width="85px" required>
                  <el-date-picker type="date" placeholder="选择日期" v-model="dialogFormData.stuBirthday" style="width: 200px;"></el-date-picker>
                 </el-form-item> 
            </el-form-item>     
          </el-form>


            <el-row style="margin-top:60px;">
              <el-col style="width:50%" align="center"><el-button @click="dialogFormVisible = false">取 消</el-button></el-col>
              <el-col style="width:50%" align="center"><el-button type="primary" @click="handleCreateSubmit">确 定</el-button></el-col>
            </el-row>


    </el-dialog>

  </div>
</template>

<script>
import {global} from 'src/global/global';
import {api} from 'src/global/api';
import { Message } from 'element-ui';
import md5 from 'blueimp-md5';

export default {
  components: {
　　
},
  data() {
    return {
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
            currPage: 1,
            pageSize: 10,
            deptValue:"",
            name:"",         
        },
        dialogFormData :{
          stuNum:"",
          stuSex:null,
          stuName:"",
          stuTel:"",
          stuEmail:"",
          stuBirthday:"",
          stuDeptid:"",
          stuGrade:"",
          stuClass:""
        },
        operateSignal:"add",
        temp: {
          "chnlId": "",
          "hisChnlId": "",
          "chnlName": "",
          "state": "",
          "isavailable": "",
          "orderNum": 10
        },
        dialogFormVisible: false,
        multipleSelection: [],
        dialogTitle:"添加学生信息",
        forClassList:{
          clGrade:0,
          clDpId:0
        },
        classList:[],
        typeOptions:[]
    }
  },
  mounted() {
    let vm = this;
    vm.getList();
    vm.getDeptInfo();
    vm.getClassInfo();
  },
  methods: {
    initTemp(){
      let vm = this;
      vm.dialogFormData = {
          stuNum:"",
          stuSex:null,
          stuName:"",
          stuTel:"",
          stuEmail:"",
          stuBirthday:"",
          stuDeptid:"",
          stuGrade:"",
          stuClass:""
      }
    },
    //获取列表数据
    getList() {
        let vm = this;
        vm.listLoading = true;
        global.post(api.getAllStuInfo,vm.listQuery,{header:{"Content-type":"application/json"}},function(res){
                let data = res.data;
               if(res.code == 200){ 
                    vm.list = data.list;
                    console.log(vm.list);
                    vm.listQuery.currPage = data.currPage;
                    vm.listQuery.pageSize = data.pageSize;
                    vm.total = data.totalSize;
                    vm.listLoading = false;
               }else{
                   Message({
                        showClose: true,
                        message: data.message,
                        type: 'info'
                    });
                    vm.list = null;
                    vm.listLoading = false;
               }          
        },function(res){
            
            vm.listLoading = false;
        },false)


    },
    //获取连队信息
    getDeptInfo(){
        let vm = this;
         global.post(api.getAllDeptInfo,{},{header:{"Content-type":"application/json"}},function(res){
                let data = res.data;
               if(res.code == 200){ 
                  vm.typeOptions = data.list;
               }else{
                    Message({
                        showClose: true,
                        message: data.message,
                        type: 'info'
                    });
               }
        },function(res){  
             Message({
                      showClose: true,
                      message: "服务器异常",
                      type: 'error'
             });
        },false)

    },
    //获取班级
    getClassInfo(){
        let vm = this;
         global.post(api.getAllClassInfoForAdd,vm.forClassList,{header:{"Content-type":"application/json"}},function(res){
                let data = res.data;
               if(res.code == 200){ 
                  vm.classList = data.list;
                  console.log("vm.classList",vm.classList);
               }else{
                    Message({
                        showClose: true,
                        message: data.message,
                        type: 'info'
                    });
               }
        },function(res){  
             Message({
                      showClose: true,
                      message: "服务器异常",
                      type: 'error'
             });
        },false)
    },
    clGradeChange(val){
      let vm = this;
      vm.forClassList.clGrade = val;
      vm.getClassInfo();
      vm.dialogFormData.stuClass = "";
    },
    stuDepartmentChange(val){
      let vm = this;
      vm.forClassList.clDpId = val;
      vm.getClassInfo();
      vm.dialogFormData.stuClass = "";
    }
    ,
    //编辑
    handleEdit(index,row){
        let vm = this;
        vm.initTemp();
        vm.operateSignal = "edit";
        vm.dialogTitle = "修改学生信息";
        vm.dialogFormData.stuNum = row.stuNum;
        vm.dialogFormData.stuSex = row.stuSex;
        vm.dialogFormData.stuName = row.stuName;
        vm.dialogFormData.stuClass = row.stuClass;
        vm.dialogFormData.stuTel = row.stuTel;
        vm.dialogFormData.stuEmail = row.stuEmail;
        vm.dialogFormData.stuBirthday = row.stuBirthday;
        vm.dialogFormData.stuDeptid = row.stuDeptid;
        vm.dialogFormData.stuGrade = row.stuGrade;
        vm.dialogFormData.stuUserid = row.stuUserid;
        vm.dialogFormVisible = true;
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
              vm.getList();
            }  
            Message({
                showClose: true,
                message: res.data.message,
                type: 'success'
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
    //批量删除
    handleDelAll(){
        let vm = this;
        var userIdList = [];
        var clCodeList = [];
        for(var index = 0; index < vm.multipleSelection.length; index++){
           userIdList.push(vm.multipleSelection[index].stuUserid);
           clCodeList.push(vm.multipleSelection[index].stuClass);
        }
        if(userIdList.length == 0){
          Message({
                showClose: true,
                message: "请选择删除记录",
                type: 'info'
          });
          return;
        }
        vm.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          global.post(api.batchDelStuInfo,{userIdList:userIdList,clCodeList:clCodeList},{header:{"Content-type":"application/json"}},function(res){ 
            Message({
                showClose: true,
                message: res.data.message,
                type: 'success'
            }); 
            if(res.code == 200){ 
             vm.getList();
            }    
          },function(res){  
             Message({
                      showClose: true,
                      message: "服务器异常",
                      type: 'error'
             });
          },false);
        })

    },
    //搜索
    handleFilter() {
      this.getList();
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
    //新增
    handleCreate() {
        //每次点击新增时 重置下新增表单数据，避免双向绑定的影响
        this.initTemp();
        this.dialogFormVisible = true;
        this.operateSignal = "add";

    },
    //新增提交
    handleCreateSubmit(){
        let vm = this;
        var params = vm.dialogFormData;
        var targetApi = "";
        if(vm.operateSignal == "add"){
            targetApi = api.addStudentInfo;    
        }else{
           targetApi = api.updateStudentInfo;
        }
        
        //校验
        if(params.stuNum == ""){
          vm.$message.info("请输入学号");
          return;
        }
        var r = /^\+?[1-9][0-9]*$/;　　//正整数 
        if(params.stuNum.length < 6 || !r.test(params.stuNum)){
          vm.$message.info("学号最少六位数且为数字");
          return;
        }
        if(params.stuDeptid == ""){
          vm.$message.info("请选择系别/连队");
          return;
        }
        if(params.stuName == ""){
          vm.$message.info("请输入姓名");
          return;
        }
        if(params.stuGrade == ""){
          vm.$message.info("请选择年级");
          return;
        }
        if(params.stuClass == ""){
          vm.$message.info("请选择班级/排");
          return;
        }
        if(params.stuSex == null){
          vm.$message.info("请选择性别");
          return;
        }
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if(!myreg.test(params.stuTel)){
          vm.$message.info("联系方式输入有误");
          return;
        }
        const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if(!reg.test(params.stuEmail.trim())){
          vm.$message.info("邮箱输入有误");
          return;
        }  
        if(params.stuBirthday == ""){
          vm.$message.info("请选择出生日期");
          return;
        }
        vm.listLoading = true;
        global.post(targetApi,params,{header:{"Content-type":"application/json"}},function(res){
                  var data = res.data;
                  if(res.code == 200){
                    Message({
                        showClose: true,
                        message:data.message,
                        type: 'success'
                    }); 
                    vm.getList();
                    vm.listLoading = false;
                    vm.dialogFormVisible = false;
                  }else{
                     Message({
                        showClose: true,
                        message:data.message,
                        type: 'warning'
                    }); 
                    vm.listLoading = false;
                  }
                  console.log('-------获取到数据：',JSON.stringify(res) )  
          },function(res){  
               Message({
                        showClose: true,
                        message: "服务器异常",
                        type: 'error'
               });
                vm.listLoading = false;
          },false);
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },

    handleDownload() {
      let vm = this;
      require.ensure([], () => {
        const { export_json_to_excel, export_table_to_excel} = require('vendor/Export2Excel');
        const tHeader = ['学号', '系别',"年级","班级",'姓名', '联系方式', '电子邮箱','出生年月','性别','军训总成绩'];
        const filterVal = ['stuNum', 'dept.diName', 'stuGrade', 'classInfo.clName', 'stuName', 'stuTel', 'stuEmail', 'stuBirthday', 'stuSex','stuFinalscore'];
        const list = vm.list;
        const data = vm.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '导出的列表excel');
        //export_table_to_excel("listInfo");
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if(j.indexOf(".")!= -1){
          var tempArray = j.split(".");
          var origin = v[tempArray[0]];
          return origin[tempArray[tempArray.length-1]];
        };
        if(j == "stuFinalscore"){
          if(v[j] == -1){
            return "未评定";
          }else{
            return v[j];
          }
        }
        if(j == "stuSex"){
          if(v[j] == 0){
            return "男";
          }else{
            return "女";
          }
        }
        return v[j];
      }))
    }
  }
};
</script>
<style>
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