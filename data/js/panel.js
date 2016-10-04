"use strict";

var element = {
    baseUrl: function(base, urlR) {

        var a = document.body.querySelectorAll("a[href^= '" + urlR + "']");

        for (var i = 0; i < a.length; i++) {
            a[i].setAttribute("href", base + urlR);
        }
    },
    cedict: function(json_, fragment) {
        var tr = '',
            defcontent = ["Exact", "Begin", "Content", "Charsdefcontent", "Wordsdefcontent"],
            tabletitle = ["Simpl. 中", "Trad. 文", "Pīnyīn 拼 音", "Zhùyīn Fúhào / Bopomofo 注 音",
                "Def. French 定", "Def. English 义"],
            res = [""],
            d = ["SIMP", "TRAD", "PINYIN", "ZHUYIN", "DEF_FR", "DEF_EN"],
            table = document.createElement("table"),
            tbody = document.createElement("tbody"),
            tr = document.createElement("tr");

        table.className = "dicoTable";

        tabletitle.forEach(function(element, index, array) {
            var th = document.createElement("th");
            th.textContent = element;
            tr.appendChild(th);
        })

        tbody.appendChild(tr);

        for (var i in defcontent) {

            res = json_.ResultSet.Dico[0][defcontent[i]];
            (typeof res != 'boolean' && res != null) ? res.forEach(function(element, index, array) {

                var tr = document.createElement("tr");
                tr.className = "tablerow";
                for (var j in d) {
                    var td = document.createElement("td");
                    td.textContent = element[d[j]];
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }): "";
        }
        table.appendChild(tbody);
        fragment.appendChild(table);
    },
    copyright: function(url, word) {

        var base = url.substr(0, url.indexOf("/", 7));

        var  blckq = document.createElement("blockquote"),
            p = document.createElement("p"),
            a = document.createElement("a"),
            bs = document.createTextNode(base),
            wd = document.createTextNode(word),
            lr = document.createElement("span"),
            lfc = document.createElement("span"),
            lc = document.createElement("span");

        blckq.className = "cpright";

        a.href = url
        a.target = "_blank";

        lr.appendChild(bs);
        lr.className = "lien_racine";
        lfc.appendChild(wd);
        lfc.className = "lien_fin_coupee";
        lc.appendChild(lr);
        lc.appendChild(lfc);
        lc.className = "lien_court";

        a.appendChild(lc);
        p.textContent = "Source: ";
        p.appendChild(a);

        blckq.appendChild(p);

        return blckq;
    },
    style: function(fragment, target, css) {
        var el = fragment.querySelector(target),
            p = Object.keys(css);
        for (var i in p) {
            el.style[p[i]] = css[p[i]];
        };
    },
    section: function(all, wrPage, tag, fragment) {

        let section="";

        if (all) {

            section = wrPage.querySelectorAll(tag);

            for (var i = 0; i < section.length; i++) {

                fragment.appendChild(section[i]);
            }
        } else {

            section = wrPage.querySelector(tag);

            if (section != undefined || section != null) {

                fragment.appendChild(section)
            } else {

                fragment.appendChild(document.createTextNode("..."));
            };

        }
    },
    removeEl: function(fragment, a) {

        a.map(function(el) {

            (fragment.querySelector(el) != null) ? fragment.querySelector(el).remove(): "";
        });
    },
    removeElAll: function(fragment, e) {

        var df = fragment.querySelectorAll(e);

        for (var i = 0; i < df.length; i++) {

            df[i].parentNode.removeChild(df[i]);
        }
    },
    html: function(tag, attrs, parent) {
        if (!attrs) attrs = {};
        var elm = document.createElement(tag);
        for (var i in attrs) {
            elm.setAttribute(i, attrs[i]);
        }
        if (parent) parent.appendChild(elm);
        return elm;
    },
    closestById: function closestById(el, el0) { 
        while (el != el0) { 
            el = el.parentNode; 
            if (!el) { return false; } 
        } 
        return true; 
    },
    buildContent: function(param) { /*-------------------CLEAN remote HTML*/

        var parser = new DOMParser(),
            wrPage = parser.parseFromString(param.htmlCLEAN, "text/html"),
            fragment = element.cleanContent(wrPage, param),
            kResultContainer = document.querySelector("#k-result--container"),
            position="";

        if (param.oRect.top == 9) position = "position:fixed";

        param.oRect.top  = param.oRect.top  + param.oRect.delta.y + 10;
        param.oRect.left = param.oRect.left + param.oRect.delta.x + 10;

        (kResultContainer != null) && kResultContainer.remove();

        var kResultContainer = element.html("div", {
                "id": "k-result--container",
                "style": "top: " + param.oRect.top + "px;" +
                         "left:" + param.oRect.left + "px;" +
                          position
            }, document.body),
            resultk = element.html("div", {
                "class": "k-result",
                "id": "k-result"
            }, kResultContainer);

        if(param.note) element.notes.add(kResultContainer, param);

        element.appendContentK(param, fragment, resultk);

        document.body.addEventListener("click", element.removeContentK, true);
    },
    cleanContent: function(wrPage, param) {

        var fragment = document.createDocumentFragment(),
            dico = param.dico,
            word = param.word,
            lang = param.lang;

        switch (dico) { /*-------------------CLEAN wrPage*/
            case "babla":
                element.section(true, wrPage, ".section-block", fragment);
                element.baseUrl('http://en.bab.la', '/dictionary');
                element.removeEl(fragment, ["#babMemorizeTeaser", "#babAdTop", "div.section-block.babDictSug", "#babRTResult", "#showMoreCSDiv2"]);
                break;
            case "cnrtl":
                if (lang == "crisco") {
                    element.section(false, wrPage, "#synonymes", fragment);
                }
                if (lang == "bob") {
                    element.section(true, wrPage, ".fpltemplate", fragment);
                    element.baseUrl("http://www.languefrancaise.net/", "bob/");
                }
                if (lang == "dmf") {
                    var section = wrPage.querySelectorAll("table")[5];
                    section.querySelector("table").style = "";
                    fragment.appendChild(section);
                }
                if (lang == "lexicographie" || lang.substr(0, 4) == "acad" || lang == "bhvf") {
                    element.section(false, wrPage, "#vtoolbar", fragment);
                    element.section(false, wrPage, "#contentbox", fragment);
                    element.style(fragment, "#contentbox", {
                     "font-family": "Georgia,'Times New Roman',Times,serif",
                     "letter-spacing":"0.01em"
                    });
                    var a = fragment.querySelectorAll("a");
                    for (var i = 0; i < a.length; i++) {
                        a[i].href = 'http://www.cnrtl.fr/' + lang.toLowerCase() + '/' + word + '//' + i;
                    }
                }
                break;
            case "littre":
                element.section(false, wrPage, "section.definition", fragment);
                break;
            case "larousse":
                if (lang.indexOf("larousse" > -1)) {
                    element.section(false, wrPage, "article.BlocDefinition", fragment);
                    element.section(false, wrPage, "div.wrapper-search", fragment);
                    var x = wrPage.getElementsByTagName("META"),
                        uri = x[7].content,
                        a = fragment.querySelector(".wrapper-search"),
                        li = fragment.querySelector("nav.section"),
                        nav = ["definition", "locution", "synonyme", "homonyme", "difficulte", "citation"];
                    a = (a != null) ? a.querySelectorAll("a") : [];
                    li = (li != null) ? li.querySelectorAll("li") : [];
                    for (var i = 0; i < li.length; i++) {
                        var e = li[i].querySelector("a"),
                            t = nav[nav.indexOf(e.textContent.slice(0, -1).replace("é", "e").toLowerCase())];
                        e.setAttribute("href", uri + "/" + (null != t ? t : "locution"))
                    }
                    for (var i = 0; i < a.length; i++) a[i].setAttribute("href", uri + "/" + nav[1])
                } else {
                    element.section(false, wrPage, "#col-detalle-derecha", fragment);
                }
                break;
            case "artfl":
                if (lang == "OnlineEtym") {
                    element.section(false, wrPage, "div#dictionary", fragment);
                } else if (lang == "Rogets") {
                    var section = wrPage.querySelector("form").querySelectorAll("table")[4]||wrPage.querySelectorAll("table")[7];
                    fragment.appendChild(section);
                    fragment.querySelectorAll("table")[1].remove();
                    fragment.querySelector("table").width = "";
                    fragment.querySelector("table").className = "rogettable";
                    var a = fragment.querySelectorAll("a");
                    for (var i = 0; i < a.length; i++) { a[i].textContent = a[i].textContent.match(/\d{0,3}\.\s\w*/)[0].match(/\s\w*/)[0]; }
                } else {
                    element.section(false, wrPage, "div.span-15", fragment);
                    element.section(false, wrPage, "div.span-6", fragment);
                    element.removeEl(fragment, ["form"]);
                }
                break;
            case "wordreference":
                element.section(false, wrPage, ".content", fragment);
                element.removeEl(fragment, ["#leftcolumn", "#rightcolumn", "#listen_widget"]);
                if (!param.c) {
                    element.removeEl(fragment, ["#WHlinks", "#headerTabs", "#forumNotes", ".WRreporterror", "#extra_links", "#gtrans", ".other_languages"]);
                }
                break;
            case "linguee":
                element.section(false, wrPage, "#lingueecontent", fragment);
                element.style(fragment, "#lingueecontent", {
                    "fontSize": "0.929em",
                });
                break;
            case "woxikon":
                element.section(false, wrPage, "#content", fragment);
                break;
            case "dictcc":
                var section = wrPage.querySelectorAll("table")[2];
                if (section != null) {
                    section.style = "";
                    section.style.maxWidth = "";
                    section.style.width = "";
                    section.querySelector("tr td:first-child").width = "";
                    section.querySelector("tr td:last-child").width = "";
                    section.querySelector("td.noline").style.backgroundColor = "white";
                    fragment.appendChild(section);
                    fragment.querySelector("table").width = "";
                    element.style(fragment, "table", {
                        "fontSize": "1em",
                    });
                } else {
                    fragment.appendChild(document.createTextNode("..."));
                }
                break;
            case "leodict":
                element.section(true, wrPage, ".section.wgt", fragment);
                break;
            case "dictionarycom":
                if (lang == "dictionary") {
                    element.section(true, wrPage, "section[class^=source]", fragment);
                    element.baseUrl('http://' + lang.toLowerCase() + '.reference.com', '/browse/');
                } else if (lang == "thesaurus") {
                    element.section(false, wrPage, ".synonyms_wrapper", fragment);
                    element.removeEl(fragment, ["ul.tabset", "div.form-block"]);
                    element.removeElAll(fragment, "span.star");
                    element.section(false, wrPage, ".content-block", fragment);
                    element.baseUrl('http://' + lang.toLowerCase() + '.reference.com', '/browse/');
                } else {
                    element.section(false, wrPage, "#translate-form", fragment);
                    var t = document.createElement("p");
                    t.className = "target-area-container";
                    t.textContent = fragment.querySelector(".target-area-container").textContent;
                    var s = document.createElement("p");
                    s.className = "source-area-container";
                    s.textContent = fragment.querySelector(".source-area-container").textContent;
                    fragment.textContent = "";
                    fragment.appendChild(t);
                    fragment.appendChild(s);                    

                    (function(a, b) {
                        if (a.indexOf(b[0]) > -1 || a.indexOf(b[1]) > -1) {
                            var cl = a.indexOf(b[0]) > -1 ? ".source-area-container" : ".target-area-container";
                            if (lang.indexOf("chinese") > -1) fragment.querySelector(cl).style["font-family"] = "'sinkin_sans300_light', 'Microsoft YaHei New', 'Microsoft Yahei', '微软雅黑', 宋体, SimSun, STXihei, '华文细黑', sans-serif ";
                            else fragment.querySelector(cl).style = "font: 17px Amiri,Georgia,serif ; text-align: right;";
                        }
                    })(["arabic", "persian", "hebrew", "chinese-simplified", "chinese-traditional"], lang.split("/"));
                }
                break;
            case "beolingus":
                element.section(false, wrPage, "#dresult1", fragment);
                element.baseUrl('http://dict.tu-chemnitz.de', '/ding');
                break;
            case "thefreedictionary":
                element.section(false, wrPage, "#MainTxt", fragment);
                element.style(fragment, "#MainTxt", {
                    "fontSize": "0.929em",
                });
                break;
            case "urbandictionary":
                element.section(false, wrPage, "#content", fragment);
                element.removeEl(fragment, [".medium-6.columns",".def-store",".ad-panel",".word-list-panel",".definition-count-panel",".def-footer"]);
                break;
            case "memidex":
                element.section(false, wrPage, "body", fragment);
                fragment = fragment.children[0];
                fragment.querySelector("div#t").nextElementSibling.remove();
                fragment.querySelector("div#t").remove();
                break;
            case "collins":
                element.section(false, wrPage, ".definition_content.res_cell_center_content", fragment);
                element.removeEl(fragment, ["#trends_box", "div.breadcrumb.clear", "#search_found", "div.submissions_comments.responsive_float_phone", "#ad_btmslot_a"]);
                if (!param.c) {
                    element.removeEl(fragment, [".socialButtons", ".word-frequency-container", ".content-box-usage"]);
                }
                break;
            case "oxforddictionaries":
                element.section(false, wrPage, ".entryPageContent", fragment);
                element.removeElAll(fragment, ".dictionary_footer");
                element.removeEl(fragment, ["sharePanel"]);
                break;
            case "merriamwebster":
                var cls = wrPage.querySelector(".left-content") !== null ? ".left-content" : ".mw-entry";
                element.section(false, wrPage, cls, fragment);
                element.removeEl(fragment, [".social-sidebar", ".seen-and-heard-block", ".central-abl-box",".mobile-hide"])
                break;
            case "almaany":
                var section = wrPage.querySelector("div.divcontentleft2").children[2];
                fragment.appendChild(section);
                break;
            case "iate":
                element.section(false, wrPage, "#searchResultPage", fragment);
                break;
            case "eurovoc":
                element.section(false, wrPage, "#block-search_advanced-0", fragment);
                element.baseUrl('http://eurovoc.europa.eu/drupal/', '\?q=request');
                break;
            case "pons":
                element.section(false, wrPage, "#" + lang, fragment);
                element.removeEl(fragment, [".lang_header"]);
                element.removeElAll(fragment, [".translation-options"]);
                element.removeElAll(fragment, [".romhead-options"]);
                break;
            case "duden":
                element.section(true, wrPage, "section[id^=block-duden]", fragment);
                break;
            case "wortschatzunileipzig":
                element.section(false, wrPage, ".exampleSencentes", fragment);
                param.url = "http://corpora.uni-leipzig.de/res.php?corpusId=" + lang + "&word=" + encodeURIComponent(word);
                break;
            case "dwds":
                element.section(false,wrPage,".col-md-9",fragment);
                break;       
            case "raes":
                if (lang.indexOf("d") > -1)
                element.section(false, wrPage, "body", fragment),
                fragment = fragment.children[0];
                else if (lang.indexOf("etim") > -1)
                element.section(false, wrPage, ".container", fragment),
                fragment = fragment.children[0].querySelector("article");
                else 
                element.section(false, wrPage, "#resultado-diccionario", fragment),
                fragment = fragment.children[0];
                if (lang == "dpd") fragment.children[0].remove();
                fragment.style["font-family"] = "'Times New Roman',Times,serif",
                fragment.style["font-size"]="1.1em",
                fragment.style["line-height"]="1.5em",
                fragment.style["margin"] = "0px 8px";
                break;
            case "reverso":
                element.section(false, wrPage, "#left-pan", fragment);
                element.removeEl(fragment, ["#share-content", "#search-content", "#examples-bottom"]);
                
                var info = fragment.querySelectorAll('.info_corpus');
                for (var i = 0; i < info.length; i++) {
                    var source = info[i].title;
                    info[i].title = source.substr(source.lastIndexOf("("), source.lastIndexOf(")"));
                }
                element.style(fragment, "#left-pan", {
                    "fontSize": "13px",
                });
                break;
            case "chambers":
                element.section(false, wrPage, "#fullsearchresults", fragment);
                element.style(fragment, "#fullsearchresults", {
                    "fontSize": "0.95em",
                    "font-family": "Georgia,'Times New Roman',Times,serif",
                    "letter-spacing":"0.01em"
                });
                break;
            case "googletranslate":
                //element.section(false, wrPage, "#result_box", fragment);
                var source = document.createElement("p");
                source.className = "result_box";
                source.textContent = wrPage.getElementById("result_box").textContent;
                fragment.appendChild(source);
                var source = document.createElement("p");
                source.className = "source_box";
                source.textContent = wrPage.getElementById("source").textContent;
                fragment.appendChild(source);
                word = decodeURIComponent(word);
         
                (function(a, b) {
                    if (a.indexOf(b) > -1) {
                        var cl = ".result_box";
                        if (b.indexOf("zh") > -1) fragment.querySelector(cl).style["font-family"] = "'sinkin_sans300_light', 'Microsoft YaHei New', 'Microsoft Yahei', '微软雅黑', 宋体, SimSun, STXihei, '华文细黑', sans-serif ";
                        else fragment.querySelector(cl).style = "font: 17px Amiri,Georgia,sans-serif; text-align: right;";
                    }
                })(["ar", "fa", "iw", "zh", "zh-cn", "zh-yue", "zh-tw"], lang); 
               break;
            case "cedict":
                if (lang == "simplified" || lang == "traditional") {
                      element.section(false, wrPage, "table.wordresults", fragment);
                      element.removeElAll(fragment, ".nonprintable");
                  }
                  if (lang == "hanzidico") {
                      element.cedict(JSON.parse(wrPage.body.textContent), fragment);
                      param.url = "http://www.hanzidico.com/dictionnaire-chinois-francais-anglais/?searchValue=" + word;
                  }
                  if (lang == "jukuu") {
                      let td = wrPage.querySelector("table#Table1").querySelector("tr").children;
                      fragment.appendChild(td[0].querySelector("table"));
                      fragment.appendChild(td[1].querySelector("table"));
                      fragment.querySelector("table").width = "";
                  }
                  if (lang == "dvo") {
                      element.section(false, wrPage, "#leftnav", fragment);
                      fragment.getElementById("leftnav").children[0].remove();
                  }
                  if (lang != "dvo") fragment.querySelector("table").style["font-family"] = "'sinkin_sans300_light', 'Microsoft YaHei New', 'Microsoft Yahei', '微软雅黑', 宋体, SimSun, STXihei, '华文细黑', sans-serif";             
                break;
            case "triantafyllides":
                element.section(false,wrPage,"#colM",fragment);
                element.removeEl(fragment, ["#toolbar", ".tags",".basket","#fpage"]);
            break; 
            case "gramota":
                element.section(false,wrPage,".inside.block-content",fragment);
                element.removeEl(fragment, ["#checkWord"]);
                element.style(fragment, ".inside.block-content", {
                     "line-height":"20px",
                     "font-size":"13px"
                    });
            break;
            case "dsal":
                element.section(false, wrPage, "body", fragment);
                fragment = fragment.children[0];
                for (var i = 0; i < 12; i++) {
                    fragment.childNodes[0].remove();
                }
                fragment.style["font-family"] = "'Amiri', serif";
                fragment.style["font-size"] = "17px";
                fragment.style["width"]="100%";

            break;
            case "treccani":
                lang != null && lang.indexOf("crusca") > -1 ? 
                (element.section(false,wrPage,"#corpo_ris",fragment), fragment=fragment.children[0],element.removeEl(fragment, ["#sommario","form","form","#piede","#subpiede","#loghi"])):
                (element.section(false,wrPage,".foglia-content",fragment), element.removeEl(fragment, [".menu",".social.row",".opera.section"]));
            break;
            case "sapere":
                element.section(false,wrPage,".grid_7.alpha",fragment);
                element.removeEl(fragment, ["#breadcrumb",".clear","#dizionario",".addthis_toolbox","#s24square"]);
            break;
            case "corriere":
                lang != "" ? element.section(false,wrPage,"#defin-dx",fragment) :
                             element.section(true,wrPage,".hentry--item__content",fragment),
                             element.removeEl(fragment,["#item_share_dizionario","#div-correzione-suggerimenti-lemma",".letters_list_container"]) ;
            break;
            case "jmdict":
                lang == "jmdict" ? 
                    (element.section(false, wrPage, "#dictEntries.results", fragment),
                     element.removeElAll(fragment, [".icon-plus-sign"]),
                      element.style(fragment, "#dictEntries.results", {
                        "font-family": "'sinkin_sans300_light', 'Microsoft YaHei New', 'Microsoft Yahei', '微软雅黑', 宋体, SimSun, STXihei, '华文细黑', sans-serif"                        
                    })):
                    (element.section(false, wrPage, "#contentBody", fragment),
                     element.removeEl(fragment, ["#pin-guide-wrapper","#side",".topic", ".subMenuTop", ".summaryC", ".summaryR", ".pin-icon-cell",".phraseEjCntAnc",".copyRtTbl"]),
                    element.style(fragment, "#main", {
                        "font-family": "'sinkin_sans300_light', 'Microsoft YaHei New', 'Microsoft Yahei', '微软雅黑', 宋体, SimSun, STXihei, '华文细黑', sans-serif"                        
                    }))

            break;     
            default:                
                return "false";
        }

        fragment.appendChild(element.copyright(param.url, param.word));

        return fragment;
    },
    appendContentK: function(param, fragment, resultk) {

        if (param.status < 400) resultk.appendChild(fragment);
        else {

            if(param.dico=="notes") { element.notes.resize(resultk); return;}

            let kw = ["   (^-^*)", "  ~̯ ~", "    ಠ_ృ", " (>_<)","     (눈_눈)", "   ヽ(`﹏′)ノ", "     (￣o￣) zzZZzzZZ"][parseInt((Math.random() * (5 - 0 + 1)), 10)],
            err=param.status,
            errMessage = ((Math.floor(err/100) === 4) ? ((param.dico === "duden") ? "   \n...Es ist leider ein Fehler aufgetreten " : "   \n...Bad request") :
                         ((Math.floor(err/100) === 5) ?                             "   \n...Service unavailable" : "   \n...Something went wrong"));
            
            resultk.appendChild(document.createTextNode(kw + errMessage));
        }

        var h = Math.ceil(0.15 * (resultk.textContent.length) + 126),
        w = h * 1.62 + 126;            
        resultk.parentNode.style["height"] = h + "px";
        if (w < 500) resultk.parentNode.style["width"] = w + "px";

        var lnk = resultk.querySelectorAll("a"); /*-------------------Any link must open in the browser instead of that panel*/
        for(var i=0; i<lnk.length; i++) lnk[i].target="_blank";
    },
    removeContentK: function(e) {

        var panelk   = document.getElementById("k-result--container"),
            consolek = document.getElementById("divk"),
            isPanelk = element.closestById(e.target, panelk);
            consolek = (consolek != null) ? consolek : panelk;
            
        if (isPanelk || e.target.parentNode == consolek) {
            return;
        } else {
            panelk.style.opacity = 0;
            setTimeout(function() {
                panelk.remove();
            }, 500);
            document.body.removeEventListener("click", element.removeContentK, true);
        }
    },
    notes: {
        add:function(container, param){
            var note, nav, hist = [], tm = "", menu = "";
            
            note = element.html("div", { "id": "note-k", "style": "position:absolute" }, container),
            nav = element.html("div", { "id": "nav-k" }, note),
            nav.textContent = "Note:",
            element.notes.pref = "play";
            element.html("textarea", {}, nav),
            element.html("input",{"id":"keywords-k"},nav),
            element.html("input",{"id":"source-k"},nav),
            menu = element.html("div", {"id":"menu-k"}, nav),
                     element.html("div", { "id": "save-k","style":"cursor: pointer" }, menu).textContent = "Save",
                     element.html("span", {"style":"margin: 0px 1%;"}, menu).textContent = " | ",
                     element.html("div", { "id": "load-k" ,"title":"Load notes (.csv)"}, menu),
                     element.html("div",{},menu.querySelector("#load-k")).textContent="Load",
                     element.html("input",{"name":"file", "id":"csv-k", "type":"file", "accept":".csv"},menu.querySelector("#load-k")),
                     element.html("span", { "id": "hist-k","class":"histstats", "title":"Notes to CSV" }, menu),
                     element.html("div", { "id": "histCount-k", "style": "font-size: 10px;color: #222;" }, menu).textContent = "0",
                     element.html("div", { "id": "bib-k","style":"font-size: 11px;color: #222;margin:0px 8px;", "title":"Parse notes to bib" }, menu).textContent="Bib",
                     element.html("div", { "id": "flashcard-k", "class":"histstats","title": "Play notes" }, menu),
                     element.html("input", {}, element.html("div", {"id":"timer-k"}, menu));        
                     menu.querySelector("#timer-k").querySelector("input").value=4;

            nav.querySelector("#keywords-k").value="#"+param.word;
            nav.querySelector("#source-k").value=param.dico=="notes" ? document.URL : param.url;
            self.port.on("historyNotes", h => {            
                hist = h,nav.querySelector("#histCount-k").textContent = h.length;});
            
            nav.onclick = function(e) {
                let ID = e.target.id;
                if (ID == "save-k")
                    self.port.emit("notesK", [[nav.querySelector("#keywords-k").value, nav.querySelector("textarea").value, nav.querySelector("#source-k").value]]),
                    nav.querySelector("#histCount-k").textContent = hist.length,
                    nav.querySelector("textarea").value = "";
                else if (ID == "csv-k")
                     element.notes.loadCSV(menu,[],";");
                else if (ID == "bib-k" && hist.length > 0)
                    self.port.emit("notesK",[]),               
                    element.notes.export.bib(container.querySelector("#k-result"), hist,";");
                else if (ID == "hist-k" && hist.length > 0)
                    self.port.emit("notesK",[]),               
                    element.notes.export.CSV("notesKorpus", hist,";"),
                    self.port.emit("notesK",null);
                else if (ID == "flashcard-k") {
                    var timr = (t => isNaN(parseFloat(t)) ? (t = 4, 4) : parseFloat(t))(menu.querySelector("#timer-k").querySelector("input").value)*1000;
                    nav.querySelector("#flashcard-k").title = element.notes.pref;
                    element.notes.pref = (element.notes.pref == "play") ? (self.port.emit("notesK", []), "stop") : "play";
                    if(param.dico=="notes") {
                        container.style.height="300px",container.style.width="500px", nav.style.display="none"};
                        element.notes.play(hist, container.querySelector("#k-result"), timr,";");
                }
            }
        },
        resize:function(r){
                    var containr = r.parentNode;
                    containr.style["height"] = "200px";
                    containr.querySelector("#nav-k").style.display = "block";
                    containr.querySelector("textarea").style.height = "142px";
        },
        play: function(hist, res, timr, delim) {
            if (element.notes.pref == "play") return;
            var mv = "", tm0 = "", N = hist.length-1,
                H = (function(r) { for (var f, n, o = r.length; 0 !== o;) n = Math.floor(Math.random() * o), o -= 1, f = r[o], r[o] = r[n], r[n] = f; return r })(hist),
                interval=function(f,d,n){var o=function(d,n){return function(){if("undefined"==typeof n||n-- >0){tm0=setTimeout(o,d);try{f.call(null),"play"==element.notes.pref&&clearTimeout(tm0)}catch(r){throw n=0,r.toString()}}}}(d,n);tm0=setTimeout(o,d)};      
            
            res.textContent = "";
            var teaser = element.html("div", { "id": "bibl-k" }, res),
                teaserHeader = element.html("h2", {"style":"font-size: 25px;important;line-height:22px"}, teaser),
                teaserText = element.html("p", {}, teaser);

            var sEvt = res.addEventListener("click", function() {
               clearTimeout(tm0);
               res.textContent = "";
               res.parentNode.querySelector("#nav-k").style.display = "block";
               res.parentNode.style.height="200px";
               removeEventListener("click", sEvt, true);
            }, true)

            teaserHeader.textContent = H[N][0];

            interval(function() {
                    teaserHeader.textContent = H[N][0],
                    teaserText.style.display = "none",
                    teaserText.textContent = H[N].slice(1, H[N].length-1).join(", ");

                mv = setTimeout(function() {
                    teaserText.style.display = "block";
                    clearTimeout(mv);
                }, H.length == (N + 1) ? 0 : timr);

                N--; if (N < 0) return;
            }, timr*1.75, H.length);    
        }, 
        export: {
            processRow: function(row, delim) {
                var pattern = new RegExp('(\"|' + delim + '|\n)', "gi"),
                    val = '';
                for (var j = 0; j < row.length; j++) {
                    var ival = row[j] === null ? '' : row[j].toString();
                    if (row[j] instanceof Date) ival = row[j].toLocaleString();
                    var res = ival.replace(/"/g, '""').replace(/[\n\r]/g, '');
                    if (res.search(pattern) >= 0) res = '"' + res + '"';
                    if (j > 0) val += delim;
                    val += res;
                }
                return val + '\n';
            },
            CSV: function(filename, hist, delim) {
                
                var csv = '';
                for (var i = 0; i < hist.length; i++)
                    csv += element.notes.export.processRow(hist[i], delim);

                var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

                if (navigator.msSaveBlob) navigator.msSaveBlob(blob, filename);
                else {
                    var link = document.createElement("a");
                    if (link.download !== undefined) {
                        var url = URL.createObjectURL(blob);
                        link.setAttribute("href", url);
                        link.setAttribute("download", filename);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }
            },
            bib: function(res, hist, delim) {
                res.textContent="";
                var buildArticle = function(csv, delim, section) {
                        var H = csv.split(delim);
                        element.html("h2", {}, section).textContent =  H.shift().replace(/#/g, "") ; 
                        element.html("p", {}, section).textContent = H.slice(0, H.length-1).join(", ");
                        element.html("a", {"href":H[H.length-1]}, element.html("blockquote", {}, section)).textContent = H.pop(); },
                        bib = element.html("div", { "id": "bibl-k" }, res),
                        csv = "";
                res.parentNode.querySelector("#nav-k").style.display = "none";
                res.parentNode.style.height="300px";
                res.parentNode.style.width="500px";
                for (var i = 0; i < hist.length; i++)
                    csv = element.notes.export.processRow(hist[i], delim), 
                    buildArticle(csv, delim, element.html("section", {}, bib));
            }
        },
        loadCSV: function(menu, h, delim){
            var fileInput = menu.querySelector("#csv-k"),
            CSVToArray=function(csv,d){d=d||";";for(var n=new RegExp("(\\"+d+'|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\'+d+"\\r\\n]*))","gi"),g=[[]],a=null;a=n.exec(csv);){var l=a[1];l.length&&l!==d&&g.push([]);var p;p=a[2]?a[2].replace(new RegExp('""',"g"),'"'):a[3],g[g.length-1].push(p)}return g},
            readFile = function() {
                    var readr = new FileReader();
                    readr.readAsText(fileInput.files[0]);
                    readr.onload = function(event) {
                        var csv = event.target.result;
                        h = CSVToArray(csv,delim);                   
                        self.port.emit("notesK", h);
                    };
                    readr.onerror = function(event) {
                        if (event.target.error.name == "NotReadableError") {
                            alert("Can not read file !");
                            return null;
                         }
                    };
            };
            fileInput.addEventListener('change', readFile);
        },
        pref:"play"
    }
}

self.port.on("lexicon", function(o) {
    element.buildContent(o);
});
