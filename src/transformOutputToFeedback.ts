import {Feedback} from './types'

export function transformOutputToFeedback(outputs: any): Feedback[] {
  const result: Feedback[] = Object.entries(outputs)
    .filter((file: any[]) => {
      return Object.keys(file[1]).includes('errors')
    })
    .map((file: any[]) => {
      const [path, feedback] = [file[0], file[1]]

      const res: Feedback = {
        path,
        feedback: feedback.errors
      }

      return res
    })

  return result
}
