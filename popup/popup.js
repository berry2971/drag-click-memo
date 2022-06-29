chrome.storage.sync.get(["memos"], (resp) => {
    const memoContainer = document.getElementById("memo-container");
    const memos = resp.memos;
    for (let memo of memos) {
        const memoItemElement = createMemoItemElement(memo);
        memoContainer.appendChild(memoItemElement);
    }
});

function createMemoItemElement(content) {
    const memoItem = document.createElement("div");
    memoItem.classList.add("memoItem");
    memoItem.innerText = content;
    return memoItem;
}