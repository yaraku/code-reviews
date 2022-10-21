export type ECSError = {
  message: string
  line: number
  file_path: string
  source_class: string
}

export type ECSDiff = {
  diff: string
  applied_checkers: string[]
}

export type Comment = {
  path: string
  body: string
  side: string
  start_side: string
  line: number
}

export type Feedback = {
  path: string
  feedback: ECSError[]
}

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
type PatchObj = {
  /**
   * File where this patch occurs
   */
  file: string

  /**
   * Starting line number of patch
   */
  start: number

  /**
   * Ending line number of patch
   */
  end: number

  /**
   * The patch contents
   */
  lines: string[]
}

export type Patch = {
  removed: PatchObj
  added: PatchObj
}
