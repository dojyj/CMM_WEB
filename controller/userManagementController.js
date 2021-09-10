import { fetchAPI } from "./api.js";
import { CMMResourceURI, getResource } from "./getResource.js";
import { authWatcher } from "./loginModal.js";
import { modalFrame } from "./modal.js";

const userTableBody = document.querySelector(".user-table-body");

let accountArray = [];
let accountObjArr;
let selectedUserId;
let patchCtx = {};

function onlyOneCheckbox(id) {
    for (var i = 1; i <= accountArray.length; i++){
        document.getElementById("user"+i).checked = false;
    }
    document.getElementById(id).checked = true;
    selectedUserId = id;
}

function patchAccount(evt) {
    const thisModalBody = evt.currentTarget.modal;
    const bg = document.getElementById('modal-bg');
    const thisAccountInfo = thisModalBody.accountInfo;

    const userName = thisModalBody.querySelector("#username");
    const newPassword = thisModalBody.querySelector("#new-password");
    const confirmPassword = thisModalBody.querySelector("#confirm-password");
    const prevSelect = thisModalBody.querySelector("#prev-select");
    const enableUser = thisModalBody.querySelector("#enable-user");

    if (newPassword.innerText != confirmPassword.innerText){
        alert("password is different");
        return;
    }

    patchCtx = {
        Name : userName.innerText,
        Password : newPassword.innerText,
        RoleId : prevSelect.value,
        Enabled : enableUser.checked,
    };

    const headers = {
        "X-Auth-Token" : authWatcher(),
    };
    
    console.log(patchCtx);
    console.log(headers);
    fetchAPI.patch(`${CMMResourceURI.ACCOUNTS}/${thisAccountInfo.id}`,patchCtx,headers)
    .then(res => {
        console.log(res);
        bg.remove();
        thisModalBody.style.display = 'none';    
        init();
    })

    addAccountModalInit(thisModalBody);
}

function passwordChangeModal(id) {
    const modal = modalFrame(id);

    // close 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    modalCloseBtn.addEventListener('click', closeModal, false);
    modalCloseBtn.modal = modal;
 
    // add 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
    const modalPostBtn = modal.querySelector('.modal-add-btn');
    modalPostBtn.addEventListener('click', patchAccount, false);
    modalPostBtn.modal = modal;

    return modal;
}

function changePassword(id) {
    const thisAccountInfo = accountObjArr[id-1];
    const thisModalBody = passwordChangeModal('change-user-info');
    thisModalBody.accountInfo = thisAccountInfo;

    const userName = thisModalBody.querySelector("#username");
    const prevSelect = thisModalBody.querySelector("#prev-select");
    const enableUser = thisModalBody.querySelector("#enable-user");

    userName.innerText = thisAccountInfo.name;
    prevSelect.value = thisAccountInfo.prev;
    enableUser.checked = thisAccountInfo.access;
}

function addAccountModalInit(modal) {
    const default_select = "ReadOnly";
    const newAccount = document.querySelector(".modal-body");

    for(let i = 0; i < newAccount.childElementCount; i++){
        const modalValue = newAccount.children[i].querySelector(".modal-value");
        if (modalValue != undefined && modalValue != null)
            modalValue.innerText = "";
    }

    for (var i,j = 0; i = newAccount.children[3].querySelector("select").options[j]; j++){
        if (i.value == default_select){
            newAccount.children[3].querySelector("select").options.selectedIndex = j;
            break;
        }
    }   
    
    newAccount.children[4].querySelector("#enable-user").checked = false;

    modal.querySelector('.modal-close-btn').removeEventListener('click', closeModal);
    modal.querySelector('.modal-add-btn').removeEventListener('click', patchAccount);
}

function closeModal(evt) {
    const modal = evt.currentTarget.modal;
    const bg = document.getElementById('modal-bg');
    
    bg.remove();
    modal.style.display = 'none';
    addAccountModalInit(modal);
}

async function addAccount(evt) {
    const modal = evt.currentTarget.modal;
    const bg = document.getElementById('modal-bg');    
    
    bg.remove();
    modal.style.display = 'none';

    const accountInfo = new Array();
    const newAccount = document.querySelector(".modal-body");
    for(let i = 0; i < 3; i++){
        accountInfo.push(newAccount.children[i].querySelector(".modal-value").innerText);
    }

    if (accountInfo[1] != accountInfo[2]){
        alert("Password is different");
        return;
    }

    const body = {
        UserName: accountInfo[0],
        Password: accountInfo[1],
        RoleId: newAccount.children[3].querySelector("select").value,
        Enabled: newAccount.children[4].querySelector("#enable-user").checked
    };

    await fetchAPI.post("/redfish/v1/AccountService/Accounts", body)
    .then(json => {
        console.log(json);
        init();
    }).catch(err => {
        console.log(err);
    })
    addAccountModalInit(modal);
}

function modal(id) {
    const modal = modalFrame(id);

    // close 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    modalCloseBtn.addEventListener('click', closeModal, false);
    modalCloseBtn.modal = modal;
 
    // add 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
    const modalPostBtn = modal.querySelector('.modal-add-btn');
    modalPostBtn.addEventListener('click', addAccount, false);
    modalPostBtn.modal = modal;

    return modal;
}

function accountAddHandler() {
    modal('user-add-modal');
}

function accountDeleteHandler() {
    const userObj = document.getElementById(selectedUserId);
    let userId = userObj.parentElement.querySelector(".user-id").innerText;
    if (userId == "root")
        userId = "1";
    
    fetchAPI.delete(`/redfish/v1/AccountService/Accounts/${userId}`)
    .then(json => {
        console.log(json);
    }).then(() => {
        init();
    }).catch(err => {
        console.log(err);
    })
}

function addAccountList(accountObj) {
    const div = document.createElement("div");
    div.className = "user-table-row";

    const selectBox = document.createElement("input");
    const userId = document.createElement("div");
    const userName = document.createElement("div");
    const userAccess = document.createElement("div");
    const userPrev = document.createElement("div");
    const btnDiv = document.createElement("div");
    const passwordChangeBtn = document.createElement("button");
    
    selectBox.type = "checkbox";
    selectBox.className = "checkbox";
    selectBox.id = `user${accountObj.id}`;
    selectBox.setAttribute("onchange", "onlyOneCheckbox(this.id);");

    userId.className = "user-id";
    userName.className = "name";
    userAccess.className = "access";
    userPrev.className = "previlege";
    btnDiv.className = "empty-block";
    
    userId.innerText = accountObj.id;
    userName.innerText = accountObj.name;
    userAccess.innerText = accountObj.access;
    userPrev.innerText = accountObj.prev;

    passwordChangeBtn.className = "save";
    passwordChangeBtn.innerText = "Change Password";
    passwordChangeBtn.id = accountObj.id;
    passwordChangeBtn.style.fontSize = "0.8em";
    passwordChangeBtn.setAttribute("onclick", "changePassword(this.id);");

    div.appendChild(selectBox);
    div.appendChild(userId);
    div.appendChild(userName);
    div.appendChild(userAccess);
    div.appendChild(userPrev);
    btnDiv.appendChild(passwordChangeBtn);
    div.appendChild(btnDiv);

    userTableBody.appendChild(div);
};

function remove_account_list() {
    accountArray.length = 0;
    accountArray = [];

    while (userTableBody.firstChild)
        userTableBody.removeChild(userTableBody.firstChild);
}

async function update_account_list() {
    let accountObjArray = new Array(accountArray.length);

    const promise = accountArray.map(async (user) => {
        const accountInfo = await getResource(user["@odata.id"]);
        const id = (accountInfo.Id == "root") ? "1" : accountInfo.Id; 
        const accountObj = {
            id : id,
            userId : accountInfo.Id,
            name : accountInfo.UserName,
            access : accountInfo.Enabled,
            prev : accountInfo.RoleId
        }
        accountObjArray[parseInt(id) - 1] = accountObj;
    })

    accountObjArr = accountObjArray;
    await Promise.all(promise);
    accountObjArray.forEach(obj => {
        addAccountList(obj);
    });
};

async function get_account_array() {
    remove_account_list();

    const accountInfo = await getResource(CMMResourceURI.ACCOUNTS);
    console.log(accountInfo);
    accountArray = accountInfo.Members;
};

async function init() {
    await get_account_array();
    update_account_list();
};

init();
window.accountAddHandler = accountAddHandler;
window.accountDeleteHandler = accountDeleteHandler;
window.onlyOneCheckbox = onlyOneCheckbox;
window.changePassword = changePassword;