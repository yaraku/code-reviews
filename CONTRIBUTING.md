# Welcome to PR Code Reviews contribution guide

## Getting started

The most common error that you'll encounter is the `Error: Unprocessable Entity: "Pull request review thread line must be part of the diff and Pull request review thread diff hunk can't be blank"`. This means that the action tried to create a code review comment on a line that has not been modified or that does not exist anymore. To reproduce this we go to the PR in question and get two things; the PR diff and the json outputted from the style fixer.

1. To get the diff for the PR we just append .diff to the PR url. E.g `https://github.com/yaraku/zen/pull/123` becomes `https://github.com/yaraku/zen/pull/123.diff`.
2. The json output can be found in the Code Styling logs at the bottom of the PR.
    ![Code Styling logs](/screenshots/step_2.png)
    ![Code Styling logs](/screenshots/step_2_a.png)
    * We click on `Details` to the right of the failed job.
    * Press the cogwheel icon and click on `View raw logs`.
    * Head straight to the bottom and work your way up until you start seeing the JSON. It will look like this:
      ```
      {
        "line": 123,
        "file_path": "app/Http/Controllers/Controller.php",
        "message": "Operator ! prohibited; use === FALSE instead",
        "source_class": "PHP_CodeSniffer\\Standards\\Squiz\\Sniffs\\Operators\\ComparisonOperatorUsageSniff.NotAllowed"
      },
      ```
    * What we are looking for is the `files`-part of the JSON, be sure to only copy that part. What you'll end up with is something like this:
      ```
      {
        "files": {
          "app/Http/Controllers/Controller.php": {
            "errors": [
              {
                "line": 123,
                "file_path": "app/Http/Controllers/Controller.php",
                "message": "Operator ! prohibited; use === FALSE instead",
                "source_class": "PHP_CodeSniffer\\Standards\\Squiz\\Sniffs\\Operators\\ComparisonOperatorUsageSniff.NotAllowed"
              },
              [...] // Other errors
            ],
          },
        }
      }
      ```
3. Now that we have the diff and the json we can start writing our regression test. We start by creating two files in the `__tests__/fixtures/` directory. These two files are the json and diff files respectively and the filename should preferrebly be `ZEN-XXXX-PR-XXX.json` and `ZEN-XXXX-PR-XXX.diff.ts`. For the json file we can just go ahead and paste it as is. For the diff we need to add an export in the file. We do this by adding the following to the file:
    ```
    export const diff = `<diff_content_here>`
    ```
4. Now we can move on to writing the test. Open up `__tests__/main.test.ts` and include the diff and json.
    ```
    import {diff as ZENXXXX_PRXXX_diff} from './fixtures/ZEN-XXXX-PR-XXX.diff'
    import * as ZENXXXX_PRXXX_json from './fixtures/ZEN-XXXX-PR-XXX.json'
    ```
    * Add a new test at the bottom of the file, describing your test, and adding the regression files and assertions.
        ```
        test('it passes ZEN-XXXX PR-XXX regression', () => {
          const files: Feedback[] = transformOutputToFeedback(ZENXXXX_PRXXX_json.files)
          const feedback: Feedback[] = filterOutOfContextCode(files, ZENXXXX_PRXXX_diff)
        
          expect(feedback).toEqual([
            {
              feedback: [
                // Adjust assertion so that we have a pass condition
                // {
                //   file_path: "app/Http/Controllers/Controller.php",
                //   line: 123,
                //   message:
                //     'Line exceeds maximum limit of 100 characters; contains 103 characters',
                //   source_class:
                //     'PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\Files\\LineLengthSniff.MaxExceeded'
                // }
              ],
              path: "app/Http/Controllers/Controller.php"
            }
          ])
        })
        ```
5. Here is where we start our investigative work. `feedback` will contain the feedback that will be used when the code reviews are made. It can be helpful to have a look at the changes in the PR when doing this. The error stems from the action trying to comment on a line of code that is not visible in the `Files changed` tab you can find in the PR. This means that if you have the following diff, then the action will fail since our suggested code review wants to add a comment on line `123`. (Assuming this diff, for example, starts at line `50`)
    ```diff
    public function edit()
    {
    -   return response('Hello');
    +   return response('Hello World');
    }
    ```
    * The error will not be as straigtforward as this, since there are safeguards against this type of issue, but hopefully it helps get an understanding of what type of bugs might pop up.
