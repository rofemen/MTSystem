
const getters = {
  uid: state => state.user.uid,     //用户id
  sessionId: state => state.user.sessionId, //用户令牌
  userInfo: state =>state.user.userInfo,//用户所有信息
  userType: state =>state.user.userType,//用户类型
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews, //快速导航tab
  isReceive:state => state.user.isReceive, 
  permission_routers: state => {
    // 对应permission.js中的state.routers
        
            return  state.permission.routers;
       
   }, 
  addRouters: state => state.permission.addRouters
};
export default getters
