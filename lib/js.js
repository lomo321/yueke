/**
 * Created by jie on 2017/10/7.
 */
function a(a) {
    if ("url" === a.method) {
        var b = a.args[0];
        return !this.isSVG(b) || this.support.svg || this.options.allowTaint ? b.match(/data:image\/.*;base64,/i) ? new f(b.replace(/url\(['"]{0,}|['"]{0,}\)$/gi, ""), (!1)) : this.isSameOrigin(b) || this.options.allowTaint === !0 || this.isSVG(b) ? new f(b, (!1)) : this.support.cors && !this.options.allowTaint && this.options.useCORS ? new f(b, (!0)) : this.options.proxy ? new h(b, this.options.proxy) : new g(b) : new j(b)
    }
    return "linear-gradient" === a.method ? new l(a) : "gradient" === a.method ? new m(a) : "svg" === a.method ? new k(a.args[0], this.support.svg) : "IFRAME" === a.method ? new i(a.args[0], this.isSameOrigin(a.args[0].src), this.options) : new g(a)
}