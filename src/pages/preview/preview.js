var store = require('../../store/store.js');
var tpl = require('./preview.tpl')
var loadingLayer = require('../../component/loadingLayer/loadingLayer.js');
var getPageInfo = require('../../util/pageInfo.js');
var pdfHost = window.pdfHost || 'http://211.159.185.181:8180'
var formData = new FormData();
function generatePdf(){
    var element = $('.page-Wrap')[0];
    html2pdf(element,{
        margin:       0,
        filename:     'myfile.pdf',
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { dpi: 192, letterRendering: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
        formData:formData
    });
}

function sendPdf(id,info){
    console.log(info);
    var defer = $.Deferred();
    formData.append('info',JSON.stringify(info));
    formData.append('bookId',id);
    formData.get('pdfFile');
    $.ajax({
        url:pdfHost + '/api/zytpl/generatePagerTpl',
        type: 'POST',
        data: formData,
        //async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (returndata) {
            defer.resolve(returndata)
        },
        error: function (returndata) {
            console.log(returndata);
            defer.reject(returndata)
        }
    });
    return defer

}
module.exports = {
    template:tpl,
    store,
    data:function(){
        return{

        }
    },
    mounted:function(){
        //this.change();
        var that = this;
        scrollTo(0,0);
        if(!this.previewHtml){
            location.href = location.href.replace('#/preview','#/edit')
            return
        }
        generatePdf();
        var info = [];
        $.each($('.preview-area').find('.page'),function(i,v){
            info = info.concat(getPageInfo(v))
        });
        $('.back').click(function(){
            location.reload();
        });
        $('.generate').click(function(){
            var flag = window.confirm('生成后将不能再编辑，是否继续生成？')
            if(flag) {
                that.showLoading();
                sendPdf(that.currentBookId,info).done(function(returndata){
                    console.log(returndata);
                    that.hideLoading();
                    var json = JSON.parse(returndata);
                    if(json.rtnCode == 0 && json.bizData && json.bizData.pdfUrl) {
                        that.$store.commit('SET_DOWNLOAD_LINK', json.bizData.pdfUrl);
                        location.href = location.href.replace('#/preview','#/download')
                    } else {
                        alert(json.msg)
                    }
                }).fail(function(returndata){
                    that.hideLoading();
                    alert('生成失败')
                })
            }
        })
    },
    updated:function(){
        console.log('updated')
    },
    methods:{
        showLoading:function(){
            $('.load-container').removeClass('none')

        },
        hideLoading:function(){
            $('.load-container').addClass('none')
        },
    },
    computed:{
        previewHtml () {
            return this.$store.state.previewHtml
        },
        currentBookId (){
            return this.$store.state.currentBookId
        }
    },
    components:{
        'loading-layer':loadingLayer
    }
};