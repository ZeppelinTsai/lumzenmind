// 建立一個名稱對應表
const pageNameMap = {};
if (!localStorage.getItem("language")) {
    localStorage.setItem("language", "zh");
}
currentLanguage = localStorage.getItem("language");

// 載入 config.json
fetch('./config.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Config.json 無法讀取: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // 設定 App 名稱
        document.title = data.appName;

        // 設定 App Icon
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = data.appIcon;
        document.head.appendChild(link);

        // 設定主題顏色
        const style = document.createElement('style');
        style.innerHTML = `
            :root {
                --primary-color: ${data.themeColor.primary};
                --secondary-color: ${data.themeColor.secondary};
                --background-color: ${data.themeColor.background};
                --text-color: ${data.themeColor.text};
            }
        `;
        document.head.appendChild(style);

        // 預設語言
        currentLanguage = localStorage.getItem("language") || data.defaultLanguage;

        // 設定頁面對應關係
        const pages = data.pages;
        const tabbar = document.getElementById("tabbar");

        Object.keys(pages).forEach((key) => {
            const page = pages[key];
            pageNameMap[key] = page.path;

            const link = document.createElement("a");
            link.href = `#${key}`;
            link.innerHTML = `
                <i class="${page.icon}"></i>
                <span>${data.languages[currentLanguage][page.name]}</span>
            `;
            tabbar.appendChild(link);
        });

        // ✅ 將 pageNameMap 曝露到全域
        window.pageNameMap = pageNameMap;

        // ✅ 如果是初始狀態，強制跳到 home
        if (!window.location.hash) {
            window.location.hash = '#home';
        }

        // ✅ 告訴 router.js 初始化完成
        document.dispatchEvent(new Event("PageMapReady"));
    })
    .catch(error => console.error("Config 加載失敗", error));
