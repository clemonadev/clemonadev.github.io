const params = new URLSearchParams(window.location.search);
const channel = params.get("u");

const followerElement = document.querySelector(".follower");
const subsciberElement = document.querySelector(".subscriber");
const viewerElement = document.querySelector(".viewer");

const FOLLOWER_URL = `https://decapi.me/twitch/followcount/${channel}`;
const SUBSCRIBER_URL = `https://decapi.me/twitch/subcount/${channel}`;
const VIEWER_URL = `https://decapi.me/twitch/viewercount/${channel}`;

async function getMetric(url) {
  const response = await fetch(url);
  const metric = await response.text();

  console.log(metric);

  if (metric.includes("decapi.me") || metric.includes("offline")) return "-";
  else return metric;
}

async function updateMetrics() {
  followerElement.innerHTML =
    "<span>FOLLOWERS: </span>" + (await getMetric(FOLLOWER_URL));
  subsciberElement.innerHTML =
    "<span>SUBSCRIBERS: </span>" + (await getMetric(SUBSCRIBER_URL));
  viewerElement.innerHTML =
    "<span>VIEWERS: </span>" + (await getMetric(VIEWER_URL));
}

updateMetrics();
setInterval(updateMetrics, 60000);
