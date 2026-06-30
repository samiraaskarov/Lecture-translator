@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');

/* CSS Custom Properties & Variables */
:root {
    --font-heading: 'Outfit', sans-serif;
    --font-body: 'Inter', sans-serif;

    /* Color Palette - Light Theme */
    --bg-primary: #f8fafc; /* Slate 50 */
    --bg-secondary: #ffffff;
    --bg-input: #f1f5f9; /* Slate 100 */
    --accent: #2563eb; /* Royal Blue */
    --accent-hover: #1d4ed8;
    --accent-light: #eff6ff; /* Blue 50 */
    --border-color: #e2e8f0; /* Slate 200 */
    --text-primary: #0f172a; /* Slate 900 */
    --text-secondary: #475569; /* Slate 600 */
    --text-muted: #94a3b8; /* Slate 400 */
    
    /* Utility States */
    --success: #10b981; /* Emerald 500 */
    --success-light: #ecfdf5;
    --warning: #f59e0b; /* Amber 500 */
    --warning-light: #fefbeb;
    --danger: #ef4444; /* Red 500 */
    --danger-light: #fef2f2;
    
    /* Layout styling values */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(148, 163, 184, 0.08), 0 2px 4px -2px rgba(148, 163, 184, 0.08);
    --shadow-lg: 0 10px 15px -3px rgba(148, 163, 184, 0.08), 0 4px 6px -4px rgba(148, 163, 184, 0.08);
    --shadow-xl: 0 20px 25px -5px rgba(148, 163, 184, 0.1), 0 8px 10px -6px rgba(148, 163, 184, 0.1);
    
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    
    --transition-fast: 0.15s ease;
    --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    --container-max: 1280px;
}

/* Dark Theme Variables */
[data-theme="dark"] {
    --bg-primary: #020617; /* Slate 950 */
    --bg-secondary: #0b1329; /* Custom premium dark blue */
    --bg-input: #1e293b; /* Slate 800 */
    --accent: #3b82f6; /* Blue 500 */
    --accent-hover: #60a5fa;
    --accent-light: rgba(59, 130, 246, 0.15);
    --border-color: #1e293b;
    --text-primary: #f8fafc; /* Slate 50 */
    --text-secondary: #94a3b8; /* Slate 400 */
    --text-muted: #64748b; /* Slate 500 */
    
    --success-light: rgba(16, 185, 129, 0.15);
    --warning-light: rgba(245, 158, 11, 0.15);
    --danger-light: rgba(239, 68, 68, 0.15);

    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.45);
}

/* Base Styles */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-body);
    background-color: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    transition: background-color var(--transition-normal), color var(--transition-normal);
    overflow-x: hidden;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: 700;
    line-height: 1.25;
    color: var(--text-primary);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
}

/* Layout Elements */
.header-container {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: 1.5rem;
    color: var(--text-primary);
    transition: transform var(--transition-fast);
}

.brand:hover {
    transform: scale(1.02);
}

.brand-icon {
    font-size: 1.75rem;
}

.brand-title span {
    color: var(--accent);
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

/* Standard Premium Buttons */
.btn-icon {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);
}

.btn-icon:hover {
    background: var(--accent-light);
    color: var(--accent);
    border-color: var(--accent);
    transform: translateY(-2px);
}

.btn-primary {
    background: var(--accent);
    color: #ffffff;
    border: none;
    padding: 0.875rem 2rem;
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1rem;
    border-radius: var(--radius-lg);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
    transition: all var(--transition-normal);
}

.btn-primary:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}

.btn-primary:active {
    transform: translateY(0);
}

.btn-primary:disabled {
    background: var(--text-muted);
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
}

.btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    padding: 0.75rem 1.5rem;
    font-family: var(--font-heading);
    font-weight: 600;
    border-radius: var(--radius-lg);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);
}

.btn-secondary:hover {
    background: var(--accent-light);
    color: var(--accent);
    border-color: var(--accent);
    transform: translateY(-2px);
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
}

@keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.animate-fade {
    animation: fadeIn var(--transition-slow) forwards;
}

/* Home Layout and Grid */
.home-container {
    max-width: var(--container-max);
    margin: 2rem auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 2.5rem;
}

/* Hero Intro Section */
.hero-section {
    grid-column: 1 / -1;
    text-align: center;
    max-width: 800px;
    margin: 1rem auto 2.5rem;
}

.hero-tagline {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--accent-light);
    color: var(--accent);
    border-radius: 50px;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
}

.hero-title {
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    margin-bottom: 1rem;
}

.hero-title span {
    background: linear-gradient(135deg, var(--accent), #4f46e5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero-subtitle {
    font-size: 1.25rem;
    color: var(--text-secondary);
}

/* Main Cards */
.card-panel {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    padding: 2.25rem;
    box-shadow: var(--shadow-lg);
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.card-panel:hover {
    box-shadow: var(--shadow-xl);
}

.card-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

/* Form Styling */
.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    font-weight: 600;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

/* Custom Text Area */
.text-area-custom {
    width: 100%;
    min-height: 200px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1rem;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 0.95rem;
    resize: vertical;
    transition: all var(--transition-normal);
    outline: none;
}

.text-area-custom:focus {
    border-color: var(--accent);
    background: var(--bg-secondary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

/* File Upload Area */
.upload-area {
    border: 2px dashed var(--border-color);
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    padding: 2rem 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-normal);
    margin-bottom: 1.5rem;
    position: relative;
}

.upload-area:hover, .upload-area.dragover {
    border-color: var(--accent);
    background: var(--accent-light);
}

.upload-icon {
    font-size: 2.5rem;
    color: var(--accent);
    margin-bottom: 1rem;
    display: block;
}

.upload-text {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.upload-hint {
    font-size: 0.8125rem;
    color: var(--text-muted);
}

.upload-info {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: var(--success-light);
    color: var(--success);
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.875rem;
    display: none;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.upload-info.error {
    background: var(--danger-light);
    color: var(--danger);
}

/* Dropdown Grid (Difficulty + Language) */
.settings-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    margin-bottom: 2rem;
}

.select-custom {
    width: 100%;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 0.875rem 1rem;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 0.95rem;
    font-weight: 500;
    outline: none;
    cursor: pointer;
    transition: all var(--transition-normal);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1.25rem;
}

[data-theme="dark"] .select-custom {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
}

.select-custom:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

/* Analyze Action Button Wrapper */
.action-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.analyze-btn {
    width: 100%;
    padding: 1.125rem;
    font-size: 1.125rem;
    border-radius: var(--radius-lg);
}

/* Dashboard Side Panel (History & Stats) */
.side-panel {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* Stats Section */
.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.stat-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.25rem;
    text-align: center;
}

.stat-val {
    font-family: var(--font-heading);
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--accent);
    margin-bottom: 0.25rem;
}

.stat-lbl {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    font-weight: 500;
}

/* History List Layout */
.history-section {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 480px;
}

.search-box {
    margin-bottom: 1rem;
    position: relative;
}

.search-input {
    width: 100%;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 0.875rem;
    outline: none;
    transition: all var(--transition-normal);
}

.search-input:focus {
    border-color: var(--accent);
}

.search-icon {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 1rem;
}

.history-list {
    overflow-y: auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-right: 0.25rem;
}

.history-item {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 0.875rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all var(--transition-normal);
}

.history-item:hover {
    border-color: var(--accent);
    background: var(--accent-light);
}

.history-details {
    flex-grow: 1;
    min-width: 0;
}

.history-name {
    font-weight: 600;
    font-size: 0.9375rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.125rem;
}

.history-meta {
    font-size: 0.75rem;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.history-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.history-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 1rem;
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
}

.history-btn:hover {
    background: var(--bg-secondary);
    color: var(--accent);
}

.history-btn.fav-btn.active {
    color: #f59e0b; /* Golden star */
}

.history-btn.del-btn:hover {
    color: var(--danger);
    background: var(--danger-light);
}

.history-empty {
    text-align: center;
    padding: 3rem 1.5rem;
    color: var(--text-muted);
    font-size: 0.875rem;
}

/* Modals styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
}

.modal-content {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    width: 100%;
    max-width: 500px;
    padding: 2rem;
    position: relative;
    box-shadow: var(--shadow-xl);
    animation: fadeIn var(--transition-normal);
}

.modal-close {
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
    background: none;
    border: none;
    font-size: 1.25rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: color var(--transition-fast);
}

.modal-close:hover {
    color: var(--text-primary);
}

.modal-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.modal-body {
    margin-bottom: 1.5rem;
}

.modal-body p {
    font-size: 0.9375rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

.input-custom {
    width: 100%;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 0.875rem 1rem;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 0.95rem;
    outline: none;
    transition: all var(--transition-normal);
}

.input-custom:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

/* ==================================================
   ANALYSIS VIEW
   ================================================== */
.analysis-header {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 900;
}

.analysis-container {
    max-width: var(--container-max);
    margin: 2rem auto;
    padding: 0 2rem;
}

/* Floating Actions Bar */
.results-actions-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    padding: 1rem 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.subject-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--accent-light);
    color: var(--accent);
    border-radius: 50px;
    font-weight: 700;
    font-size: 0.9375rem;
    border: 1px solid rgba(37, 99, 235, 0.15);
}

.results-toolbar {
    display: flex;
    gap: 0.75rem;
}

/* Loading Layout and Skeleton Loader */
.loading-view {
    text-align: center;
    padding: 6rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.loader-spinner {
    width: 64px;
    height: 64px;
    border: 6px solid var(--accent-light);
    border-radius: 50%;
    border-top-color: var(--accent);
    animation: rotation 1.2s infinite linear;
    margin-bottom: 2rem;
}

.loading-title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
}

.loading-text {
    color: var(--text-secondary);
    font-size: 1.125rem;
    max-width: 500px;
    margin: 0 auto;
    animation: pulse 2s infinite ease-in-out;
}

/* Results Grid Layout */
.results-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    align-items: start;
}

.results-main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.results-sidebar {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    position: sticky;
    top: 100px;
}

/* Result Cards styling */
.result-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    padding: 2rem;
    box-shadow: var(--shadow-md);
    position: relative;
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.result-card:hover {
    box-shadow: var(--shadow-lg);
}

.card-header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
}

.card-header-actions h3 {
    font-size: 1.35rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.card-action-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 1.125rem;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
}

.card-action-btn:hover {
    background: var(--bg-primary);
    color: var(--accent);
}

.card-action-btn.copied {
    color: var(--success);
    background: var(--success-light);
}

/* Typography styles inside result cards */
.result-content {
    font-size: 1rem;
    color: var(--text-secondary);
}

.result-content p {
    margin-bottom: 1rem;
}

.result-content p:last-child {
    margin-bottom: 0;
}

.result-content ul, .result-content ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
}

.result-content li {
    margin-bottom: 0.5rem;
}

.result-content strong {
    color: var(--text-primary);
}

/* Term definitions layout */
.term-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.term-item {
    background: var(--bg-primary);
    border-left: 4px solid var(--accent);
    padding: 1rem 1.25rem;
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.term-title {
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.term-desc {
    font-size: 0.9375rem;
    color: var(--text-secondary);
}

/* Definition card */
.definition-item {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    padding: 1.25rem;
    border-radius: var(--radius-md);
    margin-bottom: 1rem;
}

.definition-item:last-child {
    margin-bottom: 0;
}

.definition-term {
    font-weight: 700;
    color: var(--accent);
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Reading Time specific card styling */
.time-tracker-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.time-box {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.5rem 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.time-val {
    font-family: var(--font-heading);
    font-size: 2.25rem;
    font-weight: 800;
    color: var(--accent);
    margin-bottom: 0.25rem;
}

.time-val.original {
    color: var(--text-secondary);
}

.time-lbl {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-muted);
}

.time-saved-badge {
    grid-column: 1 / -1;
    background: var(--success-light);
    color: var(--success);
    border-radius: var(--radius-md);
    padding: 0.75rem;
    text-align: center;
    font-weight: 700;
    font-size: 0.9375rem;
}

/* Study tips styled lists */
.study-tips-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.tip-block {
    background: var(--bg-primary);
    border-radius: var(--radius-md);
    padding: 1.25rem;
}

.tip-block-title {
    font-weight: 700;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.tip-block-content {
    font-size: 0.9375rem;
}

/* ==================================================
   INTERACTIVE TOOLS (FLASHCARDS & QUIZZES)
   ================================================== */
.results-interactive {
    grid-column: 1 / -1;
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.interactive-panel {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-xl);
    padding: 2.25rem;
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    min-height: 400px;
}

.interactive-title {
    font-size: 1.35rem;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Flashcards implementation */
.flashcards-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
}

.flashcard-wrapper {
    perspective: 1000px;
    width: 100%;
    height: 220px;
    cursor: pointer;
}

.flashcard {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform var(--transition-slow);
}

.flashcard.flipped {
    transform: rotateY(180deg);
}

.flashcard-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: var(--radius-lg);
    border: 2px solid var(--border-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    text-align: center;
    box-shadow: var(--shadow-sm);
}

.flashcard-front {
    background: var(--bg-primary);
}

.flashcard-back {
    background: var(--accent-light);
    border-color: var(--accent);
    transform: rotateY(180deg);
}

.flashcard-badge {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent);
    margin-bottom: 1rem;
}

.flashcard-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
}

.flashcard-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 250px;
}

/* Quiz UI elements */
.quiz-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.quiz-progress {
    height: 6px;
    background: var(--bg-primary);
    border-radius: 3px;
    margin-bottom: 1.5rem;
    overflow: hidden;
}

.quiz-progress-fill {
    height: 100%;
    background: var(--accent);
    width: 0%;
    transition: width var(--transition-normal);
}

.quiz-question-card {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.quiz-question-type {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent);
    margin-bottom: 0.5rem;
}

.quiz-question-text {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
}

.quiz-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.quiz-option {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    padding: 1rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 0.9375rem;
    font-weight: 500;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.quiz-option:hover {
    border-color: var(--accent);
    background: var(--accent-light);
}

.quiz-option.selected {
    border-color: var(--accent);
    background: var(--accent-light);
    color: var(--accent);
    font-weight: 600;
}

.quiz-option.correct {
    border-color: var(--success);
    background: var(--success-light);
    color: var(--success);
    font-weight: 600;
}

.quiz-option.incorrect {
    border-color: var(--danger);
    background: var(--danger-light);
    color: var(--danger);
}

.quiz-text-input {
    width: 100%;
    min-height: 100px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 0.875rem 1rem;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    outline: none;
    resize: none;
}

.quiz-text-input:focus {
    border-color: var(--accent);
}

.quiz-feedback {
    padding: 1rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
    display: none;
}

.quiz-feedback.correct {
    background: var(--success-light);
    color: var(--success);
    display: block;
}

.quiz-feedback.incorrect {
    background: var(--danger-light);
    color: var(--danger);
    display: block;
}

.quiz-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.quiz-score-view {
    text-align: center;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.quiz-score-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: var(--accent-light);
    border: 4px solid var(--accent);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 1.5rem;
}

.quiz-score-val {
    font-family: var(--font-heading);
    font-size: 2.25rem;
    font-weight: 800;
    color: var(--accent);
}

.quiz-score-lbl {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
}

.quiz-score-headline {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.quiz-score-desc {
    font-size: 0.9375rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
    max-width: 300px;
}

/* ==================================================
   RESPONSIVE MEDIA QUERIES
   ================================================== */
@media (max-width: 1024px) {
    .home-container {
        grid-template-columns: 1fr;
    }
    
    .results-grid {
        grid-template-columns: 1fr;
    }
    
    .results-sidebar {
        position: static;
    }
    
    .results-interactive {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .header-container {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
    }
    
    .hero-title {
        font-size: 2.25rem;
    }
    
    .card-panel {
        padding: 1.5rem;
    }
    
    .settings-grid {
        grid-template-columns: 1fr;
    }
    
    .analysis-container {
        padding: 0 1rem;
    }
    
    .results-actions-bar {
        padding: 1rem;
        flex-direction: column;
        align-items: stretch;
    }
    
    .results-toolbar {
        justify-content: space-between;
    }
}
