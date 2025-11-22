// lib/apiService.ts

const API_BASE_URL = 'http://localhost:5000'; // MUST match your uvicorn host/port

// --- Helper Functions ---
const getUserId = () => {
    // IMPORTANT: Replace this with actual user ID retrieval logic (e.g., from context, cookies, or storage)
    // For now, using a placeholder.
    return 'demo_user_123'; 
};

// --- Monitoring & SMS Endpoints ---

// 1. Start Monitoring (Requires user_id in body)
export const startMonitoring = async () => {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/start_monitoring`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) {
        throw new Error('Failed to start monitoring.');
    }
    return response.json();
};

// 2. Stop Monitoring 
// 🌟 FIX: Removed headers and body as the FastAPI endpoint doesn't require a body.
export const stopMonitoring = async () => {
    const response = await fetch(`${API_BASE_URL}/stop_monitoring`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to stop monitoring.');
    }
    return response.json();
};

// 3. Activate Emergency SOS (Uses /trigger_sos_for_user endpoint)
export const activateSOS = async () => {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/trigger_sos_for_user`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
    });
    
    if (!response.ok) {
        // Attempt to read error message from the response body
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send emergency SOS.');
    }
    return response.json();
};


// --- Chatbot Endpoints ---

// 4. Send Chat Message
export const sendChatMessage = async (message: string) => {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, message }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Chatbot communication failed.');
    }
    const data = await response.json();
    return data.response; // Assuming the FastAPI response has a key called 'response'
};

// --- Evidence Upload Endpoint ---

// 5. Upload Evidence
export const uploadEvidence = async (fileList: FileList) => {
    const userId = getUserId();
    const formData = new FormData();
    formData.append('user_id', userId);
    
    // Append each file in the list under the key 'files[]'
    for (let i = 0; i < fileList.length; i++) {
        formData.append('files[]', fileList[i]);
    }

    const response = await fetch(`${API_BASE_URL}/upload_evidence`, {
        method: 'POST',
        // Note: Do NOT manually set 'Content-Type' for FormData
        body: formData, 
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'File upload failed.');
    }
    return response.json();
};

// Implement setContacts, clearChatHistory, etc. as needed...