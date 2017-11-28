/**
 * Created by jie on 2017/10/16.
 */
var tpl = require('./editTag.tpl');
var store = require('../../store/store.js');
var util = require('../../util/util.js');
module.exports = {
    template: tpl,
    store,
    data: function () {
        return {
            display: '',
            basic: false,
            strenthen: false,
            improve: false,
            selectionNums: 7
        }
    },
    props: ['orderBy', 'isShowMarks'],
    mounted() {
        var that = this;
        this.updateShow();
        that.pointshoworhide(); //计算知识点宽度控制显示/隐藏
    },
    updated() {
        this.pointshoworhide(); //计算知识点宽度控制显示/隐藏
    },
    methods: {
        //计算知识点宽度控制显示/隐藏
        pointshoworhide: function () {
            var that = this;
            var $pointbigbox = $(this.$el).find('.wrap'); //知识点大块
            var $items = $pointbigbox.find('.itemid');//读取的知识点值
            var widthin = 0; //初始化宽度为0
            var wrapperWidth = 0;//容器宽
            var overWidth = false;//是否超宽
            $.each($items, function (i,item) {
                $(item).removeClass('hide');
                if(!overWidth) {
                    if(widthin + $(item).width() + 6 > 285 ) { //+6因为要算上margin宽度
                        $(item).addClass('hide');
                        overWidth = true;
                    } else {
                        widthin = widthin + $(item).width() + 6;
                    }
                    wrapperWidth = widthin;
                } else {
                    $(item).addClass('hide');
                }
            });
            $(this.$el).find('.wrap').css('width',(wrapperWidth > 0 ? wrapperWidth  + 'px' :''));
            $(this.$el).find('.mechianmore').css('display', overWidth ? 'inline-block' : 'none');
        },

        getScrollTop: function () {
            if (document.documentElement.scrollTop) {
                return document.documentElement.scrollTop
            } else {
                return document.body.scrollTop
            }
        },
        updateShow: function () {
            var type = this.editingStem.qtypeInner;
            var difficulty = this.editingStem.difficulty;
            if (type == 1 || type == 2) {
                this.display = ''
            } else {
                this.display = 'none'
            }
        },
        typeChange: function () {
            //console.log(this.orderBy, 'change')
            var type = this.editingStem.qtypeInner;
            if (type == 1 || type == 2) {
                this.display = ''

                this.editingStem.answerCount = 4;

            } else {
                this.display = 'none'
                this.editingStem.answerCount = '';
            }

            this.editingStem.score = this.editingStem.score || 0

            this.commitChange()

        },
        change: function () {
            console.log(this.orderBy, 'change')
            var type = this.editingStem.qtypeInner;
            if (type == 1 || type == 2) {
                this.display = ''

            } else {
                this.display = 'none'
                this.editingStem.answerCount = '';
            }

            this.editingStem.score = this.editingStem.score || 0

            this.commitChange()
        },
        deleteKnp: function (index) {
            this.editingStem.knpList.splice(index, 1);
            this.commitChange();
        },
        answerClick: function (e) {
            var $this = $(e.target);
            if (this.editingStem.qtypeInner == 1) {
                $this.toggleClass('selected');
                $this.siblings().removeClass('selected')
            } else if (this.editingStem.qtypeInner == 2) {
                $this.toggleClass('selected');
            }
            var arr = []
            $this.parent().find('.answer-item').forEach(function (v, i) {
                if ($(v).hasClass('selected')) {
                    arr.push($(v).text())
                }
            });
            var answer = arr.join(',');
            if (answer) {
                this.editingStem.answer = answer
            }
            this.commitChange()
        },
        difficultyClick: function (e) {
            var $this = $(e.target);
            var difficulty = $this.attr('data-difficulty');

            if ($this.hasClass('selected')) return;

            $this.toggleClass('selected');
            $this.siblings().removeClass('selected');

            this.editingStem.difficulty = difficulty;
            this.commitChange()
        },
        commitChange: function () {
            util.log(this.editingStem)
            //this.showLoading();
            this.$store.commit('SET_SCROLL_TOP', this.getScrollTop());
            this.$store.dispatch('EDIT_SAVE', this.editingStem)
        },
        edit: function () {
            this.$emit('editLinkClick')
        },
        knpEdit: function () {
            this.$store.commit('SET_SCROLL_TOP', this.getScrollTop());
            this.$emit('knpLinkClick')
        },
        showLoading: function () {
            $('.load-container').removeClass('none')

        },
        hideLoading: function () {
            $('.load-container').addClass('none')
        },
    },
    filters: {
        textlize: function (value) {
            if (value) {
                return $('<div>' + value + '</div>')[0].innerText

            } else {
                return ''
            }
        }
    },
    computed: {
        editingStem() {
            return $.extend({}, this.$store.state.qListForRender[this.orderBy - 1])
        },
        selectionArr() {
            var arr = {};

            if (this.selectionNums) {
                arr['0'] = '选项个数';
                var i = 2;
                while (i <= this.selectionNums) {
                    arr[i] = i;
                    i++
                }

            }
            return arr;
        }
    },
    watch: {
        //editingStem: {
        //    handler() {
        //        var that = this;
        //        //that.pointshoworhide();//监控editingStem的数据变化，调整知识点的宽度显示
        //    }
        //}
    }
};