const EMPTY_MEMOS_NOTI = "필요한 내용을 저장해보세요.";

chrome.storage.sync.get(["memos"], (resp) => {
    const memoContainer = document.getElementById("memo-container");
    const memos = resp.memos;
    const keys = Object.keys(memos);

    if (keys.length < 1) {
        memoContainer.innerText = EMPTY_MEMOS_NOTI;
    } else {
        for (let key of keys) {
            const memo = memos[key];
            const memoItemElement = createMemoItemElement(memo);
            memoContainer.appendChild(memoItemElement);
        }
    }
});

function createMemoItemElement(memo) {
    const memoItem = document.createElement("div");
    memoItem.classList.add("memoItem");

    memoItem.setAttribute("data-id", memo.id);
    memoItem.setAttribute("data-createDate", memo.createDate);
    memoItem.setAttribute("data-lastUpdateDate", memo.lastUpdateDate);

    const delBtn = document.createElement("button");
    delBtn.classList.add("delBtn");
    delBtn.innerText = "×";
    delBtn.addEventListener("click", (event) => {
        event.target.parentElement.classList.add("hidden");
        chrome.runtime.sendMessage({ event: "delete-memo", id: memo.id });
    });

    const memoItem_date = document.createElement("div");
    memoItem_date.innerText = dateStringToFormattedDateString(memo.createDate);

    const memoItem_content = document.createElement("div");
    memoItem_content.innerText += memo.content;

    memoItem.appendChild(delBtn);
    memoItem.appendChild(memoItem_date);
    memoItem.appendChild(memoItem_content);

    return memoItem;
}

function dateStringToFormattedDateString(dateString) {
    const date = new Date(dateString);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const day = "일월화수목금토"[date.getDay()];
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    return `${y}.${m}.${d} ${day} ${hour}:${min}:${sec}`;
}