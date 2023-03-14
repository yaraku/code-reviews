import {Comment, Feedback} from './types'

export function getComments(feedback: Feedback[]): Comment[] {
  return feedback.map(fb => {
    const error = fb as any

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
      line: error.lines[1],
      path: error.path
    } as Comment
  })
}
