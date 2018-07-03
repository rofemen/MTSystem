<template>
    <div class="">
        <el-menu class="navbar" mode="horizontal">
            
            <i class="fa fa-bars" @click="toggleSideBar" :isActive="sidebar.opened"></i>
           
            <tabs-view></tabs-view>
            
            <error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log>
            <screenfull class='screenfull'></screenfull>
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                    <el-badge :is-dot="isReceive" class="item">
                        <span class="user-name">{{userName}}</span>
                        <img class="user-avatar" :src="userIcon" id="userIconId">
                        <i class="el-icon-caret-bottom"></i>
                    </el-badge>
                </div>

                <el-dropdown-menu class="user-dropdown " slot="dropdown">
                    <router-link  to="/index/personalInfo">
                        <el-dropdown-item>
                            首页
                        </el-dropdown-item>
                    </router-link>
                        <el-dropdown-item class="clearfix">
                            <keep-alive>
                                <router-link  style="color: #48576a;" to="/index/myEmail">
                                    我的邮件
                                    <el-badge :is-dot="isReceive" style="top:6px;"/>
                                </router-link>
                            </keep-alive>
                        </el-dropdown-item>
                        <el-dropdown-item >
                            <span @click="dialogFormVisible = true" style="display: inline-block;width: 100%;">修改密码</span>
                        </el-dropdown-item>
                        <el-dropdown-item >
                            <span @click="dialogVisible = true" style="display: inline-block;width: 100%;">切换主题</span>
                        </el-dropdown-item>
                    <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-menu>

        <!-- 修改密码弹窗 -->
        <el-dialog title="密码修改" :visible.sync="dialogFormVisible" v-loading.body="loading" element-loading-text="更新中..">

            <el-form class="small-space" :model="passwordForm"  :rules="passwordFormRules" ref="passwordForm" label-position="right" label-width="100px" style='width: 400px;  margin: 25px auto 5px;'>
                <el-form-item label="原密码" prop="oldPassword" >
                  <el-input type="password" v-model="passwordForm.oldPassword" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="新密码" prop="newPassword">
                  <el-input type="password" v-model="passwordForm.newPassword" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="重复新密码" prop="newPassword2">
                  <el-input type="password" v-model="passwordForm.newPassword2" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>

              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false" style="margin-left:70px;margin-right: 20px;">取 消</el-button>
               
                <el-button type="primary" @click="handlePwdModifySubmit(passwordForm)">确 定</el-button>
              </div>
        </el-dialog>
        <!-- 换肤弹窗 -->
        <el-dialog title="更改主题颜色" :visible.sync="dialogVisible" >
              <el-form class="small-space" label-position="left" label-width="125px" style='width: 400px;margin: 10px auto 10px'>
                <el-form-item label="请选择主题颜色：" prop="resource">
                   <el-radio-group v-model="themeValue">
                        <el-radio label="blue">蓝色</el-radio>
                        <el-radio label="green">绿色</el-radio>
                        <el-radio label="red">红色</el-radio>
                   </el-radio-group>
                 </el-form-item>
              </el-form>

              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
               
                <el-button type="primary" @click="handleChangeTheme">确 定</el-button>
              </div>
        </el-dialog>    
    
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    
    import TabsView from './TabsView';
    
    import Screenfull from 'components/Screenfull';
    import ErrorLog from 'components/ErrLog';
    import errLogStore from 'store/errLog';

    import {global} from 'src/global/global';
    import Cookies from 'js-cookie';
    import {api} from 'src/global/api';
    import md5 from 'blueimp-md5';
    import { Message } from 'element-ui';

    export default {
      components: {
        TabsView,
        
        ErrorLog,
        Screenfull
      },
      data() {
        const validateNewPassword2 = (rule, value, callback) => {
                if (value !== this.passwordForm.newPassword) {
                  callback(new Error('两次输入密码不一致!'));
                } else {
                  callback();
                }
        };
        return {
            log: errLogStore.state.errLog,
            dialogVisible:false,
            dialogFormVisible:false,
            themeValue: localStorage.getItem("themeValue") ? localStorage.getItem("themeValue") : 'blue',
            userName:"",
            loading:"false",
            userIcon:"",
            passwordForm: {
                "oldPassword":'',
                "newPassword":'',
                "newPassword2":'',
            },
            websock: null,
            passwordFormRules: {
                oldPassword: [
                    { required: true, trigger: 'blur', message: '旧密码不能为空！'}
                ],
                newPassword: [
                    { required: true, trigger: 'blur', message: '新密码不能为空！'},
                ],
                newPassword2: [
                    { required: true, trigger: 'blur', message: '重复密码不能为空！'},
                    { required: true, trigger: 'blur' , validator: validateNewPassword2}
                ]
            },
        }
      },
      computed: {
        ...mapGetters([
          'sidebar',
          'userInfo',
          'userType',
          'isReceive'          
        ])
      },
       mounted() {
          var vm = this;
          if(Cookies.get("isReceive") == undefined || Cookies.get("isReceive") == ""){
            console.log(111,Cookies.get("isReceive"))
            vm.isReceive = false;
          }else{
            vm.isReceive = Cookies.get("isReceive");
          }
          if(vm.userType == "tc"){
            vm.userIcon = api.tcIconBaseUrl + vm.userInfo.tcExtra1+"?time="+new Date();
            vm.userName = vm.userInfo.tcName;
          }else{
            vm.userIcon = api.stuIconBaseUrl + vm.userInfo.stuExtra1+"?time="+new Date();
            vm.userName = vm.userInfo.stuName;
          }
          vm.threadPoxi();
      },
      methods: {
        //换肤
        handleChangeTheme(){
            var vm = this;
            global.changeTheme(vm.themeValue);
            this.dialogVisible = false;
        },
        handlePwdModifySubmit(formName){
            var vm = this;
            vm.$refs.passwordForm.validate(valid => {
                if (valid) {
                    vm.loading = true;
                    var userType = vm.userType;
                    var par = {
                            "prePassword": md5(vm.passwordForm.oldPassword),
                            "newPassword": md5(vm.passwordForm.newPassword),
                            "userType":userType
                    }
                    if(userType == "stu"){
                        par.userId = vm.userInfo.stuUserid;
                    }else{
                        par.userId = vm.userInfo.tcUserid;
                    }
                    global.post( api.resetPassWord,par,{header:{"Content-type":"application/json"}},function(res){
                           var data = res.data;
                           if(res.code == 200){ 
                                vm.loading = false;
                                Message({
                                    showClose: true,
                                    message: res.data.message,
                                    type: 'info'
                                });
                                vm.dialogFormVisible = false;
                           }else{
                                vm.loading = false;
                                Message({
                                    showClose: true,
                                    message: res.data.message,
                                    type: 'error'
                                });
                           }
                    },function(res){
                         vm.loading = false;
                         Message({
                                showClose: true,
                                message: "服务器异常，请稍后重试",
                                type: 'error'
                            });
                    },false)
                } else {
                    //校验错误
                  return false;
                }
            });
        },
        toggleSideBar() {
           //6-28
            $(this).toggleClass('is-active');
            this.$store.dispatch('ToggleSideBar')
        },
        logout() {
          this.$store.dispatch('LogOut').then(() => {
                location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        },
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
            vm.isReceive = true;
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
      }
    },
  created(){
    this.initWebSocket();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
    .user-dropdown{
        font-size: 14px;
        color: #48576a;
        font-weight: bold;
    }
    .user-dropdown a{
        color: rgb(51, 172, 116);
    }
    .dialog-footer{
        text-align: center;
        margin-bottom: 10px;
    }
    .dialog-footer button{
        width:100px;

    }
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        .fa-bars{
            cursor: pointer;
            line-height: 50px;
            height: 50px;
            float: left;
            padding: 0 15px;
        }
        /*.hideSidebar .fa-bars{
            display: none;
        }*/
        .fa-bars[isactive] {
            transform: rotate(90deg);
        }
        .hamburger-container {
            line-height: 50px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }
        .errLog-container {
            display: inline-block;
            position: absolute;
            right: 150px;
        }
        .screenfull{
             position: absolute;
             right: 90px;
             top: 16px;
             color: red;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            .avatar-wrapper {
                cursor: pointer;
               /* margin-top:5px;*/
                padding: 5px ;
                position: relative;
                height: 40px;
                line-height: 40px;
                .user-name{
                    float: left;
                    margin-right: 5px;
                    font-weight: bold;
                }
                
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 20px;
                    font-size: 12px;
                }
            }

        }
        
    }
    .el-badge__content{background:rgb(0, 136, 73);border-color: rgb(0, 136, 73);padding-top: -2px;}
</style>



