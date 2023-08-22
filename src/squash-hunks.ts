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
    const { startA, endA, startB, endB } = {
      startA: hunk.newStart,
      endA: hunk.newStart + hunk.newLines - 1,
      startB: foundFile.start,
      endB: foundFile.end
    }

    return startB >= startA && endB <= endA
  }
}
