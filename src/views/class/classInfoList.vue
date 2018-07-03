<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <div class="filter-container">
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 160px;margin-right: 5px;" class="filter-item" placeholder="班级编号" v-model="listQuery.name">
      </el-input>
      -->
     

      <el-select clearable class="filter-item"  style="width: 130px;margin-right: 5px;" v-model="listQuery.clGrade" placeholder="年级">
        <el-option label="2014级" :key="2014" :value="2014"></el-option>
        <el-option label="2015级" :key="2015" :value="2015"></el-option>
        <el-option label="2016级" :key="2016" :value="2016"></el-option>
        <el-option label="2017级" :key="2017" :value="2017"></el-option>
        <el-option label="2018级" :key="2018" :value="2018"></el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate"  icon="edit">添加</el-button>

      <el-button class="filter-item" type="primary" @click="handleDelAll"  icon="edit">批量删除</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
     
    </div>

    <!-- 表格 -->
    <el-table id = "listInfo" ref="multipleTable" @selection-change="handleSelectionChange" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row  >
         <el-table-column align="center" type="selection" width="65">
         </el-table-column>

         <el-table-column align="center"  label="班级编号" prop="clCode" sortable>
              <template scope="scope">
                <!-- <i class="el-icon-time"></i> -->
                <span>{{scope.row.clCode}}</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="年级" width="80px">
            <template scope="scope">
              {{scope.row.clGrade}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="班级名称" width="160px">
            <template scope="scope">
              {{scope.row.clName}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="系别/连队">
            <template scope="scope">
              {{scope.row.dept.diName}}/{{scope.row.dept.company}}
            </template>
          </el-table-column>
          
          <el-table-column align="center" label="排名称" width="80px">
            <template scope="scope">
              <!-- <i class="el-icon-time"></i> -->
              <span>{{scope.row.clRowname}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="辅导员" width="80px">
            <template scope="scope">
              <!-- <i class="el-icon-time"></i> -->
              <span v-if="scope.row.instor == undefined">无</span>
              <span v-else>{{scope.row.instor.tcName}}</span>
              
            </template>
          </el-table-column>

          <el-table-column align="center" label="教官"  width="80px">
            <template scope="scope">
             <span v-if="scope.row.armyInstor ==undefined">无</span>
              <span v-else>{{scope.row.armyInstor.tcName}}</span>
            </template>
          </el-table-column>
           
          <el-table-column label="导师" align="center" width="80px">
            <template scope="scope">
              <span v-if="scope.row.tutor ==undefined">无</span>
              <span v-else>{{scope.row.tutor.tcName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="剩余位置/班级容量" align="center" width="100px">
            <template scope="scope">
              {{scope.row.clCount}}/{{scope.row.clMaxcount}}
            </template>
          </el-table-column>
          
          

          

          <el-table-column align="center"  label="操作"  width="160px">
              <template scope="scope">
                  
                 <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                 <el-button size="small"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                       
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" v-loading.fullscreen="dialogLoading">
          <el-form class="small-space"  label-position="left" label-width="90px">

                <el-row>  
                  <el-col :span="10" >
                    <el-form-item label="班级编号:" style="margin-left: 28px" required>
                      <el-input v-model="dialogFormData.clCode" :disabled="operateSignal == 'edit'" placeholder="班级编号" style ="display: inline-block;width: 120px;">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" >
                    <el-form-item label="系别/连队:" required>
                            <el-select clearable class="filter-item"  style="width: 130px;margin-right: 5px;" v-model="dialogFormData.clDpid" placeholder="系别/连队" @change="getTeacherInfoByDid">
                            <el-option v-for="item in  typeOptions" :key="item.diId" :label="item.diName" :value="item.diId">
                               <span style="float: left;font-family: 微软雅黑; font-size: 12px;">{{ item.diName }}</span>
                              <span style="float: right; color: #8492a6; font-size: 12px">{{ item.company }}</span>
                            </el-option>
                          </el-select>
                    </el-form-item>
                  </el-col>
                 </el-row>
                <el-row>  
                  <el-col :span="10" >
                    <el-form-item label="班级名称:" style="margin-left: 28px" required>
                        <el-input v-model="dialogFormData.clName" style ="display: inline-block;width: 140px;" placeholder="班级名称"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10" >
                    <el-form-item label="排名称:"  label-width="75px" style="margin-left: 20px" required>
                      <el-input style="width: 100px;" placeholder="排名称" v-model="dialogFormData.clRowname"></el-input>
                    </el-form-item>
                  </el-col>
                 </el-row>  
            <el-row>
               <el-col :span="10" >
                    <el-form-item label="年级:"  label-width="60px" style="margin-left: 55px" required>
                            <el-select  placeholder="年级" style="width: 100px;" v-model="dialogFormData.clGrade">
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
                  <el-form-item label="辅导员:"  label-width="75px" required style="margin-left: 20px">
                    <el-select clearable placeholder="辅导员" style="width: 100px;" v-model="dialogFormData.clInstor">
                      <el-option v-for="item in clInstor" :key="item.tcUserid" :label="item.tcName" :value="item.tcUserid">
                        {{ item.tcName }}
                      </el-option>
                    </el-select>
                  </el-form-item>

                </el-col>
            </el-row>
            <el-row>
               <el-col :span="10" >
                  <el-form-item  label="教官:"  label-width="60px" style="margin-left: 55px" >
                    <el-select clearable placeholder="教官" style="width: 100px;" v-model="dialogFormData.clArmyInstor">
                     <el-option v-for="item in clArmyInstor" :label="item.tcName" :key="item.tcUserid"  :value="item.tcUserid">
                        {{ item.tcName }}
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10" >
                  <el-form-item clearable label="导师:"  label-width="60px"  style="margin-left: 40px">
                    <el-select  placeholder="导师" style="width: 100px;" v-model="dialogFormData.clTutor">
                     <el-option v-for="item in clTutor" :key="item.tcUserid" :label="item.tcName" :value="item.tcUserid">
                        {{ item.tcName }}
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
            </el-row>

            
            <el-form-item label="班级最多人数:" label-width="120px" required>
                  <el-slider v-model="dialogFormData.clMaxcount" style="width: 250px;"></el-slider>
            </el-form-item> 
               
          </el-form>


            <el-row style="margin-top:50px;">
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
import draggable from 'vuedraggable';
export default {
  components: {
　　draggable
},
  data() {
    return {
        list: null,//表格list [].push({})
        total: null,
        listLoading: true,
        dialogLoading:false,
        tags:[['1','2','3'],['2','3','1'],['3','2','1']],
        listQuery: {
            currPage: 1,
            pageSize: 10,
            clGrade:""
        },
        dialogFormData :{
          clCode:"",
          clDpid:"",
          clGrade:"",
          clName:"",
          clRowname:"",
          clInstor:"",
          clArmyInstor:"",
          clTutor:"",
          clMaxcount:60,
          clCount:""
        },
        clInstor:[],
        clArmyInstor:[],
        clTutor:[],
        operateSignal:"add",
        typeOptions:[
        ],
        dialogFormVisible: false,
        multipleSelection: [],
        dialogTitle:"添加班级信息"

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
          clCode:"",
          clDpid:"",
          clGrade:"",
          clName:"",
          clRowname:"",
          clInstor:"",
          clArmyInstor:"",
          clTutor:"",
          clMaxcount:60,
          clCount:""
      }
    },
    initTeacher(){
      let vm = this;
      vm.clInstor=[];
      vm.clArmyInstor=[];
      vm.clTutor=[];
    },
    //获取列表数据
    getList() {
        let vm = this;

        vm.listLoading = true;
        global.post(api.getAllClassInfo,vm.listQuery,{header:{"Content-type":"application/json"}},function(res){
                let data = res.data;
               if(res.code == 200){ 
                   
                    vm.list = data.list;
                    vm.listQuery.currPage = data.currPage;
                    vm.listQuery.pageSize = data.pageSize;
                    vm.total = data.totalSize;

                    vm.listLoading = false;
                    
               }else{
                    //alert(res.body.resultMsg)
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
    //获取级别信息
    getGradeInfo(){
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
    //编辑
    handleEdit(index,row){
        let vm = this;
        vm.initTemp();
        vm.getTeacherInfoByDid(row.clDpid);
        vm.operateSignal = "edit";
        vm.dialogTitle = "修改班级信息";
        vm.dialogFormData.clCode = row.clCode;
        vm.dialogFormData.clDpid = row.clDpid;
        vm.dialogFormData.clGrade = row.clGrade;
        vm.dialogFormData.clName = row.clName;
        vm.dialogFormData.clRowname = row.clRowname;
        vm.dialogFormData.clInstor = row.clInstor;
        vm.dialogFormData.clArmyInstor = row.clArmyInstor;
        vm.dialogFormData.clTutor = row.clTutor;
        vm.dialogFormData.clMaxcount = row.clMaxcount;
        vm.dialogFormData.clCount = row.clCount;
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
          global.post(api.delectClassInfoById,{clCode:row.clCode},{header:{"Content-type":"application/json"}},function(res){
            if(res.code == 200){ 
              vm.getList();
            }  
            Message({
                showClose: true,
                message: res.data.message,
                type: 'error'
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
        
        var clCodeList = [];
        for(var index = 0; index < vm.multipleSelection.length; index++){
           clCodeList.push(vm.multipleSelection[index].clCode);
        }
        if(clCodeList.length == 0){
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
          global.post(api.batchDelClInfo,{clCodeList:clCodeList},{header:{"Content-type":"application/json"}},function(res){ 
            Message({
                showClose: true,
                message: res.data.message,
                type: 'error'
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
        var r = /^\+?[1-9][0-9]*$/;　　//正整数 
        if(params.clCode.length < 3 || !r.test(params.clCode)){
          vm.$message.info("班级编号最少三位数且为数字");
          return;
        }
        if(params.clDpid == ""){
          vm.$message.info("请选择系别/连队");
          return;
        }
        if(params.clName == ""){
          vm.$message.info("请输入班级名称");
          return;
        }
        if(params.clRowname == ""){
          vm.$message.info("请输入排名称");
          return;
        }
        if(params.clGrade == ""){
          vm.$message.info("请选择年级");
          return;
        }
        if(params.clInstor == ""){
          vm.$message.info("请选择辅导员");
          return;
        }
        var targetApi = "";
        if(vm.operateSignal == "add"){
            targetApi = api.addClassInfo;
        }else{
           targetApi = api.updateClassInfo;
        }
        global.post(targetApi,params,{header:{"Content-type":"application/json"}},function(res){
                  var data = res.data;
                  if(res.code == 200){
                    Message({
                        showClose: true,
                        message:data.message,
                        type: 'success'
                    }); 
                    
                    vm.getList();

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
    getTeacherInfoByDid(item){
      if(item == ""){return;}
        let vm = this;     
        vm.dialogLoading = true;
        global.post(api.getTeacherByDiId,{diId:item},{header:{"Content-type":"application/json"}},function(res){
                
                let data = res.data;
                // console.log('-------获取到数据：',data.list )
               if(res.code == 200){ 
                  var temp =data.list;
                  vm.initTeacher();
                  for(var i = 0; i <　temp.length; i++){
                    if(data.list[i].tcRole == 0){
                      vm.clInstor.push(data.list[i]);
                    }else if(data.list[i].tcRole == 1){
                      vm.clArmyInstor.push(data.list[i]);
                    }else{
                       vm.clTutor.push(data.list[i]);
                    }

                    vm.dialogLoading = false;
                  }
                  vm.clArmyInstor.push({tcName:'无',tcUserid:-1});
                  vm.clTutor.push({tcName:'无',tcUserid:-1});
                  vm.clInstor.push({tcName:'无',tcUserid:-1})
               }else{
                    vm.dialogLoading = false;
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
    }
    ,
    handleDownload() {
      let vm = this;
      require.ensure([], () => {
        const { export_json_to_excel, export_table_to_excel} = require('vendor/Export2Excel');
        const tHeader = ['班级编号', '班级名称', '年级', '系别', '连队', '排名称','辅导员','教官','导师','剩余位置','班级容量']
        const filterVal = ['clCode', 'clName', 'clGrade', 'dept.diName', 'dept.company' ,'clRowname', 'instor.tcName',
         'armyInstor.tcName','tutor.tcName','clCount','clMaxcount'];
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
        return v[j];
      }))
    }
  }
};
</script>
<style type="text/css">
  
</style>