const BACKEND_URL = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", async () => {
  const statusBadge = document.getElementById("status");
  const loginView = document.getElementById("login-view");
  const connectedView = document.getElementById("connected-view");
  const loginForm = document.getElementById("login-form");
  const logoutBtn = document.getElementById("logout-btn");
  const userEmailSpan = document.getElementById("user-email");
  const errorMsgDiv = document.getElementById("error-message");

  // Check storage for existing token
  chrome.storage.local.get(["vintamie_token", "vintamie_user_email"], async (result) => {
    const token = result.vintamie_token;
    if (token) {
      // Validate token with backend
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const user = await response.json();
          showConnected(user.email);
        } else {
          showLogin();
        }
      } catch (err) {
        // Server offline, but keep token
        showConnected(result.vintamie_user_email || "Lokal angemeldet");
        statusBadge.textContent = "Offline (Backend)";
        statusBadge.className = "status-badge disconnected";
      }
    } else {
      showLogin();
    }
  });

  // Handle Login Submit
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    errorMsgDiv.style.display = "none";

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Login fehlgeschlagen.");
      }

      const data = await response.json();
      const token = data.access_token;

      // Save token in storage
      chrome.storage.local.set({ 
        "vintamie_token": token,
        "vintamie_user_email": email
      }, () => {
        showConnected(email);
      });

    } catch (err) {
      errorMsgDiv.textContent = err.message;
      errorMsgDiv.style.display = "block";
    }
  });

  // Handle Logout
  logoutBtn.addEventListener("click", () => {
    chrome.storage.local.remove(["vintamie_token", "vintamie_user_email"], () => {
      showLogin();
    });
  });

  function showConnected(email) {
    statusBadge.textContent = "Verbunden";
    statusBadge.className = "status-badge connected";
    loginView.style.display = "none";
    connectedView.style.display = "block";
    userEmailSpan.textContent = email;
  }

  function showLogin() {
    statusBadge.textContent = "Nicht angemeldet";
    statusBadge.className = "status-badge disconnected";
    loginView.style.display = "block";
    connectedView.style.display = "none";
    userEmailSpan.textContent = "";
  }
});
