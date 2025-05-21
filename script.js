// Wait for DOM to be fully loaded before running script
document.addEventListener('DOMContentLoaded', function() {
    // Scroll to bottom on load
    function scrollToBottom() {
      const chatBox = document.getElementById('chat-box');
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    // Function to save chat history to Chrome storage
    function saveChatHistory() {
      const chatBox = document.getElementById('chat-box');
      if (chatBox) {
        chrome.storage.local.set({ 'chatHistory': chatBox.innerHTML }, function() {
          console.log('Chat history saved');
        });
      }
    }
    
    // Function to load chat history from Chrome storage
    function loadChatHistory() {
      const chatBox = document.getElementById('chat-box');
      if (chatBox) {
        chrome.storage.local.get(['chatHistory'], function(result) {
          if (result.chatHistory && result.chatHistory.trim() !== '') {
            chatBox.innerHTML = result.chatHistory;
            console.log('Chat history loaded');
          } else {
            console.log('No chat history found');
          }
        });
      }
    }

    // API call function
    async function callChatAPI(query) {
      try {
        const response = await fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: query,  // Use the exact input text as query
            user_id: "user123"
          })
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error calling API:', error);
        return { error: 'Không thể kết nối với server. Vui lòng thử lại sau.' };
      }
    }
    
    // Load chat history when page loads
    try {
      loadChatHistory();
      scrollToBottom();
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    
    // Define sendMessage function
    window.sendMessage = async function() {
      try {
        const input = document.getElementById('user-input');
        const message = input.value.trim();
        if (!message) return;
        const chatBox = document.getElementById('chat-box');
        
        // Add user's message
        chatBox.innerHTML += `
          <div class="chat-message">
            <div class="chat-avatar"><img src="https://img.icons8.com/color/96/000000/user.png" alt="User"></div>
            <div class="chat-content">
              <div class="chat-user">You</div>
              <div>${message}</div>
            </div>
          </div>
        `;
        input.value = '';
        scrollToBottom();
        saveChatHistory();
      
        // Show loading indicator
        chatBox.innerHTML += `
          <div class="chat-message" id="loading-message">
            <div class="chat-avatar"><img src="assets/icons/cosafeIcon.png" alt="Cosafe"></div>
            <div class="chat-content">
              <div class="chat-user">Cosafe</div>
              <div>Đang xử lý...</div>
            </div>
          </div>
        `;
        scrollToBottom();

        // Call API and get response
        const response = await callChatAPI(message);
        
        // Remove loading message
        const loadingMessage = document.getElementById('loading-message');
        if (loadingMessage) {
          loadingMessage.remove();
        }

        // Add API response
        chatBox.innerHTML += `
          <div class="chat-message">
            <div class="chat-avatar"><img src="assets/icons/cosafeIcon.png" alt="Cosafe"></div>
            <div class="chat-content">
              <div class="chat-user">Cosafe</div>
              <div>${response.error || response.answer || 'Không thể xử lý yêu cầu của bạn.'}</div>
            </div>
          </div>
        `;
        scrollToBottom();
        saveChatHistory();
      } catch (error) {
        console.error('Error in sendMessage:', error);
      }
    };
    
    // Optional: Send message on Enter key
    const userInput = document.getElementById('user-input');
    if (userInput) {
      userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') sendMessage();
      });
    }
    
    // Add event listener to the trash bin icon to clear chat history
    const trashIcon = document.querySelector('.trash-icon');
    if (trashIcon) {
      trashIcon.addEventListener('click', function() {
        try {
          const chatBox = document.getElementById('chat-box');
          chatBox.innerHTML = '';
          chrome.storage.local.remove(['chatHistory'], function() {
            console.log('Chat history cleared');
          });
        } catch (error) {
          console.error('Error clearing chat history:', error);
        }
      });
    }
  });