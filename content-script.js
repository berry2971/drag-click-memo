chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.event === "post-context") {
            chrome.runtime.sendMessage({event: "post-text", content: getSelectedText()});
        }
    }
)

function getSelectedText() {
    let sel = "";
    if (window.getSelection) {
        sel = window.getSelection();
    } else if (document.getSelection) {
        sel = document.getSelection();
    } else if (document.selection) {
        sel = document.selection.createRange().text;
    } else {
        return;
    }
    return sel.toString();
}