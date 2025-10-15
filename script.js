// API Configuration
const API_URL = 'https://phishguard-api.onrender.com'; // Update this after deploying to Render

// DOM Elements
const scanForm = document.getElementById('scanForm');
const urlInput = document.getElementById('urlInput');
const scanBtn = document.getElementById('scanBtn');
const btnText = scanBtn.querySelector('.btn-text');
const btnLoading = scanBtn.querySelector('.btn-loading');
const results = document.getElementById('results');

// Event listener
scanForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await scanURL();
});

// Scan URL function
async function scanURL() {
    const url = urlInput.value.trim();
    const mode = document.querySelector('input[name="mode"]:checked').value;

    if (!url) {
        alert('Please enter a URL');
        return;
    }

    // Show loading state
    scanBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    results.style.display = 'none';

    try {
        // Call API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, mode })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        displayResults(data);

    } catch (error) {
        console.error('Error:', error);
        
        // Fallback to demo data if API fails (for testing)
        displayResults(getDemoData(url, mode));
        
        // Show error message
        setTimeout(() => {
            alert('⚠️ Using demo data. Deploy the API to Render for live detection.');
        }, 500);
    } finally {
        // Reset button state
        scanBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// Display results
function displayResults(data) {
    // Hide form, show results
    document.getElementById('scanForm').style.display = 'none';
    results.style.display = 'block';

    // Status
    const resultStatus = results.querySelector('.result-status');
    const isPhishing = data.decision === 'PHISHING';
    
    resultStatus.className = `result-status ${isPhishing ? 'danger' : 'safe'}`;
    resultStatus.innerHTML = `
        ${isPhishing ? '🚨' : '✅'} 
        <span>${isPhishing ? 'PHISHING DETECTED' : 'SAFE TO VISIT'}</span>
    `;

    // Confidence
    const resultConfidence = results.querySelector('.result-confidence');
    resultConfidence.textContent = `${data.confidence.toFixed(1)}% Confidence`;

    // URL
    const resultUrl = results.querySelector('.result-url');
    resultUrl.textContent = data.url;

    // Details
    const detailGrid = document.getElementById('detailGrid');
    detailGrid.innerHTML = '';

    const details = [
        { label: 'URL Length', value: data.features.url_length },
        { label: 'HTTPS', value: data.features.is_https ? 'Yes' : 'No' },
        { label: 'Subdomains', value: data.features.num_subdomains },
        { label: 'Suspicious Words', value: data.features.contains_suspicious_words ? 'Yes' : 'No' },
    ];

    if (data.html_analysis) {
        details.push(
            { label: 'Forms', value: data.html_analysis.num_forms || 0 },
            { label: 'External Links', value: data.html_analysis.external_links || 0 }
        );
    }

    details.forEach(detail => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        detailItem.innerHTML = `
            <div class="detail-label">${detail.label}</div>
            <div class="detail-value">${detail.value}</div>
        `;
        detailGrid.appendChild(detailItem);
    });

    // Model votes
    const modelVotes = document.getElementById('modelVotes');
    modelVotes.innerHTML = '<h3 style="color: var(--violet-300); margin-bottom: 1rem;">🤖 Model Predictions</h3>';

    data.model_votes.forEach((vote, index) => {
        const modelNames = ['Random Forest', 'Naive Bayes', 'Decision Tree'];
        const voteDiv = document.createElement('div');
        voteDiv.className = 'model-vote';
        voteDiv.innerHTML = `
            <span class="model-name">${modelNames[index] || `Model ${index + 1}`}</span>
            <span class="model-prediction">${vote === 1 ? '🚨 Phishing' : '✅ Legitimate'}</span>
        `;
        modelVotes.appendChild(voteDiv);
    });

    // Adjustments
    const adjustmentsDiv = document.getElementById('adjustments');
    const adjustmentList = document.getElementById('adjustmentList');
    
    if (data.adjustments && data.adjustments.length > 0) {
        adjustmentsDiv.style.display = 'block';
        adjustmentList.innerHTML = '';
        data.adjustments.forEach(adj => {
            const li = document.createElement('li');
            li.textContent = adj;
            adjustmentList.appendChild(li);
        });
    } else {
        adjustmentsDiv.style.display = 'none';
    }

    // Scroll to results
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Reset form
function resetForm() {
    document.getElementById('scanForm').style.display = 'block';
    results.style.display = 'none';
    urlInput.value = '';
    urlInput.focus();
}

// Demo data (fallback when API is not available)
function getDemoData(url, mode) {
    const isPhishing = url.includes('phish') || 
                      url.includes('verify') || 
                      url.includes('login') && !url.includes('facebook') ||
                      !url.startsWith('https://');

    return {
        url: url,
        decision: isPhishing ? 'PHISHING' : 'LEGITIMATE',
        confidence: isPhishing ? 85 : 95,
        score: isPhishing ? 0.85 : 0.15,
        model_votes: isPhishing ? [1, 1, 0] : [0, 0, 0],
        adjustments: isPhishing && !url.startsWith('https://') ? 
            ['⚠️ No HTTPS + suspicious path (+35%)'] : [],
        features: {
            url_length: url.length,
            is_https: url.startsWith('https://'),
            num_subdomains: (url.match(/\./g) || []).length - 1,
            contains_suspicious_words: url.includes('login') || url.includes('verify') || url.includes('account')
        },
        html_analysis: mode === 'deep' ? {
            num_forms: isPhishing ? 1 : 0,
            external_links: isPhishing ? 25 : 10
        } : null
    };
}

// Show about dialog
function showAbout() {
    alert(`PhishGuard - AI Phishing Detector

Built with:
• Machine Learning (90%+ accuracy)
• Random Forest, Naive Bayes, Decision Tree ensemble
• Trained on 549,000+ URLs
• Deep HTML analysis
• SSL certificate validation

Features:
• Fast Mode: Instant URL analysis
• Deep Mode: Complete HTML + SSL scan
• Intelligent rule-based adjustments`);
}

// Show API docs
function showAPI() {
    alert(`API Documentation

Endpoint: POST /api/scan

Request:
{
  "url": "https://example.com",
  "mode": "fast" | "deep"
}

Response:
{
  "decision": "PHISHING" | "LEGITIMATE",
  "confidence": 95.5,
  "score": 0.95,
  "model_votes": [1, 1, 0],
  "features": {...},
  "adjustments": [...]
}

GitHub: https://github.com/yourusername/phishguard`);
}

// Auto-focus on input
window.addEventListener('load', () => {
    urlInput.focus();
});
