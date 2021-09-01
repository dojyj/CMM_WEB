import { fetchAPI } from "./api.js";
import { CMMResourceURI, getResource } from "./getResource.js";

const userTableBody = document.querySelector(".user-table-body");

let accountArray = [];
let selectedUserId;

function onlyOneCheckbox(id) {
    for (var i = 1; i <= accountArray.length; i++){
        document.getElementById("user"+i).checked = false;
    }
    document.getElementById(id).checked = true;
    selectedUserId = id;
}

function modal_init() {
    const default_select = "ReadOnly";
    const newAccount = document.querySelector(".modal-body");

    for(let i = 0; i < 3; i++){
        newAccount.children[i].querySelector(".modal-value").innerText = "";
    }

    for (var i,j = 0; i = newAccount.children[3].querySelector("select").options[j]; j++){
        if (i.value == default_select){
            newAccount.children[3].querySelector("select").options.selectedIndex = j;
            break;
        }
    }   
    
    newAccount.children[4].querySelector("#enable-user").checked = false;
}

function modal(id) {
    var zIndex = 9999;
    var modal = document.getElementById(id);

    // 모달 div 뒤에 희끄무레한 레이어
    var bg = document.createElement('div');
    bg.setStyle({
        position: 'fixed',
        zIndex: zIndex,
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        // 레이어 색갈은 여기서 바꾸면 됨
        backgroundColor: 'rgba(0,0,0,0.4)'
    });
    document.body.append(bg);

    // close 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
    modal.querySelector('.modal-close-btn').addEventListener('click', function close() {
        bg.remove();
        modal.style.display = 'none';
        modal.querySelector('.modal-close-btn').removeEventListener('click', close);
        
        modal_init(id);
    });

    // add 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
    modal.querySelector('.modal-add-btn').addEventListener('click', async function add() {
        bg.remove();
        modal.style.display = 'none';
        
        const accountInfo = new Array();
        const newAccount = document.querySelector(".modal-body");
        for(let i = 0; i < 3; i++){
            accountInfo.push(newAccount.children[i].querySelector(".modal-value").innerText);
        }

        const body = {
            UserName: accountInfo[0],
            Password: accountInfo[1],
            RoleId: newAccount.children[3].querySelector("select").value,
            Enabled: newAccount.children[4].querySelector("#enable-user").checked
        }

        await fetchAPI.post("/redfish/v1/AccountService/Accounts", body)
        .then(json => {
            console.log(json);
            init();
        }).catch(err => {
            console.log(err);
        })
        modal_init(id);
        modal.querySelector('.modal-add-btn').removeEventListener('click', add);
    });
    
    modal.setStyle({
        position: 'fixed',
        display: 'flex',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',

        // 시꺼먼 레이어 보다 한칸 위에 보이기
        zIndex: zIndex + 1,

        // div center 정렬
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        msTransform: 'translate(-50%, -50%)',
        webkitTransform: 'translate(-50%, -50%)'
    });
}

// Element 에 style 한번에 오브젝트로 설정하는 함수 추가
Element.prototype.setStyle = function(styles) {
    for (var k in styles) this.style[k] = styles[k];
    return this;
};

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
    
    selectBox.type = "checkbox";
    selectBox.className = "checkbox";
    selectBox.id = `user${accountObj.id}`;
    selectBox.setAttribute("onchange", "onlyOneCheckbox(this.id);");

    userId.className = "user-id";
    userName.className = "name";
    userAccess.className = "access";
    userPrev.className = "previlege";
    
    userId.innerText = accountObj.userId;
    userName.innerText = accountObj.name;
    userAccess.innerText = accountObj.access;
    userPrev.innerText = accountObj.prev;

    div.appendChild(selectBox);
    div.appendChild(userId);
    div.appendChild(userName);
    div.appendChild(userAccess);
    div.appendChild(userPrev);

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