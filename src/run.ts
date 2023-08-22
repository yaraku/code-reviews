import * as Diff from 'diff'
import {Comment, File, PatchDiff} from './types'
import {filterFiles} from './filter-files'
import {normalizeFile} from './normalize-file'
import {parseComment} from './parse-comment'
import {squashHunks} from './squash-hunks'

export function run(j: any, d: any): Comment[] {
  const json: PatchDiff[] = Diff.parsePatch(
    j.files
      .map((file: File): string => {
        return file.diff
      })
      .join('\n')
  )
  const diff: PatchDiff[] = Diff.parsePatch(d)

  const files = diff.map(normalizeFile)

  return json
    .filter(filterFiles(files))
    .map(squashHunks(files))
    .filter((file: PatchDiff) => {
      return file.hunks.length > 0
    })
    .map((file: PatchDiff) => {
      const foundFile = files.find((f: any) =>
        file.newFileName.includes(f.path)
      )

      return [file.hunks.map(parseComment(foundFile))].flat()
    })
    .flat()
}
