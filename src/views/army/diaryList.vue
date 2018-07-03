<template>
  <div class="app-container">
    <div class="diaryContain">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 160px;margin-right: 5px;margin-top: 7px;" class="filter-item" placeholder="姓名" v-model="listQuery.stuNum">
      </el-input>
      <el-date-picker type="date" format="yyyy-MM-dd" placeholder="选择日期" v-model="listQuery.diaryTime" ></el-date-picker>
      <el-button class="filter-item"  type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate"  icon="edit">添加</el-button>
      <el-button class="filter-item" type="primary" @click="handleDelAll"  icon="edit">批量删除</el-button>
      <!-- <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>-->
    </div>
    <!-- 表格 -->

    <el-table id = "listInfo" ref="multipleTable"  @selection-change="handleSelectionChange" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row @row-dblclick="rowClick">
        <el-table-column align="center" type="selection" width="65">
        </el-table-column>
        <el-table-column align="center" label="学号"  width="130">
            <template scope="scope">
              {{scope.row.diaryPublicer}}
            </template>
          </el-table-column>
         <el-table-column align="center" label="作者"  width="120">
            <template scope="scope">
              {{scope.row.publicer.stuName}}
            </template>
          </el-table-column>

         <el-table-column align="center"  label="日记标题" width="160">
              <template scope="scope">
                <span>{{scope.row.diaryTitle}}</span>
              </template>
          </el-table-column>
          <el-table-column align="left" label="内容">
            <template scope="scope">
              {{scope.row.diaryContent}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="日期" width="160">
            <template scope="scope">
              {{scope.row.diaryTime}}
            </template>
          </el-table-column>
          <el-table-column align="center"  label="操作"  width="180px">
              <template scope="scope">
              </template>
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
        list: null,//表格list [].push({})
        total: null,
        listLoading: true,
        listQuery: {
            currPage: 1,
            pageSize: 10,
            stuNum:"",
            clCode:0,
            diaryTime:null
        },
        classInfo:{},
        multipleSelection:[],
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
    let vm = this;
    vm.getClassInfo();
    

  },
  methods: {
    //获取列表数据
    getList() {
        let vm = this;
        if(vm.classInfo.clCode == undefined){
            Message({
                        showClose: true,
                        message: "您当前为被指派管理班级",
                        type: 'info'
            });
            return;
        }
        vm.listQuery.clCode = vm.classInfo.clCode;
        
        global.post(api.getDiaryInfoByNameOrTime,vm.listQuery,{header:{"Content-type":"application/json"}},function(res){
                let data = res.data;
               if(res.code == 200){ 
                    vm.list = data.list;
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
            Message({
                showClose: true,
                message: "服务器异常，请稍后重试",
                type: 'error'
              });
            vm.listLoading = false;
        },false)
    },
    getClassInfo() {
        let vm = this;
        vm.listLoading = true;
        global.post(api.selectByTcNum,{roleType:1,tcNum:vm.userInfo.tcUserid},{header:{"Content-type":"application/json"}},function(res){
                let data = res.data;
               if(res.code == 200){
                    var classInfo = data.classInfo; 
                    vm.classInfo = classInfo;
                    vm.getList();
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
                    vm.listLoading = false;
        },false)
    },
    //单个删除
    handleDelete(index,row){
        let vm = this;
        this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          global.post(api.delectDiaryById,{diaryId:row.diaryId},{header:{"Content-type":"application/json"}},function(res){
            if(res.code == 200){ 
              vm.list.splice(index,1)
            }  
            Message({
                showClose: true,
                message: res.data.message,
                type: 'info'
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
        var diaryIdList = [];
        for(var index = 0; index < vm.multipleSelection.length; index++){
           diaryIdList.push(vm.multipleSelection[index].diaryId);
        }
        if(diaryIdList.length == 0){
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
          global.post(api.batchDelDiaryInfo,{diaryIdList:diaryIdList},{header:{"Content-type":"application/json"}},function(res){ 
            Message({
                showClose: true,
                message: res.data.message,
                type: 'info'
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
    handleSelectionChange(val) {
        this.multipleSelection = val;
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
    rowClick(row, event){
      this.$router.push({ path: '/army/diaryInfoDetail', query: {diaryInfo:row,type:"show"} });
    },
    handleCreate(){
      this.$router.push({ path: '/army/diaryInfoDetail', query: {type:"add"} });
    },
    handleEdit(index,row){
      this.$router.push({ path: '/army/diaryInfoDetail', query: {diaryInfo:row,type:"edit"} });
    }
  }
};
</script>
<style type="text/css">
  .diaryContain{
    height: auto;
  }
</style>