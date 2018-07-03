<template>
<div class="appContain">

  <div v-if="userType=='stu'" class="mainContainerMyShare" v-loading.body="loading" element-loading-text="发布中....">
    <div style="margin-bottom:20px;color: #48576a;border-bottom: 1px solid rgb(238, 246, 244);font-weight: bold;font-size: 15px;padding-bottom: 5px;">分享栏</div>
    <div>
        <el-row>
          <el-col :span="2" style="font-weight: bold;font-size: 15px;">发布内容：</el-col>
          <el-col :span="22">
            <el-input  type="textarea" v-model="shareContent" :rows="5" placeholder="晒晒你的军训照，分享你的心情..." id="shareContent" style=""></el-input>
          </el-col>
        </el-row>
    </div>
    <div class="selectPic">
      <el-row>
          <el-col :span="2">&nbsp</el-col>
          <el-col :span="19">
            <el-upload
                action="http://localhost:8080/gp/testController/test"
                list-type="picture-card"
                :data = "forUpload"
                :auto-upload="false"
                ref="upload"
                :on-preview="handlePictureCardPreview"
                :on-change="uploadChange"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
          </el-col>
          <el-col :span="3" style="text-align: right;"><el-button type="primary" class="publicShare"  @click="publicShare()">发布</el-button></el-col>
        </el-row>
      
    </div>
  </div>
  <div class="mainContainerMyShare">
    <div style="margin-bottom:20px;color: #48576a;border-bottom: 1px solid rgb(238, 246, 244);font-weight: bold;font-size: 15px;padding-bottom: 5px;">校园圈</div>
    <div>
      <el-row v-for="shareItem  in  shareList" :key="shareItem.shareId" :shareId="shareItem.shareId" class="shareItem">
        <el-col :span="3" style="text-align: center;"><img width="100" height="100" :src="userIcon+shareItem.publisher.stuExtra1" style="border-radius: 6px;" alt=""></el-col>
        <el-col :span="21">
          <div>
            <div class="userName">{{shareItem.publisher.stuName}}</div>
           
            <div style="margin-bottom: 5px;line-height: 28px;font-size: 15px;height: 79px">{{shareItem.shareContent}}</div>
            <div class="imgContain">
              <el-row :gutter="20" >
                <el-col :span="6" v-if="shareItem.sharePic1 != undefined"><img index="0" :src="baseIconUrl+shareItem.sharePic1" alt=""></el-col>
                <el-col :span="6" v-if="shareItem.sharePic2 != undefined"><img index="1" :src="baseIconUrl+shareItem.sharePic2" alt=""></el-col>
                <el-col :span="6" v-if="shareItem.sharePic3 != undefined"><img index="2" :src="baseIconUrl+shareItem.sharePic3" alt=""></el-col>
                <el-col :span="6" v-if="shareItem.sharePic4 != undefined"><img index="3" :src="baseIconUrl+shareItem.sharePic4" alt=""></el-col>
              </el-row>
            </div>
            <div id="publicItem">
              <div style="position: relative;margin-bottom: 10px">
                <div style="color:#737373;font-size: 13px;margin-top: 2px;">时间：{{shareItem.shareTime}}</div>
                <div v-if="userType=='stu'" style="position: absolute;right: -46px;top: -20px;">
                  <el-row style="height: 50px;width: 80px;text-align: right;">
                    <!--right:15px<el-col :span="1" style="margin-right:50px;" v-if="isZan"><i class="fa fa-thumbs-o-up zanClass" aria-hidden="true"  @click="zan()"></i></el-col>
                    <el-col :span="1" style="margin-right:50px;" v-else><i class="fa fa-thumbs-up zanedClass" aria-hidden="true"   @click="zan()"></i></el-col>-->
                    <el-col :span="1" style="margin-left:-10px;margin-top: -3px;"><i class="fa fa-commenting-o commit" aria-hidden="true" :shareItem="shareItem.shareId" :sharePublisher="shareItem.sharePublisher" @click="commitClick"></i></el-col>
                  </el-row>
                </div>
              </div>

              <div class="inputComment" v-if="userType=='stu'">
                <div><el-input  type="textarea" v-model="commentContent" :rows="2" placeholder="评论..." id="shareContent" style="margin-top: 10px;"></el-input></div>
                <div style="text-align: right;margin-top: 10px;" ><el-button type="primary" class="publicShare" :shareId="shareItem.shareId" @click="handlepublicShare"
                  >评论</el-button></div>
              </div>
              <div class="commentContainer" v-if="shareItem.cms != undefined" >
                <div v-for="cmsItem in shareItem.cms" :key="cmsItem.cmId" class="commentItem" :sendUserId="cmsItem.sender.stuUserid" :sendName="cmsItem.sender.stuName" 
                :receerUserId="cmsItem.receer.stuUserid" :receerName="cmsItem.receer.stuName" :sharePublisher="shareItem.sharePublisher" >
                    <div><span style="font-weight: bold;">{{cmsItem.sender.stuName}}
                      <span v-if="shareItem.sharePublisher != cmsItem.receer.stuUserid">回复 {{cmsItem.receer.stuName}}</span>:</span>{{cmsItem.cmContent}}</div>
                    <div class="commentTime">
                      <el-row style="margin:0;"><el-col :span="5">时间：{{cmsItem.cmTime}}</el-col><el-col :span="19" style="text-align: right;padding-right: 10px;"><span :cmsItemId="cmsItem.cmId" v-if="cmsItem.sender.stuUserid==userInfo.stuUserid" @click="deleteCommentDetail">删除</span></el-col></el-row>
                    </div>
                   
                </div>
               
              </div>
            </div>
        </div>
          
        </el-col>
      </el-row>

    </div>
    <div v-show="!listLoading" style="text-align: center;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currPage"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
   </div>
  </div>
  <div class="showPicContain" v-if="showPicContain">
    <carousel-3d 
    ref="showPicContain"
    :startIndex="startIndex"
    :display = "display"
    dir = "rtl"
    :controlsVisible="true"
     width="500" height="500" style="height: auto;width: 80%;margin:0 auto">
        <slide v-for="item in picList" :key="item.index"  :index="item.index">
          <img :src="item.cover" width="500" height="500" alt="">
        </slide>
    </carousel-3d>
  </div>
   <div class="overlayer" @touchmove.prevent >
     <i class="fa fa-remove myRemove" id="closePicShow" aria-hidden="true"></i>
   </div>

</div>

</template>

<script>
  import { mapGetters } from 'vuex';
  import { coverflow } from 'vue-coverflow'
  import { Carousel3d, Slide } from 'vue-carousel-3d';
  import {global} from 'src/global/global';
  import {api} from 'src/global/api';
  import { Message } from 'element-ui';
  export default {
    components: {
　　  coverflow,
      Carousel3d,
      Slide
    },
    computed: {
        ...mapGetters({
            // 映射 this.personalInfo_init 为 store.getters.userInfo
            userInfo:'userInfo',
            userType:'userType',
        })
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        shareContent:"",
        forUpload:{},
        loading:false,
        listLoading:false,
        shareList:[],
        fileLength:0,
        userIcon:api.stuIconBaseUrl,
        baseIconUrl:"http://localhost:8080/gp/share/",
        isZan:true,
        publicPicCount:0,
        startIndex:1,
        display:4,
        commentContent:"",
        showPicContain:true,
        recordReceerId:0,
        listQuery: {
            currPage: 1,
            pageSize: 10,
        },
        total:0,
        picList: [
          
        ]
      };
    },
    mounted() {
      let vm = this;
     
      vm.getList();
      vm.bindClickPublicItem();
    }
    ,
    methods: {
      getList(){
        let vm = this;
        vm.listLoading = true;
        global.post(api.getShareInfo,vm.listQuery,{header:{"Content-type":"application/json"}},function(res){
                let data = res.data;
               if(res.code == 200){ 
                    vm.shareList = data.list;
                    console.log('shareList',vm.shareList);
                    vm.listLoading = false;
                    vm.total = data.total;
               }else{
                   Message({
                        showClose: true,
                        message: data.message,
                        type: 'info'
                    });
                    vm.shareList = [];
                    vm.listLoading = false;
               }          
        },function(res){
            Message({
              showClose: true,
              message: "服务器异常，请稍后重试",
              type: 'info'
            });
            vm.listLoading = false;
        },false)
      }
      ,
      handleRemove(file, fileList) {
        let vm = this;
        vm.fileLength = fileList.length;
      },
      uploadSuccess(response, file, fileList){
        console.log("response", response);
        let vm = this;
        if(file.uid == fileList[fileList.length-1].uid){
            vm.requestShareConte(fileList);
        }
       
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
    },
       beforeUpload(file){
        var vm = this;
        vm.forUpload.fileId = file.uid;
        vm.forUpload.userType = vm.userType;
        if(vm.userType == "stu"){
          vm.forUpload.userId = vm.userInfo.stuUserid;
        }else{
          vm.forUpload.userId = vm.userInfo.tcUserid;
        }
      },

      uploadChange(file, fileList){
        var vm = this ;
        const isJPG = file.raw.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        if(fileList.length>4){
          this.$message.error('最多只能上传4张图片');
          fileList.splice(4,fileList.length-4);
        }
        var result = isJPG && isLt2M;
        if(result){
            vm.fileLength = fileList.length;
        }else{
          fileList.splice(fileList.length-1,1);
        }
      },
      requestShareConte(fileList){
            let vm = this;
            var sharePics = [];
            var params = {}
            var shareContent = vm.shareContent;
            for(var i = 0; i < fileList.length; i++){
                var temp = fileList[i].raw.type;
                temp = temp.substring(temp.indexOf("/")+1);
                sharePics.push(fileList[i].uid+".jpg");
            }
            params.shareContent = shareContent;
            params.sharePics = sharePics;
            params.userType = vm.userType;
            if(vm.userType == "stu"){
              params.userId = vm.userInfo.stuUserid;
            }else{
              params.userId = vm.userInfo.tcUserid;
            }
            global.post(api.publicShare,params,{header:{"Content-type":"application/json"}},function(res){
                var data = res.data;
                if(res.code==200){
                    vm.fileLength = 0;
                    vm.shareContent = "";
                    vm.$refs.upload.clearFiles();
                    Message({
                            showClose: true,
                            message: data.message,
                            type: 'info'
                    });
                    vm.getList();
                }else{
                    Message({
                            showClose: true,
                            message: data.message,
                            type: 'info'
                    });
                }
                vm.loading = false;
            },function(res){
              Message({
                showClose: true,
                message: "服务器异常，请稍后重试",
                type: 'info'
              });
               
            },false)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handlepublicShare(e){
        let vm = this;
      
        var receerId = vm.recordReceerId;
        var commentContent = vm.commentContent;
        var shareId = parseInt($(e.target).parents(".shareItem").attr("shareId"));
        if(commentContent == ""){
          Message({
              showClose: true,
              message: "请输入评论内容",
              type: 'info'
          });
          return;
        }
        var params = {
          commentContent:commentContent,
          senderId:vm.userInfo.stuUserid,
          receId:receerId,
          shareId:shareId
        }

       global.post(api.publicCommentDetail,params,{header:{"Content-type":"application/json"}},function(res){
                var data = res.data;
                if(res.code==200){
                    Message({
                            showClose: true,
                            message: data.message,
                            type: 'info'
                    });
                    $(e.target).parents("#publicItem").find(".inputComment").hide(100);
                    vm.commentContent = "";
                    vm.getList();

                }else{
                    Message({
                            showClose: true,
                            message: data.message,
                            type: 'info'
                    });
                    vm.commentContent = "";
                }
                vm.loading = false;
            },function(res){
              Message({
                showClose: true,
                message: "服务器异常，请稍后重试",
                type: 'info'
              });
              vm.commentContent = ""; 
            },false)

      },
      publicShare(e){
        var vm = this;
        if(vm.shareContent == ""){
           vm.$message.info('请您输入发布内容');
           return;
        }
        vm.loading = true;
        if(vm.fileLength == 0){
          vm.requestShareConte([]);
        }
        
        this.$refs.upload.submit();
      },
      zan(){
        let vm = this;
        vm.isZan = !vm.isZan;
      },
      commitClick(e){
        let vm = this;
        var display = $(e.target).parents("#publicItem").find(".inputComment").css("display");
        if(display == "none"){
          var $inputComment = $(e.target).parents("#publicItem").find(".inputComment").show(100);
          $inputComment.find("[type='textarea']").attr("placeholder","评论....");
          vm.recordReceerId = parseInt($(e.target).attr("sharePublisher"));
          console.log(vm.recordReceerId);
        }else{
          $(e.target).parents("#publicItem").find(".inputComment").hide(100);
        }
        
      },
      deleteCommentDetail(e){
        let vm = this;
        var cmsItemId = parseInt($(e.target).attr("cmsItemId"));
        global.post(api.deleteCommentDetail,{cmId:cmsItemId},{header:{"Content-type":"application/json"}},function(res){
                var data = res.data;
                if(res.code==200){
                    Message({
                            showClose: true,
                            message: data.message,
                            type: 'info'
                    });
                    vm.getList();
                }else{
                    Message({
                            showClose: true,
                            message: data.message,
                            type: 'info'
                    });
                }
                vm.loading = false;
            },function(res){
              Message({
                showClose: true,
                message: "服务器异常，请稍后重试",
                type: 'info'
              });
            },false)
        e.stopPropagation();
      },
      change(){
        let vm = this;
        vm.picList[0].cover=vm.userIcon;
      },

      bindClickPublicItem(){
       let vm = this;
       vm.showPicContain = false;
       // $(".showPicContain").hide();
       console.log($(".commentItem"));
        $("body").on("click",".commentItem",function(){
           var sendName = $(this).attr("sendName");
            var sendUserId = parseInt($(this).attr("sendUserId"));
            var receerUserId = parseInt($(this).attr("receerUserId"));
            var receerName = $(this).attr("receerName");
            var sharePublisher = $(this).attr("sharePublisher");
            console.log(sendUserId);
            if(sendUserId != vm.userInfo.stuUserid){
                var $inputComment = $(this).parents("#publicItem").find(".inputComment").show(100);
                $inputComment.find("[type='textarea']").attr("placeholder","回复"+sendName+"....");
              vm.recordReceerId = sendUserId
            }
        })
        //遮罩层关闭
        $("#closePicShow").click(function(e){
            $(".overlayer").hide();
            //$(".showPicContain").hide();
            vm.showPicContain = false;
            $("body").css("overflow","unset");
        });
        
        $("body").on("click",".imgContain img",function(e){
            vm.picList = [];
            var first = $(this).attr("src");
            var firstIndex = parseInt($(this).attr("index"));
            var imgs = $(this).parents(".imgContain").find("img");
            vm.startIndex = firstIndex
            vm.picList.push({
                index:firstIndex,
                cover: first
            });
            console.log("first",firstIndex);
            for(var i = 0; i < imgs.length; i++){
              var tempSrc = $(imgs[i]).attr("src");
              var tempIndex = parseInt($(imgs[i]).attr("index"));
              console.log("tempIndex",tempIndex);
              if(tempIndex == firstIndex){continue;}
              vm.picList.push({
                index:tempIndex,
                cover: tempSrc
              });
            }
            
            console.log(vm.picList);
            $("body").css("overflow","hidden");
            $(".overlayer").show();
            
            //$(".showPicContain").show();
             vm.showPicContain = true;
             
            console.log("showPicContain",vm.$refs);
            

        })
      }
    }
  }

</script>
<style type="text/css">
  .selectPic{
    margin-top: 15px;
  }
  .publicShare{
    width: 100px;
  }
  .mainContainerMyShare{
    width: 90%;
    margin-top:20px;
    margin-left: 5%;
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
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .appContain{
    color: #48576a;
    position: relative;
  }
  .imgContain img{
    margin-right: 6px;
    border-radius: 6px;
    width: 200px;
    height: 200px;
  }
  .userName{
    color: rgb(0, 151, 81);
    font-size: 14px;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .zanClass{font-size: 24px; margin-top: 15px;cursor: pointer;width: 40px;}
  .zanClass:hover{
    color: rgb(0, 151, 81);
    cursor: pointer;
  }
  .zanedClass{
    font-size: 26px;
    color: rgb(0, 151, 81);
    margin-top: 15px;
    cursor: pointer;
    width: 40px;
  }
  .zanedClass:hover{
    color: rgb(0, 151, 81);
    cursor: pointer;
  }
  .commit{font-size: 24px; margin-top: 15px;cursor: pointer;width: 40px;}
  .commit:hover{cursor: pointer;color: rgb(0, 151, 81);}
  .commentItem{
    background: rgb(238, 246, 244);width: 98%;margin-left: 10px;padding-top: 5px;line-height: 28px;padding-right: 25px;
    border-top: 1px solid ;
    cursor: pointer;
  }
  .commentItem:first-child{
    border-top: 0;
  }
  .commentTime{font-size: 12px;color:#999;cursor: pointer;};
  .commentItem:active{
    background: rgb(85, 193, 143);
  }
  .commentContainer{
    
    border-radius: 6px;
    background: rgb(238, 246, 244);
  }
  .inputComment{
    margin-bottom:10px;padding-bottom:10px;border-bottom: 1px solid rgb(238, 246, 244);display: none;
  }
  .overlayer{
    position:fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    z-index:10;
    background: black;
    opacity: 0.5;
    display: none;
  } 
  .myRemove{
        font-size: 51px;
        height: 51px;
        width: 51px;
        position: absolute;
        right: 100px;
        top: 51px;
        cursor: pointer;
  }
  .showPicContain{
    position: fixed;top:18%;z-index:100;width: 90%;height: 100%;text-align: center;
  }
  .shareItem{
    border-top:1px solid rgb(238, 246, 244);padding-top: 15px;
  }
  .shareItem:first-child{border-top:0px solid red;padding-top: 5px;}
</style>
