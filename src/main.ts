import * as core from '@actions/core'
import * as github from '@actions/github'

type PRComment = {
  path: string,
  line: number,
  start_line?: number,
  body: string,
}

type ECSError = {
  message: string,
  line: number,
  file_path: string,
  source_class: string,
};

type ECSDiff = {
  diff: string,
  applied_checkers: Array<string>,
};

type ECSOutput = {
  errors: Array<ECSError>,
  diffs: Array<ECSDiff>,
};

async function run(): Promise<void> {
  try {
    const token = core.getInput('token');
    // API: https://actions-cool.github.io/octokit-rest/
    const octokit = github.getOctokit(token);

    const context = github.context;

    const { owner, repo } = context.repo;
    const prNumber = context.payload.pull_request?.number ?? -1;

    if (prNumber === -1) {
      throw new Error('Invalid PR number');
    }

    const json = JSON.parse(core.getInput('json_output'));

    if (json.totals.errors === 0) {
      await octokit.rest.pulls.createReview({
        owner,
        repo,
        pull_number: prNumber,
        event: 'APPROVE',
      });
    }

    const files: Array<ECSOutput> = json.files || [];

    const comments = [];
    const diffs = [];

    for (const [file_path, value] of Object.entries(files)) {
      const errors = (value.errors || [])
        .filter((val, index: any, self: any[]) => {
          return (
            index ===
            self.findIndex(obj => {
              return obj.message === val.message && obj.line === val.line;
            })
          );
        })
        .map((error) => {
          return {
            path: error.file_path,
            body: `${error.message}\n\nSource: ${error.source_class}`,
            line: error.line,
          };
        });

      const fileCheckers = (value.diffs || [])
        .map((val) => {
          return val.applied_checkers;
        })

      diffs.push({ path: file_path, checkers: [...fileCheckers] });
      comments.push(...errors);
    }

    if (diffs.length > 0) {
      let body = `Hi there 👋

Your code has been automatically adjusted.

Make sure to do a \`git pull\` to synchronize your local branch, and make sure that no errors were generated by the automatic changes.

Take note of any manual adjustments that might need to be done at the bottom of this comment.

[You can read more about this automated process in the docs](https://ydocs.intranet.yarakuzen.com/style_standards/php.html#automated-code-styling).
`;

      if (diffs.length > 0) {
        body += diffs.map((diff) => {
          return `\`${diff.path}\`:
\`\`\`
${diff.checkers.join(`
`).split(/\,/).sort().join(`
`)}
\`\`\`
`;
        }).join(`
`);
      }

      await octokit.rest.pulls.createReview({
        owner,
        repo,
        pull_number: prNumber,
        event: 'COMMENT',
        body: body,
      });
    }

    if (comments.length > 0) {
      // Create review
      await octokit.rest.pulls.createReview({
        owner,
        repo,
        pull_number: prNumber,
        event: 'REQUEST_CHANGES',
        comments: comments,
      });
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
