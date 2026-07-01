/**
 * Lecture Translator AI - Application Controller
 * Handles UI interactions, file uploads, and coordinates with GeminiApi.
 */

document.addEventListener('DOMContentLoaded', function() {
    // UI Elements
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const settingsBtn = document.getElementById('settingsBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    let uploadedFileName = "";

    // Helper to show visual feedback/notices
    function showUploadFeedback(message, isError = false) {
        const feedbackEl = document.getElementById('uploadFeedback');
        if (feedbackEl) {
            feedbackEl.textContent = message;
            feedbackEl.style.color = isError ? 'var(--error, red)' : 'var(--text, black)';
        }
    }

    function closeSettingsModal() {
        const modal = document.getElementById('settingsModal');
        if (modal) modal.style.display = 'none';
    }

    // ==========================================
    // 1. API ve Buton Durum Yönetimi
    // ==========================================
    function updateAnalyzeButtonState() {
        if (!settingsBtn) return;
        // API Anahtarı gemini-api.js içinde sabitlendiği için buton doğrudan yeşil/aktif kalır
        settingsBtn.style.color = 'var(--success, green)';
        settingsBtn.style.borderColor = 'var(--success, green)';
    }
    
    // Uygulama başlarken buton durumunu güncelle
    updateAnalyzeButtonState();

    // Ayarlar butonu veya modal kapatma tetikleyicisi için güvenli kapanış
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            closeSettingsModal();
        });
    }

    // ==========================================
    // 2. PDF Sürükle - Bırak ve Dosya Seçimi
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

    // ==========================================
    // 3. Dosya İşleme ve Analiz Tetikleme
    // ==========================================
    async function handlePdfFile(file) {
        if (file.type !== "application/pdf") {
            showUploadFeedback("Selected file is not a PDF.", true);
            return;
        }

        showUploadFeedback("Extracting text from PDF...", false);
        uploadedFileName = file.name;
        
        try {
            console.log("PDF successfully registered: " + uploadedFileName);
            showUploadFeedback(`Ready to analyze: ${uploadedFileName}`, false);
            
            if (analyzeBtn) {
                analyzeBtn.removeAttribute('disabled');
            }
        } catch (error) {
            console.error("Error reading file:", error);
            showUploadFeedback("Error reading PDF file.", true);
        }
    }

    // Analiz butonuna basıldığında tetiklenecek ana mantık
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async function() {
            console.log("Analyze button clicked!");
            showUploadFeedback("Analyzing with Gemini AI...", false);
            
            const textarea = document.getElementById('rawTextSource'); 
            const textToAnalyze = textarea ? textarea.value : "Sample lecture text fallback.";
            
            try {
                if (typeof GeminiApi !== 'undefined') {
                    const result = await GeminiApi.analyzeLecture(textToAnalyze, "Student", "Turkish");
                    console.log("Analysis Result:", result);
                    showUploadFeedback("Analysis complete!", false);
                } else {
                    throw new Error("GeminiApi class is missing.");
                }
            } catch (err) {
                console.error(err);
                showUploadFeedback(err.message, true);
            }
        });
    }
});
