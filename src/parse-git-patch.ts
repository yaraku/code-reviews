/**
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Sentry and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import {Patch} from './types'

/**
 * TODO: Look into using a package on npm for this
 *
 * gitdiff-parser seems like it would fit our usage the best,
 * but maybe just our simple parsing is good enough here.
 */
export function parseGitPatch(patch: string): Patch[] {
  const lines = patch.split('\n')

  let currentFiles: [string, string]
  let currentPatch: Patch | undefined
  const patches: Patch[] = []

  // Need to parse this line by line
  lines.forEach(line => {
    const matches = line.match(/^diff --git a\/(.*?) b\/(.*)$/m)

    if (matches) {
      currentFiles = [matches[1], matches[2]]
      return
    }

    const patchMatches = line.match(
      /^@@ -(\d+)(?:,|)(\d*) \+(\d+)(?:,|)(\d*) @@/
    )

    if (patchMatches) {
      // push old patch
      if (currentPatch) {
        patches.push(currentPatch)
      }

      currentPatch = {
        removed: {
          file: currentFiles[0],
          start: Number(patchMatches[1]),
          end: Number(patchMatches[1]) + Number(patchMatches[2]),
          lines: []
        },
        added: {
          file: currentFiles[1],
          start: Number(patchMatches[3]),
          end: Number(patchMatches[3]) + Number(patchMatches[4]),
          lines: []
        }
      }
      return
    }

    const contentMatches = line.match(/^(-|\+)(.*)$/)

    if (contentMatches) {
      // This can match `--- a/<file>` and `+++ b/<file>`, so ignore if no `currentPatch` object
      if (!currentPatch) {
        return
      }

      const patchType = contentMatches[1] === '-' ? 'removed' : 'added'
      currentPatch[patchType].lines.push(contentMatches[2])
    }
  })

  if (currentPatch) {
    patches.push(currentPatch)
  }

  return patches
}
