const PonderrApp = {
    init: function() {
        this.detectPlatform();
        this.setupInteractions();
    },

    detectPlatform: function() {
        const ua = navigator.userAgent.toLowerCase();
        const isSmartTV = /smart-tv|tizen|webos|appletv/i.test(ua) || (window.innerWidth > 1600);
        
        if (isSmartTV) {
            document.body.classList.add("tv-mode");
        }
    },

    // The logic to handle downloads/printables
    handleDownload: function(fileUrl, fileName) {
        if (document.body.classList.contains("tv-mode")) {
            // Show QR Code for TVs
            this.showQRCode(fileUrl, fileName);
        } else {
            // Direct download for Mobile/PC
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            link.click();
        }
    },

    showQRCode: function(url, name) {
        const modal = document.getElementById('qr-modal');
        const qrImg = document.getElementById('qr-image');
        const qrText = document.getElementById('qr-text');

        // Use a free API to generate the QR code instantly
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
        qrText.innerText = `Scan to download: ${name}`;
        modal.style.display = "flex";
    },

    closeModal: function() {
        document.getElementById('qr-modal').style.display = "none";
    },

    setupInteractions: function() {
        // This is where you'll link your buttons later
    }
};

document.addEventListener('DOMContentLoaded', () => PonderrApp.init());