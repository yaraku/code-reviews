import {Hunk, PatchDiff} from './types'
const Diff = require('diff')

export function squashHunks(files: any) {
  return (file: PatchDiff) => {
    const foundFile = files.find((f: any) => file.newFileName.includes(f.path))
    const {hunks} = file

    file.hunks = hunks.filter(filterHunks(foundFile))

    return file
  }
}

function filterHunks(foundFile: any) {
  return (hunk: Hunk) => {
    const {hunkStart, hunkEnd, fileStart, fileEnd} = {
      hunkStart: hunk.newStart,
      hunkEnd: hunk.newStart + hunk.newLines - 1,
      fileStart: foundFile.start,
      fileEnd: foundFile.end
    }

    return hunkStart >= fileStart && hunkEnd <= fileEnd
  }
}
