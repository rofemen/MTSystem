// import { loginByEmail, logout, getInfo } from 'api/login';
import Cookies from 'js-cookie';

import {global} from 'src/global/global';
import {api} from 'src/global/api';
// import store from '../../store';
import { Message } from 'element-ui';
import axios from 'axios';
const user = {
  state: {
    uid: Cookies.get('uid'),
    sessionId: Cookies.get('sessionId'),
    userType: Cookies.get('userType'),
    userInfo:null,
    isReceive:false
  },

  mutations: {
    SET_UID: (state, uid) => {
      state.uid = uid;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_SESSIONID: (state, sessionId) => {
      state.sessionId = sessionId;
    },
    SET_USERTYPE: (state, userType) => {
      state.userType = userType;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    SET_ISRECEIVE: (state, isReceive) => {
      state.isReceive = isReceive;
    },
    // LOGOUT_USER: state => {
    //   state.user = '';
    // }
  },

  actions: {
    // 邮箱登录
    LoginByEmail({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        global.post( api.login,userInfo,{}, function(res){
            //登录接口，可只返回token 和 uid 。然后可根据uid 查询用户信息
               if(res.code == 200){
                  // 按一天8小时工作制设置过期时间
                  Cookies.set('sessionId', res.data.sessionId,{ expires: 1/3}); //设置token
                  Cookies.set('uid', res.data.uid,{ expires: 1/3}); //设置用户id，
                  Cookies.set('userType', userInfo.userType,{ expires: 1/3}); //设置用户id，
                  commit('SET_SESSIONID', res.data.sessionId);
                  commit('SET_UID', res.data.uid);
                  commit('SET_USERTYPE',  userInfo.userType);
                  //commit('SET_TOKEN', res.data.sessionId);
                  //设置userInfo
                  //commit('SET_USERINFO', res); //此处也可省略，放在getUserInfo中统一处理

                }else{
                     Message({
                      showClose: true,
                      message: res.data.message,
                      type: 'error'
                    });
                }
                resolve();
        },function(res){
            Message({
              showClose: true,
              message: "服务器异常",
              type: 'error'
            });
            reject(res);
        })

        return false;

      });
    },

    // 获取用户信息
    GetInfo({ dispatch,commit, state }) {
        return new Promise((resolve, reject) => {
            var userType = state.userType;
            var requestUrl = api.getStuInfo;//获取学生信息
            var params = {stuId :state.uid}
            if(userType == "tc"){
              requestUrl = api.getUserInfo;//获取教师信息
              params = {tcId :state.uid}
            }         
            global.get( requestUrl,{params:params}, function(res){
                  console.log('-------根据id获取用户信息：',res);
                  if(res.body.code == 200){
                       var res = res.body.data;
                             
                             // Cookies.set('userToken', res.token); //Cookies.get('userId')
                             // Cookies.set('userId', res.uid); //Cookies.get('userId')
                             //commit('SET_TOKEN', res.token);
                             //设置userInfo
                             commit('SET_USERINFO', res.userInfo);

                             //获取到信息时同时设置用户菜单权限
                             // store.dispatch('GenerateRoutes', res.permissions); 等同于
                             console.log(res.userPermission);
                             dispatch('GenerateRoutes', res.userPermission);

                             resolve();
                  }else{
                        //alert(res.body.resultMsg)
                        Message({
                            showClose: true,
                            message: res.body.resultMsg,
                            type: 'error'
                        });
                  }

                  
            },function(res){
                reject(res);
            })

            
        });
    },

    

    // 第三方验证登录
    LoginByThirdparty({ commit, state }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_CODE', code);
        loginByThirdparty(state.status, state.email, state.code, state.auth_type).then(response => {
          commit('SET_TOKEN', response.data.token);
          Cookies.set('userToken', response.data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },


    // 登出 （头部登出）
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        //换成请求登出接口

        // logout(state.token).then(() => {  

          // commit('SET_ROLES', []);
          Cookies.remove('sessionId');
          Cookies.remove('uid');
          resolve();
        // }).catch(error => {
        //   reject(error);
        // });
      });
    },


    // 动态修改权限
    ChangeRole({ commit }, role) {
      return new Promise(resolve => {
        // commit('SET_ROLES', [role]);
       //store.dispatch('GenerateRoutes', res.permissions);
        dispatch('GenerateRoutes', res.permissions);
        resolve();
      })
    }
  }
};

export default user;
