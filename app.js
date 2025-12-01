// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered:', registration);
        })
        .catch(err => {
            console.error('SW registration failed:', err);
        });
    });
}

// Request permission on load
if ("Notification" in window) {
    Notification.requestPermission();
}

// === Tes Notifikasi yang SUPPORT Android ===
const notifyBtn = document.getElementById("notifyBtn");
const notifStatus = document.getElementById("notifStatus");

notifyBtn.addEventListener("click", async () => {

    notifyBtn.innerText = "Mengirim...";
    notifyBtn.disabled = true;
    notifyBtn.style.opacity = "0.6";

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
        notifStatus.innerText = "❌ Izinkan notifikasi terlebih dahulu.";
        resetButton();
        return;
    }

    navigator.serviceWorker.ready.then(reg => {
        reg.showNotification("Notifikasi dari PWA", {
            body: "Berhasil! Notifikasi dari Service Worker.",
            icon: "/images/icon-192x192.png",
            vibrate: [100, 50, 100]
        });
    });

    notifStatus.innerText = "✅ Notifikasi berhasil dikirim!";

    resetButton();
});

// === Utility ===
function resetButton() {
    setTimeout(() => {
        notifyBtn.innerText = "Tes Notifikasi";
        notifyBtn.disabled = false;
        notifyBtn.style.opacity = "1";
    }, 800);

    setTimeout(() => notifStatus.innerText = "", 1500);
}
