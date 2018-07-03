<template>
    <div>
        <!-- 注意：路由表不能配置在后端，不然前端无法配置跳转到某些路由，例如提交成功后返回至某个固定路由 lss 2017-6-27 -->
        <!-- 菜单权限json（调试专用）：==={{ routes | json }} -->
        
        
        <template v-if="routes">
            <router-link  to="/index/personalInfo" >
                <el-menu-item index="/index/personalInfo">
                    <i class="fa fa-home" aria-hidden="true"></i> 首页
                </el-menu-item>
            </router-link>
            <router-link  to="/student/studentSchedule" v-if="routes['student/studentSchedule']">
                <el-menu-item index="/student/studentSchedule">
                    <i class="fa fa-home" aria-hidden="true"></i> 学生课表信息
                </el-menu-item>
            </router-link>
            <el-submenu index="教学评价" v-if="routes['studentsManage/evaluation/instorEi']||routes['studentsManage/evaluation/courseListEi']||routes['studentsManage/evaluation/tutorEi']">
                <template slot="title">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 教学评价
                </template>
                <router-link  class="menu-indent" to="/studentsManage/evaluation/instorEi" v-if="routes['studentsManage/evaluation/instorEi']">
                    <el-menu-item index="/studentsManage/evaluation/instorEi">
                        辅导员评价
                    </el-menu-item>
                </router-link>
                <router-link  class="menu-indent" to="/studentsManage/evaluation/courseListEi" v-if="routes['studentsManage/evaluation/courseListEi']">
                    <el-menu-item index="/studentsManage/evaluation/courseListEi">
                        课程评价列表
                    </el-menu-item>
                </router-link>
                <router-link  class="menu-indent" to="/studentsManage/evaluation/tutorEi" v-if="routes['studentsManage/evaluation/tutorEi']">
                    <el-menu-item index="/studentsManage/evaluation/tutorEi">
                        导师评价
                    </el-menu-item>
                </router-link>
            </el-submenu>
            <router-link  to="/teacher/teacherSchedule" v-if="routes['teacher/teacherSchedule']">
                <el-menu-item index="/teacher/teacherSchedule">
                    <i class="fa fa-home" aria-hidden="true"></i> 教师课表信息
                </el-menu-item>
            </router-link>

            
            
            
            <!--教官管理-->
            <el-submenu index="教官管理" v-if="routes['army/soldierInfoList']||routes['army/batchTeacherInfo']"> 
                <template slot="title">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 教官管理
                </template>
                    <router-link  class="menu-indent" to="/army/soldierInfoList" v-if="routes['army/soldierInfoList']">
                        <el-menu-item index="/army/soldierInfoList">
                            教官信息列表
                        </el-menu-item>
                    </router-link>
                    <router-link  class="menu-indent" to="/army/batchTeacherInfo" v-if="routes['army/batchTeacherInfo']">
                        <el-menu-item index="/army/batchTeacherInfo">
                            教官信息批量添加
                        </el-menu-item>
                    </router-link>
            </el-submenu>
            <!--教师信息管理-->
            <el-submenu index="导师信息列表" v-if="routes['tutor/tutorTeacherList']||routes['/tutor/batchTutorTeacherInfo']"> 
                <template slot="title">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 导师信息管理
                </template>
                    <router-link  class="menu-indent" to="/tutor/tutorTeacherList" v-if="routes['tutor/tutorTeacherList']">
                        <el-menu-item index="/tutor/tutorTeacherList">
                            导师信息列表
                        </el-menu-item>
                    </router-link>
                    <router-link  class="menu-indent" to="/tutor/batchTutorTeacherInfo" v-if="routes['tutor/batchTutorTeacherInfo']">
                        <el-menu-item index="/tutor/batchTutorTeacherInfo">
                            导师信息批量添加
                        </el-menu-item>
                    </router-link>
            </el-submenu>
             <!--教官管理-->
           <el-submenu index="学生信息管理" v-if="routes['studentsManage/studentList']||routes['studentsManage/studentAdd']"> 
                <template slot="title">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 学生信息管理
                </template>
                    <router-link  class="menu-indent" to="/studentsManage/studentList" >
                        <el-menu-item index="/studentsManage/studentList">
                            学生信息列表
                        </el-menu-item>
                    </router-link>

                    <router-link  class="menu-indent" to="/studentsManage/studentAdd" >
                        <el-menu-item index="/studentsManage/studentAdd">
                            学生信息批量添加
                        </el-menu-item>
                    </router-link>
            </el-submenu>

           

            <router-link  to="/class/classInfoList" v-if="routes['class/classInfoList']">
                <el-menu-item index="/class/classInfoList">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 连排信息管理
                </el-menu-item>
            </router-link>
            <router-link  to="/army/instorDetail" v-if="userType='tc'&&routes['army/instorDetail']">
                <el-menu-item index="/army/instorDetail">
                    <i class="fa fa-home" aria-hidden="true"></i> 辅导员评价详情
                </el-menu-item>
            </router-link>
            <router-link  class="menu-indent" to="/studentsManage/studentShowList" v-if="routes['studentsManage/studentShowList']">
               <el-menu-item index="/studentsManage/studentShowList">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i>学生信息
                </el-menu-item>
            </router-link>
            <el-submenu index="课程管理" v-if="routes['course/courseApply']||routes['course/awaitPassCourse']||routes['course/courseSchedule']||routes['course/ScoreRegister']"> 
                <template slot="title">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 课程管理
                </template>
                    <router-link  class="menu-indent" to="/course/courseApply" v-if="routes['course/courseApply']">
                        <el-menu-item index="/course/courseApply">
                            课程申报
                        </el-menu-item>
                    </router-link>
                    <router-link  class="menu-indent" to="/course/courseList" v-if="routes['course/courseList']">
                        <el-menu-item index="/course/courseList">
                            课程列表
                        </el-menu-item>
                    </router-link>
                    <router-link  class="menu-indent" to="/course/awaitPassCourse" v-if="routes['course/awaitPassCourse']">
                        <el-menu-item index="/course/awaitPassCourse">
                            课程审批
                        </el-menu-item>
                    </router-link>
                    <router-link  class="menu-indent" to="/course/courseSchedule" v-if="routes['course/courseSchedule']">
                        <el-menu-item index="/course/courseSchedule">
                            课表安排
                        </el-menu-item>
                    </router-link>
                    <router-link  class="menu-indent" to="/course/ScoreRegister" v-if="routes['course/scoreRegister']">
                        <el-menu-item index="/course/ScoreRegister">
                            成绩录入
                        </el-menu-item>
                    </router-link>
            </el-submenu>
            <router-link  class="menu-indent" to="/army/classSchedule" v-if="routes['army/classSchedule']">
               <el-menu-item index="/army/classSchedule">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i>班级课表
                </el-menu-item>
            </router-link>
            

             <router-link  to="/army/tutorDetail" v-if="routes['army/tutorDetail']">
                <el-menu-item index="army/tutorDetail">
                    <i class="fa fa-home" aria-hidden="true"></i> 导师评价详情
                </el-menu-item>
            </router-link>   
            <router-link  to="/army/courseEiDetail" v-if="routes['army/courseEiDetail']">
                <el-menu-item index="/army/courseEiDetail">
                    <i class="fa fa-home" aria-hidden="true"></i> 课程评价详情
                </el-menu-item>
            </router-link>
             <router-link  to="/army/diaryList" v-if="routes['army/diaryList']">
                <el-menu-item index="/army/diaryList">
                    <i class="fa fa-table" aria-hidden="true"></i> 日记管理
                </el-menu-item>
            </router-link>
            <router-link  to="/student/myDiaryList" v-if="routes['student/myDiaryList']">
                <el-menu-item index="/student/myDiaryList">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 我的日记
                </el-menu-item>
            </router-link>
            <router-link  to="/sharePic/publicMyshare">
                <el-menu-item index="/sharePic/sharePic">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 分享区
                </el-menu-item>
            </router-link>


            <el-submenu index="系统设置" v-if="routes['systemSet/changeUserPassword']"> 
                <template slot="title">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 系统设置
                </template>
                    <router-link  class="menu-indent" to="/systemSet/changeUserPassword" >
                        <el-menu-item index="/systemSet/changeUserPassword">
                            修改用户密码
                        </el-menu-item>
                    </router-link>
            </el-submenu>
        </template>    
        

    </div>
</template>

<script>
    //获取vuex中的菜单权限 进行菜单show展示。登陆成功时直接 返回菜单json 并包含帐户信息
    import { mapGetters } from 'vuex';
    export default {
      name: 'SidebarItem',
      props: {
        routes: {
          // type: Array
        }
      },
      computed: {
            ...mapGetters({
                // 映射 this.personalInfo_init 为 store.getters.userInfo
                userInfo:'userInfo',
                userType:'userType',
            })
      },

    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .wscn-icon {
        margin-right: 10px;
    }
    .fa{
        margin-right: 10px;
    }
    .hideSidebar .menu-indent{
        display: block;
        text-indent: 10px;
    }
</style>

