import parse from 'parse-diff'
import {Feedback} from './types'

export function filterOutOfContextCode(
  feedback: Feedback[],
  diff: string | null
): Feedback[] {
  if (diff === null) {
    return []
  }

  const patches = parse(diff)

  // console.log(parse(diff)[0].chunks[0].changes)
  //
  // console.log(patches[0].chunks)

  patches.map(patch => {
    return patch.chunks.map(chunk => {
      console.log(
        chunk.changes
          .map(change => change.type)
          .filter((type, i, arr) => arr.indexOf(type) === i)
      )
      // console.log(chunk.changes)
    })
  })

  return feedback

  // const files = patches.files.filter(file => {
  //   const isChangedFile = (x: unknown): x is ChangedFile => true
  //   const isAddedFile = (x: unknown): x is AddedFile => true
  //   const isDeletedFile = (x: unknown): x is DeletedFile => true
  //
  //   return isChangedFile(file) || isAddedFile(file) || isDeletedFile(file)
  // })
  //
  // const paths = files.map(file => {
  //   return (file as ChangedFile | AddedFile | DeletedFile).path
  // })
  //
  // return feedback
  //   .filter((fb: Feedback) => {
  //     return paths.includes(fb.path)
  //   })
  //   .map((fb: Feedback) => {
  //     const filteredErrors: ECSError[] = fb.feedback.filter(
  //       (error: ECSError) => {
  //         const foundFile = files.find(
  //           file =>
  //             (file as ChangedFile | AddedFile | DeletedFile).path ===
  //             error.file_path
  //         )
  //
  //         if (foundFile === undefined) {
  //           return false
  //         }
  //
  //         for (const chunk of foundFile.chunks) {
  //           if (chunkIsInRange(chunk.toFileRange, error.line)) {
  //             for (const change of chunk.changes) {
  //               if (change.type === 'DeletedLine') {
  //                 continue
  //               }
  //
  //               const c = change as UnchangedLine
  //               const line = c?.lineBefore ?? c?.lineAfter
  //
  //               if (error.line === line) {
  //                 return true
  //               }
  //             }
  //           }
  //         }
  //
  //         return false
  //       }
  //     )
  //
  //     fb.feedback = filteredErrors
  //
  //     return fb
  //   })
  //   .filter((fb: Feedback) => fb.feedback.length > 0)
}

// function chunkIsInRange(lineRange: ChunkRange, line: Number): boolean {
//   return lineRange.start <= line && lineRange.start + lineRange.lines > line
// }
