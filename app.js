// ==============================
// Register Service Worker
// ==============================
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js")
            .then(registration => {
                console.log("Service Worker registered:", registration);
            })
            .catch(err => {
                console.error("Service Worker registration failed:", err);
            });
    });
}

// ==============================
// Request Permission (Optional)
// ==============================
if ("Notification" in window) {
    Notification.requestPermission();
}

// ==============================
// Tes Notifikasi
// ==============================
const notifyBtn = document.getElementById("notifyBtn");
const notifStatus = document.getElementById("notifStatus");

notifyBtn.addEventListener("click", () => {
    // Ubah tampilan tombol
    notifyBtn.innerText = "Mengirim...";
    notifyBtn.disabled = true;
    notifyBtn.style.opacity = "0.7";

    Notification.requestPermission().then(permission => {
        if (permission === "granted") {

            new Notification("Notifikasi dari PWA", {
                body: "Berhasil! Ini notifikasi test.",
                icon: "/images/icon-192x192.png"
            });

            notifStatus.innerText = "✅ Notifikasi berhasil dikirim!";
        } else {
            notifStatus.innerText = "❌ Notifikasi ditolak.";
        }

        // Kembalikan tombol normal
        setTimeout(() => {
            notifyBtn.innerText = "Tes Notifikasi";
            notifyBtn.disabled = false;
            notifyBtn.style.opacity = "1";
        }, 1000);

        // Hilangkan teks status setelah 2 detik
        setTimeout(() => {
            notifStatus.innerText = "";
        }, 2000);

        // DETEKSI iPhone
const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

// DETEKSI Safari iOS (bukan Chrome/Firefox)
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// DETEKSI apakah PWA (dibuka dari Home Screen)
const isPWA = window.navigator.standalone === true;

// Element UI
const notifyBtn = document.getElementById("notifyBtn");
const notifStatus = document.getElementById("notifStatus");

// Logika Deteksi
if (isIOS && isSafari && !isPWA) {
    notifStatus.innerText = 
      "👉 Untuk mengaktifkan notifikasi, install aplikasi ke Home Screen.\n" +
      "Buka menu Share → Add to Home Screen.";

    notifyBtn.disabled = true;
    notifyBtn.style.opacity = "0.5";
    notifyBtn.style.cursor = "not-allowed";
}

    });
});
