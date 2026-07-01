/**
 * Lecture Translator AI - Gemini API Client
 * Manages API keys, constructs analysis prompts, runs requests.
 */

// =========================================================================
// API ANAHTARINIZI SADECE AŞAĞIDAKİ İKİ TIRNAK ("") ARASINA YAPIŞTIRIN:
// =========================================================================
const AKTIF_GEMINI_API_KEY = "AQ.Ab8RN6LUbppFATJ3cENzEjC4z4gQ_1ma-IVFlxVq7ouTwZlccQ";

const GeminiApi = (function() {
    const DEFAULT_MODEL = 'gemini-1.5-flash';

    function getApiKey() {
        return AKTIF_GEMINI_API_KEY;
    }

    function setApiKey(key) {
        return;
    }

    function hasApiKey() {
        return true;
    }

    async function resolveLatestModel(apiKey) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
            const response = await fetch(url);
            if (!response.ok) return DEFAULT_MODEL;
            const data = await response.json();
            if (data && data.models) {
                const models = data.models
                    .map(m => m.name.replace('models/', ''))
                    .filter(name => {
                        return (name.includes('flash') || name.includes('lite') || name.startsWith('gemini-1.5') || name.startsWith('gemini-2.')) 
                            && !name.includes('tuning') 
                            && !name.includes('experimental')
                            && !name.includes('vision');
                    });
                
                if (models.length > 0) {
                    const preferences = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
                    for (const pref of preferences) {
                        if (models.includes(pref)) return pref;
                    }
                    const flashModel = models.find(m => m.includes('flash'));
                    if (flashModel) return flashModel;
                    return models[0];
                }
            }
            return DEFAULT_MODEL;
        } catch (e) {
            console.warn("Failed to dynamically resolve model, using default:", e);
            return DEFAULT_MODEL;
        }
    }

    async function analyzeLecture(text, difficulty, language) {
        const apiKey = getApiKey();
        if (!apiKey || apiKey.includes("BURAYA_YENI_ALDIGINIZ")) {
            throw new Error("Lütfen kodun en üstündeki AKTIF_GEMINI_API_KEY alanına geçerli bir anahtar yazın.");
        }

        const model = await resolveLatestModel(apiKey);
        console.log(`Using model: ${model}`);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const prompt = `
You are an expert academic translator, educational designer, and exam developer.
Analyze the following lecture notes and return a structured JSON response.
DIFFICULTY LEVEL SPECIFIED: "${difficulty}"
OUTPUT LANGUAGE SPECIFIED: "${language}"

LECTURE NOTES:
"""
${text}
"""

Return EXACTLY a structured JSON with keys: subject, simplifiedNotes, shortSummary, keyConcepts, difficultTerms, definitions, examQuestions, importantPoints, studyTips.
Do not add markdown wrappers like \`\`\`json.
`;

        const requestBody = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
            throw new Error(`Gemini API Error: ${errorMessage}`);
        }

        const responseData = await response.json();
        const responseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) throw new Error("Gemini returned an empty response.");

        return parseAndRecoverJson(responseText);
    }

    function parseAndRecoverJson(rawString) {
        let cleaned = rawString.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
        }
        try {
            return JSON.parse(cleaned);
        } catch (e) {
            const firstBrace = cleaned.indexOf('{');
            const lastBrace = cleaned.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                try {
                    return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
                } catch (err) {}
            }
        }
        return { subject: "Lecture Analysis", simplifiedNotes: cleaned };
    }

    return { getApiKey, setApiKey, hasApiKey, analyzeLecture };
})();
