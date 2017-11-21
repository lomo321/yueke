var store = require('../../store/store.js');
var tpl = require('./download.tpl')

module.exports = {
    template: tpl,
    store,
    data: function () {
        return {}
    },
    mounted: function () {
        var that = this;
        if(!that.link) {
            location.href = location.href.replace('#/download','#/edit')
        }
        $('.download').on('click', function () {
            console.log(that.link);
            window.open(that.link);
        })
        $('.backList').on('click',function(){
            //这里修改返回列表链接
            var path = '/schoolWork/schoolWorkManage';
            location.href = path
        })
    },
    updated: function () {
        console.log('updated')
    },
    methods: {},
    computed: {
        link(){
            return this.$store.state.downloadLink
        }
    }
};