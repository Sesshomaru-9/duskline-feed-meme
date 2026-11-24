// Duskline Feed Meme — make.fun entry "Post the Meme, Win the Feed"
// (u-myronera-post-the-meme-win-the-feed-2de960bf), Node 22, stdlib only.
//
// The entry is the X post itself: the meme image is posted on X from a
// public account with @_myronera and a play code in the post text, and
// POST.json at the repo root names that post. This program's whole job,
// per the brief, is to copy POST.json from the repository to the output
// directory, where the house reads it. Nothing it writes is scored.
//
// Safety: the program never writes into the repository directory. If
// MAKEFUN_OUTPUT_DIR is unset, empty, or points inside the repo, it falls
// back to a temp directory and exits 0 without crashing.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';

function resolveOutDir(): string {
  const requested = (process.env.MAKEFUN_OUTPUT_DIR ?? '').trim();
  const repoRoot = resolve(BOT_DIR);
  if (requested) {
    const out = resolve(requested);
    // Refuse an output dir inside the repo: the grader sandbox is
    // read-only there, and a previous entry was rejected for writing
    // next to its entrypoint.
    if (out !== repoRoot && !out.startsWith(repoRoot + '/')) {
      return out;
    }
    console.error('MAKEFUN_OUTPUT_DIR points inside the repo; using a temp dir instead.');
  }
  return mkdtempSync(join(tmpdir(), 'duskline-feed-meme-'));
}

const OUTPUT_DIR = resolveOutDir();

try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
