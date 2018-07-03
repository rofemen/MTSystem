<template>
  <div class="app-container">
    <div class="mainContainer1">
      <div class = "receiver">
               
       <el-tabs v-model="tabValue" type="card" @tab-click="handleClick">
          <el-tab-pane label="发邮件" name="send" v-loading.body="listLoading">
            <el-row>
              <el-col :span="3" style="text-align:right;height: 36px;line-height: 36px;font-weight: bold;">收件人身份：</el-col>
              <el-col :span="18">
                <el-select  placeholder="请选择" clearable style="width: 120px;" v-model="sendMessage.receiverType">
                    <el-option label="教官/教师" :key="1" :value="1"></el-option>
                    <el-option label="学生" :key="2" :value="2"></el-option>
                  </el-select>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px;">
              <el-col :span="3"  style="text-align:right;height: 36px;line-height: 36px;font-weight: bold;">收件人工号/学号：</el-col>
              <el-col :span="18">
                <el-input v-model="sendMessage.num" style ="display: inline-block;width: 240px;" placeholder="工号/学号"></el-input>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px;">
              <el-col :span="3"  style="text-align:right;height: 36px;line-height: 36px;font-weight: bold;">主题：</el-col>
              <el-col :span="18">
                <el-input v-model="sendMessage.theme" style ="display: inline-block;width: 750px;" placeholder="主题"></el-input>
              </el-col>
            </el-row>
            <el-row style="">
              <el-col :span="3"  style="text-align:right;height: 36px;line-height: 36px;font-weight: bold;">邮件内容：</el-col>
              <el-col :span="18">
                <el-input  type="textarea" v-model="sendMessage.content" :rows="12" placeholder="邮件内容..." id="shareContent" style="margin-top: 10px;"></el-input>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px; text-align: right;">
              <el-col :span="3"> &nbsp</el-col>
              <el-col :span="18">
                <el-button type="primary" @click="websocketsend" style="width: 100px;">发送</el-button>
                <el-button type="reset" @click="reset" style="width: 100px;">重置</el-button>
              </el-col>
            </el-row>
            
          </el-tab-pane>
          <el-tab-pane label="收件箱" name="receive">
            <div style="margin-bottom: 100px;">
              <div style="text-align: right;"><el-button type="primary" @click="batchReceDetele" style="width: 100px;margin-bottom: 10px;">批量删除</el-button></div>
              <el-table id = "listInfo" ref="recemultipleTable" @selection-change="receSelectionChange" :data="receiveList" v-loading.body="listLoading" @row-dblclick="receRowClick">
               <el-table-column align="center" type="selection" width="40">
               </el-table-column>
               <el-table-column align="left"  label="发件人"  width="200">
                    <template scope="scope">
                      <!-- <i class="el-icon-time"></i> -->
                      <span>{{scope.row.senderName}}({{scope.row.emSender}})</span>
                    </template>
                </el-table-column>

                <el-table-column align="left" label="主题" width="200">
                  <template scope="scope">
                    {{scope.row.emTheme}}
                  </template>
                </el-table-column>

                <el-table-column align="left" label="内容">
                  <template scope="scope">
                    {{scope.row.emContent}}
                  </template>
                </el-table-column>

                <el-table-column align="center" label="时间"  width="120">
                  <template scope="scope">
                    {{scope.row.emTime}}
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="receSizeChange" @current-change="receCurrentChange" :current-page.sync="receParam.currPage"
                  :page-sizes="[10,20,30, 50]" :page-size="receParam.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="recetotal">
                </el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="发件箱" name="sendRecord" >
            <div style="margin-bottom: 100px;">
               <div style="text-align: right;"><el-button type="primary" @click="batchSendDetele" style="width: 100px;margin-bottom: 10px;">批量删除</el-button></div>
              <el-table  ref="sendmultipleTable" @selection-change="sendSelectionChange" :data="sendList" v-loading.body="listLoading" @row-dblclick="sendRowClick">
               <el-table-column align="center" type="selection" width="40">
               </el-table-column>
               <el-table-column align="left"  label="收件人"  width="200">
                    <template scope="scope">
                      <span>{{scope.row.receiverName}}({{scope.row.emReceiver}})</span>
                    </template>
                </el-table-column>

                <el-table-column align="left" label="主题" width="200">
                  <template scope="scope">
                    {{scope.row.emTheme}}
                  </template>
                </el-table-column>

                <el-table-column align="left" label="内容">
                  <template scope="scope">
                    {{scope.row.emContent}}
                  </template>
                </el-table-column>

                <el-table-column align="center" label="时间"  width="120">
                  <template scope="scope">
                    {{scope.row.emTime}}
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="sendSizeChange" @current-change="sendCurrentChange" :current-page.sync="sendParam.currPage"
                  :page-sizes="[10,20,30, 50]" :page-size="sendParam.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="sendtotal">
                </el-pagination>
              </div>
            </div>
          </el-tab-pane>
       </el-tabs>

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
import Cookies from 'js-cookie';


export default {
  data() {
    return {
       websock: null,
       tabValue:"send",
       sendMessage:{
         receiverType:"",
         num:"",
         theme:"",
         content:""
       },
       listLoading:false,
       receiveList:[],
       sendList:[],
       recemultipleSelection:[],
       sendmultipleSelection:[],
       receParam:{
          currPage: 1,
          pageSize: 10,
       },
       recetotal:0,
       sendParam:{
          currPage: 1,
          pageSize: 10,
       },
       sendtotal:0
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
    vm.threadPoxi();
    vm.getReceiveMessage();
     vm.getSendMessage();
  },
  methods: {
    threadPoxi(){  // 实际调用的方法
          if (this.websock.readyState === this.websock.OPEN) {}
          else if (this.websock.readyState === this.websock.CONNECTING) {}
          else {this.initWebSocket();}
      },
      initWebSocket(){ //初始化weosocket
          //ws地址
          var wsuri = "ws://localhost:8080/gp/webSocketServer?";
          let vm = this;
          if(vm.userType == "stu"){
            wsuri = wsuri+"userId="+vm.userInfo.stuNum+"-"+vm.userType
          }else{
            wsuri = wsuri+"userId="+vm.userInfo.tcNum+"-"+vm.userType
          }
          this.websock = new WebSocket(wsuri);
          this.websock.onmessage = this.websocketonmessage;
          this.websock.onclose = this.websocketclose;
          this.websock.onopen = this.websocketonOpen
      },
      websocketonmessage(e){ //数据接收
          let vm = this;
          const redata = JSON.parse(e.data);
          if(redata.callback == undefined){
            var message = "来自"+redata.sendName;
            if(redata.senderType == "tc"){
              message = message + "(老师 工号为："+redata.senderNum+")的来信，来信";
            }else{
              message = message + "(学生 学号为："+redata.senderNum+")的来信，来信";
            }
            message = message + "内容为："+ redata.content;
            this.$notify({
              title: '提示',
              message: message,
              duration: 0
            });
            Cookies.set('isReceive', true,{ expires: 1/3});
            this.$store.commit('SET_ISRECEIVE', true);
          }else if(redata.callback == 0){
            vm.listLoading = false;
            Message({
                showClose: true,
                message: "消息发送成功",
                type: 'success'
            });
            vm.reset();
          }else if(redata.callback == -1){
            vm.listLoading = false;
            Message({
                showClose: true,
                message: "该账户不存在",
                type: 'success'
            });
          }
          console.log("接收",e);
      },
      websocketonOpen(e){ //数据接收
          console.log("open",e);
      },
      websocketsend(){//数据发送
        let vm = this;
        console.log(vm.sendMessage.receiverType == "")
        if(vm.sendMessage.receiverType == ""){
          vm.$message.info("请选择收件人身份");
          return;
        }
        if(vm.sendMessage.num == ""){
          vm.$message.info("请输入收件人工号/学号");
          return;
        }
        if(vm.sendMessage.theme == ""){
          vm.$message.info("请输入主题");
          return;
        }
        if(vm.sendMessage.content == ""){
          vm.$message.info("请输入邮件内容");
          return;
        }
        vm.listLoading = true;
        if(vm.sendMessage.receiverType == 1){
          vm.sendMessage.type = vm.userType+"-"+"tc";
        }else{
          vm.sendMessage.type = vm.userType+"-"+"stu";
        }
        if(vm.userType == "tc"){
          vm.sendMessage.senderNum = vm.userInfo.tcNum;
          vm.sendMessage.sendName = vm.userInfo.tcName;
        }else{
          vm.sendMessage.senderNum = vm.userInfo.stuNum;
          vm.sendMessage.sendName = vm.userInfo.stuName;
        }
        vm.sendMessage.senderType = vm.userType;

        vm.websock.send(JSON.stringify(vm.sendMessage));

      },
      websocketclose(e){  //关闭
          console.log("connection closed (" + e.code + ")");
      },
      handleClick(tab, event) {
        let vm = this;
        var name = tab.name;
        if(name == "receive"){
          Cookies.set('isReceive', false,{ expires: 1/3});
          this.$store.commit('SET_ISRECEIVE', false);
          vm.getReceiveMessage();
        }else if(name == "sendRecord"){
          vm.getSendMessage();
        }
      },
      reset(){
        let vm = this;
        vm.sendMessage.receiverType = "";
        vm.sendMessage.num = "";
        vm.sendMessage.theme = "";
        vm.sendMessage.content = "";
      },
      receSelectionChange(val) {
        this.recemultipleSelection = val;
      },
      sendSelectionChange(val) {
        this.sendmultipleSelection = val;
      },
      receRowClick(row, event){
        this.$router.push({ path: '/index/emailDetail', query: {emailDetail:row} });
        
      },
      sendRowClick(row, event){
         this.$router.push({ path: '/index/emailDetail', query: {emailDetail:row} });
      },
      //操作分页
      receSizeChange(val) {
        this.receParam.pageSize = val;
        this.getReceiveMessage();
      },
      //操作分页
      receCurrentChange(val) {
        this.receParam.currPage = val;
        this.getReceiveMessage();
      },
      //操作分页
      sendSizeChange(val) {
        this.sendParam.pageSize = val;
        this.getSendMessage();
      },
      //操作分页
      sendCurrentChange(val) {
        this.sendParam.currPage = val;
        this.getSendMessage();
      },
      getSendMessage(){
        let vm = this;

        if(vm.userType == "stu"){
          vm.sendParam.idNum = vm.userInfo.stuNum;
        }else{
          vm.sendParam.idNum = vm.userInfo.tcNum;
        }
        vm.receParam.userType = vm.userType;
        vm.listLoading = true;
        global.post(api.getSendMessage,vm.sendParam,{header:{"Content-type":"application/json"}},function(res){
        let data = res.data;
         if(res.code == 200){ 
            vm.sendList = data.list;
            vm.sendParam.currPage = data.currPage;
            vm.sendParam.pageSize = data.pageSize;
            vm.sendtotal = data.totalSize;
            vm.listLoading = false;
         }else{
             vm.sendList = [];
             Message({
                  showClose: true,
                  message: data.message,
                  type: 'info'
              });
              vm.listLoading = false;
         }          
        },function(res){
            vm.listLoading = false;
        },false)
      },
      getReceiveMessage(){
        let vm = this;
        if(vm.userType == "stu"){
          vm.receParam.idNum = vm.userInfo.stuNum;
        }else{
          vm.receParam.idNum = vm.userInfo.tcNum;
        }
        vm.receParam.userType = vm.userType;
        vm.listLoading = true;
        global.post(api.getReceiveMessage,vm.receParam,{header:{"Content-type":"application/json"}},function(res){
        let data = res.data;
       if(res.code == 200){ 
          vm.receiveList = data.list;
          vm.receParam.currPage = data.currPage;
          vm.receParam.pageSize = data.pageSize;
          vm.recetotal = data.totalSize;
          vm.listLoading = false;
       }else{
           vm.receiveList = [];
           Message({
                showClose: true,
                message: data.message,
                type: 'info'
            });
            vm.listLoading = false;
       }          
      },function(res){
          vm.listLoading = false;
      },false)
    },
    //批量发件删除
    batchSendDetele(){
        let vm = this;
        var messageList = [];
        for(var index = 0; index < vm.sendmultipleSelection.length; index++){
           messageList.push(vm.sendmultipleSelection[index].emId);
        }
        if(messageList.length == 0){
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
          global.post(api.batchDelEmInfo,{messageList:messageList},{header:{"Content-type":"application/json"}},function(res){ 
            Message({
                showClose: true,
                message: res.data.message,
                type: 'success'
            }); 
            if(res.code == 200){ 
             vm.getSendMessage();
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
    //批量收件删除
    batchReceDetele(){
        let vm = this;
        var messageList = [];
        for(var index = 0; index < vm.recemultipleSelection.length; index++){
           messageList.push(vm.recemultipleSelection[index].emId);
        }
        if(messageList.length == 0){
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
          global.post(api.batchDelEmInfo,{messageList:messageList},{header:{"Content-type":"application/json"}},function(res){ 
            Message({
                showClose: true,
                message: res.data.message,
                type: 'success'
            }); 
            if(res.code == 200){ 
             vm.getReceiveMessage();
            }    
          },function(res){  
             Message({
                      showClose: true,
                      message: "服务器异常",
                      type: 'error'
             });
          },false);
        })
    }
  },
  created(){
    this.initWebSocket()
  }
};
</script>
<style type="text/css">
  .mainContainer1{
    width: 95%;
    margin-top:10px;
    margin-left: 2.5%;
    border:1px solid ;
    padding-top: 20px;
    padding-left: 25px;
    padding-bottom: 25px;
    padding-right: 45px;
    color: #48576a;
    border:1px solid rgb(238, 246, 244);
    border-radius: 4px;
    margin-bottom: 20px;
    box-shadow: 1px 1px 2px rgb(238, 246, 244);
    height: auto;
  }
  .el-tabs__item{
    width: 120px;
    text-align: center;
    font-weight: bold;
  }
  .el-table__row:hover{
    cursor: pointer;
  }
</style>
