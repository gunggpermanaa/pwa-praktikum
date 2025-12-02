// app.js — versi bersih & bebas error
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
// Elements (defensive)
// ==============================
const notifyBtn = document.getElementById("notifyBtn");
const notifStatus = document.getElementById("notifStatus");

// Jika elemen tidak ditemukan, hentikan dan log
if (!notifyBtn || !notifStatus) {
  console.warn("Elemen #notifyBtn atau #notifStatus tidak ditemukan. Pastikan HTML mempunyai elemen tersebut.");
  // Jangan lanjutkan agar tidak error
} else {

  // ==============================
  // DETEKSI iOS / Safari (opsional)
  // ==============================
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isPWA = window.navigator.standalone === true; // true ketika dibuka sebagai PWA di iOS

  if (isIOS && isSafari && !isPWA) {
    // iOS Safari non-PWA: notifikasi web tidak didukung -> disable tombol
    notifStatus.innerText = "👉 Untuk notifikasi di iPhone: install aplikasi ke Home Screen (Share → Add to Home Screen).";
    notifyBtn.disabled = true;
    notifyBtn.style.opacity = "0.5";
    notifyBtn.style.cursor = "not-allowed";
  }

  // ==============================
  // Helper: Reset tombol
  // ==============================
  function resetButton(delay = 1000) {
    setTimeout(() => {
      notifyBtn.innerText = "Tes Notifikasi";
      notifyBtn.disabled = false;
      notifyBtn.style.opacity = "1";
      notifyBtn.style.cursor = "pointer";
    }, delay);
  }

  // ==============================
  // Click handler: kirim notifikasi via Service Worker
  // ==============================
  notifyBtn.addEventListener("click", async () => {
    try {
      // UI feedback
      notifyBtn.innerText = "Mengirim...";
      notifyBtn.disabled = true;
      notifyBtn.style.opacity = "0.7";

      // 1) Request permission jika belum granted
      if (!("Notification" in window)) {
        notifStatus.innerText = "Browser tidak mendukung Notification API.";
        resetButton();
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        notifStatus.innerText = "❌ Izinkan notifikasi terlebih dahulu.";
        resetButton();
        return;
      }

      // 2) Pastikan service worker terdaftar / siap
      let reg;
      try {
        // prefer navigator.serviceWorker.getRegistration() but fallback to ready
        reg = await navigator.serviceWorker.getRegistration();
        if (!reg) reg = await navigator.serviceWorker.ready;
      } catch (e) {
        // navigator.serviceWorker.ready mungkin error di browser very old
        console.warn("Service Worker ready/getRegistration error:", e);
      }

      if (!reg) {
        notifStatus.innerText = "❌ Service Worker belum terdaftar atau tidak tersedia.";
        resetButton();
        return;
      }

      // 3) Tampilkan notifikasi lewat Service Worker (works on Android)
      reg.showNotification("Notifikasi dari PWA", {
        body: "Berhasil! Ini notifikasi test dari Service Worker.",
        icon: "/images/icon-192x192.png",
        badge: "/images/icon-192x192.png",
        vibrate: [100, 50, 100],
        data: { url: "/" } // data bisa dipakai saat notificationclick
      });

      notifStatus.innerText = "✅ Notifikasi berhasil dikirim!";
      // hapus status setelah beberapa detik
      setTimeout(() => { notifStatus.innerText = ""; }, 3000);

      resetButton(800);
    } catch (err) {
      console.error("Error saat mengirim notifikasi:", err);
      notifStatus.innerText = "❌ Terjadi error saat mengirim notifikasi.";
      resetButton();
    }
  });
}

// ==============================
// TAMBAHAN: fallback notifikasi untuk Chrome Desktop
// (tidak mengubah kode asli satupun)
// ==============================
navigator.serviceWorker.ready.then(reg => {
  if (reg && Notification.permission === "granted") {
    console.log("Service Worker siap untuk menampilkan notifikasi di desktop.");
  }
});

reg.showNotification("Notifikasi dari PWA", {
  body: "Berhasil! Ini notifikasi test dari Service Worker (Desktop).",
  icon: "/images/icon-192x192.png",
  badge: "/images/icon-192x192.png",
  tag: "pwa-test",               // mencegah Chrome menggabung notif
  renotify: true,                // biar notif baru selalu tampil
  requireInteraction: true,      // notif tidak langsung hilang
});
