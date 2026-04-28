// 🔑 PARAMS
const params = new URLSearchParams(window.location.search);
const apiKey = params.get("apiKey");
const channel = params.get("channel");
const riotId = params.get("riotId");
const tag = params.get("tag");

const headers = apiKey ? { Authorization: apiKey } : {};

// 🔧 CONFIG
const API_URL = `https://api.henrikdev.xyz/valorant/v2/mmr-history/ap/pc/${riotId}/${tag}`;
const TWITCH_UPTIME_URL = `https://decapi.me/twitch/uptime/${channel}`;

// 🎯 ELEMENTS
const rrText = document.querySelector(".rr-change");
const winsText = document.querySelector(".win");
const lossText = document.querySelector(".loss");
const wrapper = document.querySelector(".main-wrapper");
const riotText = document.querySelector(".riot");
const twitchText = document.querySelector(".twitch");

riotText.innerHTML = `${riotId}<span>#${tag}</span>`;
twitchText.innerHTML = `${channel}`;

// 🧠 STATE
let streamStartTime = null;
let matchInterval = null;

// ========================
// UPTIME PARSER
// ========================
function parseUptime(text) {
  let total = 0;

  for (const part of text.split(", ")) {
    const [value, unit] = part.split(" ");
    const num = parseInt(value, 10);

    if (unit.startsWith("day")) total += num * 86400;
    if (unit.startsWith("hour")) total += num * 3600;
    if (unit.startsWith("minute")) total += num * 60;
    if (unit.startsWith("second")) total += num;
  }

  return total;
}

// ========================
// 1. GET UPTIME LOOP
// ========================
async function getUptime() {
  const res = await fetch(TWITCH_UPTIME_URL);
  const text = await res.text();

  rrText.textContent = "OFFLINE";

  if (text.toLowerCase().includes("offline")) {
    setTimeout(getUptime, 60 * 1000);
    return;
  }

  streamStartTime = new Date(Date.now() - parseUptime(text) * 1000);

  startMatchTracking();
}

// ========================
// 2. START MATCH TRACKING
// ========================
function startMatchTracking() {
  fetchMatches();
  matchInterval = setInterval(fetchMatches, 2 * 60 * 1000);
}

// ========================
// 3. FETCH MATCHES
// ========================
async function fetchMatches() {
  if (!streamStartTime) return;

  const res = await fetch(API_URL, { headers });
  const data = await res.json();

  console.log(data);
  processMatches(data);
}

// ========================
// 4. PROCESS MATCHES
// ========================
function processMatches(data) {
  const startTime = streamStartTime.getTime();

  let wins = 0;
  let losses = 0;
  let rrTotal = 0;

  for (const match of data.data.history) {
    const matchTime = new Date(match.date).getTime();

    if (matchTime < startTime) continue;

    const rr = match.last_change;

    // skip neutral / invalid RR (draw / no change / derank protection edge cases)
    if (rr === 0 || rr === null || rr === undefined) continue;

    rrTotal += rr;

    if (rr > 0) wins++;
    if (rr < 0) losses++;
  }

  // ------------------------
  // UI updates (wins/losses)
  // ------------------------
  winsText.textContent = wins;
  lossText.textContent = losses;

  // ------------------------
  // RR display formatting
  // ------------------------
  const absRR = Math.abs(rrTotal);
  const arrow = rrTotal >= 0 ? "↑" : "↓";

  rrText.textContent = `${arrow}${absRR} RR`;

  // ------------------------
  // wrapper state class
  // ------------------------
  wrapper.classList.remove("positive", "negative");

  if (rrTotal > 0) {
    wrapper.classList.add("positive");
  } else if (rrTotal < 0) {
    wrapper.classList.add("negative");
  }
}

// ========================
// START EVERYTHING
// ========================
getUptime();
