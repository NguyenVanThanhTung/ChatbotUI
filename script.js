// Wait for DOM to be fully loaded before running script
document.addEventListener('DOMContentLoaded', function() {
    // Scroll to bottom on load
    function scrollToBottom() {
      const chatBox = document.getElementById('chat-box');
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    // Function to save chat history to localStorage
    function saveChatHistory() {
      const chatBox = document.getElementById('chat-box');
      if (chatBox) {
        localStorage.setItem('chatHistory', chatBox.innerHTML);
        console.log('Chat history saved');
      }
    }
    
    // Function to load chat history from localStorage
    function loadChatHistory() {
      const chatBox = document.getElementById('chat-box');
      if (chatBox) {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory && savedHistory.trim() !== '') {
          chatBox.innerHTML = savedHistory;
          console.log('Chat history loaded');
        } else {
          console.log('No chat history found');
        }
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
    window.sendMessage = function() {
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
      
        // Simulate Cosafe reply
        setTimeout(() => {
          chatBox.innerHTML += `
            <div class="chat-message">
              <div class="chat-avatar"><img src="./assets/icons/cosafeIcon.png" alt="Cosafe"></div>
              <div class="chat-content">
                <div class="chat-user">Cosafe</div>
                <div>Xin lỗi, Cosafe không thể tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn.</div>
              </div>
            </div>
          `;
          scrollToBottom();
          saveChatHistory();
        }, 800);
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
          localStorage.removeItem('chatHistory');
          console.log('Chat history cleared');
        } catch (error) {
          console.error('Error clearing chat history:', error);
        }
      });
    }
    
    // Check if localStorage is available
    function isLocalStorageAvailable() {
      try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    }
    
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available. Chat history will not be saved.');
    }
  });
  