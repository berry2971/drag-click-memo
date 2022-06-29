const CONTEXT_MENU_TEXT = "Post memo of dragged contents"

init();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.event === "post-text") {
            postText(request.content);
        } else if (request.event === "delete-text") {
            deleteText(request.content);
        }
    }
)

function init() {
    chrome.runtime.onInstalled.addListener(() => {
        setupStorage();
        setupContextMenu();
    });
}

function setupStorage() {
    chrome.storage.sync.get(["memos"], (resp) => {
        if (!resp.memos) {
            chrome.storage.sync.set({"memos": []}, () => {});
        }
    });
}

function setupContextMenu() {
    chrome.contextMenus.create({
        id: "postDraggedContentsToMemo",
        title: CONTEXT_MENU_TEXT,
        contexts: ["all"]
    });

    chrome.contextMenus.onClicked.addListener((itemData) => {
        if (itemData.menuItemId == "postDraggedContentsToMemo") {
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, {event: "post-context"}, resp => {});
            });
        }
    });
}

function postText(content) {
    chrome.storage.sync.get(["memos"], (resp) => {
        const memos = resp.memos;
        memos.push(content);
        chrome.storage.sync.set({"memos": memos}, () => {});
    });
}