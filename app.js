// =======================
// Register Service Worker
// =======================
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js")
            .then(reg => console.log("SW registered"))
            .catch(err => console.log("SW failed:", err));
    });
}

// =======================
// Elemen UI
// =======================
const notifyBtn = document.getElementById("notifyBtn");
const notifStatus = document.getElementById("notifStatus");

// =======================
// Deteksi iPhone / Safari
// =======================
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isPWA = window.navigator.standalone === true;

// Jika iPhone + Safari + bukan PWA → blok notifikasi
if (isIOS && isSafari && !isPWA) {
    notifStatus.innerText =
        "👉 Untuk mengaktifkan notifikasi, install aplikasi ke Home Screen.\n" +
        "Tekan tombol Share → Add to Home Screen.";

    notifyBtn.disabled = true;
    notifyBtn.style.opacity = "0.5";
    notifyBtn.style.cursor = "not-allowed";
}

// =======================
// Tombol Tes Notifikasi
// =======================
notifyBtn.addEventListener("click", () => {

    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            new Notification("Notifikasi dari PWA", {
                body: "Berhasil! Notifikasi berjalan.",
                icon: "/images/icon-192x192.png"
            });

            notifStatus.innerText = "✅ Notifikasi berhasil dikirim!";
        } else {
            notifStatus.innerText = "❌ Notifikasi ditolak.";
        }
    });
});
