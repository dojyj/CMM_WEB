const ldapEnable = document.getElementById("LDAP-enable");
const ldapSSL = document.getElementById("LDAP-use-ssl");
const ldapPort = document.getElementById("LDAP-port");
const ldapIp = document.getElementById("LDAP-ip");
const ldapPW = document.getElementById("LDAP-password");
const ldapBaseDN = document.getElementById("LDAP-base-dn");
const ldapSearchbase = document.getElementById("LDAP-search-base");
let ldapEnableFlag;

const adEnable = document.getElementById("AD-enable");
const adUseAuth = document.getElementById("AD-auth-enable");
const adSSL = document.getElementById("AD-use-ssl");
const adPort = document.getElementById("AD-port");
const adDomain = document.getElementById("AD-domain-name");
const adTimeout = document.getElementById("AD-timeout");
const adIp = document.getElementById("AD-ip");
let adEnableFlag;
let adUseAuthFlag;

let ldapPatchCtx = {};
let adPatchCtx = {};

function ldapSaveBtn() {
    console.log(ldapPatchCtx);
}

function ldapClearBtn() {
    ldapInit();
}

function adSaveBtn() {
    console.log(adPatchCtx);
}

function adClearBtn() {
    adInit();
}

window.onload = () => {
    ldapEnable.addEventListener("change", function (e) {
        ldapPatchCtx.LDAPEnabled = this.checked;
        ldapEnableFlag = this.checked;
        ldapInit();
    }, false);
    ldapSSL.addEventListener("change", function (e) {
        ldapPatchCtx.LDAPAuthOverSSL = this.checked;
    }, false);
    ldapPort.addEventListener("input", function (e) {
        ldapPatchCtx.LDAPPortNumber = this.innerText;
    }, false);
    ldapIp.addEventListener("input", function (e) {
        ldapPatchCtx.LDAPServer = this.innerText;
    }, false);
    ldapPW.addEventListener("input", function (e) {
        ldapPatchCtx.LDAPPassword = this.innerText;
    }, false);
    ldapBaseDN.addEventListener("input", function (e) {
        ldapPatchCtx.LDAPDN = this.innerText;
    }, false);
    ldapSearchbase.addEventListener("input", function (e) {
        ldapPatchCtx.Searchbase = this.innerText;
    }, false);

    adEnable.addEventListener("change", function (e) {
        adPatchCtx.adEnable = this.checked;
        adEnableFlag = this.checked;
        adInit();
    }, false);
    adUseAuth.addEventListener("change", function (e) {
        adPatchCtx.AuthenticationEnabled = this.checked;
        adUseAuthFlag = this.checked;
        adInit();
    }, false);
    adSSL.addEventListener("change", function (e) {
        adPatchCtx.AuthenticationOverSSLEnabled = this.checked;
    }, false);
    adPort.addEventListener("input", function (e) {
        adPatchCtx.PortNumber = this.innerText;
    }, false);
    adDomain.addEventListener("input", function (e) {
        adPatchCtx.UserDomainName = this.innerText;
    }, false);
    adIp.addEventListener("input", function (e) {
        adPatchCtx.DCSAddress1 = this.innerText;
    }, false);
    adTimeout.addEventListener("change", function (e) {
        adPatchCtx.Timeout = this.innerText;
    }, false);
}

function ldapInit() {
    if (!ldapEnableFlag){
        ldapSSL.classList.add("disabled-div");
        ldapPort.classList.add("disabled-div");
        ldapIp.classList.add("disabled-div");
        ldapPW.classList.add("disabled-div");
        ldapBaseDN.classList.add("disabled-div");
        ldapSearchbase.classList.add("disabled-div");
    }else{
        ldapSSL.classList.remove("disabled-div");
        ldapPort.classList.remove("disabled-div");
        ldapIp.classList.remove("disabled-div");
        ldapPW.classList.remove("disabled-div");
        ldapBaseDN.classList.remove("disabled-div");
        ldapSearchbase.classList.remove("disabled-div");
    }
}

function adInit() {
    if (!adEnableFlag){
        adUseAuth.classList.add("disabled-div");
        adSSL.classList.add("disabled-div");
        adPort.classList.add("disabled-div");
        adDomain.classList.add("disabled-div");
        adTimeout.classList.add("disabled-div");
        adIp.classList.add("disabled-div");
    } else{
        adUseAuth.classList.remove("disabled-div");
        if (adUseAuthFlag)
            adSSL.classList.remove("disabled-div");
        else
            adSSL.classList.add("disabled-div");
        adPort.classList.remove("disabled-div");
        adDomain.classList.remove("disabled-div");
        adTimeout.classList.remove("disabled-div");
        adIp.classList.remove("disabled-div");
    }
}

function init() {
    ldapEnableFlag = false;
    adEnableFlag = false;
    adUseAuthFlag = false;

    ldapInit();
    adInit();
}

init();

window.ldapSaveBtn = ldapSaveBtn;
window.ldapClearBtn = ldapClearBtn;
window.adSaveBtn = adSaveBtn;
window.adClearBtn = adClearBtn;