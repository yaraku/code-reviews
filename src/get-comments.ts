import {Comment, Feedback} from './types'
import parse from 'parse-diff'

export function getComments(feedback: Feedback[]): Comment[] {
  const comments: Comment[] = []

  // feedback.filter((value: Feedback) => {
  //   console.log(parse(value.feedback.diff)[0].chunks[0])
  // })
  // for (const value of feedback) {
  //   const c: Comment[] = value.feedback
  //     .filter((a: ECSError, index: number, self: ECSError[]) => {
  //       return (
  //         index ===
  //         self.findIndex(
  //           (b: ECSError) => a.message === b.message && a.line === b.line
  //         )
  //       )
  //     })
  //     .map((error: ECSError) => {
  //       const comment: Comment = {
  //         path: error.file_path,
  //         body: `${error.message}\n\nSource: ${error.source_class}`,
  //         side: 'RIGHT',
  //         start_side: 'RIGHT',
  //         line: error.line
  //       }
  //
  //       return comment
  //     })
  //
  //   comments.push(...c)
  // }

  return comments
}
