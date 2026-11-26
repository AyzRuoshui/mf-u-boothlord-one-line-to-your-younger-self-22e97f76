import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_OUTPUT_DIR = "/output";
const ENTRY_FILENAME = "entry.txt";
const MAX_ENTRY_CHARS = 200;

// 写给年轻自己的那句话终稿：以具体生活抉择与时间反差传递诚实余韵（全 ASCII，161 字符/字节）
const LINE_TO_YOUNGER_SELF =
  "Don't sell that scratched upright piano just to make October rent; you'll forget every landlord's name, and still miss having somewhere honest to put your hands.";

export function validateEntryLine(text: string): {
  valid: boolean;
  chars: number;
  bytes: number;
  reason?: string;
} {
  const bytes = Buffer.byteLength(text, "utf8");
  const chars = [...text].length;

  if (chars < 1 || chars > MAX_ENTRY_CHARS) {
    return {
      valid: false,
      chars,
      bytes,
      reason: `Character length must be 1..${MAX_ENTRY_CHARS}, got ${chars}.`,
    };
  }
  if (text.trim().length === 0) {
    return {
      valid: false,
      chars,
      bytes,
      reason: "Entry must not be whitespace-only.",
    };
  }
  if (/[\r\n\0]/.test(text)) {
    return {
      valid: false,
      chars,
      bytes,
      reason: "Entry must be a single line without line breaks or NUL bytes.",
    };
  }
  if (text !== text.trim()) {
    return {
      valid: false,
      chars,
      bytes,
      reason: "Entry must not have leading or trailing whitespace.",
    };
  }
  return { valid: true, chars, bytes };
}

export function resolveOutPath(
  argv: string[],
  env: NodeJS.ProcessEnv = process.env,
): string {
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--out") {
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        throw new Error("Missing path value after --out.");
      }
      const target = resolve(next);
      return target.toLowerCase().endsWith(".txt") ? target : join(target, ENTRY_FILENAME);
    }
    if (arg.startsWith("--out=")) {
      const value = arg.slice("--out=".length).trim();
      if (!value) {
        throw new Error("Empty path value in --out=.");
      }
      const target = resolve(value);
      return target.toLowerCase().endsWith(".txt") ? target : join(target, ENTRY_FILENAME);
    }
  }
  const envDir = env.MAKEFUN_OUTPUT_DIR;
  if (envDir && envDir.trim().length > 0) {
    return join(resolve(envDir.trim()), ENTRY_FILENAME);
  }
  return join(DEFAULT_OUTPUT_DIR, ENTRY_FILENAME);
}

export function writeEntry(outPath: string, text: string = LINE_TO_YOUNGER_SELF): void {
  const check = validateEntryLine(text);
  if (!check.valid) {
    throw new Error(`Gate validation failed: ${check.reason}`);
  }
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, text, { encoding: "utf8" });
}

function isDirectExecution(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  return pathToFileURL(resolve(entry)).href === import.meta.url;
}

if (isDirectExecution()) {
  writeEntry(resolveOutPath(process.argv.slice(2)));
}
