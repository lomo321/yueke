/**
 * Created by jie on 2017/10/16.
 */
var tpl = require('./modal.tpl');
var store = require('../../store/store.js');
var util = require('../../util/util.js');
module.exports = {
    template: tpl,
    store,
    data () {
        return {
            modal1: false
        }
    },
    methods: {
        ok () {

        },
        cancel () {

        }
    }
};