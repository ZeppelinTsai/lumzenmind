import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// 🔄 初始化 Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBMPBJOBzSrJZUHK781948I_ROqVux3YHI",
    authDomain: "lumzenmind.firebaseapp.com",
    projectId: "lumzenmind",
    storageBucket: "lumzenmind.appspot.com",
    messagingSenderId: "1028669516548",
    appId: "1:1028669516548:web:3888d2c7bd5d1747207e51",
    measurementId: "G-DMYR2Q35NG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔄 Firebase 驗證狀態
let isAuthenticated = false;

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("✅ 使用者已登入");
        isAuthenticated = true;
    } else {
        console.log("🚫 使用者未登入");
        isAuthenticated = false;
    }
});
function loadPage(path) {
    // 🚫 如果未認證，強制導回登入頁
    if (!isAuthenticated && path !== 'login.html') {
        alert("請先登入以進入該頁面");
        window.location.href = '/index.html';
        return;
    }

    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error('Page not found');
            }
            return response.text();
        })
        .then(html => {
            document.getElementById("content").innerHTML = html;
        })
        .catch(error => {
            console.error("❌ 無法載入頁面", error);
            document.getElementById("content").innerHTML = "<h2>404 - Page Not Found</h2>";
        });
}
// 📌 監聽 hashchange 事件
window.addEventListener("hashchange", () => {
    const page = window.location.hash.substring(1);

    if (!window.pageNameMap[page]) {
        console.error(`Page "${page}" 未定義於 config.json`);
        return;
    }

    // 🚫 驗證是否登入
    if (!isAuthenticated && page !== 'login') {
        alert("請先登入以繼續訪問該頁面");
        window.location.href = '/index.html';
        return;
    }

    navigationStack.push(page);
    loadPage(window.pageNameMap[page]);
    toggleBackButton();
});
let navigationStack = [];

// 📌 監聽 PageMapReady 事件，確保 pageNameMap 已經初始化
document.addEventListener("PageMapReady", () => {
    console.log("✅ PageMap 已經準備好，初始化 Router");

    // 🔄 如果沒有 hash，導向 home
    const defaultPage = window.location.hash.substring(1) || "home";
    
    // 🚀 自動載入首頁
    window.location.hash = `#${defaultPage}`;
    loadPage(window.pageNameMap[defaultPage]);
    document.getElementById("backButton").style.display = "none";
});

// 📌 監聽 hashchange 事件
window.addEventListener("hashchange", () => {
    const page = window.location.hash.substring(1);

    if (!window.pageNameMap[page]) {
        console.error(`Page "${page}" 未定義於 config.json`);
        return;
    }

    navigationStack.push(page);
    loadPage(window.pageNameMap[page]);
    toggleBackButton();
});

function loadPage(path) {
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error('Page not found');
            }
            return response.text();
        })
        .then(html => {
            document.getElementById("content").innerHTML = html;
        })
        .catch(error => {
            console.error("❌ 無法載入頁面", error);
            document.getElementById("content").innerHTML = "<h2>404 - Page Not Found</h2>";
        });
}

function toggleBackButton() {
    const backButton = document.getElementById("backButton");
    if (navigationStack.length > 1) {
        backButton.style.display = "block";
    } else {
        backButton.style.display = "none";
    }
}

document.getElementById("backButton").addEventListener("click", () => {
    if (navigationStack.length > 1) {
        navigationStack.pop();
        const previousPage = navigationStack[navigationStack.length - 1];
        window.location.hash = `#${previousPage}`;
        loadPage(window.pageNameMap[previousPage]);
    }
});