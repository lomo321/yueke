/**
 * Created by lomo on 2017/10/5.
 */
var store = require('./store/store.js');
var VueRouter = require('vue-router');
var routes = require('./router-config.js');


Vue.use(VueRouter);
//创建路由
const router = new VueRouter({
        mode: 'hash',    //路由的模式
        routes
});
new Vue({
        el: '#app',
        router,
        store,
        //render: h => h(App)
});