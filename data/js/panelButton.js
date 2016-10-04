"use strict";
                            /*--------------------Build a pretty list of dict | lang + Titles*/
var build = {  
        IDsBy: function(json, r) {

            var y = [];
            if (r.length < Object.keys(json).length)
                for (var i = r.length; i < Object.keys(json).length; i++) r.push(i + 1);
            for (var i in r) { y.push(Object.keys(json)[r[i] - 1]) }
            return y
        },
        dictionaries: function(json, IDs, ol) {

            for (var i = 0; i < IDs.length; i++) {
                var li = document.createElement("li");
                li.id = IDs[i];
                li.name = li.id;
                li.textContent = build.Utf8Decode(json[IDs[i]].title);
                ol.appendChild(li);
            }
        },
        newRank: function(json, rank) {

            var olli = document.querySelectorAll("ol li"),
                r = [];

            for (var i = 0; i < olli.length; i++) {
                r.push(json[olli[i].id].rank);
            }

            build.prefs.new_("rankDict", "rankDict", r);

            self.port.emit("setDefaultValues", prefs);
        },
        headers: function(titleDico, titleLang, ol, o) {
            titleDico.textContent = build.Utf8Decode(ol.querySelector("#" + o.dico).textContent);
            titleLang.textContent = "-- " + build.Utf8Decode(o.langPair);
        },
        Utf8Decode: function(strUtf) {
            var strUni = strUtf.replace(
                /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,
                function(c) {
                    var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                    return String.fromCharCode(cc);
                }
            );
            strUni = strUni.replace(
                /[\u00c0-\u00df][\u0080-\u00bf]/g,
                function(c) {
                    var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                    return String.fromCharCode(cc);
                }
            );
            return strUni;
        },
        prefs: {
            pref: "", name: "", value: "",
            new_: function(a, b, c) {
                this.pref = a;
                this.name = b;
                this.value = c;
                prefs = this;
            }
        }
    },
    prefs = {};
                             /*--------------------LISTEN TO PARAMETERS-----------------------*/
self.port.once("InitDicoList", function(obj) { 

    var json_ = JSON.parse(obj.json_),
        lang = [],
        langv = "";

    var ID = obj.default.dico,
        rank = JSON.parse(obj.sdl),
        inptk = $("input.typeahead");

    var ol = document.getElementById("sortable"),
        titleDico = document.getElementById("dicoTitle"),
        titleLang = document.getElementById("langTitle"),
        dtxt = document.createTextNode(json_[ID].title),
        ltxt = document.createTextNode("-- " + obj.default.langPair);

                            
                            /*--------------------BUILD LIST-------------------------------*/
    var IDs = build.IDsBy(json_, rank) 

    titleDico.appendChild(dtxt);

    titleLang.appendChild(ltxt);

    build.dictionaries(json_, IDs, ol);

    self.port.on("Headers", function(o) {
        build.headers(titleDico, titleLang, ol, o);
    });
                            
                            /*--------------------THAT LIST IS MADE SORTABLE----------------*/
    $("#sortable").sortable();

    $("#sortable").sortable().bind('sortupdate', function() {

        build.newRank(json_, rank);
    });
                            
                            /*--------------------MONITOR CHANGE IN PARAMETERS-------------*/
    inptk.val("");

    ol.onclick = function(e) {

        if (e.target === ol) return;

        ID = e.target.name;

        build.prefs.new_("default", ID, "");

        self.port.emit("setDefaultValues", prefs);

                            /*--------------------AUTOCOMPLETE VIA typeahead.js----------------*/
        inptk.typeahead('destroy');

        var select = function(e, datum, dataset) {

                inptk.val("");
                if (datum.val != null || datum.val != "") {
                    if (datum.val.indexOf("# Translate") > -1) {
                        selected.push(datum.val.substr(0, datum.val.indexOf("# Translate") - 1));
                        if (selected.length == 1) inptk.attr("placeholder", "Select the target language");
                        inptk.val("");
                        if (selected.length == 2) {
                            selected.push("# Translate");
                            build.prefs.new_("langPair", ID, selected.toString().replace(/,/g, " "));
                            self.port.emit("setDefaultValues", prefs);
                            inptk.attr("placeholder", "language, dictionary, thesaurus");
                            selected = [];
                        }
                    } else {
                        build.prefs.new_("langPair", ID, datum.val);
                        self.port.emit("setDefaultValues", prefs);
                    }
                }

            },
            selected = [],
            filter = function(suggestions) {
                return $.grep(suggestions, function(suggestion) {
                    return $.inArray(suggestion.val, selected) === -1;
                });
            },
            data = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('val'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                limit: 10,
                local: $.map(json_[ID].lang, function(l) {
                    return {
                        val: build.Utf8Decode(l)
                    };
                })
            });

        data.initialize();

        inptk.typeahead({
            highlight: true,
            minLength: 1
        }, {
            name: 'languages',
            displayKey: 'val',
            source: function(query, cb) {
                data.get(query, function(suggestions) {
                    cb(filter(suggestions));
                });
            },
            templates: { empty: 'No matches' }
        }).bind('typeahead:selected', select);

        inptk.val("");
    };
});

                            /*----------------------USER CONFIGS------------------------------*/
self.port.once('nav_listener', function(obj) {

    /* ----------------- Slide and push right menu*/
    var pushRight = new Menu({
        wrapper: '#o-wrapper',
        type: 'push-right',
        menuOpenerClass: '.c-button',
        maskId: '#c-mask'
    });

    var pushRightBtn = document.querySelector('#c-button--push-right');

    pushRightBtn.addEventListener('click', function(e) {
        e.preventDefault;
        pushRight.open();
    });

    var configs = Object.keys(obj);

    for (var i in configs) { /* ----------------- Set user default values (help tab)*/

        switch (true) {

            case configs[i] == "hotkeysConfig":

                var selct = Object.keys(obj.hotkeysConfig);

                for (var i in selct) {

                    document.getElementById(selct[i] + "--" + obj.hotkeysConfig[selct[i]]).selected = true;
                }

                break;
            case configs[i] == "consolePosition":

                document.getElementById("consolePosition").children["top"].value = obj.consolePosition["top"];
                document.getElementById("consolePosition").children["left"].value = obj.consolePosition["left"];
                break;
            default:
                break;
        }
    }

    document.getElementById("c-menu--push-right").onchange = function(e) { /*------------------- Monitor configs change */

        var name_ = (e.target.type == 'number') ? e.target.attributes["name"].value : e.target.children[1].attributes["name"].value;

        if (e.target.type == 'select-one') {

            var modifier = document.getElementById(name_);
            modifier.options[modifier.options.selectedIndex].selected = true;
        }

        e.target.parentNode.id = /(^hotkeys)/.test(e.target.parentNode.id) ? "hotkeysConfig" : e.target.parentNode.id;

        build.prefs.new_(e.target.parentNode.id, name_,
            (e.target.type == 'number') ? parseInt(e.target.value) : e.target.value);
        self.port.emit("setDefaultValues", prefs);
    };

    self.port.on("detach", function() {
        return false;
    });
});
                            /*---------------------SLIDE AND PUSH RIGHT MENU EFFECT------------*/
                            /**credits: http://callmenick.com/post/slide-and-push-menus-with-css3-transitions **/
(function(window) {

    'use strict';

    /**
     * Extend Object helper function.
     */
    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    /**
     * Each helper function.
     */
    function each(collection, callback) {
        for (var i = 0; i < collection.length; i++) {
            var item = collection[i];
            callback(item);
        }
    }

    /**
     * Menu Constructor.
     */
    function Menu(options) {
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }

    /**
     * Menu Options.
     */
    Menu.prototype.options = {
        wrapper: '#o-wrapper',
        type: 'push-right',
        menuOpenerClass: '.c-button',
        maskId: '#c-mask'
    };

    /**
     * Initialise Menu.
     */
    Menu.prototype._init = function() {
        this.body = document.body;
        this.wrapper = document.querySelector(this.options.wrapper);
        this.mask = document.querySelector(this.options.maskId);
        this.menu = document.querySelector('#c-menu--' + this.options.type);
        this.closeBtn = this.menu.querySelector('.c-menu__close');
        this.menuOpeners = document.querySelectorAll(this.options.menuOpenerClass);
        this._initEvents();
    };

    /**
     * Initialise Menu Events.
     */
    Menu.prototype._initEvents = function() {
        // Event for clicks on the close button inside the menu.
        this.closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            this.close();
        }.bind(this));

        // Event for clicks on the mask.
        this.mask.addEventListener('click', function(e) {
            e.preventDefault();
            this.close();
        }.bind(this));
    };

    /**
     * Open Menu.
     */
    Menu.prototype.open = function() {
        this.body.classList.add('has-active-menu');
        this.wrapper.classList.add('has-' + this.options.type);
        this.menu.classList.add('is-active');
        this.mask.classList.add('is-active');
        this.disableMenuOpeners();
    };

    /**
     * Close Menu.
     */
    Menu.prototype.close = function() {
        this.body.classList.remove('has-active-menu');
        this.wrapper.classList.remove('has-' + this.options.type);
        this.menu.classList.remove('is-active');
        this.mask.classList.remove('is-active');
        this.enableMenuOpeners();
    };

    /**
     * Disable Menu Openers.
     */
    Menu.prototype.disableMenuOpeners = function() {
        each(this.menuOpeners, function(item) {
            item.disabled = true;
        });
    };

    /**
     * Enable Menu Openers.
     */
    Menu.prototype.enableMenuOpeners = function() {
        each(this.menuOpeners, function(item) {
            item.disabled = false;
        });
    };

    /**
     * Add to global namespace.
     */
    window.Menu = Menu;
})(window);
