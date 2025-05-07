// Scroll to bottom on load
function scrollToBottom() {
    const chatBox = document.getElementById('chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  window.onload = scrollToBottom;
  
  function sendMessage() {
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
  
    // Simulate Cosafe reply
    setTimeout(() => {
      chatBox.innerHTML += `
        <div class="chat-message">
          <div class="chat-avatar"><img src="https://img.icons8.com/color/96/000000/water-element.png" alt="Cosafe"></div>
          <div class="chat-content">
            <div class="chat-user">Cosafe</div>
            <div>Xin lỗi, Cosafe không thể tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn.</div>
          </div>
        </div>
      `;
      scrollToBottom();
    }, 800);
  }
  
  // Optional: Send message on Enter key
  document.getElementById('user-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendMessage();
  });
  
  // Add event listener to the trash bin icon to clear chat history
  document.querySelector('.chat-trash').addEventListener('click', function() {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
  });
  