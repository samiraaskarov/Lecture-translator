/**
 * Lecture Translator AI - Home Page Controller
 * Manages UI interactions, PDF parsing integrations, settings, search, and dashboard loading.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Cache
    const body = document.body;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveKeyBtn = document.getElementById('saveKeyBtn');
    
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const uploadInfo = document.getElementById('uploadInfo');
    const uploadInfoText = document.getElementById('uploadInfoText');
    const notesText = document.getElementById('notesText');
    
    const difficultySelect = document.getElementById('difficultySelect');
    const languageSelect = document.getElementById('languageSelect');
    const lectureForm = document.getElementById('lectureForm');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    const historySearch = document.getElementById('historySearch');
    const historyList = document.getElementById('historyList');
    
    const statAnalyzed = document.getElementById('statAnalyzed');
    const statTimeSaved = document.getElementById('statTimeSaved');
    const statFavorites = document.getElementById('statFavorites');
    const statQuizScore = document.getElementById('statQuizScore');

    let pdfExtractedText = "";
    let uploadedFileName = "";

    // ==========================================
    // 1. Theme Configuration
    // ==========================================
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (!icon) return;
        if (theme === 'dark') {
            icon.className = 'ri-sun-line';
        } else {
            icon.className = 'ri-moon-line';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    initTheme();

    // ==========================================
    // 2. API Key Configuration Modal
    // ==========================================
    function openSettingsModal() {
        if (!apiKeyInput || !settingsModal) return;
        apiKeyInput.value = GeminiApi.getApiKey() || "";
        settingsModal.style.display = 'flex';
    }

    function closeSettingsModal() {
        if (settingsModal) settingsModal.style.display = 'none';
    }

    if (settingsBtn) {
    settingsBtn.style.display = "none";
}
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeSettingsModal);
    window.addEventListener('click', (e) => {
        if (settingsModal && e.target === settingsModal) closeSettingsModal();
    });

    if (saveKeyBtn) {
        saveKeyBtn.addEventListener('click', () => {
            if (!apiKeyInput) return;
            const key = apiKeyInput.value.trim();
            if (key) {
                GeminiApi.setApiKey(key);
                showNotice("API Key saved to session.", false);
            } else {
                GeminiApi.setApiKey("");
                showNotice("API Key cleared.", true);
            }
            closeSettingsModal();
           // updateAnalyzeButtonState();
        });
    }

    // Check if key is already stored and toggle colors
    function updateAnalyzeButtonState() {
        if (!settingsBtn) return;
        if (GeminiApi.hasApiKey()) {
            settingsBtn.style.color = 'var(--success)';
            settingsBtn.style.borderColor = 'var(--success)';
        } else {
            settingsBtn.style.color = '';
            settingsBtn.style.borderColor = '';
        }
    }
    updateAnalyzeButtonState();

    // ==========================================
    // 3. PDF Drag and Drop / Extraction
    // ==========================================
    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                handlePdfFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handlePdfFile(e.target.files[0]);
            }
        });
    }

    async function handlePdfFile(file) {
        if (file.type !== "application/pdf") {
            showUploadFeedback("Selected file is not a PDF.", true);
            return;
        }

        showUploadFeedback("Extracting text from PDF...", false);
        uploadedFileName = file.name;
        
        try {
            const text = await PdfHelper.extractText(file);
            pdfExtractedText = text;
            
            // Populates textarea automatically
            notesText.value = text;
            showUploadFeedback(`Extracted: ${file.name}`, false);
        } catch (error) {
            console.error("PDF extraction failed:", error);
            pdfExtractedText = "";
            
            // The prompt asks to handle scanned PDF specifically:
            if (error.message.includes("contains images")) {
                showUploadFeedback("This PDF contains images instead of selectable text.", true);
            } else {
                showUploadFeedback(error.message || "Failed to parse PDF.", true);
            }
            
            // Allow manual text input fallback instead
            notesText.focus();
        }
    }

    function showUploadFeedback(message, isError) {
        if (!uploadInfo || !uploadInfoText) return;
        uploadInfo.style.display = 'flex';
        uploadInfoText.textContent = message;
        const icon = uploadInfo.querySelector('i');
        if (isError) {
            uploadInfo.className = 'upload-info error';
            if (icon) icon.className = 'ri-error-warning-fill';
        } else {
            uploadInfo.className = 'upload-info';
            if (icon) icon.className = 'ri-checkbox-circle-fill';
        }
    }

    // ==========================================
    // 4. Form Submission and Validation
    // ==========================================
    if (lectureForm) {
        lectureForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!notesText || !difficultySelect || !languageSelect) return;
            const text = notesText.value.trim();
            const difficulty = difficultySelect.value;
            const language = languageSelect.value;

        // Validation 1: Text presence
        if (text.length < 50) {
            alert("No input provided. Please paste lecture notes or upload a PDF (minimum 50 characters).");
            notesText.focus();
            return;
        }


        // Store configurations in sessionStorage to parse in analysis page
        sessionStorage.setItem('current_lecture_text', text);
        sessionStorage.setItem('current_lecture_difficulty', difficulty);
        sessionStorage.setItem('current_lecture_language', language);
        sessionStorage.setItem('current_lecture_filename', uploadedFileName || "Pasted Lecture Notes");

        // Redirect to analysis page
        window.location.href = 'analysis.html';
        });
    }

    // ==========================================
    // 5. Dashboard Sidebar (History and Stats)
    // ==========================================
    function renderStats() {
        const stats = HistoryManager.getStats();
        if (statAnalyzed) statAnalyzed.textContent = stats.totalAnalyzed;
        if (statTimeSaved) statTimeSaved.textContent = stats.totalTimeSavedMin + 'm';
        if (statFavorites) statFavorites.textContent = stats.totalFavorites;
        if (statQuizScore) statQuizScore.textContent = stats.avgQuizScore;
    }

    function renderHistory(query = "") {
        const items = HistoryManager.searchItems(query);
        if (!historyList) return;
        
        if (items.length === 0) {
            historyList.innerHTML = `
                <div class="history-empty">
                    <i class="ri-folder-open-line" style="font-size: 2.25rem; display: block; margin-bottom: 0.5rem;"></i>
                    ${query ? 'No search results found.' : 'No saved lecture notes yet. Process one to start.'}
                </div>
            `;
            return;
        }

        historyList.innerHTML = "";
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.setAttribute('data-id', item.id);
            
            const favClass = item.favorite ? 'history-btn fav-btn active' : 'history-btn fav-btn';
            const starIcon = item.favorite ? 'ri-star-fill' : 'ri-star-line';
            
            // Format dates neatly
            const dateStr = new Date(item.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            div.innerHTML = `
                <div class="history-details">
                    <div class="history-name" title="Click to open">${escapeHtml(item.title)}</div>
                    <div class="history-meta">
                        <span><i class="ri-time-line"></i> ${dateStr}</span>
                        <span>•</span>
                        <span class="subject-tag"><i class="ri-book-open-line"></i> ${escapeHtml(item.subject)}</span>
                    </div>
                </div>
                <div class="history-actions">
                    <button class="${favClass}" title="Star as Favorite" data-action="favorite">
                        <i class="${starIcon}"></i>
                    </button>
                    <button class="history-btn rename-btn" title="Rename" data-action="rename">
                        <i class="ri-edit-line"></i>
                    </button>
                    <button class="history-btn del-btn" title="Delete" data-action="delete">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            `;

            // Click details to load item
            const detailsEl = div.querySelector('.history-details');
            if (detailsEl) {
                detailsEl.addEventListener('click', () => {
                    window.location.href = `analysis.html?id=${item.id}`;
                });
            }

            // Action Buttons
            const favEl = div.querySelector('[data-action="favorite"]');
            if (favEl) {
                favEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    HistoryManager.toggleFavorite(item.id);
                });
            }

            const renameEl = div.querySelector('[data-action="rename"]');
            if (renameEl) {
                renameEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const newName = prompt("Rename lecture notes to:", item.title);
                    if (newName !== null) {
                        HistoryManager.renameItem(item.id, newName);
                    }
                });
            }

            const deleteEl = div.querySelector('[data-action="delete"]');
            if (deleteEl) {
                deleteEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
                        HistoryManager.deleteItem(item.id);
                    }
                });
            }

            historyList.appendChild(div);
        });
    }

    // Bind Search Input
    if (historySearch) {
        historySearch.addEventListener('input', (e) => {
            renderHistory(e.target.value);
        });
    }

    // Listen to updates in history (auto-refresh list and stats)
    window.addEventListener('historyUpdated', () => {
        renderStats();
        if (historySearch) {
            renderHistory(historySearch.value);
        } else {
            renderHistory();
        }
    });

    // Initial render
    renderStats();
    renderHistory();

    // Utility notification toast-like helper
    function showNotice(text, isWarning) {
        alert(text); // Simple clean prompt alert fallback for browser setup
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
});
