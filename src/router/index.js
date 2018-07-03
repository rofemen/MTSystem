import Vue from 'vue';
import Router from 'vue-router';

const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow
// 所以只在生产中使用延迟加载

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');
const authRedirect = _import('login/authredirect');
const sendPWD = _import('login/sendpwd');
const reset = _import('login/reset');

/* components */
// const Tinymce = _import('components/tinymce');
// const Mixin = _import('components/mixin');

/* error page */
const Err404 = _import('error/404');
const Err401 = _import('error/401');


const PersonalInfo = _import('index/personalInfo');

/* 系统管理*/
const PermissionsManage = _import('systemSet/permissionsManage');
/* 学生管理*/
const StudentList = _import('student/studentList');
const StudentAdd = _import('student/studentAdd');
const StudentUpdate = _import('student/studentUpdate');
const StudentShowList =_import('student/studentShowList');
const InstorEi = _import("student/evaluation/instorEi");
const TutorEi = _import("student/evaluation/tutorEi");

const CourseListEi = _import("student/evaluation/courseListEi");
const CourseEvaluation = _import("student/evaluation/courseEvaluation")


/* 教官管理*/
const SoldierInfoList = _import('army/soldierInfoList');

//导师
const TutorTeacherList = _import('army/tutorTeacherList');
const ClassSchedule = _import('army/classSchedule');

/*班级管理*/
const ClassInfoList = _import('class/classInfoList');

//课程管理
const CourseApply = _import('course/courseApply');
const ApplySuccess = _import('course/applySuccess');
const CourseInfo = _import('course/courseInfo');
const AwaitPassCourse = _import('course/awaitPassCourse');
const CourseSchedule = _import('course/courseSchedule');
const ScoreRegister = _import('course/scoreRegister');
const CourseList = _import('course/courseList');

//分享
const PublicMyshare = _import('sharePic/publicMyshare');

//学生课表
const StudentSchedule = _import('student/studentSchedule');
const MyDiaryList = _import('student/myDiaryList');

//教师课表
const TeacherSchedule = _import('army/teacherSchedule');
const BatchTeacherInfo = _import('army/batchTeacherInfo');
const BatchTutorTeacherInfo = _import('army/batchTutorTeacherInfo');

const InstorDetail = _import('army/evaluationDetail/instorDetail');
const TutorDetail = _import('army/evaluationDetail/tutorDetail');
const CourseEiDetail = _import('army/evaluationDetail/courseEiDetail');
const DiaryList = _import('army/diaryList');
const DiaryInfoDetail = _import('army/diaryInfoDetail');
const MyEmail = _import('layout/myEmail');
const EmailDetail = _import('layout/emailDetail');
const ChangeUserPassword = _import('systemSet/changeUserPassword');



//

Vue.use(Router);

 /**
  * icon : 菜单图标
  * hidden : true不显示在菜单栏
  * redirect : noredirect 为不重定向
  * noDropdown : true 不显示子菜单
  * meta : { role: ['admin'] }  will control the page role
  **/

const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/authredirect', component: authRedirect, hidden: true },
  { path: '/sendpwd', component: sendPWD, hidden: true },
  { path: '/reset', component: reset, hidden: true },
  { path: '/404', component: Err404, hidden: true },  //假地址时重定向
  { path: '/401', component: Err401, hidden: true },  //无权限时重定向
  
  {
    path: '/army',
    component: Layout,
    redirect: 'noredirect',
    name: '教官管理',
    children: [
      { path: 'soldierInfoList', component: SoldierInfoList, name: '教官信息列表'},
      { path: 'batchTeacherInfo', component: BatchTeacherInfo, name: '批量导入教官信息' },
      { path: 'instorDetail', component: InstorDetail, name: '辅导员评价详情' },
      { path: 'tutorDetail', component: TutorDetail, name: '导师评价详情' },
      { path: 'courseEiDetail', component: CourseEiDetail, name: '课程评价详情' },
      { path: 'diaryList', component: DiaryList, name: '军训日记管理' },
      { path: 'diaryInfoDetail', component: DiaryInfoDetail, name: '日记详情' },
      { path: 'classSchedule', component: ClassSchedule, name: '班级课表' },
    ]
  
  },
  {
    path: '/tutor',
    component: Layout,
    redirect: 'noredirect',
    name: '导师管理',
    children: [
      { path: 'tutorTeacherList', component: TutorTeacherList, name: '导师信息列表'},
      { path: 'batchTutorTeacherInfo', component: BatchTutorTeacherInfo, name: '批量导入导师信息' },
    ]
  
  },
  {
    path: '/',
    redirect: '/index/personalInfo',  //重定向到默认首页
    hidden: true,
  },
  {
    path: '/index',
    component: Layout,
    redirect: 'noredirect',
    name: '',
    // icon: 'EXCEL',
    noDropdown: true,
    children: [
        { path: 'personalInfo', component: PersonalInfo, name: '个人信息' },
        { path: 'myEmail',meta:{ keepAlive: true } , component: MyEmail, name: '我的邮件' },
        { path: 'emailDetail',component: EmailDetail, name: '邮件详情' }
    ]
  },
  {
    path: '/errorpage',
    component: Layout,
    redirect: 'noredirect',
    name: '错误页面',
    // icon: '404',
    children: [
      { path: '401', component: Err401, name: '401' },
      { path: '404', component: Err404, name: '404' }
    ]
  },
  {
    path: '/systemSet',
    component: Layout,
    redirect: 'noredirect',
    name: '系统设置',
    children: [
      { path: 'permissionsManage', component: PermissionsManage, name: '权限管理' },
      { path: 'changeUserPassword', component: ChangeUserPassword, name: '修改用户密码' },
    ]
  },
  {
    path: '/studentsManage',
    component: Layout,
    redirect: 'noredirect',
    name: '学生管理',
    children: [
      { path: 'studentList', component: StudentList, name: '学生列表' },
      { path: 'studentAdd', component: StudentAdd, name: '学生添加' },
      { path: 'studentUpdate', component: StudentUpdate, name: '学生修改' },
      { path: 'evaluation/instorEi', component: InstorEi, name: '辅导员评价'},
      { path: 'evaluation/courseListEi', component: CourseListEi, name: '课程信息评价列表'},
      { path: 'evaluation/courseEvaluation', component: CourseEvaluation, name: '课程信息评价'},
      { path: 'evaluation/tutorEi', component: TutorEi, name: '导师评价'},
      { path: 'studentShowList', component: StudentShowList, name: '指派班级学生信息'},
    ]
  },
  {
    path: '/class',
    component: Layout,
    redirect: 'noredirect',
    name: '连排信息管理',
    // icon: 'zonghe',
    children: [
      { path: 'classInfoList', component: ClassInfoList, name: '连排信息管理' },
    ]
  },
  {
    path: '/sharePic',
    component: Layout,
    redirect: 'noredirect',
    name: '分享区',
    // icon: 'zonghe',
    children: [
      { path: 'publicMyshare', component: PublicMyshare, name: '照片分享' },
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: 'noredirect',
    name: '课程管理',
    // icon: 'zonghe',
    children: [
      { path: 'courseApply', component: CourseApply, name: '课程申报' },
      { path: 'applySuccess', component: ApplySuccess, name: '申报成功' },
      { path: 'courseInfo', component: CourseInfo, name: '申报课程信息' },
      { path: 'awaitPassCourse', component: AwaitPassCourse, name: '审批课程记录' },
      { path: 'courseSchedule', component: CourseSchedule, name: '课表安排' },
      { path: 'scoreRegister', component: ScoreRegister, name: '成绩录入' },
      { path: 'courseList', component: CourseList, name: '课程列表' },
    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: 'noredirect',
    name: '',
    // icon: 'zonghe',
    children: [
      { path: 'studentSchedule', component: StudentSchedule, name: '课表信息' },
      { path: 'myDiaryList', component: MyDiaryList, name: '我的日记' }
    ]
      
  },
  {
    path: '/teacher',
    component: Layout,
    redirect: 'noredirect',
    name: '',
    // icon: 'zonghe',
    children: [
      { path: 'teacherSchedule', component: TeacherSchedule, name: '教师课表信息' }]
  },
  
  // { path: '/', redirect: '/excel', hidden: true },
  { path: '*', redirect: '/404', hidden: true }
  
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

// export const asyncRouterMap = [
  
// ];
