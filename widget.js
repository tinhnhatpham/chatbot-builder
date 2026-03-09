/**
 * BotForge Embed Widget
 * 
 * HOW TO CUSTOMIZE FOR EACH CUSTOMER:
 * Change the config below, then give the customer the <script> tag to paste on their site.
 * 
 * CUSTOMER INSTALLS IT BY PASTING THIS INTO THEIR WEBSITE (before </body>):
 * <script src="https://YOUR-NETLIFY-URL/widget.js"></script>
 */

(function () {

  // ============================================================
  // 👇 CONFIGURE THIS FOR EACH CUSTOMER
  // ============================================================
  const CONFIG = {
    botId: "YOUR_BOT_ID_HERE",               // 👈 Paste the Bot ID from the builder
    botName: "Aria",                          // Bot's display name
    welcomeMessage: "Hi there! 👋 How can I help you today?",
    placeholder: "Type a message...",
    accentColor: "#6c63ff",                   // Brand color (hex)
    backendUrl: "YOUR_RAILWAY_URL_HERE",      // Your Railway backend URL
  };
  // ============================================================

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    #bf-widget * { box-sizing: border-box; margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; }

    #bf-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
    }

    /* Bubble button */
    #bf-bubble {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: ${CONFIG.accentColor};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2), 0 0 0 0 ${CONFIG.accentColor}44;
      transition: transform 0.2s, box-shadow 0.2s;
      animation: bf-ping 2.5s ease-in-out 1s 3;
      flex-shrink: 0;
    }
    #bf-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(0,0,0,0.25), 0 0 0 8px ${CONFIG.accentColor}22;
    }
    #bf-bubble svg { width: 26px; height: 26px; fill: white; transition: transform 0.3s; }
    #bf-bubble.open svg { transform: rotate(90deg); }

    @keyframes bf-ping {
      0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.2), 0 0 0 0 ${CONFIG.accentColor}55; }
      50% { box-shadow: 0 4px 20px rgba(0,0,0,0.2), 0 0 0 12px ${CONFIG.accentColor}00; }
    }

    /* Chat window */
    #bf-window {
      width: 360px;
      height: 500px;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform-origin: bottom right;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s;
      transform: scale(0.85);
      opacity: 0;
      pointer-events: none;
    }
    #bf-window.open {
      transform: scale(1);
      opacity: 1;
      pointer-events: all;
    }

    /* Header */
    #bf-header {
      background: ${CONFIG.accentColor};
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    #bf-avatar {
      width: 38px; height: 38px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    #bf-header-info { flex: 1; }
    #bf-header-name { color: white; font-size: 15px; font-weight: 700; }
    #bf-header-status { color: rgba(255,255,255,0.75); font-size: 11px; margin-top: 1px; display: flex; align-items: center; gap: 4px; }
    #bf-status-dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; display: inline-block; }
    #bf-close {
      background: rgba(255,255,255,0.15);
      border: none; cursor: pointer;
      width: 28px; height: 28px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 16px;
      transition: background 0.15s;
    }
    #bf-close:hover { background: rgba(255,255,255,0.25); }

    /* Messages */
    #bf-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 16px 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #f8f8fc;
      scroll-behavior: smooth;
      width: 100%;
      overflow-x: hidden;
    }
    #bf-messages::-webkit-scrollbar { width: 3px; }
    #bf-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

    .bf-msg {
      display: flex;
      gap: 10px;
      animation: bf-msgIn 0.2s ease;
      max-width: 82%;
      min-width: 0;
      align-self: flex-start;
    }
    @keyframes bf-msgIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .bf-msg.user { align-self: flex-end; flex-direction: row-reverse; }

    .bf-msg-avatar {
      width: 30px; height: 30px;
      border-radius: 50%;
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
      margin-top: 2px;
    }
    .bf-msg.bot .bf-msg-avatar { background: ${CONFIG.accentColor}22; }
    .bf-msg.user .bf-msg-avatar { background: #e8e8f0; }

    .bf-msg-bubble {
      padding: 10px 16px 10px 16px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.55;
      overflow-wrap: break-word;
      word-break: break-word;
      width: fit-content;
      max-width: 100%;
    }
    .bf-msg.bot .bf-msg-bubble {
      background: white;
      color: #1a1a2e;
      border-radius: 4px 16px 16px 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07);
    }
    .bf-msg.user .bf-msg-bubble {
      background: ${CONFIG.accentColor};
      color: white;
      border-radius: 16px 4px 16px 16px;
    }

    /* Typing indicator */
    #bf-typing {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      animation: bf-msgIn 0.2s ease;
    }
    .bf-typing-bubble {
      background: white;
      border-radius: 4px 16px 16px 16px;
      padding: 12px 16px;
      display: flex;
      gap: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07);
    }
    .bf-dot {
      width: 5px; height: 5px;
      background: #aaa;
      border-radius: 50%;
      animation: bf-bounce 1.2s infinite;
    }
    .bf-dot:nth-child(2) { animation-delay: 0.15s; }
    .bf-dot:nth-child(3) { animation-delay: 0.3s; }
    @keyframes bf-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }

    /* Input */
    #bf-input-area {
      padding: 12px;
      background: white;
      border-top: 1px solid #e8e8f0;
      box-shadow: 0 -4px 12px rgba(0,0,0,0.04);
      display: flex;
      gap: 8px;
      align-items: flex-end;
      flex-shrink: 0;
    }
    #bf-input {
      flex: 1;
      border: 1.5px solid #e8e8f0;
      border-radius: 12px;
      padding: 9px 14px;
      font-size: 13.5px;
      outline: none;
      resize: none;
      min-height: 40px;
      max-height: 90px;
      line-height: 1.45;
      color: #1a1a2e;
      transition: border-color 0.2s;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    #bf-input:focus { border-color: ${CONFIG.accentColor}; }
    #bf-input::placeholder { color: #aaa; }
    #bf-send {
      width: 38px; height: 38px;
      background: ${CONFIG.accentColor};
      border: none;
      border-radius: 10px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s;
    }
    #bf-send:hover { filter: brightness(1.1); transform: scale(1.05); }
    #bf-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    #bf-send svg { width: 16px; height: 16px; fill: white; }

    #bf-footer {
      text-align: center;
      padding: 6px;
      font-size: 10px;
      color: #bbb;
      background: white;
      border-top: 1px solid #f0f0f0;
    }
    #bf-footer a { color: ${CONFIG.accentColor}; text-decoration: none; font-weight: 600; }

    @media (max-width: 400px) {
      #bf-window { width: calc(100vw - 32px); height: 70vh; }
    }
  `;
  document.head.appendChild(style);

  // Build HTML
  const widget = document.createElement('div');
  widget.id = 'bf-widget';
  widget.innerHTML = `
    <div id="bf-window">
      <div id="bf-header">
        <div id="bf-avatar">🤖</div>
        <div id="bf-header-info">
          <div id="bf-header-name">${CONFIG.botName}</div>
          <div id="bf-header-status"><span id="bf-status-dot"></span> Online · typically replies instantly</div>
        </div>
        <button id="bf-close">✕</button>
      </div>
      <div id="bf-messages"></div>
      <div id="bf-input-area">
        <textarea id="bf-input" placeholder="${CONFIG.placeholder}" rows="1"></textarea>
        <button id="bf-send" disabled>
          <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </button>
      </div>
      <div id="bf-footer">Powered by <a href="#" target="_blank">BotForge</a></div>
    </div>
    <button id="bf-bubble">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
    </button>
  `;
  document.body.appendChild(widget);

  // State
  let isOpen = false;
  let isTyping = false;
  let history = [];
  let initialized = false;

  const win = document.getElementById('bf-window');
  const bubble = document.getElementById('bf-bubble');
  const messages = document.getElementById('bf-messages');
  const input = document.getElementById('bf-input');
  const sendBtn = document.getElementById('bf-send');

  // Toggle open/close
  function toggle() {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    bubble.classList.toggle('open', isOpen);
    if (isOpen && !initialized) {
      initialized = true;
      addMessage('bot', CONFIG.welcomeMessage);
      input.focus();
    }
  }

  bubble.addEventListener('click', toggle);
  document.getElementById('bf-close').addEventListener('click', toggle);

  // Enable send button when typing
  input.addEventListener('input', () => {
    sendBtn.disabled = input.value.trim() === '';
    // Auto-resize
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 90) + 'px';
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  sendBtn.addEventListener('click', send);

  async function send() {
    if (isTyping) return;
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;
    addMessage('user', text);
    history.push({ role: 'user', content: text });
    showTyping();
    isTyping = true;

    try {
      const res = await fetch(`${CONFIG.backendUrl}/bots/${CONFIG.botId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });

      const data = await res.json();
      hideTyping();
      isTyping = false;

      const reply = data.reply || "Sorry, I couldn't get a response right now.";
      history.push({ role: 'assistant', content: reply });
      addMessage('bot', reply);
    } catch (e) {
      hideTyping();
      isTyping = false;
      addMessage('bot', "Sorry, I'm having trouble connecting. Please try again in a moment.");
    }
  }

  function addMessage(role, text) {
    const div = document.createElement('div');
    div.className = `bf-msg ${role}`;
    const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    div.innerHTML = `
      <div class="bf-msg-avatar">${role === 'bot' ? '🤖' : '👤'}</div>
      <div class="bf-msg-bubble">${formatted}</div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.id = 'bf-typing';
    div.className = 'bf-msg bot';
    div.innerHTML = `
      <div class="bf-msg-avatar">🤖</div>
      <div class="bf-typing-bubble">
        <div class="bf-dot"></div><div class="bf-dot"></div><div class="bf-dot"></div>
      </div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('bf-typing');
    if (el) el.remove();
  }

})();
