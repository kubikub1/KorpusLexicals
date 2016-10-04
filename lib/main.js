var contextMenu        = require("sdk/context-menu"),
    tabs               = require("sdk/tabs"),
    { ToggleButton }   = require('sdk/ui/button/toggle'),
    panels             = require("sdk/panel"),
    self               = require("sdk/self"),
    prefs              = require("sdk/simple-prefs"),
    {all}              = require('sdk/core/promise'),
    Request            = require("sdk/request").Request,
    { Hotkey }         = require("sdk/hotkeys"),
    { Cc, Ci }         = require("chrome"),
    { PageMod }        = require("sdk/page-mod"),
    app                = require("../data/js/handleURLs"),
    data               = self.data;

var currentSelection = null,
    defaultValues = prefsJ("default"),
    tts = isTTS(defaultValues.dico),
    oRect = {},
    note = true,
    hist = [],
    tkk = '';

if (prefsJ("hotkeysConfig").showContextMenu == "true") {
    var cMSpeak = contextMenu.Item({
            label: "Speak selection",
            image: data.url("speak.png"),
            context: contextMenu.SelectionContext(),
            contentScriptFile: './js/contextMenu.js',
            onMessage: function(a) { forgePanelContent(a.selection, true, a.position); }
        }),
        cMSearch = contextMenu.Item({
            label: "Search selection",
            image: data.url("conv.png"),
            context: contextMenu.SelectionContext(),
            contentScriptFile: './js/contextMenu.js',
            onMessage: function(a) { forgePanelContent(a.selection, false, a.position); }
        });
}

function initTKK() {
    let g = "googletranslate";
    if ((x => (tts && x["tts"][0] == g || x["dico"] == g))(defaultValues)) {
        let w0 = (a => a.charAt(Math.floor(Math.random() * a.length)))("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"),
        p0 = app.forgeURLWith(w0, { "dico": g, "langPair": "de #"}, true);
        gket(p0).then(r => { tkk = app.ggtInit(r.text)});
    }
}

function prefsJ(x) {
    return (x=="rankDict") ? JSON.parse(prefs.prefs[x]) : JSON.parse(prefs.prefs[x])[0];
}

function getConfig(a, o) {
    for (var e in a) o[a[e]] = prefsJ(a[e]); return o 
}


function isTTS(a){
    return ["ispeech","linguatec","googletranslate","responsivevoiceorg"].includes(a)||
           a=="reverso"&&prefsJ("langPair")[a].indexOf("Voice")>-1
}

function getCharset(p){
    return ["beolingus","linguee","corriere"].includes(p.dico)||p.lang=="DMF"||p.lang.indexOf("etimologias")>-1?"ISO-8859-1":
           p.lang=="Bob"?"windows-1252":
           p.dico=="gramota"?"windows-1251":"utf-8"
}

function listenerPrefs(a) {
    var p = a.pref,
        n = a.name,
        l = a.lang,
        v = a.value,
        t = prefsJ(p),
        lp;
    p == "default" ? ( lp = prefsJ("langPair"), tts = isTTS(n), t.dico=n, t.langPair = a.lang || lp[n], tts && (t.tts = [n, lp[n]])) : ( t[n] = v,
    p == "langPair" && ( tts = isTTS(n), tts && (defaultValues.tts = [n, v]), defaultValues.langPair = v, prefs.prefs["default"] = JSON.stringify([defaultValues]))),
    t = p == "rankDict" ? v : [t],
    prefs.prefs[p] = JSON.stringify(t);
    if(p == "default") defaultValues = prefsJ(p);
}

function setDefaultValues(o, f) {
    f(o);
    if (o.pref == "default" || o.pref == "langPair") panelButton.port.emit("Headers", defaultValues)
}

var panelButton = panels.Panel({ /*------------------PANEL BUTTON*/
        width: 240, height: 389,
        contentURL: "./html/panelButton.html",
        contentScriptFile: [  "./js/jquery/jquery-2.1.3.min.js",
                            "./js/jquery/jquery.sortable.min.js",
                            "./js/jquery/typeahead.bundle.js",
                            "./js/panelButton.js"],
        onHide: s => togglePB.state('window', { checked: false })
    }),
    togglePB = ToggleButton({
        id: "k-widget",
        label: "K",
        icon: { "16": "./icon32.png" },
        onChange: s => {s.checked && panelButton.show({ position: togglePB })}
    });
    (f => {  f.emit("Headers"     , defaultValues),
             f.emit("nav_listener", getConfig(["hotkeysConfig", "consolePosition"],{})),
             f.emit("InitDicoList", { "sdl": prefs.prefs["rankDict"], "default": prefsJ("default"), "json_": data.load('json/languages.json') }),
             f.on("setDefaultValues", o => { 
                                     if( o.name == "showNote") note = (o.value == "true"); setDefaultValues(o,listenerPrefs);});
         })(panelButton.port);

function panelTTS(p) { /*-------------------PANEL SEARCH RESULT TTS*/
    (p.GT != null) ? panels.Panel(p.ContentStyle).show():
    gket(p).then(r => { let worker = tabs.activeTab.attach({contentScriptFile: './js/handleTTS.js'});  
                        worker.port.emit("ttsDOM", p);
                        worker.port.on("detach", w => worker.destroy());});
};
                    
function consoleK() {           /*-------------------Build a console and inject it into the page*/                
    var worker = tabs.activeTab.attach({
        contentScriptFile: data.url('js/console.js')
    });

    (function(c) {
        worker.port.emit(c, prefsJ(c)), 
        prefs.on(c, r => worker.port.emit(c, prefsJ(c)))
    })("consolePosition");

    worker.port.on("search", function(o) {
        let tts_ = defaultValues.tts[0] != "googletranslate" && isTTS(defaultValues.dico);
        (o.pref == "default") ? setDefaultValues(o, listenerPrefs): forgePanelContent(o.name, tts_ );
    });

    worker.port.on("detach", w => worker.destroy())
}
Hotkey({
    combo   : prefsJ("hotkeysConfig").console,
    onPress : function() { consoleK(); }
});

function gket(param, ContentType) {
    return new Promise(function(resolve, reject) {
        param.dico == "notes" ? reject(param):
        Request({
            url: param.url,
            headers: {},
            overrideMimeType: ContentType || ("text/html; charset=" + getCharset(param)),
            anonymous: false,
            onComplete: function(response) {
                param.status = response.status;
                response.statusText == "OK" ? resolve(response) : reject(response);            
            }
        }).get();
    });
}

function sanitize(html) {
        /*Sanitize remote HTML code
        THIS link ask to use nsIParserUtils.parseFragment() method to remove unsafe script or content
                https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion
        BUT nsIParserUtils.sanitize() method will be used instead (does the same)
                https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIParserUtils#sanitize%28%29

        by default: scripts or links to external css files are removed 
            SanitizerAllowStyle             --> 1    Allow <style> elements and style attributes
            SanitizerInternalEmbedsOnly     --> 2    avoid ambient information leakage with a source pointing to an HTTP server
            SanitizerDropNonCSSPresentation --> 3    Drops non-CSS presentational HTML elements and attributes
            SanitizerDropForms              --> 4    Drops forms and form controls
            SanitizerDropMedia              --> 5    Drops <img>, <video>, <audio>, and <source> **/

    var parser = Cc["@mozilla.org/parserutils;1"].getService(Ci.nsIParserUtils);
    return parser.sanitize(html, 2345);
}

function forgePanelContent(word, tts = false, pos = {"top": 9,"left": 9,"delta": { "x": 0, "y": 0 }}) {

    if (word != "" || word != null) {

        let param = {};
        param = tts ? { dico: defaultValues.tts[0], langPair: defaultValues.tts[1] } : defaultValues;
        if (tkk == '') initTKK();
        param = app.forgeURLWith(word, param, tts),        
        param.oRect = pos,
        param.note = note,
        tts = param.tts;
        
        if (tts) {
            app.detectSourceLang(gket, param, prefsJ("hotkeysConfig").languageDetectionWebService)
               .then(p => {
                p.text != "" ? (r => require('sdk/notifications').notify({text: r}))(p.text) : panelTTS(p)})
        } 
        else
        gket(param).then(  r => { param.htmlCLEAN = sanitize(r.text)})
                   .catch( r => { param.status = r.status || 400 })
                   .then(  r => { var worker = tabs.activeTab.attach({ contentScriptFile: './js/panel.js' });
                                      worker.port.emit("lexicon", param);
                                      if (note)(g => { worker.port.on("notesK", o => {
                                     o != [] && (hist = (o != null) ? hist.concat(o) : []),
                                     worker.port.emit("historyNotes",hist);}),worker.port.emit("historyNotes", hist);})();
                                     worker.port.on("detach", w => worker.destroy());
                                });  
    }
}

var workers = [],                       /*----------------------------- PageMod : monitor configs, display search result  */
    arr = ["hotkeysConfig", "rankDict", "default"];
PageMod({                       
    include           : ['https://*', 'http://*', 'file:///*'],
    contentStyleFile  : "./css/console.css",
    contentScriptFile : "./js/pageMod.js",
    contentScriptWhen : "ready",
    attachTo          : ["top", "existing"],
    onAttach          : function(worker) {

        workers.push(worker);   

        workers.forEach( w => (w && w.tab == tabs.activeTab) && w.port.emit("options_", getConfig(arr, {})));

        prefs.on("", p => {
            (arr.indexOf(p) > -1) && workers.forEach(w => w.port.emit("options_", getConfig(arr, {})))});

        worker.on("detach", w => {
            let index = workers.indexOf(worker);
            index >= 0 && workers.splice(index, 1)});

        worker.port.on("sendGetRequest", function(o) {

            o != null && 
            (tts = o.TTS, currentSelection = o.selection, oRect = o.position);

            currentSelection != null &&
            forgePanelContent(currentSelection, tts, oRect), currentSelection = null, tts = false;
        });

        worker.port.on("setDefaultValues", d => setDefaultValues(d, listenerPrefs));
    }
});



