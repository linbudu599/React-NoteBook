# 梳理以及使用`useSelector`重构

## 数据流梳理

- store 下有两个域，`todos` 和 `visibilityFilter`，前者又包含`allIds`和`byIds`。allIds是一个数组，存放所有当前事项的id，即使你将一个待办事项标记为已完成，它也不会改变。byIds是一个对象，内部以 `{content:"xxx",completed:true}` 的形式存放每个待办事项的完成情况。visibilityFilter则是一个条件，`all`/`completed`/`incompleted`，后面会详细说明。

- 一共有三个能够被dispatch的action，addTodo toggleTodo setFilter，分别负责新增/改变状态/改变可视筛选条件。

- 注意这里使用切换筛选条件的实现，store中并不没有单独划分出一个域用来存放与当前条件对应的结果，而是在`<TodoList />` 组件内获得筛选条件，再在`mapStateToProps`内过滤返回值。

- 在`mapStateToProps`内使用selector，我觉得这也是为什么官方会推出一个`useSelector`的hooks吧，虽然它的名字叫`useChoser`之类的会更好。先说selector，主要就是把对数据预处理/从各个域取出并拼接数据（注意，在这里useSelector表现不同）/筛选等一些流程从`mapStateToProps`中抽离出来。个人觉得最常见的情景就是第二种，从不同的域里取数据再拼装这个过程。

## 