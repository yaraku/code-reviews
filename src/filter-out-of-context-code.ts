import {ECSError, Feedback} from './types'
import gitDiffParser, {File, Hunk} from 'gitdiff-parser'

export function filterOutOfContextCode(
  feedback: Feedback[],
  diff: string | null
): Feedback[] {
  if (diff === null) {
    return []
  }

  const files = gitDiffParser.parse(diff)

  const paths = files
    .map((file: File) => {
      return file.newPath !== file.oldPath
        ? [file.newPath, file.oldPath]
        : [file.newPath]
    })
    .flat(1)
    .filter((path: string) => path !== '/dev/null')

  return feedback
    .filter((fb: Feedback) => {
      return paths.includes(fb.path)
    })
    .map((fb: Feedback) => {
      const filteredErrors: ECSError[] = fb.feedback.filter(
        (error: ECSError) => {
          const foundFile = files.find(
            (file: File) => file.newPath === error.file_path
          )

          return (
            (
              foundFile?.hunks.filter((hunk: Hunk) => {
                return (
                  error.line >= hunk.newStart &&
                  error.line <= hunk.newStart + hunk.newLines
                )
              }) ?? []
            ).length > 0
          )
        }
      )

      fb.feedback = filteredErrors

      return fb
    })
    .filter((fb: Feedback) => fb.feedback.length > 0)
}
