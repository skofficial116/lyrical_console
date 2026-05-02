import chalk from "chalk";
import gradient from "gradient-string";
import playSound from "play-sound";
import path from "path";
import db from "./db/db.json" with { type: "json" };

const player = playSound();

const trackName = process.argv[2]
// const trackName = "hothon-se-chhoo-lo-tum-part1";

const AUDIO_FILE = path.resolve(`./audio/${trackName}.mp3`);
const TYPING_SPEED = 50;
const lyrics = db[trackName]["lyrics"];


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
    chalk.bold(gradient.rainbow(`🎵 [ ${trackName} ] 🎵\n`))
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

    await typeLine(lyrics[i].text, lyrics[i].color,   lyrics[i].speed);

    await sleep(200);
  }
  await sleep(1000);

  console.log()
  console.log()
  await typeLine(
    "✨ Like & follow @lyrical_coder_official on Insta ✨",
    "magenta",
    40
  );

  await sleep(2000);
  console.log("\n" + chalk.green("✔ Done\n"));

}



playLyrics();