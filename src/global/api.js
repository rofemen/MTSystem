//接口配置

//把全体接口封装在的前端配置文件（序号与接口文档一一对应），多个环境配置时可快速切换整站式的全部接口，不用逐个页面去改。
const config = require('../../config');

let url = {
    apiUrl: "/ccp-web/api", //接口路径
    //ctxPath: "/ccp-web/dist", //tomcat服务dist目录
    ctxPath: "/dist", //node服务dist目录

    //staticPath:config.dev.staticPath,       //开发环境静态资源路径
    // 条件 ? 结果1 : 结果2 //三元运算符，表示条件为true时，等式的结果就为结果1（'./'），否则为结果2('/static/')。
    // development为开发环境（npm run dev），另外一个production是生产环境（）
    // 生产环境时staticPath的值为'./'，开发环境时staticPath的值为'/static/'。
    staticPath: process.env.NODE_ENV !== 'development' ?  config.build.staticPath: config.dev.staticPath
};

//----------------请注意：如果正式环境，不需要本地json数据模拟，请删除以上代码和api中的模拟接口。----------------

let nodeApiBaseUrl = 'http://localhost:8080/gp/';
//头像路径
let stuIconBaseUrl = 'http://localhost:8080/gp/stuIcon/';
let tcIconBaseUrl = 'http://localhost:8080/gp/tcIcon/';
export const api = {
            'stuIconBaseUrl':'http://localhost:8080/gp/stuIcon/',
            'tcIconBaseUrl':'http://localhost:8080/gp/tcIcon/',
            'login':nodeApiBaseUrl+'login',//ngxin
            'getUserInfo':nodeApiBaseUrl+'tcUserController/getTeacherInfoById',//获取登录用户模拟接口
            'getAllTcInfoByRoleType':nodeApiBaseUrl+'tcUserController/getAllTcInfoByRoleType',//获取用户信息
            'getAllDeptInfo':nodeApiBaseUrl+'departmentController/getAllDeptInfo',//表格模拟接口
            'addTeacherInfo':nodeApiBaseUrl+'tcUserController/addTeacherInfo',//添加教师信息
            'delectTeacherById':nodeApiBaseUrl+'tcUserController/delectTeacherById',//通过id删除教师信息
            'updateTeacherInfo':nodeApiBaseUrl+'tcUserController/updateTeacherInfo',//更新教师信息
            'batchDelTcInfo':nodeApiBaseUrl+'tcUserController/batchDelTcInfo',//批量删除
            'getTeacherByDiIdAndRole':nodeApiBaseUrl+'tcUserController/getTeacherByDiIdAndRole',//获取某系下的教师
            'getTeacherByDiId':nodeApiBaseUrl+'tcUserController/getTeacherByDiId',//获取某系下的教师
            'getTeacherInfoByTcNum':nodeApiBaseUrl+'tcUserController/getTeacherInfoByTcNum',//通过工号获取教师信息
            'getStudentScore':nodeApiBaseUrl+'tcUserController/getStudentScore',//更新课表信息
            'batchUploadTcInfo':nodeApiBaseUrl+'tcUserController/batchUploadTcInfo',//上传excel文件
            'getBatchTcInfo':nodeApiBaseUrl+'tcUserController/getBatchTcInfo',
            'getStudentInfoByTcNum':nodeApiBaseUrl+'stuUserController/getStudentInfoByTcNum',
            'getStudentInfoByTcNumForShow':nodeApiBaseUrl+'stuUserController/getStudentInfoByTcNumForShow',

            'addClassInfo':nodeApiBaseUrl+'classInfoController/addClassInfo',//添加班级
            'getAllClassInfo':nodeApiBaseUrl+'classInfoController/getAllClassInfo',
            'updateClassInfo':nodeApiBaseUrl+'classInfoController/updateClassInfo',
            'batchDelClInfo':nodeApiBaseUrl+'classInfoController/batchDelClInfo',
            'delectClassInfoById':nodeApiBaseUrl+'classInfoController/delectClassInfoById',
            'selectByTcNum':nodeApiBaseUrl+'classInfoController/selectByTcNum',
            'selectByclCode':nodeApiBaseUrl+'classInfoController/selectByclCode',
            'getAllClassInfoForAdd':nodeApiBaseUrl+'classInfoController/getAllClassInfoForAdd',


            'addCourseInfo':nodeApiBaseUrl+'courseController/addCourseInfo',//课程申报
            'updateCourseInfo':nodeApiBaseUrl+'courseController/updateCourseInfo',//课程审批
            'undoCourseApply':nodeApiBaseUrl+'courseController/undoCourseApply',//撤销申报
            'getAwaitPass':nodeApiBaseUrl+'courseController/getAwaitPass',//获取待审批课程
            'getCourseInfo':nodeApiBaseUrl+'courseController/getCourseInfo',
            'delectCourseInfoById':nodeApiBaseUrl+'courseController/delectCourseInfoById',
            'updateCourseInfo':nodeApiBaseUrl+'courseController/updateCourseInfo',
            'getTcCouresInfo':nodeApiBaseUrl+'courseController/getTcCouresInfo',//获取可以开启的课程
            'getTcTecheredCi':nodeApiBaseUrl+'courseController/getTcTecheredCi',//获取已经开启的课程
            'operateCourseScore':nodeApiBaseUrl+'courseController/operateCourseScore',//更新学生成绩
            'getTcTecheredCiForPost':nodeApiBaseUrl+'courseController/getTcTecheredCiForPost',//获取已经开启的课程
            


            'getTcSchedule':nodeApiBaseUrl+'scheduleController/getTcSchedule',//课表信息
            'updateScheduleByList':nodeApiBaseUrl+'scheduleController/updateScheduleByList',//更新课表信息
            'getTeachedCi':nodeApiBaseUrl+'scheduleController/getTeachedCi',//在教课程信息
            //学生
            'getStuInfo':nodeApiBaseUrl+'stuUserController/getStuInfo',//获取学生信息
            'getStudentSchedule':nodeApiBaseUrl+'scheduleController/getStudentSchedule',//获取学生课表
            'getAllStuInfo':nodeApiBaseUrl+'stuUserController/getAllStuInfo',//获取学生信息
            'addStudentInfo':nodeApiBaseUrl+'stuUserController/addStudentInfo',//添加学生信息
            'updateStudentInfo':nodeApiBaseUrl+'stuUserController/updateStudentInfo',//更新学生信息
            'delectStudentById':nodeApiBaseUrl+'stuUserController/delectStudentById',//删除学生信息
            'batchDelStuInfo':nodeApiBaseUrl+'stuUserController/batchDelStuInfo',//批量删除学生信息
            'getBatchStuInfo':nodeApiBaseUrl+'stuUserController/getBatchStuInfo',//批量获取学生信息
            'getStudentInfoByStuNum':nodeApiBaseUrl+'stuUserController/getStudentInfoByStuNum',//通过学号获取学生信息
            
            //教师课表
            'getTeacherSchedule':nodeApiBaseUrl+'scheduleController/getTeacherSchedule',//获取教师课表
            'getClassSchedule':nodeApiBaseUrl+'scheduleController/getClassSchedule',//获取教师课表
           
            //教学评价
            'addInstorEi':nodeApiBaseUrl+'evaluationController/addInstorEi',//
            'getEiInfoByTcNum':nodeApiBaseUrl+'evaluationController/getEiInfoByTcNum',
            
            //公共模块
            "resetPassWord":nodeApiBaseUrl+'commonController/resetPassWord',//重置密码
            "getReceiveMessage":nodeApiBaseUrl+'commonController/getReceiveMessage',//收件箱
            "getSendMessage":nodeApiBaseUrl+'commonController/getSendMessage',//发件箱
            "batchDelEmInfo":nodeApiBaseUrl+'commonController/batchDelEmInfo',//批量删除
            'systemResetPassWord':nodeApiBaseUrl+'commonController/systemResetPassWord',//重置密码
            "downloadTemplateExcel":nodeApiBaseUrl+'templateExcel/template.xlsx',//excel模板（老师）
            "downloadTemplateExcelStu":nodeApiBaseUrl+'templateExcel/template_stu.xlsx',//excel模板（学生）
            //朋友圈
            "publicShare":nodeApiBaseUrl+'shareController/publicShare',
            "getShareInfo":nodeApiBaseUrl+'shareController/getShareInfo',
            "publicCommentDetail":nodeApiBaseUrl+'shareController/publicCommentDetail',
            "deleteCommentDetail":nodeApiBaseUrl+'shareController/deleteCommentDetail',

            //军训日记
            'getDiaryInfoByNameOrTime':nodeApiBaseUrl+'diaryController/getDiaryInfoByNameOrTime',
            'delectDiaryById':nodeApiBaseUrl+'diaryController/delectDiaryById',
            'batchDelDiaryInfo':nodeApiBaseUrl+'diaryController/batchDelDiaryInfo',
            'updateDiaryInfo':nodeApiBaseUrl+'diaryController/updateDiaryInfo',
            'addDiaryInfo':nodeApiBaseUrl+'diaryController/addDiaryInfo',
            'getDiaryInfoByStuNum':nodeApiBaseUrl+'diaryController/getDiaryInfoByStuNum',
            

            'getForm':url.staticPath+'/dataJson/form.json',//表单模拟接口
            "roleAndUser":url.staticPath+"/dataJson/roleAndUser.json",  //获取角色和对应用户  
            "getMenuAndElement":url.staticPath+"/dataJson/getMenuAndElement.json",  //获取用户的 菜单和元素权限 


            //"in_theaters":url.staticPath+"/dataJson/in_theaters.json",  //获取电影列表,json
            "in_theaters":"/v2/movie/in_theaters",  //获取电影列表
            "movieSearch":"/v2/movie/search",       //电影搜索

            //以下接口为实际接口，需要下载node项目源码 
            "addStudents": nodeApiBaseUrl+"/api/addStudents",       //学生信息添加
            "studentUpdate": nodeApiBaseUrl+"/api/studentUpdate",   //学生信息修改
            "studentList": nodeApiBaseUrl+"/api/queryStudents",     //学生信息列表
            "delStudents": nodeApiBaseUrl+"/api/delStudents",       //学生信息删除
            "queryStudentsItem": nodeApiBaseUrl+"/api/queryStudentsItem",     //学生单条详情

            '0':url.apiUrl+'',//获取科室接口
            '1':url.apiUrl+'',
            '2':{
                '1':null,
                '2':null,
            }
    }
    

// export default api
