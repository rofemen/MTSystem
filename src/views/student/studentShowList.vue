<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 160px;margin-right: 5px;" class="filter-item" placeholder="姓名" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item"  type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>
    <!-- 表格 -->
    <el-table id = "listInfo" type="expand" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row  >

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
 
    </el-table>
    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currPage"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


  </div>
</template>

<script>
import {global} from 'src/global/global';
import {api} from 'src/global/api';
import { Message } from 'element-ui';
import md5 from 'blueimp-md5';
import { mapGetters } from 'vuex';

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
            name:"",         
        },
        operateSignal:"add",
        dialogFormVisible: false,
        forClassList:{
          clGrade:0,
          clDpId:0
        },
        classList:[],
        typeOptions:[],
        classInfo:{},
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
    vm.getList();
  },
  methods: {
    getList() {
        let vm = this;
        vm.listLoading = true;
        vm.listQuery.tcNum = vm.userInfo.tcUserid
        global.post(api.getStudentInfoByTcNumForShow,vm.listQuery,{header:{"Content-type":"application/json"}},function(res){
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
                    vm.listLoading = false;
               }          
        },function(res){
            vm.listLoading = false;
            Message({
                        showClose: true,
                        message: "服务器异常，请稍后重试",
                        type: 'info'
                    });
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