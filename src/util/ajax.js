/**
 * Created by lomo on 2017/10/7.
 */
var hostSetting = window.hostSetting || 'http://211.159.185.181:8080';
var token = window.sessionStorage.KEY_ACCESS_TOKEN ? 'Bearer '+ window.sessionStorage.KEY_ACCESS_TOKEN : '' ;
// token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3d3cuaG5temhjLmNvbSIsImV4cCI6MTUxNTMyMDYxMiwicm9sZXMiOiIxMCIsImZpcnN0TmFtZSI6ImRlbmciLCJ1c2VyaWQiOiIzMzUxNTQyODY4NTE3ODQ3MDQiLCJhdWQiOiJ5aXBhaXp1b3llIGFwcCIsImlhdCI6MTUxNDQ1NjYxMn0.Kpy90lM6yCUrlcxZ5bED416DAmmXytuGJdtLtZlUYNlRg3DERaBMAPvMcUOjFTVFLKCxn0r5SVxeuvQwUzdgEg'  
module.exports = {
    getSchoolWork: function (id) {
        var defer = $.Deferred();
        var data = {
            'schoolworkId': id || '1'
        };
        $.ajax({
            url: hostSetting + '/schoolwork/getSchoolwork?ajax=true',
            data: JSON.stringify(data),
            type: 'POST',
            headers: { Authorization: token },
            contentType: 'application/json;charset=utf-8 ',
            processData: false,
            success: function (result) {

                /**
                 *
                 id,      ‘编号’
                 name,            ‘作业名’
                 grade,      '年级一~九年级分别是01~09? 高一~高三是10,11,12 ',
                 subject,    '科目：00-未知, YW-语文,SX-数学,YY-英语,WL-物理,HX-化学,SW-生物,DL-地理,ZZ-政治,LS-历史,JK-健康,KX-科学,XX-信息,TY-体育, MU-音乐,MS-美术,SF-书法,SP-思想品德,WZ-文科综合,LZ-理科综合'
                 columes,     '栏目数，1 一栏，2两栏，3三栏'
                 jinzhizuodaqu,     '设置禁止作答区: 1是，0否'
                 useRang,           '使用范围: 1 个人使用，2 校内共享'
                 cardFormat,          '答题方式：1 卷卡合一，2答题卡，3题卡分离'
                 status,               '状态 1 草稿，2 已发布，3已禁用'
                 pdfPath,             'pdf路径'
                 bookId ,             '关联的教辅书id'
                 schoolId ,            '学校id'
                 description ,          '介绍'
                 createName ,         '建立人姓名'
                 createBy ,            '建立人id'
                 createDate ,          '收录时间'
                 updateBy,            '最后修改人'
                 updateDate,          '最后修改时间'
                 isShowScroe,    '分数是否选中0为未选中'
                 * **/
                defer.resolve(result)
            },
            fail: function (data) {
                defer.reject(data)
            }
        });
        return defer
    },
    getErrorQuestion: function (id) {
        var defer = $.Deferred();
        var data = {
            'schoolworkId': id || '1'
        };
        $.ajax({
            url: hostSetting + '/schoolwork/getErrorSchoolwork?ajax=true',
            data: JSON.stringify(data),
            type: 'POST',
            headers: { Authorization: token },
            contentType: 'application/json;charset=utf-8 ',
            processData: false,
            success: function (result) {
                defer.resolve(result)
            },
            fail: function (data) {
                defer.reject(data)
            }
        });
        return defer
    },
    getAllQuestion: function (id) {
        var defer = $.Deferred();
        var data = {
            'schoolworkId': id || '1'
        };
        $.ajax({
            url: hostSetting + '/schoolwork/getNormalQuestion?ajax=true',
            data: JSON.stringify(data),
            type: 'POST',
            headers: { Authorization: token },
            contentType: 'application/json;charset=utf-8 ',
            processData: false,
            success: function (result) {
                defer.resolve(result)  
            },
            fail: function (data) {
                defer.reject(data)
            }
        });
        return defer
    },

    getQuestion: function (params) {
        var defer = $.Deferred();
        var data = {
            'schoolworkId': params.id || '1', //作业本id
            'questionId': params.qId || ''//题目id
        };
        $.ajax({
            url: hostSetting + '/schoolwork/getQuestionDetails?ajax=true',
            data: JSON.stringify(data),
            type: 'POST',
            headers: { Authorization: token },
            contentType: 'application/json;charset=utf-8 ',
            processData: false,
            success: function (result) {
                defer.resolve(result)
            },
            fail: function (data) {
                defer.reject(data)
            }
        });
        return defer
    },
    modifyQuestion: function (params) {
        var defer = $.Deferred();
        var data = {
            'schoolworkId': params.schoolworkId || '1', //作业本id
            'questionId': params.questionId || '',//题目id
            "orderBy": params.orderBy,//题目序号
            "stem": params.stem,//题干
            "shareStem":params.shareStem || '',
            "score": params.score,//分数
            "qtypeInner": params.qtypeInner,//录入题型（内部题型）：单选1，多选2，简答 4
            "answerCount": params.answerCount,//答案数
            "answer": params.answer,//答案，用逗号','分割
            "difficulty": params.difficulty,//难度
            "knpList": params.knpList,//知识点，用逗号','分割
            "height":params.height || 100

        };
        $.ajax({
            url: hostSetting + '/schoolwork/modify?ajax=true',
            data: JSON.stringify(data),
            type: 'POST',
            headers: { Authorization: token },
            contentType: 'application/json;charset=utf-8 ',
            processData: false,
            success: function (result) {
                defer.resolve(result)
            },
            fail: function (data) {
                defer.reject(data)
            }
        });
        return defer
    },
    delQuestion: function (params) {
        var defer = $.Deferred();
        var data = {
            'schoolworkId': params.schoolworkId || '1', //作业本id
            'questionId': params.questionId || ''//题目id
        };
        $.ajax({
            url: hostSetting + '/schoolwork/delQuestion?ajax=true',
            data: JSON.stringify(data),
            type: 'POST',
            headers: { Authorization: token },
            contentType: 'application/json;charset=utf-8 ',
            processData: false,
            success: function (result) {
                defer.resolve(result)
            },
            fail: function (data) {
                defer.reject(data)
            }
        });
        return defer
    },
    udQuestion: function (params) {
        var defer = $.Deferred();
        /**
         * questionList:[
         {
             questionId:题目id,
             scope:分数,
             orderBy:排序
         }
         ]
         * **/
        var data = {
            'schoolworkId': params.id || '1', //作业本id
            'questionList': params.questionList
        };
        $.ajax({
            url: hostSetting + '/schoolwork/updateSchoolworkQuestion?ajax=true',
            data: JSON.stringify(data),
            type: 'POST',
            headers: { Authorization: token },
            contentType: 'application/json;charset=utf-8 ',
            processData: false,
            success: function (result) {
                defer.resolve(result)
            },
            fail: function (data) {
                console.log('~~~~~')
                defer.reject()
            }
        });
        return defer
    },
    addQuestion:function(params){
        var defer = $.Deferred();
        var data = {
            'schoolworkId': params.schoolworkId || '1', //作业本id
            "orderBy": params.orderBy,//题目序号
            "endOrderBy":params.endOrderBy,
            "qtypeInner": params.qtypeInner,//录入题型（内部题型）：单选1，多选2，简答 4
            "answerCount": params.answerCount,//答案数
        };
        $.ajax({
            url: hostSetting + '/schoolwork/bulkAddQuestion?ajax=true',
            data: JSON.stringify(data),
            type: 'POST',
            headers: { Authorization: token },
            beforeSend: function(request) {                
               request.setRequestHeader("Authorization", token);
            },
            contentType: 'application/json;charset=utf-8 ',
            processData: false,
            success: function (result) {
                defer.resolve(result)
            },
            fail: function (data) {
                defer.reject(data)
            }
        });
        return defer
    },
    editTitle:function(params){
        var defer = $.Deferred();
        var data = {
            'schoolworkId': params.schoolworkId || '1', //作业本id
            "schoolworkName":params.schoolworkName
        };
        $.ajax({
            url: hostSetting + '/schoolwork/changeSchoolworkName?ajax=true',
            data: JSON.stringify(data),
            type: 'POST',
            headers: { Authorization: token },
            contentType: 'application/json;charset=utf-8 ',
            processData: false,
            success: function (result) {
                defer.resolve(result)
            },
            fail: function (data) {
                defer.reject(data)
            }
        });
        return defer
    },
    getCourseBook: function (params) {
        var defer = $.Deferred();
        /**
         * {
	        "cb":"01",       //册别
	        "edition":"RJ",  //教材版本
	        "grade": "01",   //年级
	        "subject":"SX"   //科目
            }
         *
         * 开心版KX  人教版RJ  北师大版BS  语文版YW 外研版WY  粤沪版YH  粤教版YJ 科粤版KY 中图版ZT 川教版CJ 湘教版XJ 粤人民版YR 其他（包含总复习、专项类书籍，此类书籍无教材版本限制）QT
         * 上册01，下册02  ，综合03，全一册04
         * **/
        var data = params || {
                "cb":"01",       //册别
                "edition":"RJ",  //教材版本
                "grade": "01",   //年级
                "subject":"SX"   //科目
            };
        $.ajax({
            url: hostSetting + '/schoolwork/queryAllList?ajax=true',
            data: JSON.stringify(data),
            type: 'POST',
            headers: { Authorization: token },
            contentType: 'application/json;charset=utf-8 ',
            processData: false,
            success: function (result) {
                /**
                 * [
                     {
                        "cb":"01",        //册别：上册01，下册02  ，综合03，全一册04
                        "createBy":"题库测试帐号",         //建立人
                        "createDate":1503565633123,         //创建时间
                        "edition":"RJ",                   //教材版本
                        "grade":"01",   //年级一~九年级分别是01~09? 高一~高三是10,11,12
                        "id":"",         //暂时没有用上
                        "name":"vinson测试测试用",   //教材名字
                        "schoolId":"",     //学校id(暂时没有用上)
                        "startyear":null,   //年份(暂时没有用上)
                        "subject":"YW",     //科目
                        "textbookId":"350325186228125696",  //教材id
                        "updateBy":"题库测试帐号",           //更新人
                        "updateDate":1503566101559,       //更新时间
                        "xq":""                //学期(暂时没有用上)
                       }
                 ]
                 * **/
                defer.resolve(result)
            },
            fail: function (data) {
                defer.reject(data)
            }
        });
        return defer
    },
    getChapter: function (textBookId) {
        var defer = $.Deferred();
        var data = {
            'textBookId': textBookId || '1'
        };
        $.ajax({
            url: hostSetting + '/schoolwork/getTbCatalogList?ajax=true',
            data: JSON.stringify(data),
            type: 'POST',
            headers: { Authorization: token },
            contentType: 'application/json;charset=utf-8 ',
            processData: false,
            success: function (result) {
                /**
                 * [
                 {
                 id
                 level: '层级:1,2,3,4 ',
                 page: 所在页码,
                 name: 章节名称,
                 orderBy: 排序,
                 paretId: '父编号，为空表示顶级'
                 }
                 ]
                 * **/
                defer.resolve(result)
            },
            fail: function (data) {
                defer.reject(data)
            }
        });
        return defer
    },
    getKnpList: function (params) {
        var defer = $.Deferred();
        var data = {
            'tbCatalogId': params.id || '1',
            'knpName': params.knpName || '' //知识点名字
        };
        $.ajax({
            url: hostSetting + '/schoolwork/getKnpList?ajax=true',
            data: JSON.stringify(data),
            type: 'POST',
            headers: { Authorization: token },
            contentType: 'application/json;charset=utf-8 ',
            processData: false,
            success: function (result) {
                /***
                 * [{
                 * "knpName": 知识点名
                    "knpId": 知识点id
                 *
                 * }]
                 *
                 * **/
                defer.resolve(result)
            },
            fail: function (data) {
                defer.reject(data)
            }
        });
        return defer
    },

    addAllKnp:function(params){
        var defer = $.Deferred();
        var data = {
            'schoolworkId': params.schoolworkId || '1', //作业本id
            'knpList': params.knpList || []//题目id
        };
        $.ajax({
            url: hostSetting + '/schoolwork/bulkAddKnp?ajax=true',
            data: JSON.stringify(data),
            type: 'POST',
            headers: { Authorization: token },
            contentType: 'application/json;charset=utf-8 ',
            processData: false,
            success: function (result) {
                defer.resolve(result)
            },
            fail: function (data) {
                defer.reject(data)
            }
        });
        return defer
    },
    modifyIsShowScore: function(params) {
            var defer = $.Deferred();
            $.ajax({
                url: hostSetting + '/schoolwork/modifyIsShowScore?ajax=true',
                data: JSON.stringify(params),
                type: 'POST',
                headers: { Authorization: token },
                contentType: 'application/json;charset=utf-8 ',
                processData: false,
                success: function success(result) {
                    defer.resolve(result);
                },
                fail: function fail(data) {
                    defer.reject(data);
                }
            });
            return defer;
        }
};