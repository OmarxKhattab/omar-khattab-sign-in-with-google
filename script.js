const userInfo = document.getElementById("user-info");
const userPic = document.getElementById("user-pic");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");
const confirmDialog = document.getElementById("confirm-dialog");
const btnNo = confirmDialog.querySelector(".btn-no");
const btnYes = confirmDialog.querySelector(".btn-yes");
const googleSignInBtn = document.querySelector(".g_id_signin");

function saveUserData(data) {
  localStorage.setItem("googleUser", JSON.stringify(data));
}

function clearUserData() {
  localStorage.removeItem("googleUser");
}

function loadUserData() {
  const dataStr = localStorage.getItem("googleUser");
  if (!dataStr) return false;
  try {
    const data = JSON.parse(dataStr);
    if (data && data.name && data.email) {
      showUserInfo(data);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function showUserInfo(data) {
  userPic.src = data.picture || "";
  userName.textContent = data.name || "";
  userEmail.textContent = data.email || "";
  userInfo.style.display = "block";
  googleSignInBtn.style.display = "none";
}

function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  showUserInfo(data);
  saveUserData(data);
}

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

logoutBtn.addEventListener("click", () => {
  confirmDialog.classList.remove("hidden");
  btnNo.focus();
});

btnNo.addEventListener("click", () => {
  confirmDialog.classList.add("hidden");
  logoutBtn.focus();
});

btnYes.addEventListener("click", () => {
  confirmDialog.classList.add("hidden");
  userInfo.style.display = "none";
  googleSignInBtn.style.display = "inline-block";
  userPic.src = "";
  userName.textContent = "";
  userEmail.textContent = "";
  clearUserData();
});

window.onload = () => {
  loadUserData();
};

window.handleCredentialResponse = handleCredentialResponse;