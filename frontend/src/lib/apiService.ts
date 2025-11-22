// lib/apiService.ts

const API_BASE_URL = 'http://localhost:5000'; // MUST match your uvicorn host/port

// --- Monitoring & SMS Endpoints ---

// 1. Start Monitoring (Requires user_id)
export const startMonitoring = async (userId: string) => {
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
export const stopMonitoring = async () => {
    const response = await fetch(`${API_BASE_URL}/stop_monitoring`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to stop monitoring.');
    }
    return response.json();
};

// 3. Activate Emergency SOS
export const activateSOS = async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/trigger_sos_for_user`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send emergency SOS.');
    }
    return response.json();
};

// --- Contact Management ---

// 4. Add Trusted Contact
export const addTrustedContact = async (userId: string, contactNumber: string) => {
    const response = await fetch(`${API_BASE_URL}/add_contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            user_id: userId, 
            contact: contactNumber 
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add contact.');
    }
    return response.json();
};


// --- Chatbot Endpoints ---

// 5. Send Chat Message
export const sendChatMessage = async (userId: string, message: string) => {
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
    return data.response; 
};

// --- Evidence Upload Endpoint ---

// 6. Upload Evidence
export const uploadEvidence = async (userId: string, fileList: FileList) => {
    const formData = new FormData();
    formData.append('user_id', userId);
    
    // Append each file in the list under the key 'files'
    for (let i = 0; i < fileList.length; i++) {
        formData.append('files', fileList[i]); 
    }

    const response = await fetch(`${API_BASE_URL}/upload_evidence`, {
        method: 'POST',
        body: formData, 
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'File upload failed.');
    }
    return response.json();
};