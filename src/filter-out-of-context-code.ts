import parse, { Chunk } from 'parse-diff'
import {Feedback, PintError} from './types'

export function filterOutOfContextCode(
  feedback: Feedback[],
  diff: string | null
): Feedback[] {
  if (diff === null) {
    return []
  }

  const patches = parse(diff).map(patch => {
    const chunks: Chunk[] = patch.chunks.filter(chunk => {
      const unique = chunk.changes
          .map(change => change.type)
          .filter((type, i, arr) => arr.indexOf(type) === i)

      if (unique.length === 1 && unique[0] === 'del') {
        return false
      }

      return true
    })

    patch.chunks = chunks;

    return patch
  })

  const fudback = feedback
    .filter((fb: Feedback) => patches.some(patch => patch.to === fb.path))
    .map((fb: Feedback) => {
      const feedback = parse((fb.feedback as PintError).diff).filter((error) => {
        const foundFile = patches.find(patch => patch.to === fb.path)

        if (foundFile === undefined) {
          return false
        }

        for (const chunk of foundFile.chunks) {
          for (const errChunk of error.chunks) {
            if (errChunk.newStart <= chunk.newStart && errChunk.newStart + errChunk.newLines > chunk.newStart) {
              return true
            }
          }
        }

        return false
      })

      return feedback.flatMap(f => {
        return f.chunks.map(c => {
          return {
            path: f.to,
            source_class: c.changes.map(ch => ch.content).join("\n").replace("\\n", "\n"),
            lines: [c.newStart, c.newStart + c.newLines],
            message: (fb.feedback as PintError).applied_fixers.join(', '),
          } as unknown as Feedback
        })
      }) as Feedback[]
    }).flat()

  return fudback
}
