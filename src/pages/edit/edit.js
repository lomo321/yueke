/**
 * 作业编辑页
 * @type {Vuex.Store|*|exports|module.exports}
 */


var store = require('../../store/store.js');
var tpl = require('./edit.tpl');
var editLayer = require('../../component/editLayer/editLayer.js');
var loadingLayer = require('../../component/loadingLayer/loadingLayer.js');
var editTag = require('../../component/editTag/editTag.js');
var util = require('../../util/util.js');

module.exports = {
    template: tpl,
    store,
    data: function () {
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
            pageNum:0
        }
    },
    mounted: function () {
        var that = this;
        scrollTo(0, 0);
        util.log('edit page mounted');

        this.textbookId = util.GetQueryString('id') || 'xiaoben06';
        util.log('textbookId', this.textbookId)

        //控制顶部栏固定
        var scTop = $('#create-bar').offset().height
        document.onscroll = function () {
            var top = document.body.scrollTop
            if (top > scTop) {
                $('#create-bar').css({
                    top: top + 'px'
                })
            } else {
                $('#create-bar').css({
                    top: ''
                })
            }
        };

        //鼠标悬停在题干时显示编辑浮层
        $('.edit-page')
            .on('mouseenter', '.stem', function () {
                //记录当前悬停区的题号及题目id
                that.hoverInfo['order'] = $(this).attr('data-order');
                that.hoverInfo['qid'] = $(this).attr('data-qid');
                $('.hover-layer').css({
                    top: $(this).offset().top,
                    left: $(this).offset().left,
                    height: $(this).height(),
                    width: $(this).width()
                }).removeClass('none')
            });

        //为悬停浮层绑定点击事件
        $('.hover-layer')
            .on('mouseleave', function () {
                $(this).addClass('none')
            })
            .on('click', function () {
                $(this).addClass('none')
                that.$store.commit('SET_SCROLL_TOP',that.getScrollTop());
                that.$store.commit('SHOW_LOADING');

            })
            .on('click', '.hover-edit', function () {
                that.editStem(that.hoverInfo['order']);                           
                // $("#editLayer .edit-wrap").scrollTop(0);
                                     
            })
            .on('click', '.hover-insert', function () {
                that.addQuestion({order: that.hoverInfo['order']});
            })
            .on('click', '.hover-delete', function () {
                that.delete(that.hoverInfo['order']);
            })
            .on('click', '.hover-up', function (e) {
                that.changeOrder(that.hoverInfo['order'], true)
            })
            .on('click', '.hover-down', function (e) {
                that.changeOrder(that.hoverInfo['order'], false)
            })
            .on('click', '.hover-text', function () {
                that.addShareStem(that.hoverInfo['order']);
            })
            .on('click','.hover-remove',function(){
                console.log('~~~')
                that.removeShareStem(that.hoverInfo['order'])
            });

        //顶部栏事件
        $('.create-bar')
            .on('click', '.button', function () {
                var type = $(this).attr('data-type');
                type && that.addQuestion({
                    qtypeInner: type,
                })
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
            }).find('input').focus()
        });
        $('.title-edit input').on('blur', function () {
            $('.title-edit').addClass('none');
            console.log('geng xin title')
            that.updateTitle();
        });


        this.showLoading();
        //请求作业本信息
        this.$store.dispatch('GET_BOOK_INFO', {id: this.textbookId});
        //请求题目信息
        this.$store.dispatch('GET_All_QUESTIONS', {id: this.textbookId});
        //请求有问题的题目
        this.$store.dispatch('GET_ERROR_QUESTIONS', {id: this.textbookId});

    },
    beforeUpdate: function () {
        //util.log(this.qListForRender)
    },
    updated: function () {
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
        getScrollTop:function(){
            if(document.documentElement.scrollTop) {
                return document.documentElement.scrollTop
            } else {
                return document.body.scrollTop
            }
        },
        /**
         * 更新渲染的页面
         */
        updatePage: function () {
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
        seperatePage: function (page) {
            var maxHeight = 1080;
            var $page = page ? $(page) : $($('.page')[0]);
            var top = $page.offset().top;
            var outRange = false;//是否需要分页
            var buffer = [];//缓存节点
            var that = this;
            $.each($page.find('.stem'), function (i, v) {
                var $v = $(v);
                if (that.bookInfo.cardFormat == 2) {
                    if ($v.attr('data-qtype') == 1 || $v.attr('data-qtype') == 2) {
                        $v.addClass('none')
                        that.editPosition[$v.attr('data-order')] = $v.offset().top
                        return true
                    }
                }
                //如果超高 直接缓存余下节点
                if (outRange) {
                    buffer.push($v)
                } else {
                    var order = $v.attr('data-order');
                    //题目相对该页的高度
                    var absoluteTop = $v.offset().top - top;
                    //题目的总高度
                    var h = $v.height();
                    //答题区高度默认为0
                    var answerH = 0;
                    //计算是否超高
                    if (absoluteTop + h > maxHeight) { //保留边距
                        //炒高了
                        outRange = true;
                        //先复制节点
                        var $clone = $v.clone();
                        //复制品先清空题干，保留答题框（如果有的话）
                        $($clone.find('section')).html('');
                        $($clone.find('.share-stem')).html('');
                        //判断类型
                        var type = $v.attr('data-qtype')
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
                                buffer.push($clone)
                                if(!that.editPosition[order]){
                                    that.editPosition[order] = $v.find('.orderBy').offset().top
                                }
                                return true
                            }
                            //假如还超高
                            else {
                            }
                        }
                        //假如只剩下题干还超高
                        var $p = $($v.find('section'));
                        var tableHtml = $($p.find('table')[0]).prop("outerHTML");
                        // console.log(tableHtml);
                        var rptable ='';
                        if(tableHtml) {
                            rptable = tableHtml.replace(/<br>/ig,'');
                        }
                        var html = $p.html();
                        html = html.replace(/<table[\s\S]+?<\/table>/ig,function(match){
                            return rptable
                        });
                        var array = html.split('<br>');
                        var array2 = html.split('<br>');
                        var s = '';
                        for (var i = 0, l = array.length; i < l; i++) {
                            s = array[l - 1 - i] + s;
                            array2.splice(l - 1 - i, 1);
                            html = array2.join('<br>');
                            $p.html(s)
                            $($clone.find('section')).html(s);
                            if (absoluteTop + h - $p.height() - answerH < maxHeight) {
                                $p.html(html)
                                break;
                            }
                            var stemHeight = $p.height();
                            $p.html('')
                            s = '<br>' + s
                        }
                        //处理完题干
                        if (!$p.html()) {
                            //不管怎样 先除掉题号
                            $v.find('.orderBy').remove();

                            //看看有没有公共题干
                            if ($v.find('.share-stem').length) {
                                if(absoluteTop + h - answerH - stemHeight > maxHeight ){
                                    var $shareStem = $($v.find('.share-stem'));
                                    var sHtml = $shareStem.html();
                                    var sArray = sHtml.split('<br>');
                                    var sArray2 = sHtml.split('<br>');
                                    var string = '';
                                    for (var i = 0, l = sArray.length; i < l; i++) {
                                        string = sArray[l - 1 - i] + string;
                                        sArray2.splice(l - 1 - i, 1);
                                        sHtml = sArray2.join('<br>');
                                        $shareStem.html(string)
                                        $($clone.find('.share-stem')).html(string);
                                        if (absoluteTop + h - $shareStem.height() - answerH - stemHeight < maxHeight) {
                                            $shareStem.html(html);
                                            break;
                                        }
                                        $shareStem.html('')
                                        string = '<br>' + string
                                    }

                                    if (!$shareStem.html()) {
                                        $v.remove();
                                    } else {
                                        ////超高了，但是还残留了题干在该页，记录题目位置用于更新编辑区域位置
                                        //that.editPosition[order] = $v.offset().top
                                    }
                                }


                                //假如整题移到下一页，节点就不保留了
                            }
                            else {
                                $v.remove();
                            }
                        } else {
                            //否则跨页题号要删掉
                            $clone.find('.orderBy').remove();
                            //超高了，但是还残留了题干在该页，记录题目位置用于更新编辑区域位置
                            if($v.find('.orderBy').length && $v.find('.orderBy').offset()) {
                                that.editPosition[order] = $v.find('.orderBy').offset().top
                            }
                        }
                        buffer.push($clone)
                    } else {
                        //没有超高，记录题目位置用于更新编辑区域位置
                        if (!that.editPosition[order]) {
                            that.editPosition[order] = $v.find('.orderBy').offset().top
                        }
                    }
                }
            });
            //调整好的页面设置高度
            $page.css('height', '1121px');
            //将超高节点都挪到下一页
            if (outRange) {
                var $newPage = $('<div class="page rendered"><div class="stem-area"></div></div>');
                this.pageNum = this.pageNum + 1;//页数增加1
                var $stemArea = $($newPage.find('.stem-area'));
                buffer.forEach(function (v) {
                    v.appendTo($stemArea)
                });
                $newPage.insertAfter($page);
                this.seperatePage($newPage)
            }
        },

        /**
         * 更新编辑区位置
         */
        updateEdit: function () {
            var that = this;
            var h = $('.edit-area').offset().top;
            var l = 0
            $('.edit-item').forEach(function (v) {
                var index = $(v).attr('data-index');
                if (index == 1 && that.editPosition[index] - h < 0) {
                    that.editPosition[index] = h + 100
                }
                if (index > 1 && that.editPosition[index] - that.editPosition[index - 1] < 180) {
                    that.editPosition[index] = that.editPosition[index - 1] + 180
                }
                $(v).css('top', that.editPosition[index] - h + 'px')
                l = index
            })
            $('.edit-add').css({
                'top': that.editPosition[l] + 100 + 'px'
            })
        },


        updatePageNum:function(){
            var that = this;
            $('.page.rendered').forEach(function(v,i){
                var $page = $(v)
                $page.append($('<div class="pageNum">第'+ (i + 1) +'页（共'+that.pageNum+'页）</div>'))
            })
        },

        /**
         * 跳转到预览页
         */
        toPreview: function () {
            var that = this;
            var msg = '';
            this.qListForRender.forEach(function (v) {
                msg = msg + ( that.checkQuestion(v) ? '\n' + that.checkQuestion(v) : '')
            });
            if(!this.qListForRender.length ) {
                msg = that.bookInfo.cardFormat == 2 ? '您的答题卡还没有内容' : '您需要添加题目'
            }
            if (msg) {
                window.confirm(msg)
            } else if (this.isShowMarks && (this.totalMark != 100 && this.totalMark != 120 && this.totalMark != 150)) {
                var flag = window.confirm('当前试卷总分为' + this.totalMark + '，确定要提交？')
                if (flag) {
                    this.showLoading();
                    this.updatePreviewHtml();
                    this.hideLoading();
                    location.href = location.href.replace('#/edit', '#/preview')
                }
            } else {
                this.showLoading();
                this.updatePreviewHtml();
                this.hideLoading();
                location.href = location.href.replace('#/edit', '#/preview')
            }
            //console.log(msg)
        },

        /**
         * 检查填写情况
         * @param question
         * @returns {*}
         */
        checkQuestion: function (question) {
            var errorMsg = '第' + question.orderBy + '题请补充：'
            var errorArr = []
            if (question.qtypeInner == null) {
                errorArr.push('题目类型')
            }
            if (question.qtypeInner == 1 || question.qtypeInner == 2) {
                if (!question.answerCount) {
                    errorArr.push('选项个数')
                }

            }
            if ((question.qtypeInner == 1 || question.qtypeInner == 2) && !question.answer) {
                errorArr.push('答案')
            }
            if (!question.difficulty) {
                errorArr.push('难度')
            }
            if (!question.knpList || !question.knpList.length) {
                errorArr.push('知识点')
            }
            if (errorArr.join('、')) {
                return errorMsg + errorArr.join('、')
            } else {
                return ''
            }
        },

        /**
         * 生成预览页html
         */
        updatePreviewHtml: function () {
            var html = '';
            $('.page.rendered').forEach(function (v, i) {
                html = html + '<div class="page" data-pageid="' + (i + 1) + '">' + $(v).html() + '</div>'
            });
            this.$store.dispatch('CHANGE_HTML', {html: html});
        },

        /**
         * 点击修改建议
         * @param order
         */
        callfix: function (order) {
            this.editStem(order)

        },
        callKnp:function(order){
            util.log(order);
            if(order){
                this.$store.commit('CHANGE_EDITING_ORDER', order);
                this.editingOrder = order;
            }
            this.showKnp();
        },
        /**
         * 修改题目
         * @param order
         */
        editStem: function (order) {
            util.log(order)
            this.$store.commit('CHANGE_EDITING_ORDER', order);
            this.editingOrder = order;
            //util.log(this.editingStem)
            this.showEdit();      

        },

        /**
         * 添加上方文本内容
         * @param order
         */
        addShareStem: function (order) {
            this.$store.commit('CHANGE_EDITING_ORDER', order);
            this.editingOrder = order;
            this.showAddShare();

        },
        removeShareStem:function(order){
            this.$store.commit('CHANGE_EDITING_ORDER', order);
            this.editingOrder = order;
            this.editingStem.shareStem = '';
            this.$store.dispatch('EDIT_SAVE', this.editingStem);
        },
        /**
         * 更新试卷题目
         */
        updateTitle: function () {
            this.$store.dispatch('EDIT_TITLE', this.bookInfo.name);
        },

        /**
         * 控制编辑浮层
         */
        showEdit: function () {
            this.$store.commit('SHOW_EDIT')
        },
        hideEdit: function () {
            this.$store.commit('HIDE_EDIT')

        },

        showAddShare: function () {
            this.$store.commit('SHOW_ADD_SHARE')
        },

        /**
         * 控制知识点浮层
         */
        showKnp: function () {
            this.$store.commit('SHOW_KNP')
        },
        hideKnp: function () {
            this.$store.commit('HIDE_KNP')
        },

        /**
         * 控制loading浮层
         */
        showLoading: function () {
            $('.load-container').removeClass('none')

        },
        hideLoading: function () {
            $('.load-container').addClass('none')
        },

        /**
         * 改变题号
         * @param order 序号
         * @param isUp 是否上移
         */
        changeOrder: function (order, isUp) {
            //上移
            if (isUp) {
                if (order <= 1) return;
                this.$store.dispatch('CHANGE_ORDER', {order: order, isUp: true});

                //this.$store.commit('CHANGE_ORDER_UP',order)
                //下移
            } else {
                if (order >= this.qListForRender.length) return;
                this.$store.dispatch('CHANGE_ORDER', {order: order, isUp: false});
                //this.$store.commit('CHANGE_ORDER_DOWN',order)
            }
        },

        /**
         * 添加新题目
         * @param params
         */
        addQuestion: function (params) {
            this.$store.dispatch('ADD_MODEL', {
                type: params.qtypeInner ? params.qtypeInner : '', //类型
                orderBy: params.order || this.qListForRender.length + 1, //序号
            });
            this.$store.commit('SHOW_ADD');
            util.log('添加新题');
        },

        /**
         * 删除题目
         * @param order
         */
        delete: function (order) {
            this.showLoading();
            this.$store.dispatch('DELETE_QUESTION', {orderBy: order})
        },

        /**
         * 重新排版
         */
        reFormat: function () {
            this.updatePage();
            this.updateEdit();
        },

    },
    computed: {
        qListForRender () {
            return this.$store.state.qListForRender
        },
        editData(){
            return this.$store.state.editData
        },
        bookInfo(){
            return this.$store.state.bookInfo
        },
        errorData(){
            return this.$store.state.eList
        },

        editingStem(){
            if (this.editingOrder != 0) {
                return $.extend({}, this.$store.state.qListForRender[this.editingOrder - 1])
            } else {
                return {}
            }
        },
        totalMark(){
            var mark = 0
            this.qListForRender.forEach(function (v) {
                mark = mark + v.score
            })
            
            if (this.isShowMarks) {
                return mark
            } else {
                return ''

            }
        },
        scrollTop(){
            return this.$store.state.scrollTop;
        }
    },
    watch: {},
    components: {
        'edit-layer': editLayer,
        'loading-layer': loadingLayer,
        'edit-tag': editTag
    }
};