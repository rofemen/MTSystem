<template>
  <div class="app-container">
    <!-- 搜索条件 -->
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

    <el-table id = "listInfo" ref="multipleTable" @selection-change="handleSelectionChange" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row  >
         <el-table-column align="center" type="selection" width="65">
         </el-table-column>

          <!--<el-table-column align="center" label='序号' width="100">

            <template scope="scope">
              {{scope.$index}}
            </template>
          </el-table-column>

          -->
         <el-table-column align="center"  label="工号" >
              <template scope="scope">
                <!-- <i class="el-icon-time"></i> -->
                <span>{{scope.row.tcNum}}</span>
              </template>
          </el-table-column>

          <el-table-column align="center" label="所属连/系别">
            <template scope="scope">
              {{scope.row.dept.company}}/{{scope.row.dept.diName}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="姓名">
            <template scope="scope">
              {{scope.row.tcName}}
            </template>
          </el-table-column>
          
          <el-table-column align="center" label="联系方式">
            <template scope="scope">
              <!-- <i class="el-icon-time"></i> -->
              <span>{{scope.row.tcTel}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="电子邮箱" width="170px">
            <template scope="scope">
              <!-- <i class="el-icon-time"></i> -->
              <span>{{scope.row.tcEmail}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="出生年月" >
            <template scope="scope">
              <!-- <i class="el-icon-time"></i> -->
              <span>{{scope.row.tcBirthday}}</span>
            </template>
          </el-table-column>
           
          <el-table-column label="性别" align="center" width="80px">
            <template scope="scope">
              <span v-if="scope.row.tcSex == 0">男</span>
              <span v-if="scope.row.tcSex == 1">女</span>
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
    <!-- 新增弹窗 -->

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
          <el-form class="small-space" :model="temp" label-position="left" label-width="90px">

                <el-row>  
                  <el-col :span="10" >
                    <el-form-item label="工号:" style="margin-left: 28px"  label-width="60px" required>
                      <el-input v-model="dialogFormData.tcNum" :disabled="operateSignal == 'edit'" placeholder="工号" style ="display: inline-block;width: 120px;">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" >
                    <el-form-item label="连队:"  label-width="60px" required>
                            <el-select clearable class="filter-item"  style="width: 130px;margin-right: 5px;" v-model="dialogFormData.tcDepartment" placeholder="连队">
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
                        <el-input v-model="dialogFormData.tcName" style ="display: inline-block;width: 120px;" placeholder="姓名"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" >
                    <el-form-item label="性别:"  label-width="60px" required>
                            <el-select  placeholder="性别" style="width: 80px;" v-model="dialogFormData.tcSex">
                              <el-option label="男" :key="0" :value="0"></el-option>
                              <el-option label="女" :key="1" :value="1"></el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                 </el-row>  
            
            <el-form-item label="联系方式:"  label-width="85px" required>
              <el-input style="width: 200px;" placeholder="联系方式" v-model="dialogFormData.tcTel"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱:"  label-width="85px" required>
              <el-input style="width: 200px;" placeholder="电子邮箱" v-model="dialogFormData.tcEmail"></el-input>
            </el-form-item>
            <el-form-item label="出生年月:" label-width="85px" required>
                  <el-date-picker type="date" placeholder="选择日期" v-model="dialogFormData.tcBirthday" style="width: 200px;"></el-date-picker>
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
        listLoading: true,
        listQuery: {
            currPage: 1,
            pageSize: 10,

            roleType: 2,//导师类型
            deptValue:"",
            name:"",         
        },
        dialogFormData :{
          tcNum:"",
          tcSex:null,
          tcTel:"",
          tcEmail:"",
          tcBirthday:"",
          tcRole:"",
          tcDepartment:"",
          tcName:""
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
        typeOptions:[
          { key: '001', display_name: '类型1' },
          { key: '002', display_name: '类型2' },
          { key: '003', display_name: '类型3' }
         
        ],
        dialogFormVisible: false,

        multipleSelection: [],
        dialogTitle:"添加教官信息"

    }
  },
  mounted() {
    let vm = this;
    vm.getList();
    vm.getDeptInfo();
  },
  methods: {
    initTemp(){
      let vm = this;
      vm.dialogFormData = {
          tcNum:"",
          tcDepartment:"",
          tcSex:null,
          tcTel:"",
          tcEmail:"",
          tcBirthday:"",
          tcRole:2,
          tcName:""
      }
    },
    //获取列表数据
    getList() {
        let vm = this;
        vm.listLoading = true;
        global.post(api.getAllTcInfoByRoleType,vm.listQuery,{header:{"Content-type":"application/json"}},function(res){
                //console.log('-------获取到数据：',JSON.stringify(res) )
                let data = res.data;
               if(res.code == 200){ 
                   
                    vm.list = data.list;
                    //console.log('列表数据：',vm.list);
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
                console.log('-------获取到数据：',JSON.stringify(res) )
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
    //编辑
    handleEdit(index,row){
        let vm = this;

        vm.initTemp();
        vm.operateSignal = "edit";
        vm.dialogTitle = "修改教官信息";
        vm.dialogFormData.tcNum = row.tcNum;
        vm.dialogFormData.tcDepartment = row.dept.diId;
        vm.dialogFormData.tcName = row.tcName;
        vm.dialogFormData.tcSex = row.tcSex;
        vm.dialogFormData.tcTel = row.tcTel;
        vm.dialogFormData.tcEmail = row.tcEmail;
        vm.dialogFormData.tcBirthday = row.tcBirthday;
        vm.dialogFormData.tcUserid = row.tcUserid;
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
          vm.listLoading = true;
          global.post(api.delectTeacherById,{tcUserid:row.tcUserid,roleId:2},{header:{"Content-type":"application/json"}},function(res){
            if(res.code == 200){ 
              vm.list.splice(index,1)
            }  
            Message({
                showClose: true,
                message: res.data.message,
                type: 'info'
              });
            vm.listLoading = false;
          },function(res){ 
            vm.listLoading = false; 
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
        for(var index = 0; index < vm.multipleSelection.length; index++){
           userIdList.push(vm.multipleSelection[index].tcUserid);
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
          vm.listLoading = true;
          global.post(api.batchDelTcInfo,{userIdList:userIdList,roleId:2},{header:{"Content-type":"application/json"}},function(res){ 
            Message({
                showClose: true,
                message: res.data.message,
                type: 'info'
            }); 
            if(res.code == 200){ 
             vm.getList();
            }    
            vm.listLoading = false;
          },function(res){  
            vm.listLoading = false;
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
            targetApi = api.addTeacherInfo;    
        }else{
           targetApi = api.updateTeacherInfo;
        }

        if(params.tcNum == ""){
          vm.$message.info("请输入工号");
          return;
        }
        var r = /^\+?[1-9][0-9]*$/;　　//正整数 
        if(params.tcNum.length < 4 || !r.test(params.tcNum)){
          vm.$message.info("工号最少四位数且为数字");
          return;
        }
        if(params.tcDepartment == ""){
          vm.$message.info("请选择连队");
          return;
        }
        if(params.tcName == ""){
          vm.$message.info("请输入姓名");
          return;
        }
        if(params.tcSex == null){
          vm.$message.info("请选择性别");
          return;
        }
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if(!myreg.test(params.tcTel)){
          vm.$message.info("联系方式输入有误");
          return;
        }
        const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if(!reg.test(params.tcEmail.trim())){
          vm.$message.info("邮箱输入有误");
          return;
        }  
        if(params.tcBirthday == ""){
          vm.$message.info("请选择出生日期");
          return;
        }

        global.post(targetApi,params,{header:{"Content-type":"application/json"}},function(res){
                  var data = res.data;
                  if(res.code == 200){
                    Message({
                        showClose: true,
                        message:data.message,
                        type: 'success'
                    }); 
                    if(vm.operateSignal == "add"){
                      vm.list.splice(0, 0, data.info);
                    }else{
                      vm.getList();
                    }
                    vm.dialogFormVisible = false;
                  }else{
                     Message({
                        showClose: true,
                        message:data.message,
                        type: 'warning'
                    }); 
                  }
                  console.log('-------获取到数据：',JSON.stringify(res) )  
          },function(res){  
               Message({
                        showClose: true,
                        message: "服务器异常",
                        type: 'error'
               });
          },false);

    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },

    handleDownload() {
      let vm = this;

      require.ensure([], () => {
        const { export_json_to_excel, export_table_to_excel} = require('vendor/Export2Excel');
        const tHeader = ['工号', '连队', '姓名', '联系方式', '电子邮箱','出生年月','性别'];
        const filterVal = ['tcNum', 'dept.diName', 'tcName', 'tcTel', 'tcEmail', 'tcBirthday', 'tcSex'];
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
        if(j == "tcSex"){
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
