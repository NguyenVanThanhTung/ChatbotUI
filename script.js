// Function to highlight product names on cocolux.com
function highlightProductNames() {
  // Check if we're on cocolux.com
  if (!window.location.hostname.includes('cocolux.com')) return;

  // CSS class for highlighting
  const style = document.createElement('style');
  style.textContent = `
    .cosafe-highlighted {
      display: inline !important;
      transition: background-color 0.3s ease;
    }
  `;
  document.head.appendChild(style);

  // Product name selectors specific to cocolux.com
  const productNameSelectors = [
    '.product-card h3', // Product cards on listing pages
    '.product-detail h1', // Product detail page title
    '.product-name', // Generic product name class
    '[class*="product"] h3', // Any product-related containers with h3
    '[class*="product-title"]' // Elements with product-title in class
  ];

  async function getHighlightColor(productName) {
  try {
    const response = await fetch(`http://localhost:8000/lookup_product?product_name=${encodeURIComponent(productName)}`);
    
    if (!response.ok) {
      console.warn(`Không tìm thấy sản phẩm: ${productName}`);
      return 'red'; // fallback if product not found
    }

    const data = await response.json();
    console.log(data.color);
    return data.color || 'red'; // fallback if color not returned
  } catch (error) {
    console.error('Error getting highlight color:', error);
    return 'red'; // fallback on any other error
  }
}

  // Function to highlight elements
  async function highlightElement(element) {
    if (!element.dataset.colorFetched) {
      const rawText = element.textContent.trim(); // loại bỏ khoảng trắng đầu/cuối
      const color = await getHighlightColor(rawText);
      element.dataset.highlightColor = color;
      element.dataset.colorFetched = 'true';
    }
  }

  // Function to show highlight
  function showHighlight(element) {
    if (!element.classList.contains('cosafe-highlighted')) {
      element.classList.add('cosafe-highlighted');
      element.style.backgroundColor = element.dataset.highlightColor;
      element.style.color = 'white';
    }
  }

  // Function to remove highlight
  function removeHighlight(element) {
    if (element.classList.contains('cosafe-highlighted')) {
      element.classList.remove('cosafe-highlighted');
      element.style.backgroundColor = '';
      element.style.color = '';
    }
  }

  // Create intersection observer
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        showHighlight(entry.target);
      } else {
        removeHighlight(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  // Function to setup product highlighting
  async function setupProductHighlighting(element) {
    await highlightElement(element);
    visibilityObserver.observe(element);
  }

  // Observe DOM changes for dynamic content
  const mutationObserver = new MutationObserver((mutations) => {
    productNameSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(setupProductHighlighting);
    });
  });

  // Initial setup
  productNameSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(setupProductHighlighting);
  });

  // Start observing DOM changes
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Execute highlighting function
highlightProductNames();

// Popup functionality
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