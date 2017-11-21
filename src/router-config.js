/**
 * Created by lomo on 2017/10/5.
 */
var edit = require('./pages/edit/edit.js');
var preview = require('./pages/preview/preview.js');
var download = require('./pages/download/download.js');

//require('./pages/preview/preview.vue');

const routes = [
    { path: '/edit', component: edit },
    { path: '/preview', component: preview },
    { path: '/download', component: download },

    { path: '/', redirect: '/edit'}
];

module.exports = routes;