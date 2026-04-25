function updateClock() {
  const now = new Date();

  const minutes = String(now.getMinutes()).padStart(2, "0");

  let hours = now.getHours() % 12;
  if (hours === 0) hours = 12;

  const suffix = now.getHours() < 12 ? "AM" : "PM";
  let clock = document.querySelector(".clock");

  if (clock) {
    clock.innerHTML = `${String(hours).padStart(2, "0")}<span>:</span>${minutes} ${suffix}`;
  }

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const month = months[now.getMonth()];
  const day = String(now.getDate());

  let date = document.querySelector(".date");
  if (date) {
    date.textContent = `${month} ${day}`;
  }
}

updateClock();
setInterval(updateClock, 1000);
