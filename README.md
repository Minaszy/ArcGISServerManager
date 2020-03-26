# ArcGISServerManager
调用arcgis server提供的rest api执行发布、重启、停止服务等操作。


计划添加以下功能：
1、页面上展示服务器所有服务，包括未启动的；通过开关在地图上展示服务内容；
2、提供启动、停止服务对应操作入口和功能；
3、对于可以编辑的服务（要素服务），提供能编辑入口，并实现编辑功能，编辑完成后保存更新并自动刷新展示的服务；
4、提供创建新服务的界面入口，通过上传msd文档（该功能待定）或指定本地msd文件创建新服务，提供创建服务时的各种表单选项；创建完成后加新建服务即时更新添加到展示列表中；
5、关于服务的用户权限控制，还未细想。


还需要完善的细节：
1、创建服务时注意允许自定义文件夹；
2、获取整合服务信息时，注意将服务上级文件夹目录整合到服务地址中；