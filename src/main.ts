import * as core from '@actions/core'
import * as github from '@actions/github'
import {exec} from '@actions/exec'
import {Feedback} from './types'
import {getComments} from './get-comments'
import {transformOutputToFeedback} from './transform-output-to-feedback'
import {filterOutOfContextCode} from './filter-out-of-context-code'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    // API: https://actions-cool.github.io/octokit-rest/
    const octokit = github.getOctokit(token)

    const context = github.context

    const {owner, repo} = context.repo
    const pull_number = context.payload.pull_request?.number ?? -1

    if (pull_number === -1) {
      throw new Error('Invalid PR number')
    }

    const json = JSON.parse(core.getInput('json_output'))

    if (json.totals.errors === 0) {
      await octokit.rest.pulls.createReview({
        owner,
        repo,
        pull_number,
        event: 'APPROVE'
      })
    }

    let gitDiff = ''
    let gitDiffError = ''

    try {
      await exec('git', ['diff', '-U0', '--color=never'], {
        listeners: {
          stdout: (data: Buffer) => {
            gitDiff += data.toString()
          },
          stderr: (data: Buffer) => {
            gitDiffError += data.toString()
          }
        }
      })
    } catch (error) {
      if (error instanceof Error) core.setFailed(error.message)
    }

    if (gitDiffError) {
      core.setFailed(gitDiffError)
    }

    const files: Feedback[] = transformOutputToFeedback(json.files)
    const comments = getComments(filterOutOfContextCode(files, gitDiff))

    if (comments.length > 0) {
      // Create review
      await octokit.rest.pulls.createReview({
        owner,
        repo,
        pull_number,
        event: 'REQUEST_CHANGES',
        comments
      })
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
