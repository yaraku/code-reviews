import * as core from '@actions/core'
import * as github from '@actions/github'
import { parseComment } from './parse-comment'
import { Comment } from './types'
const Diff = require('diff')

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    // API: https://actions-cool.github.io/octokit-rest/
    const octokit = github.getOctokit(token)

    const context = github.context

    const {owner, repo} = context.repo
    const pull_number = context.payload.pull_request?.number ?? 0

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

    if (core.getInput('json_output') === '{"files":[],"time":{"total":0},"memory":0}'
    || json.files.length === 0) {
      await octokit.rest.pulls.createReview({
        owner,
        repo,
        pull_number,
        event: 'APPROVE'
      })

      return
    }

    const {data} = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number,
      headers: {
        accept: 'application/vnd.github.v3.diff'
      }
    })

    json = Diff.parsePatch(json.files.map((f: any) => f.diff).join('\n'))
    const diff = Diff.parsePatch(data as unknown as string)
  
    // These are the files that are in the PR
    const files = diff.map((d:any) => {
      const lines = d.hunks.map((h:any) =>
        [h.newStart, h.newStart + h.newLines - 1]
      ).flat()

      return {
        path: d.newFileName.split(/^b\//)[1],
        start: lines[0],
        end: lines[1]
      }
    })
  
    const comments: Comment[] = json.filter((file: any) => {
      return files.find((f:any) => file.newFileName.includes(f.path)) !== undefined
    }).map((file: any) => {
      const foundFile = files.find((f:any) => file.newFileName.includes(f.path))
      const { hunks } = file
  
      file.hunks = hunks.filter((h:any) => {
        const { start, end } = {start: h.newStart, end: h.newStart + h.newLines - 1}
  
        return (start - foundFile.start >= 0 || end - foundFile.start >= 0) || (foundFile.end - end >= 0 || foundFile.end - start >= 0)
      })
  
      return file
    }).filter((file: any) => file.hunks.length > 0)
    .map((file: any) => {
      const foundFile = files.find((f:any) => file.newFileName.includes(f.path))
  
      return [
        file.hunks.map(parseComment(foundFile))
      ].flat()
    }).flat()

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
    if (error instanceof Error) core.setFailed(error)
  }
}

run()
