import {expect, test, describe} from '@jest/globals'
import {parseComment} from '../src/parse-comment'
import {normalizeFile} from '../src/normalize-file'
import {squashHunks} from '../src/squash-hunks'
import {filterFiles} from '../src/filter-files'
import { File, PatchDiff } from '../src/types'
import { run as runMain } from '../src/main'
import * as Diff from 'diff'

import * as ZEN9582_json from './fixtures/ZEN-9582.json'
import * as ZEN10274_PR1136_json from './fixtures/ZEN-10274-PR-1136.json'
import {diff as ZEN10274_PR1136_diff} from './fixtures/ZEN-10274-PR-1136.diff'
import * as ZEN10598_PR1143_json from './fixtures/ZEN-10598-PR-1143.json'
import {diff as ZEN10598_PR1143_diff} from './fixtures/ZEN-10598-PR-1143.diff'
import * as ZEN10261_PR1106_json from './fixtures/ZEN-10261-PR-1106.json'
import {diff as ZEN10261_PR1106_diff} from './fixtures/ZEN-10261-PR-1106.diff'

describe('Pull requests', () => {
  test('runs successfully', async () => {
    await expect(runMain()).resolves.not.toThrow()
  })
  test('ZEN-10261 PR-1106', () => {
    const comments = run(ZEN10261_PR1106_json, ZEN10261_PR1106_diff)

    expect(comments).toEqual([{
        path: 'tests/Integration/OOXml/Preview/OOXmlPreviewFactoryTest.php',
        body: '```diff\n' +
          '-<?php namespace Tests\\Integration\\OOXml\\Preview;\n' +
          '+<?php\n' +
          '+\n' +
          '+namespace Tests\\Integration\\OOXml\\Preview;\n' +
          ' \n' +
          ' use App\\Providers\\OOXmlServiceProvider;\n' +
          ' use App\\Services\\Document;\n' +
          '\n' +
          '```',
        side: 'RIGHT',
        start_side: 'RIGHT',
        start_line: 1,
        line: 6
    }])
  })
  test('ZEN-10598 PR-1143', () => {
    const comments = run(ZEN10598_PR1143_json, ZEN10598_PR1143_diff)

    expect(comments).toEqual([])
  })

  test('ZEN-10274 PR-1136', () => {
    const comments = run(ZEN10274_PR1136_json, ZEN10274_PR1136_diff)

    expect(comments).toEqual([
      {
        path: 'ecs-test-file.php',
        side: 'RIGHT',
        start_side: 'RIGHT',
        start_line: 15,
        line: 19,
        body: '```diff\n' +
          '     ClassZ,\n' +
          ' };\n' +
          ' \n' +
          '-class ClassName extends ParentClass implements \\ArrayAccess, \\Countable, \\Serializable {\n' +
          '-    use First, Second, Third;\n' +
          '+class ClassName extends ParentClass implements \\ArrayAccess, \\Countable, \\Serializable\n' +
          '+{\n' +
          '+    use First;\n' +
          '+    use Second;\n' +
          '+    use Third;\n' +
          ' \n' +
          '-    var $_foo;\n' +
          '+    public $_foo;\n' +
          ' \n' +
          '-    function _myFunc (\n' +
          '+    public function _myFunc(\n' +
          '         int $arg = 0,\n' +
          '         $arg2,\n' +
          '-    ): ? bool{\n' +
          '+    ): ?bool {\n' +
          '     }\n' +
          ' }\n' +
          '```',
      }
    ])
  })
  test('ZEN-9582', () => {
    const diff = `diff --git a/tests/Integration/Company/CompanyUserExportControllerTest.php b/tests/Integration/Company/CompanyUserStatsExportControllerTest.php
similarity index 82%
rename from tests/Integration/Company/CompanyUserExportControllerTest.php
rename to tests/Integration/Company/CompanyUserStatsExportControllerTest.php
index eb474d40ff8..a54d7da61bd 100644
--- a/tests/Integration/Company/CompanyUserExportControllerTest.php
+++ b/tests/Integration/Company/CompanyUserStatsExportControllerTest.php
@@ -11,14 +11,14 @@
 use Tests\Integration\AbstractTestCase;
 use Tests\Integration\Fixtures\DBModels\CompanyFixture;
 use Tests\Integration\Fixtures\DBModels\UserFixture;
-use Tests\Integration\Fixtures\User\Export\CompanyExportRequestBuilder;
+use Tests\Integration\Fixtures\User\Export\CompanyStatsExportRequestBuilder;
 
-class CompanyUserExportControllerTest extends AbstractTestCase
+class CompanyUserStatsExportControllerTest extends AbstractTestCase
 {
     use GeneralErrorAssertions;
     use ResponseAssertions;
 
-    private CompanyExportRequestBuilder $requestBuilder;
+    private CompanyStatsExportRequestBuilder $requestBuilder;
     private Carbon $thisMonth;
 
     public function setUp(): void
@@ -29,7 +29,7 @@ public function setUp(): void
     }
 
     /**
-     * @covers \App\Http\Controllers\Company\CompanyUserExportController::export()
+     * @covers \App\Http\Controllers\Company\CompanyStatsExportController::export()
      */
     public function testExportMonth(): void
     {
@@ -48,7 +48,7 @@ public function testExportMonth(): void
     }
 
     /**
-     * @covers \App\Http\Controllers\Company\CompanyUserExportController::export()
+     * @covers \App\Http\Controllers\Company\CompanyStatsExportController::export()
      */
     public function testExportYear(): void
     {
@@ -67,7 +67,7 @@ public function testExportYear(): void
     }
 
     /**
-     * @covers \App\Http\Controllers\Company\CompanyUserExportController::export()
+     * @covers \App\Http\Controllers\Company\CompanyStatsExportController::export()
      */
     public function testExportWhenUserIsNotCompanyAdmin(): void
     {
@@ -89,7 +89,7 @@ public function testExportWhenUserIsNotCompanyAdmin(): void
     }
 
     /**
-     * @covers \App\Http\Controllers\Company\CompanyUserExportController::export()
+     * @covers \App\Http\Controllers\Company\CompanyStatsExportController::export()
      */
     public function testExportWhenUserIsNotLoggedIn(): void
     {
@@ -109,9 +109,9 @@ public function testExportWhenUserIsNotLoggedIn(): void
         static::assertNotAuthorized($response);
     }
 
-    private function createDefaultExportOptions(): CompanyExportRequestBuilder
+    private function createDefaultExportOptions(): CompanyStatsExportRequestBuilder
     {
-        return CompanyExportRequestBuilder::create()
+        return CompanyStatsExportRequestBuilder::create()
             ->includeChar()
             ->includeDocument()
             ->includeEmail()`

      const comments = run(ZEN9582_json, diff)

      expect(comments).toEqual([])
  })
})

function run(j: any, d: any) {
  const json: PatchDiff[] = Diff.parsePatch(j.files.map((file: File): string => {
    return file.diff
  }).join('\n'))
  const diff: PatchDiff[] = Diff.parsePatch(d)

  const files = diff
    .map(normalizeFile)

  return json
    .filter(
        filterFiles(files)
      )
    .map(
        squashHunks(files)
      )
    .filter((file: PatchDiff) => {
      return file.hunks.length > 0
    })
    .map((file: PatchDiff) => {
      const foundFile = files.find((f:any) => file.newFileName.includes(f.path))
  
      return [
        file.hunks.map(parseComment(foundFile))
      ]
      .flat()
    })
    .flat()
}
