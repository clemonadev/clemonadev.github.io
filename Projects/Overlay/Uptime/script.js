const params = new URLSearchParams(window.location.search);
const channel = params.get("u");

const uptimeElement = document.querySelector(".uptime");

function formatTime(text) {
  return text
    .replace(/\s*\d+\s*second[s]?/gi, "") // remove seconds
    .replace(/(\d+)\s*(hour[s]?)/gi, "$1 <span>$2</span> ")
    .replace(/(\d+)\s*(minute[s]?)/gi, "$1 <span>$2</span> ")
    .replace(/,\s*/g, "") // remove commas
    .trim();
}

async function getUptime() {
  if (!channel) {
    uptimeElement.innerHTML = "<span>UNKNOWN CHANNEL</span>";
    return;
  }

  const TWITCH_UPTIME_URL = `https://decapi.me/twitch/uptime/${channel}`;

  try {
    const res = await fetch(TWITCH_UPTIME_URL);
    const text = (await res.text()).trim();

    // handle empty or offline anywhere in response
    if (!text || text.toLowerCase().includes("offline")) {
      uptimeElement.innerHTML = "<span>STREAM OFFLINE</span>";
      return;
    }

    const formatted = formatTime(text);

    if (!formatted || formatted.length === 0) {
      uptimeElement.innerHTML = "<span>STREAM STARTING</span>";
      return;
    }

    uptimeElement.innerHTML = formatted;
  } catch (err) {
    console.error("Uptime fetch failed:", err);
    uptimeElement.textContent = "STREAM STARTING";
  }
}

getUptime();
setInterval(getUptime, 60000);
