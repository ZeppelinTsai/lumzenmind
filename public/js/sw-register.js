// 註冊 Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log("Service Worker Registered", reg))
        .catch(err => console.log("Service Worker Failed", err));
}
