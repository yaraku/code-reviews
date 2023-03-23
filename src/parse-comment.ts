import { Comment } from "./types";

export function parseComment(foundFile: any) {
  return (hunk: any): Comment => {
    return {
      path: foundFile.path,
      body: "```diff\n"
      + hunk.lines.join('\n')
      + "\n"
      + "```",
      side: 'RIGHT',
      start_side: 'RIGHT',
      start_line: foundFile.start >= hunk.newStart ? foundFile.start : hunk.newStart,
      line: foundFile.end <= (hunk.newStart + hunk.newLines - 1) ? foundFile.end : (hunk.newStart + hunk.newLines - 1),
    }
  }
}
