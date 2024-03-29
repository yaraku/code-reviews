import {expect, test, describe} from '@jest/globals'
import {run} from '../src/run'
import {run as runMain} from '../src/main'

import * as ZEN9582_json from './fixtures/ZEN-9582.json'
import * as ZEN10274_PR1136_json from './fixtures/ZEN-10274-PR-1136.json'
import {diff as ZEN10274_PR1136_diff} from './fixtures/ZEN-10274-PR-1136.diff'
import * as ZEN10598_PR1143_json from './fixtures/ZEN-10598-PR-1143.json'
import {diff as ZEN10598_PR1143_diff} from './fixtures/ZEN-10598-PR-1143.diff'
import * as ZEN10261_PR1106_json from './fixtures/ZEN-10261-PR-1106.json'
import {diff as ZEN10261_PR1106_diff} from './fixtures/ZEN-10261-PR-1106.diff'
import * as ZEN10592_PR1227_json from './fixtures/ZEN-10592-PR-1227.json'
import {diff as ZEN10592_PR1227_diff} from './fixtures/ZEN-10592-PR-1227.diff'
import * as ZEN12021_PR1622_json from './fixtures/ZEN-12021-PR-1622.json'
import {diff as ZEN12021_PR1622_diff} from './fixtures/ZEN-12021-PR-1622.diff'
import * as ZEN12485_PR1796_json from './fixtures/ZEN-12485-PR-1796.json'
import {diff as ZEN12485_PR1796_diff} from './fixtures/ZEN-12485-PR-1796.diff'

describe('Pull requests', () => {
  test('runs successfully', async () => {
    await expect(runMain()).resolves.not.toThrow()
  })
  test('ZEN-10261 PR-1106', () => {
    const comments = run(ZEN10261_PR1106_json, ZEN10261_PR1106_diff)

    expect(comments).toEqual([
      {
        path: 'tests/Integration/OOXml/Preview/OOXmlPreviewFactoryTest.php',
        body:
          '```diff\n' +
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
      }
    ])
  })
  test('ZEN-10598 PR-1143', () => {
    const comments = run(ZEN10598_PR1143_json, ZEN10598_PR1143_diff)

    expect(comments).toEqual([])
  })

  test('ZEN-10274 PR-1136', () => {
    const comments = run(ZEN10274_PR1136_json, ZEN10274_PR1136_diff)

    expect(comments).toEqual([])
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
  test('ZEN-10592', () => {
    const comments = run(ZEN10592_PR1227_json, ZEN10592_PR1227_diff)

    expect(comments).toEqual([
      {
        path: 'tests/Integration/OOXml/Parsing/TextNodeSearchers/TextNodeSearcherTest.php',
        side: 'RIGHT',
        start_side: 'RIGHT',
        start_line: 450,
        line: 455,
        body:
          '```diff\n' +
          '             Event::assertNotDispatched(MessageLogged::class);\n' +
          ' \n' +
          '             $this->assertCount($count, $result);\n' +
          '-        } \n' +
          '+        }\n' +
          '     }\n' +
          ' }\n' +
          '```'
      }
    ])
  })
  test('ZEN-12021', () => {
    const comments = run(ZEN12021_PR1622_json, ZEN12021_PR1622_diff)

    expect(comments).toEqual([
      {
        body:
          '```diff\n' +
          '     {\n' +
          '         $username = null;\n' +
          '         if (preg_match(\n' +
          "-            '/userName eq \\\"([a-z0-9_.\\-@]*)\\\"/i', $this->get('filter'), $matches) === 1) {\n" +
          '+            \'/userName eq \\"([a-z0-9_.\\-@]*)\\"/i\',\n' +
          "+            $this->get('filter'),\n" +
          '+            $matches\n' +
          '+        ) === 1) {\n' +
          '             $username = $matches[1];\n' +
          '         }\n' +
          '         return $username;\n' +
          '\n' +
          '```',
        line: 54,
        path: 'app/Http/Requests/Scim/MembersAttributeRequest.php',
        side: 'RIGHT',
        start_line: 45,
        start_side: 'RIGHT'
      },
      {
        body:
          '```diff\n' +
          '     public function getOperations(): array\n' +
          '     {\n' +
          '         return array_map(\n' +
          '-            static fn($operation) => new Operation(\n' +
          '+            static fn ($operation) => new Operation(\n' +
          "                 $operation['path'],\n" +
          "                 $operation['value']\n" +
          '             ),\n' +
          '\n' +
          '```',
        line: 35,
        path: 'app/Http/Requests/Scim/UpdateMemberAttributeRequest.php',
        side: 'RIGHT',
        start_line: 29,
        start_side: 'RIGHT'
      },
      {
        body:
          '```diff\n' +
          '         $this->availableIncludes = self::SCIM_FILTERS;\n' +
          '     }\n' +
          ' \n' +
          '-    public function transform(User $member): array {\n' +
          '+    public function transform(User $member): array\n' +
          '+    {\n' +
          '         return [\n' +
          "             'id' => $member->id,\n" +
          '         ];\n' +
          '     }\n' +
          ' \n' +
          '-    public function includeSchemas(): Primitive {\n' +
          '+    public function includeSchemas(): Primitive\n' +
          '+    {\n' +
          "         return $this->primitive(['urn:ietf:params:scim:schemas:extension:enterprise:2.0:User']);\n" +
          '     }\n' +
          ' \n' +
          '\n' +
          '```',
        line: 37,
        path: 'app/Services/Scim/Transformers/ScimCompanyMemberTransformer.php',
        side: 'RIGHT',
        start_line: 23,
        start_side: 'RIGHT'
      },
      {
        line: 21,
        path: 'app/Services/User/Password/Generator.php',
        side: 'RIGHT',
        start_line: 14,
        start_side: 'RIGHT',
        body:
          '```diff\n' +
          "         $special = array_flip(str_split('!@#$%^&*()_+=-}{[}]\\|;:<>?/'));\n" +
          '         $combined = array_merge($digits, $lowercase, $uppercase, $special);\n' +
          ' \n' +
          '-        return str_shuffle(array_rand($digits) .\n' +
          '+        return str_shuffle(\n' +
          '+            array_rand($digits) .\n' +
          '             array_rand($lowercase) .\n' +
          '             array_rand($uppercase) .\n' +
          '             array_rand($special) .\n' +
          '\n' +
          '```'
      }
    ])
  })
  test('ZEN-12485 PR 1796', () => {
    const comments = run(ZEN12485_PR1796_json, ZEN12485_PR1796_diff)

    expect(comments).toEqual([
      {
        path: 'tests/Integration/Stripe/Concerns/FakeStripeHttpClient.php',
        body:
          '```diff\n' +
          '         });\n' +
          '     }\n' +
          ' \n' +
          '-    private function resetHttpClient(): void {\n' +
          '+    private function resetHttpClient(): void\n' +
          '+    {\n' +
          '         ApiRequestor::setHttpClient(CurlClient::instance());\n' +
          '     }\n' +
          ' }\n' +
          '```',
        side: 'RIGHT',
        start_side: 'RIGHT',
        start_line: 20,
        line: 26
      }
    ])
  })
})
