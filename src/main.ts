import * as core from '@actions/core'
import * as github from '@actions/github'
import { Feedback } from './types'
import { getComments } from './getComments'
import { transformOutputToFeedback } from './transformOutputToFeedback'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    // API: https://actions-cool.github.io/octokit-rest/
    const octokit = github.getOctokit(token)

    const context = github.context

    const {owner, repo} = context.repo
    const prNumber = context.payload.pull_request?.number ?? -1

    if (prNumber === -1) {
      throw new Error('Invalid PR number')
    }

    const json = JSON.parse(core.getInput('json_output'))

    if (json.totals.errors === 0) {
      await octokit.rest.pulls.createReview({
        owner,
        repo,
        pull_number: prNumber,
        event: 'APPROVE'
      })
    }

    const files: Array<ECSOutput> = json.files || []

    const comments = []
    const diffs = []

    for (const [file_path, value] of Object.entries(files)) {
      const errors = (value.errors || [])
        .filter((val, index: any, self: any[]) => {
          return (
            index ===
            self.findIndex(obj => {
              return obj.message === val.message && obj.line === val.line
            })
          )
        })
        .map(error => {
          return {
            path: error.file_path,
            body: `${error.message}\n\nSource: ${error.source_class}`,
            line: error.line
          }
        })

      comments.push(...errors)
    }

    if (comments.length > 0) {
      // Create review
      await octokit.rest.pulls.createReview({
        owner,
        repo,
        pull_number: prNumber,
        event: 'REQUEST_CHANGES',
        comments: comments
      })
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
