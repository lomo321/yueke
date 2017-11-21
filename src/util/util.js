/**
 * Created by jie on 2017/10/15.
 */
module.exports = {
    GetQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    },
    log: function (msg) {
        if (location.href.indexOf('debug') != -1) {
            console.log(msg)
        }
    },
}