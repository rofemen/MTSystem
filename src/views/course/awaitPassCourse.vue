<template>
  <div class="app-container">

    <!-- 表格 -->
    <el-table id = "listInfo" type="expand"  :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row  >
         <el-table-column type="expand">
          <template scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="课程名称">
                   <span>{{ scope.row.ciName }}</span>
                </el-form-item>
                <el-form-item label="授课人">
                  <span v-if="scope.row.ciType==0">全体老师</span>
                  <span v-if="scope.row.ciType==1">{{scope.row.ciTc.tcName}}</span>
                </el-form-item>
                <el-form-item label="授课位置">
                  <span>{{scope.row.ciExtra1}}</span>
                </el-form-item>
                <el-form-item label="考试类型">
                  <span v-if="scope.row.ciExam==0">无考核</span>
                  <span v-if="scope.row.ciExam==1">笔试</span>
                  <span v-if="scope.row.ciExam==2">实操</span>
                </el-form-item>
                <el-form-item label="开课时间">
                  <span>{{ scope.row.ciStarttime }}</span>
                </el-form-item>
                <el-form-item label="课程时长">
                  <span>共{{ scope.row.ciTimelong }}周</span>
                </el-form-item>
                <el-form-item label="课程简述">
                  <span>{{scope.row.ciDes }}</span>
                </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center"  label="课程编号" width="140px" prop="ciCode" sortable>
              <template scope="scope">
                <span>{{scope.row.ciCode}}</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="课程名称">
            <template scope="scope">
            {{scope.row.ciName}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="课程类型" >
            <template scope="scope">
              <span v-if= "scope.row.ciType == 0">公共课</span>
              <span v-if= "scope.row.ciType == 1">专业课</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="140px" label="授课人">
            <template scope="scope">
              <span v-if= "scope.row.ciType == 0">全体老师</span>
              <span v-if= "scope.row.ciType == 1">{{scope.row.ciTc.tcName}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center"  label="开课时间">
            <template scope="scope">
              <span>{{scope.row.ciStarttime}}</span>
            </template>
          </el-table-column>
      
          <el-table-column align="center" width="180px" label="审批" >
              <template scope="scope">
                 <el-button size="small" type="primary" @click="handlePass(scope.$index, scope.row,1)">通过</el-button>
                 <el-button size="small"  @click="handlePass(scope.$index, scope.row,-1)">不通过</el-button>
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
  components: {
　　
},
  data() {
    return {
        list: [],
        total: null,
        listLoading: true,
        dialogLoading:false,
        listQuery: {
            currPage: 1,
            pageSize: 10,
            ciStatus:0
        },
        dialogFormVisible: false,
        multipleSelection: [],
        dialogTitle:"添加班级信息"

    }
  },
  mounted() {
    let vm = this;
    vm.getList();   
  },
  methods: {
    //获取列表数据
    getList() {
        let vm = this;
        vm.listLoading = true;
        global.post(api.getCourseInfo,vm.listQuery,{header:{"Content-type":"application/json"}},function(res){
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
                      message:"服务器异常",
                      type: 'error'
                    });
            vm.listLoading = false;
        },false)
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
    handlePass(index, item ,status){
      if(item == ""){return;}
        let vm = this;     
        vm.listLoading = true;
        global.post(api.updateCourseInfo,{ciCode:item.ciCode,ciStatus:status},{header:{"Content-type":"application/json"}},function(res){
                let data = res.data;
               if(res.code == 200){ 
                  var message = "审批通过";
                  if(status == -1){
                    message = "成功驳回课程";
                  }
                  Message({
                      showClose: true,
                      message: message,
                      type: 'info'
                  });
                  setTimeout(function(){
                    vm.getList();
                    vm.listLoading = false;
                  },2000);
               }else{
                    vm.listLoading = false;
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
             vm.dialogLoading = false;
        },false)
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
</style>