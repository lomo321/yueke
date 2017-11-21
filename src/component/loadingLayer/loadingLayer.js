/**
 * Created by jie on 2017/10/16.
 */
var tpl = require('./loadingLayer.tpl');
var store = require('../../store/store.js');
var util = require('../../util/util.js');
module.exports = {
    template: tpl,
    store,
    data:function(){
        return {
            show:false
        }
    },

    mounted(){
        var that = this;
        console.log('loading layer mounted')

    },
    methods: {

    },
    computed: {

    }
};