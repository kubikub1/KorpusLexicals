self.on("click", function(node, data) {
    var selection = window.getSelection();
    if (selection.toString().length > 0) {
        var oRect = selection.getRangeAt(0).getBoundingClientRect(),
            XY = {
                "top": oRect.top + window.scrollY - 7,
                "left": oRect.left + window.scrollX + oRect.width,
                "delta": { "x": 0, "y": 0 }
            };
        if (window.innerWidth < XY.left + 500 + 10) {
            XY.delta.x = window.innerWidth - XY.left - 1.2*500 - 10;
            //XY.delta.y = XY.top + 20;
        }

        self.postMessage({
            position: XY,
            selection: selection.toString()
        });
    }
});
