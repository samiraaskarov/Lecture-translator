/**
 * Lecture Translator AI - Lecture Analysis Controller
 * Manages Gemini requests, skeleton transitions, card rendering, flashcards carousel,
 * quiz grading, and exporting (PDF print layout, Word doc creation, markdown clipboard).
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

    const loadingView = document.getElementById('loadingView');
    const loadingText = document.getElementById('loadingText');
    const errorView = document.getElementById('errorView');
    const errorText = document.getElementById('errorText');
    const resultsView = document.getElementById('resultsView');

    const lectureTitle = document.getElementById('lectureTitle');
    const subjectName = document.getElementById('subjectName');
    const favoriteBtn = document.getElementById('favoriteBtn');
    const copyAllBtn = document.getElementById('copyAllBtn');
    const downloadWordBtn = document.getElementById('downloadWordBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');

    // Cards content boxes
    const simplifiedNotesContent = document.getElementById('simplifiedNotesContent');
    const shortSummaryContent = document.getElementById('shortSummaryContent');
    const keyConceptsContent = document.getElementById('keyConceptsContent');
    const definitionsContent = document.getElementById('definitionsContent');
    const difficultTermsContent = document.getElementById('difficultTermsContent');
    const importantPointsContent = document.getElementById('importantPointsContent');
    const studyTipsContent = document.getElementById('studyTipsContent');
    const originalTimeVal = document.getElementById('originalTimeVal');
    const simplifiedTimeVal = document.getElementById('simplifiedTimeVal');
    const timeSavedBadge = document.getElementById('timeSavedBadge');

    // Interactive Flashcards
    const flashcardWrapper = document.getElementById('flashcardWrapper');
    const flashcard = document.getElementById('flashcard');
    const flashcardFrontText = document.getElementById('flashcardFrontText');
    const flashcardBackText = document.getElementById('flashcardBackText');
    const flashcardCount = document.getElementById('flashcardCount');
    const prevFlashcardBtn = document.getElementById('prevFlashcardBtn');
    const flipFlashcardBtn = document.getElementById('flipFlashcardBtn');
    const nextFlashcardBtn = document.getElementById('nextFlashcardBtn');

    // Interactive Quiz
    const quizPanel = document.getElementById('quizPanel');
    const quizScoreCount = document.getElementById('quizScoreCount');
    const quizContainer = document.getElementById('quizContainer');
    const quizProgressFill = document.getElementById('quizProgressFill');
    const quizQuestionType = document.getElementById('quizQuestionType');
    const quizQuestionText = document.getElementById('quizQuestionText');
    const quizOptions = document.getElementById('quizOptions');
    const quizTextInput = document.getElementById('quizTextInput');
    const quizFeedback = document.getElementById('quizFeedback');
    const quizFeedbackHeader = document.getElementById('quizFeedbackHeader');
    const quizFeedbackText = document.getElementById('quizFeedbackText');
    const quizSkipBtn = document.getElementById('quizSkipBtn');
    const quizSubmitBtn = document.getElementById('quizSubmitBtn');
    const quizScoreView = document.getElementById('quizScoreView');
    const quizScoreVal = document.getElementById('quizScoreVal');
    const quizScoreHeadline = document.getElementById('quizScoreHeadline');
    const quizScoreDesc = document.getElementById('quizScoreDesc');
    const quizRestartBtn = document.getElementById('quizRestartBtn');

    // Active state variables
    let currentItem = null; // Loaded history item object
    let flashcardsList = [];
    let currentFlashcardIndex = 0;
    let quizQuestionsList = [];
    let currentQuestionIndex = 0;
    let quizScore = 0;
    let quizAnswersState = []; // Holds user responses
    let isQuestionSubmitted = false;

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
    // 2. Settings Modal
    // ==========================================
    function openSettingsModal() {
        apiKeyInput.value = GeminiApi.getApiKey() || "";
        settingsModal.style.display = 'flex';
    }

    function closeSettingsModal() {
        settingsModal.style.display = 'none';
    }

    settingsBtn.addEventListener('click', openSettingsModal);
    modalCloseBtn.addEventListener('click', closeSettingsModal);
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettingsModal();
    });

    saveKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            GeminiApi.setApiKey(key);
            alert("API Key saved to session.");
        } else {
            GeminiApi.setApiKey("");
            alert("API Key cleared.");
        }
        closeSettingsModal();
        updateSettingsBtnState();
    });

    function updateSettingsBtnState() {
        if (GeminiApi.hasApiKey()) {
            settingsBtn.style.color = 'var(--success)';
            settingsBtn.style.borderColor = 'var(--success)';
        } else {
            settingsBtn.style.color = '';
            settingsBtn.style.borderColor = '';
        }
    }
    updateSettingsBtnState();

    // ==========================================
    // 3. Controller Entry Point & API Handling
    // ==========================================
    async function initController() {
        const urlParams = new URLSearchParams(window.location.search);
        const historyId = urlParams.get('id');

        if (historyId) {
            // View existing item from history list
            const history = HistoryManager.getHistory();
            currentItem = history.find(item => item.id === historyId);
            
            if (currentItem) {
                renderAnalysisDashboard(currentItem);
                return;
            } else {
                console.warn("Item with ID not found in history, falling back to session inputs.");
            }
        }

        // Get configurations from sessionStorage
        const text = sessionStorage.getItem('current_lecture_text');
        const difficulty = sessionStorage.getItem('current_lecture_difficulty') || 'Student';
        const language = sessionStorage.getItem('current_lecture_language') || 'English';
        const fileName = sessionStorage.getItem('current_lecture_filename') || 'Lecture Notes';

        if (!text || text.trim().length < 50) {
            // Redirect home if no content is found
            window.location.href = 'index.html';
            return;
        }

        // Show Loading state and start status updates
        startLoadingTicker();
        
        try {
            // Call Gemini
            const results = await GeminiApi.analyzeLecture(text, difficulty, language);
            
            // Auto Save to local history list
            currentItem = HistoryManager.autoSaveAnalysis(
                fileName,
                results.subject,
                difficulty,
                language,
                text,
                results
            );

            // Clean up session input so page refresh doesn't double-charge APIs
            sessionStorage.removeItem('current_lecture_text');
            sessionStorage.removeItem('current_lecture_difficulty');
            sessionStorage.removeItem('current_lecture_language');
            sessionStorage.removeItem('current_lecture_filename');

            // Re-route URL without page refresh to preserve state on reload
            const newUrl = `${window.location.pathname}?id=${currentItem.id}`;
            window.history.replaceState({ id: currentItem.id }, '', newUrl);

            // Render output
            renderAnalysisDashboard(currentItem);
        } catch (error) {
            console.error("Gemini processing error:", error);
            stopLoadingTicker();
            loadingView.style.display = 'none';
            errorView.style.display = 'flex';
            errorText.textContent = error.message || "An unexpected network error occurred while communicating with Gemini.";
        }
    }

    // Status updates on loading view to feel premium and alive
    let tickerInterval = null;
    function startLoadingTicker() {
        const statuses = [
            "Parsing text contents...",
            "Detecting smart lecture subject...",
            "Simplifying difficult formulations...",
            "Extracting core definitions...",
            "Translating scientific terminology...",
            "Drafting customized exam questions...",
            "Generating custom study strategies...",
            "Finalizing dashboard view..."
        ];
        let idx = 0;
        tickerInterval = setInterval(() => {
            if (idx < statuses.length) {
                loadingText.textContent = statuses[idx];
                idx++;
            } else {
                idx = 2; // Loop from core translations
            }
        }, 3000);
    }

    function stopLoadingTicker() {
        if (tickerInterval) clearInterval(tickerInterval);
    }

    // ==========================================
    // 4. Result Dashboard Rendering
    // ==========================================
    function renderAnalysisDashboard(item) {
        stopLoadingTicker();
        loadingView.style.display = 'none';
        errorView.style.display = 'none';
        resultsView.style.display = 'block';

        const results = item.results;

        // Header info
        lectureTitle.textContent = item.title;
        subjectName.textContent = results.subject || "General Study";
        
        // Favorite state button
        updateFavoriteBtnState(item.favorite);

        // 📖 Simplified Notes Card
        simplifiedNotesContent.innerHTML = formatRichText(results.simplifiedNotes);

        // 📝 Short Summary Card
        shortSummaryContent.innerHTML = formatRichText(results.shortSummary);

        // 📌 Key Concepts Card
        if (results.keyConcepts && results.keyConcepts.length > 0) {
            keyConceptsContent.innerHTML = `<ul>${results.keyConcepts.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>`;
        } else {
            keyConceptsContent.innerHTML = "<p>No key concepts defined.</p>";
        }

        // 📚 Definitions Card
        if (results.definitions && results.definitions.length > 0) {
            definitionsContent.innerHTML = results.definitions.map(d => `
                <div class="definition-item">
                    <div class="definition-term"><i class="ri-bookmark-3-fill"></i> ${escapeHtml(d.term)}</div>
                    <div style="font-size: 0.9375rem; color: var(--text-secondary);">${escapeHtml(d.definition)}</div>
                </div>
            `).join('');
        } else {
            definitionsContent.innerHTML = "<p>No specific definitions extracted.</p>";
        }

        // ⚖ Difficult Terms Explained Card
        if (results.difficultTerms && results.difficultTerms.length > 0) {
            difficultTermsContent.innerHTML = `
                <div class="term-list">
                    ${results.difficultTerms.map(t => `
                        <div class="term-item">
                            <div class="term-title">${escapeHtml(t.term)}</div>
                            <div class="term-desc">${escapeHtml(t.explanation)}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            difficultTermsContent.innerHTML = "<p>No technical terms isolated.</p>";
        }

        // ⭐ Most Important Points Card
        if (results.importantPoints && results.importantPoints.length > 0) {
            importantPointsContent.innerHTML = `<ul>${results.importantPoints.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>`;
        } else {
            importantPointsContent.innerHTML = "<p>No points specified.</p>";
        }

        // 💡 Study Tips Card
        if (results.studyTips) {
            const tips = results.studyTips;
            studyTipsContent.innerHTML = `
                <div class="study-tips-section">
                    <div class="tip-block">
                        <div class="tip-block-title" style="color: #f59e0b;"><i class="ri-focus-3-line"></i> To Memorize</div>
                        <div class="tip-block-content">
                            <ul>${(tips.toMemorize || []).map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul>
                        </div>
                    </div>
                    <div class="tip-block">
                        <div class="tip-block-title" style="color: var(--accent);"><i class="ri-brain-line"></i> To Understand</div>
                        <div class="tip-block-content">
                            <ul>${(tips.toUnderstand || []).map(u => `<li>${escapeHtml(u)}</li>`).join('')}</ul>
                        </div>
                    </div>
                    <div class="tip-block">
                        <div class="tip-block-title" style="color: var(--success);"><i class="ri-medal-line"></i> Exam Forecast</div>
                        <div class="tip-block-content">
                            <p>${escapeHtml(tips.examPrediction || 'Review general subject matters.')}</p>
                        </div>
                    </div>
                    <div class="tip-block">
                        <div class="tip-block-title" style="color: var(--text-secondary);"><i class="ri-guide-line"></i> Recommendations</div>
                        <div class="tip-block-content">
                            <ul>${(tips.generalRecommendations || []).map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
                        </div>
                    </div>
                </div>
            `;
        } else {
            studyTipsContent.innerHTML = "<p>No recommendations generated.</p>";
        }

        // ⏱ Reading Time Card
        const origTime = parseInt(results.originalReadingTimeMin) || 0;
        const simpTime = parseInt(results.simplifiedReadingTimeMin) || 0;
        originalTimeVal.textContent = origTime;
        simplifiedTimeVal.textContent = simpTime;
        if (origTime > simpTime && origTime > 0) {
            const percentSaved = Math.round(((origTime - simpTime) / origTime) * 100);
            timeSavedBadge.innerHTML = `<i class="ri-speed-up-line"></i> Saved <strong>${percentSaved}%</strong> reading time`;
            timeSavedBadge.style.display = 'block';
        } else {
            timeSavedBadge.style.display = 'none';
        }

        // Initialize Interactive Elements
        initFlashcards(results);
        initQuiz(results);
    }

    function updateFavoriteBtnState(isFav) {
        const icon = favoriteBtn.querySelector('i');
        if (isFav) {
            favoriteBtn.className = 'btn-icon active';
            favoriteBtn.style.color = '#f59e0b';
            icon.className = 'ri-star-fill';
        } else {
            favoriteBtn.className = 'btn-icon';
            favoriteBtn.style.color = '';
            icon.className = 'ri-star-line';
        }
    }

    // Toggle favorite state
    favoriteBtn.addEventListener('click', () => {
        if (currentItem) {
            const isFav = HistoryManager.toggleFavorite(currentItem.id);
            currentItem.favorite = isFav;
            updateFavoriteBtnState(isFav);
        }
    });

    // ==========================================
    // 5. Interactive Flashcards Carousel
    // ==========================================
    function initFlashcards(results) {
        flashcardsList = [];
        currentFlashcardIndex = 0;

        // 1. Gather flashcards from Definitions
        if (results.definitions && results.definitions.length > 0) {
            results.definitions.forEach(d => {
                flashcardsList.push({ front: d.term, back: d.definition, badge: "Definition" });
            });
        }
        
        // 2. Gather flashcards from Difficult Terms
        if (results.difficultTerms && results.difficultTerms.length > 0) {
            results.difficultTerms.forEach(t => {
                flashcardsList.push({ front: t.term, back: t.explanation, badge: "Technical Term" });
            });
        }

        // 3. Fallback to key concepts if empty
        if (flashcardsList.length === 0) {
            if (results.keyConcepts && results.keyConcepts.length > 0) {
                results.keyConcepts.forEach((c, idx) => {
                    flashcardsList.push({ front: `Key Concept #${idx+1}`, back: c, badge: "Concept" });
                });
            } else {
                flashcardsList.push({ front: "No interactive flashcards", back: "This lecture does not contain definitions or key terms to flip.", badge: "Info" });
            }
        }

        renderFlashcard();
    }

    function renderFlashcard() {
        if (flashcardsList.length === 0) return;
        
        // Reset flip state
        flashcard.classList.remove('flipped');
        
        const card = flashcardsList[currentFlashcardIndex];
        
        // Setup text on card faces
        flashcardFrontText.textContent = card.front;
        flashcardBackText.textContent = card.back;
        
        // Update front badge dynamically
        const frontBadge = flashcard.querySelector('.flashcard-front .flashcard-badge');
        const backBadge = flashcard.querySelector('.flashcard-back .flashcard-badge');
        if (frontBadge) frontBadge.textContent = card.badge;
        if (backBadge) backBadge.textContent = `${card.badge} Explanation`;

        // Update count
        flashcardCount.textContent = `Card ${currentFlashcardIndex + 1} of ${flashcardsList.length}`;
    }

    // Toggle Flip card
    function toggleFlip() {
        flashcard.classList.toggle('flipped');
    }

    flashcardWrapper.addEventListener('click', toggleFlip);
    flipFlashcardBtn.addEventListener('click', toggleFlip);

    prevFlashcardBtn.addEventListener('click', () => {
        if (currentFlashcardIndex > 0) {
            currentFlashcardIndex--;
            renderFlashcard();
        } else {
            // Loop back to end
            currentFlashcardIndex = flashcardsList.length - 1;
            renderFlashcard();
        }
    });

    nextFlashcardBtn.addEventListener('click', () => {
        if (currentFlashcardIndex < flashcardsList.length - 1) {
            currentFlashcardIndex++;
            renderFlashcard();
        } else {
            // Loop back to start
            currentFlashcardIndex = 0;
            renderFlashcard();
        }
    });

    // ==========================================
    // 6. Interactive Quiz Engine
    // ==========================================
    function initQuiz(results) {
        quizQuestionsList = results.examQuestions || [];
        currentQuestionIndex = 0;
        quizScore = 0;
        quizAnswersState = [];
        isQuestionSubmitted = false;

        if (quizQuestionsList.length === 0) {
            // Reconstruct a fallback if empty
            quizQuestionsList = [
                {
                    type: "Short Answer",
                    question: "Summarize the main goal of this lecture notes text.",
                    options: [],
                    answer: "Consult the Simplified Notes card above for main conceptual details."
                }
            ];
        }

        // Show quiz panel contents, hide score panel
        quizContainer.style.display = 'flex';
        quizScoreView.style.display = 'none';
        quizScoreCount.style.display = 'none';

        renderQuizQuestion();
    }

    function renderQuizQuestion() {
        isQuestionSubmitted = false;
        quizFeedback.style.display = 'none';
        quizTextInput.value = "";
        quizTextInput.style.display = 'none';
        quizOptions.style.display = 'none';
        quizOptions.innerHTML = "";
        
        // Progress bar
        const progressPercentage = (currentQuestionIndex / quizQuestionsList.length) * 100;
        quizProgressFill.style.width = `${progressPercentage}%`;

        // Update state labels
        if (quizSubmitBtn) {
            const span = quizSubmitBtn.querySelector('span');
            if (span) {
                span.textContent = "Submit Answer";
            } else {
                quizSubmitBtn.textContent = "Submit Answer";
            }
        }
        if (quizSkipBtn) quizSkipBtn.style.display = 'inline-flex';

        const q = quizQuestionsList[currentQuestionIndex];
        quizQuestionType.textContent = q.type || "Short Answer";
        quizQuestionText.textContent = q.question;

        // Adjust UI depending on question type
        if (q.type === "Multiple Choice" && q.options && q.options.length > 0) {
            quizOptions.style.display = 'flex';
            
            q.options.forEach(opt => {
                const optBtn = document.createElement('div');
                optBtn.className = 'quiz-option';
                optBtn.innerHTML = `
                    <i class="ri-checkbox-blank-circle-line"></i>
                    <span>${escapeHtml(opt)}</span>
                `;
                
                optBtn.addEventListener('click', () => {
                    if (isQuestionSubmitted) return;
                    
                    // Clear previous selection
                    const options = quizOptions.querySelectorAll('.quiz-option');
                    options.forEach(o => {
                        o.classList.remove('selected');
                        o.querySelector('i').className = 'ri-checkbox-blank-circle-line';
                    });
                    
                    // Mark this one
                    optBtn.classList.add('selected');
                    optBtn.querySelector('i').className = 'ri-checkbox-circle-fill';
                });
                
                quizOptions.appendChild(optBtn);
            });
        } else {
            // Short Answer or Essay
            quizTextInput.style.display = 'block';
        }
    }

    quizSubmitBtn.addEventListener('click', () => {
        if (isQuestionSubmitted) {
            // Double-use: acts as "Next Question"
            currentQuestionIndex++;
            if (currentQuestionIndex < quizQuestionsList.length) {
                renderQuizQuestion();
            } else {
                renderQuizScoreScreen();
            }
            return;
        }

        const q = quizQuestionsList[currentQuestionIndex];
        let userAnswer = "";
        let isCorrect = false;
        let explanation = "";

        if (q.type === "Multiple Choice" && q.options && q.options.length > 0) {
            const selectedOpt = quizOptions.querySelector('.quiz-option.selected');
            if (!selectedOpt) {
                alert("Please select an option before submitting.");
                return;
            }
            
            userAnswer = selectedOpt.querySelector('span').textContent.trim();
            const cleanAnswer = q.answer ? q.answer.trim() : "";
            
            // Check if matches the answer (either option text or option key index/letter)
            // e.g. cleanAnswer could be "A" or "Option Text"
            // We match by comparing string includes or matching index
            const isMatchText = userAnswer.toLowerCase() === cleanAnswer.toLowerCase() || 
                                userAnswer.toLowerCase().includes(cleanAnswer.toLowerCase());
            
            const optSpan = selectedOpt.querySelector('span');
            const optIndex = optSpan ? q.options.indexOf(optSpan.textContent) : -1;
            const indexLetter = optIndex !== -1 ? String.fromCharCode(65 + optIndex) : ""; // A, B, C, D
            const isMatchLetter = indexLetter && indexLetter.toLowerCase() === cleanAnswer.toLowerCase();
            
            isCorrect = isMatchText || isMatchLetter;

            // Highlight Options with green (correct) / red (incorrect)
            const options = quizOptions.querySelectorAll('.quiz-option');
            options.forEach(o => {
                const span = o.querySelector('span');
                const icon = o.querySelector('i');
                if (!span) return;
                const optText = span.textContent.trim();
                const idx = q.options.indexOf(optText);
                const letCode = String.fromCharCode(65 + idx);

                if (optText === userAnswer) {
                    if (isCorrect) {
                        o.className = 'quiz-option correct';
                        if (icon) icon.className = 'ri-checkbox-circle-fill';
                    } else {
                        o.className = 'quiz-option incorrect';
                        if (icon) icon.className = 'ri-close-circle-fill';
                    }
                }
                
                // Outline correct choice if user made a mistake
                if (!isCorrect && (optText.toLowerCase() === cleanAnswer.toLowerCase() || letCode.toLowerCase() === cleanAnswer.toLowerCase())) {
                    o.className = 'quiz-option correct';
                    if (icon) icon.className = 'ri-checkbox-circle-fill';
                }
            });

            if (isCorrect) {
                quizScore++;
                quizFeedback.className = 'quiz-feedback correct';
                quizFeedbackHeader.textContent = "Correct!";
                quizFeedbackText.textContent = "You selected the correct option.";
            } else {
                quizFeedback.className = 'quiz-feedback incorrect';
                quizFeedbackHeader.textContent = "Incorrect";
                quizFeedbackText.textContent = `The correct answer is: ${q.answer}`;
            }
        } else {
            // Short Answer / Essay
            userAnswer = quizTextInput.value.trim();
            if (!userAnswer) {
                alert("Please type an answer before submitting.");
                return;
            }

            // Short Answer/Essay can be self-graded or automatically reviewed. We show the model solution.
            isCorrect = true; // Auto-pass for writing participation
            quizScore++;

            quizFeedback.className = 'quiz-feedback correct';
            quizFeedbackHeader.textContent = "Answer Logged. Model Answer:";
            quizFeedbackText.textContent = q.answer || "Review simplified notes for details.";
        }

        // Show feedback block
        quizFeedback.style.display = 'block';
        isQuestionSubmitted = true;
        
        // Hide Skip and turn Submit into "Next"
        if (quizSkipBtn) quizSkipBtn.style.display = 'none';
        if (quizSubmitBtn) {
            const btnText = (currentQuestionIndex === quizQuestionsList.length - 1) ? "View Results" : "Next Question";
            const span = quizSubmitBtn.querySelector('span');
            if (span) {
                span.textContent = btnText;
            } else {
                quizSubmitBtn.textContent = btnText;
            }
        }
    });

    quizSkipBtn.addEventListener('click', () => {
        // Log skip and proceed
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestionsList.length) {
            renderQuizQuestion();
        } else {
            renderQuizScoreScreen();
        }
    });

    function renderQuizScoreScreen() {
        quizProgressFill.style.width = '100%';
        quizContainer.style.display = 'none';
        quizScoreView.style.display = 'flex';
        
        quizScoreVal.textContent = `${quizScore}/${quizQuestionsList.length}`;
        
        const pct = (quizScore / quizQuestionsList.length) * 100;
        
        if (pct >= 80) {
            quizScoreHeadline.textContent = "🏆 Excellent Work!";
            quizScoreDesc.textContent = "Outstanding retention! You're fully prepared for questions related to these concepts.";
        } else if (pct >= 50) {
            quizScoreHeadline.textContent = "📚 Good Progress!";
            quizScoreDesc.textContent = "Solid understanding! Try reviewing the definitions and flashcards before retaking to score higher.";
        } else {
            quizScoreHeadline.textContent = "🔄 Keep Studying!";
            quizScoreDesc.textContent = "Review the Simplified Notes and study tips to build your core comprehension.";
        }

        // Update score in local history
        if (currentItem) {
            const scoreStr = `${quizScore}/${quizQuestionsList.length}`;
            HistoryManager.updateQuizScore(currentItem.id, scoreStr);
        }
    }

    quizRestartBtn.addEventListener('click', () => {
        initQuiz(currentItem.results);
    });

    // ==========================================
    // 7. Clipboard Copy Actions
    // ==========================================
    
    // Copy Individual Card Content
    const copyCardBtns = document.querySelectorAll('[data-action="copy-card"]');
    copyCardBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.result-card');
            const contentDiv = card.querySelector('.result-content');
            if (contentDiv) {
                // Extract innerText cleanly
                const text = contentDiv.innerText;
                copyTextToClipboard(text, btn);
            }
        });
    });

    // Copy All contents as structured Markdown
    copyAllBtn.addEventListener('click', () => {
        if (!currentItem) return;
        const res = currentItem.results;

        let md = `# Lecture Analysis: ${currentItem.title}\n`;
        md += `**Subject Detected:** ${res.subject}\n`;
        md += `**Difficulty Level:** ${currentItem.difficulty}\n\n`;
        
        md += `## 📖 Simplified Notes\n${res.simplifiedNotes}\n\n`;
        md += `## 📝 Short Summary\n${res.shortSummary}\n\n`;
        
        md += `## 📌 Key Concepts\n`;
        if (res.keyConcepts) res.keyConcepts.forEach(c => md += `- ${c}\n`);
        md += `\n`;

        md += `## 📚 Important Definitions\n`;
        if (res.definitions) res.definitions.forEach(d => md += `* **${d.term}**: ${d.definition}\n`);
        md += `\n`;

        md += `## ⚖ Difficult Terms Explained\n`;
        if (res.difficultTerms) res.difficultTerms.forEach(t => md += `* **${t.term}**: ${t.explanation}\n`);
        md += `\n`;

        md += `## ⭐ Most Important Points\n`;
        if (res.importantPoints) res.importantPoints.forEach(p => md += `- ${p}\n`);
        md += `\n`;

        md += `## 💡 Study Tips\n`;
        if (res.studyTips) {
            md += `### To Memorize:\n`;
            (res.studyTips.toMemorize || []).forEach(m => md += `- ${m}\n`);
            md += `\n### To Understand:\n`;
            (res.studyTips.toUnderstand || []).forEach(u => md += `- ${u}\n`);
            md += `\n### Exam Forecast:\n${res.studyTips.examPrediction}\n\n`;
        }

        copyTextToClipboard(md, copyAllBtn);
    });

    function copyTextToClipboard(text, element) {
        navigator.clipboard.writeText(text).then(() => {
            // Flash successful icon state
            const icon = element.querySelector('i');
            const originalClass = icon.className;
            
            icon.className = 'ri-checkbox-circle-line';
            element.classList.add('copied');
            
            setTimeout(() => {
                icon.className = originalClass;
                element.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error("Clipboard copy failed:", err);
            alert("Failed to copy text automatically.");
        });
    }

    // ==========================================
    // 8. Word Document & PDF Downloads
    // ==========================================
    
    // Download as Word (using basic HTML string and Office XML namespace)
    downloadWordBtn.addEventListener('click', () => {
        if (!currentItem) return;
        
        const res = currentItem.results;
        
        let docHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <title>${currentItem.title}</title>
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #333333; }
                h1 { color: #2563eb; font-size: 24px; border-bottom: 2px solid #2563eb; padding-bottom: 5px; }
                h2 { color: #1e3a8a; font-size: 18px; margin-top: 20px; }
                h3 { font-size: 15px; color: #475569; }
                ul { margin-left: 20px; }
                li { margin-bottom: 5px; }
                .term-box { background: #f8fafc; border-left: 4px solid #2563eb; padding: 10px; margin-bottom: 10px; }
                .term-title { font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>Lecture Analysis: ${currentItem.title}</h1>
            <p><strong>Subject:</strong> ${res.subject} | <strong>Difficulty:</strong> ${currentItem.difficulty} | <strong>Language:</strong> ${currentItem.language}</p>
            
            <h2>📖 Simplified Notes</h2>
            <div>${formatRichText(res.simplifiedNotes)}</div>
            
            <h2>📝 Short Summary</h2>
            <p>${formatRichText(res.shortSummary)}</p>
            
            <h2>📌 Key Concepts</h2>
            <ul>
                ${(res.keyConcepts || []).map(c => `<li>${c}</li>`).join('')}
            </ul>

            <h2>📚 Important Definitions</h2>
            ${(res.definitions || []).map(d => `
                <div class="term-box">
                    <div class="term-title">${d.term}</div>
                    <div>${d.definition}</div>
                </div>
            `).join('')}

            <h2>⚖ Difficult Terms Explained</h2>
            ${(res.difficultTerms || []).map(t => `
                <div class="term-box">
                    <div class="term-title">${t.term}</div>
                    <div>${t.explanation}</div>
                </div>
            `).join('')}

            <h2>⭐ Most Important Points</h2>
            <ul>
                ${(res.importantPoints || []).map(p => `<li>${p}</li>`).join('')}
            </ul>

            <h2>💡 Study Tips</h2>
            <h3>To Memorize</h3>
            <ul>
                ${((res.studyTips || {}).toMemorize || []).map(m => `<li>${m}</li>`).join('')}
            </ul>
            <h3>To Understand</h3>
            <ul>
                ${((res.studyTips || {}).toUnderstand || []).map(u => `<li>${u}</li>`).join('')}
            </ul>
            <h3>Exam Prediction</h3>
            <p>${(res.studyTips || {}).examPrediction || 'None'}</p>
        </body>
        </html>
        `;

        const blob = new Blob(['\ufeff' + docHtml], {
            type: 'application/msword'
        });

        // Trigger download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentItem.title.replace(/\s+/g, '_')}_analysis.doc`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    });

    // Download as PDF (native printing styled via browser print properties)
    downloadPdfBtn.addEventListener('click', () => {
        window.print();
    });

    // ==========================================
    // 9. Utilities & Text Cleaners
    // ==========================================
    
    // Converts text breaks and bolding markdown to clean HTML tags
    function formatRichText(rawText) {
        if (!rawText) return "";
        let text = escapeHtml(rawText);
        
        // Replace double newlines with paragraphs
        text = text.split(/\n\n+/).map(p => `<p>${p.trim()}</p>`).join('');
        
        // Replace single newlines with line breaks
        text = text.replace(/\n/g, '<br>');
        
        // Replace bold markdown (**text** or __text__) with HTML strong tags
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
        
        return text;
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    // Run initialization
    initController();
});
