import {Comment, Feedback} from './types'

export function getComments(feedback: Feedback[]): Comment[] {
  return feedback.map(fb => {
    const error = fb as any

    const lines =
      error.lines[0] === error.lines[1]
        ? {line: error.lines[0]}
        : {start_line: error.lines[0], line: error.lines[1]}

    return {
      body: `Applied fixers: \`${error.message}\`
<details>
  <summary>Diff:</summary>
  \`\`\`diff
${error.source_class}
  \`\`\`
</details>
`,
      side: 'RIGHT',
      start_side: 'RIGHT',
      ...lines,
      path: error.path
    } as Comment
  })
}
