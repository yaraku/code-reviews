import {Feedback, PintError} from './types'

export function transformOutputToFeedback(outputs: any): Feedback[] {
  return Object.entries(outputs).map((file: any[]) => {
    const [path, feedback] = [file[1].name, file[1]]

    const errors: PintError = {
      diff: feedback.diff,
      applied_fixers: feedback.appliedFixers
    }

    return {
      path,
      feedback: errors
    } as Feedback
  })
}
