/* =========================
   Cyber AI Assistant Script
   ========================= */

// ⚠️ For testing only (unsafe in production)
const API_KEY = "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";

/* =========================
   Elements
   ========================= */
const chat = document.getElementById("chat");
const input = document.getElementById("msg");


/* =========================
   System brain (expert mode)
   ========================= */
let messages = [
  {
    role: "system",
    content: `
You are CyberBot.

You are an expert in:
• Cybersecurity
• Ethical hacking
• Pen testing
• Networking
• Python programming
• Automation scripting
• Web development

Always:
• Explain step-by-step
• Use markdown
• Show clean code examples
• Teach clearly like ChatGPT
`
  }
];


/* =========================
   Add message bubble
   ========================= */
function add(text, type) {

  const div = document.createElement("div");
  div.className = "msg " + type;

  // markdown support
  div.innerHTML = marked.parse(text);

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  // highlight code
  hljs.highlightAll();

  addCopyButtons();
}


/* =========================
   Send message
   ========================= */
async function send() {

  const text = input.value.trim();
  if (!text) return;

  input.value = "";

  add(text, "user");

  messages.push({
    role: "user",
    content: text
  });

  // typing animation
  const typing = document.createElement("div");
  typing.className = "msg bot";
  typing.textContent = "Typing...";
  chat.appendChild(typing);

  try {

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages
      })
    });

    const data = await res.json();

    typing.remove();

    const reply = data.choices[0].message.content;

    add(reply, "bot");

    messages.push({
      role: "assistant",
      content: reply
    });

    localStorage.setItem("chat_memory", JSON.stringify(messages));

  } catch (e) {
    typing.remove();
    add("❌ Error connecting to server", "bot");
  }
}


/* =========================
   Press Enter to send
   ========================= */
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});


/* =========================
   Voice input
   ========================= */
function voiceInput() {

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported");
    return;
  }

  const rec = new SpeechRecognition();

  rec.onresult = e => {
    input.value = e.results[0][0].transcript;
  };

  rec.start();
}


/* =========================
   Clear chat
   ========================= */
function clearChat() {
  chat.innerHTML = "";
  localStorage.removeItem("chat_memory");
  messages = messages.slice(0, 1);
}


/* =========================
   Export chat to txt
   ========================= */
function exportChat() {

  let text = "";

  messages.forEach(m => {
    if (m.role !== "system") {
      text += m.role.toUpperCase() + ":\n" + m.content + "\n\n";
    }
  });

  const blob = new Blob([text], { type: "text/plain" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "chat.txt";
  a.click();
}


/* =========================
   Copy buttons for code
   ========================= */
function addCopyButtons() {

  document.querySelectorAll("pre code").forEach(block => {

    if (block.parentElement.querySelector(".copy-btn")) return;

    const btn = document.createElement("button");
    btn.textContent = "Copy";
    btn.className = "copy-btn";

    btn.onclick = () => {
      navigator.clipboard.writeText(block.innerText);
      btn.textContent = "Copied!";
      setTimeout(() => btn.textContent = "Copy", 1000);
    };

    block.parentElement.appendChild(btn);
  });
}


/* =========================
   Load memory on start
   ========================= */
window.onload = () => {

  const saved = localStorage.getItem("chat_memory");

  if (saved) {

    messages = JSON.parse(saved);

    messages.forEach(m => {
      if (m.role === "user") add(m.content, "user");
      if (m.role === "assistant") add(m.content, "bot");
    });
  }
};