import chalk from "chalk";
import gradient from "gradient-string";
import playSound from "play-sound";

const player = playSound();

import path from "path";

const songName= "stan-eminem-ft-dido";

import db  from "./db.json" with { type: "json" };

const AUDIO_FILE = path.resolve(`./audio/${songName}.mp3`);
const TYPING_SPEED = 50;
const lyrics = db[songName]["lyrics"];


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function applyColor(text, color) {
  return chalk[color] ? chalk[color](text) : text;
}

async function typeLine(text, color, speed = TYPING_SPEED) {
  return new Promise(resolve => {
    let i = 0;

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

async function playLyrics() {
  console.clear();

  await sleep(2000)

  console.log(
    chalk.bold(gradient.rainbow("🎵 Stan Lyrics - Sachin 🎵\n"))
  );

  const startTime = Date.now();

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

    await sleep(200);
  }
  await sleep(1000);


  await typeLine(
    "✨ Like & follow @Musical_Coder on Insta ✨",
    "magenta",
    40 
  );

  await sleep(2000);
  console.log("\n" + chalk.green("✔ Done\n"));

}



playLyrics();