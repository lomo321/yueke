/**
 * Created by lomoliang on 2017/10/18.
 *
 * 获取坐标
 */

var ratio = 1.876;
var kk = 150;
var map = {

};
var zuid = 1;
function getBind(qId){
    if(!map[qId]){
        map[qId] = kk++;
    }
    return map[qId];
}
/**
 * 计算特征区域坐标
 * @param $dom 节点
 * @param zuid
 * @param params 该页的相对坐标以及pageid
 * @returns {{zuStyleName: string, zuid: *, zumem: number, zustyle: number, pageid: *, area: *[], quesid: *[]}}
 */
function wrapperArea($dom,zuid,params){
    var $dom = $($dom);
    params = params || {
            pageId:1,
            x:0,
            y:0,
        };
    return {
        "zuStyleName": "特征区域",
        "zuid": zuid,
        "zumem": 1,
        "zustyle": 14,
        "pageid": params.pageId ,
        "area": [
            {
                "area0": {
                    "height": $dom.offset().height* ratio,
                    "pix": 0,
                    "TValue": 0,
                    "width": $dom.offset().width* ratio,
                    "x": ($dom.offset().left-params.x)* ratio,
                    "y":($dom.offset().top-params.y)* ratio
                }
            }
        ],
        "quesid": [
            {
                "val": zuid
            }
        ]
    }
}
/**
 * 点位点
 * @param $dom
 * @param zuid
 * @param params
 * @returns {{zuStyleName: string, zuid: *, zumem: number, zustyle: number, pageid: *, area: *[]}}
 */
function setPointer($dom,zuid,params){
    var $dom = $($dom);

    return {
        "zuStyleName": "定位点",
        "zuid": zuid,
        "zumem": 1,
        "zustyle": 0,

        "pageid": params.pageId,


        "area": [
            {
                "area0": {
                    "height": $dom.offset().height* ratio,
                    "pix": 0.1*$dom.offset().height*$dom.offset().width* ratio* ratio,
                    "TValue": 190,
                    "width": $dom.offset().width* ratio,
                    "x": ($dom.offset().left-params.x)* ratio,
                    "y":($dom.offset().top-params.y)* ratio
                }
            }
        ]
    }
}
/**
 * 客观题选区
 * @param $dom
 * @param zuid
 * @param params
 * @returns {{zuStyleName: string, zuid: *, zumem: number, zustyle: number, pageid: *, area: Array, questitle: *[], bindId: *[], omrRectType: number, quesid: *[]}}
 */
function  setChooseA($dom,zuid,params){
    $dom = $($dom);
    if($dom) {
        var arr = $($dom).find('.answerblock')
        var o = {};
        $.each(arr,function(i,v){
            //console.log($(v).offset());
            o['area'+i] = {
                "height": $(v).offset().height* ratio,
                "pix": 0.1* $(v).offset().height*$(v).offset().width* ratio* ratio,
                "TValue": 190,
                "width":$(v).offset().width* ratio,
                "x": ($(v).offset().left - params.x)* ratio,
                "y": ($(v).offset().top-params.y)* ratio
            }
        })
    }
    var order =$dom.attr('data-order');
    var qId = $dom.attr('data-qid');
    var type = $dom.attr('data-type');
    var area = []
    area.push(o);
    return {
        "zuStyleName": "客观题选区",
        "zuid": zuid,
        "zumem": 1,
        "zustyle": type == 1 ? 7 : 12,

        "pageid": params.pageId,


        "area": area,

        "questitle": [
            {
                "val": "01-01-01-" + (order >= 10 ? order : ('0'+ order))//和题干同一个order
            }
        ],
        "bindId": [
            {
                "val": getBind(qId) //客观题的zuid
            }
        ],
        "omrRectType": 0,

        "quesid": [
            {
                "val": zuid
            }
        ]
    }
}
/**
 * 客观题题干
 * @param $dom
 * @param params
 * @returns {{zuStyleName: string, zuid, zumem: number, zustyle: number, pageid: *, area: *[], questitle: *[], qId: *}}
 */
function setChooseQ($dom,params){
    var $dom = $($dom);
    var qId = $dom.attr('data-qid');
    var order = $dom.attr('data-order');
    return {
        "zuStyleName": "客观题题干",
        "zuid": getBind(qId),
        "zumem": 1,
        "zustyle": 13,

        "pageid": params.pageId,

        "area": [
            {
                "area0": {
                    "height": $dom.offset().height* ratio,
                    "pix": 0,
                    "TValue": 0,
                    "width": $dom.offset().width* ratio,
                    "x": ($dom.offset().left-params.x)* ratio,
                    "y":($dom.offset().top-params.y)* ratio
                }
            }
        ],

        "questitle": [
            {
                "val": "01-01-01-0" + order
            }
        ],
        "qId": qId
    }
}
/**
 * 主观题题干
 * @param $dom
 * @param params
 * @returns {{zuStyleName: string, zuid, zumem: number, zustyle: number, pageid: *, area: *[], questitle: *[], qId: *}}
 */
function setChooseQ2($dom,params){
    var $dom = $($dom);
    var qId = $dom.attr('data-qid');
    var order = $dom.attr('data-order');
    return {
        "zuStyleName": "主观题题干",
        "zuid": getBind(qId),
        "zumem": 1,
        "zustyle": 8,
        "pageid": params.pageId,

        "area": [
            {
                "area0": {
                    "height": $dom.offset().height * ratio,
                    "pix": 0,
                    "TValue": 0,
                    "width": $dom.offset().width * ratio,
                    "x": ($dom.offset().left-params.x)* ratio,
                    "y":($dom.offset().top-params.y)* ratio
                }
            }
        ],

        "questitle": [
            {
                "val": "01-01-01-0" + order
            }
        ],
        "qId": qId
    }
}
/**
 * 获取坐标
 * @param page
 */
function getPageInfo(page){
    var info = [];
    var $page = $(page);
    var params = {
        pageId:$page.attr('data-pageid'),
        x:$page.offset().left,
        y:$page.offset().top,
    };
    //特征区域
    info.push(wrapperArea($page,zuid++,params))
    //定位点
    if(params.pageId == 1) {
        info.push(setPointer($page.find('.top-left'),zuid++,params))
        info.push(setPointer($page.find('.top-right'),zuid++,params))
        info.push(setPointer($page.find('.bottom-left'),zuid++,params))
    }
    //客观题选区
    if(params.pageId == 1) {
        $.each($page.find('.answerarea'),function(i,v){
            info.push(setChooseA(v,zuid++,params))
        });
    }
    //题干区
    $.each($page.find('.stem'),function(i,v){
        var type = $(v).attr('data-qtype');
        if(type==1 || type ==2) {
            if($(v).hasClass('none')){
                //假如为答题卡模式 则选择客观题答题区作为题干
                var order = $(v).attr('data-order');
                var d = $('.fillArea').find('[data-order="'+ order + '"]');
                info.push(setChooseQ(d,params))
            } else {
                info.push(setChooseQ(v,params))
            }
        } else {
            info.push(setChooseQ2(v,params))

        }
    });
    return info
}

module.exports = getPageInfo