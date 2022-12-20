import parseGitDiff from 'parse-git-diff'
import {
  AddedFile,
  ChangedFile,
  ChunkRange,
  DeletedFile,
  UnchangedLine
} from 'parse-git-diff/build/types'
import {ECSError, Feedback} from './types'

export function filterOutOfContextCode(
  feedback: Feedback[],
  diff: string | null
): Feedback[] {
  if (diff === null) {
    return []
  }

  const patches = parseGitDiff(diff)

  const files = patches.files.filter(file => {
    const isChangedFile = (x: unknown): x is ChangedFile => true
    const isAddedFile = (x: unknown): x is AddedFile => true
    const isDeletedFile = (x: unknown): x is DeletedFile => true

    return isChangedFile(file) || isAddedFile(file) || isDeletedFile(file)
  })

  const paths = files.map(file => {
    return (file as ChangedFile | AddedFile | DeletedFile).path
  })

  return feedback
    .filter((fb: Feedback) => {
      return paths.includes(fb.path)
    })
    .map((fb: Feedback) => {
      const filteredErrors: ECSError[] = fb.feedback.filter(
        (error: ECSError) => {
          const foundFile = files.find(
            file =>
              (file as ChangedFile | AddedFile | DeletedFile).path ===
              error.file_path
          )

          if (foundFile === undefined) {
            return false
          }

          for (const chunk of foundFile.chunks) {
            if (chunkIsInRange(chunk.toFileRange, error.line)) {
              for (const change of chunk.changes) {
                if (change.type === 'DeletedLine') {
                  continue
                }

                const c = change as UnchangedLine
                const line = c?.lineBefore ?? c?.lineAfter

                if (error.line === line) {
                  return true
                }
              }
            }
          }

          return false
        }
      )

      fb.feedback = filteredErrors

      return fb
    })
    .filter((fb: Feedback) => fb.feedback.length > 0)
}

function chunkIsInRange(lineRange: ChunkRange, line: Number): boolean {
  return lineRange.start <= line && lineRange.start + lineRange.lines > line
}
