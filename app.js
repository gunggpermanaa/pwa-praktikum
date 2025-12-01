// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered:', reg))
        .catch(err => console.log('SW fail:', err));
}

// === POPUP IZIN NOTIFIKASI ===
const notifPopup = document.getElementById("notifPopup");
const allowNotifBtn = document.getElementById("allowNotifBtn");
const denyNotifBtn = document.getElementById("denyNotifBtn");

// Tampilkan popup hanya sekali
if (!localStorage.getItem("notifPermissionAsked")) {
    notifPopup.classList.remove("hidden");
}

// Jika klik IZINKAN
allowNotifBtn.addEventListener("click", async () => {
    notifPopup.classList.add("hidden");

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification("Terima kasih!", {
                body: "Notifikasi telah diaktifkan.",
                icon: "/images/icon-192x192.png"
            });
        });
    }

    // Jangan tampilkan popup lagi
    localStorage.setItem("notifPermissionAsked", "yes");
});

// Jika klik NANTI SAJA
denyNotifBtn.addEventListener("click", () => {
    notifPopup.classList.add("hidden");
    localStorage.setItem("notifPermissionAsked", "yes");
});


// === TES NOTIFIKASI BUTTON ===
const notifyBtn = document.getElementById("notifyBtn");
const notifStatus = document.getElementById("notifStatus");

notifyBtn.addEventListener("click", async () => {

    notifyBtn.innerText = "Mengirim...";
    notifyBtn.disabled = true;
    notifyBtn.style.opacity = "0.6";

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
        notifStatus.innerText = "❌ Izinkan notifikasi terlebih dahulu.";
        resetBtn();
        return;
    }

    navigator.serviceWorker.ready.then(reg => {
        reg.showNotification("Tes Notifikasi", {
            body: "Notifikasi berhasil dikirim!",
            icon: "/images/icon-192x192.png",
        });
    });

    notifStatus.innerText = "✅ Notifikasi berhasil dikirim!";
    resetBtn();
});

function resetBtn() {
    setTimeout(() => {
        notifyBtn.innerText = "Tes Notifikasi";
        notifyBtn.disabled = false;
        notifyBtn.style.opacity = "1";
    }, 1000);

    setTimeout(() => notifStatus.innerText = "", 2000);
}
