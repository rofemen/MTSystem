<template>
  <div class="app-container">
    

    <div style="margin-top:30px;margin-bottom:15px;padding-bottom: 10px; border-bottom: 1px solid rgb(238, 246, 244);font-weight: bold;font-size: 15px;color: #009751;vertical-align: top;">评价课程名称：
      <el-select v-model="courseItem" placeholder="请选择评价课程" style="width:160px;"
       @change="courseChange">
          <el-option
            v-for="item in courseInfoList"
            :key="item.ciCode"
            :label="item.ciName"
            :value="item.ciCode">
          </el-option>
      </el-select>
    </div>
    <!-- 表格 -->

    <el-table id = "listInfo" ref="multipleTable" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row  >
         <el-table-column align="center"  label="评价时间" width="160">
              <template scope="scope">
                <span>{{scope.row.eiTime}}</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="评价均分"  width="120">
            <template scope="scope">
              {{scope.row.eiScore}}
            </template>
          </el-table-column>
          <el-table-column align="left" label="其它建议">
            <template scope="scope">
              {{scope.row.eiContent}}
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
// import { getList } from 'api/article';
import {global} from 'src/global/global';
import {api} from 'src/global/api';
import { mapGetters } from 'vuex';
import { Message } from 'element-ui';
import md5 from 'blueimp-md5';
export default {
  data() {
    return {
        list: [],//表格list [].push({})
        total: 0,
        listLoading: true,
        listQuery: {
            currPage: 1,
            pageSize: 10,
            tcNum:0,
            ciCode:0
        },
        courseInfoList:[],
        courseItem:""
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
    vm.getTeachedCi(); 
   // vm.getList();
  },
  methods: {
    //获取列表数据
    getList() {
        let vm = this;
        vm.listLoading = true;
        vm.listQuery.tcNum = vm.userInfo.tcUserid;
        global.post(api.getEiInfoByTcNum,vm.listQuery,{header:{"Content-type":"application/json"}},function(res){
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
                    vm.total = 0;
               }          
        },function(res){
            
            vm.listLoading = false;
        },false)
    },
    getTeachedCi() {
      let vm = this;
        global.post( api.getTcTecheredCiForPost,{tcNum:vm.userInfo.tcUserid},{header:{"Content-type":"application/json"}},function(res){
               var data = res.data;
               if(res.code == 200){ 
                    vm.courseInfoList = data.list;
                    vm.listLoading = false;
                    console.log(vm.courseInfoList);
               }else{
                    vm.listLoading = false;
                    Message({
                        showClose: true,
                        message: res.data.message,
                        type: 'info'
                    });
               }
        },function(res){
             vm.listLoading = false;
             Message({
                    showClose: true,
                    message: "服务器异常，请稍后重试",
                    type: 'error'
                });

        },false)
    },
    courseChange(val){
      let vm = this;
      vm.listQuery.ciCode = val;
      vm.getList();
    }
    ,
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
    }
  }
};
</script>
