<template>

	<div class = "mainContainer">
		<el-popover
		  ref="popover1"
		  placement="right"
		  width="400"
		  trigger="click">
		  <div style="background:red;width:10px;height: 10px;"></div>
		</el-popover>
		
		<div style="margin-bottom: 5rem;">
			<div class="titleContainer">
				<div style="position: absolute;left: -10%;width: 10%;border-bottom: 0px;border-right: 1px; background:rgb(238, 246, 244);"></div>
		    	<div>星期一</div><div>星期二</div><div>星期三</div><div>星期四</div><div>星期五</div>
		    </div>
		    <div class="scheduleContain">
			    <div class="leftTitle">
				    <div class="titleItem">
				    	<div>1 - 2节</div>
				    	<div>9:00 - 11:30</div>
				    </div>
			    	<div class="titleItem">
			    		<div>3-4节</div>
				    	<div>14:00 - 17:30</div>
				    </div>
			    	<div class="titleItem">
			    		<div>5-6节</div>
				    	<div>19:00 - 21:30</div>
				    </div>
				</div>
				<div class="color-show"  v-loading.body="listLoading">
				        <div 
				        v-for="item in list"
				        
				        class="color-box" 
				        :key="item.siIndex">
				       	<span v-if="item.siId != undefined" index="item.siIndex" >
				       		<div>{{item.siCourse.ciName}}</div>
				       		(<span v-for="n in item.siCourse.ciTimelong">{{ n }} &nbsp</span>周
				       		[
				       			<span>{{item.siCourse.ciExtra1}}</span>

				       		])
				       	</span>
				        </div>
				</div>
			</div>
		</div>

	</div>
</template>
<script>
import {global} from 'src/global/global';
import {api} from 'src/global/api';
import { Message } from 'element-ui';
import md5 from 'blueimp-md5';
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';

export default {
  	
	  data() {
	    return {
	    	listLoading:true,
	    	tcUserId:0,
	        list: [],
	        otherData:[],
	        chooiceCourse:[],
	        checkedDefault:[],
	        open: false,
	        courseInfo:[],
	        selectedOptions: [],
	        recordClickObject: 0,
	        classInfo:{},
	        isChange:false,
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
	  methods:{
	  	//获取列表数据
	    getList() {
	        let vm = this;
	        vm.listLoading = true;
	        global.post(api.getTeacherSchedule,{tcId:vm.userInfo.tcUserid},{header:{"Content-type":"application/json"}},function(res){
	                let data = res.data;
	               if(res.code == 200){ 
	                    vm.list = data.list;
	                    vm.listLoading = false;
	               }else{
	                   Message({
	                        showClose: true,
	                        message: data.message,
	                        type: 'info'
	                    });
	                    vm.list = [];
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
	    }

	}
};
</script>
<style type="text/css">
  
  .color-box.dragging {
      transform: scale(1.1);
  }
  .in-out-translate-fade-enter-active, .in-out-translate-fade-leave-active {
    transition: all .5s;
  }
  .in-out-translate-fade-enter, .in-out-translate-fade-leave-active {
    opacity: 0;
  }
  .in-out-translate-fade-enter {
    transform: translate3d(100%, 0, 0);
  }
  .in-out-translate-fade-leave-active {
    transform: translate3d(-100%, 0, 0);
  }
  .mainContainer{
  	position: relative;
  	right: 0px;
  }
  .color-show {
        display: flex;
        flex-wrap: wrap;
        width: 90%;  
    }
  .color-box {
    width: 20%;
    height:10rem;
	position: relative;
	text-align: center;
	color: black;
	transition: transform .3s;
	border: 1px solid rgb(223, 236, 231);
	border-radius: 2px;

	padding-top: 3.5rem;
    font-weight: bold;
    font-family: 微软雅黑;
  }
  .titleContainer{width: 90%;display: flex;margin-left: 6rem;position: relative; background:rgb(238, 246, 244);font-weight: bold;font-family: 微软雅黑;}

  .titleContainer div{width: 20%;text-align: center;border: 1px solid rgb(223, 236, 231);height:40px; line-height: 40px;}

  .scheduleContain{
  	display: inline-flex;
  	width: 100%
  }

  .leftTitle{
  	width: 6rem;text-align: center;font-weight: bold;font-family: 微软雅黑;
  }
  .leftTitle .titleItem{
  	width: 6rem;
  	height:160px;
  	padding-top: 3.5rem;
  	border-top:2px solid rgb(223, 236, 231);
  	border-radius: 2px;
  	margin-top:-0.5px;

  }
  .leftTitle .titleItem:last-child{
  	height:161px;
  	border-bottom: 1px solid rgb(223, 236, 231);
  }




</style>