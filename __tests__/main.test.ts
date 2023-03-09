import {expect, test, describe} from '@jest/globals'
import {filterOutOfContextCode} from '../src/filter-out-of-context-code'
import {getComments} from '../src/get-comments'
import {transformOutputToFeedback} from '../src/transform-output-to-feedback'
import {Comment, Feedback} from '../src/types'

import * as base_formatting_json from './fixtures/base-formatting.json'

/**
 * ZEN PR fixtures
 */
import {diff as ZEN10221_diff} from './fixtures/ZEN-10221.diff'
import * as ZEN10221_json from './fixtures/ZEN-10221.json'
import {diff as ZEN9720_PR680_diff} from './fixtures/ZEN-9720-PR-680.diff'
import * as ZEN9720_PR680_json from './fixtures/ZEN-9720-PR-680.json'
import {diff as ZEN9972_PR896_diff} from './fixtures/ZEN-9972-PR-896.diff'
import * as ZEN9972_PR896_json from './fixtures/ZEN-9972-PR-896.json'
import {diff as ZEN10576_PR1103_diff} from './fixtures/ZEN-10576-PR-1103.diff'
import * as ZEN10576_PR1103_json from './fixtures/ZEN-10576-PR-1103.json'

// test('It transforms JSON output to feedback', () => {
//   const files: Feedback[] = transformOutputToFeedback(ZEN10221_json.files)
//
//   expect(files).toEqual([
//     {
//       path: 'app/Services/Language/Rules/LanguageMapper.php',
//       feedback: [
//         {
//           file_path: 'app/Services/Language/Rules/LanguageMapper.php',
//           line: 25,
//           message:
//             'Line exceeds maximum limit of 100 characters; contains 101 characters',
//           source_class:
//             'PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\Files\\LineLengthSniff.MaxExceeded'
//         },
//         {
//           file_path: 'app/Services/Language/Rules/LanguageMapper.php',
//           line: 61,
//           message:
//             'Line exceeds maximum limit of 100 characters; contains 101 characters',
//           source_class:
//             'PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\Files\\LineLengthSniff.MaxExceeded'
//         }
//       ]
//     },
//     {
//       path: 'config/locales.php',
//       feedback: [
//         {
//           file_path: 'config/locales.php',
//           line: 1,
//           message: 'Missing required strict_types declaration',
//           source_class:
//             'PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\PHP\\RequireStrictTypesSniff.MissingDeclaration'
//         }
//       ]
//     }
//   ])
// })
//
// test('It extracts comments from ZEN-10221', () => {
//   const output: Feedback[] = Object.entries(ZEN10221_json.files)
//     .filter((file: any[]) => {
//       return Object.keys(file[1]).includes('errors')
//     })
//     .map((file: any[]) => {
//       const [path, feedback] = [file[0], file[1]]
//
//       const result: Feedback = {
//         path,
//         feedback: feedback.errors
//       }
//
//       return result
//     })
//
//   const comments = getComments(output)
//
//   expect(comments).toEqual([
//     {
//       path: 'app/Services/Language/Rules/LanguageMapper.php',
//       body:
//         'Line exceeds maximum limit of 100 characters; contains 101 characters\n' +
//         '\n' +
//         'Source: PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\Files\\LineLengthSniff.MaxExceeded',
//       side: 'RIGHT',
//       start_side: 'RIGHT',
//       line: 25
//     },
//     {
//       path: 'app/Services/Language/Rules/LanguageMapper.php',
//       body:
//         'Line exceeds maximum limit of 100 characters; contains 101 characters\n' +
//         '\n' +
//         'Source: PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\Files\\LineLengthSniff.MaxExceeded',
//       side: 'RIGHT',
//       start_side: 'RIGHT',
//       line: 61
//     },
//     {
//       path: 'config/locales.php',
//       body:
//         'Missing required strict_types declaration\n' +
//         '\n' +
//         'Source: PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\PHP\\RequireStrictTypesSniff.MissingDeclaration',
//       side: 'RIGHT',
//       start_side: 'RIGHT',
//       line: 1
//     }
//   ])
// })
//
// test('it handles empty JSON', () => {
//   const feedback: Feedback[] = transformOutputToFeedback([])
//   const comments: Comment[] = getComments(feedback)
//
//   expect(comments).toEqual([])
// })
//
// test('it filters out comments that are present on diffs', () => {
//   const files: Feedback[] = transformOutputToFeedback(ZEN10221_json.files)
//   const feedback: Feedback[] = filterOutOfContextCode(files, ZEN10221_diff)
//   const comments: Comment[] = getComments(feedback)
//
//   expect(comments).toEqual([
//     {
//       path: 'app/Services/Language/Rules/LanguageMapper.php',
//       body:
//         'Line exceeds maximum limit of 100 characters; contains 101 characters\n' +
//         '\n' +
//         'Source: PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\Files\\LineLengthSniff.MaxExceeded',
//       side: 'RIGHT',
//       start_side: 'RIGHT',
//       line: 25
//     }
//   ])
// })
//
// test('it parses git patches properly', () => {
//   const patches = parseGitDiff(ZEN9720_PR680_diff)
//
//   const types = patches.files[0].chunks[0].changes.map(c => c.type)
//
//   expect(types).toEqual([
//     'UnchangedLine',
//     'UnchangedLine',
//     'UnchangedLine',
//     'DeletedLine',
//     'AddedLine',
//     'UnchangedLine',
//     'UnchangedLine',
//     'UnchangedLine',
//     'UnchangedLine',
//     'UnchangedLine',
//     'DeletedLine',
//     'AddedLine',
//     'UnchangedLine',
//     'UnchangedLine',
//     'UnchangedLine'
//   ])
// })
//
// test('it passes review thread line being part of diff regression', () => {
//   const files: Feedback[] = transformOutputToFeedback(ZEN9720_PR680_json.files)
//   const feedback: Feedback[] = filterOutOfContextCode(files, ZEN9720_PR680_diff)
//
//   expect(feedback).toEqual([
//     {
//       feedback: [
//         {
//           file_path: 'tests/Integration/Stripe/StripeApiTestCase.php',
//           line: 142,
//           message: 'Implicit true comparisons prohibited; use === TRUE instead',
//           source_class:
//             'PHP_CodeSniffer\\Standards\\Squiz\\Sniffs\\Operators\\ComparisonOperatorUsageSniff.ImplicitTrue'
//         }
//       ],
//       path: 'tests/Integration/Stripe/StripeApiTestCase.php'
//     }
//   ])
// })
//
// test('it passes ZEN-9972 PR-896 regression', () => {
//   const files: Feedback[] = transformOutputToFeedback(ZEN9972_PR896_json.files)
//   const feedback: Feedback[] = filterOutOfContextCode(files, ZEN9972_PR896_diff)
//
//   expect(feedback).toEqual([
//     {
//       feedback: [
//         {
//           file_path: 'tests/Integration/Users/UserControllerTest.php',
//           line: 334,
//           message:
//             'Line exceeds maximum limit of 100 characters; contains 103 characters',
//           source_class:
//             'PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\Files\\LineLengthSniff.MaxExceeded'
//         }
//       ],
//       path: 'tests/Integration/Users/UserControllerTest.php'
//     }
//   ])
// })

describe('Pull request', () => {
  test('ZEN-10576 PR-1103 passes', () => {
    const files: Feedback[] = transformOutputToFeedback(ZEN10576_PR1103_json.files)
    const feedback: Feedback[] = filterOutOfContextCode(files, ZEN10576_PR1103_diff)

    console.log(feedback);
  })
})

describe('it parses the new Laravel Pint', () => {
  const files: Feedback[] = transformOutputToFeedback(base_formatting_json.files);
  const feedback: Feedback[] = filterOutOfContextCode(files, base_formatting_json.files[0].diff);

  test('and it returns the correct feedback', () => {
    expect(feedback).toEqual([
      {
        feedback: {
          applied_fixers: [
            'visibility_required',
            'blank_line_after_opening_tag'
          ],
          diff: `--- /Users/yamashita/Projects/yaraku/zen/workbench/yaraku/admin/tests/Dictionary/Controllers/CompanyDictionaryControllerTest.php
+++ /Users/yamashita/Projects/yaraku/zen/workbench/yaraku/admin/tests/Dictionary/Controllers/CompanyDictionaryControllerTest.php
@@ -1,5 +1,7 @@
-<?php namespace Yaraku\\Admin\\Tests\\Dictionary\\Controllers;
+<?php
 
+namespace Yaraku\\Admin\\Tests\\Dictionary\\Controllers;
+
 use App\\DBModels;
 use Auth;
 use Tests\\Integration\\Fixtures;
@@ -7,7 +9,7 @@
 
 class CompanyDictionaryControllerTest extends TestCase
 {
-    const BASE_URL = 'admin/company';
+    public const BASE_URL = 'admin/company';
 
     /** @var DBModels\\User */
     private $user;
`,
        },
        path: '/Users/yamashita/Projects/yaraku/zen/workbench/yaraku/admin/tests/Dictionary/Controllers/CompanyDictionaryControllerTest.php'
      }
    ])
  })

  test('and it returns the correct comments', () => {
    const comments = getComments(feedback)
  })
})
