// Extension Popup Controller
document.addEventListener("DOMContentLoaded", async () => {
  const statusBadge = document.getElementById("status");

  try {
    const response = await fetch("http://localhost:8000/api/drafts");
    if (response.ok) {
      statusBadge.textContent = "Verbunden";
      statusBadge.className = "status-badge connected";
    } else {
      throw new Error();
    }
  } catch (err) {
    statusBadge.textContent = "Offline (Backend)";
    statusBadge.className = "status-badge disconnected";
  }
});
