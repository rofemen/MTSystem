<template>
  <div class="app-container">
    
    <div v-if="classInfo.clCode != undefined" class="showMessage"> 
      <span>
        系别/连队：{{classInfo.dept.diName}}/{{classInfo.dept.company}}
      </span>
      <span>
        班级名称：{{classInfo.clName}}/{{classInfo.clRowname}}
      </span>  
      <span>
        辅导员：{{classInfo.instor.tcName}}
      </span>      
      <span>
        教官：{{classInfo.armyInstor.tcName}}
      </span>
      <span>
        年级：{{classInfo.clGrade}}级
      </span>   

     </div>
     <div v-if="classInfo.clCode == undefined" class="showMessage">您暂时未被分配到授教指定班级，请耐心等待</div>
    <div style="margin-top: 10px;margin-bottom: 5px;font-size: 13px;"><span style="color: red;font-weight: bold;">成绩录入须知（系统拟定等级的分数范围如下）：</span>
    <span style="font-family: 微软雅黑; font-weight: bold;">
      A( 90分 <= A <= 100分 )、
      B( 80分 <= B < 90分)、
      C( 70分 <= A < 80分)、
      不及格(60以下)
    </span>
    </div>
    
    <v-table
            is-horizontal-resize
            style="width:100%;font-weight: bold;"
            :columns="columns"
            :table-data="tableData"
            :is-loading="listLoading"
            row-hover-color="#eee"
            row-click-color="#edf7ff"
            :cell-edit-done="cellEditDone"
    ></v-table>
    <div class="saveButtonContainer" v-if="classInfo.clCode != undefined">
      <el-button type="primary" :disabled="saveIsDisable" class="buttonClass" @click="save">保存</el-button>
      <el-button  class="buttonClass" @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script>
import {global} from 'src/global/global';
import {api} from 'src/global/api';

import { Message } from 'element-ui';
// 引入样式
import 'vue-easytable/libs/themes-base/index.css'
// 导入 table 和 分页组件
import {VTable,VPagination} from 'vue-easytable'
export default {
  components: {
　　  VTable,VPagination
  },
  data() {
    const getColums = _ =>{
        let vm = this;
        var columns = [{field: 'stuId', title:'学号', width: 120, titleAlign: 'center',columnAlign:'center',
                    formatter: function (rowData,rowIndex,pagingIndex,field) {
                        return  `<span class='cell-edit-color'>${rowData[field]}</span>`;
                     },isResize:true,titleCellClassName :""},{field: 'stuName', title: '姓名', width: 150, titleAlign: 'center',columnAlign:'center',isResize:true}];
        $.ajax({
           url: api.getTcTecheredCi,
           type:'POST', //GET
           async:false, //或false,是否异步
           data:{
            tcNum:vm.$store.getters.userInfo.tcUserid
           },
           headers: {
              'Content-Type':"application/x-www-form-urlencoded"
           },
           success:function(data,textStatus,jqXHR){
              var tempData = $.parseJSON(data);
              if(tempData.code == 200){
                var tempList = tempData.data.list;
                for(var i = 0; i < tempList.length;i++){
                  var targetColumnsItem = 
                  {field: tempList[i].ciCode, title:  tempList[i].ciName, width: 150, titleAlign: 'center',columnAlign:'center',isEdit:true,isResize:true};
                  columns.push(targetColumnsItem);
                }
              }else{
                Message({
                        showClose: true,
                        message: tempData.data.message,
                        type: 'info'
                    });
              }
           }
          })
        columns.push({field: 'finalScore', title: '总评等级', width: 150, titleAlign: 'center',columnAlign:'center',
                    formatter: function (rowData,rowIndex,pagingIndex,field) {
                        var finalScore = rowData.finalScoreNum
                        if(finalScore == -1){
                          finalScore = "未评定";
                        }else if(finalScore >= 90){
                          finalScore = "A("+finalScore+")";
                        }else if(finalScore >= 80){
                           finalScore = "B("+finalScore+")";
                        }else if(finalScore >= 60){
                           finalScore = "C("+finalScore+")";
                        }else{
                           finalScore = "不及格("+finalScore+")";
                        }
                        if(finalScore.indexOf("不及格") != -1){
                          return  `<span style='color:red;'>${finalScore}</span>`;
                        }else{
                          return  `<span class='cell-edit-color'>${finalScore}</span>`;
                        }
                     },isResize:true});
        return columns;
    }
    return {
        list: null,//表格list [].push({})
        total: null,
        tcUserId:0,
        listLoading: true,
        dialogFormVisible: false,
        multipleSelection: [],
        dialogTitle:"添加教官信息",
        columns:getColums(),
        tableData: [
            ],
        classInfo:{},
        saveIsDisable:true
    }
  },
  mounted() {
    let vm = this;
    vm.tcUserId = vm.$store.getters.userInfo.tcUserid;

    vm.getList();
    vm.getClassInfo();
  },
  methods: {
    initTemp(){
      let vm = this;
    },
     getList() {
        let vm = this;
        vm.listLoading = true;
        global.post(api.getStudentInfoByTcNum,{tcNum:vm.tcUserId},{header:{"Content-type":"application/json"}},function(res){
                let data = res.data;
               if(res.code == 200){ 
                    console.log(data.list);
                    var studentList = data.list;
                    var columns = vm.columns;
                    for(var i = 0; i <studentList.length;i++){
                      var studentItem = {
                                          stuId:studentList[i].stuNum,
                                          stuName:studentList[i].stuName,
                                          stuUserId:studentList[i].stuUserid,
                                          finalScoreNum :studentList[i].stuFinalscore,
                                          
                      }
                      if(studentList[i].stuFinalscore == -1){
                        studentItem.finalScore = "未评定";
                      }else{
                         studentItem.finalScore = studentList[i].stuFinalscore;
                      }
                      for(var j = 0; j<columns.length; j++){
                          if(columns[j].field !="stuId" && columns[j].field !="stuName" && columns[j].field !="finalScore" && columns[j].field != "finalScoreNum" && columns[j].field != "stuUserId")
                          {
                            studentItem[columns[j].field] = 0;
                          }
                      }
                      vm.tableData.push(studentItem);
                    }
                    vm.getStudentScore();
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
    },
    getStudentScore() {
        let vm = this;
        vm.listLoading = true;
        global.post(api.getStudentScore,{tcNum:vm.tcUserId},{header:{"Content-type":"application/json"}},function(res){
                let data = res.data;
               if(res.code == 200){
                    var list = data.list; 
                    
                    var tableData = vm.tableData;
                    for(var i = 0; i< list.length;i++){
                      for(var j = 0 ; j < tableData.length; j++){
                            if(tableData[j].stuUserId == list[i].csStuUserid ){
                                tableData[j][list[i].csCiCode] = list[i].csScore;
                            }
                      }
                    }
                    console.log(tableData);
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
                    vm.list = null;
                    vm.listLoading = false;
        },false)
    },
    getClassInfo(roleType,tcNum) {
      let vm = this;
      vm.listLoading = true;
      global.post(api.selectByTcNum,{roleType:1,tcNum:vm.tcUserId},{header:{"Content-type":"application/json"}},function(res){
              let data = res.data;
             if(res.code == 200){
                  var classInfo = data.classInfo; 
                  
                  vm.classInfo = classInfo;
                  console.log("classInfo",classInfo);
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
    // 单元格编辑回调
    cellEditDone(newValue,oldValue,rowIndex,rowData,field){
        this.tableData[rowIndex][field] = parseFloat(newValue);
        
        if(newValue > 100 || newValue < 0){
          Message({
              showClose: true,
              message: "请输入0~100之间的值，小数点精确到百位",
              type: 'error'
            });
          this.tableData[rowIndex][field] = oldValue ; 
          return;
        }
        if(isNaN(newValue)){
          Message({
              showClose: true,
              message: "请输入0~100的数值，小数点精确到百位",
              type: 'error'
            });
          this.tableData[rowIndex][field] = oldValue ; 
          return;
        }
        rowData[field] = newValue;
        var sum = 0;
        var i = 0;
        for (var key in rowData)
        {   
           if( key != "stuId" && key != "stuName" && key != "finalScore" && key != "finalScoreNum" && key != "stuUserId"){
              i++;
              if(rowData[key] != ""){
                sum += parseFloat(rowData[key]);
              }else{
                sum += 0;
              }
           }
        }
        if(newValue != oldValue){
          var finalScore = sum/i;
          finalScore = finalScore.toFixed(2);
          this.tableData[rowIndex]['finalScoreNum'] = finalScore;
          if(finalScore >= 90){
            finalScore = "A("+finalScore+")";
          }else if(finalScore >= 80){
             finalScore = "B("+finalScore+")";
          }else if(finalScore >= 60){
             finalScore = "C("+finalScore+")";
          }else{
             finalScore = "不及格("+finalScore+")";
          }

          this.tableData[rowIndex]['finalScore'] = finalScore;
        }
        this.saveIsDisable = false;
        // 接下来处理你的业务逻辑，数据持久化等...
    },
    save(){
      let vm = this;
      vm.listLoading = true;
      let studentScoreItems = vm.tableData;
      let columns = vm.columns;
      var scoreItems = [];
      for(var i = 0; i < studentScoreItems.length;i++){
          var studentScoreItem = {
              stuUserId:studentScoreItems[i].stuUserId,
              finalScoreNum: studentScoreItems[i].finalScoreNum
          }
          for(var j = 0; j<columns.length; j++){
              if(columns[j].field !="stuId" && columns[j].field !="stuName" && columns[j].field !="finalScore" )
              {
                studentScoreItem[columns[j].field] = studentScoreItems[i][columns[j].field];
              }
          }
          scoreItems.push(studentScoreItem);
      }
      console.log("scoreItems",scoreItems);
      global.post(api.operateCourseScore,{scoreItems:scoreItems},{header:{"Content-type":"application/json"}},function(res){
                let data = res.data;
               if(res.code == 200){ 
                    console.log(data.list);
                    vm.listLoading = false;
                    Message({
                        showClose: true,
                        message: "成绩录入成功",
                        type: 'success'
                    });
                    vm.saveIsDisable = true;
                    
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
                    vm.list = null;
                    vm.listLoading = false;
        },false)
    },
    reset(){
      let vm = this;
      vm.tableData = [];
      vm.getList();
    }
  }
};
</script>
<style>
    .cell-edit-color{
        color:#2db7f5;
        font-weight: bold;
    }
    .v-table-header-inner{background: rgb(238, 246, 244);}
    .myTdClass{}
    .saveButtonContainer{
      text-align: center;margin-top: 20px;
    }
    .saveButtonContainer .buttonClass{
      margin-right: 20px;
      margin-left: 20px;
      width: 120px;
    }
    .showMessage{
      font-weight: bold;
      font-size:13px;
      margin-top: 5px;
      margin-bottom: 30px;
      padding-bottom:10px;
      border-bottom: 1px solid rgb(238, 246, 244);
    }
    .showMessage span{margin-right: 55px;}
</style>