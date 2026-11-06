// Next.js 16's static export writes route-segment prefetch files in nested
// folders (shop/__next.shop/__PAGE__.txt) while the client asks for one
// dotted name (shop/__next.shop.__PAGE__.txt). A static host can't map one to
// the other, so copy every nested file to the name the client requests.
import { copyFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
let copied = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) flatten(full, dir);
    else walk(full);
  }
}

function flatten(segmentDir, parent) {
  const stack = [segmentDir];
  while (stack.length) {
    const dir = stack.pop();
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) stack.push(full);
      else {
        const dotted = relative(parent, full).split(sep).join(".");
        copyFileSync(full, join(parent, dotted));
        copied++;
      }
    }
  }
}

walk(OUT);
console.log(`flatten-segments: ${copied} prefetch files copied to their dotted names`);
