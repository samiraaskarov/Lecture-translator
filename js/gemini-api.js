/**
 * Lecture Translator AI - Gemini API Client
 * Manages API keys (temporary session-based), auto-resolves the latest free Gemini model,
 * constructs analysis prompts, runs requests, and recovers from JSON parsing anomalies.
 */

const GeminiApi = (function() {
    const API_KEY_SESSION_KEY = 'temp_gemini_api_key';
    const DEFAULT_MODEL = 'gemini-1.5-flash'; // Secure fallback model

    // Get API Key from sessionStorage (temporary security)
    function getApiKey() {
    return "AQ.Ab8RN6ITbouoaY5xJaWedAOURX5Jvr5RU3xKXnS_5s7Trgqo7g";
}
    }

    // Set API Key in sessionStorage
   function setApiKey(key) {
    return;
}
    // Check if key is available
    function hasApiKey() {
    return true;
}
    }

    /**
     * Resolves the latest available free Gemini model.
     * Hits the models endpoint or falls back to standard models.
     */
    async function resolveLatestModel(apiKey) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
            const response = await fetch(url);
            if (!response.ok) {
                return DEFAULT_MODEL;
            }
            const data = await response.json();
            if (data && data.models) {
                // Find all text generation models that are "free" or recommended for flash/lite
                // Sort to find the latest version
                const models = data.models
                    .map(m => m.name.replace('models/', ''))
                    .filter(name => {
                        // Keep flash, flash-lite, and stable models
                        return (name.includes('flash') || name.includes('lite') || name.startsWith('gemini-1.5') || name.startsWith('gemini-2.')) 
                            && !name.includes('tuning') 
                            && !name.includes('experimental')
                            && !name.includes('vision');
                    });
                
                if (models.length > 0) {
                    // Try to find if gemini-2.5-flash exists, then 2.0, then 1.5
                    const preferences = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
                    for (const pref of preferences) {
                        if (models.includes(pref)) {
                            return pref;
                        }
                    }
                    // Or match the first flash model
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

    /**
     * Request analysis from Gemini API
     */
    async function analyzeLecture(text, difficulty, language) {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error("No Gemini API key configured.");
        }

        const model = await resolveLatestModel(apiKey);
        console.log(`Using model: ${model}`);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Construct the prompt targeting JSON format
        const prompt = `
You are an expert academic translator, educational designer, and exam developer.
Analyze the following lecture notes and return a structured JSON response.

DIFFICULTY LEVEL SPECIFIED: "${difficulty}"
- If "Beginner": Explain everything in very simple language. Assume the student has no background knowledge.
- If "Student": Balanced explanation for university students.
- If "Academic": Keep academic terminology while making explanations clearer.

OUTPUT LANGUAGE SPECIFIED: "${language}" (You MUST write ALL the text content, summaries, terms, definitions, and questions in this language).

LECTURE NOTES:
"""
${text}
"""

You must perform "Smart Subject Detection" to automatically identify the lecture subject (e.g. Law, Medicine, Economics, Business, Computer Science, History, Engineering, Mathematics, Psychology, Education, Political Science, etc.). Adapt all explanations, vocabulary level, and exam style to the detected subject.

You must return EXACTLY the following JSON format. Do not add any text before or after the JSON structure.

{
  "subject": "Detected Subject (e.g. Medicine, Computer Science)",
  "simplifiedNotes": "Rewrite the lecture notes in easier language based on the selected difficulty. Be thorough, clear, and explain concepts logically.",
  "shortSummary": "A concise summary containing only the most important ideas.",
  "keyConcepts": [
    "Concept item 1",
    "Concept item 2",
    "Concept item 3"
  ],
  "difficultTerms": [
    {
      "term": "Difficult legal, medical, economic, technical or scientific term",
      "explanation": "Simple explanation of the term"
    }
  ],
  "definitions": [
    {
      "term": "Term being defined",
      "definition": "Definition extracted from the lecture"
    }
  ],
  "examQuestions": [
    {
      "type": "Multiple Choice",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct Option letter or full answer text"
    },
    {
      "type": "Short Answer",
      "question": "Question text?",
      "options": [],
      "answer": "Sample correct answer"
    },
    {
      "type": "Essay",
      "question": "Question text?",
      "options": [],
      "answer": "Sample outline of a perfect essay answer"
    }
  ],
  "importantPoints": [
    "Most important point 1",
    "Most important point 2"
  ],
  "studyTips": {
    "toMemorize": ["List items to memorize"],
    "toUnderstand": ["List concepts to understand deeply"],
    "examPrediction": "A detailed forecast of what topics in this lecture are most likely to appear on the exam.",
    "generalRecommendations": ["General tip 1", "General tip 2"]
  },
  "originalReadingTimeMin": 15,
  "simplifiedReadingTimeMin": 8
}

Requirements:
1. Provide 5 to 10 exam questions in "examQuestions", combining Multiple Choice (which MUST have 4 options), Short Answer, and Essay questions.
2. Fill "difficultTerms" with 3 to 10 identified hard words and their explanations.
3. Automatically compute reasonable integers for "originalReadingTimeMin" and "simplifiedReadingTimeMin" based on word count (e.g. 200 words per minute for original, and matching the simplified content length).
4. Never return placeholder texts or empty blocks. Generate real contents.
`;

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ],
            generationConfig: {
                responseMimeType: "application/json"
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
            throw new Error(`Gemini API Error: ${errorMessage}`);
        }

        const responseData = await response.json();
        
        // Extract content text
        const responseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            throw new Error("Gemini returned an empty response.");
        }

        return parseAndRecoverJson(responseText);
    }

    /**
     * Resilient JSON parsing.
     * Attempts cleaning markdown wrappers, locating bounds, or rebuilding a structured fallback.
     */
    function parseAndRecoverJson(rawString) {
        let cleaned = rawString.trim();

        // 1. Remove markdown syntax if present
        if (cleaned.startsWith("```")) {
            // Strip codeblock markers
            cleaned = cleaned.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
        }

        // 2. Try standard parse
        try {
            return JSON.parse(cleaned);
        } catch (e) {
            console.warn("Standard JSON parse failed, trying boundary fallback:", e);
        }

        // 3. Try to locate first '{' and last '}'
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const sliced = cleaned.slice(firstBrace, lastBrace + 1);
            try {
                return JSON.parse(sliced);
            } catch (e) {
                console.warn("Boundary JSON parse failed:", e);
            }
        }

        // 4. Fallback recovery generator (parse key elements using regex or provide general structures)
        console.error("Critical: JSON recovery activated. Constructing recovery object.");
        
        // Simple regex extracts for text blocks
        const extractField = (field, defaultValue = "") => {
            const regex = new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`, "i");
            const match = cleaned.match(regex);
            return match ? match[1] : defaultValue;
        };

        const subject = extractField("subject", "General Lecture");
        const simplifiedNotes = extractField("simplifiedNotes", "We encountered an issue parsing the detailed analysis formatting. Below is the raw summary.");
        const shortSummary = extractField("shortSummary", "Please check your lecture content. Summary extraction was partially successful.");

        // Build fallback object to ensure page loads result cards without crashing
        return {
            subject: subject,
            simplifiedNotes: simplifiedNotes || cleaned.substring(0, 1000) + "...",
            shortSummary: shortSummary || "Unable to extract clean summary.",
            keyConcepts: ["Key concepts could not be extracted in list format. Please refer to Simplified Notes."],
            difficultTerms: [
                { term: "Parsing anomaly", explanation: "The AI output format was slightly irregular, but your cards were preserved." }
            ],
            definitions: [],
            examQuestions: [
                {
                    type: "Short Answer",
                    question: "What is the primary topic of the uploaded notes?",
                    options: [],
                    answer: "Review your notes to confirm the core concepts."
                }
            ],
            importantPoints: ["Please review the notes block above for important points."],
            studyTips: {
                toMemorize: ["Review technical definitions"],
                toUnderstand: ["Analyze primary concepts"],
                examPrediction: "A prediction could not be accurately constructed due to formatting.",
                generalRecommendations: ["Pace yourself through the lecture materials"]
            },
            originalReadingTimeMin: 10,
            simplifiedReadingTimeMin: 5
        };
    }

    return {
        getApiKey,
        setApiKey,
        hasApiKey,
        analyzeLecture
    };
})();
