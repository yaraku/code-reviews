import { Hunk, PatchDiff } from "./types";

export function normalizeFile(diff: PatchDiff) {
  const lines = diff.hunks.map(linesFromHunk).flat()
 
  return {
    path: diff.newFileName.split(/^b\//)[1],
    start: lines[0],
    end: lines[1]
  }
}

function linesFromHunk(hunk: Hunk) {
  return [
    hunk.newStart,
    hunk.newStart + hunk.newLines - 1
  ]
}
