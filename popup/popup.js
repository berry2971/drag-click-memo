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
    const delBtn = document.createElement("button");
    const editBtn = document.createElement("button");
    const cancelBtn = document.createElement("button");
    let originalText;
    let content;

    const memoItem = document.createElement("div");
    memoItem.classList.add("memoItem");

    memoItem.setAttribute("data-id", memo.id);
    memoItem.setAttribute("data-createDate", memo.createDate);
    memoItem.setAttribute("data-lastUpdateDate", memo.lastUpdateDate);

    editBtn.classList.add("editBtn");
    editBtn.setAttribute("data-mode", "wait");
    editBtn.innerText = "수정";
    editBtn.addEventListener("click", (event) => {
        const editMode = editBtn.getAttribute("data-mode");
        const memoEl = event.target.parentElement;
        content = memoEl.getElementsByClassName("memo-item-content")[0];
        if (editMode === "wait") {
            originalText = content.innerText;
            content.innerText = "";

            const inputBox = document.createElement("textarea");
            inputBox.innerText = originalText;
            inputBox.classList.add("memoEditTextArea");
            content.appendChild(inputBox);

            editBtn.setAttribute("data-mode", "input");
            editBtn.innerText = "적용";

            cancelBtn.classList.remove("hidden");
        } else if (editMode === "input") {
            const inputBox = content.getElementsByTagName("textarea")[0];
            const editText = inputBox.value;
            content.innerHTML = "";
            content.innerText = editText;
            chrome.runtime.sendMessage({ event: "edit-memo", id: memo.id, content: editText });
            editBtn.setAttribute("data-mode", "wait");
            editBtn.innerText = "수정";
            cancelBtn.classList.add("hidden");
        }
    });

    delBtn.classList.add("delBtn");
    delBtn.innerText = "삭제";
    delBtn.addEventListener("click", (event) => {
        event.target.parentElement.classList.add("hidden");
        chrome.runtime.sendMessage({ event: "delete-memo", id: memo.id });
    });

    cancelBtn.classList.add("cancelBtn");
    cancelBtn.classList.add("hidden");
    cancelBtn.innerText = "취소";
    cancelBtn.addEventListener("click", (event) => {
        content.innerHTML = "";
        content.innerText = originalText;
        editBtn.innerText = "수정";
        editBtn.setAttribute("data-mode", "wait");
        cancelBtn.classList.add("hidden");
    });

    const memoItem_date = document.createElement("div");
    memoItem_date.classList.add("memo-item-Date");
    memoItem_date.innerText = dateStringToFormattedDateString(memo.createDate);

    const memoItem_content = document.createElement("div");
    memoItem_content.classList.add("memo-item-content");
    memoItem_content.innerText += memo.content;

    memoItem.appendChild(cancelBtn);
    memoItem.appendChild(delBtn);
    memoItem.appendChild(editBtn);
    memoItem.appendChild(memoItem_date);
    memoItem.appendChild(memoItem_content);

    return memoItem;
}

function dateStringToFormattedDateString(dateString) {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    const day = getKoreanDayString(dateObj.getDay());
    const hour = zeroPad(dateObj.getHours(), 2);
    const min = zeroPad(dateObj.getMinutes(), 2);
    const sec = zeroPad(dateObj.getSeconds(), 2);
    return `${year}.${month}.${date} ${day} ${hour}:${min}:${sec}`;
}

function getKoreanDayString(day) {
    return "일월화수목금토"[day];
}

function zeroPad(str, length) {
    return String(str).padStart(length, '0');
}