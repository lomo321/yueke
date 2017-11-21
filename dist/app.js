'use strict';

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
  * Created by lomo on 2017/1/21.
  */
	var data = __webpack_require__(2);
	var dataArr = __webpack_require__(3);
	var tpl = __webpack_require__(4);
	var ajax = __webpack_require__(5);
	var ratio = 1.876;
	//console.log(tpl)
	console.log('hello world');
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
		0: 'A',
		1: 'B',
		2: 'C',
		3: 'D'
	};
	ajax.getAllQuestion('xiaoben06').done(function (result) {
		var json = JSON.parse(result);
		console.log(json);
		var dataArr = json.bizData.data;
		$.each(dataArr, function (i, v) {
			var data = v;
			var orderstr = '<div class="orderBy">第' + data.orderBy + '题</div>';
			var htmlstr;
			if (data.qtypeInner == 1 || data.qtypeInner == 2) {
				var s = '';
				for (var i = 0; i < data.answerCount; i++) {
					s += '<div class="fillArea-block">' + ABC[i] + '</div>';
				}
				var answer = '<div class="fillArea-answer"><span>' + data.orderBy + '</span>' + s + '</div>';
				$(answer).appendTo($('#fillArea'));
				htmlstr = '<div class="stem" data-qId="' + data.questionId + '" data-qType="' + data.qtypeInner + '">' + orderstr + '<p>' + data.stem + '</p></div>';
			} else {
				htmlstr = '<div class="stem" data-qId="' + data.questionId + '" data-qType="' + data.qtypeInner + '">' + orderstr + '<p>' + data.stem + '</p><div class="answer-area">我的作答</div></div>';
			}
			$(htmlstr).appendTo($('#test'));
		});
		$.each($('img'), function (i, v) {
			convertImgToBase64(v.src, function (base64) {
				//debugger
				v.src = base64;
			});
		});
	});
	function convertImgToBase64(url, callback, outputFormat) {
		var canvas = document.createElement('CANVAS'),
		    ctx = canvas.getContext('2d'),
		    img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = function () {
			canvas.height = img.height;
			canvas.width = img.width;
			ctx.drawImage(img, 0, 0);
			var dataURL = canvas.toDataURL(outputFormat || 'image/png');
			callback.call(this, dataURL);
			canvas = null;
		};
		img.src = url;
	}

	function test1() {
		var host = 'http://211.159.185.181:8180';
		var data = {
			info: JSON.stringify(getInfo()),
			htmls: JSON.stringify(getHtml()).replace(/\\n/g, "").replace(/\\"/g, "'"),
			bookId: 'xiaoben06'
		};
		console.log(data);
		$.ajax({
			url: host + '/api/zytpl/generatePagerTpl',
			data: data,
			type: 'POST',
			contentType: 'application/x-www-form-urlencoded;charset=utf-8 ',

			success: function success(result) {
				console.log(result);
			}
		});
	}

	function wrapperArea($dom, id) {
		var $dom = $($dom);
		return {
			"zuStyleName": "特征区域",
			"zuid": id,
			"zumem": 1,
			"zustyle": 14,

			"pageid": 1,

			"area": [{
				"area0": {
					"height": $dom.offset().height * ratio,
					"pix": 0,
					"TValue": 0,
					"width": $dom.offset().width * ratio,
					"x": $dom.offset().left * ratio,
					"y": $dom.offset().top * ratio
				}
			}],

			"quesid": [{
				"val": id
			}]
		};
	}
	function setPointer($dom, id) {
		var $dom = $($dom);

		return {
			"zuStyleName": "定位点",
			"zuid": id,
			"zumem": 1,
			"zustyle": 0,

			"pageid": 1,

			"area": [{
				"area0": {
					"height": $dom.offset().height * ratio,
					"pix": 0.1 * $dom.offset().height * $dom.offset().width * ratio * ratio,
					"TValue": 190,
					"width": $dom.offset().width * ratio,
					"x": $dom.offset().left * ratio,
					"y": $dom.offset().top * ratio
				}
			}]
		};
	}
	function setChooseQ($dom, zid, order, qid) {
		var $dom = $($dom);
		return {
			"zuStyleName": "客观题题干",
			"zuid": zid,
			"zumem": 1,
			"zustyle": 13,

			"pageid": 1,

			"area": [{
				"area0": {
					"height": $dom.offset().height * ratio,
					"pix": 0,
					"TValue": 0,
					"width": $dom.offset().width * ratio,
					"x": $dom.offset().left * ratio,
					"y": $dom.offset().top * ratio
				}
			}],

			"questitle": [{
				"val": "01-01-01-0" + order
			}],
			"qId": qid
		};
	}
	function setChooseQ2($dom, zid, order, qid) {
		var $dom = $($dom);
		return {
			"zuStyleName": "主观题题干",
			"zuid": zid,
			"zumem": 1,
			"zustyle": 8,
			"pageid": 1,

			"area": [{
				"area0": {
					"height": $dom.offset().height * ratio,
					"pix": 0,
					"TValue": 0,
					"width": $dom.offset().width * ratio,
					"x": $dom.offset().left * ratio,
					"y": $dom.offset().top * ratio
				}
			}],

			"questitle": [{
				"val": "01-01-01-0" + order
			}],
			"qId": qid || ''
		};
	}
	function setChooseA($dom, zid, order, bindId) {

		if ($dom) {
			var arr = $($dom).find('.fillArea-block');
			var o = {};
			$.each(arr, function (i, v) {
				//console.log($(v).offset());
				o['area' + i] = {
					"height": $(v).offset().height * ratio,
					"pix": 0.1 * $(v).offset().height * $(v).offset().width * ratio * ratio,
					"TValue": 190,
					"width": $(v).offset().width * ratio,
					"x": $(v).offset().left * ratio,
					"y": $(v).offset().top * ratio
				};
			});
		}
		var area = [];
		area.push(o);
		return {
			"zuStyleName": "客观题选区",
			"zuid": zid,
			"zumem": 1,
			"zustyle": 12,

			"pageid": 1,

			"area": area,

			"questitle": [{
				"val": "01-01-01-0" + order //和题干同一个order
			}],
			"bindId": [{
				"val": bindId //客观题的zuid
			}],
			"omrRectType": 0,

			"quesid": [{
				"val": zid + 1
			}]
		};
	}

	function getInfo() {
		var info = [];
		var zuid = 1;
		var k = 1;
		var j = 0;
		info.push(wrapperArea($('.page')[0], zuid++));
		info.push(setPointer($('.top-left'), zuid++));
		info.push(setPointer($('.top-right'), zuid++));
		info.push(setPointer($('.bottom-left'), zuid++));
		$.each($('.stem'), function (i, v) {
			console.log($(v).attr('data-qId'));
			var qId = $(v).attr('data-qId');
			if ($(v).attr('data-qtype') == 1 || $(v).attr('data-qtype') == 2) {
				info.push(setChooseA($('.fillArea-answer')[j++], zuid++, k, zuid));
				info.push(setChooseQ($(v), zuid++, k++, qId));
			} else {
				info.push(setChooseQ2($(v), zuid++, k++, qId));
			}
		});
		//info.push(setChooseQ($('.stem'),5,1))
		//info.push(setChooseA($('.fillArea-answer')[0],6,1,5))
		return info;
	}
	function getHtml() {
		var htmls = [];
		var html = '<body>' + document.body.innerHTML + '</body>'.replace(/[\r\n]/g, "");
		console.log(html);
		htmls.push(html);

		return htmls;
	}
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
	function testPdf() {
		formData.append('info', JSON.stringify(getInfo()));
		console.log(getInfo());
		formData.append('bookId', 'xiaoben06');
		var host = 'http://211.159.185.181:8180';
		formData.get('pdfFile');
		$.ajax({
			url: host + '/api/zytpl/generatePagerTpl',
			type: 'POST',
			data: formData,
			//async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function success(returndata) {
				console.log(returndata);
			},
			error: function error(returndata) {
				console.log(returndata);
			}
		});
	}
	function getSchoolWork(id) {
		var host = 'http://211.159.185.181:8080';
		var data = {
			'schoolworkId': id || '1'
		};
		$.ajax({
			url: host + '/schoolwork/getNormalQuestion?ajax=true',
			data: JSON.stringify(data),
			type: 'POST',
			contentType: 'application/json;charset=utf-8 ',
			processData: false,
			success: function success(result) {
				console.log(result);
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
	window.getHtml = getHtml;

	/***/
},
/* 2 */
/***/function (module, exports) {

	module.exports = {
		schoolWorkId: 1,
		questionId: 1219,
		orderBy: 1,
		stem: '如图，<em>CE</em>是△<em>ABC</em>的外角∠<em>ACD</em>的平分线，若∠<em>B</em>＝35°，∠<em>ACE</em>＝60°，则∠<em>A</em>＝(　　) <br/><img width="239" height="104" class="kfformula" src="../img/image6.png" style="max-width:100%;"/><br/>',
		score: 10,
		qtypeInner: 1, //单选1，多选2，简答 4
		answerCount: 4,
		answer: 'A,B,C'
	};

	/***/
},
/* 3 */
/***/function (module, exports) {

	/**
  * Created by lomoliang on 2017/9/27.
  */
	module.exports = [{
		schoolWorkId: 1,
		questionId: 1,
		orderBy: 1,
		stem: '如图，<em>CE</em>是△<em>ABC</em>的外角∠<em>ACD</em>的平分线，若∠<em>B</em>＝35°，∠<em>ACE</em>＝60°，则∠<em>A</em>＝(　　) <br/><img width="239" height="104" class="kfformula" src="../img/image6.png" style="max-width:100%;"/><br/>',
		score: 10,
		qtypeInner: 1, //单选1，多选2，简答 4
		answerCount: 4,
		answer: 'A,B,C'
	}, {
		schoolWorkId: 1,
		questionId: 1,
		orderBy: 2,
		stem: '如图，<em>CE</em>是△<em>ABC</em>的外角∠<em>ACD</em>的平分线，若∠<em>B</em>＝35°，∠<em>ACE</em>＝60°，则∠<em>A</em>＝(　　) <br/><img width="239" height="104" class="kfformula" src="../img/image6.png" style="max-width:100%;"/><br/>',
		score: 10,
		qtypeInner: 1, //单选1，多选2，简答 4
		answerCount: 4,
		answer: 'A,B,C'
	}, {
		schoolWorkId: 1,
		questionId: 1,
		orderBy: 3,
		stem: '如图，<em>CE</em>是△<em>ABC</em>的外角∠<em>ACD</em>的平分线，若∠<em>B</em>＝35°，∠<em>ACE</em>＝60°，则∠<em>A</em>＝(　　) <br/><img width="239" height="104" class="kfformula" src="../img/image6.png" style="max-width:100%;"/><br/>',
		score: 10,
		qtypeInner: 1, //单选1，多选2，简答 4
		answerCount: 4,
		answer: 'A,B,C'
	}, {
		schoolWorkId: 1,
		questionId: 1,
		orderBy: 4,
		stem: '如图，<em>CE</em>是△<em>ABC</em>的外角∠<em>ACD</em>的平分线，若∠<em>B</em>＝35°，∠<em>ACE</em>＝60°，则∠<em>A</em>＝(　　) <br/><img width="239" height="104" class="kfformula" src="../img/image6.png" style="max-width:100%;"/><br/>',
		score: 10,
		qtypeInner: 1, //单选1，多选2，简答 4
		answerCount: 4,
		answer: 'A,B,C'
	}];

	/***/
},
/* 4 */
/***/function (module, exports) {

	module.exports = "<body>\r\n<style>a, ins {\r\n    text-decoration: none\r\n}\r\n\r\nfieldset, img, legend {\r\n    border: 0\r\n}\r\n\r\na:active, input:focus, select:focus, textarea:focus {\r\n    outline: 0\r\n}\r\n\r\na, html, input:focus, select:focus, textarea:focus {\r\n    -webkit-tap-highlight-color: transparent\r\n}\r\n\r\nhtml {\r\n    -webkit-text-size-adjust: 100%;\r\n    -ms-text-size-adjust: 100%;\r\n    height: 1052.5px;\r\n    width: 743.5px\r\n}\r\n\r\narticle, aside, blockquote, body, button, code, dd, div, dl, dt, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, input, legend, li, menu, nav, ol, p, pre, section, td, textarea, th, ul {\r\n    margin: 0;\r\n    padding: 0\r\n}\r\n\r\n*, :after, :before {\r\n    -webkit-box-sizing: border-box\r\n}\r\n\r\nbody {\r\n    font-family: \"Helvetica Neue\", Helvetica, STHeiTi, sans-serif;\r\n    line-height: 1.5;\r\n    font-size: 14px;\r\n    color: #000;\r\n    background-color: #f1f3f9\r\n}\r\n\r\nh1, h2, h3, h4, h5, h6 {\r\n    font-weight: 400;\r\n    font-size: 100%\r\n}\r\n\r\na {\r\n    background: 0 0;\r\n    -webkit-touch-callout: none;\r\n    color: #157efb\r\n}\r\n\r\nli {\r\n    list-style: none\r\n}\r\n\r\nb, strong {\r\n    font-weight: 700\r\n}\r\n\r\nsvg:not(:root) {\r\n    overflow: hidden\r\n}\r\n\r\nhr {\r\n    height: 0\r\n}\r\n\r\npre {\r\n    overflow: auto\r\n}\r\n\r\nlegend {\r\n    padding: 0\r\n}\r\n\r\ntable {\r\n    border-collapse: collapse;\r\n    border-spacing: 0\r\n}\r\n\r\nem, i {\r\n    font-style: normal\r\n}\r\n\r\ndel {\r\n    text-decoration: line-through\r\n}\r\n\r\nbutton, input, optgroup, option, select, textarea {\r\n    font: inherit;\r\n    outline: 0;\r\n    border: 0;\r\n    -webkit-box-sizing: content-box\r\n}\r\n\r\n.head, body {\r\n    box-sizing: border-box\r\n}\r\n\r\nbutton, input[type=button], input[type=reset], input[type=submit] {\r\n    -webkit-tap-highlight-color: transparent;\r\n    -webkit-appearance: none;\r\n    background: 0 0\r\n}\r\n\r\ninput[type=search], input[type=search]::-webkit-search-cancel-button, input[type=search]::-webkit-search-decoration {\r\n    -webkit-appearance: none\r\n}\r\n\r\ninput::-webkit-input-placeholder, textarea::-webkit-input-placeholder {\r\n    color: #b0bac6\r\n}\r\n\r\nem {\r\n    color: #ff862b\r\n}\r\n\r\nbody, html {\r\n    background: #fff\r\n}\r\n\r\nbody {\r\n    height: 100%;\r\n    width: 100%;\r\n    border: 1px solid #000\r\n}\r\n\r\n.head {\r\n    border: 1px dotted #000;\r\n    width: 85%;\r\n    margin: 20px auto;\r\n    height: 100px\r\n}\r\n\r\n.answer, .stem {\r\n    width: 85%;\r\n    margin: auto auto 20px;\r\n    box-sizing: border-box;\r\n    border: 1px solid #000\r\n}\r\n\r\n.answer {\r\n    position: relative;\r\n    min-height: 30px\r\n}\r\n\r\n.bottom-left, .top-left, .top-right {\r\n    position: absolute\r\n}\r\n\r\n.block {\r\n    width: 20px;\r\n    height: 10px;\r\n    background: #000\r\n}\r\n\r\n.top-left {\r\n    top: 0;\r\n    left: 0\r\n}\r\n\r\n.top-right {\r\n    top: 0;\r\n    right: 0\r\n}\r\n\r\n.bottom-left {\r\n    bottom: 0;\r\n    left: 0\r\n}\r\n\r\n.fillArea {\r\n    box-sizing: border-box;\r\n    border: 1px solid #000;\r\n    width: 90%;\r\n    margin: 15px auto;\r\n    overflow: hidden\r\n}\r\n\r\n.fillArea-answer {\r\n    box-sizing: content-box;\r\n    border: 1px solid #000;\r\n    height: 10px;\r\n    margin-right: 50px;\r\n    margin-bottom: 10px;\r\n    float: left;\r\n    font-size: 8px;\r\n    line-height: 8px\r\n}\r\n\r\n.fillArea-block {\r\n    width: 20px;\r\n    height: 10px;\r\n    background: #bf6a40;\r\n    display: inline-block;\r\n    margin-left: 3px\r\n}</style>\r\n<div id=\"head\" class=\"head\">头部区域</div>\r\n<div class=\"answer\">\r\n    <div class=\"block top-left\"></div>\r\n    <div class=\"block top-right\"></div>\r\n    <div class=\"block bottom-left\"></div>\r\n    <div class=\"fillArea\" id=\"fillArea\">\r\n        <div class=\"fillArea-answer\"><span>1</span>\r\n            <div class=\"fillArea-block\">a</div>\r\n            <div class=\"fillArea-block\">a</div>\r\n            <div class=\"fillArea-block\">a</div>\r\n            <div class=\"fillArea-block\">a</div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div id=\"test\">\r\n    <div class=\"stem\">\r\n        <div class=\"orderBy\">第1题</div>\r\n        <p>如图，<em>CE</em>是△<em>ABC</em>的外角∠<em>ACD</em>的平分线，若∠<em>B</em>＝35°，∠<em>ACE</em>＝60°，则∠<em>A</em>＝(　　)\r\n            <br><img width=\"239\" height=\"104\" class=\"kfformula\" src=\"http://filenocdn.yueke100.net/tk/pic/editor/357554448299458560/image6.png\" style=\"max-width:100%;\"><br></p></div>\r\n</div>\r\n</body>";

	/***/
},
/* 5 */
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
}]
/******/);