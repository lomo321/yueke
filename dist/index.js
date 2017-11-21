'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/******/(function (modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/var installedModules = {};

	/******/ // The require function
	/******/function __webpack_require__(moduleId) {

		/******/ // Check if module is in cache
		/******/if (installedModules[moduleId])
			/******/return installedModules[moduleId].exports;

		/******/ // Create a new module (and put it into the cache)
		/******/var module = installedModules[moduleId] = {
			/******/exports: {},
			/******/id: moduleId,
			/******/loaded: false
			/******/ };

		/******/ // Execute the module function
		/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		/******/ // Flag the module as loaded
		/******/module.loaded = true;

		/******/ // Return the exports of the module
		/******/return module.exports;
		/******/
	}

	/******/ // expose the modules object (__webpack_modules__)
	/******/__webpack_require__.m = modules;

	/******/ // expose the module cache
	/******/__webpack_require__.c = installedModules;

	/******/ // __webpack_public_path__
	/******/__webpack_require__.p = "";

	/******/ // Load entry module and return exports
	/******/return __webpack_require__(0);
	/******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);

	/***/
},
/* 1 */
/***/function (module, exports, __webpack_require__) {

	/**
  * Created by lomo on 2017/10/5.
  */
	var store = __webpack_require__(2);
	var VueRouter = __webpack_require__(4);
	var routes = __webpack_require__(6);

	Vue.use(VueRouter);
	//创建路由
	var router = new VueRouter({
		mode: 'hash', //路由的模式
		routes: routes
	});
	new Vue({
		el: '#app',
		router: router,
		store: store
		//render: h => h(App)
	});

	/***/
},
/* 2 */
/***/function (module, exports, __webpack_require__) {

	/**
  * Created by lomoliang on 2017/10/5.
  */
	Vue.use(Vuex);
	var ajax = __webpack_require__(3);
	function checkData(json) {
		if (json.rtnCode == 0) {
			return json.bizData;
		} else {
			return;
		}
	}
	function showWrong(msg) {
		if (msg) {
			console.log('出错:', msg);
		}
	}
	var answerCountMap = {
		2: ['A', 'B'],
		3: ['A', 'B', 'C'],
		4: ['A', 'B', 'C', 'D'],
		5: ['A', 'B', 'C', 'D', 'E'],
		6: ['A', 'B', 'C', 'D', 'E', 'F'],
		7: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
	};
	var store = new Vuex.Store({
		state: {
			currentBookId: '',
			qList: [],
			qListForRender: [],
			editData: [],
			previewHtml: '',
			bookInfo: {},
			eList: [],
			hideLayer: true,
			hideEdit: true,
			hideAddShare: true,
			hideKnp: true,
			hideAdd: true,
			orderInfomation: [],
			editingOrder: 0,
			knpFilter: {
				cb: "01", //册别
				edition: "RJ", //教材版本
				grade: "01", //年级
				subject: "SX" //科目
			},
			courseBook: [],
			chapterList: [],
			showLoadingLayer: false,
			downloadLink: '',
			addModel: {},
			knpList: []
		},
		actions: {
			/**
    * 获取试题基本信息
    * @param commit
    * @param params
    * @constructor
    */
			GET_BOOK_INFO: function GET_BOOK_INFO(_ref, params) {
				var commit = _ref.commit;

				commit('SET_BOOK_ID', { bookId: params.id });

				ajax.getSchoolWork(params.id).done(function (data) {
					var json = JSON.parse(data);
					console.log('book info:', json);
					commit('SET_BOOK_INFO', { bookInfo: json.bizData.data });
				});
			},
			/**
    * 获取错题信息
    * @param commit
    * @param params
    * @constructor
    */
			GET_ERROR_QUESTIONS: function GET_ERROR_QUESTIONS(_ref2, params) {
				var commit = _ref2.commit;

				ajax.getErrorQuestion(params.id).done(function (data) {
					var json = JSON.parse(data);
					console.log('error info:', json);

					commit('SET_ERROR_QUESTIONS', { eList: json.bizData.data });
				});
			},
			/**
    * 获取题目详细内容
    * @param commit
    * @param params
    * @constructor
    */
			GET_All_QUESTIONS: function GET_All_QUESTIONS(_ref3, params) {
				var commit = _ref3.commit;

				ajax.getAllQuestion(params.id).done(function (data) {
					var json = JSON.parse(data);
					console.log('stem info:', json);

					if (json.rtnCode == 0 && json.bizData) {
						//先修复orderBy
						json.bizData.data.forEach(function (v, i) {
							v.orderBy = i + 1;
						});
						commit('SET_NEW_QUESTIONS', { qList: json.bizData.data.slice(0) });
						commit('SET_REDER_QUESTIONS', { qList: json.bizData.data.slice(0) });
						commit('SET_EDIT_DATA', { editData: json.bizData.data.slice(0) });
						commit('SET_ORDERINFOMATION', { orderInfo: json.bizData.data.slice(0) });
					} else {
						showWrong(json.msg);
					}
				});
			},
			/**
    * 设置预览页html
    * @param commit
    * @param params
    * @constructor
    */
			CHANGE_HTML: function CHANGE_HTML(_ref4, params) {
				var commit = _ref4.commit;

				commit('SET_HTML', { html: params.html });
			},
			//修改顺序
			CHANGE_ORDER: function CHANGE_ORDER(_ref5, params) {
				var commit = _ref5.commit,
				    state = _ref5.state,
				    dispatch = _ref5.dispatch;


				if (params.isUp) {
					commit('CHANGE_ORDER_UP', params.order);
				} else {
					commit('CHANGE_ORDER_DOWN', params.order);
				}
				ajax.udQuestion({ id: state.currentBookId, questionList: state.orderInfomation }).done(function (data) {
					dispatch('GET_All_QUESTIONS', { id: state.currentBookId });
				}).fail(function () {
					console.log('fail');
					dispatch('GET_All_QUESTIONS', { id: state.currentBookId });
				});
			},
			//添加题目
			ADD_NEW_QUESTION: function ADD_NEW_QUESTION(_ref6, params) {
				var commit = _ref6.commit,
				    state = _ref6.state,
				    dispatch = _ref6.dispatch;

				var param = {
					'schoolworkId': state.currentBookId, //作业本id
					"orderBy": state.addModel.orderBy,
					"endOrderBy": state.addModel.endOrderBy || state.addModel.orderBy, //题目序号
					"qtypeInner": state.addModel.qtypeInner, //录入题型（内部题型）：单选1，多选2，简答 4
					"answerCount": state.addModel.qtypeInner == 1 || state.addModel.qtypeInner == 2 ? state.addModel.answerCount : '' //答案数
				};
				var num = state.addModel.endOrderBy ? state.addModel.endOrderBy - state.addModel.orderBy + 1 : 1;
				//判断是插入还是新增
				if (state.addModel.insert) {
					ajax.addQuestion(param).done(function (data) {
						console.log(data);
						commit('MOVE_DOWN', { orderBy: state.addModel.orderBy, num: num });
						ajax.udQuestion({ id: state.currentBookId, questionList: state.orderInfomation }).done(function (data) {
							dispatch('GET_All_QUESTIONS', { id: state.currentBookId });
						}).fail(function () {
							console.log('fail');
							dispatch('GET_All_QUESTIONS', { id: state.currentBookId });
						});
					});
				} else {
					ajax.addQuestion(param).done(function (data) {
						console.log(data);
						dispatch('GET_All_QUESTIONS', { id: state.currentBookId });
					});
				}
			},

			//删除题目
			DELETE_QUESTION: function DELETE_QUESTION(_ref7, params) {
				var commit = _ref7.commit,
				    state = _ref7.state,
				    dispatch = _ref7.dispatch;

				var delData = {
					schoolworkId: state.currentBookId,
					questionId: state.orderInfomation[params.orderBy - 1].questionId
				};
				ajax.delQuestion(delData).then(function (data) {
					console.log(data);
					commit('MOVE_UP', params.orderBy);
					ajax.udQuestion({ id: state.currentBookId, questionList: state.orderInfomation }).done(function (data) {
						dispatch('GET_All_QUESTIONS', { id: state.currentBookId });
					}).fail(function () {
						console.log('fail');
						dispatch('GET_All_QUESTIONS', { id: state.currentBookId });
					});
				});
			},
			//编辑题目
			EDIT_SAVE: function EDIT_SAVE(_ref8, params) {
				var commit = _ref8.commit,
				    state = _ref8.state,
				    dispatch = _ref8.dispatch;

				var param = {
					'schoolworkId': params.schoolworkId || state.currentBookId, //作业本id
					'questionId': params.questionId || '', //题目id
					"orderBy": params.orderBy, //题目序号
					"stem": params.stem, //题干
					"shareStem": params.shareStem || '',
					"score": params.score, //分数
					"qtypeInner": params.qtypeInner, //录入题型（内部题型）：单选1，多选2，简答 4
					"answerCount": params.answerCount, //答案数
					"answer": params.answer, //答案，用逗号','分割
					"difficulty": params.difficulty, //难度
					"knpList": params.knpList, //知识点，用逗号','分割
					"height": +params.height || 100
				};
				ajax.modifyQuestion(param).done(function (data) {
					console.log(data);
					dispatch('GET_All_QUESTIONS', { id: state.currentBookId });
					dispatch('GET_ERROR_QUESTIONS', { id: state.currentBookId });
				});
			},

			UPDATE_COURSE_BOOK: function UPDATE_COURSE_BOOK(_ref9, params) {
				var commit = _ref9.commit,
				    state = _ref9.state,
				    dispatch = _ref9.dispatch;

				ajax.getCourseBook(params).done(function (data) {
					var json = JSON.parse(data);
					console.log('coursebook info:', json);

					if (json.rtnCode == 0 && json.bizData) {
						commit('SET_COURSE_BOOK', { courseBook: json.bizData.data.slice(0) });
					} else {}
				});
			},

			GET_CHAPTERS: function GET_CHAPTERS(_ref10, id) {
				var commit = _ref10.commit,
				    state = _ref10.state,
				    dispatch = _ref10.dispatch;

				ajax.getChapter(id).done(function (data) {
					var json = JSON.parse(data);
					console.log('chapters info:', json);
					commit('SET_CHAPTER', { chapterList: json.bizData.data.slice(0) });
				});
			},
			//获取知识点
			GET_KNPLIST: function GET_KNPLIST(_ref11, id) {
				var commit = _ref11.commit,
				    state = _ref11.state,
				    dispatch = _ref11.dispatch;


				ajax.getKnpList({ id: id }).done(function (data) {
					var json = JSON.parse(data);
					console.log('knp info:', json);
					commit('SET_KNPLIST', { knpList: json.bizData.data });
				});
			},
			ADD_ALL_KNP: function ADD_ALL_KNP(_ref12, params) {
				var commit = _ref12.commit,
				    state = _ref12.state,
				    dispatch = _ref12.dispatch;

				params = params || [];
				ajax.addAllKnp({ schoolworkId: state.currentBookId, knpList: params }).done(function (data) {
					var json = JSON.parse(data);
					dispatch('GET_All_QUESTIONS', { id: state.currentBookId });
					dispatch('GET_ERROR_QUESTIONS', { id: state.currentBookId });
				});
			},
			ADD_MODEL: function ADD_MODEL(_ref13, params) {
				var commit = _ref13.commit,
				    state = _ref13.state,
				    dispatch = _ref13.dispatch;

				var addModel = {
					'schoolworkId': state.currentBookId, //作业本id
					'questionId': '', //题目id
					"orderBy": params.orderBy || '', //题目序号
					"stem": '', //题干
					"score": '', //分数
					"qtypeInner": params.type || '', //录入题型（内部题型）：单选1，多选2，简答 4
					"answerCount": 4, //答案数
					"answer": '', //答案，用逗号','分割
					"difficulty": 0.5, //难度
					"knpList": [],
					"insert": params.insert //知识点，用逗号','分割
				};
				commit('SET_ADD_MODEL', { addModel: addModel });
			},

			EDIT_TITLE: function EDIT_TITLE(_ref14, name) {
				var commit = _ref14.commit,
				    state = _ref14.state,
				    dispatch = _ref14.dispatch;

				var params = {
					'schoolworkId': state.currentBookId, //作业本id
					"schoolworkName": name
				};
				ajax.editTitle(params).done(function (data) {
					console.log(data);
					dispatch('GET_BOOK_INFO', { id: state.currentBookId });
				});
			}
		},
		mutations: {
			SET_BOOK_ID: function SET_BOOK_ID(state, _ref15) {
				var bookId = _ref15.bookId;

				state.currentBookId = bookId;
				//state.knpFilter.grade = bookInfo.grade
				//state.knpFilter.subject = bookInfo.subject
			},
			SET_BOOK_INFO: function SET_BOOK_INFO(state, _ref16) {
				var bookInfo = _ref16.bookInfo;

				state.bookInfo = bookInfo;
				state.knpFilter.grade = bookInfo.grade;
				state.knpFilter.subject = bookInfo.subject;
			},
			SET_ERROR_QUESTIONS: function SET_ERROR_QUESTIONS(state, _ref17) {
				var eList = _ref17.eList;

				state.eList = eList;
			},
			SET_NEW_QUESTIONS: function SET_NEW_QUESTIONS(state, _ref18) {
				var qList = _ref18.qList;

				state.qList = qList;
			},
			SET_REDER_QUESTIONS: function SET_REDER_QUESTIONS(state, _ref19) {
				var qList = _ref19.qList;

				$.each(qList, function (i, v) {
					if (v.answerCount) {
						v.answerCountArray = answerCountMap[v.answerCount];
					}
					if (!v.height) {
						v.height = 200;
					}
				});
				state.qListForRender = qList;
			},
			SET_EDIT_DATA: function SET_EDIT_DATA(state, _ref20) {
				var editData = _ref20.editData;

				state.editData = editData;
			},
			SET_ORDERINFOMATION: function SET_ORDERINFOMATION(state, _ref21) {
				var orderInfo = _ref21.orderInfo;

				state.orderInfomation = [];
				orderInfo.forEach(function (v, i) {
					state.orderInfomation.push({
						questionId: v.questionId,
						orderBy: v.orderBy,
						score: v.score || 0
					});
				});
			},
			SET_CHAPTER: function SET_CHAPTER(state, _ref22) {
				var chapterList = _ref22.chapterList;

				state.chapterList = chapterList;
			},
			SET_HTML: function SET_HTML(state, _ref23) {
				var html = _ref23.html;

				state.previewHtml = html;
			},
			SET_COURSE_BOOK: function SET_COURSE_BOOK(state, _ref24) {
				var courseBook = _ref24.courseBook;

				state.courseBook = courseBook;
			},
			SET_DOWNLOAD_LINK: function SET_DOWNLOAD_LINK(state, url) {
				state.downloadLink = url;
			},
			CHANGE_ORDER_UP: function CHANGE_ORDER_UP(state, order) {
				var temp = state.orderInfomation[order - 1];
				state.orderInfomation[order - 1] = state.orderInfomation[order - 2];
				state.orderInfomation[order - 2] = temp;
				state.orderInfomation[order - 1].orderBy = +order;
				state.orderInfomation[order - 2].orderBy = +order - 1;
			},
			CHANGE_ORDER_DOWN: function CHANGE_ORDER_DOWN(state, order) {
				var temp = state.orderInfomation[order - 1];
				state.orderInfomation[order - 1] = state.orderInfomation[order];
				state.orderInfomation[order] = temp;
				state.orderInfomation[order - 1].orderBy = +order;
				state.orderInfomation[order].orderBy = +order + 1;
			},
			MOVE_UP: function MOVE_UP(state, order) {
				state.orderInfomation.splice(order - 1, 1);
				for (var i = order - 1, l = state.orderInfomation.length; i < l; i++) {
					state.orderInfomation[i].orderBy--;
				}
			},
			MOVE_DOWN: function MOVE_DOWN(state, param) {
				var order = param.orderBy;

				var num = param.num;
				for (var i = order - 1, l = state.orderInfomation.length; i < l; i++) {
					console.log('MOVE_DOWN', state.orderInfomation[i].orderBy);
					state.orderInfomation[i].orderBy += num;
				}
			},
			SHOW_KNP: function SHOW_KNP(state) {
				state.hideKnp = false;
			},
			HIDE_KNP: function HIDE_KNP(state) {
				state.hideKnp = true;
			},
			SHOW_EDIT: function SHOW_EDIT(state) {
				state.hideEdit = false;
			},
			HIDE_EDIT: function HIDE_EDIT(state) {
				state.hideEdit = true;
			},
			SHOW_ADD_SHARE: function SHOW_ADD_SHARE(state) {
				state.hideAddShare = false;
			},
			HIDE_ADD_SHARE: function HIDE_ADD_SHARE(state) {
				state.hideAddShare = true;
			},
			CHANGE_EDITING_ORDER: function CHANGE_EDITING_ORDER(state, order) {
				state.editingOrder = order;
			},
			SHOW_LOADING: function SHOW_LOADING(state) {
				state.showLoadingLayer = true;
			},
			HIDE_LOADING: function HIDE_LOADING(state) {
				state.showLoadingLayer = false;
			},
			SHOW_ADD: function SHOW_ADD(state) {
				state.hideAdd = false;
			},
			HIDE_ADD: function HIDE_ADD(state) {
				state.hideAdd = true;
			},
			SET_ADD_MODEL: function SET_ADD_MODEL(state, _ref25) {
				var addModel = _ref25.addModel;

				state.addModel = addModel;
			},
			SET_KNPLIST: function SET_KNPLIST(state, _ref26) {
				var knpList = _ref26.knpList;

				state.knpList = knpList;
				//state.knpFilter.grade = bookInfo.grade
				//state.knpFilter.subject = bookInfo.subject
			}
		},
		getters: {}
	});
	module.exports = store;

	/***/
},
/* 3 */
/***/function (module, exports) {

	/**
  * Created by lomo on 2017/10/7.
  */
	var hostSetting = window.hostSetting || 'http://211.159.185.181:8080';
	module.exports = {
		getSchoolWork: function getSchoolWork(id) {
			var defer = $.Deferred();
			var data = {
				'schoolworkId': id || '1'
			};
			$.ajax({
				url: hostSetting + '/schoolwork/getSchoolwork?ajax=true',
				data: JSON.stringify(data),
				type: 'POST',
				contentType: 'application/json;charset=utf-8 ',
				processData: false,
				success: function success(result) {

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
      * **/
					defer.resolve(result);
				},
				fail: function fail(data) {
					defer.reject(data);
				}
			});
			return defer;
		},
		getErrorQuestion: function getErrorQuestion(id) {
			var defer = $.Deferred();
			var data = {
				'schoolworkId': id || '1'
			};
			$.ajax({
				url: hostSetting + '/schoolwork/getErrorSchoolwork?ajax=true',
				data: JSON.stringify(data),
				type: 'POST',
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
		},
		getAllQuestion: function getAllQuestion(id) {
			var defer = $.Deferred();
			var data = {
				'schoolworkId': id || '1'
			};
			$.ajax({
				url: hostSetting + '/schoolwork/getNormalQuestion?ajax=true',
				data: JSON.stringify(data),
				type: 'POST',
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
		},

		getQuestion: function getQuestion(params) {
			var defer = $.Deferred();
			var data = {
				'schoolworkId': params.id || '1', //作业本id
				'questionId': params.qId || '' //题目id
			};
			$.ajax({
				url: hostSetting + '/schoolwork/getQuestionDetails?ajax=true',
				data: JSON.stringify(data),
				type: 'POST',
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
		},
		modifyQuestion: function modifyQuestion(params) {
			var defer = $.Deferred();
			var data = {
				'schoolworkId': params.schoolworkId || '1', //作业本id
				'questionId': params.questionId || '', //题目id
				"orderBy": params.orderBy, //题目序号
				"stem": params.stem, //题干
				"shareStem": params.shareStem || '',
				"score": params.score, //分数
				"qtypeInner": params.qtypeInner, //录入题型（内部题型）：单选1，多选2，简答 4
				"answerCount": params.answerCount, //答案数
				"answer": params.answer, //答案，用逗号','分割
				"difficulty": params.difficulty, //难度
				"knpList": params.knpList, //知识点，用逗号','分割
				"height": params.height || 100

			};
			$.ajax({
				url: hostSetting + '/schoolwork/modify?ajax=true',
				data: JSON.stringify(params),
				type: 'POST',
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
		},
		delQuestion: function delQuestion(params) {
			var defer = $.Deferred();
			var data = {
				'schoolworkId': params.schoolworkId || '1', //作业本id
				'questionId': params.questionId || '' //题目id
			};
			$.ajax({
				url: hostSetting + '/schoolwork/delQuestion?ajax=true',
				data: JSON.stringify(data),
				type: 'POST',
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
		},
		udQuestion: function udQuestion(params) {
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
				contentType: 'application/json;charset=utf-8 ',
				processData: false,
				success: function success(result) {
					defer.resolve(result);
				},
				fail: function fail(data) {
					console.log('~~~~~');
					defer.reject();
				}
			});
			return defer;
		},
		addQuestion: function addQuestion(params) {
			var defer = $.Deferred();
			var data = {
				'schoolworkId': params.schoolworkId || '1', //作业本id
				"orderBy": params.orderBy, //题目序号
				"endOrderBy": params.endOrderBy,
				"qtypeInner": params.qtypeInner, //录入题型（内部题型）：单选1，多选2，简答 4
				"answerCount": params.answerCount //答案数
			};
			$.ajax({
				url: hostSetting + '/schoolwork/bulkAddQuestion?ajax=true',
				data: JSON.stringify(data),
				type: 'POST',
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
		},
		editTitle: function editTitle(params) {
			var defer = $.Deferred();
			var data = {
				'schoolworkId': params.schoolworkId || '1', //作业本id
				"schoolworkName": params.schoolworkName
			};
			$.ajax({
				url: hostSetting + '/schoolwork/changeSchoolworkName?ajax=true',
				data: JSON.stringify(data),
				type: 'POST',
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
		},
		getCourseBook: function getCourseBook(params) {
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
				"cb": "01", //册别
				"edition": "RJ", //教材版本
				"grade": "01", //年级
				"subject": "SX" //科目
			};
			$.ajax({
				url: hostSetting + '/schoolwork/queryAllList?ajax=true',
				data: JSON.stringify(data),
				type: 'POST',
				contentType: 'application/json;charset=utf-8 ',
				processData: false,
				success: function success(result) {
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
					defer.resolve(result);
				},
				fail: function fail(data) {
					defer.reject(data);
				}
			});
			return defer;
		},
		getChapter: function getChapter(textBookId) {
			var defer = $.Deferred();
			var data = {
				'textBookId': textBookId || '1'
			};
			$.ajax({
				url: hostSetting + '/schoolwork/getTbCatalogList?ajax=true',
				data: JSON.stringify(data),
				type: 'POST',
				contentType: 'application/json;charset=utf-8 ',
				processData: false,
				success: function success(result) {
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
					defer.resolve(result);
				},
				fail: function fail(data) {
					defer.reject(data);
				}
			});
			return defer;
		},
		getKnpList: function getKnpList(params) {
			var defer = $.Deferred();
			var data = {
				'tbCatalogId': params.id || '1',
				'knpName': params.knpName || '' //知识点名字
			};
			$.ajax({
				url: hostSetting + '/schoolwork/getKnpList?ajax=true',
				data: JSON.stringify(data),
				type: 'POST',
				contentType: 'application/json;charset=utf-8 ',
				processData: false,
				success: function success(result) {
					/***
      * [{
      * "knpName": 知识点名
         "knpId": 知识点id
      *
      * }]
      *
      * **/
					defer.resolve(result);
				},
				fail: function fail(data) {
					defer.reject(data);
				}
			});
			return defer;
		},

		addAllKnp: function addAllKnp(params) {
			var defer = $.Deferred();
			var data = {
				'schoolworkId': params.schoolworkId || '1', //作业本id
				'knpList': params.knpList || [] //题目id
			};
			$.ajax({
				url: hostSetting + '/schoolwork/bulkAddKnp?ajax=true',
				data: JSON.stringify(data),
				type: 'POST',
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

	/***/
},
/* 4 */
/***/function (module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function (process) {
		/**
  * vue-router v2.8.1
  * (c) 2017 Evan You
  * @license MIT
  */
		'use strict';

		/*  */

		function assert(condition, message) {
			if (!condition) {
				throw new Error("[vue-router] " + message);
			}
		}

		function warn(condition, message) {
			if (process.env.NODE_ENV !== 'production' && !condition) {
				typeof console !== 'undefined' && console.warn("[vue-router] " + message);
			}
		}

		function isError(err) {
			return Object.prototype.toString.call(err).indexOf('Error') > -1;
		}

		var View = {
			name: 'router-view',
			functional: true,
			props: {
				name: {
					type: String,
					default: 'default'
				}
			},
			render: function render(_, ref) {
				var props = ref.props;
				var children = ref.children;
				var parent = ref.parent;
				var data = ref.data;

				data.routerView = true;

				// directly use parent context's createElement() function
				// so that components rendered by router-view can resolve named slots
				var h = parent.$createElement;
				var name = props.name;
				var route = parent.$route;
				var cache = parent._routerViewCache || (parent._routerViewCache = {});

				// determine current view depth, also check to see if the tree
				// has been toggled inactive but kept-alive.
				var depth = 0;
				var inactive = false;
				while (parent && parent._routerRoot !== parent) {
					if (parent.$vnode && parent.$vnode.data.routerView) {
						depth++;
					}
					if (parent._inactive) {
						inactive = true;
					}
					parent = parent.$parent;
				}
				data.routerViewDepth = depth;

				// render previous view if the tree is inactive and kept-alive
				if (inactive) {
					return h(cache[name], data, children);
				}

				var matched = route.matched[depth];
				// render empty node if no matched route
				if (!matched) {
					cache[name] = null;
					return h();
				}

				var component = cache[name] = matched.components[name];

				// attach instance registration hook
				// this will be called in the instance's injected lifecycle hooks
				data.registerRouteInstance = function (vm, val) {
					// val could be undefined for unregistration
					var current = matched.instances[name];
					if (val && current !== vm || !val && current === vm) {
						matched.instances[name] = val;
					}
				}

				// also register instance in prepatch hook
				// in case the same component instance is reused across different routes
				;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
					matched.instances[name] = vnode.componentInstance;
				};

				// resolve props
				var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
				if (propsToPass) {
					// clone to prevent mutation
					propsToPass = data.props = extend({}, propsToPass);
					// pass non-declared props as attrs
					var attrs = data.attrs = data.attrs || {};
					for (var key in propsToPass) {
						if (!component.props || !(key in component.props)) {
							attrs[key] = propsToPass[key];
							delete propsToPass[key];
						}
					}
				}

				return h(component, data, children);
			}
		};

		function resolveProps(route, config) {
			switch (typeof config === 'undefined' ? 'undefined' : _typeof(config)) {
				case 'undefined':
					return;
				case 'object':
					return config;
				case 'function':
					return config(route);
				case 'boolean':
					return config ? route.params : undefined;
				default:
					if (process.env.NODE_ENV !== 'production') {
						warn(false, "props in \"" + route.path + "\" is a " + (typeof config === 'undefined' ? 'undefined' : _typeof(config)) + ", " + "expecting an object, function or boolean.");
					}
			}
		}

		function extend(to, from) {
			for (var key in from) {
				to[key] = from[key];
			}
			return to;
		}

		/*  */

		var encodeReserveRE = /[!'()*]/g;
		var encodeReserveReplacer = function encodeReserveReplacer(c) {
			return '%' + c.charCodeAt(0).toString(16);
		};
		var commaRE = /%2C/g;

		// fixed encodeURIComponent which is more conformant to RFC3986:
		// - escapes [!'()*]
		// - preserve commas
		var encode = function encode(str) {
			return encodeURIComponent(str).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ',');
		};

		var decode = decodeURIComponent;

		function resolveQuery(query, extraQuery, _parseQuery) {
			if (extraQuery === void 0) extraQuery = {};

			var parse = _parseQuery || parseQuery;
			var parsedQuery;
			try {
				parsedQuery = parse(query || '');
			} catch (e) {
				process.env.NODE_ENV !== 'production' && warn(false, e.message);
				parsedQuery = {};
			}
			for (var key in extraQuery) {
				parsedQuery[key] = extraQuery[key];
			}
			return parsedQuery;
		}

		function parseQuery(query) {
			var res = {};

			query = query.trim().replace(/^(\?|#|&)/, '');

			if (!query) {
				return res;
			}

			query.split('&').forEach(function (param) {
				var parts = param.replace(/\+/g, ' ').split('=');
				var key = decode(parts.shift());
				var val = parts.length > 0 ? decode(parts.join('=')) : null;

				if (res[key] === undefined) {
					res[key] = val;
				} else if (Array.isArray(res[key])) {
					res[key].push(val);
				} else {
					res[key] = [res[key], val];
				}
			});

			return res;
		}

		function stringifyQuery(obj) {
			var res = obj ? Object.keys(obj).map(function (key) {
				var val = obj[key];

				if (val === undefined) {
					return '';
				}

				if (val === null) {
					return encode(key);
				}

				if (Array.isArray(val)) {
					var result = [];
					val.forEach(function (val2) {
						if (val2 === undefined) {
							return;
						}
						if (val2 === null) {
							result.push(encode(key));
						} else {
							result.push(encode(key) + '=' + encode(val2));
						}
					});
					return result.join('&');
				}

				return encode(key) + '=' + encode(val);
			}).filter(function (x) {
				return x.length > 0;
			}).join('&') : null;
			return res ? "?" + res : '';
		}

		/*  */

		var trailingSlashRE = /\/?$/;

		function createRoute(record, location, redirectedFrom, router) {
			var stringifyQuery$$1 = router && router.options.stringifyQuery;

			var query = location.query || {};
			try {
				query = clone(query);
			} catch (e) {}

			var route = {
				name: location.name || record && record.name,
				meta: record && record.meta || {},
				path: location.path || '/',
				hash: location.hash || '',
				query: query,
				params: location.params || {},
				fullPath: getFullPath(location, stringifyQuery$$1),
				matched: record ? formatMatch(record) : []
			};
			if (redirectedFrom) {
				route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
			}
			return Object.freeze(route);
		}

		function clone(value) {
			if (Array.isArray(value)) {
				return value.map(clone);
			} else if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
				var res = {};
				for (var key in value) {
					res[key] = clone(value[key]);
				}
				return res;
			} else {
				return value;
			}
		}

		// the starting route that represents the initial state
		var START = createRoute(null, {
			path: '/'
		});

		function formatMatch(record) {
			var res = [];
			while (record) {
				res.unshift(record);
				record = record.parent;
			}
			return res;
		}

		function getFullPath(ref, _stringifyQuery) {
			var path = ref.path;
			var query = ref.query;if (query === void 0) query = {};
			var hash = ref.hash;if (hash === void 0) hash = '';

			var stringify = _stringifyQuery || stringifyQuery;
			return (path || '/') + stringify(query) + hash;
		}

		function isSameRoute(a, b) {
			if (b === START) {
				return a === b;
			} else if (!b) {
				return false;
			} else if (a.path && b.path) {
				return a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') && a.hash === b.hash && isObjectEqual(a.query, b.query);
			} else if (a.name && b.name) {
				return a.name === b.name && a.hash === b.hash && isObjectEqual(a.query, b.query) && isObjectEqual(a.params, b.params);
			} else {
				return false;
			}
		}

		function isObjectEqual(a, b) {
			if (a === void 0) a = {};
			if (b === void 0) b = {};

			// handle null value #1566
			if (!a || !b) {
				return a === b;
			}
			var aKeys = Object.keys(a);
			var bKeys = Object.keys(b);
			if (aKeys.length !== bKeys.length) {
				return false;
			}
			return aKeys.every(function (key) {
				var aVal = a[key];
				var bVal = b[key];
				// check nested equality
				if ((typeof aVal === 'undefined' ? 'undefined' : _typeof(aVal)) === 'object' && (typeof bVal === 'undefined' ? 'undefined' : _typeof(bVal)) === 'object') {
					return isObjectEqual(aVal, bVal);
				}
				return String(aVal) === String(bVal);
			});
		}

		function isIncludedRoute(current, target) {
			return current.path.replace(trailingSlashRE, '/').indexOf(target.path.replace(trailingSlashRE, '/')) === 0 && (!target.hash || current.hash === target.hash) && queryIncludes(current.query, target.query);
		}

		function queryIncludes(current, target) {
			for (var key in target) {
				if (!(key in current)) {
					return false;
				}
			}
			return true;
		}

		/*  */

		// work around weird flow bug
		var toTypes = [String, Object];
		var eventTypes = [String, Array];

		var Link = {
			name: 'router-link',
			props: {
				to: {
					type: toTypes,
					required: true
				},
				tag: {
					type: String,
					default: 'a'
				},
				exact: Boolean,
				append: Boolean,
				replace: Boolean,
				activeClass: String,
				exactActiveClass: String,
				event: {
					type: eventTypes,
					default: 'click'
				}
			},
			render: function render(h) {
				var this$1 = this;

				var router = this.$router;
				var current = this.$route;
				var ref = router.resolve(this.to, current, this.append);
				var location = ref.location;
				var route = ref.route;
				var href = ref.href;

				var classes = {};
				var globalActiveClass = router.options.linkActiveClass;
				var globalExactActiveClass = router.options.linkExactActiveClass;
				// Support global empty active class
				var activeClassFallback = globalActiveClass == null ? 'router-link-active' : globalActiveClass;
				var exactActiveClassFallback = globalExactActiveClass == null ? 'router-link-exact-active' : globalExactActiveClass;
				var activeClass = this.activeClass == null ? activeClassFallback : this.activeClass;
				var exactActiveClass = this.exactActiveClass == null ? exactActiveClassFallback : this.exactActiveClass;
				var compareTarget = location.path ? createRoute(null, location, null, router) : route;

				classes[exactActiveClass] = isSameRoute(current, compareTarget);
				classes[activeClass] = this.exact ? classes[exactActiveClass] : isIncludedRoute(current, compareTarget);

				var handler = function handler(e) {
					if (guardEvent(e)) {
						if (this$1.replace) {
							router.replace(location);
						} else {
							router.push(location);
						}
					}
				};

				var on = { click: guardEvent };
				if (Array.isArray(this.event)) {
					this.event.forEach(function (e) {
						on[e] = handler;
					});
				} else {
					on[this.event] = handler;
				}

				var data = {
					class: classes
				};

				if (this.tag === 'a') {
					data.on = on;
					data.attrs = { href: href };
				} else {
					// find the first <a> child and apply listener and href
					var a = findAnchor(this.$slots.default);
					if (a) {
						// in case the <a> is a static node
						a.isStatic = false;
						var extend = _Vue.util.extend;
						var aData = a.data = extend({}, a.data);
						aData.on = on;
						var aAttrs = a.data.attrs = extend({}, a.data.attrs);
						aAttrs.href = href;
					} else {
						// doesn't have <a> child, apply listener to self
						data.on = on;
					}
				}

				return h(this.tag, data, this.$slots.default);
			}
		};

		function guardEvent(e) {
			// don't redirect with control keys
			if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
				return;
			}
			// don't redirect when preventDefault called
			if (e.defaultPrevented) {
				return;
			}
			// don't redirect on right click
			if (e.button !== undefined && e.button !== 0) {
				return;
			}
			// don't redirect if `target="_blank"`
			if (e.currentTarget && e.currentTarget.getAttribute) {
				var target = e.currentTarget.getAttribute('target');
				if (/\b_blank\b/i.test(target)) {
					return;
				}
			}
			// this may be a Weex event which doesn't have this method
			if (e.preventDefault) {
				e.preventDefault();
			}
			return true;
		}

		function findAnchor(children) {
			if (children) {
				var child;
				for (var i = 0; i < children.length; i++) {
					child = children[i];
					if (child.tag === 'a') {
						return child;
					}
					if (child.children && (child = findAnchor(child.children))) {
						return child;
					}
				}
			}
		}

		var _Vue;

		function install(Vue) {
			if (install.installed && _Vue === Vue) {
				return;
			}
			install.installed = true;

			_Vue = Vue;

			var isDef = function isDef(v) {
				return v !== undefined;
			};

			var registerInstance = function registerInstance(vm, callVal) {
				var i = vm.$options._parentVnode;
				if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
					i(vm, callVal);
				}
			};

			Vue.mixin({
				beforeCreate: function beforeCreate() {
					if (isDef(this.$options.router)) {
						this._routerRoot = this;
						this._router = this.$options.router;
						this._router.init(this);
						Vue.util.defineReactive(this, '_route', this._router.history.current);
					} else {
						this._routerRoot = this.$parent && this.$parent._routerRoot || this;
					}
					registerInstance(this, this);
				},
				destroyed: function destroyed() {
					registerInstance(this);
				}
			});

			Object.defineProperty(Vue.prototype, '$router', {
				get: function get() {
					return this._routerRoot._router;
				}
			});

			Object.defineProperty(Vue.prototype, '$route', {
				get: function get() {
					return this._routerRoot._route;
				}
			});

			Vue.component('router-view', View);
			Vue.component('router-link', Link);

			var strats = Vue.config.optionMergeStrategies;
			// use the same hook merging strategy for route hooks
			strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
		}

		/*  */

		var inBrowser = typeof window !== 'undefined';

		/*  */

		function resolvePath(relative, base, append) {
			var firstChar = relative.charAt(0);
			if (firstChar === '/') {
				return relative;
			}

			if (firstChar === '?' || firstChar === '#') {
				return base + relative;
			}

			var stack = base.split('/');

			// remove trailing segment if:
			// - not appending
			// - appending to trailing slash (last segment is empty)
			if (!append || !stack[stack.length - 1]) {
				stack.pop();
			}

			// resolve relative path
			var segments = relative.replace(/^\//, '').split('/');
			for (var i = 0; i < segments.length; i++) {
				var segment = segments[i];
				if (segment === '..') {
					stack.pop();
				} else if (segment !== '.') {
					stack.push(segment);
				}
			}

			// ensure leading slash
			if (stack[0] !== '') {
				stack.unshift('');
			}

			return stack.join('/');
		}

		function parsePath(path) {
			var hash = '';
			var query = '';

			var hashIndex = path.indexOf('#');
			if (hashIndex >= 0) {
				hash = path.slice(hashIndex);
				path = path.slice(0, hashIndex);
			}

			var queryIndex = path.indexOf('?');
			if (queryIndex >= 0) {
				query = path.slice(queryIndex + 1);
				path = path.slice(0, queryIndex);
			}

			return {
				path: path,
				query: query,
				hash: hash
			};
		}

		function cleanPath(path) {
			return path.replace(/\/\//g, '/');
		}

		var isarray = Array.isArray || function (arr) {
			return Object.prototype.toString.call(arr) == '[object Array]';
		};

		/**
   * Expose `pathToRegexp`.
   */
		var pathToRegexp_1 = pathToRegexp;
		var parse_1 = parse;
		var compile_1 = compile;
		var tokensToFunction_1 = tokensToFunction;
		var tokensToRegExp_1 = tokensToRegExp;

		/**
   * The main path matching regexp utility.
   *
   * @type {RegExp}
   */
		var PATH_REGEXP = new RegExp([
		// Match escaped characters that would otherwise appear in future matches.
		// This allows the user to escape special characters that won't transform.
		'(\\\\.)',
		// Match Express-style parameters and un-named parameters with a prefix
		// and optional suffixes. Matches appear as:
		//
		// "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
		// "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
		// "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
		'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');

		/**
   * Parse a string for the raw tokens.
   *
   * @param  {string}  str
   * @param  {Object=} options
   * @return {!Array}
   */
		function parse(str, options) {
			var tokens = [];
			var key = 0;
			var index = 0;
			var path = '';
			var defaultDelimiter = options && options.delimiter || '/';
			var res;

			while ((res = PATH_REGEXP.exec(str)) != null) {
				var m = res[0];
				var escaped = res[1];
				var offset = res.index;
				path += str.slice(index, offset);
				index = offset + m.length;

				// Ignore already escaped sequences.
				if (escaped) {
					path += escaped[1];
					continue;
				}

				var next = str[index];
				var prefix = res[2];
				var name = res[3];
				var capture = res[4];
				var group = res[5];
				var modifier = res[6];
				var asterisk = res[7];

				// Push the current path onto the tokens.
				if (path) {
					tokens.push(path);
					path = '';
				}

				var partial = prefix != null && next != null && next !== prefix;
				var repeat = modifier === '+' || modifier === '*';
				var optional = modifier === '?' || modifier === '*';
				var delimiter = res[2] || defaultDelimiter;
				var pattern = capture || group;

				tokens.push({
					name: name || key++,
					prefix: prefix || '',
					delimiter: delimiter,
					optional: optional,
					repeat: repeat,
					partial: partial,
					asterisk: !!asterisk,
					pattern: pattern ? escapeGroup(pattern) : asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?'
				});
			}

			// Match any characters still remaining.
			if (index < str.length) {
				path += str.substr(index);
			}

			// If the path exists, push it onto the end.
			if (path) {
				tokens.push(path);
			}

			return tokens;
		}

		/**
   * Compile a string to a template function for the path.
   *
   * @param  {string}             str
   * @param  {Object=}            options
   * @return {!function(Object=, Object=)}
   */
		function compile(str, options) {
			return tokensToFunction(parse(str, options));
		}

		/**
   * Prettier encoding of URI path segments.
   *
   * @param  {string}
   * @return {string}
   */
		function encodeURIComponentPretty(str) {
			return encodeURI(str).replace(/[\/?#]/g, function (c) {
				return '%' + c.charCodeAt(0).toString(16).toUpperCase();
			});
		}

		/**
   * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
   *
   * @param  {string}
   * @return {string}
   */
		function encodeAsterisk(str) {
			return encodeURI(str).replace(/[?#]/g, function (c) {
				return '%' + c.charCodeAt(0).toString(16).toUpperCase();
			});
		}

		/**
   * Expose a method for transforming tokens into the path function.
   */
		function tokensToFunction(tokens) {
			// Compile all the tokens into regexps.
			var matches = new Array(tokens.length);

			// Compile all the patterns before compilation.
			for (var i = 0; i < tokens.length; i++) {
				if (_typeof(tokens[i]) === 'object') {
					matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
				}
			}

			return function (obj, opts) {
				var path = '';
				var data = obj || {};
				var options = opts || {};
				var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

				for (var i = 0; i < tokens.length; i++) {
					var token = tokens[i];

					if (typeof token === 'string') {
						path += token;

						continue;
					}

					var value = data[token.name];
					var segment;

					if (value == null) {
						if (token.optional) {
							// Prepend partial segment prefixes.
							if (token.partial) {
								path += token.prefix;
							}

							continue;
						} else {
							throw new TypeError('Expected "' + token.name + '" to be defined');
						}
					}

					if (isarray(value)) {
						if (!token.repeat) {
							throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`');
						}

						if (value.length === 0) {
							if (token.optional) {
								continue;
							} else {
								throw new TypeError('Expected "' + token.name + '" to not be empty');
							}
						}

						for (var j = 0; j < value.length; j++) {
							segment = encode(value[j]);

							if (!matches[i].test(segment)) {
								throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`');
							}

							path += (j === 0 ? token.prefix : token.delimiter) + segment;
						}

						continue;
					}

					segment = token.asterisk ? encodeAsterisk(value) : encode(value);

					if (!matches[i].test(segment)) {
						throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
					}

					path += token.prefix + segment;
				}

				return path;
			};
		}

		/**
   * Escape a regular expression string.
   *
   * @param  {string} str
   * @return {string}
   */
		function escapeString(str) {
			return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
		}

		/**
   * Escape the capturing group by escaping special characters and meaning.
   *
   * @param  {string} group
   * @return {string}
   */
		function escapeGroup(group) {
			return group.replace(/([=!:$\/()])/g, '\\$1');
		}

		/**
   * Attach the keys as a property of the regexp.
   *
   * @param  {!RegExp} re
   * @param  {Array}   keys
   * @return {!RegExp}
   */
		function attachKeys(re, keys) {
			re.keys = keys;
			return re;
		}

		/**
   * Get the flags for a regexp from the options.
   *
   * @param  {Object} options
   * @return {string}
   */
		function flags(options) {
			return options.sensitive ? '' : 'i';
		}

		/**
   * Pull out keys from a regexp.
   *
   * @param  {!RegExp} path
   * @param  {!Array}  keys
   * @return {!RegExp}
   */
		function regexpToRegexp(path, keys) {
			// Use a negative lookahead to match only capturing groups.
			var groups = path.source.match(/\((?!\?)/g);

			if (groups) {
				for (var i = 0; i < groups.length; i++) {
					keys.push({
						name: i,
						prefix: null,
						delimiter: null,
						optional: false,
						repeat: false,
						partial: false,
						asterisk: false,
						pattern: null
					});
				}
			}

			return attachKeys(path, keys);
		}

		/**
   * Transform an array into a regexp.
   *
   * @param  {!Array}  path
   * @param  {Array}   keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
		function arrayToRegexp(path, keys, options) {
			var parts = [];

			for (var i = 0; i < path.length; i++) {
				parts.push(pathToRegexp(path[i], keys, options).source);
			}

			var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

			return attachKeys(regexp, keys);
		}

		/**
   * Create a path regexp from string input.
   *
   * @param  {string}  path
   * @param  {!Array}  keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
		function stringToRegexp(path, keys, options) {
			return tokensToRegExp(parse(path, options), keys, options);
		}

		/**
   * Expose a function for taking tokens and returning a RegExp.
   *
   * @param  {!Array}          tokens
   * @param  {(Array|Object)=} keys
   * @param  {Object=}         options
   * @return {!RegExp}
   */
		function tokensToRegExp(tokens, keys, options) {
			if (!isarray(keys)) {
				options = /** @type {!Object} */keys || options;
				keys = [];
			}

			options = options || {};

			var strict = options.strict;
			var end = options.end !== false;
			var route = '';

			// Iterate over the tokens and create our regexp string.
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];

				if (typeof token === 'string') {
					route += escapeString(token);
				} else {
					var prefix = escapeString(token.prefix);
					var capture = '(?:' + token.pattern + ')';

					keys.push(token);

					if (token.repeat) {
						capture += '(?:' + prefix + capture + ')*';
					}

					if (token.optional) {
						if (!token.partial) {
							capture = '(?:' + prefix + '(' + capture + '))?';
						} else {
							capture = prefix + '(' + capture + ')?';
						}
					} else {
						capture = prefix + '(' + capture + ')';
					}

					route += capture;
				}
			}

			var delimiter = escapeString(options.delimiter || '/');
			var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

			// In non-strict mode we allow a slash at the end of match. If the path to
			// match already ends with a slash, we remove it for consistency. The slash
			// is valid at the end of a path match, not in the middle. This is important
			// in non-ending mode, where "/test/" shouldn't match "/test//route".
			if (!strict) {
				route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
			}

			if (end) {
				route += '$';
			} else {
				// In non-ending mode, we need the capturing groups to match as much as
				// possible by using a positive lookahead to the end or next path segment.
				route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
			}

			return attachKeys(new RegExp('^' + route, flags(options)), keys);
		}

		/**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   *
   * @param  {(string|RegExp|Array)} path
   * @param  {(Array|Object)=}       keys
   * @param  {Object=}               options
   * @return {!RegExp}
   */
		function pathToRegexp(path, keys, options) {
			if (!isarray(keys)) {
				options = /** @type {!Object} */keys || options;
				keys = [];
			}

			options = options || {};

			if (path instanceof RegExp) {
				return regexpToRegexp(path, /** @type {!Array} */keys);
			}

			if (isarray(path)) {
				return arrayToRegexp( /** @type {!Array} */path, /** @type {!Array} */keys, options);
			}

			return stringToRegexp( /** @type {string} */path, /** @type {!Array} */keys, options);
		}

		pathToRegexp_1.parse = parse_1;
		pathToRegexp_1.compile = compile_1;
		pathToRegexp_1.tokensToFunction = tokensToFunction_1;
		pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

		/*  */

		// $flow-disable-line
		var regexpCompileCache = Object.create(null);

		function fillParams(path, params, routeMsg) {
			try {
				var filler = regexpCompileCache[path] || (regexpCompileCache[path] = pathToRegexp_1.compile(path));
				return filler(params || {}, { pretty: true });
			} catch (e) {
				if (process.env.NODE_ENV !== 'production') {
					warn(false, "missing param for " + routeMsg + ": " + e.message);
				}
				return '';
			}
		}

		/*  */

		function createRouteMap(routes, oldPathList, oldPathMap, oldNameMap) {
			// the path list is used to control path matching priority
			var pathList = oldPathList || [];
			// $flow-disable-line
			var pathMap = oldPathMap || Object.create(null);
			// $flow-disable-line
			var nameMap = oldNameMap || Object.create(null);

			routes.forEach(function (route) {
				addRouteRecord(pathList, pathMap, nameMap, route);
			});

			// ensure wildcard routes are always at the end
			for (var i = 0, l = pathList.length; i < l; i++) {
				if (pathList[i] === '*') {
					pathList.push(pathList.splice(i, 1)[0]);
					l--;
					i--;
				}
			}

			return {
				pathList: pathList,
				pathMap: pathMap,
				nameMap: nameMap
			};
		}

		function addRouteRecord(pathList, pathMap, nameMap, route, parent, matchAs) {
			var path = route.path;
			var name = route.name;
			if (process.env.NODE_ENV !== 'production') {
				assert(path != null, "\"path\" is required in a route configuration.");
				assert(typeof route.component !== 'string', "route config \"component\" for path: " + String(path || name) + " cannot be a " + "string id. Use an actual component instead.");
			}

			var pathToRegexpOptions = route.pathToRegexpOptions || {};
			var normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict);

			if (typeof route.caseSensitive === 'boolean') {
				pathToRegexpOptions.sensitive = route.caseSensitive;
			}

			var record = {
				path: normalizedPath,
				regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
				components: route.components || { default: route.component },
				instances: {},
				name: name,
				parent: parent,
				matchAs: matchAs,
				redirect: route.redirect,
				beforeEnter: route.beforeEnter,
				meta: route.meta || {},
				props: route.props == null ? {} : route.components ? route.props : { default: route.props }
			};

			if (route.children) {
				// Warn if route is named, does not redirect and has a default child route.
				// If users navigate to this route by name, the default child will
				// not be rendered (GH Issue #629)
				if (process.env.NODE_ENV !== 'production') {
					if (route.name && !route.redirect && route.children.some(function (child) {
						return (/^\/?$/.test(child.path)
						);
					})) {
						warn(false, "Named Route '" + route.name + "' has a default child route. " + "When navigating to this named route (:to=\"{name: '" + route.name + "'\"), " + "the default child route will not be rendered. Remove the name from " + "this route and use the name of the default child route for named " + "links instead.");
					}
				}
				route.children.forEach(function (child) {
					var childMatchAs = matchAs ? cleanPath(matchAs + "/" + child.path) : undefined;
					addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
				});
			}

			if (route.alias !== undefined) {
				var aliases = Array.isArray(route.alias) ? route.alias : [route.alias];

				aliases.forEach(function (alias) {
					var aliasRoute = {
						path: alias,
						children: route.children
					};
					addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path || '/' // matchAs
					);
				});
			}

			if (!pathMap[record.path]) {
				pathList.push(record.path);
				pathMap[record.path] = record;
			}

			if (name) {
				if (!nameMap[name]) {
					nameMap[name] = record;
				} else if (process.env.NODE_ENV !== 'production' && !matchAs) {
					warn(false, "Duplicate named routes definition: " + "{ name: \"" + name + "\", path: \"" + record.path + "\" }");
				}
			}
		}

		function compileRouteRegex(path, pathToRegexpOptions) {
			var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
			if (process.env.NODE_ENV !== 'production') {
				var keys = Object.create(null);
				regex.keys.forEach(function (key) {
					warn(!keys[key.name], "Duplicate param keys in route with path: \"" + path + "\"");
					keys[key.name] = true;
				});
			}
			return regex;
		}

		function normalizePath(path, parent, strict) {
			if (!strict) {
				path = path.replace(/\/$/, '');
			}
			if (path[0] === '/') {
				return path;
			}
			if (parent == null) {
				return path;
			}
			return cleanPath(parent.path + "/" + path);
		}

		/*  */

		function normalizeLocation(raw, current, append, router) {
			var next = typeof raw === 'string' ? { path: raw } : raw;
			// named target
			if (next.name || next._normalized) {
				return next;
			}

			// relative params
			if (!next.path && next.params && current) {
				next = assign({}, next);
				next._normalized = true;
				var params = assign(assign({}, current.params), next.params);
				if (current.name) {
					next.name = current.name;
					next.params = params;
				} else if (current.matched.length) {
					var rawPath = current.matched[current.matched.length - 1].path;
					next.path = fillParams(rawPath, params, "path " + current.path);
				} else if (process.env.NODE_ENV !== 'production') {
					warn(false, "relative params navigation requires a current route.");
				}
				return next;
			}

			var parsedPath = parsePath(next.path || '');
			var basePath = current && current.path || '/';
			var path = parsedPath.path ? resolvePath(parsedPath.path, basePath, append || next.append) : basePath;

			var query = resolveQuery(parsedPath.query, next.query, router && router.options.parseQuery);

			var hash = next.hash || parsedPath.hash;
			if (hash && hash.charAt(0) !== '#') {
				hash = "#" + hash;
			}

			return {
				_normalized: true,
				path: path,
				query: query,
				hash: hash
			};
		}

		function assign(a, b) {
			for (var key in b) {
				a[key] = b[key];
			}
			return a;
		}

		/*  */

		function createMatcher(routes, router) {
			var ref = createRouteMap(routes);
			var pathList = ref.pathList;
			var pathMap = ref.pathMap;
			var nameMap = ref.nameMap;

			function addRoutes(routes) {
				createRouteMap(routes, pathList, pathMap, nameMap);
			}

			function match(raw, currentRoute, redirectedFrom) {
				var location = normalizeLocation(raw, currentRoute, false, router);
				var name = location.name;

				if (name) {
					var record = nameMap[name];
					if (process.env.NODE_ENV !== 'production') {
						warn(record, "Route with name '" + name + "' does not exist");
					}
					if (!record) {
						return _createRoute(null, location);
					}
					var paramNames = record.regex.keys.filter(function (key) {
						return !key.optional;
					}).map(function (key) {
						return key.name;
					});

					if (_typeof(location.params) !== 'object') {
						location.params = {};
					}

					if (currentRoute && _typeof(currentRoute.params) === 'object') {
						for (var key in currentRoute.params) {
							if (!(key in location.params) && paramNames.indexOf(key) > -1) {
								location.params[key] = currentRoute.params[key];
							}
						}
					}

					if (record) {
						location.path = fillParams(record.path, location.params, "named route \"" + name + "\"");
						return _createRoute(record, location, redirectedFrom);
					}
				} else if (location.path) {
					location.params = {};
					for (var i = 0; i < pathList.length; i++) {
						var path = pathList[i];
						var record$1 = pathMap[path];
						if (matchRoute(record$1.regex, location.path, location.params)) {
							return _createRoute(record$1, location, redirectedFrom);
						}
					}
				}
				// no match
				return _createRoute(null, location);
			}

			function redirect(record, location) {
				var originalRedirect = record.redirect;
				var redirect = typeof originalRedirect === 'function' ? originalRedirect(createRoute(record, location, null, router)) : originalRedirect;

				if (typeof redirect === 'string') {
					redirect = { path: redirect };
				}

				if (!redirect || (typeof redirect === 'undefined' ? 'undefined' : _typeof(redirect)) !== 'object') {
					if (process.env.NODE_ENV !== 'production') {
						warn(false, "invalid redirect option: " + JSON.stringify(redirect));
					}
					return _createRoute(null, location);
				}

				var re = redirect;
				var name = re.name;
				var path = re.path;
				var query = location.query;
				var hash = location.hash;
				var params = location.params;
				query = re.hasOwnProperty('query') ? re.query : query;
				hash = re.hasOwnProperty('hash') ? re.hash : hash;
				params = re.hasOwnProperty('params') ? re.params : params;

				if (name) {
					// resolved named direct
					var targetRecord = nameMap[name];
					if (process.env.NODE_ENV !== 'production') {
						assert(targetRecord, "redirect failed: named route \"" + name + "\" not found.");
					}
					return match({
						_normalized: true,
						name: name,
						query: query,
						hash: hash,
						params: params
					}, undefined, location);
				} else if (path) {
					// 1. resolve relative redirect
					var rawPath = resolveRecordPath(path, record);
					// 2. resolve params
					var resolvedPath = fillParams(rawPath, params, "redirect route with path \"" + rawPath + "\"");
					// 3. rematch with existing query and hash
					return match({
						_normalized: true,
						path: resolvedPath,
						query: query,
						hash: hash
					}, undefined, location);
				} else {
					if (process.env.NODE_ENV !== 'production') {
						warn(false, "invalid redirect option: " + JSON.stringify(redirect));
					}
					return _createRoute(null, location);
				}
			}

			function alias(record, location, matchAs) {
				var aliasedPath = fillParams(matchAs, location.params, "aliased route with path \"" + matchAs + "\"");
				var aliasedMatch = match({
					_normalized: true,
					path: aliasedPath
				});
				if (aliasedMatch) {
					var matched = aliasedMatch.matched;
					var aliasedRecord = matched[matched.length - 1];
					location.params = aliasedMatch.params;
					return _createRoute(aliasedRecord, location);
				}
				return _createRoute(null, location);
			}

			function _createRoute(record, location, redirectedFrom) {
				if (record && record.redirect) {
					return redirect(record, redirectedFrom || location);
				}
				if (record && record.matchAs) {
					return alias(record, location, record.matchAs);
				}
				return createRoute(record, location, redirectedFrom, router);
			}

			return {
				match: match,
				addRoutes: addRoutes
			};
		}

		function matchRoute(regex, path, params) {
			var m = path.match(regex);

			if (!m) {
				return false;
			} else if (!params) {
				return true;
			}

			for (var i = 1, len = m.length; i < len; ++i) {
				var key = regex.keys[i - 1];
				var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
				if (key) {
					params[key.name] = val;
				}
			}

			return true;
		}

		function resolveRecordPath(path, record) {
			return resolvePath(path, record.parent ? record.parent.path : '/', true);
		}

		/*  */

		var positionStore = Object.create(null);

		function setupScroll() {
			// Fix for #1585 for Firefox
			window.history.replaceState({ key: getStateKey() }, '');
			window.addEventListener('popstate', function (e) {
				saveScrollPosition();
				if (e.state && e.state.key) {
					setStateKey(e.state.key);
				}
			});
		}

		function handleScroll(router, to, from, isPop) {
			if (!router.app) {
				return;
			}

			var behavior = router.options.scrollBehavior;
			if (!behavior) {
				return;
			}

			if (process.env.NODE_ENV !== 'production') {
				assert(typeof behavior === 'function', "scrollBehavior must be a function");
			}

			// wait until re-render finishes before scrolling
			router.app.$nextTick(function () {
				var position = getScrollPosition();
				var shouldScroll = behavior(to, from, isPop ? position : null);

				if (!shouldScroll) {
					return;
				}

				if (typeof shouldScroll.then === 'function') {
					shouldScroll.then(function (shouldScroll) {
						scrollToPosition(shouldScroll, position);
					}).catch(function (err) {
						if (process.env.NODE_ENV !== 'production') {
							assert(false, err.toString());
						}
					});
				} else {
					scrollToPosition(shouldScroll, position);
				}
			});
		}

		function saveScrollPosition() {
			var key = getStateKey();
			if (key) {
				positionStore[key] = {
					x: window.pageXOffset,
					y: window.pageYOffset
				};
			}
		}

		function getScrollPosition() {
			var key = getStateKey();
			if (key) {
				return positionStore[key];
			}
		}

		function getElementPosition(el, offset) {
			var docEl = document.documentElement;
			var docRect = docEl.getBoundingClientRect();
			var elRect = el.getBoundingClientRect();
			return {
				x: elRect.left - docRect.left - offset.x,
				y: elRect.top - docRect.top - offset.y
			};
		}

		function isValidPosition(obj) {
			return isNumber(obj.x) || isNumber(obj.y);
		}

		function normalizePosition(obj) {
			return {
				x: isNumber(obj.x) ? obj.x : window.pageXOffset,
				y: isNumber(obj.y) ? obj.y : window.pageYOffset
			};
		}

		function normalizeOffset(obj) {
			return {
				x: isNumber(obj.x) ? obj.x : 0,
				y: isNumber(obj.y) ? obj.y : 0
			};
		}

		function isNumber(v) {
			return typeof v === 'number';
		}

		function scrollToPosition(shouldScroll, position) {
			var isObject = (typeof shouldScroll === 'undefined' ? 'undefined' : _typeof(shouldScroll)) === 'object';
			if (isObject && typeof shouldScroll.selector === 'string') {
				var el = document.querySelector(shouldScroll.selector);
				if (el) {
					var offset = shouldScroll.offset && _typeof(shouldScroll.offset) === 'object' ? shouldScroll.offset : {};
					offset = normalizeOffset(offset);
					position = getElementPosition(el, offset);
				} else if (isValidPosition(shouldScroll)) {
					position = normalizePosition(shouldScroll);
				}
			} else if (isObject && isValidPosition(shouldScroll)) {
				position = normalizePosition(shouldScroll);
			}

			if (position) {
				window.scrollTo(position.x, position.y);
			}
		}

		/*  */

		var supportsPushState = inBrowser && function () {
			var ua = window.navigator.userAgent;

			if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
				return false;
			}

			return window.history && 'pushState' in window.history;
		}();

		// use User Timing api (if present) for more accurate key precision
		var Time = inBrowser && window.performance && window.performance.now ? window.performance : Date;

		var _key = genKey();

		function genKey() {
			return Time.now().toFixed(3);
		}

		function getStateKey() {
			return _key;
		}

		function setStateKey(key) {
			_key = key;
		}

		function pushState(url, replace) {
			saveScrollPosition();
			// try...catch the pushState call to get around Safari
			// DOM Exception 18 where it limits to 100 pushState calls
			var history = window.history;
			try {
				if (replace) {
					history.replaceState({ key: _key }, '', url);
				} else {
					_key = genKey();
					history.pushState({ key: _key }, '', url);
				}
			} catch (e) {
				window.location[replace ? 'replace' : 'assign'](url);
			}
		}

		function replaceState(url) {
			pushState(url, true);
		}

		/*  */

		function runQueue(queue, fn, cb) {
			var step = function step(index) {
				if (index >= queue.length) {
					cb();
				} else {
					if (queue[index]) {
						fn(queue[index], function () {
							step(index + 1);
						});
					} else {
						step(index + 1);
					}
				}
			};
			step(0);
		}

		/*  */

		function resolveAsyncComponents(matched) {
			return function (to, from, next) {
				var hasAsync = false;
				var pending = 0;
				var error = null;

				flatMapComponents(matched, function (def, _, match, key) {
					// if it's a function and doesn't have cid attached,
					// assume it's an async component resolve function.
					// we are not using Vue's default async resolving mechanism because
					// we want to halt the navigation until the incoming component has been
					// resolved.
					if (typeof def === 'function' && def.cid === undefined) {
						hasAsync = true;
						pending++;

						var resolve = once(function (resolvedDef) {
							if (isESModule(resolvedDef)) {
								resolvedDef = resolvedDef.default;
							}
							// save resolved on async factory in case it's used elsewhere
							def.resolved = typeof resolvedDef === 'function' ? resolvedDef : _Vue.extend(resolvedDef);
							match.components[key] = resolvedDef;
							pending--;
							if (pending <= 0) {
								next();
							}
						});

						var reject = once(function (reason) {
							var msg = "Failed to resolve async component " + key + ": " + reason;
							process.env.NODE_ENV !== 'production' && warn(false, msg);
							if (!error) {
								error = isError(reason) ? reason : new Error(msg);
								next(error);
							}
						});

						var res;
						try {
							res = def(resolve, reject);
						} catch (e) {
							reject(e);
						}
						if (res) {
							if (typeof res.then === 'function') {
								res.then(resolve, reject);
							} else {
								// new syntax in Vue 2.3
								var comp = res.component;
								if (comp && typeof comp.then === 'function') {
									comp.then(resolve, reject);
								}
							}
						}
					}
				});

				if (!hasAsync) {
					next();
				}
			};
		}

		function flatMapComponents(matched, fn) {
			return flatten(matched.map(function (m) {
				return Object.keys(m.components).map(function (key) {
					return fn(m.components[key], m.instances[key], m, key);
				});
			}));
		}

		function flatten(arr) {
			return Array.prototype.concat.apply([], arr);
		}

		var hasSymbol = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';

		function isESModule(obj) {
			return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === 'Module';
		}

		// in Webpack 2, require.ensure now also returns a Promise
		// so the resolve/reject functions may get called an extra time
		// if the user uses an arrow function shorthand that happens to
		// return that Promise.
		function once(fn) {
			var called = false;
			return function () {
				var args = [],
				    len = arguments.length;
				while (len--) {
					args[len] = arguments[len];
				}if (called) {
					return;
				}
				called = true;
				return fn.apply(this, args);
			};
		}

		/*  */

		var History = function History(router, base) {
			this.router = router;
			this.base = normalizeBase(base);
			// start with a route object that stands for "nowhere"
			this.current = START;
			this.pending = null;
			this.ready = false;
			this.readyCbs = [];
			this.readyErrorCbs = [];
			this.errorCbs = [];
		};

		History.prototype.listen = function listen(cb) {
			this.cb = cb;
		};

		History.prototype.onReady = function onReady(cb, errorCb) {
			if (this.ready) {
				cb();
			} else {
				this.readyCbs.push(cb);
				if (errorCb) {
					this.readyErrorCbs.push(errorCb);
				}
			}
		};

		History.prototype.onError = function onError(errorCb) {
			this.errorCbs.push(errorCb);
		};

		History.prototype.transitionTo = function transitionTo(location, onComplete, onAbort) {
			var this$1 = this;

			var route = this.router.match(location, this.current);
			this.confirmTransition(route, function () {
				this$1.updateRoute(route);
				onComplete && onComplete(route);
				this$1.ensureURL();

				// fire ready cbs once
				if (!this$1.ready) {
					this$1.ready = true;
					this$1.readyCbs.forEach(function (cb) {
						cb(route);
					});
				}
			}, function (err) {
				if (onAbort) {
					onAbort(err);
				}
				if (err && !this$1.ready) {
					this$1.ready = true;
					this$1.readyErrorCbs.forEach(function (cb) {
						cb(err);
					});
				}
			});
		};

		History.prototype.confirmTransition = function confirmTransition(route, onComplete, onAbort) {
			var this$1 = this;

			var current = this.current;
			var abort = function abort(err) {
				if (isError(err)) {
					if (this$1.errorCbs.length) {
						this$1.errorCbs.forEach(function (cb) {
							cb(err);
						});
					} else {
						warn(false, 'uncaught error during route navigation:');
						console.error(err);
					}
				}
				onAbort && onAbort(err);
			};
			if (isSameRoute(route, current) &&
			// in the case the route map has been dynamically appended to
			route.matched.length === current.matched.length) {
				this.ensureURL();
				return abort();
			}

			var ref = resolveQueue(this.current.matched, route.matched);
			var updated = ref.updated;
			var deactivated = ref.deactivated;
			var activated = ref.activated;

			var queue = [].concat(
			// in-component leave guards
			extractLeaveGuards(deactivated),
			// global before hooks
			this.router.beforeHooks,
			// in-component update hooks
			extractUpdateHooks(updated),
			// in-config enter guards
			activated.map(function (m) {
				return m.beforeEnter;
			}),
			// async components
			resolveAsyncComponents(activated));

			this.pending = route;
			var iterator = function iterator(hook, next) {
				if (this$1.pending !== route) {
					return abort();
				}
				try {
					hook(route, current, function (to) {
						if (to === false || isError(to)) {
							// next(false) -> abort navigation, ensure current URL
							this$1.ensureURL(true);
							abort(to);
						} else if (typeof to === 'string' || (typeof to === 'undefined' ? 'undefined' : _typeof(to)) === 'object' && (typeof to.path === 'string' || typeof to.name === 'string')) {
							// next('/') or next({ path: '/' }) -> redirect
							abort();
							if ((typeof to === 'undefined' ? 'undefined' : _typeof(to)) === 'object' && to.replace) {
								this$1.replace(to);
							} else {
								this$1.push(to);
							}
						} else {
							// confirm transition and pass on the value
							next(to);
						}
					});
				} catch (e) {
					abort(e);
				}
			};

			runQueue(queue, iterator, function () {
				var postEnterCbs = [];
				var isValid = function isValid() {
					return this$1.current === route;
				};
				// wait until async components are resolved before
				// extracting in-component enter guards
				var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
				var queue = enterGuards.concat(this$1.router.resolveHooks);
				runQueue(queue, iterator, function () {
					if (this$1.pending !== route) {
						return abort();
					}
					this$1.pending = null;
					onComplete(route);
					if (this$1.router.app) {
						this$1.router.app.$nextTick(function () {
							postEnterCbs.forEach(function (cb) {
								cb();
							});
						});
					}
				});
			});
		};

		History.prototype.updateRoute = function updateRoute(route) {
			var prev = this.current;
			this.current = route;
			this.cb && this.cb(route);
			this.router.afterHooks.forEach(function (hook) {
				hook && hook(route, prev);
			});
		};

		function normalizeBase(base) {
			if (!base) {
				if (inBrowser) {
					// respect <base> tag
					var baseEl = document.querySelector('base');
					base = baseEl && baseEl.getAttribute('href') || '/';
					// strip full URL origin
					base = base.replace(/^https?:\/\/[^\/]+/, '');
				} else {
					base = '/';
				}
			}
			// make sure there's the starting slash
			if (base.charAt(0) !== '/') {
				base = '/' + base;
			}
			// remove trailing slash
			return base.replace(/\/$/, '');
		}

		function resolveQueue(current, next) {
			var i;
			var max = Math.max(current.length, next.length);
			for (i = 0; i < max; i++) {
				if (current[i] !== next[i]) {
					break;
				}
			}
			return {
				updated: next.slice(0, i),
				activated: next.slice(i),
				deactivated: current.slice(i)
			};
		}

		function extractGuards(records, name, bind, reverse) {
			var guards = flatMapComponents(records, function (def, instance, match, key) {
				var guard = extractGuard(def, name);
				if (guard) {
					return Array.isArray(guard) ? guard.map(function (guard) {
						return bind(guard, instance, match, key);
					}) : bind(guard, instance, match, key);
				}
			});
			return flatten(reverse ? guards.reverse() : guards);
		}

		function extractGuard(def, key) {
			if (typeof def !== 'function') {
				// extend now so that global mixins are applied.
				def = _Vue.extend(def);
			}
			return def.options[key];
		}

		function extractLeaveGuards(deactivated) {
			return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true);
		}

		function extractUpdateHooks(updated) {
			return extractGuards(updated, 'beforeRouteUpdate', bindGuard);
		}

		function bindGuard(guard, instance) {
			if (instance) {
				return function boundRouteGuard() {
					return guard.apply(instance, arguments);
				};
			}
		}

		function extractEnterGuards(activated, cbs, isValid) {
			return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
				return bindEnterGuard(guard, match, key, cbs, isValid);
			});
		}

		function bindEnterGuard(guard, match, key, cbs, isValid) {
			return function routeEnterGuard(to, from, next) {
				return guard(to, from, function (cb) {
					next(cb);
					if (typeof cb === 'function') {
						cbs.push(function () {
							// #750
							// if a router-view is wrapped with an out-in transition,
							// the instance may not have been registered at this time.
							// we will need to poll for registration until current route
							// is no longer valid.
							poll(cb, match.instances, key, isValid);
						});
					}
				});
			};
		}

		function poll(cb, // somehow flow cannot infer this is a function
		instances, key, isValid) {
			if (instances[key]) {
				cb(instances[key]);
			} else if (isValid()) {
				setTimeout(function () {
					poll(cb, instances, key, isValid);
				}, 16);
			}
		}

		/*  */

		var HTML5History = function (History$$1) {
			function HTML5History(router, base) {
				var this$1 = this;

				History$$1.call(this, router, base);

				var expectScroll = router.options.scrollBehavior;

				if (expectScroll) {
					setupScroll();
				}

				var initLocation = getLocation(this.base);
				window.addEventListener('popstate', function (e) {
					var current = this$1.current;

					// Avoiding first `popstate` event dispatched in some browsers but first
					// history route not updated since async guard at the same time.
					var location = getLocation(this$1.base);
					if (this$1.current === START && location === initLocation) {
						return;
					}

					this$1.transitionTo(location, function (route) {
						if (expectScroll) {
							handleScroll(router, route, current, true);
						}
					});
				});
			}

			if (History$$1) HTML5History.__proto__ = History$$1;
			HTML5History.prototype = Object.create(History$$1 && History$$1.prototype);
			HTML5History.prototype.constructor = HTML5History;

			HTML5History.prototype.go = function go(n) {
				window.history.go(n);
			};

			HTML5History.prototype.push = function push(location, onComplete, onAbort) {
				var this$1 = this;

				var ref = this;
				var fromRoute = ref.current;
				this.transitionTo(location, function (route) {
					pushState(cleanPath(this$1.base + route.fullPath));
					handleScroll(this$1.router, route, fromRoute, false);
					onComplete && onComplete(route);
				}, onAbort);
			};

			HTML5History.prototype.replace = function replace(location, onComplete, onAbort) {
				var this$1 = this;

				var ref = this;
				var fromRoute = ref.current;
				this.transitionTo(location, function (route) {
					replaceState(cleanPath(this$1.base + route.fullPath));
					handleScroll(this$1.router, route, fromRoute, false);
					onComplete && onComplete(route);
				}, onAbort);
			};

			HTML5History.prototype.ensureURL = function ensureURL(push) {
				if (getLocation(this.base) !== this.current.fullPath) {
					var current = cleanPath(this.base + this.current.fullPath);
					push ? pushState(current) : replaceState(current);
				}
			};

			HTML5History.prototype.getCurrentLocation = function getCurrentLocation() {
				return getLocation(this.base);
			};

			return HTML5History;
		}(History);

		function getLocation(base) {
			var path = window.location.pathname;
			if (base && path.indexOf(base) === 0) {
				path = path.slice(base.length);
			}
			return (path || '/') + window.location.search + window.location.hash;
		}

		/*  */

		var HashHistory = function (History$$1) {
			function HashHistory(router, base, fallback) {
				History$$1.call(this, router, base);
				// check history fallback deeplinking
				if (fallback && checkFallback(this.base)) {
					return;
				}
				ensureSlash();
			}

			if (History$$1) HashHistory.__proto__ = History$$1;
			HashHistory.prototype = Object.create(History$$1 && History$$1.prototype);
			HashHistory.prototype.constructor = HashHistory;

			// this is delayed until the app mounts
			// to avoid the hashchange listener being fired too early
			HashHistory.prototype.setupListeners = function setupListeners() {
				var this$1 = this;

				var router = this.router;
				var expectScroll = router.options.scrollBehavior;
				var supportsScroll = supportsPushState && expectScroll;

				if (supportsScroll) {
					setupScroll();
				}

				window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', function () {
					var current = this$1.current;
					if (!ensureSlash()) {
						return;
					}
					this$1.transitionTo(getHash(), function (route) {
						if (supportsScroll) {
							handleScroll(this$1.router, route, current, true);
						}
						if (!supportsPushState) {
							replaceHash(route.fullPath);
						}
					});
				});
			};

			HashHistory.prototype.push = function push(location, onComplete, onAbort) {
				var this$1 = this;

				var ref = this;
				var fromRoute = ref.current;
				this.transitionTo(location, function (route) {
					pushHash(route.fullPath);
					handleScroll(this$1.router, route, fromRoute, false);
					onComplete && onComplete(route);
				}, onAbort);
			};

			HashHistory.prototype.replace = function replace(location, onComplete, onAbort) {
				var this$1 = this;

				var ref = this;
				var fromRoute = ref.current;
				this.transitionTo(location, function (route) {
					replaceHash(route.fullPath);
					handleScroll(this$1.router, route, fromRoute, false);
					onComplete && onComplete(route);
				}, onAbort);
			};

			HashHistory.prototype.go = function go(n) {
				window.history.go(n);
			};

			HashHistory.prototype.ensureURL = function ensureURL(push) {
				var current = this.current.fullPath;
				if (getHash() !== current) {
					push ? pushHash(current) : replaceHash(current);
				}
			};

			HashHistory.prototype.getCurrentLocation = function getCurrentLocation() {
				return getHash();
			};

			return HashHistory;
		}(History);

		function checkFallback(base) {
			var location = getLocation(base);
			if (!/^\/#/.test(location)) {
				window.location.replace(cleanPath(base + '/#' + location));
				return true;
			}
		}

		function ensureSlash() {
			var path = getHash();
			if (path.charAt(0) === '/') {
				return true;
			}
			replaceHash('/' + path);
			return false;
		}

		function getHash() {
			// We can't use window.location.hash here because it's not
			// consistent across browsers - Firefox will pre-decode it!
			var href = window.location.href;
			var index = href.indexOf('#');
			return index === -1 ? '' : href.slice(index + 1);
		}

		function getUrl(path) {
			var href = window.location.href;
			var i = href.indexOf('#');
			var base = i >= 0 ? href.slice(0, i) : href;
			return base + "#" + path;
		}

		function pushHash(path) {
			if (supportsPushState) {
				pushState(getUrl(path));
			} else {
				window.location.hash = path;
			}
		}

		function replaceHash(path) {
			if (supportsPushState) {
				replaceState(getUrl(path));
			} else {
				window.location.replace(getUrl(path));
			}
		}

		/*  */

		var AbstractHistory = function (History$$1) {
			function AbstractHistory(router, base) {
				History$$1.call(this, router, base);
				this.stack = [];
				this.index = -1;
			}

			if (History$$1) AbstractHistory.__proto__ = History$$1;
			AbstractHistory.prototype = Object.create(History$$1 && History$$1.prototype);
			AbstractHistory.prototype.constructor = AbstractHistory;

			AbstractHistory.prototype.push = function push(location, onComplete, onAbort) {
				var this$1 = this;

				this.transitionTo(location, function (route) {
					this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
					this$1.index++;
					onComplete && onComplete(route);
				}, onAbort);
			};

			AbstractHistory.prototype.replace = function replace(location, onComplete, onAbort) {
				var this$1 = this;

				this.transitionTo(location, function (route) {
					this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
					onComplete && onComplete(route);
				}, onAbort);
			};

			AbstractHistory.prototype.go = function go(n) {
				var this$1 = this;

				var targetIndex = this.index + n;
				if (targetIndex < 0 || targetIndex >= this.stack.length) {
					return;
				}
				var route = this.stack[targetIndex];
				this.confirmTransition(route, function () {
					this$1.index = targetIndex;
					this$1.updateRoute(route);
				});
			};

			AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation() {
				var current = this.stack[this.stack.length - 1];
				return current ? current.fullPath : '/';
			};

			AbstractHistory.prototype.ensureURL = function ensureURL() {
				// noop
			};

			return AbstractHistory;
		}(History);

		/*  */

		var VueRouter = function VueRouter(options) {
			if (options === void 0) options = {};

			this.app = null;
			this.apps = [];
			this.options = options;
			this.beforeHooks = [];
			this.resolveHooks = [];
			this.afterHooks = [];
			this.matcher = createMatcher(options.routes || [], this);

			var mode = options.mode || 'hash';
			this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
			if (this.fallback) {
				mode = 'hash';
			}
			if (!inBrowser) {
				mode = 'abstract';
			}
			this.mode = mode;

			switch (mode) {
				case 'history':
					this.history = new HTML5History(this, options.base);
					break;
				case 'hash':
					this.history = new HashHistory(this, options.base, this.fallback);
					break;
				case 'abstract':
					this.history = new AbstractHistory(this, options.base);
					break;
				default:
					if (process.env.NODE_ENV !== 'production') {
						assert(false, "invalid mode: " + mode);
					}
			}
		};

		var prototypeAccessors = { currentRoute: { configurable: true } };

		VueRouter.prototype.match = function match(raw, current, redirectedFrom) {
			return this.matcher.match(raw, current, redirectedFrom);
		};

		prototypeAccessors.currentRoute.get = function () {
			return this.history && this.history.current;
		};

		VueRouter.prototype.init = function init(app /* Vue component instance */) {
			var this$1 = this;

			process.env.NODE_ENV !== 'production' && assert(install.installed, "not installed. Make sure to call `Vue.use(VueRouter)` " + "before creating root instance.");

			this.apps.push(app);

			// main app already initialized.
			if (this.app) {
				return;
			}

			this.app = app;

			var history = this.history;

			if (history instanceof HTML5History) {
				history.transitionTo(history.getCurrentLocation());
			} else if (history instanceof HashHistory) {
				var setupHashListener = function setupHashListener() {
					history.setupListeners();
				};
				history.transitionTo(history.getCurrentLocation(), setupHashListener, setupHashListener);
			}

			history.listen(function (route) {
				this$1.apps.forEach(function (app) {
					app._route = route;
				});
			});
		};

		VueRouter.prototype.beforeEach = function beforeEach(fn) {
			return registerHook(this.beforeHooks, fn);
		};

		VueRouter.prototype.beforeResolve = function beforeResolve(fn) {
			return registerHook(this.resolveHooks, fn);
		};

		VueRouter.prototype.afterEach = function afterEach(fn) {
			return registerHook(this.afterHooks, fn);
		};

		VueRouter.prototype.onReady = function onReady(cb, errorCb) {
			this.history.onReady(cb, errorCb);
		};

		VueRouter.prototype.onError = function onError(errorCb) {
			this.history.onError(errorCb);
		};

		VueRouter.prototype.push = function push(location, onComplete, onAbort) {
			this.history.push(location, onComplete, onAbort);
		};

		VueRouter.prototype.replace = function replace(location, onComplete, onAbort) {
			this.history.replace(location, onComplete, onAbort);
		};

		VueRouter.prototype.go = function go(n) {
			this.history.go(n);
		};

		VueRouter.prototype.back = function back() {
			this.go(-1);
		};

		VueRouter.prototype.forward = function forward() {
			this.go(1);
		};

		VueRouter.prototype.getMatchedComponents = function getMatchedComponents(to) {
			var route = to ? to.matched ? to : this.resolve(to).route : this.currentRoute;
			if (!route) {
				return [];
			}
			return [].concat.apply([], route.matched.map(function (m) {
				return Object.keys(m.components).map(function (key) {
					return m.components[key];
				});
			}));
		};

		VueRouter.prototype.resolve = function resolve(to, current, append) {
			var location = normalizeLocation(to, current || this.history.current, append, this);
			var route = this.match(location, current);
			var fullPath = route.redirectedFrom || route.fullPath;
			var base = this.history.base;
			var href = createHref(base, fullPath, this.mode);
			return {
				location: location,
				route: route,
				href: href,
				// for backwards compat
				normalizedTo: location,
				resolved: route
			};
		};

		VueRouter.prototype.addRoutes = function addRoutes(routes) {
			this.matcher.addRoutes(routes);
			if (this.history.current !== START) {
				this.history.transitionTo(this.history.getCurrentLocation());
			}
		};

		Object.defineProperties(VueRouter.prototype, prototypeAccessors);

		function registerHook(list, fn) {
			list.push(fn);
			return function () {
				var i = list.indexOf(fn);
				if (i > -1) {
					list.splice(i, 1);
				}
			};
		}

		function createHref(base, fullPath, mode) {
			var path = mode === 'hash' ? '#' + fullPath : fullPath;
			return base ? cleanPath(base + '/' + path) : path;
		}

		VueRouter.install = install;
		VueRouter.version = '2.8.1';

		if (inBrowser && window.Vue) {
			window.Vue.use(VueRouter);
		}

		module.exports = VueRouter;

		/* WEBPACK VAR INJECTION */
	}).call(exports, __webpack_require__(5));

	/***/
},
/* 5 */
/***/function (module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
		throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout() {
		throw new Error('clearTimeout has not been defined');
	}
	(function () {
		try {
			if (typeof setTimeout === 'function') {
				cachedSetTimeout = setTimeout;
			} else {
				cachedSetTimeout = defaultSetTimout;
			}
		} catch (e) {
			cachedSetTimeout = defaultSetTimout;
		}
		try {
			if (typeof clearTimeout === 'function') {
				cachedClearTimeout = clearTimeout;
			} else {
				cachedClearTimeout = defaultClearTimeout;
			}
		} catch (e) {
			cachedClearTimeout = defaultClearTimeout;
		}
	})();
	function runTimeout(fun) {
		if (cachedSetTimeout === setTimeout) {
			//normal enviroments in sane situations
			return setTimeout(fun, 0);
		}
		// if setTimeout wasn't available but was latter defined
		if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
			cachedSetTimeout = setTimeout;
			return setTimeout(fun, 0);
		}
		try {
			// when when somebody has screwed with setTimeout but no I.E. maddness
			return cachedSetTimeout(fun, 0);
		} catch (e) {
			try {
				// When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
				return cachedSetTimeout.call(null, fun, 0);
			} catch (e) {
				// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
				return cachedSetTimeout.call(this, fun, 0);
			}
		}
	}
	function runClearTimeout(marker) {
		if (cachedClearTimeout === clearTimeout) {
			//normal enviroments in sane situations
			return clearTimeout(marker);
		}
		// if clearTimeout wasn't available but was latter defined
		if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
			cachedClearTimeout = clearTimeout;
			return clearTimeout(marker);
		}
		try {
			// when when somebody has screwed with setTimeout but no I.E. maddness
			return cachedClearTimeout(marker);
		} catch (e) {
			try {
				// When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
				return cachedClearTimeout.call(null, marker);
			} catch (e) {
				// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
				// Some versions of I.E. have different rules for clearTimeout vs setTimeout
				return cachedClearTimeout.call(this, marker);
			}
		}
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
		if (!draining || !currentQueue) {
			return;
		}
		draining = false;
		if (currentQueue.length) {
			queue = currentQueue.concat(queue);
		} else {
			queueIndex = -1;
		}
		if (queue.length) {
			drainQueue();
		}
	}

	function drainQueue() {
		if (draining) {
			return;
		}
		var timeout = runTimeout(cleanUpNextTick);
		draining = true;

		var len = queue.length;
		while (len) {
			currentQueue = queue;
			queue = [];
			while (++queueIndex < len) {
				if (currentQueue) {
					currentQueue[queueIndex].run();
				}
			}
			queueIndex = -1;
			len = queue.length;
		}
		currentQueue = null;
		draining = false;
		runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
		var args = new Array(arguments.length - 1);
		if (arguments.length > 1) {
			for (var i = 1; i < arguments.length; i++) {
				args[i - 1] = arguments[i];
			}
		}
		queue.push(new Item(fun, args));
		if (queue.length === 1 && !draining) {
			runTimeout(drainQueue);
		}
	};

	// v8 likes predictible objects
	function Item(fun, array) {
		this.fun = fun;
		this.array = array;
	}
	Item.prototype.run = function () {
		this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) {
		return [];
	};

	process.binding = function (name) {
		throw new Error('process.binding is not supported');
	};

	process.cwd = function () {
		return '/';
	};
	process.chdir = function (dir) {
		throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
		return 0;
	};

	/***/
},
/* 6 */
/***/function (module, exports, __webpack_require__) {

	/**
  * Created by lomo on 2017/10/5.
  */
	var edit = __webpack_require__(7);
	var preview = __webpack_require__(16);
	var download = __webpack_require__(19);

	//require('./pages/preview/preview.vue');

	var routes = [{ path: '/edit', component: edit }, { path: '/preview', component: preview }, { path: '/download', component: download }, { path: '/', redirect: '/edit' }];

	module.exports = routes;

	/***/
},
/* 7 */
/***/function (module, exports, __webpack_require__) {

	/**
  * 作业编辑页
  * @type {Vuex.Store|*|exports|module.exports}
  */

	var store = __webpack_require__(2);
	var tpl = __webpack_require__(8);
	var editLayer = __webpack_require__(9);
	var loadingLayer = __webpack_require__(12);
	var editTag = __webpack_require__(14);
	var util = __webpack_require__(11);

	module.exports = {
		template: tpl,
		store: store,
		data: function data() {
			return {
				//记录右侧编辑区的高度
				editPosition: {},
				//当前编辑题目的题号
				editingOrder: 0,
				//当前页面的作业ID
				textbookId: 0,
				//鼠标悬浮区域的题号以及qid
				hoverInfo: {
					order: 0,
					qid: 0
				},
				//是否显示分数
				isShowMarks: false,
				//首次进入页面
				firstTime: true,
				pageNum: 0
			};
		},
		mounted: function mounted() {
			var that = this;
			scrollTo(0, 0);
			util.log('edit page mounted');

			this.textbookId = util.GetQueryString('id') || 'xiaoben06';
			util.log('textbookId', this.textbookId);

			//控制顶部栏固定
			var scTop = $('#create-bar').offset().height;
			document.onscroll = function () {
				var top = document.body.scrollTop;
				if (top > scTop) {
					$('#create-bar').css({
						top: top + 'px'
					});
				} else {
					$('#create-bar').css({
						top: ''
					});
				}
			};

			//鼠标悬停在题干时显示编辑浮层
			$('.edit-page').on('mouseenter', '.stem', function () {
				//记录当前悬停区的题号及题目id
				that.hoverInfo['order'] = $(this).attr('data-order');
				that.hoverInfo['qid'] = $(this).attr('data-qid');
				$('.hover-layer').css({
					top: $(this).offset().top,
					left: $(this).offset().left,
					height: $(this).height(),
					width: $(this).width()
				}).removeClass('none');
			});

			//为悬停浮层绑定点击事件
			$('.hover-layer').on('mouseleave', function () {
				$(this).addClass('none');
			}).on('click', function () {
				$(this).addClass('none');
				that.$store.commit('SHOW_LOADING');
			}).on('click', '.hover-edit', function () {
				that.editStem(that.hoverInfo['order']);
			}).on('click', '.hover-insert', function () {
				that.addQuestion({ order: that.hoverInfo['order'] });
			}).on('click', '.hover-delete', function () {
				that.delete(that.hoverInfo['order']);
			}).on('click', '.hover-up', function (e) {
				that.changeOrder(that.hoverInfo['order'], true);
			}).on('click', '.hover-down', function (e) {
				that.changeOrder(that.hoverInfo['order'], false);
			}).on('click', '.hover-text', function () {
				that.addShareStem(that.hoverInfo['order']);
			}).on('click', '.hover-remove', function () {
				console.log('~~~');
				that.removeShareStem(that.hoverInfo['order']);
			});

			//顶部栏事件
			$('.create-bar').on('click', '.button', function () {
				var type = $(this).attr('data-type');
				type && that.addQuestion({
					qtypeInner: type
				});
			}).on('click', '.to-top', function () {
				scrollTo(0, 0);
			});

			//修改题目
			$('.test-paper').on('click', '.title', function () {
				var top = $(this).offset().top;
				var left = $(this).offset().left;
				$('.title-edit').removeClass('none').css({
					top: top + 'px',
					left: left + 'px'
				}).find('input').focus();
			});
			$('.title-edit input').on('blur', function () {
				$('.title-edit').addClass('none');
				console.log('geng xin title');
				that.updateTitle();
			});

			this.showLoading();
			//请求作业本信息
			this.$store.dispatch('GET_BOOK_INFO', { id: this.textbookId });
			//请求题目信息
			this.$store.dispatch('GET_All_QUESTIONS', { id: this.textbookId });
			//请求有问题的题目
			this.$store.dispatch('GET_ERROR_QUESTIONS', { id: this.textbookId });
		},
		beforeUpdate: function beforeUpdate() {
			//util.log(this.qListForRender)
		},
		updated: function updated() {
			util.log('题目更新啦');
			var that = this;
			if (this.firstTime) {
				setTimeout(function () {
					that.updatePage();
					that.updateEdit();
					that.hideLoading();
					that.updatePageNum();
					that.firstTime = false;
				}, 2000);
			} else {
				that.updatePage();
				that.updateEdit();
				that.updatePageNum();
				that.hideLoading();
			}
		},
		methods: {
			/**
    * 更新渲染的页面
    */
			updatePage: function updatePage() {
				var $page = $('#hiddenPage');
				this.editPosition = [];
				//清除旧的
				$('.page.rendered').remove();
				var html = $page.html();
				var $newPage = $('<div class="page rendered"></div>').html(html).insertAfter($page);
				this.pageNum = 1;
				this.seperatePage($newPage);
			},

			/**
    * 分页运算
    * @param page 需要分页的dom
    */
			seperatePage: function seperatePage(page) {
				var maxHeight = 1080;
				var $page = page ? $(page) : $($('.page')[0]);
				var top = $page.offset().top;
				var outRange = false; //是否需要分页
				var buffer = []; //缓存节点
				var that = this;
				$.each($page.find('.stem'), function (i, v) {
					var $v = $(v);
					if (that.bookInfo.cardFormat == 2) {
						if ($v.attr('data-qtype') == 1 || $v.attr('data-qtype') == 2) {
							$v.addClass('none');
							that.editPosition[$v.attr('data-order')] = $v.offset().top;
							return true;
						}
					}
					//如果超高 直接缓存余下节点
					if (outRange) {
						buffer.push($v);
					} else {
						var order = $v.attr('data-order');
						//题目相对该页的高度
						var absoluteTop = $v.offset().top - top;
						//题目的总高度
						var h = $v.height();
						//答题区高度默认为0
						var answerH = 0;
						//计算是否超高
						if (absoluteTop + h > maxHeight) {
							//保留边距
							//炒高了
							outRange = true;
							//先复制节点
							var $clone = $v.clone();
							//复制品先清空题干，保留答题框（如果有的话）
							$($clone.find('section')).html('');
							$($clone.find('.share-stem')).html('');
							//判断类型
							var type = $v.attr('data-qtype');
							//如果非客观题则会有答题框
							if (type != 1 && type != 2) {
								//赋值答题框
								answerH = $v.find('.answer-area').height();
								//原节点答题框移除
								$v.find('.answer-area').remove();
								//假如移除简答框之后不超高
								if (absoluteTop + h - answerH < maxHeight) {
									//缓存克隆节点，且跳出该次循环
									$clone.find('.orderBy').remove();
									buffer.push($clone);
									if (!that.editPosition[order]) {
										that.editPosition[order] = $v.find('.orderBy').offset().top;
									}
									return true;
								}
								//假如还超高
								else {}
							}
							//假如只剩下题干还超高
							var $p = $($v.find('section'));
							var html = $p.html();
							var array = html.split('<br>');
							var array2 = html.split('<br>');
							var s = '';
							for (var i = 0, l = array.length; i < l; i++) {
								s = array[l - 1 - i] + s;
								array2.splice(l - 1 - i, 1);
								html = array2.join('<br>');
								$p.html(s);
								$($clone.find('section')).html(s);
								if (absoluteTop + h - $p.height() - answerH < maxHeight) {
									$p.html(html);
									break;
								}
								var stemHeight = $p.height();
								$p.html('');
								s = '<br>' + s;
							}
							//处理完题干
							if (!$p.html()) {
								//不管怎样 先除掉题号
								$v.find('.orderBy').remove();

								//看看有没有公共题干
								if ($v.find('.share-stem').length) {
									if (absoluteTop + h - answerH - stemHeight > maxHeight) {
										var $shareStem = $($v.find('.share-stem'));
										var sHtml = $shareStem.html();
										var sArray = sHtml.split('<br>');
										var sArray2 = sHtml.split('<br>');
										var string = '';
										for (var i = 0, l = sArray.length; i < l; i++) {
											string = sArray[l - 1 - i] + string;
											sArray2.splice(l - 1 - i, 1);
											sHtml = sArray2.join('<br>');
											$shareStem.html(string);
											$($clone.find('.share-stem')).html(string);
											if (absoluteTop + h - $shareStem.height() - answerH - stemHeight < maxHeight) {
												$shareStem.html(html);
												break;
											}
											$shareStem.html('');
											string = '<br>' + string;
										}

										if (!$shareStem.html()) {
											$v.remove();
										} else {
											////超高了，但是还残留了题干在该页，记录题目位置用于更新编辑区域位置
											//that.editPosition[order] = $v.offset().top
										}
									}

									//假如整题移到下一页，节点就不保留了
								} else {
									$v.remove();
								}
							} else {
								//否则跨页题号要删掉
								$clone.find('.orderBy').remove();
								//超高了，但是还残留了题干在该页，记录题目位置用于更新编辑区域位置
								that.editPosition[order] = $v.find('.orderBy').offset().top;
							}
							buffer.push($clone);
						} else {
							//没有超高，记录题目位置用于更新编辑区域位置
							if (!that.editPosition[order]) {
								that.editPosition[order] = $v.find('.orderBy').offset().top;
							}
						}
					}
				});
				//调整好的页面设置高度
				$page.css('height', '1121px');
				//将超高节点都挪到下一页
				if (outRange) {
					var $newPage = $('<div class="page rendered"><div class="stem-area"></div></div>');
					this.pageNum = this.pageNum + 1; //页数增加1
					var $stemArea = $($newPage.find('.stem-area'));
					buffer.forEach(function (v) {
						v.appendTo($stemArea);
					});
					$newPage.insertAfter($page);
					this.seperatePage($newPage);
				}
			},

			/**
    * 更新编辑区位置
    */
			updateEdit: function updateEdit() {
				var that = this;
				var h = $('.edit-area').offset().top;
				var l = 0;
				$('.edit-item').forEach(function (v) {
					var index = $(v).attr('data-index');
					if (index == 1 && that.editPosition[index] - h < 0) {
						that.editPosition[index] = h + 100;
					}
					if (index > 1 && that.editPosition[index] - that.editPosition[index - 1] < 180) {
						that.editPosition[index] = that.editPosition[index - 1] + 180;
					}
					$(v).css('top', that.editPosition[index] - h + 'px');
					l = index;
				});
				$('.edit-add').css({
					'top': that.editPosition[l] + 100 + 'px'
				});
			},

			updatePageNum: function updatePageNum() {
				var that = this;
				$('.page.rendered').forEach(function (v, i) {
					var $page = $(v);
					$page.append($('<div class="pageNum">第' + (i + 1) + '页（共' + that.pageNum + '页）</div>'));
				});
			},

			/**
    * 跳转到预览页
    */
			toPreview: function toPreview() {
				var that = this;
				var msg = '';
				this.qListForRender.forEach(function (v) {
					msg = msg + (that.checkQuestion(v) ? '\n' + that.checkQuestion(v) : '');
				});
				if (msg) {
					window.confirm(msg);
				} else if (this.isShowMarks && this.totalMark != 100 && this.totalMark != 120 && this.totalMark != 150) {
					var flag = window.confirm('当前试卷总分为' + this.totalMark + '，确定要提交？');
					if (flag) {
						this.showLoading();
						this.updatePreviewHtml();
						this.hideLoading();
						location.href = location.href.replace('#/edit', '#/preview');
					}
				} else {
					this.showLoading();
					this.updatePreviewHtml();
					this.hideLoading();
					location.href = location.href.replace('#/edit', '#/preview');
				}
				//console.log(msg)
			},

			/**
    * 检查填写情况
    * @param question
    * @returns {*}
    */
			checkQuestion: function checkQuestion(question) {
				var errorMsg = '第' + question.orderBy + '题请补充：';
				var errorArr = [];
				if (question.qtypeInner == null) {
					errorArr.push('题目类型');
				}
				if (question.qtypeInner == 1 || question.qtypeInner == 2) {
					if (!question.answerCount) {
						errorArr.push('选项个数');
					}
				}
				if ((question.qtypeInner == 1 || question.qtypeInner == 2) && !question.answer) {
					errorArr.push('答案');
				}
				if (!question.difficulty) {
					errorArr.push('难度');
				}
				if (!question.knpList || !question.knpList.length) {
					errorArr.push('知识点');
				}
				if (errorArr.join('、')) {
					return errorMsg + errorArr.join('、');
				} else {
					return '';
				}
			},

			/**
    * 生成预览页html
    */
			updatePreviewHtml: function updatePreviewHtml() {
				var html = '';
				$('.page.rendered').forEach(function (v, i) {
					html = html + '<div class="page" data-pageid="' + (i + 1) + '">' + $(v).html() + '</div>';
				});
				this.$store.dispatch('CHANGE_HTML', { html: html });
			},

			/**
    * 点击修改建议
    * @param order
    */
			callfix: function callfix(order) {
				this.editStem(order);
			},
			callKnp: function callKnp(order) {
				util.log(order);
				if (order) {
					this.$store.commit('CHANGE_EDITING_ORDER', order);
					this.editingOrder = order;
				}
				this.showKnp();
			},
			/**
    * 修改题目
    * @param order
    */
			editStem: function editStem(order) {
				util.log(order);
				this.$store.commit('CHANGE_EDITING_ORDER', order);
				this.editingOrder = order;
				//util.log(this.editingStem)
				this.showEdit();
			},

			/**
    * 添加上方文本内容
    * @param order
    */
			addShareStem: function addShareStem(order) {
				this.$store.commit('CHANGE_EDITING_ORDER', order);
				this.editingOrder = order;
				this.showAddShare();
			},
			removeShareStem: function removeShareStem(order) {
				this.$store.commit('CHANGE_EDITING_ORDER', order);
				this.editingOrder = order;
				this.editingStem.shareStem = '';
				this.$store.dispatch('EDIT_SAVE', this.editingStem);
			},
			/**
    * 更新试卷题目
    */
			updateTitle: function updateTitle() {
				this.$store.dispatch('EDIT_TITLE', this.bookInfo.name);
			},

			/**
    * 控制编辑浮层
    */
			showEdit: function showEdit() {
				this.$store.commit('SHOW_EDIT');
			},
			hideEdit: function hideEdit() {
				this.$store.commit('HIDE_EDIT');
			},

			showAddShare: function showAddShare() {
				this.$store.commit('SHOW_ADD_SHARE');
			},

			/**
    * 控制知识点浮层
    */
			showKnp: function showKnp() {
				this.$store.commit('SHOW_KNP');
			},
			hideKnp: function hideKnp() {
				this.$store.commit('HIDE_KNP');
			},

			/**
    * 控制loading浮层
    */
			showLoading: function showLoading() {
				$('.load-container').removeClass('none');
			},
			hideLoading: function hideLoading() {
				$('.load-container').addClass('none');
			},

			/**
    * 改变题号
    * @param order 序号
    * @param isUp 是否上移
    */
			changeOrder: function changeOrder(order, isUp) {
				//上移
				if (isUp) {
					if (order <= 1) return;
					this.$store.dispatch('CHANGE_ORDER', { order: order, isUp: true });

					//this.$store.commit('CHANGE_ORDER_UP',order)
					//下移
				} else {
					if (order >= this.qListForRender.length) return;
					this.$store.dispatch('CHANGE_ORDER', { order: order, isUp: false });
					//this.$store.commit('CHANGE_ORDER_DOWN',order)
				}
			},

			/**
    * 添加新题目
    * @param params
    */
			addQuestion: function addQuestion(params) {
				this.$store.dispatch('ADD_MODEL', {
					type: params.qtypeInner ? params.qtypeInner : '', //类型
					orderBy: params.order || this.qListForRender.length + 1 //序号
				});
				this.$store.commit('SHOW_ADD');
				util.log('添加新题');
			},

			/**
    * 删除题目
    * @param order
    */
			delete: function _delete(order) {
				this.showLoading();
				this.$store.dispatch('DELETE_QUESTION', { orderBy: order });
			},

			/**
    * 重新排版
    */
			reFormat: function reFormat() {
				this.updatePage();
				this.updateEdit();
			}

		},
		computed: {
			qListForRender: function qListForRender() {
				return this.$store.state.qListForRender;
			},
			editData: function editData() {
				return this.$store.state.editData;
			},
			bookInfo: function bookInfo() {
				return this.$store.state.bookInfo;
			},
			errorData: function errorData() {
				return this.$store.state.eList;
			},
			editingStem: function editingStem() {
				if (this.editingOrder != 0) {
					return $.extend({}, this.$store.state.qListForRender[this.editingOrder - 1]);
				} else {
					return {};
				}
			},
			totalMark: function totalMark() {
				var mark = 0;
				this.qListForRender.forEach(function (v) {
					mark = mark + v.score;
				});
				if (this.isShowMarks) {
					return mark;
				} else {
					return '';
				}
			}
		},
		watch: {},
		components: {
			'edit-layer': editLayer,
			'loading-layer': loadingLayer,
			'edit-tag': editTag
		}
	};

	/***/
},
/* 8 */
/***/function (module, exports) {

	module.exports = "<div>\r\n\r\n    <!--步骤栏-->\r\n    <div class=\"top-bar\">\r\n        <div class=\"box\">第1步：新建作业</div>\r\n        <div class=\"arrow current\"></div>\r\n\r\n        <div class=\"box current\">第2步：作业编辑</div>\r\n        <div class=\"arrow \"></div>\r\n\r\n        <div class=\"box \">第3步：作业预览</div>\r\n        <div class=\"arrow current\"></div>\r\n\r\n        <div class=\"box \">第4步：生成作业</div>\r\n    </div>\r\n    <!--有问题的题目-->\r\n    <div class=\"problem-bar\" v-if=\"errorData && errorData.length\">\r\n        <table>\r\n            <tr>\r\n                <th>题号</th>\r\n                <th>问题</th>\r\n                <th>解决建议</th>\r\n                <th>调整</th>\r\n            </tr>\r\n            <template v-for=\"item in errorData\">\r\n                <tr>\r\n                    <td>第{{item.orderBy}}题</td>\r\n                    <td>{{item.errMgs}}</td>\r\n                    <td>{{item.suggest}}</td>\r\n                    <td class=\"fix\" v-on:click=\"callfix(item.orderBy)\">调整</td>\r\n                </tr>\r\n            </template>\r\n        </table>\r\n    </div>\r\n    <!--添加新题-->\r\n    <div class=\"create-bar\" id=\"create-bar\">\r\n        <div>\r\n            <span>添加题目</span>\r\n            <div class=\"button\" data-type=\"1\">+ 单选题</div>\r\n            <div class=\"button\" data-type=\"2\">+ 多选题</div>\r\n            <div class=\"button\" data-type=\"3\">+ 填空题</div>\r\n            <div class=\"button\" data-type=\"4\">+ 简答题</div>\r\n\r\n            <div class=\"to-top\">返回顶部</div>\r\n            <div class=\"reFormat\" v-on:click=\"reFormat\">调整排版</div>\r\n\r\n            <div class=\"mark-wrap\">\r\n                <input style=\"margin-right:5px\" type=\"checkbox\" name=\"checkbox1\" value=\"true\" v-model=\"isShowMarks\"/>添加分数（试卷总分：{{totalMark}}）\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!--编辑题目区域-->\r\n    <div class=\"main-area\">\r\n        <!--题目区-->\r\n        <div class=\"test-paper\">\r\n            <div class=\"page-Wrap edit-page\">\r\n                <div class=\"page none\" id=\"hiddenPage\">\r\n                    <div class=\"head\">\r\n                        <div class=\"title\">{{bookInfo.name}}</div>\r\n                        <div class=\"information\">\r\n                            班级___________&nbsp&nbsp&nbsp&nbsp&nbsp\r\n                            姓名___________&nbsp&nbsp&nbsp&nbsp&nbsp\r\n                            学号___________\r\n                        </div>\r\n                        <div class=\"detail\">\r\n                            【客观题填涂的正确方法】<br>\r\n                            • 请使用用2B铅笔填涂；修改时用橡皮擦擦干净；<br>\r\n                            • 填涂的正确方法是：<br>\r\n                            【主观题填涂的正确方法】<br>\r\n                            • 请在答题方框内作答，超出将视为无效答案内容\r\n                            <div class=\"QRCode\">二维码</div>\r\n                            <div class=\"example-block\">\r\n                                <div class=\"block\"></div>\r\n                                <div class=\"block white\"></div>\r\n                                <div class=\"block white\"></div>\r\n                                <div class=\"block white\"></div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"answer\">\r\n                        <div class=\"block top-left\"></div>\r\n                        <div class=\"block top-right\"></div>\r\n                        <div class=\"block bottom-left\"></div>\r\n\r\n                        <div class=\"fillArea\" v-if=\"qListForRender && qListForRender.length\">\r\n                            <template v-for=\"item in qListForRender\">\r\n                                <div class=\"fillArea-answer answerarea\" v-if=\"item.qtypeInner == 1 || item.qtypeInner == 2\"\r\n                                     :data-qid=\"item.questionId\" :data-order=\"item.orderBy\" :data-type=\"item.qtypeInner\">\r\n                                    <span>{{item.orderBy}}</span>\r\n                                    <div class=\"fillArea-block answerblock\" v-for=\"selection in item.answerCountArray\">\r\n                                        {{selection}}\r\n                                    </div>\r\n                                </div>\r\n                            </template>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"stem-area\" v-if=\"qListForRender && qListForRender.length\">\r\n                        <template v-for=\"item in qListForRender\">\r\n                            <div class=\"stem\" :data-qid=\"item.questionId\" :data-qtype=\"item.qtypeInner\"\r\n                                 :data-order=\"item.orderBy\">\r\n                                <div class=\"share-stem\" v-if=\"item.shareStem\" v-html=\"item.shareStem\"></div>\r\n                                <div class=\"orderBy\">\r\n                                    第{{item.orderBy}}题\r\n                                    <div v-if=\"item.qtypeInner==1\" class=\"qtypeInner\">单选题</div>\r\n                                    <div v-if=\"item.qtypeInner==2\" class=\"qtypeInner\">多选题</div>\r\n                                    <div v-if=\"item.qtypeInner==3\" class=\"qtypeInner\">填空题</div>\r\n                                    <div v-if=\"item.qtypeInner==4\" class=\"qtypeInner\">简答题</div>\r\n\r\n                                    <div v-if=\"item.score && isShowMarks\" class=\"score\">（{{item.score}}分）</div>\r\n                                </div>\r\n                                <template v-if=\"bookInfo.cardFormat != 1\">\r\n                                    <section></section>\r\n                                </template>\r\n                                <template v-if=\"bookInfo.cardFormat == 1\">\r\n                                    <section v-html=\"item.stem\"></section>\r\n                                </template>\r\n                                <div class=\"answer-area\" v-if=\"item.qtypeInner != 1 && item.qtypeInner != 2\" v-bind:style=\"{height: item.height + 'px'}\">\r\n                                    我的作答\r\n                                </div>\r\n                            </div>\r\n                        </template>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!--编辑区-->\r\n        <div class=\"edit-area\">\r\n            <template v-for=\"(item, index) in editData\">\r\n                <edit-tag :orderBy=\"index+1\" v-on:knpLinkClick=\"callKnp(index+1)\"\r\n                          v-on:editLinkClick=\"callfix(index+1)\" v-bind:isShowMarks=\"isShowMarks\"></edit-tag>\r\n            </template>\r\n            <div class=\"edit-add\" v-on:click=\"addQuestion\">\r\n                添加新题\r\n            </div>\r\n        </div>\r\n        <!--选中浮层-->\r\n        <div class=\"hover-layer none\">\r\n            <div class=\"hover-btns\">\r\n                <div class=\"hover-edit\">编辑题目</div>\r\n                <div class=\"hover-insert\">插入题目</div>\r\n                <div class=\"hover-delete\">删除题目</div>\r\n                <div class=\"hover-text\">编辑上方文本</div>\r\n                <div class=\"hover-remove\">删除上方文本</div>\r\n                <div class=\"hover-up\">上移</div>\r\n                <div class=\"hover-down\">下移</div>\r\n            </div>\r\n        </div>\r\n        <!--编辑题目-->\r\n        <div class=\"title-edit none\">\r\n            <input type=\"text\" v-model=\"bookInfo.name\">\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"preview-bar\">\r\n        <div class=\"preview-btn\" v-on:click=\"toPreview\">作业预览</div>\r\n    </div>\r\n\r\n    <loading-layer></loading-layer>\r\n    <edit-layer></edit-layer>\r\n</div>\r\n";

	/***/
},
/* 9 */
/***/function (module, exports, __webpack_require__) {

	/**
  * Created by jie on 2017/10/15.
  */
	var tpl = __webpack_require__(10);
	var store = __webpack_require__(2);
	var util = __webpack_require__(11);

	var ue;
	var ue2;
	var ue3;

	module.exports = {
		template: tpl,
		store: store,
		data: function data() {
			return {
				coursebookId: ' ',
				selectedKplList: [],
				isAddAll: false,
				searchText: '',
				selectionNums: 7
			};
		},
		mounted: function mounted() {
			var that = this;
			console.log('编辑面板mounted');
			//初始化编辑器
			ue = ue || UE.getEditor('container1', {
				elementPathEnabled: false,
				initialFrameHeight: 300

			});
			ue2 = ue2 || UE.getEditor('container2', {
				elementPathEnabled: false,
				initialFrameHeight: 200
			});
			ue3 = ue3 || UE.getEditor('container3', {
				elementPathEnabled: false,
				initialFrameHeight: 300
			});
			$('.chapter').on('click', '.list', function (e) {
				var id = $(this).attr('data-id');
				console.log(id);
				if (id) {
					$(this).toggleClass('fold');
				}
				e.stopPropagation();
			});
			$('.add-knp').on('click', function () {
				that.showKnp();
			});
			$('#selectAnswer').on('click', '.answer-item', function () {
				if (that.editingStem.qtypeInner == 1) {
					$(this).toggleClass('selected');
					$(this).siblings().removeClass('selected');
				} else if (that.editingStem.qtypeInner == 2) {
					$(this).toggleClass('selected');
				}
			});
		},

		updated: function updated() {
			$('.knp-checkbox').on('click', function (e) {
				e.stopPropagation();
			});
		},
		methods: {
			editSave: function editSave(flag) {
				this.editingStem.stem = ue.getContent();
				if (this.editingStem.qtypeInner == 1 || this.editingStem.qtypeInner == 2) {
					var arr = [];
					$('#selectAnswer').find('.answer-item').forEach(function (v, i) {
						if ($(v).hasClass('selected')) {
							arr.push($(v).text());
						}
					});
					var answer = arr.join(',');
					if (answer) {
						this.editingStem.answer = answer;
					} else {
						alert('请选择答案');
						return;
					}
				} else {
					this.editingStem.answer = ue2.getContent();
					this.editingStem.answerCount = '';
				}
				util.log(this.editingStem);
				this.showLoading();
				this.$store.dispatch('EDIT_SAVE', this.editingStem);
				this.hideEdit();
			},
			addShareSave: function addShareSave() {
				this.editingStem.shareStem = ue3.getContent();
				this.$store.dispatch('EDIT_SAVE', this.editingStem);
				this.hideAddShare();
			},
			knpSave: function knpSave() {
				var knpArr = [];
				var that = this;
				this.selectedKplList.forEach(function (v, i) {
					knpArr.push(JSON.parse(v));
				});
				if (this.editingStem.knpList != null) {
					var newArr = {};
					var output = [];
					for (var i = 0; i < this.editingStem.knpList.length; i++) {
						if (!newArr[this.editingStem.knpList[i].knpId]) {
							newArr[this.editingStem.knpList[i].knpId] = this.editingStem.knpList[i].knpName;
						}
					}
					for (var i = 0; i < knpArr.length; i++) {
						if (!newArr[knpArr[i].knpId]) {
							newArr[knpArr[i].knpId] = knpArr[i].knpName;
						}
					}
					$.each(newArr, function (key, v) {
						output.push({
							knpId: key,
							knpName: v
						});
					});
					console.log(output);
					this.editingStem.knpList = output;
				} else {
					this.editingStem.knpList = knpArr;
				}
				this.showLoading();
				this.$store.dispatch('EDIT_SAVE', this.editingStem);
				this.hideKnp();
				if (this.isAddAll) {
					this.$store.dispatch('ADD_ALL_KNP', knpArr);
				}
				console.log(this.editingStem.knpList);
				console.log(knpArr);
			},
			deleteKnp: function deleteKnp(index) {
				console.log(index);
				//console.log(index);
				this.editingStem.knpList.splice(index, 1);
				//this.selectedKplList = [];
				this.commitEdit();
			},
			searchKnp: function searchKnp() {
				this.updateChapters();
			},
			commitEdit: function commitEdit() {
				this.editingStem.stem = ue.getContent();
				if (this.editingStem.qtypeInner == 1 || this.editingStem.qtypeInner == 2) {
					var arr = [];
					$('#selectAnswer').find('.answer-item').forEach(function (v, i) {
						if ($(v).hasClass('selected')) {
							arr.push($(v).text());
						}
					});
					var answer = arr.join(',');
					if (answer) {
						this.editingStem.answer = answer;
					} else {
						alert('请选择答案');
						return;
					}
				} else {
					this.editingStem.answer = ue2.getContent();
					this.editingStem.answerCount = '';
				}
				util.log(this.editingStem);
				this.showLoading();
				this.$store.dispatch('EDIT_SAVE', this.editingStem);
			},
			/**
    * 确定添加题目
    */
			comfirmAdd: function comfirmAdd() {
				this.showLoading();
				if (this.addModel.orderBy) {
					this.addModel.orderBy = Math.round(this.addModel.orderBy);
				}
				if (this.addModel.endOrderBy) {
					this.addModel.endOrderBy = Math.round(this.addModel.endOrderBy);
				}
				if (this.addModel.orderBy <= 0 || this.addModel.orderBy > this.qListForRender.length + 1 || this.addModel.endOrderBy && this.addModel.endOrderBy - this.addModel.orderBy < 0) {
					alert('题号填写异常，请重新输入题号');
					this.hideLoading();
				} else {
					if (this.addModel.orderBy != this.qListForRender.length + 1) {
						this.addModel.insert = true;
					}
					this.hideAdd();
					this.$store.dispatch('ADD_NEW_QUESTION');
				}
			},
			difficultyClick: function difficultyClick(e) {
				var $this = $(e.target);
				var difficulty = $this.attr('data-difficulty');

				if ($this.hasClass('selected')) return;

				$this.toggleClass('selected');
				$this.siblings().removeClass('selected');

				this.editingStem.difficulty = difficulty;
			},

			showKnp: function showKnp() {
				this.$store.commit('SHOW_KNP');
			},
			hideKnp: function hideKnp() {
				this.$store.commit('HIDE_KNP');
			},

			showEdit: function showEdit() {
				this.$store.commit('SHOW_EDIT');
			},
			hideEdit: function hideEdit() {
				this.$store.commit('HIDE_EDIT');
			},

			hideAdd: function hideAdd() {
				this.$store.commit('HIDE_ADD');
			},

			hideAddShare: function hideAddShare() {
				this.$store.commit('HIDE_ADD_SHARE');
			},

			editTypeChange: function editTypeChange() {
				var type = this.editingStem.qtypeInner;
				if (type == 1 || type == 2) {
					$('.options').css({
						display: ''
					});
					$('.choose-answer').css({
						display: ''
					});
					$('.blank-answer').css({
						display: 'none'
					});
				} else {
					$('.options').css({
						display: 'none'
					});
					$('.choose-answer').css({
						display: 'none'
					});
					$('.blank-answer').css({
						display: ''
					});
				}
			},
			selectNumChange: function selectNumChange() {
				this.initSelectAnswer();
			},
			initSelectAnswer: function initSelectAnswer() {
				if (this.editingStem.qtypeInner == 1 || this.editingStem.qtypeInner == 2) {
					var html = '';
					var answer = this.editingStem.answer || '';
					for (var i = 0; i < this.editingStem.answerCount; i++) {
						var char = String.fromCharCode(i + 65);
						if (answer.indexOf(char) != -1) {
							html = html + '<div class="answer-item selected">' + char + '</div>';
						} else {
							html = html + '<div class="answer-item">' + char + '</div>';
						}
					}
					$('#selectAnswer').empty();
					$('#selectAnswer').append($(html));
				}
			},
			updateCourseBook: function updateCourseBook() {
				this.$store.dispatch('UPDATE_COURSE_BOOK', this.knpFilter);
			},
			updateChapters: function updateChapters() {
				this.searchText = '';
				this.$store.dispatch('GET_CHAPTERS', this.coursebookId);
				//this.$store.dispatch('GET_CHAPTERS', '329201226790993920')
			},
			showLoading: function showLoading() {
				$('.load-container').removeClass('none');
			},
			hideLoading: function hideLoading() {
				$('.load-container').addClass('none');
			}
		},
		filters: {
			numberlize: function numberlize(value) {
				return Math.round(value);
			}
		},
		computed: {
			editingStem: function editingStem() {
				if (this.$store.state.editingOrder != 0) {
					this.updateCourseBook();
					return $.extend({}, this.$store.state.qListForRender[this.$store.state.editingOrder - 1]);
				} else {
					return {};
				}
			},
			showOptions: function showOptions() {
				return this.editingStem.qtypeInner == 1 || this.editingStem.qtypeInner == 2;
			},
			hideLayer: function hideLayer() {
				if (this.$store.state.hideEdit && this.$store.state.hideKnp && this.$store.state.hideAdd && this.$store.state.hideAddShare) {
					$('body').css({
						'overflow': ''
					});
				} else {
					$('body').css({
						'overflow': 'hidden'
					});
				}
				return this.$store.state.hideEdit && this.$store.state.hideKnp && this.$store.state.hideAdd && this.$store.state.hideAddShare;
			},
			hideEditLayer: function hideEditLayer() {
				if (!this.$store.state.hideEdit) {
					ue.setContent(this.editingStem.stem);
					ue2.setContent(this.editingStem.answer);
					this.initSelectAnswer();
					this.editTypeChange();
				}
				return this.$store.state.hideEdit;
			},
			hideKnpLayer: function hideKnpLayer() {
				return this.$store.state.hideKnp;
			},
			hideAddLayer: function hideAddLayer() {
				return this.$store.state.hideAdd;
			},
			hideAddShareLayer: function hideAddShareLayer() {
				if (!this.$store.state.hideAddShare) {
					ue3.setContent(this.editingStem.shareStem || '');
				}
				return this.$store.state.hideAddShare;
			},
			knpFilter: function knpFilter() {
				return this.$store.state.knpFilter;
			},
			courseBook: function courseBook() {
				return this.$store.state.courseBook;
			},
			chapterList: function chapterList() {
				console.log(JSON.stringify(this.$store.state.chapterList));
				return this.$store.state.chapterList;
			},
			chapterListForRender: function chapterListForRender() {
				var that = this;
				var list = {};
				var level4 = {};
				var level3 = {};
				var level2 = {};
				var level1;

				if (this.$store.state.chapterList) {

					this.$store.state.chapterList.slice(0).forEach(function (v, i) {
						var level = v.level;
						//默认不展开
						v.unFold = false;
						if (that.searchText) {
							$.each(v.knpList, function (i, knp) {
								if (knp.knpName.indexOf(that.searchText) > -1) {
									v.unFold = true;
									return false;
								}
							});
						} else {
							v.unFold = true;
						}
						switch (level) {
							case 1:
								v.son = [];
								level1 = level1 ? level1 : {};
								level1[v.id] = v;
								v.knpList = [];
								break;
							case 2:
								v.son = [];

								level2[v.id] = v;

								break;
							case 3:
								v.son = [];

								level3[v.id] = v;

								break;
							case 4:
								v.son = [];

								level4[v.id] = v;
								break;
						}
					});
					level4 && $.each(level4, function (i, v) {
						var parentId = v.parentId;
						if (parentId && level3[parentId]) {
							if (v.unFold) {
								level3[parentId].unFold = true;
							}
							level3[parentId].son.push(v);
						}
					});
					level3 && $.each(level3, function (i, v) {
						var parentId = v.parentId;

						if (parentId && level2[parentId]) {
							if (v.unFold) {
								level2[parentId].unFold = true;
							}
							level2[parentId].son.push(v);
						}
					});
					level2 && $.each(level2, function (i, v) {
						var parentId = v.parentId;
						if (v.unFold) {
							level1[parentId].unFold = true;
						}

						if (parentId && level1[parentId]) {
							level1[parentId].son.push(v);
						}
					});

					return level1;
				}
			},
			chapterListForSearch: function chapterListForSearch() {},
			addModel: function addModel() {
				return this.$store.state.addModel;
			},
			knpList: function knpList() {
				return this.$store.state.knpList;
			},
			qListForRender: function qListForRender() {
				return this.$store.state.qListForRender;
			},
			selectionArr: function selectionArr() {
				var arr = {};
				if (this.selectionNums) {
					arr['0'] = '选项个数';
					var i = 2;
					while (i <= this.selectionNums) {
						arr[i] = i;
						i++;
					}
				}
				return arr;
			}
		},
		watch: {
			editingStem: function editingStem() {
				var that = this;
				this.selectedKplList = [];
				if (this.editingStem.knpList) {
					this.editingStem.knpList.forEach(function (v, i) {
						that.selectedKplList.push(JSON.stringify(v));
					});
				}
			}
		}
	};

	/***/
},
/* 10 */
/***/function (module, exports) {

	module.exports = "<!--遮罩层-->\r\n<div>\r\n    <!--透明浮层-->\r\n    <div v-bind:class=\"{ none: hideLayer, layer:true}\" id=\"layer\"></div>\r\n    <!--新建题目-->\r\n    <div v-bind:class=\"{ none: hideAddLayer, 'edit-layer':true, 'add-layer':true, 'anim-opacity2': !hideAddLayer}\">\r\n        <div class=\"top\">\r\n            添加题目\r\n            <div class=\"icon-close\" v-on:click=\"hideAdd\">\r\n                <img src=\"/images/close.png\" alt=\"\">\r\n            </div>\r\n        </div>\r\n        <div class=\"edit-wrap\">\r\n            <div class=\"edit-panel\">\r\n                <div class=\"edit-row\">\r\n                    <!--<div class=\"edit-row\">-->\r\n                        <!--<strong>添加题目{{addModel.orderBy}}</strong>-->\r\n                    <!--</div>-->\r\n                    <div class=\"inline\">\r\n                        <span><i>*</i>题型</span>\r\n                        <select v-model=\"addModel.qtypeInner\" class=\"select\">\r\n                            <option value=\"\">选择题型</option>\r\n                            <option value=\"1\">单选题</option>\r\n                            <option value=\"2\">多选题</option>\r\n                            <option value=\"3\">填空题</option>\r\n                            <option value=\"4\">简答题</option>\r\n                        </select>\r\n                    </div>\r\n                    <div class=\"inline\" v-if=\"addModel.qtypeInner == 1 || addModel.qtypeInner == 2\">\r\n                        <span><i>*</i>选项</span>\r\n                        <select v-model=\"addModel.answerCount\" class=\"select\">\r\n                            <template v-for=\"item,key in selectionArr\">\r\n                                <option :value=\"key\">{{item}}</option>\r\n                            </template>\r\n                        </select>\r\n                    </div>\r\n                </div>\r\n                <div class=\"edit-row\">\r\n\r\n                    <div class=\"inline\">\r\n                        <span><i>*</i>题号</span>\r\n                        <input class=\"input\" type=\"number\" v-model=\"addModel.orderBy\">\r\n                    </div>\r\n                    <div class=\"inline\" >\r\n                        <span>至</span>\r\n                        <input class=\"input\" type=\"number\" v-model=\"addModel.endOrderBy\" >\r\n                    </div>\r\n                </div>\r\n                <div class=\"edit-save inline\" v-on:click=\"comfirmAdd\">确定</div>\r\n                <!--<div class=\"edit-save inline\">取消</div>-->\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!--编辑-->\r\n    <div v-bind:class=\"{ none: hideEditLayer, 'edit-layer':true, 'anim-opacity2': !hideEditLayer}\" id=\"editLayer\">\r\n        <div class=\"top\">\r\n            题目编辑\r\n            <div class=\"icon-close\" v-on:click=\"hideEdit\">\r\n                <img src=\"/images/close.png\" alt=\"\">\r\n            </div>\r\n        </div>\r\n        <div class=\"edit-wrap\">\r\n            <div class=\"edit-panel\">\r\n                <div class=\"edit-row\">\r\n                    <strong>第{{editingStem.orderBy}}题</strong>\r\n                </div>\r\n                <div class=\"edit-row\">\r\n                    <div class=\"inline\">\r\n                        <span><i>*</i>题型</span>\r\n                        <select v-model=\"editingStem.qtypeInner\" class=\"select\" v-on:change=\"editTypeChange\">\r\n                            <option value=\"null\">选择题型</option>\r\n                            <option value=\"1\">单选题</option>\r\n                            <option value=\"2\">多选题</option>\r\n                            <option value=\"3\">填空题</option>\r\n                            <option value=\"4\">简答题</option>\r\n                        </select>\r\n                    </div>\r\n                    <div class=\"inline options\">\r\n                        <span><i>*</i>选项</span>\r\n                        <select v-model=\"editingStem.answerCount\" class=\"select\" v-on:change=\"selectNumChange\">\r\n                            <option value=\"2\">2</option>\r\n                            <option value=\"3\">3</option>\r\n                            <option value=\"4\">4</option>\r\n                            <option value=\"5\">5</option>\r\n                            <option value=\"0\">选项个数</option>\r\n                        </select>\r\n                    </div>\r\n\r\n                </div>\r\n                <div class=\"edit-row\">\r\n                    <span><i>*</i>难度</span>\r\n\r\n                    <div v-if=\"editingStem.difficulty==0.8\" class=\"difficulty\" v-on:click=\"difficultyClick\">\r\n                        <div class=\"selected\" data-difficulty=\"0.8\">基础</div>\r\n                        <div data-difficulty=\"0.5\">巩固</div>\r\n                        <div data-difficulty=\"0.3\">提高</div>\r\n                    </div>\r\n                    <div v-else-if=\"editingStem.difficulty==0.5\" class=\"difficulty\" v-on:click=\"difficultyClick\">\r\n                        <div data-difficulty=\"0.8\">基础</div>\r\n                        <div class=\"selected\" data-difficulty=\"0.5\">巩固</div>\r\n                        <div data-difficulty=\"0.3\">提高</div>\r\n                    </div>\r\n                    <div v-else-if=\"editingStem.difficulty==0.3\" class=\"difficulty\" v-on:click=\"difficultyClick\">\r\n                        <div data-difficulty=\"0.8\">基础</div>\r\n                        <div data-difficulty=\"0.5\">巩固</div>\r\n                        <div class=\"selected\" data-difficulty=\"0.3\">提高</div>\r\n                    </div>\r\n                    <div v-else class=\"difficulty\" v-on:click=\"difficultyClick\">\r\n                        <div data-difficulty=\"0.8\">基础</div>\r\n                        <div data-difficulty=\"0.5\">巩固</div>\r\n                        <div data-difficulty=\"0.3\">提高</div>\r\n                    </div>\r\n                    <!--<span><i>&nbsp;</i>分值</span>-->\r\n                    <!--<input class=\"input\" type=\"text\" v-model=\"editingStem.score\">-->\r\n                </div>\r\n                <div class=\"edit-row\">\r\n                    <span><i>*</i>知识点</span>\r\n                    <div class=\"knowledge\">\r\n                        <template v-for=\"(knp,index) in editingStem.knpList\">\r\n                            <div >{{knp.knpName}}<img src=\"/images/delete.png\" style=\"float: right\"  alt=\"\" v-on:click=\"deleteKnp(index)\"></div>\r\n                        </template>\r\n                        <div class=\"add-knp\" style=\"padding-right: 10px\">添加</div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"edit-row\">\r\n                    <span><i>*</i>题干</span>\r\n                    <div class=\"uEditor-area\">\r\n                        <script id=\"container1\" name=\"content\" type=\"text/plain\"></script>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"edit-row choose-answer\">\r\n                    <span><i>*</i>答案</span>\r\n                    <div class=\"answer\" id=\"selectAnswer\">\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"edit-row blank-answer\">\r\n\r\n                    <span>&nbsp&nbsp答案</span>\r\n                    <div class=\"uEditor-area\">\r\n                        <script id=\"container2\" name=\"content\" type=\"text/plain\"></script>\r\n                    </div>\r\n                    <div>\r\n                        <span>高度</span>\r\n                        <input class=\"input\" type=\"text\" v-model=\"editingStem.height\">\r\n                    </div>\r\n\r\n                </div>\r\n\r\n                <div class=\"edit-save\" v-on:click=\"editSave\">保存</div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!--知识点-->\r\n    <div v-bind:class=\"{ none: hideKnpLayer, 'edit-layer':true, 'anim-opacity2': !hideKnpLayer, 'knp-layer' : true}\" id=\"KnpLayer\">\r\n        <div class=\"top\">\r\n            添加知识点\r\n            <div class=\"icon-close\" v-on:click=\"hideKnp\">\r\n                <img src=\"/images/close.png\" alt=\"\">\r\n            </div>\r\n        </div>\r\n        <div class=\"edit-wrap\">\r\n            <div class=\"edit-panel\">\r\n                <div class=\"selects\">\r\n                    <select class=\"select\" v-model=\"knpFilter.edition\" v-on:change=\"updateCourseBook\">\r\n                        <option value=\" \">选择教材版本</option>\r\n                        <option value=\"KX\">开心版</option>\r\n                        <option value=\"RJ\">人教版</option>\r\n                        <option value=\"BS\">北师大版</option>\r\n                        <option value=\"YW\">语文版</option>\r\n                        <option value=\"WY\">外研版</option>\r\n                        <option value=\"YH\">粤沪版</option>\r\n                        <option value=\"YJ\">粤教版</option>\r\n                        <option value=\"KY\">科粤版</option>\r\n                        <option value=\"ZT\">中图版</option>\r\n                        <option value=\"CJ\">川教版</option>\r\n                        <option value=\"XJ\">湘教版</option>\r\n                        <option value=\"YR\">粤人民版</option>\r\n                        <option value=\"QT\">其他（包含总复习、专项类书籍，此类书籍无教材版本限制）</option>\r\n                    </select>\r\n                    <select class=\"select\" v-model=\"knpFilter.cb\" v-on:change=\"updateCourseBook\">\r\n                        <option value=\" \">选择册别</option>\r\n                        <option value=\"01\">上册</option>\r\n                        <option value=\"02\">下册</option>\r\n                        <option value=\"03\">综合</option>\r\n                        <option value=\"04\">全一册</option>\r\n                    </select>\r\n                    <template v-if=\"courseBook && courseBook.length\">\r\n                        <select class=\"select\" v-on:change=\"updateChapters\" v-model=\"coursebookId\">\r\n                            <option value=\" \">选择教材</option>\r\n                            <option v-for=\"item in courseBook\" :value=\"item.textbookId\">{{item.name}}</option>\r\n                        </select>\r\n                    </template>\r\n                </div>\r\n                <div class=\"add-all\">\r\n                    <input style=\"margin-right:5px\" type=\"checkbox\" name=\"checkbox1\" value=\"true\" v-model=\"isAddAll\"/><span style=\"color: #ff920b\">其他题目同选一样的知识点</span> <span style=\"color: #c6c6c6\">(还没选择知识点的题目)</span>\r\n                </div>\r\n                <div class=\"add-all\">\r\n                    <input style=\"margin-right:5px;width: 456px\" type=\"text\"  v-model=\"searchText\"/>输入关键字搜索\r\n                    <!--<div class=\"search-btn\" v-on:click=\"searchKnp\">搜索</div>-->\r\n                </div>\r\n                <div class=\"chapter\" v-if=\"chapterListForRender\">\r\n                    <template v-for=\"item in chapterListForRender\">\r\n                            <div class=\"list level1\" :data-id=\"item.id\" v-bind:class=\"{fold: !item.unFold}\">\r\n                                <span class=\"level1\">{{item.name}}</span>\r\n\r\n                                <template v-for=\"item2 in item.son\">\r\n                                    <div class=\"list level2\" :data-id=\"item2.id\" v-bind:class=\"{fold: !item2.unFold}\">\r\n                                        <span class=\"level2\">{{item2.name}}</span>\r\n\r\n                                        <template v-for=\"item3 in item2.son\">\r\n                                            <div class=\"list level3\" :data-id=\"item3.id\" v-bind:class=\"{fold: !item3.unFold}\">\r\n                                                <span class=\"level3\">{{item3.name}}</span>\r\n\r\n                                                <template v-for=\"item4 in item3.son\" >\r\n                                                    <div class=\"list level4\" :data-id=\"item4.id\" v-bind:class=\"{fold: !item4.unFold}\">\r\n                                                        <span class=\"level4\">{{item4.name}}</span>\r\n                                                    </div>\r\n\r\n                                                    <template v-for=\"knp4 in item4.knpList\" v-bind:class=\"{selected: searchText && knp4.knpName.indexOf(searchText) > -1, chosen: selectedKplList.indexOf(JSON.stringify(knp4)) > -1}\">\r\n                                                        <div class=\"knp-checkbox\">\r\n                                                            <input type=\"checkbox\" name=\"checkbox1\" :value=\"JSON.stringify(knp4)\" v-model=\"selectedKplList\"/>{{knp4.knpName}}\r\n                                                        </div>\r\n                                                    </template>\r\n                                                </template>\r\n\r\n                                                <template v-for=\"knp3 in item3.knpList\">\r\n                                                    <div class=\"knp-checkbox\" v-bind:class=\"{selected: searchText && knp3.knpName.indexOf(searchText) > -1, chosen: selectedKplList.indexOf(JSON.stringify(knp3)) > -1}\">\r\n                                                        <input type=\"checkbox\" name=\"checkbox1\" :value=\"JSON.stringify(knp3)\" v-model=\"selectedKplList\"/>{{knp3.knpName}}\r\n                                                    </div>\r\n                                                </template>\r\n\r\n                                            </div>\r\n                                        </template>\r\n\r\n                                        <template v-for=\"knp2 in item2.knpList\" v-bind:class=\"{selected: searchText && knp2.knpName.indexOf(searchText) > -1, chosen: selectedKplList.indexOf(JSON.stringify(knp2)) > -1}\">\r\n                                            <div class=\"knp-checkbox\">\r\n                                                <input type=\"checkbox\" name=\"checkbox1\" :value=\"JSON.stringify(knp2)\" v-model=\"selectedKplList\"/>{{knp2.knpName}}\r\n                                            </div>\r\n                                        </template>\r\n\r\n                                    </div>\r\n                                </template>\r\n\r\n                                <template v-for=\"knp in item.knpList\" >\r\n                                    <div class=\"knp-checkbox\" v-bind:class=\"{selected: searchText && knp.knpName.indexOf(searchText) > -1 , chosen: selectedKplList.indexOf(JSON.stringify(knp)) > -1}\">\r\n                                        <input type=\"checkbox\" name=\"checkbox1\" :value=\"JSON.stringify(knp)\" v-model=\"selectedKplList\"/>{{knp.knpName}}\r\n                                    </div>\r\n                                </template>\r\n                            </div>\r\n                    </template>\r\n                </div>\r\n                <div class=\"no-knp\" v-else >暂无知识点，请重新选择教材！</div>\r\n\r\n            </div>\r\n            <div  class=\"save-wrapper\">\r\n                <div class=\"edit-save\" v-on:click=\"knpSave\">保存</div>\r\n            </div>\r\n\r\n        </div>\r\n\r\n    </div>\r\n    <!--添加上方文本-->\r\n    <div v-bind:class=\"{ none: hideAddShareLayer, 'edit-layer':true, 'anim-opacity2': !hideAddShareLayer}\" id=\"addShareLayer\">\r\n        <div class=\"top\">\r\n            编辑上方文本\r\n            <div class=\"icon-close\" v-on:click=\"hideAddShare\">\r\n                <img src=\"/images/close.png\" alt=\"\">\r\n            </div>\r\n        </div>\r\n        <div class=\"edit-wrap\">\r\n            <div class=\"edit-panel\">\r\n                <div class=\"edit-row\">\r\n                    <div class=\"uEditor-area\">\r\n                        <script id=\"container3\" name=\"content\" type=\"text/plain\"></script>\r\n                    </div>\r\n                </div>\r\n                <div class=\"edit-save\" v-on:click=\"addShareSave\">保存</div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n\r\n</div>";

	/***/
},
/* 11 */
/***/function (module, exports) {

	/**
  * Created by jie on 2017/10/15.
  */
	module.exports = {
		GetQueryString: function GetQueryString(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		log: function log(msg) {
			if (location.href.indexOf('debug') != -1) {
				console.log(msg);
			}
		}

		/***/ };
},
/* 12 */
/***/function (module, exports, __webpack_require__) {

	/**
  * Created by jie on 2017/10/16.
  */
	var tpl = __webpack_require__(13);
	var store = __webpack_require__(2);
	var util = __webpack_require__(11);
	module.exports = {
		template: tpl,
		store: store,
		data: function data() {
			return {
				show: false
			};
		},

		mounted: function mounted() {
			var that = this;
			console.log('loading layer mounted');
		},

		methods: {},
		computed: {}
	};

	/***/
},
/* 13 */
/***/function (module, exports) {

	module.exports = "<div>\r\n    <div class=\"none load4 load-container\">\r\n        <div class=\"loader\">Loading...</div>\r\n    </div>\r\n</div>";

	/***/
},
/* 14 */
/***/function (module, exports, __webpack_require__) {

	/**
  * Created by jie on 2017/10/16.
  */
	var tpl = __webpack_require__(15);
	var store = __webpack_require__(2);
	var util = __webpack_require__(11);
	module.exports = {
		template: tpl,
		store: store,
		data: function data() {
			return {
				display: '',
				basic: false,
				strenthen: false,
				improve: false,
				selectionNums: 7
			};
		},
		props: ['orderBy', 'isShowMarks'],
		mounted: function mounted() {
			var that = this;
			this.updateShow();
		},
		updated: function updated() {},

		methods: {
			updateShow: function updateShow() {
				var type = this.editingStem.qtypeInner;
				var difficulty = this.editingStem.difficulty;
				if (type == 1 || type == 2) {
					this.display = '';
				} else {
					this.display = 'none';
				}
			},
			typeChange: function typeChange() {
				//console.log(this.orderBy, 'change')
				var type = this.editingStem.qtypeInner;
				if (type == 1 || type == 2) {
					this.display = '';

					this.editingStem.answerCount = 4;
				} else {
					this.display = 'none';
					this.editingStem.answerCount = '';
				}

				this.editingStem.score = this.editingStem.score || 0;

				this.commitChange();
			},
			change: function change() {
				console.log(this.orderBy, 'change');
				var type = this.editingStem.qtypeInner;
				if (type == 1 || type == 2) {
					this.display = '';
				} else {
					this.display = 'none';
					this.editingStem.answerCount = '';
				}

				this.editingStem.score = this.editingStem.score || 0;

				this.commitChange();
			},
			deleteKnp: function deleteKnp(index) {
				this.editingStem.knpList.splice(index, 1);
				this.commitChange();
			},
			answerClick: function answerClick(e) {
				var $this = $(e.target);
				if (this.editingStem.qtypeInner == 1) {
					$this.toggleClass('selected');
					$this.siblings().removeClass('selected');
				} else if (this.editingStem.qtypeInner == 2) {
					$this.toggleClass('selected');
				}
				var arr = [];
				$this.parent().find('.answer-item').forEach(function (v, i) {
					if ($(v).hasClass('selected')) {
						arr.push($(v).text());
					}
				});
				var answer = arr.join(',');
				if (answer) {
					this.editingStem.answer = answer;
				}
				this.commitChange();
			},
			difficultyClick: function difficultyClick(e) {
				var $this = $(e.target);
				var difficulty = $this.attr('data-difficulty');

				if ($this.hasClass('selected')) return;

				$this.toggleClass('selected');
				$this.siblings().removeClass('selected');

				this.editingStem.difficulty = difficulty;
				this.commitChange();
			},
			commitChange: function commitChange() {
				util.log(this.editingStem);
				this.showLoading();
				this.$store.dispatch('EDIT_SAVE', this.editingStem);
			},
			edit: function edit() {
				this.$emit('editLinkClick');
			},
			knpEdit: function knpEdit() {
				this.$emit('knpLinkClick');
			},
			showLoading: function showLoading() {
				$('.load-container').removeClass('none');
			},
			hideLoading: function hideLoading() {
				$('.load-container').addClass('none');
			}
		},
		filters: {
			textlize: function textlize(value) {
				if (value) {
					return $('<div>' + value + '</div>')[0].innerText;
				} else {
					return '';
				}
			}
		},
		computed: {
			editingStem: function editingStem() {
				return $.extend({}, this.$store.state.qListForRender[this.orderBy - 1]);
			},
			selectionArr: function selectionArr() {
				var arr = {};

				if (this.selectionNums) {
					arr['0'] = '选项个数';
					var i = 2;
					while (i <= this.selectionNums) {
						arr[i] = i;
						i++;
					}
				}
				return arr;
			}
		},
		watch: {}
	};

	/***/
},
/* 15 */
/***/function (module, exports) {

	module.exports = "<div :data-index=\"orderBy\" class=\"edit-item animate-show\">\r\n    <div class=\"edit-row\">\r\n        <strong>第{{orderBy}}题</strong>\r\n        <div class=\"inline\">\r\n            <span><i>*</i>题型</span>\r\n            <select v-model=\"editingStem.qtypeInner\" class=\"select\" v-on:change=\"typeChange\">\r\n                <option value=\"null\">选择题型</option>\r\n                <option value=\"1\">单选题</option>\r\n                <option value=\"2\">多选题</option>\r\n                <option value=\"3\">填空题</option>\r\n                <option value=\"4\">简答题</option>\r\n            </select>\r\n        </div>\r\n\r\n        <div class=\"inline\" v-if=\"editingStem.qtypeInner==1||editingStem.qtypeInner==2\">\r\n            <span><i>*</i>选项</span>\r\n            <select v-model=\"editingStem.answerCount\" class=\"select\" v-on:change=\"change\">\r\n                <template v-for=\"item,key in selectionArr\">\r\n                    <option :value=\"key\">{{item}}</option>\r\n                </template>\r\n            </select>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"edit-row\">\r\n\r\n        <span><i>*</i>难度</span>\r\n        <div v-if=\"editingStem.difficulty==0.8\" class=\"difficulty\" v-on:click=\"difficultyClick\">\r\n            <div class=\"selected\" data-difficulty=\"0.8\">基础</div>\r\n            <div data-difficulty=\"0.5\">巩固</div>\r\n            <div data-difficulty=\"0.3\">提高</div>\r\n        </div>\r\n        <div v-else-if=\"editingStem.difficulty==0.5\" class=\"difficulty\" v-on:click=\"difficultyClick\">\r\n            <div data-difficulty=\"0.8\">基础</div>\r\n            <div class=\"selected\" data-difficulty=\"0.5\">巩固</div>\r\n            <div data-difficulty=\"0.3\">提高</div>\r\n        </div>\r\n        <div v-else-if=\"editingStem.difficulty==0.3\" class=\"difficulty\" v-on:click=\"difficultyClick\">\r\n            <div data-difficulty=\"0.8\">基础</div>\r\n            <div data-difficulty=\"0.5\">巩固</div>\r\n            <div class=\"selected\" data-difficulty=\"0.3\">提高</div>\r\n        </div>\r\n        <div v-else class=\"difficulty\" v-on:click=\"difficultyClick\">\r\n            <div data-difficulty=\"0.8\">基础</div>\r\n            <div data-difficulty=\"0.5\">巩固</div>\r\n            <div data-difficulty=\"0.3\">提高</div>\r\n        </div>\r\n\r\n    <template v-if=\"isShowMarks\">\r\n        <span><i>&nbsp</i>分值</span>\r\n        <input class=\"input\" type=\"text\" v-model=\"editingStem.score\" v-on:change=\"change\">\r\n    </template>\r\n    </div>\r\n    <div class=\"edit-row\">\r\n        <span><i>*</i>知识点</span>\r\n        <div class=\"knowledge\">\r\n            <div class=\"wrap\">\r\n\r\n                <template v-for=\"(item,index) in editingStem.knpList\" >\r\n                    <div class=\"item\" >{{item.knpName}}<img style=\"float: right;\" src=\"/images/delete.png\" alt=\"\" v-on:click=\"deleteKnp(index)\"></div>\r\n                </template>\r\n                <div v-on:click=\"knpEdit\" class=\"item add\">\r\n                    <img  src=\"/images/add.png\" alt=\"\" >\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"edit-row\">\r\n        <span><i v-if=\"editingStem.qtypeInner == 1 || editingStem.qtypeInner == 2\">*</i>答案</span>\r\n        <template v-if=\"editingStem.qtypeInner == 1 || editingStem.qtypeInner == 2\">\r\n        <div class=\"answer answer-tag\" v-on:click=\"answerClick\">\r\n            <template v-for=\"selection in editingStem.answerCountArray\">\r\n                <div  v-if=\"editingStem.answer.indexOf(selection)!=-1\" class=\"answer-item selected\">{{selection}}</div>\r\n                <div  v-if=\"editingStem.answer.indexOf(selection) == -1\" class=\"answer-item\">{{selection}}</div>\r\n            </template>\r\n        </div>\r\n        </template>\r\n        <template v-if=\"editingStem.qtypeInner != 1 && editingStem.qtypeInner != 2\">\r\n            <span class=\"short-answer\" v-if=\"editingStem.answer\">{{editingStem.answer | textlize}}</span>\r\n            <span v-else class=\"add-answer\" v-on:click=\"edit\"><img src=\"/images/add2.png\" alt=\"\"> 添加答案 </span>\r\n            <!--<span class=\"short-answer\" v-if=\"!editingStem.answer\">{{editingStem.answer | textlize}}</span>-->\r\n        </template>\r\n        <div class=\"edit-link\" v-on:click=\"edit\">\r\n            【编辑题目】\r\n        </div>\r\n    </div>\r\n</div>\r\n";

	/***/
},
/* 16 */
/***/function (module, exports, __webpack_require__) {

	var store = __webpack_require__(2);
	var tpl = __webpack_require__(17);
	var loadingLayer = __webpack_require__(12);
	var getPageInfo = __webpack_require__(18);
	var pdfHost = window.pdfHost || 'http://211.159.185.181:8180';
	var formData = new FormData();
	function generatePdf() {
		var element = $('.page-Wrap')[0];
		html2pdf(element, {
			margin: 0,
			filename: 'myfile.pdf',
			image: { type: 'jpeg', quality: 1 },
			html2canvas: { dpi: 192, letterRendering: true },
			jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
			formData: formData
		});
	}

	function sendPdf(id, info) {
		console.log(info);
		var defer = $.Deferred();
		formData.append('info', JSON.stringify(info));
		formData.append('bookId', id);
		formData.get('pdfFile');
		$.ajax({
			url: pdfHost + '/api/zytpl/generatePagerTpl',
			type: 'POST',
			data: formData,
			//async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function success(returndata) {
				defer.resolve(returndata);
			},
			error: function error(returndata) {
				console.log(returndata);
				defer.reject(returndata);
			}
		});
		return defer;
	}
	module.exports = {
		template: tpl,
		store: store,
		data: function data() {
			return {};
		},
		mounted: function mounted() {
			//this.change();
			var that = this;
			scrollTo(0, 0);
			if (!this.previewHtml) {
				location.href = location.href.replace('#/preview', '#/edit');
				return;
			}
			generatePdf();
			var info = [];
			$.each($('.preview-area').find('.page'), function (i, v) {
				info = info.concat(getPageInfo(v));
			});
			$('.back').click(function () {
				location.reload();
			});
			$('.generate').click(function () {
				var flag = window.confirm('生成后将不能再编辑，是否继续生成？');
				if (flag) {
					that.showLoading();
					sendPdf(that.currentBookId, info).done(function (returndata) {
						console.log(returndata);
						that.hideLoading();
						var json = JSON.parse(returndata);
						if (json.rtnCode == 0 && json.bizData && json.bizData.pdfUrl) {
							that.$store.commit('SET_DOWNLOAD_LINK', json.bizData.pdfUrl);
							location.href = location.href.replace('#/preview', '#/download');
						} else {
							alert(json.msg);
						}
					}).fail(function (returndata) {
						that.hideLoading();
						alert('生成失败');
					});
				}
			});
		},
		updated: function updated() {
			console.log('updated');
		},
		methods: {
			showLoading: function showLoading() {
				$('.load-container').removeClass('none');
			},
			hideLoading: function hideLoading() {
				$('.load-container').addClass('none');
			}
		},
		computed: {
			previewHtml: function previewHtml() {
				return this.$store.state.previewHtml;
			},
			currentBookId: function currentBookId() {
				return this.$store.state.currentBookId;
			}
		},
		components: {
			'loading-layer': loadingLayer
		}
	};

	/***/
},
/* 17 */
/***/function (module, exports) {

	module.exports = "<div>\r\n    <!--步骤栏-->\r\n    <div class=\"top-bar\">\r\n        <div class=\"box\">第1步：新建作业 </div>\r\n        <div class=\"arrow current\"></div>\r\n\r\n        <div class=\"box\">第2步：作业编辑 </div>\r\n        <div class=\"arrow current\"></div>\r\n\r\n        <div class=\"box current\">第3步：作业预览 </div>\r\n        <div class=\"arrow \"></div>\r\n\r\n        <div class=\"box \">第4步：生成作业</div>\r\n    </div>\r\n    <!--预览区域-->\r\n    <div class=\"preview-area\">\r\n        <div class=\"page-Wrap\" v-html=\"previewHtml\">\r\n\r\n        </div>\r\n    </div>\r\n    <loading-layer></loading-layer>\r\n    <div class=\"preview-bar \">\r\n        <div class=\"preview-btn back\">返回修改</div>\r\n        <div class=\"preview-btn generate\">生成作业</div>\r\n    </div>\r\n</div>";

	/***/
},
/* 18 */
/***/function (module, exports) {

	/**
  * Created by lomoliang on 2017/10/18.
  *
  * 获取坐标
  */

	var ratio = 1.876;
	var kk = 150;
	var map = {};
	var zuid = 1;
	function getBind(qId) {
		if (!map[qId]) {
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
	function wrapperArea($dom, zuid, params) {
		var $dom = $($dom);
		params = params || {
			pageId: 1,
			x: 0,
			y: 0
		};
		return {
			"zuStyleName": "特征区域",
			"zuid": zuid,
			"zumem": 1,
			"zustyle": 14,
			"pageid": params.pageId,
			"area": [{
				"area0": {
					"height": $dom.offset().height * ratio,
					"pix": 0,
					"TValue": 0,
					"width": $dom.offset().width * ratio,
					"x": ($dom.offset().left - params.x) * ratio,
					"y": ($dom.offset().top - params.y) * ratio
				}
			}],
			"quesid": [{
				"val": zuid
			}]
		};
	}
	/**
  * 点位点
  * @param $dom
  * @param zuid
  * @param params
  * @returns {{zuStyleName: string, zuid: *, zumem: number, zustyle: number, pageid: *, area: *[]}}
  */
	function setPointer($dom, zuid, params) {
		var $dom = $($dom);

		return {
			"zuStyleName": "定位点",
			"zuid": zuid,
			"zumem": 1,
			"zustyle": 0,

			"pageid": params.pageId,

			"area": [{
				"area0": {
					"height": $dom.offset().height * ratio,
					"pix": 0.1 * $dom.offset().height * $dom.offset().width * ratio * ratio,
					"TValue": 190,
					"width": $dom.offset().width * ratio,
					"x": ($dom.offset().left - params.x) * ratio,
					"y": ($dom.offset().top - params.y) * ratio
				}
			}]
		};
	}
	/**
  * 客观题选区
  * @param $dom
  * @param zuid
  * @param params
  * @returns {{zuStyleName: string, zuid: *, zumem: number, zustyle: number, pageid: *, area: Array, questitle: *[], bindId: *[], omrRectType: number, quesid: *[]}}
  */
	function setChooseA($dom, zuid, params) {
		$dom = $($dom);
		if ($dom) {
			var arr = $($dom).find('.answerblock');
			var o = {};
			$.each(arr, function (i, v) {
				//console.log($(v).offset());
				o['area' + i] = {
					"height": $(v).offset().height * ratio,
					"pix": 0.1 * $(v).offset().height * $(v).offset().width * ratio * ratio,
					"TValue": 190,
					"width": $(v).offset().width * ratio,
					"x": ($(v).offset().left - params.x) * ratio,
					"y": ($(v).offset().top - params.y) * ratio
				};
			});
		}
		var order = $dom.attr('data-order');
		var qId = $dom.attr('data-qid');
		var type = $dom.attr('data-type');
		var area = [];
		area.push(o);
		return {
			"zuStyleName": "客观题选区",
			"zuid": zuid,
			"zumem": 1,
			"zustyle": type == 1 ? 7 : 12,

			"pageid": params.pageId,

			"area": area,

			"questitle": [{
				"val": "01-01-01-" + (order >= 10 ? order : '0' + order) //和题干同一个order
			}],
			"bindId": [{
				"val": getBind(qId) //客观题的zuid
			}],
			"omrRectType": 0,

			"quesid": [{
				"val": zuid
			}]
		};
	}
	/**
  * 客观题题干
  * @param $dom
  * @param params
  * @returns {{zuStyleName: string, zuid, zumem: number, zustyle: number, pageid: *, area: *[], questitle: *[], qId: *}}
  */
	function setChooseQ($dom, params) {
		var $dom = $($dom);
		var qId = $dom.attr('data-qid');
		var order = $dom.attr('data-order');
		return {
			"zuStyleName": "客观题题干",
			"zuid": getBind(qId),
			"zumem": 1,
			"zustyle": 13,

			"pageid": params.pageId,

			"area": [{
				"area0": {
					"height": $dom.offset().height * ratio,
					"pix": 0,
					"TValue": 0,
					"width": $dom.offset().width * ratio,
					"x": ($dom.offset().left - params.x) * ratio,
					"y": ($dom.offset().top - params.y) * ratio
				}
			}],

			"questitle": [{
				"val": "01-01-01-0" + order
			}],
			"qId": qId
		};
	}
	/**
  * 主观题题干
  * @param $dom
  * @param params
  * @returns {{zuStyleName: string, zuid, zumem: number, zustyle: number, pageid: *, area: *[], questitle: *[], qId: *}}
  */
	function setChooseQ2($dom, params) {
		var $dom = $($dom);
		var qId = $dom.attr('data-qid');
		var order = $dom.attr('data-order');
		return {
			"zuStyleName": "主观题题干",
			"zuid": getBind(qId),
			"zumem": 1,
			"zustyle": 8,
			"pageid": params.pageId,

			"area": [{
				"area0": {
					"height": $dom.offset().height * ratio,
					"pix": 0,
					"TValue": 0,
					"width": $dom.offset().width * ratio,
					"x": ($dom.offset().left - params.x) * ratio,
					"y": ($dom.offset().top - params.y) * ratio
				}
			}],

			"questitle": [{
				"val": "01-01-01-0" + order
			}],
			"qId": qId
		};
	}
	/**
  * 获取坐标
  * @param page
  */
	function getPageInfo(page) {
		var info = [];
		var $page = $(page);
		var params = {
			pageId: $page.attr('data-pageid'),
			x: $page.offset().left,
			y: $page.offset().top
		};
		//特征区域
		info.push(wrapperArea($page, zuid++, params));
		//定位点
		if (params.pageId == 1) {
			info.push(setPointer($page.find('.top-left'), zuid++, params));
			info.push(setPointer($page.find('.top-right'), zuid++, params));
			info.push(setPointer($page.find('.bottom-left'), zuid++, params));
		}
		//客观题选区
		if (params.pageId == 1) {
			$.each($page.find('.answerarea'), function (i, v) {
				info.push(setChooseA(v, zuid++, params));
			});
		}
		//题干区
		$.each($page.find('.stem'), function (i, v) {
			var type = $(v).attr('data-qtype');
			if (type == 1 || type == 2) {
				if ($(v).hasClass('none')) {
					//假如为答题卡模式 则选择客观题答题区作为题干
					var order = $(v).attr('data-order');
					var d = $('.fillArea').find('[data-order="' + order + '"]');
					info.push(setChooseQ(d, params));
				} else {
					info.push(setChooseQ(v, params));
				}
			} else {
				info.push(setChooseQ2(v, params));
			}
		});
		return info;
	}

	module.exports = getPageInfo;

	/***/
},
/* 19 */
/***/function (module, exports, __webpack_require__) {

	var store = __webpack_require__(2);
	var tpl = __webpack_require__(20);

	module.exports = {
		template: tpl,
		store: store,
		data: function data() {
			return {};
		},
		mounted: function mounted() {
			var that = this;
			if (!that.link) {
				location.href = location.href.replace('#/download', '#/edit');
			}
			$('.download').on('click', function () {
				console.log(that.link);
				window.open(that.link);
			});
			$('.backList').on('click', function () {
				//这里修改返回列表链接
				var path = '/schoolWork/schoolWorkManage';
				location.href = path;
			});
		},
		updated: function updated() {
			console.log('updated');
		},
		methods: {},
		computed: {
			link: function link() {
				return this.$store.state.downloadLink;
			}
		}
	};

	/***/
},
/* 20 */
/***/function (module, exports) {

	module.exports = "<div>\r\n    <!--步骤栏-->\r\n    <div class=\"top-bar\">\r\n        <div class=\"box\">第1步：新建作业 </div>\r\n        <div class=\"arrow current\"></div>\r\n\r\n        <div class=\"box\">第2步：作业编辑 </div>\r\n        <div class=\"arrow current\"></div>\r\n\r\n        <div class=\"box \">第3步：作业预览 </div>\r\n        <div class=\"arrow current\"></div>\r\n\r\n        <div class=\"box current\">第4步：生成作业</div>\r\n    </div>\r\n    <div class=\"success\">生成成功!</div>\r\n    <div class=\"preview-bar \">\r\n        <div class=\"preview-btn backList\">返回作业列表</div>\r\n        <!--<div class=\"preview-btn dispatch\">布置作业</div>-->\r\n        <div class=\"preview-btn download\">下载pdf</div>\r\n    </div>\r\n</div>";

	/***/
}]
/******/);