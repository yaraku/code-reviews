import {expect, test} from '@jest/globals'
import * as json from './fixtures/ZEN-10221.json'
import {getComments} from '../src/getComments'
import {transformOutputToFeedback} from '../src/transformOutputToFeedback'
import {Comment, Feedback} from '../src/types'

test('It transforms JSON output to feedback', () => {
  const files: Feedback[] = transformOutputToFeedback(json.files)

  expect(files).toEqual([
    {
      path: 'app/Services/Language/Rules/LanguageMapper.php',
      feedback: [
        {
          file_path: 'app/Services/Language/Rules/LanguageMapper.php',
          line: 61,
          message:
            'Line exceeds maximum limit of 100 characters; contains 101 characters',
          source_class:
            'PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\Files\\LineLengthSniff.MaxExceeded'
        }
      ]
    },
    {
      path: 'config/locales.php',
      feedback: [
        {
          file_path: 'config/locales.php',
          line: 1,
          message: 'Missing required strict_types declaration',
          source_class:
            'PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\PHP\\RequireStrictTypesSniff.MissingDeclaration'
        }
      ]
    }
  ])
})

test('It extracts comments from ZEN-10221', () => {
  const output: Feedback[] = Object.entries(json.files)
    .filter((file: any[]) => {
      return Object.keys(file[1]).includes('errors')
    })
    .map((file: any[]) => {
      const [path, feedback] = [file[0], file[1]]

      const result: Feedback = {
        path,
        feedback: feedback.errors
      }

      return result
    })

  const comments = getComments(output)

  expect(comments).toEqual([
    {
      path: 'app/Services/Language/Rules/LanguageMapper.php',
      body:
        'Line exceeds maximum limit of 100 characters; contains 101 characters\n' +
        '\n' +
        'Source: PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\Files\\LineLengthSniff.MaxExceeded',
      side: 'RIGHT',
      start_side: 'RIGHT',
      line: 61
    },
    {
      path: 'config/locales.php',
      body:
        'Missing required strict_types declaration\n' +
        '\n' +
        'Source: PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\PHP\\RequireStrictTypesSniff.MissingDeclaration',
      side: 'RIGHT',
      start_side: 'RIGHT',
      line: 1
    }
  ])
})

test('it handles empty JSON', () => {
  const feedback: Feedback[] = transformOutputToFeedback([])
  const comments: Comment[] = getComments(feedback)

  expect(comments).toEqual([])
})
