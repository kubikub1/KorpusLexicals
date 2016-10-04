(function() {

    "use strict";

    var tkk = "",

    ggt = {
        parseTk: function(r){var e=/;TKK=(.*?\'\));/i.exec(r);if(null!=e){var a=/var a=(.*?);.*?var b=(.*?);.*?return (\d+)/i.exec(e[1].replace(/\\x3d/g,"="));if(null!=a){var u=Number(a[3])+"."+(Number(a[1])+Number(a[2]));return u}}},
        Tk: function(r){var t=tkk,n="&",o="",e="=",a="+-a^+6",h="a",i="+",f="+-3^+b+-f",u=".",c=function(r){return function(){return r}},C=function(r,t){for(var n=0;n<t.length-2;n+=3){var o=t.charAt(n+2),o=o>=h?o.charCodeAt(0)-87:Number(o),o=t.charAt(n+1)==i?r>>>o:r<<o;r=t.charAt(n)==i?r+o&4294967295:r^o}return r},d=function(r){var h;if(null!==t)h=t;else{h=c(String.fromCharCode(84));var i=c(String.fromCharCode(75));h=[h(),h()],h[1]=i(),h=(t=window[h.join(i())]||o)||o}var d=c(String.fromCharCode(116)),i=c(String.fromCharCode(107)),d=[d(),d()];d[1]=i(),i=n+d.join(o)+e,d=h.split(u),h=Number(d[0])||0;for(var g=[],l=0,v=0;v<r.length;v++){var m=r.charCodeAt(v);128>m?g[l++]=m:(2048>m?g[l++]=m>>6|192:(55296==(64512&m)&&v+1<r.length&&56320==(64512&r.charCodeAt(v+1))?(m=65536+((1023&m)<<10)+(1023&r.charCodeAt(++v)),g[l++]=m>>18|240,g[l++]=m>>12&63|128):g[l++]=m>>12|224,g[l++]=m>>6&63|128),g[l++]=63&m|128)}for(r=h||0,l=0;l<g.length;l++)r+=g[l],r=C(r,a);return r=C(r,f),r^=Number(d[1])||0,0>r&&(r=(2147483647&r)+2147483648),r%=1e6,r.toString()+u+(r^h)};return d(r)},
        URLEncode:function(a){return a=void 0==a?"":a,a=(a+"").toString(),a=a.length<700?a:a.substr(0,700),encodeURIComponent(a).replace(/!/g,"%21").replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/\*/g,"%2A").replace(/%20/g,"+")},
    },

    stringK = {
        isWildCard: function(w, l, s, k, b = 1) {
            let n,arr;
            return w = w.replace(/\s*\+\s*/g, s).toLocaleLowerCase().trim(), 
                   arr=w.split(s, (w.match(/\+/g) || []).length+1),
                k.forEach((e, i, a) => { 
                    arr[arr.length-1].substr(0,b) == e.substr(0, b) &&
                    (l = "r" === e.substr(0, b) ? l + "/" + e : e) }),
                    arr.pop(),w = arr.join(" "), { word: w, lang: l }
        },
        toUpperCaseFirst: str => str.charAt(0).toUpperCase() + str.substr(1),
        trunc: function(n,r,e){if(n.length<=r||"undefined"===n)return n;var t=r,f=n.lastIndexOf(" ",t);return(-1==f||r/2>f)&&(f=e),n.substr(0,f)},
        base64: {
            _keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            encode:function(r){var t,e,o,a,h,n,C,i="",c=0;for(r=stringK.base64.utf8Encode(r);c<r.length;)t=r.charCodeAt(c++),e=r.charCodeAt(c++),o=r.charCodeAt(c++),a=t>>2,h=(3&t)<<4|e>>4,n=(15&e)<<2|o>>6,C=63&o,isNaN(e)?n=C=64:isNaN(o)&&(C=64),i=i+this._keyStr.charAt(a)+this._keyStr.charAt(h)+this._keyStr.charAt(n)+this._keyStr.charAt(C);return i},
            utf8Encode:function(r){r=r.replace(/\r\n/g,"\n");for(var t="",e=0;e<r.length;e++){var o=r.charCodeAt(e);128>o?t+=String.fromCharCode(o):o>127&&2048>o?(t+=String.fromCharCode(o>>6|192),t+=String.fromCharCode(63&o|128)):(t+=String.fromCharCode(o>>12|224),t+=String.fromCharCode(o>>6&63|128),t+=String.fromCharCode(63&o|128))}return t},
            decode: function(r){for(var t,A,E="",C=stringK.base64.decodeAsBytes(r),a=C.length,o=0,e=0;a>o;)if(t=C[o++],127>=t)E+=String.fromCharCode(t);else{if(t>191&&223>=t)A=31&t,e=1;else if(239>=t)A=15&t,e=2;else{if(!(247>=t))throw"not a UTF-8 string";A=7&t,e=3}for(var h=0;e>h;++h){if(t=C[o++],128>t||t>191)throw"not a UTF-8 string";A<<=6,A+=63&t}if(A>=55296&&57343>=A)throw"not a UTF-8 string";if(A>1114111)throw"not a UTF-8 string";65535>=A?E+=String.fromCharCode(A):(A-=65536,E+=String.fromCharCode((A>>10)+55296),E+=String.fromCharCode((1023&A)+56320))}return E},
            decodeAsBytes: function(r){var t,A,E,C,a=[],o=0,e=r.length;"="==r.charAt(e-2)?e-=2:"="==r.charAt(e-1)&&(e-=1);for(var h=0,n=e>>2<<2;n>h;)t=stringK.base64.Base64C[r.charAt(h++)],A=stringK.base64.Base64C[r.charAt(h++)],E=stringK.base64.Base64C[r.charAt(h++)],C=stringK.base64.Base64C[r.charAt(h++)],a[o++]=255&(t<<2|A>>>4),a[o++]=255&(A<<4|E>>>2),a[o++]=255&(E<<6|C);var D=e-n;return 2==D?(t=stringK.base64.Base64C[r.charAt(h++)],A=stringK.base64.Base64C[r.charAt(h++)],a[o++]=255&(t<<2|A>>>4)):3==D&&(t=stringK.base64.Base64C[r.charAt(h++)],A=stringK.base64.Base64C[r.charAt(h++)],E=stringK.base64.Base64C[r.charAt(h++)],a[o++]=255&(t<<2|A>>>4),a[o++]=255&(A<<4|E>>>2)),a},
            Base64C:{A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9,K:10,L:11,M:12,N:13,O:14,P:15,Q:16,R:17,S:18,T:19,U:20,V:21,W:22,X:23,Y:24,Z:25,a:26,b:27,c:28,d:29,e:30,f:31,g:32,h:33,i:34,j:35,k:36,l:37,m:38,n:39,o:40,p:41,q:42,r:43,s:44,t:45,u:46,v:47,w:48,x:49,y:50,z:51,0:52,1:53,2:54,3:55,4:56,5:57,6:58,7:59,8:60,9:61,"+":62,"/":63,"-":62,_:63}
        },
        replaceDiacritics: function(str) {
            var diacriticsMap={A:/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g,AA:/[\uA732]/g,AE:/[\u00C6\u01FC\u01E2\u00C4]/g,AO:/[\uA734]/g,AU:/[\uA736]/g,AV:/[\uA738\uA73A]/g,AY:/[\uA73C]/g,B:/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g,C:/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g,D:/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g,DZ:/[\u01F1\u01C4]/g,Dz:/[\u01F2\u01C5]/g,E:/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g,F:/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g,G:/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g,H:/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g,I:/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g,J:/[\u004A\u24BF\uFF2A\u0134\u0248]/g,K:/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g,L:/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g,LJ:/[\u01C7]/g,Lj:/[\u01C8]/g,M:/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g,N:/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g,NJ:/[\u01CA]/g,Nj:/[\u01CB]/g,O:/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g,OE:/[\u00D6]/g,OI:/[\u01A2]/g,OO:/[\uA74E]/g,OU:/[\u0222]/g,P:/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g,Q:/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g,R:/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g,S:/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g,T:/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g,TZ:/[\uA728]/g,U:/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g,UE:/[\u00DC]/g,V:/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g,VY:/[\uA760]/g,W:/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g,X:/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g,Y:/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g,Z:/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g,a:/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g,aa:/[\uA733]/g,ae:/[\u00E6\u01FD\u01E3\u00E4]/g,ao:/[\uA735]/g,au:/[\uA737]/g,av:/[\uA739\uA73B]/g,ay:/[\uA73D]/g,b:/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g,c:/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g,d:/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g,dz:/[\u01F3\u01C6]/g,e:/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g,f:/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g,g:/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g,h:/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g,hv:/[\u0195]/g,i:/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g,j:/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g,k:/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g,l:/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g,lj:/[\u01C9]/g,m:/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g,n:/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g,nj:/[\u01CC]/g,o:/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g,oe:/[\u00F6]/g,oi:/[\u01A3]/g,ou:/[\u0223]/g,oo:/[\uA74F]/g,p:/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g,q:/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g,r:/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g,s:/[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g,ss:/[\u00DF]/g,t:/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g,tz:/[\uA729]/g,u:/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g,ue:/[\u00FC]/g,v:/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g,vy:/[\uA761]/g,w:/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g,x:/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g,y:/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g,z:/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g};
            for (var x in diacriticsMap) str = str.replace(diacriticsMap[x], x);
            return str;
        }
    };

    exports.ggtInit = function(r, w, p, t) {
       tkk = ggt.parseTk(r);
       return tkk;
    }

    exports.detectSourceLang = function(gket, p, webservice) {

        let SL = p.lang,
            URL,
            contentType = "application/json",
            str = (p.dico == "reverso") ? stringK.base64.decode(p.word): p.word;
            p.text = "";
            p.GT = (p.dico == "googletranslate") ? (
                p.ContentStyle = {
                    width: 30, height: 30,
                    contentStyle: "video {height:0px;width:28px;box-shadow:none;margin-left: 0px;}",
                    position: { top: 200, left: -5 },
                    contentURL: p.url
                }, {}) : null;

        switch (webservice) {
            case "googletranslate":
                URL = "https://translate.google.com/translate_a/t?client=drive&sl=auto&tl=en&multires=1&otf=2&ssel=0&tsel=0&notlr=0&sc=1&text=" + encodeURIComponent(stringK.trunc(str, str.length, 80));
                break;
            case "detectLanguageCom":
                URL = "https://ws.detectlanguage.com/0.2/detect?q=" + stringK.trunc(str, str.length, 80) + "&key=demo";
                break;
            case "languageLayerCom":
                URL = "https://languagelayer.com/php_helper_scripts/language_api.php?secret_key=f6b2b3ecbc8fd9458b0dfec6f4a54b9d&query=" + stringK.trunc(str, str.length, 80);
                break;
            case "systran":
                contentType = "text/html";
                URL = "https://webmail.smartlinkcorp.com/ld.php?tr=bl&text=" + stringK.trunc(str, str.length, 80);
                break;
            case "manual":
                break;
        }

        var promise = new Promise(function(resolve, reject) {

            if (webservice != "manual") {

                gket({ "url": URL , "lang": SL}, contentType).then(function(response) {

                    p.text = "Could not detect that language...\n";

                    if(response.statusText == "OK") {
                        var r, supportedTTS = {
                                "googletranslate": { "az": "Azerbaijani Ø¢Ø°Ø±Ø¨Ø§ÛØ¬Ø§Ù Ø¯ÛÙÛ", "be": "Belarusian ÐÐµÐ»Ð°ÑÑÑÐºÐ°Ñ", "bg": "Bulgarian ÐÑÐ»Ð³Ð°ÑÑÐºÐ¸", "et": "Estonian Eesti keel", "eu": "Basque Euskara", "fa": "Persian ÙØ§Ø±Ø³Û", "ga": "Irish Gaeilge", "gl": "Galician Galego", "iw": "Hebrew ×¢××¨××ª", "ka": "Georgian á¥áá áá£áá", "lt": "Lithuanian LietuviÅ³ kalba", "ms": "Malay Malay", "mt": "Maltese Malti", "sl": "Slovenian Slovensko", "tl": "Filipino Filipino", "uk": "Ukrainian Ð£ÐºÑÐ°ÑÐ½ÑÑÐºÐ°", "ur": "Urdu Ø§Ø±Ø¯Ù", "yi": "Yiddish ××Ö´×××©" },
                                "ispeech": { "ar": "arabicmale", "ca": "eurcatalanfemale", "cs": "eurczechfemale", "da": "eurdanishfemale", "de": "eurgermanfemale", "el": "eurgreekfemale", "en": "auenglishfemale", "en": "ukenglishfemale", "es": "eurspanishfemale", "fi": "eurfinnishfemale", "fr": "eurfrenchfemale", "hu": "huhungarianfemale", "it": "euritalianfemale", "ja": "jpjapanesefemale", "ko": "krkoreanfemale", "nl": "eurdutchfemale", "no": "eurnorwegianfemale", "pl": "eurpolishfemale", "pt": "brportuguesefemale", "pt": "eurportuguesefemale", "ru": "rurussianfemale", "sv": "swswedishfemale", "tr": "eurturkishfemale", "zh": "chchinesefemale" },
                                "reverso": { "ar": "Mehdi22k", "de": "Klaus22k", "en": "Heather22k", "es": "Maria22k", "fr": "Bruno22k", "it": "Chiara22k", "ja": "Sakura22k", "nl": "Femke22k", "pt": "Celia22k", "ru": "Alyona22k", "zh": "Lulu22k" },
                                "responsivevoiceorg": { "af": "Afrikaans Male", "ar": "Arabic Male", "au": "Australian Female", "br": "Portuguese Female", "bs": "Bosnian Male", "ca": "Catalan Male", "cn": "Chinese Female", "cy": "Welsh Male", "cz": "Czech Female", "de": "Deutsch Female", "dk": "Danish Female", "eo": "Esperanto Male", "es": "Spanish Female", "fi": "Finnish Female", "fr": "French Female", "en": "UK English Female", "gr": "Greek Female", "hi": "Hindi Female", "ta": "Tamil Male", "hr": "Croatian Male", "ht": "Hatian Creole Female", "hu": "Hungarian Female", "hy": "Armenian Male", "id": "Indonesian Female", "is": "Icelandic Male", "it": "Italian Female", "jp": "Japanese Female", "kr": "Korean Female", "lv": "Latvian Male", "md": "Moldavian Male", "me": "Montenegrin Male", "mk": "Macedonian Male", "nl": "Dutch Female", "no": "Norwegian Female", "pl": "Polish Female", "ro": "Romanian Male", "ru": "Russian Female", "sk": "Slovak Female", "sq": "Albanian Male", "sr": "Serbian Male", "sv": "Swedish Female", "sw": "Swahili Male", "th": "Thai Female", "tr": "Turkish Female", "va": "Latin Female", "vi": "Vietnamese Male" }
                            };

                        switch (webservice) {
                            case "googletranslate":
                                r = response.json;
                                if (r) SL = r[1];
                                else SL = ""
                                break;
                            case "detectLanguageCom" || "languageLayerCom":
                                r = response.json;
                                if (r.data.detections[0].isReliable) SL = r.data.detections[0].language;
                                else SL = ""
                                break;
                            case "systran":
                                r = response.text;
                                if (r) SL = r.substring(0, r.indexOf("#"))
                                else SL = "";
                                break;
                        }

                        supportedTTS = (p.dico == "googletranslate")  ? supportedTTS[p.dico][SL] == null :
                                       (SL = supportedTTS[p.dico][SL], SL != null);

                        p.lang = SL;

                        if (supportedTTS) URL = (p.dico == "googletranslate" ? "https://translate.google.com/translate_tts?ie=UTF-8&q={{word}}&tl={{lang}}&total=1&idx=0&textlen={{textlen}}&client=t&tk={{tkn}}" :
                                                (p.dico == "ispeech" ? "http://api.ispeech.org/api/rest?action=convert&text={{word}}&voice={{lang}}&format=mp3&apikey=ispeech-listenbutton-betauserkey" :
                                                (p.dico == "reverso" ? "http://voice2.reverso.net/RestPronunciation.svc/v1/output=json/GetVoiceStream/voiceName={{lang}}?inputText={{word}}" :
                                                                        "https://code.responsivevoice.org/getvoice.php?t={{word}}&tl={{lang}}&sv=")));

                        p.url = supportedTTS ? URL.replace('{{word}}', p.word)
                                                  .replace('{{lang}}', p.lang)
                                                  .replace('{{textlen}}', p.word.length)
                                                  .replace('{{tkn}}', ggt.Tk(p.word)) : "";

                         // no language detected => p.lang = "", language not supported => p.url=""                 
                        p.text = p.lang == "" ? (p.text + stringK.toUpperCaseFirst(webservice) + " lacks precision, try a manual mode maybe") :
                                 p.url  == "" ? ("language detected but voice not supported by " + stringK.toUpperCaseFirst(p.dico)) : "";
                        
                        
                        p.GT != null && (p.ContentStyle.contentURL = p.url);

                        resolve(p);
                    } 
                    else
                    p.text = p.text + " " + stringK.toUpperCaseFirst(p.webservice) + " language detection is currently unavailable...",
                    reject(p);                
                })
            } 
            else
                p.GT != null && (p.ContentStyle.contentURL = p.url),
                resolve(p);
          
        });

        return promise;
    }

    exports.forgeURLWith = function(word, dv, tts = false) { /*--------------------Customized URL*/

        var phrase = word.trim().replace(/[~$%^&*_|¯<\=>\\^]/gi, ""),
            url  = "",
            dico = dv.dico,
            lang = dv.langPair;
            word = phrase.replace(/[\(\)\/\[\]\{\}\?\.¿؟\!¡,;:"»«“”„“‘’@#]/gi, "");
            lang = lang.substring(0, lang.indexOf("#") - 1).toLocaleLowerCase().trim();

        if (word == '') return {};

        switch (dico) {
            case "babla":
                url = "http://en.bab.la/dictionary/{{lang}}/{{word}}";
                break;
            case "cnrtl":
                if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, "", "+", ["lexicographie", "etymologie", "crisco", "academie9", "bhv", "dmf", "bob"]),
                    word = e.word,
                    lang = e.lang;
                url = {
                    lexicographie: "http://www.cnrtl.fr/definition/{{word}}//0",
                    etymologie: "http://www.cnrtl.fr/etymologie/{{word}}//0",
                    crisco: "http://www.crisco.unicaen.fr/des/synonymes/{{word}}",
                    academie9: "http://www.cnrtl.fr/definition/academie9/{{word}}",
                    academie8: "http://www.cnrtl.fr/definition/academie8/{{word}}",
                    bhvf: "http://www.cnrtl.fr/definition/bhvf/{{word}}",
                    dmf: "http://atilf.atilf.fr/scripts/dmfX.exe?LEM={{word}};XMODE=STELLa;MENU=menu_dmf;;ISIS=isis_dmf2012.txt;OUVRIR_MENU=2;s=s102f3238;LANGUE=FR;",
                    dmf2: "http://www.cnrtl.fr/utilities/ADMF?query={{word}}",
                    bob: "http://www.languefrancaise.net/?n=Bob.Bob&action=search&q={{word}}"
                }[lang];
                break;
            case "littre":
                url = "http://www.littre.org/definition/{{word}}";
                break;
            case "larousse":
                word = unescape(encodeURIComponent(word));
                url = "http://www.larousse.fr/dictionnaires/francais/{{word}}";
                break;
            case "artfl":
                if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, "", "+", ["dvlf", "onlineetym", "rogets"]),
                    word = e.word,
                    lang = e.lang;
                url = {
                    d: "http://dvlf.uchicago.edu/mot/{{word}}",
                    o: "http://www.etymonline.com/index.php?allowed_in_frame=0&search={{word}}",
                    r: "http://www.bartleby.com/cgi-bin/texis/webinator/sitesearch?FILTER=col110&query={{word}}"
                }[lang.substr(0, 1)];
                lang = { d: "DVLF", o: "OnlineEtym", r: "Rogets" }[lang.substr(0, 1)];
                break;
            case "wordreference":
                if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, lang, "+", ["reverse"]),
                    word = e.word,
                    lang = e.lang;
                url = "http://www.wordreference.com/{{lang}}/{{word}}";
                break;
            case "linguee":
                url = "http://www.linguee.com/{{lang}}/search?source=auto&query={{word}}";
                break;
            case "woxikon":
                url = "http://www.woxikon.de/{{lang}}/{{word}}.php";
                break;
            case "beolingus":
                lang = { deen: "de-en", deenex: "de-en-ex", dees: "de-es", deesex: "de-es-ex", dept: "de-pt", deptex: "de-pt-ex", syn: "dict-de", quote: "fortune-de" }[lang]
                url = "http://dict.tu-chemnitz.de/dings.cgi?o=302;service=dict-de;iservice={{lang}};optfold=0;query={{word}}";
                break;
            case "thefreedictionary":
                url = "http://{{lang}}.thefreedictionary.com/{{word}}";
                break;
            case "iate":
                url = "http://iate.europa.eu/SearchByQuery.do?method=search&sourceLanguage={{lang}}&domain=&matching=&typeOfSearch=s&fromSearchResults=yes&saveStats=true&targetLanguages=s&query={{word}}&valid=Search";
                break;
            case "eurovoc":
                url = "http://eurovoc.europa.eu/drupal/?q=search/advanced&cl={{lang}}&type=1&release=All&stemming=1&case=&fieldtypes=PT,SN,HN,DEF&page=1&text={{word}}";
                break;
            case "pons":
                url = "http://en.pons.com/translate?l={{lang}}&q={{word}}";
                break;
            case "dictcc":
                url = "http://{{lang}}.dict.cc/?s={{word}}";
                break;
            case "urbandictionary":
                url = "http://www.urbandictionary.com/define.php?term={{word}}";
                break;
            case "wortschatzunileipzig":
                url = "http://corpora.informatik.uni-leipzig.de/fr/webservice/index?limit=30&corpusId={{lang}}&action=loadExamples&word={{word}}";
                break;
            case "duden":
                word = stringK.replaceDiacritics(word).replace(/\-/g, '');
                url = "http://www.duden.de/rechtschreibung/{{word}}";
                break;
            case "leodict":
                url = "http://dict.leo.org/{{lang}}/?&search={{word}}";
                break;
            case "memidex":
                url = "http://www.memidex.com/{{word}}";
                break;
            case "dictionarycom":
                if (dv.langPair.indexOf("Translate") > -1) {
                    lang = dv.langPair;
                    word = stringK.replaceDiacritics(phrase);
                    lang = lang.substring(0, lang.indexOf("#") - 1).toLocaleLowerCase().trim().replace(/[\s]/gi, '\/');
                    url = "http://translate.reference.com/{{lang}}/{{word}}";
                } else {
                    if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, "", "+", ["dictionary", "thesaurus"]),
                        word = e.word,
                        lang = e.lang;
                    url = "http://www.{{lang}}.com/browse/{{word}}";
                }
                break;
            case "merriamwebster":
                if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, "", "+", ["dictionary", "thesaurus", "spanish"]),
                    word = e.word,
                    lang = e.lang;
                url = lang != "spanish" ? "http://www.merriam-webster.com/{{lang}}/{{word}}" : "http://www.spanishcentral.com/translate/{{word}}";
                break;
            case "almaany":
                url = "http://www.almaany.com/{{lang}}/dict/ar-en/{{word}}";
                break;
            case "collins":
                url = "http://www.collinsdictionary.com/dictionary/{{lang}}/{{word}}";
                break;
            case "oxforddictionaries":
                url = "http://www.oxforddictionaries.com/definition/{{lang}}/{{word}}";
                break;
            case "iate":
                url = "http://iate.europa.eu/SearchByQuery.do?method=search&query={{word}}&sourceLanguage=s&&targetLanguages=s";
                break;
            case "dwds":
                url = "http://www.dwds.de/wb/" + word;
                break;
            case "raes":
                if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, "", "+", ["dle", "dpd", "desen", "castellano", "sinant", "etimologias","lar1"], 3),
                    word = e.word,
                    lang = e.lang;
                if (lang == "sinonimi") lang = "sinant";
                url = {
                    dle: "http://{{lang}}.rae.es/srv/search?w={{word}}",
                    dpd: "http://lema.rae.es/{{lang}}/srv/search?key={{word}}",
                    desen: "http://lema.rae.es/{{lang}}/srv/search?key={{word}}",
                    etimologias: "http://etimologias.dechile.net/?{{word}}"
                }[lang];
                if (url == null) url = lang.indexOf("lar") > -1 ? ("http://www.diccionarios.com/detalle.php?palabra={{word}}&" + {
                        lar1: "dicc_100=on&dicc_52=on&dicc_106=on&dicc_78=on&dicc_79=on&dicc_80=on&dicc_107=on",
                        lar2: "dicc_55=on&dicc_54=on&dicc_74=on&dicc_73=on",
                        lar3: "dicc_57=on&dicc_56=on&dicc_75=on&dicc_76=on",
                        lar4: "dicc_83=on&dicc_84=on"
                    }[lang]) :
                    (lang = {castellano:"castellano",sinant:"sinonimos-antonimos",esin:"espanol-ingles",ines:"ingles-espanol"}[lang],
                    "http://servicios.elpais.com/diccionarios/{{lang}}/{{word}}");
                break;
            case "reverso":
                tts = lang.indexOf("voice") > -1;
                tts ? (lang = lang.replace("voice", "").trim(), lang = stringK.toUpperCaseFirst(lang), word = stringK.base64.encode(phrase)) : "";
                url = tts ? "http://voice2.reverso.net/RestPronunciation.svc/v1/output=json/GetVoiceStream/voiceName={{lang}}?inputText={{word}}" :
                    "http://context.reverso.net/translation/{{lang}}/{{word}}";
                break;
            case "chambers":
                if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, "", "+", ["21st", "thes", "biog"]),
                    word = e.word,
                    lang = e.lang;
                lang = { 2: "21st", t: "thes", b: "biog" }[lang.substr(0, 1)];
                url = "http://www.chambers.co.uk/puzzles/search/?query={{word}}&title={{lang}}";
                break;
            case "cedict":
                if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, "", "+", ["simplified", "traditional", "hanzidico", "jukuu", "dvo"]),
                    word = e.word,
                    lang = e.lang;
                lang = lang.toLowerCase();
                url = {
                    "simplified": "http://www.mdbg.net/chindict/chindict.php?page=worddict&wdrst=0&wdqtm=0&wdqcham=2&wdqt={{word}}",
                    "traditional": "http://www.mdbg.net/chindict/chindict.php?page=worddict&wdrst=1&wdqtm=0&wdqcham=2&wdqt={{word}}",
                    "hanzidico": "http://www.hanzidico.com/php/getJsonData.php?query={{word}}&rformat=json&qtype=all",
                    "jukuu": "http://www.jukuu.com/search.php?q={{word}}",
                    "dvo": "http://dict.dvo.ru/dict.php?word={{word}}&strategy=definition&dictionary=*"}[lang];
                break;
            case "linguatec":
                word = encodeURIComponent(phrase);
                lang = lang.toUpperCase();
                url = "http://vrweb.linguatec.net/vrweb/popup1_ptonline?dir=0&srctext={{word}}&lang={{lang}}&guilang=en&readcontent=all&srctype=text&srccharset=utf8&customerid=00000102&cache=0&sndpitch=100&sndspeed=100&sndtype=1&sndquality=4&sndgender=W&simpleparse=1&alt=1"
                break;
            case "ispeech":
                url = "http://api.ispeech.org/api/rest?action=convert&text={{word}}&voice={{lang}}&format=mp3&apikey={{apikeyIspeach}}";
                url = url.replace('{{apikeyIspeach}}', (lang == "obama" || lang == "bush") ? "zzzzzzzzzzzzzzzzaaaaaaaaaaaaaaaa" : "ispeech-listenbutton-betauserkey");
                break;
            case "responsivevoiceorg":
                word = phrase;
                lang = lang.replace(/\b[a-z]/g, letter => letter.toUpperCase()).replace("Uk", "UK");
                url = "https://code.responsivevoice.org/getvoice.php?t={{word}}&tl={{lang}}&sv=";
                break;
            case "triantafyllides":
                if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, "", "+", ["triantafyllides","georgakas","reverse","all"],1),
                    word = e.word,
                    lang = e.lang;
                lang = (lang == "all") ? "" : lang + "/";
                url = "http://www.greek-language.gr/greekLang/modern_greek/tools/lexica/{{lang}}search.html?lq={{word}}&dq";
                break;
            case "gramota":
                url = "http://www.gramota.ru/slovari/dic/?word={{word}}&all=x";
                break;
            case "dsal":
                if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, "", "+", ["apte","bahri","barker","berntsen","biswas-bangala-Bangala","brown-1903","burrow","candrakanta","carter","caturvedi","collett","dames-sketch-Sketch","dames-textbook-Text-book","dasa-hindi-Hindi","fabricius","fallon","grierson","gundert","gwynn","hayyim","kadirvelu","lorrain","macalister","macdonell","mcalpin","mewaram","molesworth","mumtaz","pali","platts","praharaj","raverty","schmidt","shakespear","singh","soas","steingass","tamil-lex","tulpule","turner","vaze","winslow",],3),
                    word = e.word,
                    lang = e.lang;
                url = "http://dsalsrv02.uchicago.edu/cgi-bin/philologic/search3advanced?dbname={{lang}}&query={{word}}&matchtype=exact&display=utf8";
                break;
            case "treccani":
                if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, "", "+", ["vocabolario","sincon","enciclopedia","crusca"]),
                    word = e.word,
                    lang = e.lang;
                if (lang == "sinonimi") lang = "sincon";
                url = (lang == "crusca") ? "http://www.lessicografia.it/Controller?SettImpostazioni=LancioRicerca&q1={{word}}&maxresults=10&submit=Cerca+Voci&q2=&TipoSequenza=0&q3=&distanzaMax=1&Apparato1=1&Apparato2=1&Apparato3=1&Apparato4=1&EdCrusca5=1&EdCrusca1=1&EdCrusca2=1&EdCrusca3=1&EdCrusca4=1&Giunte1=1&Giunte2=1&Giunte3=1&Giunte4=1&Integrazioni=1&IgnoraAccenti=1&TipoVisualizzazione=1&TipoOrdinamento=1&TipoRicerca=0&EvidenziaKeyword=1&EvidenzSfondoContesto=1&EvidenzSfondoMicroContesto=1":
                                           (lang = { vocabolario: "", sincon: "_(Sinonimi-e-Contrari)", enciclopedia: "enciclopedia" }[lang],
                                            "http://www.treccani.it/" + (lang.indexOf("enciclo") > -1 ? (lang = "" ,"enciclopedia") : "vocabolario") + "/{{word}}{{lang}}/")
                break;
            case "sapere":
                lang = dv.langPair.substring(0, dv.langPair.indexOf("#") - 1).trim();
                if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, "", "+", ["italiano","sinonimi","contrari"]),
                    word = e.word,
                    lang = stringK.toUpperCaseFirst(lang)(e.lang);
                url = "http://saperelb-538884594.eu-west-1.elb.amazonaws.com/sapere/" +  
                      (lang.indexOf("-") > -1 ? 
                            (lang.indexOf("Italiano-") > -1 ? ("search.html?q=" + word + "&tipo_traduzione=" + lang + "&cerca=traduzioni&x=0&y=0"):
                                                              ("dizionari/traduzioni/" + lang + "/" + word.substr(0, 1).toUpperCase() + "/" + encodeURIComponent(word) + ".html?q_search=" + word)):  
                                                              ("dizionari/dizionari/"  + lang + "/" + word.substr(0, 1).toUpperCase() + (lang == "Italiano" ? ("/" + word.substr(0, 2).toUpperCase() + "/") : "/") + encodeURIComponent(word) + ".html?q_search=" + word));
                break;
            case "corriere":
                if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, "", "+", ["nuomau","sabcol","sincon","citazioni","modididire"],2),
                    word = e.word,
                    lang = e.lang;
                if (lang == "sinonimi") lang = "sincon";
                lang = {nuomau:"", sabcol: "_italiano", sincon: "_sinonimi_contrari", citazioni: "-citazioni", modididire: "-modi-di-dire", init: "_inglese/Inglese", itin: "_inglese/Italiano", spit: "_spagnolo/Spagnolo", itsp: "_spagnolo/Italiano", frit: "_francese/Francese", itfr: "_francese/Italiano", itte: "_tedesco/Italiano", teit: "_tedesco/Tedesco" }[lang];
                url = (lang != "") ? ("http://dizionari.corriere.it/dizionario" + lang + "/" + word.substr(0, 1).toUpperCase() + "/{{word}}.shtml") :
                                      "http://dizionario.internazionale.it/parola/{{word}}";
                break;
            case "jmdict":
                if (word.indexOf("+") > -1) var e = stringK.isWildCard(word, "", "+", ["jmdict","weblio"]),
                    word = e.word,
                    lang = e.lang;
                url = {"jmdict": "http://tangorin.com/dict.php?dict=general&s={{word}}",
                       "weblio": "http://ejje.weblio.jp/content/{{word}}"}[lang];

                break;            
            case "googletranslate":
                if (phrase.indexOf("+") > -1) {
                    let w = phrase;
                    w = w.split("+", (w.match(/\+/g) || []).length + 1);
                    if(w.slice(-1)[0].toLocaleLowerCase().indexOf("tts") > -1) {
                        let l = w.slice(-1)[0].trim().toLocaleLowerCase().replace("tts", "");
                        l.length == 2 && (lang = l, tts = true),
                        w.pop(), phrase = w.join("+");
                    }
                }
                let g = 1;
                url = "https://translate.google.com";
                url = (tkk == '') ? url :
                      (tts ? ((g == 0) ? url + "/translate_a/single?client=t&sl=auto&tl={{lang}}&hl=en&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&otf=2&ssel=0&tsel=0&kc=1&tk={{tkn}}&q={{word}}" :
                                         url + "/translate_tts?ie=UTF-8&q={{word}}&tl={{lang}}&total=1&idx=0&textlen={{textlen}}&client=t&tk={{tkn}}") :
                                         url + "/?text={{word}}&hl={{lang}}&langpair=auto&tbb=1");
                break;
            default:
                url = "", lang = "", word = phrase;

                break;
        }

        word = word.replace(/[\+]/gi, " ");

        if (dico == "googletranslate") {
            word = phrase.replace(/[\+]/gi, " ");
            word = tts ? stringK.trunc(word, word.length, 200) : word;
        }

        url = (dico == "googletranslate") ?
              (tts ? url.replace('{{word}}', ggt.URLEncode(word)).replace('{{lang}}', lang).replace('{{textlen}}', word.length).replace('{{tkn}}', ggt.Tk(word)) :
                     url.replace('{{lang}}', lang).replace('{{word}}', ggt.URLEncode(word))) :
                     url.replace('{{lang}}', lang).replace('{{word}}', word);

        dv = { "dico": dico, "word": word, "lang": lang, "url": url, tts: tts };
        return dv;
    }
})();
