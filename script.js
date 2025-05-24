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
  const elementSelectors = {
    products: [
      '.product-card h3', // Product cards on listing pages
      '.product-detail h1', // Product detail page title
      '.product-name', // Generic product name class
      '[class*="product"] h3', // Any product-related containers with h3
      '[class*="product-title"]' // Elements with product-title in class
    ],
    ingredients: [
      '.ingredients-list', // Common class for ingredients
      '.product-ingredients',
      '.product-detail .description', // Product description that may contain ingredients
      '[class*="ingredient"]', // Any element with ingredient in class
      '.product-information', // Product information section that may list ingredients
      '.layout-box#tab-1', // Main ingredient tab container
      '.layout-box#tab-1 .layout-content-text', // Ingredient content inside tab
      '.layout-box#tab-1 .layout-content-text p' // Paragraphs inside ingredient tab
    ]
  };

  // Function to get product highlight color
  async function getProductHighlightColor(productName) {
    try {
      const response = await fetch('http://localhost:8000/lookup_product?product_name=' + encodeURIComponent(productName), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.warn(`Failed to get product info for: ${productName}`);
        return '#ff0000';
      }

      const data = await response.json();
      return data.color || '#ff0000';
    } catch (error) {
      console.error('Error getting product color:', error);
      return '#ff0000';
    }
  }

  // Function to get ingredient highlight color
  async function getIngredientHighlightColor(ingredient) {
    try {
      const response = await fetch('http://localhost:8000/lookup_ingredient?ingredient_name=' + encodeURIComponent(ingredient), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.warn(`Failed to get ingredient info for: ${ingredient}`);
        return '#ff0000';
      }

      const data = await response.json();
      return data.color || '#ff0000';
    } catch (error) {
      console.error('Error getting ingredient color:', error);
      return '#ff0000';
    }
  }

  // Function to highlight product elements
  async function highlightProductElement(element) {
    if (!element.dataset.colorFetched) {
      const productName = element.textContent.trim();
      const color = await getProductHighlightColor(productName);
      element.dataset.highlightColor = color;
      element.dataset.colorFetched = 'true';
    }
  }

  // Function to highlight ingredient elements
  async function highlightIngredientElement(element) {
    if (!element.dataset.colorFetched) {
      // Use 'ingredients' attribute if present, otherwise fallback to text
      let ingredient = element.getAttribute('ingredients');
      if (!ingredient) {
        ingredient = element.textContent.trim();
      }
      const color = await getIngredientHighlightColor(ingredient);
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
    await highlightProductElement(element);
    visibilityObserver.observe(element);
  }

  // Function to setup ingredient highlighting
  async function setupIngredientHighlighting(element) {
    await highlightIngredientElement(element);
    visibilityObserver.observe(element);
  }

  // Observe DOM changes for dynamic content
  const mutationObserver = new MutationObserver((mutations) => {
    // Check for products
    elementSelectors.products.forEach(selector => {
      document.querySelectorAll(selector).forEach(setupProductHighlighting);
    });
    
    // Check for ingredients
    elementSelectors.ingredients.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // Split text into words and wrap each word for potential highlighting
        const words = element.innerHTML.split(/\b/);
        const wrappedText = words.map(word => {
          if (word.trim().length > 2) { // Only process words longer than 2 characters
            return `<span class="ingredient-term">${word}</span>`;
          }
          return word;
        }).join('');
        element.innerHTML = wrappedText;
        
        // Setup highlighting for each ingredient term
        element.querySelectorAll('.ingredient-term').forEach(setupIngredientHighlighting);
      });
    });
  });

  // Initial setup
  elementSelectors.products.forEach(selector => {
    document.querySelectorAll(selector).forEach(setupProductHighlighting);
  });

  elementSelectors.ingredients.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const words = element.innerHTML.split(/\b/);
      const wrappedText = words.map(word => {
        if (word.trim().length > 2) {
          return `<span class="ingredient-term">${word}</span>`;
        }
        return word;
      }).join('');
      element.innerHTML = wrappedText;
      
      element.querySelectorAll('.ingredient-term').forEach(setupIngredientHighlighting);
    });
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