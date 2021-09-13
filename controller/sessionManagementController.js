import { fetchAPI } from "./api.js";
import { CMMResourceURI, getResource } from "./getResource.js";

const sessionTableBody = document.querySelector(".session-table-body");

let sessionList = [];
let objArr;

function addList(obj) {
    console.log(obj);
    const div = document.createElement("div");
    div.className = "session-table-row";

    const sessionId = document.createElement("div");
    const sessionName = document.createElement("div");
    const sessionType = document.createElement("div");
    const sessionPrev = document.createElement("div");
    const btnDiv = document.createElement("div");
    const sessionCloseBtn = document.createElement("button");

    sessionId.id = "session-id";
    sessionName.id = "session-name";
    sessionType.id = "session-type";
    sessionPrev.id = "session-prev";
    btnDiv.className = "empty-block";

    sessionId.innerText = obj.sid;
    sessionName.innerText = obj.sname;
    sessionType.innerText = obj.stype;
    sessionPrev.innerText = obj.prev;

    sessionCloseBtn.className = "save";
    sessionCloseBtn.innerText = "Close This Session";
    sessionCloseBtn.id = obj.sid;
    sessionCloseBtn.style.fontSize = "0.8em";
    
    div.appendChild(sessionId);
    div.appendChild(sessionName);
    div.appendChild(sessionType);
    div.appendChild(sessionPrev);
    btnDiv.appendChild(sessionCloseBtn);
    div.appendChild(btnDiv);

    sessionTableBody.appendChild(div);

    sessionCloseBtn.addEventListener("click", async function closeSession(){
        const token = objArr[parseInt(this.id)-1].token;
        const headers = {
            "X-Auth-Token" : token,
        };
        fetchAPI.delete(CMMResourceURI.SESSIONS, headers)
        .then(setTimeout(() => {
            location.reload(); 
        }, 1200));        
    });

}

async function paint_session_list() {
    let sessionArray = new Array(sessionList.length);

    const promise = sessionList.map(async (session) => {
        const sessionInfo = await getResource(session["@odata.id"]);
        const userInfo = await getResource(sessionInfo.AccountId);

        const sessionObj = {
            sid : sessionInfo.Id,
            sname : sessionInfo.UserName,
            stype : sessionInfo.SessionType,
            token : sessionInfo.AuthToken,
            prev : userInfo.RoleId,
        };
        sessionArray[parseInt(sessionObj.sid)-1] = sessionObj;
    });

    objArr = sessionArray;
    await Promise.all(promise);
    sessionArray.forEach(obj => {
        addList(obj);
    });
}

function init_session_list() {
    sessionList.length = 0;
    sessionList = [];
    
    while (sessionTableBody.firstChild)
        sessionTableBody.removeChild(sessionTableBody.firstChild);
}

async function get_session_list() {
    init_session_list();

    const SessionCollection = await getResource(CMMResourceURI.SESSIONS);
    sessionList = SessionCollection.Members;
    console.log(sessionList);
}

async function init(){
    await get_session_list();
    paint_session_list();   
}

init();