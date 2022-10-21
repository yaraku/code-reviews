import {parseGitPatch} from './parse-git-patch'
import {ECSError, Feedback, Patch} from './types'

export function filterOutOfContextCode(
  feedback: Feedback[],
  diff: string | null
): Feedback[] {
  if (diff === null) {
    return []
  }

  const patches = parseGitPatch(diff)

  const paths = patches.map((patch: Patch) => {
    return patch.added.file
  })

  return feedback
    .filter((fb: Feedback) => {
      return paths.includes(fb.path)
    })
    .map((fb: Feedback) => {
      const filteredErrors: ECSError[] = fb.feedback.filter(
        (error: ECSError) => {
          const foundFile: Patch | undefined = patches.find(
            (patch: Patch) => patch.added.file === error.file_path
          )

          if (foundFile === undefined) {
            return false
          }

          return (
            error.line >= foundFile.added.start &&
            error.line <= foundFile.added.end
          )
        }
      )

      fb.feedback = filteredErrors

      return fb
    })
    .filter((fb: Feedback) => fb.feedback.length > 0)
}
