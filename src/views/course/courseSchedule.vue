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
				        v-dragging="{ list: list, item: item, group: 'group',otherData: otherData }"
				        class="color-box" 
				        :key="item.siIndex">
				       	<span v-if="item.siId != undefined" index="item.siIndex" @click="forGetEven(item.siIndex)">
				       		 <el-cascader
							    :options="changeTo"
							    v-model="selectedOptions" 
							    @change="operateCascader"
							   style="position: absolute;right:0; top: -7px;">
							 </el-cascader>

				       		
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
		<div>
		
		
		</div>
		</el-transfer>
			<div class="saveOperate">
			  <div >
			  	<el-button @click="updateScheduleTimable" :disabled = "isChange"  type="primary" style="border-radius: 2px;vertical-align: top;">保存调整 </el-button>
			  	<mu-raised-button label="授课调整" class="el-button--primary" @click="toggle()"/>
			  </div>
			  <mu-drawer right :open="open" @close="toggle()">
			    <mu-appbar class="el-menu el-button--primary myDrawerClass" title="授课调整"/>
			    <div class="transferContainer">
			    	<el-transfer
			  			v-model="checkedDefault"
			  			:titles="['未开授课程', '已开授课程']"
			  			:button-texts="['不开授', '开授']"
			  			:right-default-checked ="checkedDefault"
			  			:data="data"
			  			@change="operateCourse"/>
			  		<el-button @click="toggle()" type="primary" class="closeButton">调整完毕 </el-button>
			    </div>
			  </mu-drawer>
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
  	components: {
　　	draggable
	},
	  data() {
	  	 const generateData = _ =>{
	  	 	let vm = this;
	  	 	const chooiceData = [];
	        global.post(api.getTcCouresInfo,{tcNum:vm.$store.getters.userInfo.tcUserid},{header:{"Content-type":"application/json"}},function(res){
	               let data = res.data;
	               if(res.code == 200){ 
	                    let tempData = data.list;
	                    vm.courseInfo =tempData;
				        for (let i = 0; i < tempData.length; i++) {
				        	console.log(tempData[i].ciName);
				          chooiceData.push({
				            key: tempData[i].ciCode,
				            label: tempData[i].ciName
				          });
				        }
	                    console.log("getTcCouresInfo",chooiceData);
	               }else{
	                   Message({
	                        showClose: true,
	                        message: resultData.message,
	                        type: 'info'
	                    });
	               }        
	        },function(res){
	            Message({
	                        showClose: true,
	                        message: "服务器异常，请稍后重试",
	                        type: 'error'
	                });

	        },false)	        
	        return chooiceData;
	    };
	    return {
	    	listLoading:true,
	    	tcUserId:0,
	        list: [],
	        otherData:[],
	        chooiceCourse:[],
	        data:generateData(),
	        checkedDefault:[],
	        open: false,
	        courseInfo:[],
	        selectedOptions: [],
	        recordClickObject: 0,
	        classInfo:{},
	        isChange:true,
	        changeTo:[{
	        	value: 'remove',
	            label: '移除'
	        },
	        {
	        	value: 'copyTo',
	            label: '复制到',
	            children: [{
	              value: 'mon',
	              label: '星期一',
	              children: [{
		              value: 'am',
		              label: '早上'
		            },{
		              value: 'pm',
		              label: '下午'
		            },{
		              value: 'night',
		              label: '晚上'
		            }]
	            },{
	              value: 'tue',
	              label: '星期二',
	              children: [{
		              value: 'am',
		              label: '早上'
		            },{
		              value: 'pm',
		              label: '下午'
		            },{
		              value: 'night',
		              label: '晚上'
		            }]
	            },{
	              value: 'wed',
	              label: '星期三',
	              children: [{
		              value: 'am',
		              label: '早上'
		            },{
		              value: 'pm',
		              label: '下午'
		            },{
		              value: 'night',
		              label: '晚上'
		            }]
	            },{
	              value: 'thu',
	              label: '星期四',
	              children: [{
		              value: 'am',
		              label: '早上'
		            },{
		              value: 'pm',
		              label: '下午'
		            },{
		              value: 'night',
		              label: '晚上'
		            }]
	            },{
	              value: 'fri',
	              label: '星期五',
	              children: [{
		              value: 'am',
		              label: '早上'
		            },{
		              value: 'pm',
		              label: '下午'
		            },{
		              value: 'night',
		              label: '晚上'
		            }]
	            }]
	        }]
	    }
	  },
	  mounted() {
	    let vm = this;
	   	vm.tcUserId = vm.$store.getters.userInfo.tcUserid;
	   	vm.getList();
	    this.$dragging.$on('dragged', ({value}) => {
	    	console.log(vm.list);
	    	vm.isChange = false;
	    });
	    vm.getClassInfo();
	   	
	  },
  		computed: {
	        ...mapGetters({
	            // 映射 this.personalInfo_init 为 store.getters.userInfo
	            userInfo:'userInfo',
	            userType:'userType',
	        })
	    },
	  methods:{
	  	toggle (flag) {
	      this.open = !this.open
	    },
	  	//获取列表数据
	    getList() {
	        let vm = this;
	        vm.listLoading = true;
	        global.post(api.getTcSchedule,{tcUserId:vm.tcUserId},{header:{"Content-type":"application/json"}},function(res){
	                let data = res.data;
	               if(res.code == 200){ 
	                    vm.list = data.list;
	                    vm.listLoading = false;
	                    vm.getCheckedDefault();
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
	      global.post(api.selectByTcNum,{roleType:1,tcNum:vm.tcUserId},{header:{"Content-type":"application/json"}},function(res){
	              let data = res.data;
	             if(res.code == 200){
	                  var classInfo = data.classInfo; 
	                  
	                  vm.classInfo = classInfo;
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
	                  vm.listLoading = false;
	      },false)
	    }
    	,
	    updateScheduleTimable(){
	    	let vm = this;
	        vm.listLoading = true;
	        var siClCode = vm.classInfo.clCode;
	        if(siClCode == undefined){
	        	vm.listLoading = false;
	        	vm.$message.info("请等待被指派负责班级之后再进行排课操作");
	        	return;
	        }
	        global.post(api.updateScheduleByList,{scheduleList:vm.list,siClCode:siClCode,tcNum:vm.userInfo.tcUserid},{header:{"Content-type":"application/json"}},
        	function(res){
                let data = res.data;
               if(res.code == 200){ 
               		vm.list = data.list;
                    vm.listLoading = false;
                    Message({
                        showClose: true,
                        message: data.message,
                        type: 'info'
                    });
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
	    operateCourse(rightValue,distance,items){
	    	let vm = this;
	    	var tempList = vm.list;
	    	var tempCourseInfo = vm.courseInfo;
	    	var tempData = vm.data;
	    	vm.isChange = false;
	    	if(distance == "right"){
	    		for(var j = 0; j < items.length; j++){
					for(var k = 0; k < tempCourseInfo.length; k++){
						if(items[j] == tempCourseInfo[k].ciCode){
							var isInsert = false;
							for(var i = 0; i < tempList.length;i++){
			    			    if(tempList[i].siCiCode == undefined && !isInsert){
			    					vm.list[i].siCiCode = items[j];
			    					vm.list[i].siClCode = vm.classInfo.clCode;
			    					vm.list[i].siIndex = tempList[i].siIndex;
			    					vm.list[i].siCourse = tempCourseInfo[k];
			    					vm.list[i].siTcNum = vm.tcUserId;
			    					vm.list[i].siId =-1 ;
			    					isInsert = true;
			    			    }
							}
						}
					}
				}

	    	}else{
	    		for(var j = 0; j < items.length; j++){
					for(var i = 0; i < tempList.length;i++){
		    			if(items[j] == tempList[i].siCiCode){
		    				tempList[i] = {siIndex:tempList[i].siIndex}
		    			}
					}
				}
				
	    	}
	    	vm.list = tempList;	
	    	
	    },
	    getCheckedDefault(){
	    	let vm = this;
	    	var tempList = vm.list;
	    	var tempCheckDefault = [];
	    	for(var i = 0; i < tempList.length; i++){
	    		if(tempList[i].siCiCode != undefined ){
	    			var isJoin = false;
	    			for(var j=0; j<tempCheckDefault.length;j++){
	    				if(tempCheckDefault[j] == tempList[i].siCourse.ciCode){
	    					isJoin = true;
	    				}
	    			}
	    			if(!isJoin){
	    				tempCheckDefault.push(
				            tempList[i].siCourse.ciCode
				        );
	    			}
	    			
	    		}
	    	}
	    	vm.checkedDefault = tempCheckDefault;
	    },
	    forGetEven(index){
	    	let vm = this;
	    	console.log(index);
	    	vm.recordClickObject = index;
	    }
	    ,
	    operateCascader(value){
	    	let vm = this;
	    	var list = vm.list;
	    	var tempRecordClickObject = vm.recordClickObject;
	    	var removeObjectCiId;
	    	var isExistCourse = false;
	    	vm.isChange = false;
	    	console.log(value);
	    	console.log(vm.recordClickObject);
	    	vm.selectedOptions = [];
	    	if(value[0] == "remove"){
	    		for(var i = 0; i<list.length; i++){
	    			if(tempRecordClickObject == list[i].siIndex){
	    				removeObjectCiId = list[i].siCiCode;
	    				vm.list[i] = {siIndex : list[i].siIndex}
	    			}
	    		}
	    		for(var i = 0; i<list.length; i++){
	    			if(removeObjectCiId == list[i].siCiCode){
	    				isExistCourse = true;
	    				break;
	    			}
	    		}
	    		if(!isExistCourse){
	    			for(var j = 0; j< vm.checkedDefault.length; j++){
	    				if(vm.checkedDefault[j] == removeObjectCiId){
	    					vm.checkedDefault.splice(j,1);
	    					break;
	    				}
	    			}
	    			
	    		}

	    	}else{
	    		switch(value[1]){
	    			case "mon":
	    				if(value[2] == "am"){
	    					vm.copyCourse(0);
	    				}else if(value[2] == "pm"){
	    					vm.copyCourse(5);
	    				}else{
	    					vm.copyCourse(10);
	    				};break;
	    			case "tue":
	    				if(value[2] == "am"){
	    					vm.copyCourse(1);
	    				}else if(value[2] == "pm"){
	    					vm.copyCourse(6);
	    				}else{
	    					vm.copyCourse(11);
	    				};break;
	    			case "wed":
	    				if(value[2] == "am"){
	    					vm.copyCourse(2);
	    				}else if(value[2] == "pm"){
	    					vm.copyCourse(7);
	    				}else{
	    					vm.copyCourse(12);
	    				};break;
	    			case "thu":
	    				if(value[2] == "am"){
	    					vm.copyCourse(3);
	    				}else if(value[2] == "pm"){
	    					vm.copyCourse(8);
	    				}else{
	    					vm.copyCourse(13);
	    				};break;
	    			case "fri":if(value[2] == "am"){
	    					vm.copyCourse(4);
	    				}else if(value[2] == "pm"){
	    					vm.copyCourse(9);
	    				}else{
	    					vm.copyCourse(14);
	    				};break;
	    		}
	    	}
		},
		copyCourse(index){
			let vm = this
			var list = vm.list;
			var tempRecordClickObject = vm.recordClickObject;
			console.log(tempRecordClickObject);
			if(list[index].siCiCode == undefined){
				for(var i = 0; i < list.length ;i++){
					if(tempRecordClickObject == list[i].siIndex){
	
						var targetItem = {}
						vm.list[index].siCiCode = list[i].siCiCode;
						vm.list[index].siCl = list[i].siCl;
						vm.list[index].siClCode = list[i].siClCode;
						vm.list[index].siCourse = list[i].siCourse;
						vm.list[index].siExtra1 = list[i].siExtra1;
						vm.list[index].siExtra2 = list[i].siExtra2;
						vm.list[index].siId = -1;
						vm.list[index].siTc = list[i].siTc;
						vm.list[index].siTcNum = list[i].siTcNum;
						vm.list[index].siIndex = vm.list[index].siIndex;

						break;
					}
				}
			}else{
				Message({
                    showClose: true,
                    message: "该时间段已经有开授课程，请先移除改课程",
                    type: 'info'
                });
			}
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
	cursor: move;
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
.el-transfer{font-size: 14px;height: 450px;}
.el-transfer__buttons button{width: 80px;}
.transferContainer{display:inline-block;margin-left:20px; margin-top:20px;}
.el-checkbox+.el-checkbox {
     margin-left: 0px; 
}
.el-button+.el-button{
	margin:0 auto;
}
.el-transfer-panel,.el-transfer-panel__list{height: 450px;}
.el-transfer-panel__item{
	display: block;
}
.el-transfer-panel__list{padding-bottom: 36px;}

.myDrawerClass{
	height: 49px;
}
.showTab{
	position: absolute;
	top:-45px;
	right:3.6%;
}
.saveOperate{    
	display: inline-block;
    position: absolute;
    top: -45px;
    right: 3.5%;
}
.mu-appbar-title{
	font-size:16px; height: 49px;line-height: 49px;padding-left: 20px;
}
.mu-drawer{
	height: 600px;
	width: 540px;
}
.closeButton{    

	margin-bottom: 20px;
    margin-top: 20px;
}
.operateMenu{
	position: absolute;
	right: 0;
}

.el-button-group .el-button:not(:last-child) {
    margin-right: -12px;
}
.subMemu{    
	position: absolute;
    background: red;
    top: 0;
    width: 80px;
    right: -80px;
    list-style: none;
}
.subMemu>li{
	position: relative;
	text-align: center;
    margin: 3px 0;

}
.subMemu>li>ul{
	position: absolute;
	width:80px;
	right: -80px;
	top:0;
}
ul{
	list-style: none;
	margin:0;
	padding:0;
}


.el-cascader input{display: none;}
.el-cascader .el-icon-caret-bottom.is-reverse{transform:unset;}

</style>