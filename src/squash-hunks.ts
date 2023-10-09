import {Hunk, PatchDiff} from './types'

export function squashHunks(files: any) {
  return (file: PatchDiff) => {
    const foundFile = files.find((f: any) => file.newFileName.includes(f.path))
    const {hunks} = file

    file.hunks = hunks.filter(filterHunks(foundFile))

    return file
  }
}

function filterHunks(foundFile: any) {
  const lineOffset = 1;
  
  return (hunk: Hunk) => {
    const {hunkStart, hunkEnd, fileStart, fileEnd} = {
      hunkStart: hunk.newStart,
      hunkEnd: hunk.newStart + hunk.newLines - lineOffset,
      fileStart: foundFile.start - lineOffset,
      fileEnd: foundFile.end + lineOffset
    }

    return hunkStart >= fileStart && hunkEnd <= fileEnd
  }
}
