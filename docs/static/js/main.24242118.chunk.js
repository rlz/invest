(this["webpackJsonptinv-pwa"]=this["webpackJsonptinv-pwa"]||[]).push([[0],{22:function(e,t,r){e.exports=r(43)},27:function(e,t,r){},29:function(e,t,r){},35:function(e,t,r){},36:function(e,t,r){},38:function(e,t,r){},39:function(e,t,r){},40:function(e,t,r){},41:function(e,t,r){},42:function(e,t,r){},43:function(e,t,r){"use strict";r.r(t);var n=r(0),a=r.n(n),c=r(19),i=r.n(c),o=(r(27),r(12)),u=r(2),s=r.n(u),l=r(10),d=r(3),m=r(4),p=r(5),f=r(6),v=r(9);function h(){return localStorage.getItem("API_TOKEN")}function y(e,t){return E.apply(this,arguments)}function E(){return(E=Object(l.a)(s.a.mark((function e(t,r){var n,a,c;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n="figi=".concat(t,"&from=").concat(r.toISOString(),"&to=").concat((new Date).toISOString(),"&interval=day"),e.next=3,fetch("https://api-invest.tinkoff.ru/openapi/market/candles?".concat(n),{headers:{accept:"application/json",Authorization:"Bearer ".concat(h())}});case 3:return a=e.sent,e.next=6,a.json();case 6:return c=e.sent,e.abrupt("return",c.payload.candles);case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function w(e,t){var r=function(e,t,r,n){if(0!==e.length){var a=null!==r&&void 0!==r?r:0,c=null!==n&&void 0!==n?n:e.length-1;if(!(t<new Date(e[a].time))){if(new Date(e[c].time)<=t)return c;for(;;){if(c-a<2)return a;var i=a+((c-a)/2|0),o=new Date(e[i].time);if(o<t)a=i;else{if(!(o>t))return i;c=i}}}}}(e,t);if(void 0!==r)return e[r].c}function b(e){if(0===e.length)throw Error("No candles");return e[e.length-1].c}var k=r(11);function g(e){return S.apply(this,arguments)}function S(){return(S=Object(l.a)(s.a.mark((function e(t){var r,n;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://api-invest.tinkoff.ru/openapi/market/".concat(t),{headers:{accept:"application/json",Authorization:"Bearer ".concat(h())}});case 2:return r=e.sent,e.next=5,r.json();case 5:return n=e.sent,e.abrupt("return",n.payload.instruments);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function O(){return C.apply(this,arguments)}function C(){return(C=Object(l.a)(s.a.mark((function e(){var t,r,n,a,c,i,o,u,l,d;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=g("stocks"),r=g("bonds"),n=g("etfs"),a=g("currencies"),e.next=6,t;case 6:return c=e.sent,e.next=9,r;case 9:return i=e.sent,e.next=12,n;case 12:return o=e.sent,e.next=15,a;case 15:return u=e.sent,l=[].concat(Object(k.a)(c),Object(k.a)(i.map((function(e){return e.type="Bond",e}))),Object(k.a)(o.map((function(e){return e.type="Etf",e}))),Object(k.a)(u.map((function(e){return e.type="Currency",e})))),d={},l.forEach((function(e){d[e.figi]=e})),e.abrupt("return",d);case 20:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function D(){return P.apply(this,arguments)}function P(){return(P=Object(l.a)(s.a.mark((function e(){var t,r,n,a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(t=new URL("/openapi/operations","https://api-invest.tinkoff.ru")).searchParams.set("from","1900-01-01T00:00:00Z"),t.searchParams.set("to",(new Date).toISOString()),e.next=5,fetch(t.toString(),{headers:{accept:"application/json",Authorization:"Bearer ".concat(h())}});case 5:return r=e.sent,e.next=8,r.json();case 8:return n=e.sent,(a=n.payload.operations).sort((function(e,t){var r=new Date(e.date),n=new Date(t.date);return r>n?1:r<n?-1:0})),e.abrupt("return",a);case 12:case"end":return e.stop()}}),e)})))).apply(this,arguments)}r(29);var U=r(13),j=r(8),T=r(7);function N(e,t,r,n){if("RUB"===e)return t;if("USD"===e)return t*r;if("EUR"===e)return t*n;throw Error("Unknown currency")}function R(e,t,r,n){if("RUB"===e)return t/r;if("USD"===e)return t;if("EUR"===e)return t*n/r;throw Error("Unknown currency")}function x(e,t,r,n){if("RUB"===e)return t/n;if("USD"===e)return t*r/n;if("EUR"===e)return t;throw Error("Unknown currency")}function B(e,t,r,n,a){return"RUB"===e?N(t,r,n,a):"USD"===e?R(t,r,n,a):x(t,r,n,a)}var F=function(){function e(t,r){Object(d.a)(this,e),this.usdCost=void 0,this.eurCost=void 0,this.rubTotal=0,this.usdCost=t,this.eurCost=r}return Object(m.a)(e,[{key:"add",value:function(e,t){return"RUB"===e&&(this.rubTotal+=t),"USD"===e&&(this.rubTotal+=t*this.usdCost),"EUR"===e&&(this.rubTotal+=t*this.eurCost),this}},{key:"addRub",value:function(e){return this.rubTotal+=e,this}},{key:"addUsd",value:function(e){return this.rubTotal+=e*this.usdCost,this}},{key:"addEur",value:function(e){return this.rubTotal+=e*this.eurCost,this}},{key:"rub",value:function(){return this.rubTotal}},{key:"usd",value:function(){return this.rubTotal/this.usdCost}},{key:"eur",value:function(){return this.rubTotal/this.eurCost}},{key:"cur",value:function(e){return"RUB"===e?this.rub():"USD"===e?this.usd():this.eur()}}]),e}();function I(e,t,r,n){return Object.values(e).sort((function(e,a){var c,i,o=Math.abs(N(a.currency,a.amount*a.price,r,n))-Math.abs(N(e.currency,e.amount*e.price,r,n));if(0!==o)return o;var u=null===(c=t[e.figi])||void 0===c?void 0:c.ticker,s=null===(i=t[a.figi])||void 0===i?void 0:i.ticker;if(void 0===u||void 0===s)throw Error("Unknown instruments");return u.localeCompare(s)}))}function A(e){var t=[];if("string"===typeof e)t.push(e);else{var r,n=Object(o.a)(e);try{for(n.s();!(r=n.n()).done;){var a=r.value;t.push(a)}}catch(m){n.e(m)}finally{n.f()}}for(var c=arguments.length,i=new Array(c>1?c-1:0),u=1;u<c;u++)i[u-1]=arguments[u];for(var s=0,l=i;s<l.length;s++){var d=l[s];d[0]&&t.push(d[1])}return t.join(" ")}r(35);var M=function(e){Object(f.a)(r,e);var t=Object(p.a)(r);function r(){return Object(d.a)(this,r),t.apply(this,arguments)}return Object(m.a)(r,[{key:"render",value:function(){var e=this,t=this.props.currency;return a.a.createElement("div",{className:"cCurrenciesSwitch"},a.a.createElement("div",{className:A("",["RUB"===t,"active"]),onClick:function(){return e.props.onCurSwitch("RUB")}},"\u0432 \u0420\u0443\u0431\u043b\u044f\u0445"),a.a.createElement("div",{className:A("",["USD"===t,"active"]),onClick:function(){return e.props.onCurSwitch("USD")}},"\u0432 \u0414\u043e\u043b\u043b\u0430\u0440\u0430\u0445"),a.a.createElement("div",{className:A("",["EUR"===t,"active"]),onClick:function(){return e.props.onCurSwitch("EUR")}},"\u0432 \u0415\u0432\u0440\u043e"))}}]),r}(a.a.Component),G=(r(36),function(e){Object(f.a)(r,e);var t=Object(p.a)(r);function r(){return Object(d.a)(this,r),t.apply(this,arguments)}return Object(m.a)(r,[{key:"render",value:function(){var e=this.props,t=e.drawAllTime,r=e.drawDay1,n=e.drawDay7,c=e.drawDay30,i=e.setFlags;return a.a.createElement("div",{className:"cDaysSwitch"},a.a.createElement("div",{className:A("all-time-switch",[t,"active"]),onClick:function(){return i(!t,r,n,c)}},a.a.createElement("div",{className:A("all-time-mark",[t,"active"])}),"\u0437\u0430 \u0432\u0441\u0435 \u0432\u0440\u0435\u043c\u044f"),a.a.createElement("div",{className:"radio-switch"},a.a.createElement("div",{className:A("",[r,"active"]),onClick:function(){return i(t,!0,!1,!1)}},"\u0437\u0430 \u0434\u0435\u043d\u044c"),a.a.createElement("div",{className:A("",[n,"active"]),onClick:function(){return i(t,!1,!0,!1)}},"\u0437\u0430 7 \u0434\u043d\u0435\u0439"),a.a.createElement("div",{className:A("",[c,"active"]),onClick:function(){return i(t,!1,!1,!0)}},"\u0437\u0430 30 \u0434\u043d\u0435\u0439")))}}]),r}(a.a.Component)),L=r(21);r(37),r(38);function H(e){return(Math.round(100*e)/100).toLocaleString("ru-RU")}var J=function(e){var t=A("currency rub",[e.v>0,"positive"],[e.v<0,"negative"],[!0===e.color,"color"]);return a.a.createElement("span",{className:t},"\u20bd"," ",H(e.v))},z=function(e){var t=A("currency usd",[e.v>0,"positive"],[e.v<0,"negative"],[!0===e.color,"color"]);return a.a.createElement("span",{className:t},"$ ",H(e.v))},q=function(e){var t=A("currency eur",[e.v>0,"positive"],[e.v<0,"negative"],[!0===e.color,"color"]);return a.a.createElement("span",{className:t},"\u20ac"," ",H(e.v))},W=function(e){var t=e.t,r=e.v;return"RUB"===t?a.a.createElement(J,{v:r,color:e.color}):"USD"===t?a.a.createElement(z,{v:r,color:e.color}):a.a.createElement(q,{v:r,color:e.color})},$=function(e){var t=A("percent",[e.v>0,"positive"],[e.v<0,"negative"],[!0===e.color,"color"]);return a.a.createElement("span",{className:t},H(100*e.v),"%")};function K(e){return e.getFullYear().toString()}function Y(e){return["\u042f\u043d\u0432","\u0424\u0435\u0432","\u041c\u0430\u0440","\u0410\u043f\u0440","\u041c\u0430\u0439","\u0418\u044e\u043d\u044c","\u0418\u044e\u043b\u044c","\u0410\u0432\u0433","\u0421\u0435\u043d","\u041e\u043a\u0442","\u041d\u043e\u044f","\u0414\u0435\u043a"][e.getMonth()]}function _(e){var t=e.getDate();return t<10?"0".concat(t):t.toString()}function Z(e){var t=e.getHours();return t<10?"0".concat(t):t.toString()}var Q=[{timeGap:31536e3,regularFormat:K},{timeGap:2419200,regularFormat:Y,yearGapFormat:function(e){return"".concat(Y(e),"\n").concat(K(e))}},{timeGap:86400,regularFormat:_,yearGapFormat:function(e){return"".concat(_(e),"\n").concat(K(e),", ").concat(Y(e))},monthGapFormat:function(e){return"".concat(_(e),"\n").concat(Y(e))}},{timeGap:3600,regularFormat:Z,dayGapFormat:function(e){return"".concat(Z(e),"\n").concat(_(e)," ").concat(Y(e))},yearGapFormat:function(e){return"".concat(Z(e),"\n").concat(_(e)," ").concat(Y(e)," ").concat(K(e))}},{timeGap:60,regularFormat:function(e){return v.DateTime.fromJSDate(e).toFormat("HH:mm")},dayGapFormat:function(e){return"".concat(v.DateTime.fromJSDate(e).toFormat("HH:mm"),"\n").concat(_(e)," ").concat(Y(e)," ").concat(K(e))}},{timeGap:1,regularFormat:function(e){return v.DateTime.fromJSDate(e).toFormat("HH:mm:ss")},dayGapFormat:function(e){return"".concat(v.DateTime.fromJSDate(e).toFormat("HH:mm:ss"),"\n").concat(_(e)," ").concat(Y(e)," ").concat(K(e))}},{timeGap:0,regularFormat:function(e){return v.DateTime.fromJSDate(e).toFormat("HH:mm:ss.SSS")},dayGapFormat:function(e){return"".concat(v.DateTime.fromJSDate(e).toFormat("HH:mm:ss.SSS"),"\n").concat(_(e)," ").concat(Y(e)," ").concat(K(e))}}];function V(e,t){var r=Math.ceil(1e3*(t[1]-t[0]))/1e3,n=Q.find((function(e){return r>=e.timeGap}));if(void 0===n)throw Error("Too small gap");var a=null,c=null,i=null;return t.map((function(e){var t=new Date(1e3*e),r=t.getFullYear(),o=t.getMonth(),u=t.getDate(),s=r!==a,l=o!==c,d=u!==i;return a=r,c=o,i=u,s&&void 0!==n.yearGapFormat?n.yearGapFormat(t):l&&void 0!==n.monthGapFormat?n.monthGapFormat(t):d&&void 0!==n.dayGapFormat?n.dayGapFormat(t):n.regularFormat(t)}))}function X(e,t){if("PERCENT"===t)return e.toFixed(0)+"%";var r={RUB:"\u20bd",USD:"$",EUR:"\u20ac"}[t];return e>1e6?"".concat(r).concat((e/1e6).toFixed(0),"\u043c"):e>1e3?"".concat(r).concat((e/1e3).toFixed(0),"\u0442"):e>100?"".concat(r).concat(function(e,t){return Math.round(10*e*t)/(10*t)}(e/1e3,1),"\u0442"):"".concat(r).concat(e.toFixed(0))}var ee=function(e){Object(f.a)(r,e);var t=Object(p.a)(r);function r(){var e;Object(d.a)(this,r);for(var n=arguments.length,a=new Array(n),c=0;c<n;c++)a[c]=arguments[c];return(e=t.call.apply(t,[this].concat(a))).uplot=null,e.el=null,e.interval=null,e.resizeListener=function(){null!==e.el&&null!==e.uplot&&e.uplot.setSize({width:e.el.clientWidth,height:300})},e}return Object(m.a)(r,[{key:"componentDidMount",value:function(){var e=this;if(null===this.el)throw Error("No element?");window.addEventListener("resize",this.resizeListener),this.setupUPlot(),this.interval=window.setInterval((function(){var t;return null===(t=e.uplot)||void 0===t?void 0:t.syncRect()}),500)}},{key:"setupUPlot",value:function(){var e=this;if(null!==this.el){null!==this.uplot&&(this.uplot.destroy(),this.uplot=null);var t=this.props,r=t.s1,n=t.s2,a=t.s3,c=t.s4,i=[this.props.timestamps,r.data],o={width:2,value:function(t,r){return n=r,"PERCENT"===(a=e.props.valType)?n.toFixed(2)+"%":"".concat({RUB:"\u20bd",USD:"$",EUR:"\u20ac"}[a]," ").concat(H(n));var n,a}},u=[{label:"\u0414\u0430\u0442\u0430",value:function(e,t){var r=new Date(1e3*t);return"".concat(_(r)," ").concat(Y(r)," ").concat(K(r))}},Object(U.a)({},o,{label:r.label,stroke:"#003f5c",fill:"#003f5c30"})];void 0!==n&&(i.push(n.data),u.push(Object(U.a)({},o,{label:n.label,stroke:"#7a5195",fill:"#7a519530"}))),void 0!==a&&(i.push(a.data),u.push(Object(U.a)({},o,{label:a.label,stroke:"#ef5675",fill:"#ef567530"}))),void 0!==c&&(i.push(c.data),u.push({label:c.label,stroke:"#ffa600",fill:"#ffa60030"}));var s={width:this.el.clientWidth,height:300,series:u,fmtDate:function(){return function(){return""}},axes:[{values:V},{values:function(t,r){return r.map((function(t){return X(t,e.props.valType)}))}}]};this.uplot=new L.a(s,i,this.el)}}},{key:"componentDidUpdate",value:function(){this.setupUPlot()}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.resizeListener),null!==this.interval&&window.clearInterval(this.interval)}},{key:"render",value:function(){var e=this;return a.a.createElement("div",{ref:function(t){e.el=t}})}}]),r}(a.a.Component);r(39);function te(e){var t=e.rub;t+=e.usd*e.usdPrice,t+=e.eur*e.eurPrice;for(var r=0,n=Object.values(e.portfolio);r<n.length;r++){var a=n[r];t+=N(a.currency,a.amount*a.price,e.usdPrice,e.eurPrice)}return t}function re(e){return e.ownRub+e.ownUsd*e.usdPrice+e.ownEur*e.eurPrice}var ne=function(e){Object(f.a)(r,e);var t=Object(p.a)(r);function r(e){var n;return Object(d.a)(this,r),(n=t.call(this,e)).state={drawAllTime:!0,drawDay1:!1,drawDay7:!1,drawDay30:!0,currency:"RUB",expandedDays:new Set},n}return Object(m.a)(r,[{key:"render",value:function(){var e=this,t=this.props.states,r=t.map((function(r,n){var a=t[Math.max(0,n-1)],c=t[Math.max(0,n-7)],i=t[Math.max(0,n-30)],o=B(e.state.currency,"RUB",te(r),r.usdPrice,r.eurPrice),u=B(e.state.currency,"RUB",re(r),r.usdPrice,r.eurPrice),s=B(e.state.currency,"RUB",te(a),r.usdPrice,r.eurPrice),l=B(e.state.currency,"RUB",te(c),r.usdPrice,r.eurPrice),d=B(e.state.currency,"RUB",te(i),r.usdPrice,r.eurPrice),m=u-B(e.state.currency,"RUB",re(a),r.usdPrice,r.eurPrice),p=u-B(e.state.currency,"RUB",re(c),r.usdPrice,r.eurPrice),f=u-B(e.state.currency,"RUB",re(i),r.usdPrice,r.eurPrice),v=(o-u)/o,h=(o-s-m)/(s+m),y=(o-l-p)/(l+p),E=(o-d-f)/(d+f);return{date:r.date.getTime(),usdPrice:r.usdPrice,eurPrice:r.eurPrice,totalCur:o,totalOwnCur:u,added1:m,added7:p,added30:f,performance:v,performance1:h,performance7:y,performance30:E}})),n=Object(k.a)(t).reverse().slice(0,100),c=Object(k.a)(r).reverse().slice(0,100),i=this.state.drawDay1?"\u0417\u0430 \u0434\u0435\u043d\u044c":this.state.drawDay7?"\u0417\u0430 7 \u0434\u043d\u0435\u0439":"\u0417\u0430 30 \u0434\u043d\u0435\u0439",o=r.map((function(t){return e.state.drawDay1?100*t.performance1:e.state.drawDay7?100*t.performance7:100*t.performance30})),u=this.state.currency;return a.a.createElement("div",{className:"bHistory"},a.a.createElement(M,{currency:u,onCurSwitch:function(t){return e.setState({currency:t})}}),a.a.createElement("h1",null,"\u0421\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u043f\u043e\u0440\u0442\u0444\u0435\u043b\u044f \u0438 \u0432\u043b\u043e\u0436\u0435\u043d\u0438\u044f"),a.a.createElement(ee,{timestamps:r.map((function(e){return e.date/1e3})),valType:u,s1:{label:"\u0421\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u043f\u043e\u0440\u0442\u0444\u0435\u043b\u044f",data:r.map((function(e){return e.totalCur}))},s2:{label:"\u0418\u043d\u0432\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u043e (\u0432\u044b\u0432\u0435\u0434\u0435\u043d\u043e)",data:r.map((function(e){return e.totalOwnCur}))}}),a.a.createElement("h1",null,"\u0414\u043e\u0445\u043e\u0434\u044b \u0438 \u043f\u043e\u0442\u0435\u0440\u0438"),a.a.createElement(G,{drawAllTime:this.state.drawAllTime,drawDay1:this.state.drawDay1,drawDay7:this.state.drawDay7,drawDay30:this.state.drawDay30,setFlags:function(t,r,n,a){return e.setState({drawAllTime:t,drawDay1:r,drawDay7:n,drawDay30:a})}}),this.state.drawAllTime?a.a.createElement(ee,{timestamps:r.map((function(e){return e.date/1e3})),valType:"PERCENT",s1:{label:i,data:o},s2:{label:"\u0417\u0430 \u0432\u0441\u0435 \u0432\u0440\u0435\u043c\u044f",data:r.map((function(e){return 100*e.performance}))}}):a.a.createElement(ee,{timestamps:r.map((function(e){return e.date/1e3})),valType:"PERCENT",s1:{label:i,data:o}}),a.a.createElement("div",null,n.map((function(t,r){return e.renderDayStats(t,c[r])}))))}},{key:"renderDayStats",value:function(e,t){var r=this,n=this.state.expandedDays.has(e.date.toISOString()),c=I(e.portfolio,this.props.instruments,e.usdPrice,e.eurPrice),i=new F(e.usdPrice,e.eurPrice).addRub(e.rub).addUsd(e.usd).addEur(e.eur).cur(this.state.currency),o=new F(e.usdPrice,e.eurPrice).addRub(e.ownRub).addUsd(e.ownUsd).addEur(e.ownEur).cur(this.state.currency);return a.a.createElement("div",{key:"day-".concat(e.date.toISOString()),className:"dayStats"},a.a.createElement("div",{className:"title"},a.a.createElement("span",{className:"date"},v.DateTime.fromJSDate(e.date).toISODate())," ","USD: ",a.a.createElement(J,{v:e.usdPrice})," ","EUR: ",a.a.createElement(J,{v:e.eurPrice})),a.a.createElement("div",{className:"avail"},"\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u043e: ",a.a.createElement(W,{t:this.state.currency,v:i})),a.a.createElement("div",{className:"own"},"\u0418\u043d\u0432\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u043e (\u0432\u044b\u0432\u0435\u0434\u0435\u043d\u043e): ",a.a.createElement(W,{t:this.state.currency,v:o})),a.a.createElement("div",{className:"portfolio"},c.filter((function(e){return 0!==e.amount})).map((function(t){return r.renderInstrument(t,r.state.currency,e.usdPrice,e.eurPrice)}))),a.a.createElement("div",{className:"total"},"\u0418\u0442\u043e\u0433\u043e: ",a.a.createElement(W,{t:this.state.currency,v:t.totalCur})," ","\u0417\u0430 \u0432\u0441\u0435 \u0432\u0440\u0435\u043c\u044f: ",a.a.createElement($,{v:t.performance,color:!0})," ","\u0417\u0430 \u0434\u0435\u043d\u044c: ",a.a.createElement($,{v:t.performance1,color:!0})," ","\u0417\u0430 7 \u0434\u043d\u0435\u0439: ",a.a.createElement($,{v:t.performance7,color:!0})," ","\u0417\u0430 30 \u0434\u043d\u0435\u0439: ",a.a.createElement($,{v:t.performance30,color:!0})),a.a.createElement("div",{className:A("ops-expander",[n,"expanded"]),onClick:function(){return r.flipExpandedDay(e.date)}},e.ops.length," \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0439",e.ops.length>0?a.a.createElement("button",{onClick:function(){return r.flipExpandedDay(e.date)}},n?a.a.createElement("span",null,a.a.createElement(T.a,{icon:j.c})," \u0441\u043a\u0440\u044b\u0442\u044c"):a.a.createElement("span",null,a.a.createElement(T.a,{icon:j.a})," \u043f\u043e\u043a\u0430\u0437\u0430\u0442\u044c")):void 0),n?a.a.createElement("div",{className:"ops"},e.ops.map((function(e,t){return r.renderOp(e,t.toString())}))):void 0)}},{key:"renderInstrument",value:function(e,t,r,n){var c=this.props.instruments[e.figi];if(void 0===c)throw Error("Instrument not found");return a.a.createElement("span",{key:"i-".concat(e.figi)},c.ticker,"(",e.amount,"):"," ",a.a.createElement(W,{t:t,v:B(t,e.currency,e.price*e.amount,r,n)}))}},{key:"renderOp",value:function(e,t){var r=Object(U.a)({},e);return void 0!==r.figi&&(r.instrument=this.props.instruments[r.figi]),a.a.createElement("pre",{key:t},JSON.stringify(r,void 0,2))}},{key:"flipExpandedDay",value:function(e){var t=new Set(this.state.expandedDays);t.has(e.toISOString())?t.delete(e.toISOString()):t.add(e.toISOString()),this.setState({expandedDays:t})}}]),r}(a.a.Component),ae=(r(40),function(e){Object(f.a)(r,e);var t=Object(p.a)(r);function r(e){var n;return Object(d.a)(this,r),(n=t.call(this,e)).state={token:""},n}return Object(m.a)(r,[{key:"render",value:function(){var e=this;return a.a.createElement("div",{className:"bLoginForm"},a.a.createElement("form",null,a.a.createElement("input",{type:"text",value:this.state.token,onChange:function(t){return e.setState({token:t.target.value})},placeholder:"API Token",autoFocus:!0}),a.a.createElement("button",{type:"button",onClick:function(){return e.onLoginClick()}},"Login")))}},{key:"onLoginClick",value:function(){var e;""!==this.state.token&&(e=this.state.token,localStorage.setItem("API_TOKEN",e),this.props.onLoggedIn())}}]),r}(a.a.Component));function ce(e){return void 0!==e.trades?e.trades.map((function(e){return e.quantity})).reduce((function(e,t){return e+t}),0):e.quantity}r(41);var ie=function(e){Object(f.a)(r,e);var t=Object(p.a)(r);function r(e){var n;return Object(d.a)(this,r),(n=t.call(this,e)).state={expandedInstruments:new Set},n}return Object(m.a)(r,[{key:"render",value:function(){var e=this,t=this.props,r=t.timeline,n=t.instruments,c=r[r.length-1],i=new F(c.usdPrice,c.eurPrice);i.addRub(c.rub).addUsd(c.usd).addEur(c.eur);for(var o=0,u=Object.values(c.portfolio);o<u.length;o++){var s=u[o];i.add(s.currency,s.amount*s.price)}var l=new F(c.usdPrice,c.eurPrice).addRub(c.ownRub).addUsd(c.ownUsd).addEur(c.ownEur);return a.a.createElement("div",{className:"bPortfolio"},a.a.createElement("h1",null,"\u041f\u043e\u043b\u043d\u0430\u044f \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u043f\u043e\u0440\u0442\u0444\u0435\u043b\u044f"),a.a.createElement("div",{className:"bPortfolio-full-cost"},a.a.createElement(J,{v:i.rub()}),a.a.createElement(z,{v:i.usd()}),a.a.createElement(q,{v:i.eur()}),a.a.createElement($,{v:(i.rub()-l.rub())/i.rub(),color:!0})),a.a.createElement("table",null,a.a.createElement("tbody",null,this.renderOwnMoney(c),this.renderAvailable(c),a.a.createElement("tr",null,a.a.createElement("th",{colSpan:2,className:"th-first-line"},"\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u044b"),this.renderEmptyAllCurrenciesColumns()),I(c.portfolio,n,c.usdPrice,c.eurPrice).map((function(t){return e.renderInstrument(t,c.usdPrice,c.eurPrice)})))))}},{key:"renderAvailable",value:function(e){var t=this,r=function(r){var n=e.rub;return"USD"===r&&(n=e.usd),"EUR"===r&&(n=e.eur),a.a.createElement("tr",{key:"avail-".concat(r)},a.a.createElement("td",{colSpan:2},a.a.createElement(W,{t:r,v:n})),t.renderAllCurrenciesColumns(r,n,e.usdPrice,e.eurPrice))},n=new F(e.usdPrice,e.eurPrice).addRub(e.rub).addUsd(e.usd).addEur(e.eur);return[a.a.createElement("tr",{key:"available-th"},a.a.createElement("th",{colSpan:2,className:"th-first-line"},"\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u043e"),this.renderEmptyAllCurrenciesColumns()),r("RUB"),r("USD"),r("EUR"),a.a.createElement("tr",{key:"available-total",className:"total"},a.a.createElement("th",{colSpan:2},"\u0412\u0441\u0435\u0433\u043e"),this.renderAllCurrenciesColumns("RUB",n.rub(),e.usdPrice,e.eurPrice))]}},{key:"renderOwnMoney",value:function(e){var t=this,r=function(r){var n=e[{RUB:"ownRub",USD:"ownUsd",EUR:"ownEur"}[r]];return a.a.createElement("tr",{key:"ownMoney-".concat(r.toLowerCase())},a.a.createElement("td",{colSpan:2},a.a.createElement(W,{t:r,v:n})),t.renderAllCurrenciesColumns(r,n,e.usdPrice,e.eurPrice))},n=new F(e.usdPrice,e.eurPrice).addRub(e.ownRub).addUsd(e.ownUsd).addEur(e.ownEur);return[a.a.createElement("tr",{key:"ownMoney-th"},a.a.createElement("th",{colSpan:2,className:"th-first-line"},"\u0418\u043d\u0432\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u043e (\u0432\u044b\u0432\u0435\u0434\u0435\u043d\u043e)"),a.a.createElement("th",{colSpan:3,className:"all-cur"},"\u0412 \u0440\u0430\u0437\u043d\u044b\u0445 \u0432\u0430\u043b\u044e\u0442\u0430\u0445")),r("RUB"),r("USD"),r("EUR"),a.a.createElement("tr",{key:"ownMoney-total",className:"total"},a.a.createElement("th",{colSpan:2},"\u0412\u0441\u0435\u0433\u043e"),this.renderAllCurrenciesColumns("RUB",n.rub(),e.usdPrice,e.eurPrice))]}},{key:"renderInstrument",value:function(e,t,r){var n=this,c=this.props.instruments;if(!c)throw Error("No instruments map loaded!");var i=c[e.figi];if(void 0===i)throw Error("Unknown instrument");var u,s=0,l=Object(o.a)(e.ops);try{for(l.s();!(u=l.n()).done;){var d=u.value;if(d.operationType.startsWith("Buy")){var m=ce(d);if(void 0===m)throw Error("undefined quantity");s-=d.price*m}else if("Sell"===d.operationType){var p=ce(d);if(void 0===p)throw Error("undefined quantity");s+=d.price*p}else"Dividend"===d.operationType&&(s+=d.payment)}}catch(C){l.e(C)}finally{l.f()}s+=e.amount*e.price;var f,v,h,y,E=e.ops[e.ops.length-1],w=[a.a.createElement("tr",{key:e.figi,className:"inst-main-line"},a.a.createElement("td",{className:"name"},i.name),a.a.createElement("td",null,e.amount," ","\xd7"," ",a.a.createElement(W,{t:e.currency,v:e.price})," = ",a.a.createElement(W,{t:e.currency,v:e.amount*e.price})),this.renderAllCurrenciesColumns(e.currency,e.price*e.amount,t,r)),a.a.createElement("tr",{key:e.figi+"-sl",className:"inst-ticker-line"},a.a.createElement("td",{className:"ticker"},i.ticker),a.a.createElement("td",null,a.a.createElement(W,{t:e.currency,v:s,color:!0})),this.renderAllCurrenciesColumns(e.currency,s,t,r,!0))];if(this.state.expandedInstruments.has(e.figi)){w.push(a.a.createElement("tr",{key:"expand-".concat(e.figi)},a.a.createElement("td",{colSpan:2},e.ops.length," \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0439"," ",a.a.createElement("button",{onClick:function(){return n.switchOps(e.figi)}},a.a.createElement(T.a,{icon:j.e})," \u0421\u043a\u0440\u044b\u0442\u044c")),this.renderEmptyAllCurrenciesColumns()));var b,g=Object(k.a)(e.ops).reverse(),S=Object(o.a)(g);try{for(S.s();!(b=S.n()).done;){var O=b.value;w.push(this.renderOperation(e,O,t,r))}}catch(C){S.e(C)}finally{S.f()}}else 1===e.ops.length?(w.push(a.a.createElement("tr",{key:"expand-".concat(e.figi)},a.a.createElement("td",{colSpan:2},"1 \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u044f"),this.renderEmptyAllCurrenciesColumns())),w.push(this.renderOperation(e,E,t,r))):(w.push(a.a.createElement("tr",{key:"expand-".concat(e.figi)},a.a.createElement("td",{colSpan:2},e.ops.length," ",(f=e.ops.length,v="\u043e\u043f\u0435\u0440\u0430\u0446\u0438\u044f",h="\u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0438",y="\u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0439",f%10===1&&f%100!==11?v:f%10>=2&&f%10<=4&&(f%100<10||f%100>=20)?h:y)," ",a.a.createElement("button",{onClick:function(){return n.switchOps(e.figi)}},a.a.createElement(T.a,{icon:j.d})," \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0432\u0441\u0435")),this.renderEmptyAllCurrenciesColumns())),w.push(this.renderOperation(e,E,t,r)),w.push(a.a.createElement("tr",{key:"op-more-".concat(e.figi)},a.a.createElement("td",{colSpan:2},"..."),a.a.createElement("td",{colSpan:3,className:"all-cur"}))));return w}},{key:"switchOps",value:function(e){var t=new Set(this.state.expandedInstruments);t.has(e)?t.delete(e):t.add(e),this.setState({expandedInstruments:t})}},{key:"renderOperation",value:function(e,t,r,n){if("Buy"===t.operationType||"BuyCard"===t.operationType||"Sell"===t.operationType){var c={Buy:a.a.createElement("span",null,a.a.createElement(T.a,{icon:j.b})," ",a.a.createElement(T.a,{icon:j.h})),BuyCard:a.a.createElement("span",null,a.a.createElement(T.a,{icon:j.b})," ",a.a.createElement(T.a,{icon:j.h})),Sell:a.a.createElement("span",null,a.a.createElement(T.a,{icon:j.h})," ",a.a.createElement(T.a,{icon:j.b}))}[t.operationType],i=ce(t);if(void 0===i)throw Error("undefined quantity");return a.a.createElement("tr",{key:"".concat(e.figi,"-op-").concat(t.date,"-").concat(t.id),className:"op-line"},a.a.createElement("td",null,v.DateTime.fromISO(t.date).toISODate()," ",c),a.a.createElement("td",null,i," ","\xd7"," ",a.a.createElement(W,{t:t.currency,v:t.price})," ","= ",a.a.createElement(W,{t:t.currency,v:i*t.price})),this.renderAllCurrenciesColumns(t.currency,i*t.price,r,n))}if("Dividend"===t.operationType)return a.a.createElement("tr",{key:"".concat(e.figi,"-op-").concat(t.date,"-").concat(t.id),className:"op-line"},a.a.createElement("td",null,v.DateTime.fromISO(t.date).toISODate()," ",a.a.createElement(T.a,{icon:j.f})),a.a.createElement("td",null,a.a.createElement(W,{t:t.currency,v:t.payment})),this.renderAllCurrenciesColumns(t.currency,t.payment,r,n));throw Error("Unexpected operationType")}},{key:"renderAllCurrenciesColumns",value:function(e,t,r,n,c){return[a.a.createElement("td",{key:"total-rub",className:"all-cur"},a.a.createElement(J,{v:N(e,t,r,n),color:c})),a.a.createElement("td",{key:"total-usd",className:"all-cur"},a.a.createElement(z,{v:R(e,t,r,n),color:c})),a.a.createElement("td",{key:"total-eur",className:"all-cur"},a.a.createElement(q,{v:x(e,t,r,n),color:c}))]}},{key:"renderEmptyAllCurrenciesColumns",value:function(){return[a.a.createElement("td",{key:"total-rub",className:"all-cur"}),a.a.createElement("td",{key:"total-usd",className:"all-cur"}),a.a.createElement("td",{key:"total-eur",className:"all-cur"})]}}]),r}(a.a.Component),oe=(r(42),function(e){Object(f.a)(r,e);var t=Object(p.a)(r);function r(){return Object(d.a)(this,r),t.apply(this,arguments)}return Object(m.a)(r,[{key:"render",value:function(){var e=this.props,t=e.activeTab,r=e.usdPrice,n=e.eurPrice,c=e.onTabClick;return a.a.createElement("div",{className:"bTopPanel"},a.a.createElement("div",{className:A("tab",["PF"===t,"active-tab"]),onClick:function(){return c("PF")}},"\u041f\u043e\u0440\u0442\u0444\u0435\u043b\u044c"),a.a.createElement("div",{className:A("tab",["TL"===t,"active-tab"]),onClick:function(){return c("TL")}},"\u0418\u0441\u0442\u043e\u0440\u0438\u044f"),a.a.createElement("div",{className:"spacer"}),a.a.createElement("div",null,"USD: ",void 0===r?"?":a.a.createElement(J,{v:r})," ","EUR: ",void 0===n?"?":a.a.createElement(J,{v:n})),a.a.createElement("div",null,a.a.createElement("button",{onClick:this.props.onLogoutClick},"\u0412\u044b\u0439\u0442\u0438")),a.a.createElement("div",null,this.props.loading?a.a.createElement(T.a,{icon:j.g,pulse:!0}):a.a.createElement("button",{onClick:this.props.onReloadClick},"\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c")))}}]),r}(a.a.Component)),ue=r(20),se=new Set(["PayIn","Tax","TaxBack","PayOut","MarginCommission"]),le="BBG0013HJJ31",de="BBG0013HGFT4";function me(e){var t=new Date(e);return t.setHours(0,0,0,0),t.setDate(t.getDate()+1),t}var pe=function(){function e(t,r,n){Object(d.a)(this,e),this.instrumentsMap=void 0,this.ops=void 0,this.candles=void 0,this.instrumentsMap=t,this.ops=r,this.candles=n}return Object(m.a)(e,[{key:"usdPrice",value:function(){return b(this.candles[de])}},{key:"eurPrice",value:function(){return b(this.candles[le])}},{key:"allInstruments",value:function(){var e,t=new Map,r=Object(o.a)(this.ops);try{for(r.s();!(e=r.n()).done;){var n=e.value;if(!se.has(n.operationType))if(void 0!==n.figi){if(n.figi!==de&&n.figi!==le&&!t.has(n.figi)){var a=this.instrumentsMap[n.figi];if(void 0===a){console.log("Unknown op figi",n);continue}t.set(n.figi,a)}}else console.log("Weird op figi",n)}}catch(c){r.e(c)}finally{r.f()}return Object(k.a)(t.values())}},{key:"timeline",value:function(){for(var e=[],t={rub:0,usd:0,eur:0,ownRub:0,ownUsd:0,ownEur:0},r={},n=0,a=function(e){var t=new Date(e);return t.setHours(0,0,0,0),t}(new Date(this.ops[0].date));a<me(new Date);a=me(a)){for(var c=me(a),i=[];;){var o=this.ops[n];if(void 0===o||new Date(o.date)>=c)break;if(n++,"Done"===o.status){t[o.currency.toLowerCase()]+=o.payment;var u=o.figi,s=ce(o);if("Buy"===o.operationType||"BuyCard"===o.operationType){if(void 0===u)throw Error("undefined in op figi");if(void 0===s)throw Error("undefined in op quantity");if(u===de)t.usd+=s;else if(u===le)t.eur+=s;else if(void 0===r[u]){var l,d=null===(l=this.instrumentsMap[u])||void 0===l?void 0:l.currency;if(void 0===d)throw Error("Unknown instrument");r[u]={figi:u,amount:s,price:-1,currency:d,ops:[o]}}else r[u].amount+=s,r[u].ops.push(o)}if("Sell"===o.operationType){if(void 0===u)throw Error("undefined in op figi");if(void 0===s)throw Error("undefined in op quantity");if(u===de)t.usd-=s;else if(u===le)t.eur-=s;else if(void 0===r[u]){var m,p=null===(m=this.instrumentsMap[u])||void 0===m?void 0:m.currency;if(void 0===p)throw Error("Unknown instrument");r[u]={figi:u,amount:-s,price:-1,currency:p,ops:[o]}}else r[u].amount-=s,r[u].ops.push(o)}if("PayIn"!==o.operationType&&"PayOut"!==o.operationType||("RUB"===o.currency?t.ownRub+=o.payment:"USD"===o.currency?t.ownUsd+=o.payment:t.ownEur+=o.payment),"Dividend"===o.operationType){if(void 0===u)throw Error("undefined in op figi");r[u].ops.push(o)}i.push(o)}}for(var f=0,v=Object.values(r);f<v.length;f++){var h=v[f],y=this.candles[h.figi],E=w(y,c);if(void 0===E)throw console.log(h,y,me),Error("Can't find price");h.price=E}var b=w(this.candles[de],c);if(void 0===b)throw Error("Can't find USD price");var k=w(this.candles[le],c);if(void 0===k)throw Error("Can't find EUR price");e.push(Object(U.a)({},t,{date:a,portfolio:Object(ue.deepCopy)(r),ops:i,usdPrice:b,eurPrice:k}))}return e}}]),e}(),fe=function(e){Object(f.a)(r,e);var t=Object(p.a)(r);function r(e){var n;return Object(d.a)(this,r),(n=t.call(this,e)).state={loading:!1,activeTab:"PF"},n}return Object(m.a)(r,[{key:"componentDidMount",value:function(){var e=Object(l.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.loadData();case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this;if(null===h())return a.a.createElement(ae,{onLoggedIn:function(){e.loadData(),e.forceUpdate()}});var t=this.state,r=t.instrumentsMap,n=t.timeline,c=t.activeTab,i=void 0,o=void 0;if(void 0!==n&&n.length>0){var u=n[n.length-1];i=u.usdPrice,o=u.eurPrice}var s=a.a.createElement(oe,{loading:this.state.loading,activeTab:c,usdPrice:i,eurPrice:o,onTabClick:function(t){return e.setState({activeTab:t})},onReloadClick:function(){e.loadData()},onLogoutClick:function(){localStorage.removeItem("API_TOKEN"),e.setState({instrumentsMap:void 0,ops:void 0,candles:void 0})}});return void 0===r||void 0===n?a.a.createElement("div",{className:"cApp"},s,a.a.createElement("div",{className:"cApp-body"})):"PF"===c?a.a.createElement("div",{className:"cApp"},s,a.a.createElement("div",{className:"cApp-body"},a.a.createElement(ie,{instruments:r,timeline:n}))):a.a.createElement("div",{className:"cApp"},s,a.a.createElement("div",{className:"cApp-body"},a.a.createElement(ne,{instruments:r,states:n})))}},{key:"loadData",value:function(){var e=Object(l.a)(s.a.mark((function e(){var t=this;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!==h()){e.next=2;break}return e.abrupt("return");case 2:return this.setState({loading:!0}),e.prev=3,e.delegateYield(s.a.mark((function e(){var r,n,a,c,i,u,d,m,p,f;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,O();case 2:return r=e.sent,e.next=5,D();case 5:n=e.sent,a=new pe(r,n,{}),c={},i=[],u=v.DateTime.fromISO(n[0].date).minus({hours:168}).toJSDate(),d=Object(o.a)(a.allInstruments());try{for(p=function(){var e=m.value;i.push(Object(l.a)(s.a.mark((function t(){var r;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,y(e.figi,u);case 2:r=t.sent,c[e.figi]=r;case 4:case"end":return t.stop()}}),t)})))())},d.s();!(m=d.n()).done;)p()}catch(h){d.e(h)}finally{d.f()}return i.push(Object(l.a)(s.a.mark((function e(){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y(de,u);case 2:t=e.sent,c[de]=t;case 4:case"end":return e.stop()}}),e)})))()),i.push(Object(l.a)(s.a.mark((function e(){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y(le,u);case 2:t=e.sent,c[le]=t;case 4:case"end":return e.stop()}}),e)})))()),e.next=16,Promise.all(i);case 16:f=new pe(r,n,c).timeline(),t.setState({instrumentsMap:r,ops:n,candles:c,timeline:f});case 18:case"end":return e.stop()}}),e)}))(),"t0",5);case 5:return e.prev=5,this.setState({loading:!1}),e.finish(5);case 8:case"end":return e.stop()}}),e,this,[[3,,5,8]])})));return function(){return e.apply(this,arguments)}}()}]),r}(a.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(a.a.createElement(fe,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[22,1,2]]]);
//# sourceMappingURL=main.24242118.chunk.js.map