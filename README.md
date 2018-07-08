# 大学生军训管理系统前端模板（vue） #
使用到的技术栈：vue + vue-resource + vue-router + vuex + element-ui + ES6 + webpack + npm 


## 注意：该项目在node.js,6.0~6.11之间的稳定版即可.

## 前言
   
   本项目借鉴vue脚手架,比较是适合2次开发

## 角色功能实现：
 
 #管理员：    
 ![Image text](https://raw.githubusercontent.com/rofemen/MTSystem/master/imageStroage/fun_1.jpg)   
 
 #教官：   
 ![Image text](https://raw.githubusercontent.com/rofemen/MTSystem/master/imageStroage/fun_2.jpg)   
 
 #学生：   
 ![Image text](https://raw.githubusercontent.com/rofemen/MTSystem/master/imageStroage/fun_3.jpg)     
 
 #导师：   
 ![Image text](https://raw.githubusercontent.com/rofemen/MTSystem/master/imageStroage/fun_4.jpg)   
 
 #通用功能模块：   
 ![Image text](https://raw.githubusercontent.com/rofemen/MTSystem/master/imageStroage/fun_5.jpg)
 
 #后期可根据需要拓展其他业务

``` 注意：该项目目前使用element-ui@1.3.3+版本,所以最低兼容 Vue 2.3.0**
```

## 开发环境
   
   #由于使用了npm,所以需要安装node.js环境

``` ** 后期开源后端模板时候会解释后端需要的开发环境   

## 开发
```bash
    # 克隆代码
    git clone https://github.com/rofemen/MTSystem.git
    # 安装依赖
    npm install

    **注意，如果安装依赖的时候速度太慢的话，可以切换到国内镜像，这样会快很多。
    
    #切换镜像    
    第一步：npm install -g nrm --registry=https://registry.npm.taobao.org

    接着 ：nrm use taobao

    再试着：npm install
    
    **会发现下载速度快了很多


    # 本地开发 首先编译运行
    npm run dev

浏览器访问 http://localhost:2018

## 发布

```bash
    # 构建生产环境
    npm run build:prod
```

## 模拟运行正式环境
```bash
    # nginx环境下运行
    1.准备nginx环境，自行到nginx官网（https://nginx.org/）下载，并解压
    2.双击build.bat后根目录生成一个dist包，把dist整个文件夹拷贝到nginx解压后的html下
    3.启动nginx服务：双击nginx.exe
    4.访问入口：http://localhost/dist/index.html
    ………
    
    8.关闭nginx服务：直接删进程
    
    # tomcat环境下运行
    参照nginx步骤即可
```

## 关于图标
```
    本项目使用了两套图标系统，具体使用方法参照以下官方链接:
    1.http://element.eleme.io/#/zh-CN/component/icon
    2.http://fontawesome.io/icons/
    使用方法：
    a.在index.html中引入<link href="//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
    b.在使用图标的地方放置图标<i class="fa fa-home" aria-hidden="true"></i>
```
## 关于UI系统
```
    本项目使用了全新的elementUI系统，具体使用方法参照以下官方链接:
    1.http://element.eleme.io/#/zh-CN/component/installation
```

## 目录结构
```shell
├── build                      // 构建相关  
├── config                     // 配置相关
├── src                        // 源代码
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件。不直接显示
│   ├── global                 // 全局指令
│   ├── filtres                // 全局filter
│   ├── router                 // 路由
│   ├── store                  // 全局store管理
│   ├── utils                  // 全局公用方法
│   ├── view                   // view视图层
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
│   ├── jquery
│   ├── Tinymce                // 富文本
│   ├── dataJson               // 模拟接口json
│   └── theme                  // 主题文件
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json
```

Copyright (c) 2018-present, Rofe






