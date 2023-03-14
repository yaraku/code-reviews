import {expect, test, describe} from '@jest/globals'
import {filterOutOfContextCode} from '../src/filter-out-of-context-code'
import {getComments} from '../src/get-comments'
import {transformOutputToFeedback} from '../src/transform-output-to-feedback'
import {Comment, ECSError, Feedback} from '../src/types'

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

describe('It correctly parses Pull Requests', () => {
  describe('ZEN-10221 PR 640', () => {
    const files: Feedback[] = transformOutputToFeedback(ZEN10221_json.files)
    const feedback: Feedback[] = filterOutOfContextCode(files, ZEN10221_diff)

    test('Files', () => {
      expect(files).toEqual([
        {
          feedback: {
            applied_fixers: [
              'concat_space',
              'trailing_comma_in_multiline',
              'blank_line_before_statement'
            ],
            diff: `--- app/Services/Language/Rules/LanguageMapper.php
+++ app/Services/Language/Rules/LanguageMapper.php
@@ -50,6 +50,7 @@
                 return new Thai();
             default:
                 $this->logRuleSetNotFoundError($language);
+
                 return new English();
         }
     }
@@ -58,10 +59,10 @@
     {
         Log::warning(
             self::class
-            . '::getLanguageSpecificGetter could not find an rule set for given the given language. '
-            . 'Used the fallback ruleset (English).',
+            .'::getLanguageSpecificGetter could not find an rule set for given the given language. '
+            .'Used the fallback ruleset (English).',
             [
-                'language' => $language->id
+                'language' => $language->id,
             ]
         );
     }
`
          },
          path: 'app/Services/Language/Rules/LanguageMapper.php'
        },
        {
          feedback: {
            applied_fixers: ['phpdoc_separation'],
            diff: `--- app/Services/Segment/Segmentation/Sentence/SentenceSegmenterStrategy.php
+++ app/Services/Segment/Segmentation/Sentence/SentenceSegmenterStrategy.php
@@ -17,6 +17,7 @@
 
     /**
      * @return string[]
+     *
      * @throws Exception
      */
     public function getSentences(
`
          },
          path: 'app/Services/Segment/Segmentation/Sentence/SentenceSegmenterStrategy.php'
        },
        {
          feedback: {
            applied_fixers: ['phpdoc_separation'],
            diff: `--- app/Services/Segment/Segmentation/Sentence/SubsegmenterStrategy.php
+++ app/Services/Segment/Segmentation/Sentence/SubsegmenterStrategy.php
@@ -15,6 +15,7 @@
 
     /**
      * @return array[]
+     *
      * @throws Exceptions\\TextLanguageUnsupportedException
      */
     public function getSubsegments(array $sentences): array
`
          },
          path: 'app/Services/Segment/Segmentation/Sentence/SubsegmenterStrategy.php'
        },
        {
          feedback: {
            applied_fixers: [
              'class_definition',
              'braces',
              'trailing_comma_in_multiline'
            ],
            diff: `--- database/migrations/2022_10_17_062901_insert_finnish_into_language_table.php
+++ database/migrations/2022_10_17_062901_insert_finnish_into_language_table.php
@@ -13,7 +13,7 @@
         DB::table('languages')
             ->insert([
                 'id' => self::LANGUAGE_CODE,
-                'type' => 'word'
+                'type' => 'word',
             ]);
     }
 
`
          },
          path: 'database/migrations/2022_10_17_062901_insert_finnish_into_language_table.php'
        },
        {
          feedback: {
            applied_fixers: [
              'class_definition',
              'braces',
              'curly_braces_position',
              'trailing_comma_in_multiline'
            ],
            diff: `--- database/migrations/2022_10_17_063101_insert_finnish_into_machine_translation_engine_language_pairs_table.php
+++ database/migrations/2022_10_17_063101_insert_finnish_into_machine_translation_engine_language_pairs_table.php
@@ -8,7 +8,7 @@
 {
     /** @var array */
     private const ENGINE_TYPES = [
-        'google', 'microsoft', 'deepL', 'yaraku'
+        'google', 'microsoft', 'deepL', 'yaraku',
     ];
 
     /** @var string */
@@ -19,7 +19,7 @@
         'google' => [],
         'microsoft' => ['tl'],
         'deepL' => ['ar', 'bn', 'hi', 'ko', 'mn', 'ms', 'my', 'ne', 'th', 'tl', 'vi', 'zh_Hant'],
-        'yaraku' => []
+        'yaraku' => [],
     ];
 
     public function up(): void
@@ -42,12 +42,12 @@
                 $languagePairs[] = [
                     'sourceLanguage_id' => self::FINNISH,
                     'targetLanguage_id' => $language,
-                    'machineTranslationEngine_id' => $engineId
+                    'machineTranslationEngine_id' => $engineId,
                 ];
                 $languagePairs[] = [
                     'sourceLanguage_id' => $language,
                     'targetLanguage_id' => self::FINNISH,
-                    'machineTranslationEngine_id' => $engineId
+                    'machineTranslationEngine_id' => $engineId,
                 ];
             }
         }
`
          },
          path: 'database/migrations/2022_10_17_063101_insert_finnish_into_machine_translation_engine_language_pairs_table.php'
        }
      ])
    })
    test('Feedback', () => {
      expect(feedback).toEqual([
        {
          path: 'database/migrations/2022_10_17_062901_insert_finnish_into_language_table.php',
          source_class:
            "         DB::table('languages')\n" +
            '             ->insert([\n' +
            "                 'id' => self::LANGUAGE_CODE,\n" +
            "-                'type' => 'word'\n" +
            "+                'type' => 'word',\n" +
            '             ]);\n' +
            '     }\n' +
            ' ',
          lines: [13, 20],
          message: 'class_definition, braces, trailing_comma_in_multiline'
        },
        {
          path: 'database/migrations/2022_10_17_063101_insert_finnish_into_machine_translation_engine_language_pairs_table.php',
          source_class:
            ' {\n' +
            '     /** @var array */\n' +
            '     private const ENGINE_TYPES = [\n' +
            "-        'google', 'microsoft', 'deepL', 'yaraku'\n" +
            "+        'google', 'microsoft', 'deepL', 'yaraku',\n" +
            '     ];\n' +
            ' \n' +
            '     /** @var string */',
          lines: [8, 15],
          message:
            'class_definition, braces, curly_braces_position, trailing_comma_in_multiline'
        },
        {
          path: 'database/migrations/2022_10_17_063101_insert_finnish_into_machine_translation_engine_language_pairs_table.php',
          source_class:
            "         'google' => [],\n" +
            "         'microsoft' => ['tl'],\n" +
            "         'deepL' => ['ar', 'bn', 'hi', 'ko', 'mn', 'ms', 'my', 'ne', 'th', 'tl', 'vi', 'zh_Hant'],\n" +
            "-        'yaraku' => []\n" +
            "+        'yaraku' => [],\n" +
            '     ];\n' +
            ' \n' +
            '     public function up(): void',
          lines: [19, 26],
          message:
            'class_definition, braces, curly_braces_position, trailing_comma_in_multiline'
        },
        {
          path: 'database/migrations/2022_10_17_063101_insert_finnish_into_machine_translation_engine_language_pairs_table.php',
          source_class:
            '                 $languagePairs[] = [\n' +
            "                     'sourceLanguage_id' => self::FINNISH,\n" +
            "                     'targetLanguage_id' => $language,\n" +
            "-                    'machineTranslationEngine_id' => $engineId\n" +
            "+                    'machineTranslationEngine_id' => $engineId,\n" +
            '                 ];\n' +
            '                 $languagePairs[] = [\n' +
            "                     'sourceLanguage_id' => $language,\n" +
            "                     'targetLanguage_id' => self::FINNISH,\n" +
            "-                    'machineTranslationEngine_id' => $engineId\n" +
            "+                    'machineTranslationEngine_id' => $engineId,\n" +
            '                 ];\n' +
            '             }\n' +
            '         }',
          lines: [42, 54],
          message:
            'class_definition, braces, curly_braces_position, trailing_comma_in_multiline'
        }
      ])
    })
    test('Comments', () => {
      const comments = getComments(feedback)

      expect(comments).toEqual([
        {
          body:
            'Applied fixers: `class_definition, braces, trailing_comma_in_multiline`\n' +
            '<details>\n' +
            '  <summary>Diff:</summary>\n' +
            '  ```diff\n' +
            "         DB::table('languages')\n" +
            '             ->insert([\n' +
            "                 'id' => self::LANGUAGE_CODE,\n" +
            "-                'type' => 'word'\n" +
            "+                'type' => 'word',\n" +
            '             ]);\n' +
            '     }\n' +
            ' \n' +
            '  ```\n' +
            '</details>\n',
          side: 'RIGHT',
          start_side: 'RIGHT',
          // start_line: 13,
          line: 20,
          path: 'database/migrations/2022_10_17_062901_insert_finnish_into_language_table.php'
        },
        {
          body:
            'Applied fixers: `class_definition, braces, curly_braces_position, trailing_comma_in_multiline`\n' +
            '<details>\n' +
            '  <summary>Diff:</summary>\n' +
            '  ```diff\n' +
            ' {\n' +
            '     /** @var array */\n' +
            '     private const ENGINE_TYPES = [\n' +
            "-        'google', 'microsoft', 'deepL', 'yaraku'\n" +
            "+        'google', 'microsoft', 'deepL', 'yaraku',\n" +
            '     ];\n' +
            ' \n' +
            '     /** @var string */\n' +
            '  ```\n' +
            '</details>\n',
          side: 'RIGHT',
          start_side: 'RIGHT',
          // start_line: 8,
          line: 15,
          path: 'database/migrations/2022_10_17_063101_insert_finnish_into_machine_translation_engine_language_pairs_table.php'
        },
        {
          body:
            'Applied fixers: `class_definition, braces, curly_braces_position, trailing_comma_in_multiline`\n' +
            '<details>\n' +
            '  <summary>Diff:</summary>\n' +
            '  ```diff\n' +
            "         'google' => [],\n" +
            "         'microsoft' => ['tl'],\n" +
            "         'deepL' => ['ar', 'bn', 'hi', 'ko', 'mn', 'ms', 'my', 'ne', 'th', 'tl', 'vi', 'zh_Hant'],\n" +
            "-        'yaraku' => []\n" +
            "+        'yaraku' => [],\n" +
            '     ];\n' +
            ' \n' +
            '     public function up(): void\n' +
            '  ```\n' +
            '</details>\n',
          side: 'RIGHT',
          start_side: 'RIGHT',
          // start_line: 19,
          line: 26,
          path: 'database/migrations/2022_10_17_063101_insert_finnish_into_machine_translation_engine_language_pairs_table.php'
        },
        {
          body:
            'Applied fixers: `class_definition, braces, curly_braces_position, trailing_comma_in_multiline`\n' +
            '<details>\n' +
            '  <summary>Diff:</summary>\n' +
            '  ```diff\n' +
            '                 $languagePairs[] = [\n' +
            "                     'sourceLanguage_id' => self::FINNISH,\n" +
            "                     'targetLanguage_id' => $language,\n" +
            "-                    'machineTranslationEngine_id' => $engineId\n" +
            "+                    'machineTranslationEngine_id' => $engineId,\n" +
            '                 ];\n' +
            '                 $languagePairs[] = [\n' +
            "                     'sourceLanguage_id' => $language,\n" +
            "                     'targetLanguage_id' => self::FINNISH,\n" +
            "-                    'machineTranslationEngine_id' => $engineId\n" +
            "+                    'machineTranslationEngine_id' => $engineId,\n" +
            '                 ];\n' +
            '             }\n' +
            '         }\n' +
            '  ```\n' +
            '</details>\n',
          side: 'RIGHT',
          start_side: 'RIGHT',
          // start_line: 42,
          line: 54,
          path: 'database/migrations/2022_10_17_063101_insert_finnish_into_machine_translation_engine_language_pairs_table.php'
        }
      ])
    })
  })
  test('ZEN 9720 PR 680', () => {
    const files: Feedback[] = transformOutputToFeedback(
      ZEN9720_PR680_json.files
    )
    const feedback: Feedback[] = filterOutOfContextCode(
      files,
      ZEN9720_PR680_diff
    )
    const comments: Comment[] = getComments(feedback)

    expect(comments).toEqual([])
  })
  test('ZEN 9972 PR 896', () => {
    const files: Feedback[] = transformOutputToFeedback(
      ZEN9972_PR896_json.files
    )
    const feedback: Feedback[] = filterOutOfContextCode(
      files,
      ZEN9972_PR896_diff
    )
    const comments: Comment[] = getComments(feedback)

    expect(comments).toEqual([])
  })
  test('ZEN 10576 PR 1103', () => {
    const files: Feedback[] = transformOutputToFeedback(
      ZEN10576_PR1103_json.files
    )
    const feedback: Feedback[] = filterOutOfContextCode(
      files,
      ZEN10576_PR1103_diff
    )
    const comments: Comment[] = getComments(feedback)

    expect(comments).toEqual([
      {
        body:
          'Applied fixers: `braces`\n' +
          '<details>\n' +
          '  <summary>Diff:</summary>\n' +
          '  ```diff\n' +
          ' \n' +
          '         $exception = [];\n' +
          ' \n' +
          '-        foreach ($namespacesAndQueries as $namespaceAndQuery)\n' +
          '-        {\n' +
          '+        foreach ($namespacesAndQueries as $namespaceAndQuery) {\n' +
          '             if (!in_array($namespaceAndQuery[1], $namespaces)\n' +
          "             && $namespaces[0] !== 'xmlns') {\n" +
          '                 continue;\n' +
          '  ```\n' +
          '</details>\n',
        side: 'RIGHT',
        start_side: 'RIGHT',
        // start_line: 67,
        line: 74,
        path: 'app/Services/OOXml/Parsing/TextNodeSearchers/TextNodeSearcher.php'
      }
    ])
  })
})

test('it handles empty JSON', () => {
  const feedback: Feedback[] = transformOutputToFeedback([])
  const comments: Comment[] = getComments(feedback)

  expect(comments).toEqual([])
})

describe('it parses the new Laravel Pint', () => {
  const files: Feedback[] = transformOutputToFeedback(base_formatting_json.files);
  const feedback: Feedback[] = filterOutOfContextCode(files, base_formatting_json.files[0].diff);

  test('and it returns the correct feedback', () => {
    expect(feedback).toEqual(
    [
      {
        path: 'workbench/yaraku/admin/tests/Dictionary/Controllers/CompanyDictionaryControllerTest.php',
        source_class: '-<?php namespace Yaraku\\Admin\\Tests\\Dictionary\\Controllers;\n' +
          '+<?php\n' +
          ' \n' +
          '+namespace Yaraku\\Admin\\Tests\\Dictionary\\Controllers;\n' +
          '+\n' +
          ' use App\\DBModels;\n' +
          ' use Auth;\n' +
          ' use Tests\\Integration\\Fixtures;',
        lines: [ 1, 8 ],
        message: 'visibility_required, blank_line_after_opening_tag'
      },
      {
        path: 'workbench/yaraku/admin/tests/Dictionary/Controllers/CompanyDictionaryControllerTest.php',
        source_class: ' \n' +
          ' class CompanyDictionaryControllerTest extends TestCase\n' +
          ' {\n' +
          "-    const BASE_URL = 'admin/company';\n" +
          "+    public const BASE_URL = 'admin/company';\n" +
          ' \n' +
          '     /** @var DBModels\\User */\n' +
          '     private $user;',
        lines: [ 9, 16 ],
        message: 'visibility_required, blank_line_after_opening_tag'
      }
    ]
    )
  })

  test('and it returns the correct comments', () => {
    const comments = getComments(feedback)
  })
})
