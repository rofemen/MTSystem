<template>
<div style="text-align: center;margin-top: 15%;">
	<h2>课程申报成功，请等待管理员审批</h2>
	<h5 style="margin-top:40px; font-size: 16px;">该页面将于 {{time}} 秒后跳转到申报课程信息页面</h5>
</div>
</template>
<script>
    export default {
        data() {
          return {
          	 time:5
          }  
        },
        mounted() {
            var vm = this;
            vm.start();

        },
        methods: {
        	start:function(){
        		let vm = this;
                if(vm.$route.query.courseInfo == undefined){
                    vm.$router.push({ path: '/course/courseApply'});
                    return;
                }

        		var timer= setInterval(()=>{
        			if(vm.time > 0){
        				vm.time -= 1;
        			}else{
        				clearInterval(timer);
        				vm.$router.push({ path: '/course/courseInfo', query: {courseInfo:vm.$route.query.courseInfo,type:'show'} });
        			}
        			
            	},1000);
        	}
            
        }
    }
</script>