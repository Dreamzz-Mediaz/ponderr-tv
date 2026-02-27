/**
 * Ponderr TV - Advanced Logic Engine (2026)
 * Includes: Platform Detection, YouTube Auto-Sync, Theme Engine, and QR Logic
 */

// --- CONFIGURATION (Update these with your actual IDs) ---
const CONFIG = {
    API_KEY: 'YOUR_GOOGLE_CLOUD_API_KEY', // Get from Google Cloud Console
    PLAYLISTS: {
        K12: 'YOUR_K12_PLAYLIST_ID',      // e.g., PL...
        PRO: 'YOUR_PRO_PLAYLIST_ID'       // e.g., PL...
    }
};

const PonderrApp = {
    init: function() {
        this.applySavedTheme();
        this.detectPlatform();
        this.syncYouTubeContent();
    },

    // 1. Theme Engine (Glassmorphism / Themes)
    toggleTheme: function(themeName) {
        document.body.className = themeName;
        localStorage.setItem('ponder-theme', themeName);
        console.log(`Theme switched to: ${themeName}`);
    },

    applySavedTheme: function() {
        const savedTheme = localStorage.getItem('ponder-theme') || 'dark-theme';
        this.toggleTheme(savedTheme);
    },

    // 2. Platform Detection (Revised for 2026)
    detectPlatform: function() {
        const ua = navigator.userAgent.toLowerCase();
        const body = document.body;
        const width = window.innerWidth;

        const isSmartTV = /smart-tv|tizen|webos|appletv|googletv/i.test(ua) || (width > 1600);
        const isMobile = /iphone|ipad|android/i.test(ua);

        if (isSmartTV) {
            body.classList.add("tv-mode");
            document.getElementById('platform-indicator').innerText = "Smart TV Mode";
        } else if (isMobile) {
            body.classList.add("mobile-mode");
            document.getElementById('platform-indicator').innerText = "Mobile Mode";
        } else {
            document.getElementById('platform-indicator').innerText = "Desktop Mode";
        }
    },

    // 3. YouTube Auto-Sync Logic (Dynamic Fetching)
    syncYouTubeContent: function() {
        this.fetchPlaylist(CONFIG.PLAYLISTS.K12, 'k12-container', 'K12 Resources');
        this.fetchPlaylist(CONFIG.PLAYLISTS.PRO, 'pro-container', 'Pro Toolkit');
    },

    fetchPlaylist: async function(playlistId, containerId, resourceLabel) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=12&playlistId=${playlistId}&key=${CONFIG.API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.items) {
                container.innerHTML = ''; // Clear the "Fetching..." message
                data.items.forEach(item => {
                    const snippet = item.snippet;
                    const vidId = snippet.resourceId.videoId;
                    const title = snippet.title;
                    const thumb = snippet.thumbnails.medium.url;

                    container.innerHTML += this.createVideoCard(vidId, title, thumb, resourceLabel);
                });
            }
        } catch (error) {
            console.error("YouTube Sync Failed:", error);
            container.innerHTML = `<p style="color:red;">Error syncing with YouTube. Check API Key.</p>`;
        }
    },

    // 4. UI Component Generator (Glassmorphism + Watermark)
    createVideoCard: function(vidId, title, thumb, label) {
        return `
            <div class="video-card glass-card" onclick="window.location.href='https://youtube.com/watch?v=${vidId}'">
                <div class="video-thumbnail-wrapper">
                    <img src="${thumb}" alt="${title}">
                    <img src="./assets/icons/watermark.png" class="watermark-overlay">
                </div>
                <div class="video-info">
                    <h4>${title}</h4>
                    <button class="btn-resource" onclick="event.stopPropagation(); PonderrApp.handleDownload('./members-access/resources/${vidId}.pdf', '${label}')">
                        ${label}
                    </button>
                </div>
            </div>
        `;
    },

    // 5. Smart TV QR Logic
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

// Global helper for the HTML buttons
window.toggleTheme = (theme) => PonderrApp.toggleTheme(theme);

// Initial Load
document.addEventListener('DOMContentLoaded', () => PonderrApp.init());
