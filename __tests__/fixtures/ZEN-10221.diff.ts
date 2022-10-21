export const diff = `diff --git a/app/Services/Language/Rules/LanguageMapper.php b/app/Services/Language/Rules/LanguageMapper.php
index 5149dfdf8fe..3f750f0032f 100644
--- a/app/Services/Language/Rules/LanguageMapper.php
+++ b/app/Services/Language/Rules/LanguageMapper.php
@@ -22,6 +22,7 @@ public function getLanguageRules(
             case 'de':
             case 'en':
             case 'es':
+            case 'fi':
             case 'fr':
             case 'id':
             case 'it':
diff --git a/app/Services/Segment/Segmentation/Sentence/SentenceSegmenterStrategy.php b/app/Services/Segment/Segmentation/Sentence/SentenceSegmenterStrategy.php
index 7bdb213739f..a6b6dcb1476 100755
--- a/app/Services/Segment/Segmentation/Sentence/SentenceSegmenterStrategy.php
+++ b/app/Services/Segment/Segmentation/Sentence/SentenceSegmenterStrategy.php
@@ -75,6 +75,7 @@ public function getSentences(
                     new Strategy\SpanishSentenceSegmenter($preserveLeadingSpaces)
                 );
                 break;
+            case 'fi':
             case 'sv':
                 $context = new SentenceSegmenterContext(
                     new Strategy\SwedishSentenceSegmenter($preserveLeadingSpaces)
diff --git a/app/Services/Segment/Segmentation/Sentence/SubsegmenterStrategy.php b/app/Services/Segment/Segmentation/Sentence/SubsegmenterStrategy.php
index aa08b3ddae3..346c8690d32 100644
--- a/app/Services/Segment/Segmentation/Sentence/SubsegmenterStrategy.php
+++ b/app/Services/Segment/Segmentation/Sentence/SubsegmenterStrategy.php
@@ -32,6 +32,7 @@ public function getSubsegments(array $sentences): array
             case 'de':
             case 'en':
             case 'es':
+            case 'fi':
             case 'fr':
             case 'it':
             case 'ko':
diff --git a/config/locales.php b/config/locales.php
index 052211bc054..5694600ad50 100644
--- a/config/locales.php
+++ b/config/locales.php
@@ -4,31 +4,32 @@
     'en' => [
         'ar' => ['label' => 'Arabic'],
         'bn' => ['label' => 'Bengali'],
-        'de' => ['label'=>'German'],
-        'en' => ['label'=>'English'],
-        'es' => ['label'=>'Spanish'],
-        'fr' => ['label'=>'French'],
-        'hi' => ['label'=>'Hindi'],
-        'id' => ['label'=>'Indonesian'],
-        'it' => ['label'=>'Italian'],
-        'ja' => ['label'=>'Japanese'],
-        'ko' => ['label'=>'Korean'],
+        'de' => ['label' => 'German'],
+        'en' => ['label' => 'English'],
+        'es' => ['label' => 'Spanish'],
+        'fi' => ['label' => 'Finnish'],
+        'fr' => ['label' => 'French'],
+        'hi' => ['label' => 'Hindi'],
+        'id' => ['label' => 'Indonesian'],
+        'it' => ['label' => 'Italian'],
+        'ja' => ['label' => 'Japanese'],
+        'ko' => ['label' => 'Korean'],
         'mn' => ['label' => 'Mongolian'],
-        'ms' => ['label'=>'Malay'],
+        'ms' => ['label' => 'Malay'],
         'my' => ['label' => 'Myanmar'],
         'ne' => ['label' => 'Nepali'],
         'nl' => ['label' => 'Dutch'],
         'pl' => ['label' => 'Polish'],
-        'pt' => ['label'=>'Portuguese'],
+        'pt' => ['label' => 'Portuguese'],
         'ro' => ['label' => 'Romanian'],
         'ru' => ['label' => 'Russian'],
-        'sv' => ['label'=>'Swedish'],
-        'th' => ['label'=>'Thai'],
-        'tl' => ['label'=>'Tagalog'],
+        'sv' => ['label' => 'Swedish'],
+        'th' => ['label' => 'Thai'],
+        'tl' => ['label' => 'Tagalog'],
         'tr' => ['label' => 'Turkish'],
         'uk' => ['label' => 'Ukrainian'],
-        'vi' => ['label'=>'Vietnamese'],
-        'zh' => ['label'=>'Simplified Chinese'],
-        'zh_Hant' => ['label'=>'Traditional Chinese'],
+        'vi' => ['label' => 'Vietnamese'],
+        'zh' => ['label' => 'Simplified Chinese'],
+        'zh_Hant' => ['label' => 'Traditional Chinese'],
     ],
 ];
diff --git a/database/migrations/2022_10_17_062901_insert_finnish_into_language_table.php b/database/migrations/2022_10_17_062901_insert_finnish_into_language_table.php
new file mode 100644
index 00000000000..39c498d5dc0
--- /dev/null
+++ b/database/migrations/2022_10_17_062901_insert_finnish_into_language_table.php
@@ -0,0 +1,25 @@
+<?php
+
+declare(strict_types=1);
+
+use Illuminate\Database\Migrations\Migration;
+
+return new class extends Migration
+{
+    private const LANGUAGE_CODE = 'fi';
+
+    public function up(): void
+    {
+        DB::table('languages')
+            ->insert([
+                'id' => self::LANGUAGE_CODE,
+                'type' => 'word'
+            ]);
+    }
+
+    public function down(): void
+    {
+        DB::table('languages')
+            ->delete(self::LANGUAGE_CODE);
+    }
+};
diff --git a/database/migrations/2022_10_17_063101_insert_finnish_into_machine_translation_engine_language_pairs_table.php b/database/migrations/2022_10_17_063101_insert_finnish_into_machine_translation_engine_language_pairs_table.php
new file mode 100644
index 00000000000..a8530b11817
--- /dev/null
+++ b/database/migrations/2022_10_17_063101_insert_finnish_into_machine_translation_engine_language_pairs_table.php
@@ -0,0 +1,87 @@
+<?php
+
+declare(strict_types=1);
+
+use Illuminate\Database\Migrations\Migration;
+
+return new class extends Migration
+{
+    /** @var array */
+    private const ENGINE_TYPES = [
+        'google', 'microsoft', 'deepL', 'yaraku'
+    ];
+
+    /** @var string */
+    private const FINNISH = 'fi';
+
+    /** @var array */
+    private const UNSUPPORTED_LANGUAGES = [
+        'google' => [],
+        'microsoft' => ['tl'],
+        'deepL' => ['ar', 'bn', 'hi', 'ko', 'mn', 'ms', 'my', 'ne', 'th', 'tl', 'vi', 'zh_Hant'],
+        'yaraku' => []
+    ];
+
+    public function up(): void
+    {
+        $allLanguages = DB::table('languages')
+            ->where('id', '!=', self::FINNISH)
+            ->pluck('id')
+            ->toArray();
+
+        $languagePairs = [];
+        foreach (self::ENGINE_TYPES as $engine) {
+            $engineId = $this->getEngineId($engine);
+
+            if ($engineId === 0) {
+                continue;
+            }
+
+            $languages = array_diff($allLanguages, self::UNSUPPORTED_LANGUAGES[$engine]);
+            foreach ($languages as $language) {
+                $languagePairs[] = [
+                    'sourceLanguage_id' => self::FINNISH,
+                    'targetLanguage_id' => $language,
+                    'machineTranslationEngine_id' => $engineId
+                ];
+                $languagePairs[] = [
+                    'sourceLanguage_id' => $language,
+                    'targetLanguage_id' => self::FINNISH,
+                    'machineTranslationEngine_id' => $engineId
+                ];
+            }
+        }
+
+        DB::table('machineTranslationEngineLanguagePairs')
+            ->insert($languagePairs);
+    }
+
+    public function down(): void
+    {
+        $engineIds = $this->getEngineIds();
+
+        DB::table('machineTranslationEngineLanguagePairs')
+            ->where(static function ($query) {
+                $query->where('sourceLanguage_id', '=', self::FINNISH)
+                    ->orWhere('targetLanguage_id', '=', self::FINNISH);
+            })
+            ->whereIn('machineTranslationEngine_id', $engineIds)
+            ->delete();
+    }
+
+    private function getEngineIds(): array
+    {
+        return DB::table('machineTranslationEngines')
+            ->whereIn('machineTranslationEngineType_id', self::ENGINE_TYPES)
+            ->pluck('id')
+            ->toArray();
+    }
+
+    private function getEngineId(string $engineType): int
+    {
+        return DB::table('machineTranslationEngines')
+            ->where('machineTranslationEngineType_id', $engineType)
+            ->pluck('id')
+            ->first() ?? 0;
+    }
+};
diff --git a/resources/lang/ja.json b/resources/lang/ja.json
index 86c26320d47..4bf66faa182 100644
--- a/resources/lang/ja.json
+++ b/resources/lang/ja.json
@@ -1099,6 +1099,7 @@
         "Bengali": "ベンガル語",
         "Romanian": "ルーマニア語",
         "Ukrainian": "ウクライナ語",
+        "Finnish": "フィンランド語",
         "Pre-translation Settings": "自動翻訳の設定",
         "Language pair is not supported by selected translation engine": "選択した自動翻訳では言語ペアをサポートしていません",
         "Not supported": "サポートされていません",
diff --git a/resources/lang/zh.json b/resources/lang/zh.json
index 9a52a2c7662..e6fc04f3687 100644
--- a/resources/lang/zh.json
+++ b/resources/lang/zh.json
@@ -870,6 +870,7 @@
         "Bengali": "孟加拉语",
         "Romanian": "罗马尼亚语",
         "Ukrainian": "乌克兰语",
+        "Finnish": "芬兰语",
         "Pre-translation Settings": "自动翻译设置",
         "Language pair is not supported by selected translation engine": "选定的翻译引擎不支持该语言组合",
         "Not supported": "不支持",`
