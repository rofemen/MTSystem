<template>
  <div class="app-container">
    <el-button type="primary" @click="websocketsend">发送</el-button>

  </div>
</template>

<script>
// import { getList } from 'api/article';
import {global} from 'src/global/global';
import {api} from 'src/global/api';

export default {
  data() {
    return {
       websock: null
    }
  },
  mounted() {
     this.threadPoxi();
  },
  methods: {
    threadPoxi(){  // 实际调用的方法
          //参数
          const agentData = "mymessage";
          //若是ws开启状态
          console.log("this.websock.OPEN",this.websock.OPEN);
          if (this.websock.readyState === this.websock.OPEN) {
              this.websocketsend(agentData)
          }
          // 若是 正在开启状态，则等待300毫秒
          else if (this.websock.readyState === this.websock.CONNECTING) {
              let that = this;//保存当前对象this
              setTimeout(function () {
                  that.websocketsend(agentData)
              }, 300);
          }
          // 若未开启 ，则等待500毫秒
          else {
              this.initWebSocket();
              let that = this;//保存当前对象this
              setTimeout(function () {
                  that.websocketsend(agentData)
              }, 500);
          }
      },
      initWebSocket(){ //初始化weosocket
          //ws地址
          const wsuri = "ws://localhost:8080/gp/webSocketServer?userId=" + 1;
          this.websock = new WebSocket(wsuri);
          this.websock.onmessage = this.websocketonmessage;
          this.websock.onclose = this.websocketclose;
          this.websock.onopen = this.websocketonOpen
      },
      websocketonmessage(e){ //数据接收
          const redata = JSON.parse(e.data);
          console.log(redata.value);
          console.log("接收",e);
      },
      websocketonOpen(e){ //数据接收
          console.log("open",e);
      },
      websocketsend(agentData){//数据发送
       
        this.websock.send("111");
        console.log(agentData);
      },
      websocketclose(e){  //关闭
          console.log("connection closed (" + e.code + ")");
      }
  },
  created(){
      this.initWebSocket()
  }
};
</script>
