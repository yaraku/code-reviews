import parse, {Chunk} from 'parse-diff'
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

    patch.chunks = chunks

    return patch
  })

  return feedback
    .filter((fb: Feedback) =>
      patches.filter(patch => fb.path?.includes(patch.to ?? ''))
    )
    .map((fb: Feedback) => {
      const foundFile = patches.find(patch => fb.path?.includes(patch.to ?? ''))

      const feedback = parse((fb.feedback as PintError).diff)
        .map(error => {
          if (foundFile === undefined) {
            error.chunks = []
            return error
          }

          for (const chunk of foundFile.chunks) {
            const chunks = error.chunks.filter(errChunk => {
              const errorLines = errChunk.changes
                .map(c => (c.type === 'normal' ? [c.ln1, c.ln2] : [c.ln]))
                .flat()

              if (
                errorLines.some(
                  line =>
                    chunk.newStart <= line &&
                    chunk.newStart + chunk.newLines > line
                )
              ) {
                return true
              }
            })

            error.chunks = chunks

            return error
          }

          error.chunks = []
          return error
        })
        .filter(error => error.chunks.length > 0)

      return feedback.flatMap(f => {
        return f.chunks.map(c => {
          return {
            path: foundFile?.to,
            source_class: c.changes
              .map(ch => ch.content)
              .join('\n')
              .replace('\\n', '\n'),
            lines: [c.newStart, c.newStart + c.newLines],
            message: (fb.feedback as PintError).applied_fixers.join(', ')
          } as unknown as Feedback
        })
      }) as Feedback[]
    })
    .flat()
}
