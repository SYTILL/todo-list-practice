//load variables
let total = window.localStorage.getItem('total');
if (!total) { total = 1 }
else { total = Number(total); }

let checked = window.localStorage.getItem('checked');
if (!checked) { checked = 0 }
else { checked = Number(checked); }

let items = window.localStorage.getItem('items');
if (!items) {
    items = [["A sample task here", false]]
}
else {
    items = JSON.parse(items);
}



let editMode = false;
let editTarget = -1;

const boxMainSection = document.getElementById('box-main-section');
const totalText = document.getElementById('total-text');
const checkedText = document.getElementById('checked-text');

const addButton = document.getElementById('add-button-icon');
const addInput = document.getElementById('add-box-input');
const errorMsg = document.getElementById('error-msg');




//변경 후 화면 업데이트
const renderItems = () => {
    let s = '';

    for (let i = 0; i < items.length; i++) {
        let curColor = items[i][1] ? "#12db58" : "grey";

        s += '<div class="item"><div class="item-tool">'
        s += `<span id="delete${i}" class="material-symbols-outlined item-delete" onclick="deleteItem(${i})">`
        s += 'delete</span></div><div class="item-tool">'
        s += `<span id="edit${i}" class="material-symbols-outlined item-edit" onclick="editItem(${i})">edit</span>`
        s += '</div><div class="item-title">'
        s += `<div id="title${i}" class="item-title-inner">${items[i][0]}</div>`
        s += '</div><div class="item-tool">'
        s += `<span id="checked${i}" class="material-symbols-outlined" onclick="checkItem(${i})" style="color:${curColor};">`
        s += 'select_check_box</span></div></div>'
    }

    boxMainSection.innerHTML = s;
};
renderItems();



//basic functions
const addItem = () => {
    addInput.focus();
    if (editMode) {
        editItem(editTarget);
        return;
    }

    let msg = addInput.value;

    if (typeof msg != "string") {
        raiseErrorMsg("Invalid Character");
        return;
    };
    if (msg.length > 100) {
        raiseErrorMsg("Exceeded 100 Character Limit");
        return;
    };
    if (msg.length <= 0) {
        return;
    };

    raiseErrorMsg("");
    items.push([msg, false]);
    updateTotal(1);
    renderItems();
    addInput.value = '';
    window.localStorage.setItem("items", JSON.stringify(items));
    return true;
};

const editItem = (index) => {
    addInput.focus();
    raiseErrorMsg("");
    if (editMode) {
        if (index != editTarget) return;
        if (addInput.value.length <= 0) return;

        editTarget = -1;

        items[index][0] = addInput.value;
        renderItems();
        addInput.value = '';
        window.localStorage.setItem("items", JSON.stringify(items));
    }
    else {
        editTarget = index;
        addInput.value = items[index][0];
    }

    //change icon [add <-> edit]
    if (editMode) {
        addButton.style.color = "#41da76";
        addButton.innerText = "add_circle";
        editMode = !editMode;
    }
    else {
        addButton.style.color = "rgb(206, 192, 0)";
        addButton.innerText = "edit";
        editMode = !editMode;
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key == 'Enter') addItem();
})

const deleteItem = (index) => {
    addInput.focus();
    if (editMode) {
        raiseErrorMsg("Can't delete on Edit Mode");
        return;
    }
    if (index >= items.length) return false;

    if(items[index][1]){
        updateChecked(-1);
    }

    items.splice(index, 1);
    window.localStorage.setItem("items", JSON.stringify(items));
    updateTotal(-1);
    renderItems();

    if (total == 0) {
        raiseErrorMsg("Try add something!");
        return;
    }

    return true;
};

const checkItem = (index) => {
    let checkBox = document.getElementById(`checked${index}`);

    items[index][1] = !items[index][1]

    if (items[index][1]) {
        checkBox.style.color = "#12db58";
        updateChecked(1);
    }
    else {
        checkBox.style.color = "grey";
        updateChecked(-1);
    }
    window.localStorage.setItem("items", JSON.stringify(items));
};




//update UI
const updateTotal = (value) => {
    if (typeof value != "number") return false;

    total += value;
    totalText.innerText = `Total: ${total}`;
    window.localStorage.setItem("total", total);
    return true;
};
updateTotal(0);

const updateChecked = (value) => {
    if (typeof value != "number") return false;

    checked += value;
    checkedText.innerText = checked;
    window.localStorage.setItem("checked", checked);
};
updateChecked(0);

const raiseErrorMsg = (msg) => {
    errorMsg.innerText = msg;
}

