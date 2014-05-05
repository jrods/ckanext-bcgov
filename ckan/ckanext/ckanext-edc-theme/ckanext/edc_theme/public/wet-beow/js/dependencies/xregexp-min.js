/*!
 * XRegExp v2.0.0
 * (c) 2007-2012 Steven Levithan <http://xregexp.com/>
 * MIT License
 */
var XRegExp;XRegExp=XRegExp||(function(c){var q,i,p,h={natives:false,extensibility:false},t={exec:RegExp.prototype.exec,test:RegExp.prototype.test,match:String.prototype.match,replace:String.prototype.replace,split:String.prototype.split},e={},o={},n=[],b="default",l="class",A={"default":/^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/,"class":/^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/},z=/\$(?:{([\w$]+)}|(\d\d?|[\s\S]))/g,x=/([\s\S])(?=[\s\S]*\1)/g,r=/^(?:[?*+]|{\d+(?:,\d*)?})\??/,B=t.exec.call(/()??/,"")[1]===c,j=RegExp.prototype.sticky!==c,g=false,y="gim"+(j?"y":"");function v(E,C,D){var F;for(F in q.prototype){if(q.prototype.hasOwnProperty(F)){E[F]=q.prototype[F]}}E.xregexp={captureNames:C,isNative:!!D};return E}function k(C){return(C.global?"g":"")+(C.ignoreCase?"i":"")+(C.multiline?"m":"")+(C.extended?"x":"")+(C.sticky?"y":"")}function s(F,D,E){if(!q.isRegExp(F)){throw new TypeError("type RegExp expected")}var C=t.replace.call(k(F)+(D||""),x,"");if(E){C=t.replace.call(C,new RegExp("["+E+"]+","g"),"")}if(F.xregexp&&!F.xregexp.isNative){F=v(q(F.source,C),F.xregexp.captureNames?F.xregexp.captureNames.slice(0):null)}else{F=v(new RegExp(F.source,C),null,true)}return F}function w(E,D){var C=E.length;if(Array.prototype.lastIndexOf){return E.lastIndexOf(D)}while(C--){if(E[C]===D){return C}}return -1}function f(D,C){return Object.prototype.toString.call(D).toLowerCase()==="[object "+C+"]"}function m(C){C=C||{};if(C==="all"||C.all){C={natives:true,extensibility:true}}else{if(f(C,"string")){C=q.forEach(C,/[^\s,]+/,function(D){this[D]=true},{})}}return C}function d(G,H,I,C){var E=n.length,K=null,F,J;g=true;try{while(E--){J=n[E];if((J.scope==="all"||J.scope===I)&&(!J.trigger||J.trigger.call(C))){J.pattern.lastIndex=H;F=e.exec.call(J.pattern,G);if(F&&F.index===H){K={output:J.handler.call(C,F,I),match:F};break}}}}catch(D){throw D}finally{g=false}return K}function a(C){q.addToken=i[C?"on":"off"];h.extensibility=C}function u(C){RegExp.prototype.exec=(C?e:t).exec;RegExp.prototype.test=(C?e:t).test;String.prototype.match=(C?e:t).match;String.prototype.replace=(C?e:t).replace;String.prototype.split=(C?e:t).split;h.natives=C}q=function(I,D){if(q.isRegExp(I)){if(D!==c){throw new TypeError("can't supply flags when constructing one RegExp from another")}return s(I)}if(g){throw new Error("can't call the XRegExp constructor within token definition functions")}var C=[],K=b,E={hasNamedCapture:false,captureNames:[],hasFlag:function(L){return D.indexOf(L)>-1}},J=0,F,H,G;I=I===c?"":String(I);D=D===c?"":String(D);if(t.match.call(D,x)){throw new SyntaxError("invalid duplicate regular expression flag")}I=t.replace.call(I,/^\(\?([\w$]+)\)/,function(M,L){if(t.test.call(/[gy]/,L)){throw new SyntaxError("can't use flag g or y in mode modifier")}D=t.replace.call(D+L,x,"");return""});q.forEach(D,/[\s\S]/,function(L){if(y.indexOf(L[0])<0){throw new SyntaxError("invalid regular expression flag "+L[0])}});while(J<I.length){F=d(I,J,K,E);if(F){C.push(F.output);J+=(F.match[0].length||1)}else{H=t.exec.call(A[K],I.slice(J));if(H){C.push(H[0]);J+=H[0].length}else{G=I.charAt(J);if(G==="["){K=l}else{if(G==="]"){K=b}}C.push(G);++J}}}return v(new RegExp(C.join(""),t.replace.call(D,/[^gimy]+/g,"")),E.hasNamedCapture?E.captureNames:null)};i={on:function(E,D,C){C=C||{};if(E){n.push({pattern:s(E,"g"+(j?"y":"")),handler:D,scope:C.scope||b,trigger:C.trigger||null})}if(C.customFlags){y=t.replace.call(y+C.customFlags,x,"")}},off:function(){throw new Error("extensibility must be installed before using addToken")}};q.addToken=i.off;q.cache=function(E,C){var D=E+"/"+(C||"");return o[D]||(o[D]=q(E,C))};q.escape=function(C){return t.replace.call(C,/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")};q.exec=function(G,E,H,F){var C=s(E,"g"+(F&&j?"y":""),(F===false?"y":"")),D;C.lastIndex=H=H||0;D=e.exec.call(C,G);if(F&&D&&D.index!==H){D=null}if(E.global){E.lastIndex=D?C.lastIndex:0}return D};q.forEach=function(G,F,I,E){var H=0,D=-1,C;while((C=q.exec(G,F,H))){I.call(E,C,++D,G,F);H=C.index+(C[0].length||1)}return E};q.globalize=function(C){return s(C,"g")};q.install=function(C){C=m(C);if(!h.natives&&C.natives){u(true)}if(!h.extensibility&&C.extensibility){a(true)}};q.isInstalled=function(C){return !!(h[C])};q.isRegExp=function(C){return f(C,"regexp")};q.matchChain=function(D,C){return(function E(F,K){var I=C[K].regex?C[K]:{regex:C[K]},J=[],G=function(L){J.push(I.backref?(L[I.backref]||""):L[0])},H;for(H=0;H<F.length;++H){q.forEach(F[H],I.regex,G)}return((K===C.length-1)||!J.length)?J:E(J,K+1)}([D],0))};q.replace=function(I,D,F,E){var H=q.isRegExp(D),G=D,C;if(H){if(E===c&&D.global){E="all"}G=s(D,E==="all"?"g":"",E==="all"?"":"g")}else{if(E==="all"){G=new RegExp(q.escape(String(D)),"g")}}C=e.replace.call(String(I),G,F);if(H&&D.global){D.lastIndex=0}return C};q.split=function(E,D,C){return e.split.call(E,D,C)};q.test=function(E,C,F,D){return !!q.exec(E,C,F,D)};q.uninstall=function(C){C=m(C);if(h.natives&&C.natives){u(false)}if(h.extensibility&&C.extensibility){a(false)}};q.union=function(C,E){var F=/(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g,H=0,J,K,L=function(N,O,P){var M=K[H-J];if(O){++H;if(M){return"(?<"+M+">"}}else{if(P){return"\\"+(+P+J)}}return N},D=[],I,G;if(!(f(C,"array")&&C.length)){throw new TypeError("patterns must be a nonempty array")}for(G=0;G<C.length;++G){I=C[G];if(q.isRegExp(I)){J=H;K=(I.xregexp&&I.xregexp.captureNames)||[];D.push(q(I.source).source.replace(F,L))}else{D.push(q.escape(I))}}return q(D.join("|"),E)};q.version="2.0.0";e.exec=function(H){var F,E,D,C,G;if(!this.global){C=this.lastIndex}F=t.exec.apply(this,arguments);if(F){if(!B&&F.length>1&&w(F,"")>-1){D=new RegExp(this.source,t.replace.call(k(this),"g",""));t.replace.call(String(H).slice(F.index),D,function(){var I;for(I=1;I<arguments.length-2;++I){if(arguments[I]===c){F[I]=c}}})}if(this.xregexp&&this.xregexp.captureNames){for(G=1;G<F.length;++G){E=this.xregexp.captureNames[G-1];if(E){F[E]=F[G]}}}if(this.global&&!F[0].length&&(this.lastIndex>F.index)){this.lastIndex=F.index}}if(!this.global){this.lastIndex=C}return F};e.test=function(C){return !!e.exec.call(this,C)};e.match=function(D){if(!q.isRegExp(D)){D=new RegExp(D)}else{if(D.global){var C=t.match.apply(this,arguments);D.lastIndex=0;return C}}return e.exec.call(D,this)};e.replace=function(F,G){var H=q.isRegExp(F),E,D,I,C;if(H){if(F.xregexp){E=F.xregexp.captureNames}if(!F.global){C=F.lastIndex}}else{F+=""}if(f(G,"function")){D=t.replace.call(String(this),F,function(){var J=arguments,K;if(E){J[0]=new String(J[0]);for(K=0;K<E.length;++K){if(E[K]){J[0][E[K]]=J[K+1]}}}if(H&&F.global){F.lastIndex=J[J.length-2]+J[0].length}return G.apply(null,J)})}else{I=String(this);D=t.replace.call(I,F,function(){var J=arguments;return t.replace.call(String(G),z,function(L,K,N){var M;if(K){M=+K;if(M<=J.length-3){return J[M]||""}M=E?w(E,K):-1;if(M<0){throw new SyntaxError("backreference to undefined group "+L)}return J[M+1]||""}if(N==="$"){return"$"}if(N==="&"||+N===0){return J[0]}if(N==="`"){return J[J.length-1].slice(0,J[J.length-2])}if(N==="'"){return J[J.length-1].slice(J[J.length-2]+J[0].length)}N=+N;if(!isNaN(N)){if(N>J.length-3){throw new SyntaxError("backreference to undefined group "+L)}return J[N]||""}throw new SyntaxError("invalid token "+L)})})}if(H){if(F.global){F.lastIndex=0}else{F.lastIndex=C}}return D};e.split=function(G,D){if(!q.isRegExp(G)){return t.split.apply(this,arguments)}var I=String(this),C=G.lastIndex,F=[],H=0,E;D=(D===c?-1:D)>>>0;q.forEach(I,G,function(J){if((J.index+J[0].length)>H){F.push(I.slice(H,J.index));if(J.length>1&&J.index<I.length){Array.prototype.push.apply(F,J.slice(1))}E=J[0].length;H=J.index+E}});if(H===I.length){if(!t.test.call(G,"")||E){F.push("")}}else{F.push(I.slice(H))}G.lastIndex=C;return F.length>D?F.slice(0,D):F};p=i.on;p(/\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4})|x(?![\dA-Fa-f]{2}))/,function(C,D){if(C[1]==="B"&&D===b){return C[0]}throw new SyntaxError("invalid escape "+C[0])},{scope:"all"});p(/\[(\^?)]/,function(C){return C[1]?"[\\s\\S]":"\\b\\B"});p(/(?:\(\?#[^)]*\))+/,function(C){return t.test.call(r,C.input.slice(C.index+C[0].length))?"":"(?:)"});p(/\\k<([\w$]+)>/,function(D){var C=isNaN(D[1])?(w(this.captureNames,D[1])+1):+D[1],E=D.index+D[0].length;if(!C||C>this.captureNames.length){throw new SyntaxError("backreference to undefined group "+D[0])}return"\\"+C+(E===D.input.length||isNaN(D.input.charAt(E))?"":"(?:)")});p(/(?:\s+|#.*)+/,function(C){return t.test.call(r,C.input.slice(C.index+C[0].length))?"":"(?:)"},{trigger:function(){return this.hasFlag("x")},customFlags:"x"});p(/\./,function(){return"[\\s\\S]"},{trigger:function(){return this.hasFlag("s")},customFlags:"s"});p(/\(\?P?<([\w$]+)>/,function(C){if(!isNaN(C[1])){throw new SyntaxError("can't use integer as capture name "+C[0])}this.captureNames.push(C[1]);this.hasNamedCapture=true;return"("});p(/\\(\d+)/,function(C,D){if(!(D===b&&/^[1-9]/.test(C[1])&&+C[1]<=this.captureNames.length)&&C[1]!=="0"){throw new SyntaxError("can't use octal escape or backreference to undefined group "+C[0])}return C[0]},{scope:"all"});p(/\((?!\?)/,function(){if(this.hasFlag("n")){return"(?:"}this.captureNames.push(null);return"("},{customFlags:"n"});if(typeof exports!=="undefined"){exports.XRegExp=q}return q}());