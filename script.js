/* =====================
   FRONTEND CHAT LOGIC
   NEVER PUT API KEY HERE
===================== */

const chat = document.getElementById("chat");
const input = document.getElementById("msg");


/* Add message bubble */
function add(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.textContent = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}


/* Send message to backend */
async function send() {
  const text = input.value.trim();
  if (!text) return;

  input.value = "";

  add(text, "user");

  const typing = document.createElement("div");
  typing.className = "msg bot";
  typing.textContent = "Typing...";
  chat.appendChild(typing);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    typing.remove();
    add(data.reply, "bot");

  } catch (err) {
    typing.remove();
    add("Server error. Try again.", "bot");
  }
}


/* Enter key support */
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});