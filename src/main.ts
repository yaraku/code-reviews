import * as core from '@actions/core'
import * as github from '@actions/github'
import {Comment} from './types'
import {run as runFunc} from './run'

export async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    // API: https://actions-cool.github.io/octokit-rest/
    const octokit = github.getOctokit(token)

    const context = github.context

    const {owner, repo} = context.repo
    const pull_number = context.payload.pull_request?.number ?? 1136

    if (pull_number === -1) {
      throw new Error('Invalid PR number')
    }

    // This is the output of the Laravel Pint command
    //
    //  --test - meaning no changes
    //  --preset=psr12 - meaning PSR12 preset
    //  -v - meaning verbose so that we can get the diff as well
    //  --format=json - meaning we want the output in JSON format
    //
    // ./vendor/bin/pint $1
    //    --test
    //    --preset=psr12
    //    -v
    //    --format=json
    const json = JSON.parse(core.getInput('json_output'))

    if (json.files.length === 0) {
      await octokit.rest.pulls.createReview({
        owner,
        repo,
        pull_number,
        event: 'APPROVE'
      })
    }

    const {data} = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number,
      headers: {
        accept: 'application/vnd.github.v3.diff'
      }
    })

    const comments: Comment[] = runFunc(
      json.files.map((f: any) => f.diff).join('\n'),
      data as unknown as string
    )

    core.info(JSON.stringify(comments))

    if (comments.length > 0) {
      // Create review
      core.info(
        JSON.stringify({
          owner,
          repo,
          pull_number,
          event: 'REQUEST_CHANGES',
          comments
        })
      )

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
