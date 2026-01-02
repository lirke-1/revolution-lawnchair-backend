// --- Elements ---
const searchTarget = document.getElementById('searchTarget');
const btnSearch = document.getElementById('btnSearch');
const searchResponse = document.getElementById('searchResponse');

const editSection = document.getElementById('editSection');
const targetNameDisplay = document.getElementById('targetNameDisplay');
const statusJson = document.getElementById('statusJson');
const btnSaveStatus = document.getElementById('btnSaveStatus');
const saveResponse = document.getElementById('saveResponse');

let currentTargetUser = null;

// --- 1. Search User ---
btnSearch.addEventListener('click', async () => {
    const username = searchTarget.value.trim();
    if (!username) return;

    searchResponse.innerText = "Searching...";
    editSection.style.display = 'none';

    try {
        // We need to add this endpoint to server.js (see below)
        const response = await fetch(`/api/admin/user/${username}`);
        const data = await response.json();

        if (response.ok) {
            searchResponse.innerText = "User found.";
            currentTargetUser = data.user.username;
            targetNameDisplay.innerText = currentTargetUser;
            
            // Pre-fill the textarea with the user's current status string
            // We format it with indentation (4 spaces) for readability
            try {
                const parsedStatus = JSON.parse(data.user.status);
                statusJson.value = JSON.stringify(parsedStatus, null, 4);
            } catch (e) {
                // Fallback if status isn't valid JSON for some reason
                statusJson.value = data.user.status;
            }

            editSection.style.display = 'block';
        } else {
            searchResponse.innerText = "❌ " + (data.error || "User not found");
        }
    } catch (err) {
        console.error(err);
        searchResponse.innerText = "❌ Network or Server Error";
    }
});

// --- 2. Save Changes ---
btnSaveStatus.addEventListener('click', async () => {
    if (!currentTargetUser) return;

    const rawJson = statusJson.value;
    let newStatusObj;

    // Validate JSON on client side first
    try {
        newStatusObj = JSON.parse(rawJson);
    } catch (e) {
        saveResponse.style.color = 'red';
        saveResponse.innerText = "❌ Invalid JSON format. Please fix syntax.";
        return;
    }

    saveResponse.innerText = "Updating...";

    try {
        const response = await fetch('/api/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                target_username: currentTargetUser,
                new_status: newStatusObj
            })
        });

        const data = await response.json();

        if (response.ok) {
            saveResponse.style.color = 'green';
            saveResponse.innerText = "✅ " + data.message;
        } else {
            saveResponse.style.color = 'red';
            saveResponse.innerText = "❌ " + (data.error || "Update failed");
        }
    } catch (err) {
        saveResponse.innerText = "❌ Error connecting to server.";
    }
});