// chatbot.js — SkillSync AI Assistant
(function() {
  'use strict';
  
  // Wait for DOM
  function init() {
    const widget = document.getElementById('chatbot-widget');
    const toggle = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');
    
    if (!widget || !toggle) return;
    
    // Toggle chat window
    toggle.addEventListener('click', function() {
      widget.classList.toggle('active');
      toggle.classList.toggle('hidden');
      if (widget.classList.contains('active')) {
        input.focus();
      }
    });
    
    // Close chat
    closeBtn.addEventListener('click', function() {
      widget.classList.remove('active');
      toggle.classList.remove('hidden');
    });
    
    // AI responses
    const responses = {
      'hello': 'Hi there! 👋 How can I help you find your next project or hire a freelancer?',
      'hi': 'Hey! 👋 Welcome to SkillSync. Need help posting a project or finding work?',
      'help': '💡 I can help you with:\n• Posting projects\n• Finding freelancers\n• Project matching\n• Pricing advice\n• Skills assessment',
      'price': '💰 Projects typically range from ₹5,000 to ₹1,00,000+. What\'s your budget?',
      'hire': '👨‍💼 We have 1,200+ verified freelancers ready to help. Post your project and we\'ll match you with the best talent!',
      'work': '💼 Find high-quality projects in Development, Design, Marketing, and more. Apply with your best proposals!',
      'match': '🎯 Our AI uses sophisticated matching to connect you with the best talent based on skills and experience.',
      'skills': '🛠️ Popular skills: React, Node.js, Python, UI/UX, WordPress, Mobile Apps, Data Science, and more!',
      'how does it work': '🚀 Simple:\n1. Post your project or skills\n2. Get matched with freelancers/projects\n3. Review proposals\n4. Hire and collaborate!',
      'default': '✨ That\'s a great question! Our AI team is here to help. Would you like to post a project or find work?'
    };
    
    function getResponse(userMessage) {
      const text = userMessage.toLowerCase().trim();
      
      for (let key in responses) {
        if (text.includes(key)) {
          return responses[key];
        }
      }
      
      return responses['default'];
    }
    
    // Handle messages
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && input.value.trim()) {
        const userMessage = input.value.trim();
        
        // Add user message
        const userDiv = document.createElement('div');
        userDiv.className = 'message user';
        userDiv.textContent = userMessage;
        messages.appendChild(userDiv);
        
        // Clear input
        input.value = '';
        
        // Scroll to bottom
        messages.scrollTop = messages.scrollHeight;
        
        // Bot response (delayed for realism)
        setTimeout(function() {
          const response = getResponse(userMessage);
          const botDiv = document.createElement('div');
          botDiv.className = 'message bot';
          botDiv.textContent = response;
          messages.appendChild(botDiv);
          messages.scrollTop = messages.scrollHeight;
        }, 500);
      }
    });
    
    console.log('Chatbot initialized');
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
