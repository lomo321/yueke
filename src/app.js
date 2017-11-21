/**
 * Created by lomo on 2017/1/21.
 */
var data = require('./mockData/data.js');
var dataArr = require('./mockData/dataArray.js');
var tpl = require('./tpl/stem.tpl')
var ajax = require('./util/ajax.js');
var ratio = 1.876
//console.log(tpl)
console.log('hello world')
//console.log($(tpl).body.innerHTML)
//$.each(dataArr, function (i, v) {
//    var data = v;
//    var orderstr = '<div class="orderBy">第' + data.orderBy + '题</div>';
//    var htmlstr = '<div class="stem">' + orderstr + '<p>' + data.stem + '</p></div>';
//
//    var s = '';
//    for (var i = 0; i < data.answerCount; i++) {
//        s += '<div class="fillArea-block">a</div>'
//    }
//    var answer = '<div class="fillArea-answer"><span>' + data.orderBy + '</span>' + s + '</div>'
//    $(htmlstr).appendTo($('#test'));
//    $(answer).appendTo($('#fillArea'));
//
//});
var ABC = {
    0:'A',
    1:'B',
    2:'C',
    3:'D'
}
ajax.getAllQuestion('xiaoben06').done(function(result){
    var json = JSON.parse(result);
    console.log(json);
    var dataArr = json.bizData.data;
    $.each(dataArr, function (i, v) {
        var data = v;
        var orderstr = '<div class="orderBy">第' + data.orderBy + '题</div>';
        var htmlstr
        if(data.qtypeInner == 1 || data.qtypeInner == 2) {
            var s = '';
            for (var i = 0; i < data.answerCount; i++) {
                s += '<div class="fillArea-block">'+ABC[i]+'</div>'
            }
            var answer = '<div class="fillArea-answer"><span>' + data.orderBy + '</span>' + s + '</div>'
            $(answer).appendTo($('#fillArea'));
            htmlstr = '<div class="stem" data-qId="'+ data.questionId +'" data-qType="'+data.qtypeInner+'">' + orderstr + '<p>' + data.stem + '</p></div>';

        } else {
            htmlstr = '<div class="stem" data-qId="'+ data.questionId +'" data-qType="'+data.qtypeInner+'">' + orderstr + '<p>' + data.stem + '</p><div class="answer-area">我的作答</div></div>';

        }
        $(htmlstr).appendTo($('#test'));
    });
    $.each($('img'),function(i,v){
        convertImgToBase64(v.src,function(base64){
            //debugger
            v.src = base64
        })
    });
});
function convertImgToBase64(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}

function test1(){
    var host = 'http://211.159.185.181:8180'
    var data = {
        info:JSON.stringify(getInfo()),
        htmls:JSON.stringify(getHtml()).replace(/\\n/g,"").replace(/\\"/g,"'"),
        bookId:'xiaoben06'
    }
    console.log(data)
    $.ajax({
        url:host + '/api/zytpl/generatePagerTpl',
        data:data,
        type:'POST',
        contentType:'application/x-www-form-urlencoded;charset=utf-8 ',

        success:function(result){
            console.log(result)
        }
    });
}


function wrapperArea($dom,id){
    var $dom = $($dom);
    return {
        "zuStyleName": "特征区域",
        "zuid": id,
        "zumem": 1,
        "zustyle": 14,

        "pageid": 1,

        "area": [
            {
                "area0": {
                    "height": $dom.offset().height* ratio,
                    "pix": 0,
                    "TValue": 0,
                    "width": $dom.offset().width* ratio,
                    "x": $dom.offset().left* ratio,
                    "y":$dom.offset().top* ratio
                }
            }
        ],

        "quesid": [
            {
                "val": id
            }
        ]
    }
}
function setPointer($dom,id){
    var $dom = $($dom);

    return {
        "zuStyleName": "定位点",
        "zuid": id,
        "zumem": 1,
        "zustyle": 0,

        "pageid": 1,

        "area": [
            {
                "area0": {
                    "height": $dom.offset().height* ratio,
                    "pix": 0.1*$dom.offset().height*$dom.offset().width* ratio* ratio,
                    "TValue": 190,
                    "width": $dom.offset().width* ratio,
                    "x": $dom.offset().left* ratio,
                    "y":$dom.offset().top* ratio
                }
            }
        ],
    }
}
function setChooseQ($dom,zid,order,qid){
    var $dom = $($dom);
    return {
        "zuStyleName": "客观题题干",
        "zuid": zid,
        "zumem": 1,
        "zustyle": 13,

        "pageid": 1,

        "area": [
            {
                "area0": {
                    "height": $dom.offset().height* ratio,
                    "pix": 0,
                    "TValue": 0,
                    "width": $dom.offset().width* ratio,
                    "x": $dom.offset().left* ratio,
                    "y":$dom.offset().top* ratio
                }
            }
        ],

        "questitle": [
            {
                "val": "01-01-01-0" + order
            }
        ],
        "qId": qid
    }
}
function setChooseQ2($dom,zid,order,qid){
    var $dom = $($dom);
    return {
        "zuStyleName": "主观题题干",
        "zuid": zid,
        "zumem": 1,
        "zustyle": 8,
        "pageid": 1,

        "area": [
            {
                "area0": {
                    "height": $dom.offset().height * ratio,
                    "pix": 0,
                    "TValue": 0,
                    "width": $dom.offset().width * ratio,
                    "x": $dom.offset().left * ratio,
                    "y":$dom.offset().top * ratio
                }
            }
        ],

        "questitle": [
            {
                "val": "01-01-01-0" + order
            }
        ],
        "qId": qid || ''
    }
}
function setChooseA($dom,zid,order,bindId){

    if($dom) {
        var arr = $($dom).find('.fillArea-block')
        var o = {};
        $.each(arr,function(i,v){
            //console.log($(v).offset());
                o['area'+i] = {
                    "height": $(v).offset().height* ratio,
                    "pix": 0.1* $(v).offset().height*$(v).offset().width* ratio* ratio,
                    "TValue": 190,
                    "width":$(v).offset().width* ratio,
                    "x": $(v).offset().left* ratio,
                    "y": $(v).offset().top* ratio
                }
        })
    }
    var area = []
    area.push(o);
    return {
        "zuStyleName": "客观题选区",
        "zuid": zid,
        "zumem": 1,
        "zustyle": 12,

        "pageid": 1,

        "area": area,

        "questitle": [
            {
                "val": "01-01-01-0" + order //和题干同一个order
            }
        ],
        "bindId": [
            {
                "val": bindId //客观题的zuid
            }
        ],
        "omrRectType": 0,

        "quesid": [
            {
                "val": zid+1
            }
        ]
    }
}

function getInfo(){
    var info = []
    var zuid = 1
    var k = 1;
    var j = 0
    info.push(wrapperArea($('.page')[0],(zuid++)));
    info.push(setPointer($('.top-left'),zuid++))
    info.push(setPointer($('.top-right'),zuid++))
    info.push(setPointer($('.bottom-left'),zuid++))
    $.each($('.stem'),function(i,v){
        console.log($(v).attr('data-qId'));
        var qId = $(v).attr('data-qId');
        if($(v).attr('data-qtype') == 1 || $(v).attr('data-qtype') == 2) {
            info.push(setChooseA($('.fillArea-answer')[j++],zuid++,k,zuid));
            info.push(setChooseQ($(v),zuid++,k++,qId))

        } else {
            info.push(setChooseQ2($(v),zuid++,k++,qId))
        }
    });
    //info.push(setChooseQ($('.stem'),5,1))
    //info.push(setChooseA($('.fillArea-answer')[0],6,1,5))
    return info;
}
function getHtml(){
    var htmls = []
    var html = '<body>'+document.body.innerHTML+'</body>'.replace(/[\r\n]/g,"");
    console.log(html)
    htmls.push(html)

    return htmls
}
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
function testPdf(){
    formData.append('info',JSON.stringify(getInfo()));
    console.log(getInfo())
    formData.append('bookId','xiaoben06');
    var host = 'http://211.159.185.181:8180'
    formData.get('pdfFile');
    $.ajax({
        url:host + '/api/zytpl/generatePagerTpl',
        type: 'POST',
        data: formData,
        //async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (returndata) {
            console.log(returndata);
        },
        error: function (returndata) {
            console.log(returndata);
        }
    });
}
function getSchoolWork(id){
    var host = 'http://211.159.185.181:8080';
    var data = {
        'schoolworkId':id || '1'
    }
    $.ajax({
        url:host + '/schoolwork/getNormalQuestion?ajax=true',
        data:JSON.stringify(data),
        type:'POST',
        contentType:'application/json;charset=utf-8 ',
        processData:false,
        success:function(result){
            console.log(result)
        }
    });
}
window.ajax = ajax;
window.generatePdf = generatePdf;
window.getSchoolWork = getSchoolWork;
window.testPdf = testPdf;
window.test1 = test1;
window.setChooseA = setChooseA;
window.setChooseQ = setChooseQ;
window.setPointer = setPointer;
window.wrapperArea = wrapperArea;
window.getInfo = getInfo;
window.getHtml = getHtml
