(function() {

    //"use strict";

    var pM = {
        modifierKey: "",
        keyPressed: "",
        keyCodes: {
            16: "shift",
            17: "ctrl",
            18: "alt",
            37: "left arrow",
            38: "up arrow",
            39: "right arrow",
            40: "down arrow",
            51: "3quote",
            60: "<",
            65: "a",
            81: "q",
            83: "s",
            84: "t",
            90: "z",
            160: "^",
            163: "#",
            224: "meta",
        },
        currentSelection: "",
        popup: false,
        rpt: false,
        oRect: {},
        timer: "",
        rnk: "",
        kMenuContainer: null,
        kMenuContainerShow: null,
        kMenuContainerHide: null,
        html: function(tag, attrs, parent) {
            if (!attrs) attrs = {};
            var elm = document.createElement(tag);
            for (var i in attrs) {
                elm.setAttribute(i, attrs[i]);
            }
            if (parent) parent.appendChild(elm);
            return elm;
        },
        popupIcons: function() {

            if (pM.popup && pM.kMenuContainer == null) {

                pM.kMenuContainer = pM.html("div", {
                    class: "k-menu--container k-easeIn",
                    style: "display:none"
                }, document.body);

                var kVoice = pM.html("div", {
                    class: "k-menu--icons k-voice",
                    style: "background-position: 6px 6px;",
                    title: "Voice"
                }, pM.kMenuContainer);

                var kStack = pM.html("div", {
                    class: "k-menu--icons k-stack",
                    style: "background-position: 6px -12px;",
                    title: "Change"
                }, pM.kMenuContainer);

                var kDictionary = pM.html("div", {
                    class: "k-menu--icons k-dictionary",
                    style: "background-position: 6px -30px;",
                    title: "Show"
                }, pM.kMenuContainer);
            }

            return;
        },
        keyDown: function(e) {

            if (e.repeat != undefined) pM.rpt = e.repeat;

            if (pM.rpt) return;

            pM.keyPressed = pM.keyCodes[e.keyCode];

            if (pM.keyPressed === pM.modifierKey) {

                pM.timer = new Date().getTime();

                document.body.addEventListener("mouseup", pM.mouseUp, true);
            }
        },
        mouseUp: function(e) {

            var selection = window.content.getSelection();

            if (selection.toString().length > 0 && (new Date().getTime() - pM.timer) < 2000) {

                pM.oRect = pM.getCoords(e);

                pM.currentSelection = selection.toString();

                (pM.popup) ? pM.kIconsMenu(pM.oRect):
                    self.port.emit("sendGetRequest", {
                        TTS: false,
                        position: pM.oRect,
                        selection: pM.currentSelection
                    });
            }

            document.body.removeEventListener('mouseup', pM.mouseUp, true);
        },
        getCoords: function(e) {

            var x = 0,
                dx = ((window.innerWidth + document.documentElement.scrollLeftMax) - (e.clientX + document.documentElement.scrollLeft) - 500 - 10) || 0,
                y = 0,
                dy = ((window.innerHeight + document.documentElement.scrollTopMax) - (e.clientY + document.documentElement.scrollTop) - 300 - 50 + 13) || 0;

            if (!e) var e = window.event;
            if (e) {
                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                dx = (dx > 0) ? 0 : (dx - 50);
                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                dy = (dy > 0) ? 0 : (dy - 30);
            }

            return {
                "top": y,
                "left": x,
                "delta": { "x": dx, "y": dy }
            };
        },
        kIconsMenu: function(p) {

            pM.kMenuContainer.style.display = "none";
            pM.kMenuContainer.style.top = p.top + 'px';
            pM.kMenuContainer.style.left = p.left + 'px';

            clearTimeout(pM.kMenuContainerShow);

            clearTimeout(pM.kMenuContainerHide);

            pM.kMenuContainerShow = setTimeout(function() {

                pM.kMenuContainer.style.display = "flex";

                document.body.addEventListener("click", pM.isClickIconsMenu, true);
            }, 100);
        },
        isClickIconsMenu: function(e) {

            var tts = "",
                target = e.target;

            if (target == pM.kMenuContainer || target.parentNode == pM.kMenuContainer) {

                if (/k-stack/.test(target.className)) tts = pM.changeDict();

                if (/k-voice/.test(target.className)) tts = true;
                if (/k-dictionary/.test(target.className)) tts = false;

                if (typeof tts === 'boolean') {

                    pM.kMenuContainer.style.display = "none";

                    self.port.emit("sendGetRequest", {
                        TTS: tts,
                        position: pM.oRect,
                        selection: pM.currentSelection
                    });

                    document.body.removeEventListener('click', pM.isClickIconsMenu, true);
                }
            } else if (target.className != "k-d--l") {

                pM.kMenuContainerHide = setTimeout(function() {

                    pM.kMenuContainer.style.display = "none";

                    if (pM.kMenuContainer.querySelector(".k-dictionary--list") != null) pM.kMenuContainer.querySelector(".k-dictionary--list").remove();

                }, 500);

                document.body.removeEventListener('click', pM.isClickIconsMenu, true);
            } else {}
        },
        changeDict: function() {

            if (pM.kMenuContainer.querySelector(".k-dictionary--list") == null) {

                let ol = pM.html("div", {
                            class: "k-dictionary--list k-easeIn",
                            style: "",
                            }, pM.kMenuContainer),
                    IDs = [],
                    d = ["Almaany","ARFTL","BabLa","Beolingus","CEDict","Chambers","CNRTL","Collins",
                        "DictCC","DictionaryCom","LEODict","Duden","DWDS","EuroVoc","GoogleTranslate",
                        "IATE","ISpeech","Larousse","Linguatec","Linguee","Littre","Memidex","MerriamWebster",
                        "OxfordDictionaries","PONS","RAEs","Reverso","TheFreeDictionary","UrbanDictionary",
                        "WordReference","WortschatzUniLeipzig","Woxikon","ResponsiveVoiceOrg","Triantafyllides",
                        "Gramota","DSAL","Treccani","Sapere","Corriere","JMDict","Notes"],
                    ul = document.createElement("ul");


                pM.listDict(pM.rnk, IDs, d, ul, 0, 12, 11);

                ol.appendChild(ul);

                ol.addEventListener("click", function(e) {

                    let ID = e.target.parentElement.name;

                    if (IDs.indexOf(ID) > -1) {

                        self.port.emit("setDefaultValues", {
                            "pref": "default",
                            "name": ID.toLocaleLowerCase()
                        });

                        this.removeEventListener('click', arguments.callee);

                        ol.remove();
                    }

                    if (ID == "k-more--tag") ol.querySelector("#k-more--tag").remove(),
                        pM.listDict(pM.rnk, IDs, d, ul, 12, pM.rnk.length, null),
                        ol.appendChild(ul);
                });
            }
        },
        listDict: function(PMRnk, IDs, d, ul, a, b, c) {

            let rnk = PMRnk.slice(a, b);

            for (var i = 0; i < rnk.length; i++) {

                let li = document.createElement("li"),
                    span = document.createElement("span");
                
                IDs.push(d[rnk[i] - 1]);

                li.id = IDs[i+a];
                li.name = li.id;

                span.textContent = IDs[i+a];
                span.className = "k-d--l";

                li.appendChild(span);
                ul.appendChild(li);

                if (c != null && i == c) {
                    let li = document.createElement("li"),
                        span = document.createElement("span");
                    li.id = "k-more--tag";
                    li.name = "k-more--tag";
                    span.textContent = " +...";
                    span.className = "k-d--l";
                    li.appendChild(span);
                    ul.appendChild(li);
                }
            }
        }

    };

    self.port.on("options_", function(o) {

        pM.modifierKey = o.hotkeysConfig.modifier;

        pM.popup = (o.hotkeysConfig.popupIcons == "true") ? true : false;

        pM.rnk = o.rankDict;

        if (pM.popup) {
            pM.popupIcons();
            document.querySelector(".k-voice").title = (function voice(p) {
                return p[0] + "|" + p[1].substring(p[1].indexOf("#") + 2, p[1].length);
            })(o.default.tts);
            document.querySelector(".k-dictionary").title = (function dict(p) {
                return p.dico + "|" + p.langPair.substring(0, p.langPair.indexOf("#") - 1);
            })(o.default);
        }
    });

    if (pM.modifierKey != "none") {

        document.body.onkeydown = pM.keyDown;

        document.body.onkeyup = function() { pM.rpt = false; };
    }

})();
