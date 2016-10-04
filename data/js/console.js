(function() {

    "use strict";

    var consolek = { /*--------------------Inject a "console" element to the DOM*/
        command_history : [""],
        command_counter : -1,
        history_counter:0,
        addElementDOM: function(cfg) {

            var dv = document.createElement("div"),
                lbl = document.createElement("label"),
                lblText = document.createTextNode(">"),
                inpt = document.createElement("input");

            dv.id = cfg.id;
            dv.className = "ink";
            //dv.style.top = position.top + "%";
            //dv.style.left = position.left + "%";

            lbl.title = "click to remove";
            lbl.id = "labelk";
            lbl.className = "labelk";

            inpt.id = "inputk";
            inpt.type = "text";
            inpt.size = "50";

            lbl.appendChild(lblText);

            dv.appendChild(lbl);
            dv.appendChild(inpt);

            document.body.appendChild(dv);

            return dv;
        },
        dict: {
            match: function(x, y) {

                var i = -1, index = -1;
                for (var i = 0; i < y.length; i++)
                    if (0 === y[i].lastIndexOf(x, 0)) { index = i; break }

                return y[i]
            },
            change: function(x) {

                var d = ['linguee', 'babla', 'wordreference', 'thefreedictionary', 'cnrtl', 'littre', 'larousse',
                        'dictionarycom', 'urbandictionary', 'iate', 'eurovoc', 'beolingus', 'pons', 'artfl',
                        'almaany', 'merriamwebster', 'collins', 'oxforddictionaries', 'memidex', 'duden',
                        'wortschatzunileipzig', 'dictcc', 'leodict', 'woxikon', 'dwds', 'linguatec',
                        'googletranslate', 'ispeech', 'raes', 'reverso', 'chambers', 'cedict', 'responsivevoiceorg',
                        'triantafyllides','gramota','dsal','treccani','sapere','corriere',"jmdict","notes"],
                
                y = consolek.dict.match(x.slice(1), d);

                return typeof y != "undefined" ? (consolek.dict.new_ = true, y) : "" 
            },
            isWildCard(w, s, o, b=3) {
                let c = {},arr=[];
                return w.indexOf(s) > -1 &&( 
                    w=w.replace(/\s*/gi,""),arr=w.split(s, (w.match(/\+/g) || []).length+1),
                    o.lang = arr[arr.length-1].substr(0,b),
                    consolek.dict.keywords.forEach((e, i, a) => c[e.toLowerCase().substr(0, b)] = e), 
                    o.lang = (c[o.lang] != null || o.lang != "TTS") ? c[o.lang] + " #" : null), 
                    o.dict = arr[0] || w, o.dict = (consolek.dict.change(o.dict) == "") ? i = {} : consolek.dict.change(o.dict), o},
            keywords:["21st","Academie9","All","BHV","Bob","castellano","Citazioni","CRISCO","Crusca","DESEN",
            "Dictionary","DLE","DMF","DPD","DVLF","DVO","etimologias","Etymologie","Georgakas","Hanzidico","Italiano",
            "JMDict","Jukuu","Lar1","Lexicographie","ModiDiDire","NuoMau","OnlineEtym","reverse","Reverse","Rogets","SabCol",
            "Simplified","SinAnt","SinCon","Sinonimi","Thesaurus","Traditional","Triantafyllides","Vocabolario","Websters", "TTS"],
            new_: false
        },
        InOut: function(e) {

            divk.className = divk.className.replace("ink", "outk");
            setTimeout(function() {
                divk.getElementsByTagName("label")[0].removeEventListener("click", consolek.InOut, false);
                self.port.emit("detach", "");
                divk.remove();
            }, 1000);
        }
    },
    divk = document.getElementById("divk");

    if (!divk) {

        divk = consolek.addElementDOM({ id: "divk" });

        var inptk = divk.getElementsByTagName("input")[0];

        inptk.value = "";
        inptk.focus();

        inptk.onkeydown = function(e) { /*--------------------Add extras to the console*/

            if (e.keyCode == 13) {

                var obj = {}, word = inptk.value.trim();

                if("$" == word.charAt(0) && word.length > 4)
                    (word = "$" + word.replace(/\s*/g, "").replace(/[^a-zA-Z\+]/gi, "").toLowerCase(),
                     obj = consolek.dict.isWildCard(word, "+", obj),
                     word = consolek.dict.change(obj.dict || word) == "" ? word : word);

                consolek.command_counter++;
                consolek.command_history[consolek.command_counter] = word;
                consolek.history_counter = consolek.command_counter;

                self.port.emit("search", {
                    "pref": consolek.dict.new_ ? "default" : "",
                    "name": obj.dict || word,
                    "lang": obj.lang || null,
                    "value": null
                });

                if (consolek.dict.new_) consolek.dict.new_ = false;
                inptk.value = "";
                inptk.focus();
            }

            if (e.keyCode == 40) {
                if (consolek.history_counter > 0) consolek.history_counter--;
                inptk.value = consolek.command_history[consolek.history_counter];
            }

            if (e.keyCode == 38) {
                if (consolek.history_counter < consolek.command_counter) consolek.history_counter++;
                inptk.value = consolek.command_history[consolek.history_counter];
            }
        };

        divk.getElementsByTagName("label")[0].addEventListener("click", consolek.InOut, false);
    }

    self.port.on("consolePosition", function(p) {
        divk.style.top = p.top + "%";
        divk.style.left = p.left + "%";
    });
})();