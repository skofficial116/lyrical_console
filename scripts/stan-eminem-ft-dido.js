import chalk from "chalk";
import gradient from "gradient-string";
import playSound from "play-sound";

const player = playSound();

import path from "path";

const AUDIO_FILE = path.resolve("./audio/stan-eminem-ft-dido.mp3");
const TYPING_SPEED = 50;

// Each line has its own timing (ms from start)
const lyrics = [
  { text: "My tea's gone cold, I'm wondering why I got out of bed at all...", time: 500, color: "cyan", speed: 60 },
  { text: "The morning rain clouds up my window, and I can't see at all...", time: 6000, color: "magenta", speed: 1 }, // uses default
  { text: "And even if I could, it'd all be gray...", time: 13000, color: "yellow", speed: 120 },
  { text: "But your picture on my wall...", time: 16000, color: "green", speed: 80 },
  { text: "It reminds me that it's not so bad,", time: 19000, color: "cyan" },
  { text: " it's not so bad.", time: 22000, color: "cyan" }
];

// ---- HELPERS ----
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function applyColor(text, color) {
  return chalk[color] ? chalk[color](text) : text;
}

async function typeLine(text, color, speed = TYPING_SPEED) {
  return new Promise(resolve => {
    let i = 0;

    // how many characters per tick
    const chunkSize = speed < 10 ? Math.ceil(10 / speed) : 1;
    const intervalTime = Math.max(speed, 10);

    const interval = setInterval(() => {
      const chunk = text.slice(i, i + chunkSize);

      const coloredChunk = chalk[color]
        ? chalk[color](chunk)
        : chunk;

      process.stdout.write(coloredChunk);

      i += chunkSize;

      if (i >= text.length) {
        clearInterval(interval);
        process.stdout.write("\n");
        resolve();
      }
    }, intervalTime);
  });
}

// ---- MAIN ----
async function playLyrics() {
  console.clear();

  console.log(
    chalk.bold(gradient.rainbow("🎵 Synced Console Lyrics 🎵\n"))
  );

  const startTime = Date.now();

  // Start audio
  player.play(AUDIO_FILE, {
    player: "vlc",
    args: ["--intf", "dummy", "--no-video", "--quiet"]
  }, err => {
    if (err) console.log("Audio error:", err);
  });

  for (let i = 0; i < lyrics.length; i++) {
    const now = Date.now();
    const elapsed = now - startTime;

    const waitTime = lyrics[i].time - elapsed;

    if (waitTime > 0) {
      await sleep(waitTime);
    }

    await typeLine(lyrics[i].text, lyrics[i].color);

    // small spacing for readability
    await sleep(200);
  }
  await sleep(1000);


  await typeLine(
    "✨ Like & follow @Musical_Coder on Insta ✨",
    "magenta",
    40 // slower = softer entrance
  );
}

playLyrics();