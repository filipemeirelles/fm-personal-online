#!/usr/bin/env node
// Sobe a pasta convertida (gifdotreino-mp4) para o bucket `exercise-library`
// no Supabase Storage, mantendo a estrutura de pastas como prefixos.
//
// Uso (Node 20+):
//   node --env-file=.env.local scripts/upload-library.mjs [source] [concurrency]
//
// Defaults:
//   source: C:/Users/demol/Downloads/gifdotreino-mp4
//   concurrency: 6
//
// Requer no .env.local:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const BUCKET = "exercise-library";
const SOURCE = process.argv[2] ?? "C:/Users/demol/Downloads/gifdotreino-mp4";
const CONCURRENCY = Number(process.argv[3] ?? 6);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Faltam variáveis no .env.local: NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY"
  );
  console.error("Lembre de rodar com: node --env-file=.env.local scripts/upload-library.mjs");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function ensureBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;
  const found = buckets?.find((bucket) => bucket.name === BUCKET);
  if (found) {
    if (!found.public) {
      console.warn(
        `Bucket "${BUCKET}" existe mas não é público. Atualize manualmente no Studio para Public.`
      );
    }
    return;
  }
  console.log(`Criando bucket "${BUCKET}" (público)...`);
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });
  if (error) throw error;
}

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".mp4")) {
      out.push(full);
    }
  }
  return out;
}

async function listExisting(prefix = "", acc = new Set()) {
  // O list tem limite de 1000 por chamada; iteramos por prefixo de pasta.
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(prefix, { limit: 1000 });
  if (error) {
    if (error.message?.includes("not found")) return acc;
    throw error;
  }
  for (const item of data ?? []) {
    if (item.id == null) {
      // Pasta (sem id) → recursa
      const next = prefix ? `${prefix}/${item.name}` : item.name;
      await listExisting(next, acc);
    } else {
      acc.add(prefix ? `${prefix}/${item.name}` : item.name);
    }
  }
  return acc;
}

async function uploadOne(filePath, remotePath) {
  const buffer = await readFile(filePath);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(remotePath, buffer, {
      contentType: "video/mp4",
      upsert: false,
      cacheControl: "31536000", // 1 ano (são imutáveis)
    });
  if (error) throw error;
}

async function main() {
  const sourceStat = await stat(SOURCE).catch(() => null);
  if (!sourceStat?.isDirectory()) {
    console.error(`SOURCE não encontrado ou não é diretório: ${SOURCE}`);
    process.exit(1);
  }

  console.log(`Source: ${SOURCE}`);
  console.log(`Bucket: ${BUCKET}`);
  console.log(`Workers: ${CONCURRENCY}`);

  await ensureBucket();

  console.log("Listando arquivos já no bucket (pode demorar alguns segundos)...");
  const existing = await listExisting();
  console.log(`Já no bucket: ${existing.size}`);

  console.log("Varrendo arquivos locais...");
  const files = await walk(SOURCE);
  console.log(`Encontrados ${files.length} MP4 localmente.`);

  const pending = [];
  for (const local of files) {
    const remote = path.relative(SOURCE, local).split(path.sep).join("/");
    if (existing.has(remote)) continue;
    pending.push({ local, remote });
  }

  console.log(
    `${files.length - pending.length} já no bucket, ${pending.length} pendentes.`
  );

  let done = 0;
  let failed = 0;
  const start = Date.now();
  const failures = [];

  async function worker() {
    while (pending.length > 0) {
      const task = pending.shift();
      if (!task) break;
      try {
        await uploadOne(task.local, task.remote);
        done += 1;
        const elapsed = (Date.now() - start) / 1000;
        const rate = done / elapsed;
        const eta = pending.length / rate;
        process.stdout.write(
          `[${done}/${files.length - failed}] ${task.remote}  (${rate.toFixed(2)}/s, ETA ${Math.round(eta)}s)\n`
        );
      } catch (error) {
        failed += 1;
        failures.push({ remote: task.remote, message: error.message });
        console.error(`FAIL ${task.remote}: ${error.message}`);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const elapsed = ((Date.now() - start) / 60_000).toFixed(1);
  console.log(`\nConcluído em ${elapsed}min. Sucesso: ${done}. Falhas: ${failed}.`);

  if (failures.length > 0) {
    console.log("\nFalhas detalhadas:");
    for (const f of failures.slice(0, 20)) {
      console.log(`  ${f.remote}: ${f.message}`);
    }
    if (failures.length > 20) {
      console.log(`  ...e mais ${failures.length - 20}.`);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
