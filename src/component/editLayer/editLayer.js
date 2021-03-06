/**
 * Created by jie on 2017/10/15.
 */
var tpl = require('./editLayer.tpl');
var store = require('../../store/store.js');
var util = require('../../util/util.js');

var ue;
var ue2;
var ue3;

module.exports = {
    template: tpl,
    store,
    data: function () {
        return {
            coursebookId: ' ',
            selectedKplList: [],
            isAddAll:false,
            searchText:'',
            selectionNums:7
        }
    },
    mounted(){
        var that = this;
        console.log('编辑面板mounted')
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
        // $('.chapter')
        //     .on('click', '.list', function (e) {
        //         var id = $(this).attr('data-id');
        //         console.log(id)
        //         if (id) {
        //             $(this).toggleClass('fold')
        //         }
        //         e.stopPropagation();

        //     });
        $('.add-knp').on('click', function () {
                that.showKnp();
                that.saveStem();//记录打开知识点页面前的编辑窗的修改内容
            });
        $('#selectAnswer').on('click', '.answer-item', function () {
                if (that.editingStem.qtypeInner == 1) {
                    $(this).toggleClass('selected');
                    $(this).siblings().removeClass('selected')
                } else if (that.editingStem.qtypeInner == 2) {
                    $(this).toggleClass('selected');
                }
            })
        $('#KnpLayer').on('click','.list',function(){
            $(this).toggleClass('fold');
        })
    },
    updated: function () {
        var that = this;
        $('.knp-checkbox').on('click', function (e) {
            e.stopPropagation();

        })
        if(window.localStorage.setTop){
            setTimeout(function(){
                $("#editLayer .edit-wrap").scrollTop(parseInt(window.localStorage.setTop));
                window.localStorage.removeItem('setTop');//每次使用完后清理掉缓存
            },10)
            
        }
    },
    methods: {
        editSave: function (flag) {//题目编辑点保存
            // console.log('flag')
            // console.log(flag)
            this.editingStem.stem = ue.getContent();
            if (this.editingStem.qtypeInner == 1 || this.editingStem.qtypeInner == 2) {
                var arr = []
                $('#selectAnswer').find('.answer-item').forEach(function (v, i) {
                    if ($(v).hasClass('selected')) {
                        arr.push($(v).text())
                    }
                })
                var answer = arr.join(',');
                if (answer) {
                    this.editingStem.answer = answer
                } else {
                    alert('请选择答案')
                    return
                }
            } else {
                this.editingStem.answer = ue2.getContent();
                this.editingStem.answerCount = '';
            }
            util.log(this.editingStem)
            this.showLoading();
            this.$store.dispatch('EDIT_SAVE', this.editingStem)
            this.hideEdit();

        },
        addShareSave: function () {
            this.editingStem.shareStem = ue3.getContent();
            this.$store.dispatch('EDIT_SAVE', this.editingStem)
            this.hideAddShare()
        },
        knpSave: function () {//修改知识点，保存
            var knpArr = [];
            var that = this;
            this.selectedKplList.forEach(function (v, i) {
                // console.log('v')
                knpArr.push(JSON.parse(v))
                // console.log(knpArr)
            });
            // if (this.editingStem.knpList != null) {
            //     var newArr = {};
            //     var output = [];
            //     for (var i = 0; i < this.editingStem.knpList.length; i++) {
            //         if (!newArr[this.editingStem.knpList[i].knpId]) {
            //             newArr[this.editingStem.knpList[i].knpId] = this.editingStem.knpList[i].knpName
            //         }
            //     }
            //     for (var i = 0; i < knpArr.length; i++) {
            //         if (!newArr[knpArr[i].knpId]) {
            //             newArr[knpArr[i].knpId] = knpArr[i].knpName
            //         }
            //     }
            //     $.each(newArr, function (key, v) {
            //         output.push({
            //             knpId: key,
            //             knpName: v
            //         })
            //     });
            //     console.log('output')
            //     console.log(output)
            //     this.editingStem.knpList = output
            // } else {
                this.editingStem.knpList = knpArr;
            // }
            // this.editingStem.stem = ue.getContent();
            // if (this.editingStem.qtypeInner == 1 || this.editingStem.qtypeInner == 2) {
            // } else {
            //     this.editingStem.answer = ue2.getContent();
            //     this.editingStem.answerCount = '';
            // }
            this.showLoading(); //loading遮罩打开
            this.$store.dispatch('EDIT_SAVE', this.editingStem)
            this.hideKnp(); //知识点弹窗关闭
            if(this.isAddAll){
                this.$store.dispatch('ADD_ALL_KNP', knpArr)
            }
            // console.log(this.editingStem.knpList)
            // console.log(knpArr)

            // $('#layer').hide();
            
        },
        deleteKnp: function (index) {
            console.log(index)
            //console.log(index);
            this.editingStem.knpList.splice(index, 1)
            //this.selectedKplList = [];
            this.commitEdit();
        },
        searchKnp:function(){
            this.updateChapters()
        },
        commitEdit: function () {
            this.editingStem.stem = ue.getContent();
            if (this.editingStem.qtypeInner == 1 || this.editingStem.qtypeInner == 2) {
                var arr = []
                $('#selectAnswer').find('.answer-item').forEach(function (v, i) {
                    if ($(v).hasClass('selected')) {
                        arr.push($(v).text())
                    }
                })
                var answer = arr.join(',');
                if (answer) {
                    this.editingStem.answer = answer
                } else {
                    alert('请选择答案')
                    return
                }
            } else {
                this.editingStem.answer = ue2.getContent();
                this.editingStem.answerCount = '';
            }
            util.log(this.editingStem)
            this.showLoading();
            this.$store.dispatch('EDIT_SAVE', this.editingStem)
        },

        saveStem:function () {
            this.editingStem.stem = ue.getContent();
            if (this.editingStem.qtypeInner == 1 || this.editingStem.qtypeInner == 2) {
                var arr = []
                $('#selectAnswer').find('.answer-item').forEach(function (v, i) {
                    if ($(v).hasClass('selected')) {
                        arr.push($(v).text())
                    }
                })
                var answer = arr.join(',');
                if (answer) {
                    this.editingStem.answer = answer
                }
            } else {
                this.editingStem.answer = ue2.getContent();
                this.editingStem.answerCount = '';
            }

            this.$store.dispatch('EDIT_SAVE', this.editingStem)
        },
        /**
         * 确定添加题目
         */
        comfirmAdd: function () {
            this.showLoading();
            if (this.addModel.orderBy) {
                this.addModel.orderBy = Math.round(this.addModel.orderBy);
            }
            if (this.addModel.endOrderBy) {
                this.addModel.endOrderBy = Math.round(this.addModel.endOrderBy);
            }
            if (this.addModel.orderBy <= 0 ||
                this.addModel.orderBy > this.qListForRender.length + 1 ||
                this.addModel.endOrderBy && ( this.addModel.endOrderBy - this.addModel.orderBy < 0)) {
                alert('题号填写异常，请重新输入题号');
                this.hideLoading();
            } else {
                if (this.addModel.orderBy != this.qListForRender.length + 1) {
                    this.addModel.insert = true;
                }
                this.hideAdd();
                this.$store.dispatch('ADD_NEW_QUESTION')
            }
        },
        difficultyClick: function (e) {
            var $this = $(e.target);
            var difficulty = $this.attr('data-difficulty');

            if ($this.hasClass('selected')) return;

            $this.toggleClass('selected');
            $this.siblings().removeClass('selected');

            this.editingStem.difficulty = difficulty;
        },

        showKnp: function () {
            this.$store.commit('SHOW_KNP')
        },
        hideKnp: function () {
            this.$store.commit('HIDE_KNP');
        },

        showEdit: function () {
            this.$store.commit('SHOW_EDIT')
        },
        hideEdit: function () {
            this.$store.commit('HIDE_EDIT');
        },

        hideAdd: function () {
            this.$store.commit('HIDE_ADD')
        },

        hideAddShare: function () {
            this.$store.commit('HIDE_ADD_SHARE')
        },

        editTypeChange: function () {
            var type = this.editingStem.qtypeInner;
            if (type == 1 || type == 2) {
                this.selectNumChange();
                $('.options').css({
                    display: ''
                })
                $('.choose-answer').css({
                    display: ''
                })
                $('.blank-answer').css({
                    display: 'none'
                })

            } else {
                $('.options').css({
                    display: 'none'
                })
                $('.choose-answer').css({
                    display: 'none'
                })
                $('.blank-answer').css({
                    display: ''
                })
            }
        },
        selectNumChange: function () {
            this.initSelectAnswer();
        },
        initSelectAnswer: function () {
            if (this.editingStem.qtypeInner == 1 || this.editingStem.qtypeInner == 2) {
                var html = ''
                var answer = this.editingStem.answer || '';
                for (var i = 0; i < this.editingStem.answerCount; i++) {
                    var char = String.fromCharCode(i + 65);
                    if (answer.indexOf(char) != -1) {
                        html = html + '<div class="answer-item selected">' + char + '</div>'
                    } else {
                        html = html + '<div class="answer-item">' + char + '</div>'
                    }
                }
                $('#selectAnswer').empty();
                $('#selectAnswer').append($(html));
            }
        },
        updateCourseBook: function () {
            this.$store.dispatch('UPDATE_COURSE_BOOK', this.knpFilter)

        },
        updateChapters: function () {
            this.searchText = ''
            this.$store.dispatch('GET_CHAPTERS', this.coursebookId)
            //this.$store.dispatch('GET_CHAPTERS', '329201226790993920')

        },
        showLoading: function () {
            $('.load-container').removeClass('none')

        },
        hideLoading: function () {
            $('.load-container').addClass('none')
        }

    },
    filters: {
        numberlize: function (value) {
            return Math.round(value)
        }
    },
    computed: {
        editingStem(){
            if (this.$store.state.editingOrder != 0) {
                this.updateCourseBook();
                return $.extend({}, this.$store.state.qListForRender[this.$store.state.editingOrder - 1])
            } else {
                return {}
            }
        },


        showOptions(){
            return this.editingStem.qtypeInner == 1 || this.editingStem.qtypeInner == 2
        },
        hideLayer(){
            if (this.$store.state.hideEdit && this.$store.state.hideKnp && this.$store.state.hideAdd && this.$store.state.hideAddShare) {
                $('body').css({
                    'overflow': ''
                })
            } else {
                $('body').css({
                    'overflow': 'hidden'
                })
            }
            return this.$store.state.hideEdit && this.$store.state.hideKnp && this.$store.state.hideAdd && this.$store.state.hideAddShare
        },
        hideEditLayer(){
            if (!this.$store.state.hideEdit) {
                ue.setContent(this.editingStem.stem);
                ue2.setContent(this.editingStem.answer);
                this.initSelectAnswer();
                this.editTypeChange();
            }
            return this.$store.state.hideEdit
        },
        hideKnpLayer(){
            return this.$store.state.hideKnp
        },
        hideAddLayer(){
            return this.$store.state.hideAdd
        },
        hideAddShareLayer(){
            if (!this.$store.state.hideAddShare) {
                ue3.setContent(this.editingStem.shareStem || '');
            }
            return this.$store.state.hideAddShare
        },
        knpFilter(){
            return this.$store.state.knpFilter
        },
        courseBook(){
            return this.$store.state.courseBook
        },
        chapterList(){        
            console.log(JSON.stringify(this.$store.state.chapterList))
            return this.$store.state.chapterList
        },
        chapterListForRender(){
            var that =this;
            var list = {}
            var level4 = {};
            var level3 = {};
            var level2 = {};
            var level1

            if (this.$store.state.chapterList) {

                this.$store.state.chapterList.slice(0).forEach(function (v, i) {
                    var level = v.level;
                    //默认不展开
                    v.unFold = false;
                    if(that.searchText) {
                        $.each(v.knpList,function(i,knp){
                            if(knp.knpName.indexOf(that.searchText) > -1){
                                v.unFold = true;
                                return false;
                            }
                        })
                    } else {
                        v.unFold = true
                    }
                    switch (level) {
                        case 1:
                            v.son = [];
                            level1 = level1 ? level1 :{};
                            level1[v.id] = v;
                            // v.knpList = [];
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
                        if(v.unFold) {
                            level3[parentId].unFold = true;
                        }
                        level3[parentId].son.push(v);
                        level3[parentId].knpList = [];
                    }
                });
                level3 && $.each(level3, function (i, v) {
                    var parentId = v.parentId;

                    if (parentId && level2[parentId]) {
                        if(v.unFold) {
                            level2[parentId].unFold = true;
                        }
                        level2[parentId].son.push(v);
                        level2[parentId].knpList = [];
                    }
                });
                level2 && $.each(level2, function (i, v) {
                    var parentId = v.parentId;
                    if(v.unFold) {
                        level1[parentId].unFold = true;
                    }

                    if (parentId && level1[parentId]) {
                        level1[parentId].son.push(v);
                        level1[parentId].knpList = [];
                    }
                });

                // console.log('测试');
                // console.log(JSON.stringify(level1));

                return level1
            }
        },
        chapterListForSearch(){

        },
        addModel(){
            return this.$store.state.addModel
        },
        knpList(){
            return this.$store.state.knpList
        },
        qListForRender () {
            return this.$store.state.qListForRender
        },
        selectionArr(){
            var arr = {};
            if(this.selectionNums){
                arr['0'] = '选项个数';
                var i = 2;
                while (i<=this.selectionNums) {
                    arr[i] = i;
                    i++
                }

            }
            return arr;
        }
    },
    watch: {
        editingStem: function () {
            var that = this;
            this.selectedKplList = [];
            if(this.editingStem.knpList){
                this.editingStem.knpList.forEach(function(v,i){
                    that.selectedKplList.push(JSON.stringify(v))
                });
            }
        },
    }
};