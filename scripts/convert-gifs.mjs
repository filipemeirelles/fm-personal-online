#!/usr/bin/env node
// Converte todos os GIFs de SOURCE para MP4 em DEST mantendo a estrutura
// de pastas. Idempotente: pula arquivos cujo destino ja existe.
//
// Uso:
//   node scripts/convert-gifs.mjs [source] [dest] [concurrency]
//
// Defaults:
//   source: C:/Users/demol/Downloads/gifdotreino-gifs
//   dest:   C:/Users/demol/Downloads/gifdotreino-mp4
//   concurrency: 4

import { spawn } from "node:child_process";
import { readdir, stat, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const SOURCE =
  process.argv[2] ?? "C:/Users/demol/Downloads/gifdotreino-gifs";
const DEST = process.argv[3] ?? "C:/Users/demol/Downloads/gifdotreino-mp4";
const CONCURRENCY = Number(process.argv[4] ?? 4);

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await walk(full);
      out.push(...nested);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".gif")) {
      out.push(full);
    }
  }
  return out;
}

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function convertOne(input, output) {
  return new Promise((resolve, reject) => {
    const args = [
      "-y",
      "-i",
      input,
      "-movflags",
      "+faststart",
      "-pix_fmt",
      "yuv420p",
      "-vf",
      "scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-c:v",
      "libx264",
      "-crf",
      "26",
      "-preset",
      "fast",
      "-an",
      output,
    ];
    const child = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exit ${code} for ${input}\n${stderr.slice(-400)}`));
    });
  });
}

async function main() {
  const sourceStat = await stat(SOURCE).catch(() => null);
  if (!sourceStat?.isDirectory()) {
    console.error(`SOURCE não encontrado ou não é diretório: ${SOURCE}`);
    process.exit(1);
  }

  console.log(`Source: ${SOURCE}`);
  console.log(`Dest:   ${DEST}`);
  console.log(`Workers: ${CONCURRENCY}`);

  const files = await walk(SOURCE);
  console.log(`Encontrados ${files.length} GIFs.`);

  const tasks = [];
  for (const input of files) {
    const rel = path.relative(SOURCE, input);
    const output = path.join(DEST, rel.replace(/\.gif$/i, ".mp4"));
    tasks.push({ input, output, rel });
  }

  // Pré-filtra arquivos já convertidos.
  const pending = [];
  for (const task of tasks) {
    if (await exists(task.output)) continue;
    pending.push(task);
  }

  console.log(
    `${tasks.length - pending.length} já convertidos, ${pending.length} pendentes.`
  );

  // Garante diretórios de destino existem.
  const destDirs = new Set(pending.map((t) => path.dirname(t.output)));
  for (const dir of destDirs) {
    await mkdir(dir, { recursive: true });
  }

  let done = 0;
  let failed = 0;
  const start = Date.now();

  async function worker() {
    while (pending.length > 0) {
      const task = pending.shift();
      if (!task) break;
      try {
        await convertOne(task.input, task.output);
        done += 1;
        const elapsed = (Date.now() - start) / 1000;
        const rate = done / elapsed;
        const eta = pending.length / rate;
        process.stdout.write(
          `[${done}/${tasks.length}] ${task.rel}  (${rate.toFixed(2)}/s, ETA ${Math.round(eta)}s)\n`
        );
      } catch (error) {
        failed += 1;
        console.error(`FAIL ${task.rel}: ${error.message}`);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const elapsed = ((Date.now() - start) / 60_000).toFixed(1);
  console.log(`\nConcluído em ${elapsed}min. Sucesso: ${done}. Falhas: ${failed}.`);
  if (failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
