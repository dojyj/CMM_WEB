import { CMMResourceURI, getResource, postResource,  deleteResource } from "./Resource.js";

const loginModal = document.getElementById("login-form");
const userName = document.getElementById("login-username");
const password = document.getElementById("login-password-div");
const sessionNotify = document.querySelector(".session-notify");

let sessionList = [];

password.addEventListener("keydown", (enter) => {
    if (enter.key === "Enter"){
        enter.preventDefault();
        
        loginModal.querySelector('.login-btn').click();
    }
});

// Element 에 style 한번에 오브젝트로 설정하는 함수 추가
Element.prototype.setStyle = function(styles) {
    for (var k in styles) this.style[k] = styles[k];
    return this;
};

export function authWatcher() {
    const token = localStorage["X-Auth-Token"];
    return token || false;
}

function logoutBtn() {
    const token = authWatcher();
    if (token){
        const headers = {
            "X-Auth-Token" : token,
        }
        localStorage.clear();

        deleteResource(CMMResourceURI.SESSIONS, headers)
        .then(setTimeout(() => {
            location.reload();
        }, 1200));
    }
}

async function getSessionList() {
    const sessionCollection = await getResource(CMMResourceURI.SESSIONS);
    const sessionMembers = sessionCollection.Members;
    for (let i = 0; i< sessionMembers.length; i++)
        sessionList.push(await getResource(sessionMembers[i]["@odata.id"]));
}

async function init() {
    let loginFlag = false;

    // #0 get Session List
    await getSessionList();

    // #1 auth check (local storage auth token check)
    const authState = authWatcher();
    
    // #2 check Session with token.
    if (authState !== false) {
        // #2-A if Session exists, return
        sessionList.forEach(sessionInfo => {
            if (sessionInfo.AuthToken == authState){
                loginFlag = true;
                sessionNotify.innerText = `현재 세션 : ${sessionInfo.UserName}`;
            }
        });

        if (loginFlag){
            return;
        }// #2-B if Session doesn't exists, local storage clear
        localStorage.clear();
    }
    
    // #3 display login modal.
    let zIndex = 9999;
    const bg = document.createElement('div');
    
    bg.setStyle({
        position: 'fixed',
        zIndex: zIndex,
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        // 레이어 색갈은 여기서 바꾸면 됨
        backgroundColor: 'rgba(0,0,0,0.9)'
    });
    document.body.append(bg);
    
    // login 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
    loginModal.querySelector('.login-btn').addEventListener('click', async function login() {
        const postCtx = {
            UserName : userName.value,
            Password : password.value,
        }
    
        await postResource(CMMResourceURI.SESSIONS, postCtx)
        .then(res => {
            const token = res.headers.get('X-Auth-Token');
            localStorage.setItem('X-Auth-Token', token);
        })
        
        // 로그인 완료 후
        if (authWatcher() != null){
            bg.remove();
            loginModal.style.display = 'none';
            loginModal.querySelector('.login-btn').removeEventListener('click', login);
            location.href = '/index.html';
        }
    });
    
    loginModal.setStyle({
        display: 'flex',
        position: 'fixed',
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

init();
window.logoutBtn = logoutBtn;