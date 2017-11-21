/**
 * Created by lomoliang on 2017/10/5.
 */
Vue.use(Vuex)
var ajax = require('../util/ajax.js')
function checkData(json){
    if(json.rtnCode == 0) {
        return json.bizData
    } else {
        return
    }
}
function showWrong(msg){
    if(msg) {
        console.log('出错:',msg)
    }
}
var answerCountMap = {
    2:['A','B'],
    3:['A','B','C'],
    4:['A','B','C','D'],
    5:['A','B','C','D','E'],
    6:['A','B','C','D','E','F'],
    7:['A','B','C','D','E','F','G'],
}
const store = new Vuex.Store({
    state: {
        currentBookId:'',
        qList:[],
        qListForRender:[],
        editData:[],
        previewHtml:'',
        bookInfo:{},
        eList:[],
        hideLayer:true,
        hideEdit:true,
        hideAddShare:true,
        hideKnp:true,
        hideAdd:true,
        orderInfomation:[],
        editingOrder:0,
        knpFilter:{
            cb:"01",       //册别
            edition:"RJ",  //教材版本
            grade: "01",   //年级
            subject:"SX"   //科目
        },
        courseBook:[],
        chapterList:[],
        showLoadingLayer:false,
        downloadLink:'',
        addModel:{},
        knpList:[]
    },
    actions: {
        /**
         * 获取试题基本信息
         * @param commit
         * @param params
         * @constructor
         */
        GET_BOOK_INFO:function({ commit },params) {
            commit('SET_BOOK_ID', { bookId: params.id});

            ajax.getSchoolWork(params.id).done(function(data){
                var json = JSON.parse(data);
                console.log('book info:',json)
                commit('SET_BOOK_INFO', { bookInfo: json.bizData.data})
            })
        },
        /**
         * 获取错题信息
         * @param commit
         * @param params
         * @constructor
         */
        GET_ERROR_QUESTIONS:function({ commit },params) {
            ajax.getErrorQuestion(params.id).done(function(data){
                var json = JSON.parse(data);
                console.log('error info:',json)

                commit('SET_ERROR_QUESTIONS', { eList: json.bizData.data})
            })
        },
        /**
         * 获取题目详细内容
         * @param commit
         * @param params
         * @constructor
         */
        GET_All_QUESTIONS:function({ commit },params) {
            ajax.getAllQuestion(params.id).done(function(data){
                var json = JSON.parse(data);
                console.log('stem info:',json)

                if(json.rtnCode == 0 && json.bizData) {
                    //先修复orderBy
                    json.bizData.data.forEach(function(v,i){
                        v.orderBy = i+1
                    });
                    commit('SET_NEW_QUESTIONS', { qList: json.bizData.data.slice(0) });
                    commit('SET_REDER_QUESTIONS', { qList: json.bizData.data.slice(0) });
                    commit('SET_EDIT_DATA', { editData: json.bizData.data.slice(0) })
                    commit('SET_ORDERINFOMATION', { orderInfo: json.bizData.data.slice(0) })
                } else {
                    showWrong(json.msg)
                }
            })
        },
        /**
         * 设置预览页html
         * @param commit
         * @param params
         * @constructor
         */
        CHANGE_HTML:function({ commit },params){
            commit('SET_HTML', { html: params.html })

        },
        //修改顺序
        CHANGE_ORDER:function({ commit,state,dispatch },params){

              if(params.isUp) {
                  commit('CHANGE_ORDER_UP', params.order)
              } else {
                  commit('CHANGE_ORDER_DOWN', params.order)
              }
              ajax.udQuestion({id:state.currentBookId,questionList:state.orderInfomation}).done(function(data){
                  dispatch('GET_All_QUESTIONS',{id:state.currentBookId})
              }).fail(function(){
                  console.log('fail')
                  dispatch('GET_All_QUESTIONS',{id:state.currentBookId})

              })
        },
        //添加题目
        ADD_NEW_QUESTION:function({ commit,state,dispatch },params){
            var param = {
                'schoolworkId': state.currentBookId, //作业本id
                "orderBy": state.addModel.orderBy,
                "endOrderBy":state.addModel.endOrderBy || state.addModel.orderBy ,//题目序号
                "qtypeInner": state.addModel.qtypeInner,//录入题型（内部题型）：单选1，多选2，简答 4
                "answerCount": (state.addModel.qtypeInner == 1 || state.addModel.qtypeInner == 2) ? state.addModel.answerCount : '',//答案数
            };
            var num = state.addModel.endOrderBy ? state.addModel.endOrderBy - state.addModel.orderBy + 1 : 1;
            //判断是插入还是新增
            if(state.addModel.insert){
                ajax.addQuestion(param).done(function(data){
                    console.log(data);
                    commit('MOVE_DOWN', {orderBy:state.addModel.orderBy,num:num});
                    ajax.udQuestion({id:state.currentBookId,questionList:state.orderInfomation}).done(function(data){
                        dispatch('GET_All_QUESTIONS',{id:state.currentBookId})
                    }).fail(function(){
                        console.log('fail')
                        dispatch('GET_All_QUESTIONS',{id:state.currentBookId})
                    })
                })
            } else {
                ajax.addQuestion(param).done(function(data){
                    console.log(data);
                    dispatch('GET_All_QUESTIONS',{id:state.currentBookId})
                })
            }
        },

        //删除题目
        DELETE_QUESTION:function({ commit,state,dispatch },params){
            var delData ={
                schoolworkId:state.currentBookId,
                questionId:state.orderInfomation[params.orderBy-1].questionId
            }
            ajax.delQuestion(delData).then(function(data){
                console.log(data)
                commit('MOVE_UP', params.orderBy)
                ajax.udQuestion({id:state.currentBookId,questionList:state.orderInfomation}).done(function(data){
                    dispatch('GET_All_QUESTIONS',{id:state.currentBookId})
                }).fail(function(){
                    console.log('fail')
                    dispatch('GET_All_QUESTIONS',{id:state.currentBookId})

                })
            })
        },
        //编辑题目
        EDIT_SAVE:function({ commit,state,dispatch },params){
            var param = {
                'schoolworkId': params.schoolworkId || state.currentBookId, //作业本id
                'questionId': params.questionId || '',//题目id
                "orderBy": params.orderBy,//题目序号
                "stem": params.stem,//题干
                "shareStem":params.shareStem || '',
                "score": params.score,//分数
                "qtypeInner": params.qtypeInner,//录入题型（内部题型）：单选1，多选2，简答 4
                "answerCount": params.answerCount,//答案数
                "answer": params.answer,//答案，用逗号','分割
                "difficulty": params.difficulty,//难度
                "knpList": params.knpList, //知识点，用逗号','分割
                "height":+params.height || 100
            };
            ajax.modifyQuestion(param).done(function(data){
                console.log(data)
                dispatch('GET_All_QUESTIONS',{id:state.currentBookId});
                dispatch('GET_ERROR_QUESTIONS', {id: state.currentBookId});
            })
        },

        UPDATE_COURSE_BOOK:function({ commit,state,dispatch },params){
            ajax.getCourseBook(params).done(function(data){
                var json = JSON.parse(data);
                console.log('coursebook info:',json)

                if(json.rtnCode == 0 && json.bizData) {
                    commit('SET_COURSE_BOOK', { courseBook: json.bizData.data.slice(0) });


                } else {

                }
            })
        },

        GET_CHAPTERS:function({ commit,state,dispatch },id){
            ajax.getChapter(id).done(function(data){
                var json = JSON.parse(data);
                console.log('chapters info:',json)
                commit('SET_CHAPTER', { chapterList: json.bizData.data.slice(0) });
            })
        },
        //获取知识点
        GET_KNPLIST:function({ commit,state,dispatch },id){

            ajax.getKnpList({id:id}).done(function(data){
                var json = JSON.parse(data);
                console.log('knp info:',json)
                commit('SET_KNPLIST',{knpList:json.bizData.data})
            })
        },
        ADD_ALL_KNP:function({ commit,state,dispatch },params){
            params = params || []
            ajax.addAllKnp({schoolworkId:state.currentBookId,knpList:params}).done(function(data){
                var json = JSON.parse(data);
                dispatch('GET_All_QUESTIONS',{id:state.currentBookId});
                dispatch('GET_ERROR_QUESTIONS', {id: state.currentBookId});
            })
        },
        ADD_MODEL:function({ commit,state,dispatch },params){
            var addModel = {
                'schoolworkId': state.currentBookId, //作业本id
                'questionId': '',//题目id
                "orderBy": params.orderBy || '',//题目序号
                "stem": '',//题干
                "score": '',//分数
                "qtypeInner": params.type || '',//录入题型（内部题型）：单选1，多选2，简答 4
                "answerCount": 4,//答案数
                "answer":'',//答案，用逗号','分割
                "difficulty": 0.5,//难度
                "knpList": [],
                "insert": params.insert//知识点，用逗号','分割
            };
            commit('SET_ADD_MODEL', { addModel: addModel });
        },

        EDIT_TITLE:function({commit,state,dispatch },name){
            var params = {
                'schoolworkId': state.currentBookId, //作业本id
                "schoolworkName":name
            }
            ajax.editTitle(params).done(function(data){
                console.log(data);
                dispatch('GET_BOOK_INFO',{id:state.currentBookId})
            })
        }
    },
    mutations: {
        SET_BOOK_ID:(state, { bookId }) => {
            state.currentBookId = bookId
            //state.knpFilter.grade = bookInfo.grade
            //state.knpFilter.subject = bookInfo.subject
        },
        SET_BOOK_INFO:(state, { bookInfo }) => {
            state.bookInfo = bookInfo
            state.knpFilter.grade = bookInfo.grade
            state.knpFilter.subject = bookInfo.subject
        },
        SET_ERROR_QUESTIONS:(state, { eList }) => {
            state.eList = eList
        },
        SET_NEW_QUESTIONS:(state, { qList }) => {
            state.qList = qList;
        },
        SET_REDER_QUESTIONS:(state, { qList }) => {
            $.each(qList,function(i,v){
               if(v.answerCount) {
                   v.answerCountArray = answerCountMap[v.answerCount]
               }
                if(!v.height){
                    v.height = 200;
                }
                
            });
            state.qListForRender = qList
        },
        SET_EDIT_DATA:(state, { editData }) => {
            state.editData = editData
        },
        SET_ORDERINFOMATION:(state, { orderInfo }) => {
            state.orderInfomation = [];
            orderInfo.forEach(function(v,i){
                state.orderInfomation.push({
                    questionId: v.questionId,
                    orderBy:v.orderBy,
                    score: v.score || 0
                })
            });
        },
        SET_CHAPTER:(state, { chapterList }) => {
            state.chapterList = chapterList
        },
        SET_HTML:(state, { html }) => {
            state.previewHtml = html
        },
        SET_COURSE_BOOK:(state, { courseBook }) => {
            state.courseBook = courseBook
        },
        SET_DOWNLOAD_LINK:(state,url)=>{
            state.downloadLink = url
        },
        CHANGE_ORDER_UP:(state,order) => {
            var temp = state.orderInfomation[order - 1]
            state.orderInfomation[order -1] = state.orderInfomation[order -2]
            state.orderInfomation[order -2] = temp
            state.orderInfomation[order -1].orderBy = +order
            state.orderInfomation[order -2].orderBy = +order - 1
        },
        CHANGE_ORDER_DOWN:(state,order) => {
            var temp = state.orderInfomation[order - 1]
            state.orderInfomation[order -1] = state.orderInfomation[order]
            state.orderInfomation[order] = temp
            state.orderInfomation[order - 1].orderBy = +order
            state.orderInfomation[order].orderBy = +order + 1
        },
        MOVE_UP:(state,order) => {
            state.orderInfomation.splice(order-1,1);
            for(var i= order- 1,l=state.orderInfomation.length;i<l;i++){
                state.orderInfomation[i].orderBy--
            }
        },
        MOVE_DOWN:(state,param) => {
            var order = param.orderBy;

            var num = param.num;
            for(var i= order - 1,l=state.orderInfomation.length;i<l;i++){
                console.log('MOVE_DOWN',state.orderInfomation[i].orderBy);
                state.orderInfomation[i].orderBy +=  num
            }
        },
        SHOW_KNP:(state) => {
            state.hideKnp = false
        },
        HIDE_KNP:(state) => {
            state.hideKnp = true
        },
        SHOW_EDIT:(state) => {
            state.hideEdit = false
        },
        HIDE_EDIT:(state) => {
            state.hideEdit = true
        },
        SHOW_ADD_SHARE:(state) => {
            state.hideAddShare = false
        },
        HIDE_ADD_SHARE:(state) => {
            state.hideAddShare = true
        },
        CHANGE_EDITING_ORDER:(state,order)=>{
            state.editingOrder = order
        },
        SHOW_LOADING:(state)=>{
            state.showLoadingLayer = true
        },
        HIDE_LOADING:(state)=>{
            state.showLoadingLayer = false
        },
        SHOW_ADD:(state)=>{
            state.hideAdd = false
        },
        HIDE_ADD:(state)=>{
            state.hideAdd = true
        },
        SET_ADD_MODEL:(state,{ addModel })=>{
            state.addModel = addModel
        },
        SET_KNPLIST:(state, { knpList }) => {
            state.knpList = knpList
            //state.knpFilter.grade = bookInfo.grade
            //state.knpFilter.subject = bookInfo.subject
        },
    },
    getters: {

    }
});
module.exports = store;