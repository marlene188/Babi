const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const chatBox = document.getElementById("chat");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.textContent = text;
  div.className = sender;
  chatBox.appendChild(div);
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage("You: " + message, "user");
  input.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  addMessage("Bot: " + data.reply, "bot");
}

sendBtn.addEventListener("click", sendMessage);
