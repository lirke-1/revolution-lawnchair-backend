// Message Button
const msgButton = document.getElementById('msgButton');
const msgResponse = document.getElementById('msg-response');

msgButton.addEventListener('click', async () => {
    const response = await fetch('/api/message');
    const data = await response.json();
    msgResponse.innerText = data.text;
});

// User Input
const sendButton = document.getElementById('sendButton');
const nameInput = document.getElementById('nameInput');
const inputResponse = document.getElementById('input-response');

sendButton.addEventListener('click', async () => {
    const nameText = nameInput.value;

    // Send data to server
    const response = await fetch('/api/greet', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name:nameText})
    });

    const data = await response.json();
    
    // Display result
    // We show the 'sanitized' version to prove it cleaned up special chars
    inputResponse.innerHTML = `
        Server says: <b>Hello, ${data.message}</b><br>
    `;
});