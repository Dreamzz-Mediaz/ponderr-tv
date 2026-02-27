/**
 * Ponderr TV - Final Integrated Logic
 * Platform Detection + YouTube Auto-Sync + Theme Engine
 */

const CONFIG = {
    API_KEY: 'YOUR_GOOGLE_CLOUD_API_KEY', // Must enable YouTube Data API v3
    PLAYLISTS: {
        K12: 'YOUR_K12_PLAYLIST_ID',      // Found in your YouTube URL after 'list='
        PRO: 'YOUR_PRO_PLAYLIST_ID'
    }
};

const PonderrApp = {
    init: function() {
        this.applySavedTheme();
        this.detectPlatform();
        this.syncContent();
    },

    // 1. Theme Engine
    toggleTheme: function(theme) {
        document.body.className = theme;
        localStorage.setItem('ponder-theme', theme);
    },

    applySavedTheme: function() {
        const saved = localStorage.getItem('ponder-theme') || 'dark-theme';
        this.toggleTheme(saved);
    },

    // 2. Detection Logic
    detectPlatform: function() {
        const ua = navigator.userAgent.toLowerCase();
        const isTV = /smart-tv|tizen|webos|appletv|googletv/i.test(ua) || (window.innerWidth > 1600);
        if (isTV) document.body.classList.add("tv-mode");
        
        const indicator = document.getElementById('platform-indicator');
        if (indicator) {
            indicator.innerText = isTV ? "Smart TV Mode" : (window.innerWidth < 768 ? "Mobile Mode" : "Desktop Mode");
        }
    },

    // 3. Auto-Sync YouTube Content
    syncContent: function() {
        this.fetchPlaylist(CONFIG.PLAYLISTS.K12, 'k12-container', 'Printable Handout');
        this.fetchPlaylist(CONFIG.PLAYLISTS.PRO, 'pro-container', 'Professional Toolkit');
    },

    fetchPlaylist: async function(id, containerId, label) {
        const container = document.getElementById(containerId);
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${id}&key=${CONFIG.API_KEY}`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data.items) {
                container.innerHTML = ''; // Clear spinner
                data.items.forEach(item => {
                    const vidId = item.snippet.resourceId.videoId;
                    const title = item.snippet.title;
                    const thumb = item.snippet.thumbnails.medium.url;
                    container.innerHTML += this.buildCard(vidId, title, thumb, label);
                });
            }
        } catch (e) {
            console.error("Sync Failed", e);
            container.innerHTML = "<p>YouTube Sync temporarily unavailable.</p>";
        }
    },

    buildCard: function(id, title, thumb, label) {
        return `
            <div class="video-card glass-card" onclick="window.location.href='https://youtube.com/watch?v=${id}'">
                <div class="video-thumbnail-wrapper">
                    <img src="${thumb}" alt="${title}">
                    <img src="../assets/icons/watermark.png" class="watermark-overlay">
                </div>
                <div class="video-info">
                    <h4>${title}</h4>
                    <button class="btn-resource" onclick="event.stopPropagation(); PonderrApp.handleDownload('../members-access/resources/${id}.pdf', '${label}')">
                        ${label}
                    </button>
                </div>
            </div>`;
    },

    handleDownload: function(url, name) {
        if (document.body.classList.contains("tv-mode")) {
            const modal = document.getElementById('qr-modal');
            const qrImg = document.getElementById('qr-image');
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin + url)}`;
            modal.style.display = "flex";
        } else {
            window.open(url, '_blank');
        }
    },

    closeModal: function() {
        document.getElementById('qr-modal').style.display = "none";
    }
};

window.toggleTheme = (t) => PonderrApp.toggleTheme(t);
document.addEventListener('DOMContentLoaded', () => PonderrApp.init());
