export const diff = `diff --git a/app/Providers/OOXmlServiceProvider.php b/app/Providers/OOXmlServiceProvider.php
index 5e7d30f0a64..5cadc32a70b 100644
--- a/app/Providers/OOXmlServiceProvider.php
+++ b/app/Providers/OOXmlServiceProvider.php
@@ -4,6 +4,8 @@
 
 namespace App\Providers;
 
+use App\Services\Aspose;
+use App\Services\Config;
 use App\Services\File;
 use App\Services\OOXml;
 use App\Services\Segment;
@@ -55,6 +57,16 @@ public function register(): void
             Segment\TextFormat\TextFormatFactory::class
         );
 
+        $this->app->when(OOXml\Preview\OOXmlPreviewFactory::class)
+            ->needs(OOXml\Preview\Generator\PowerPointGeneratorInterface::class)
+            ->give(function () {
+                if (Config\Aspose::isEnabled()) {
+                    return $this->app->get(Aspose\PowerPoint\PreviewGenerator::class);
+                } else {
+                    return $this->app->get(Unoconv\OOXmlToHtml\PowerPoint\PreviewGenerator::class);
+                }
+            });
+
         parent::register();
     }
 
diff --git a/app/Services/Aspose/Client.php b/app/Services/Aspose/Client.php
new file mode 100644
index 00000000000..d473d527528
--- /dev/null
+++ b/app/Services/Aspose/Client.php
@@ -0,0 +1,42 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\Aspose;
+
+use App\Services\Config;
+use Aspose\Slides\Cloud\Sdk\Api;
+use SplFileObject;
+
+class Client
+{
+    private Api\SlidesAPI $slideApi;
+
+    /**
+     * @throws ConfigurationException
+     */
+    public function __construct()
+    {
+        if (!Config\Aspose::isEnabled()) {
+            throw new ConfigurationException('Aspose credentials missing');
+        }
+
+        $this->slideApi = new Api\SlidesApi(null, $this->makeConfigForSlideApi(
+            Config\Aspose::getClientId(),
+            Config\Aspose::getClientSecret()
+        ));
+    }
+
+    public function convertPptx(string $content, string $format): SplFileObject
+    {
+        return $this->slideApi->convert($content, $format);
+    }
+
+    private function makeConfigForSlideApi(string $id, string $secret): Api\Configuration
+    {
+        $config = new Api\Configuration();
+        $config->setAppSid($id);
+        $config->setAppKey($secret);
+        return $config;
+    }
+}
diff --git a/app/Services/Aspose/ConfigurationException.php b/app/Services/Aspose/ConfigurationException.php
new file mode 100644
index 00000000000..bd8d07ef7fd
--- /dev/null
+++ b/app/Services/Aspose/ConfigurationException.php
@@ -0,0 +1,21 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\Aspose;
+
+use App\Exceptions\Rendering\ThrowableResponseDataInterface;
+use Exception;
+
+class ConfigurationException extends Exception implements ThrowableResponseDataInterface
+{
+    public function responseErrorCode(): string
+    {
+        return 'asposeConfigurationError';
+    }
+
+    public function responseStatus(): int
+    {
+        return 500;
+    }
+}
diff --git a/app/Services/Aspose/PowerPoint/HtmlPreview.php b/app/Services/Aspose/PowerPoint/HtmlPreview.php
new file mode 100644
index 00000000000..68b0f17eeb1
--- /dev/null
+++ b/app/Services/Aspose/PowerPoint/HtmlPreview.php
@@ -0,0 +1,25 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\Aspose\PowerPoint;
+
+use App\Services\FileExport\DownloadableFileInterface;
+
+class HtmlPreview implements DownloadableFileInterface
+{
+    public function __construct(
+        private readonly string $contents
+    ) {
+    }
+
+    public function fileContentType(): string
+    {
+        return 'text/html';
+    }
+
+    public function fileContents(): string
+    {
+        return $this->contents;
+    }
+}
diff --git a/app/Services/Aspose/PowerPoint/PreviewGenerator.php b/app/Services/Aspose/PowerPoint/PreviewGenerator.php
new file mode 100644
index 00000000000..dd006822abb
--- /dev/null
+++ b/app/Services/Aspose/PowerPoint/PreviewGenerator.php
@@ -0,0 +1,62 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\Aspose\PowerPoint;
+
+use App\Services\Aspose\Client;
+use App\Services\File\ZipFileArchive;
+use App\Services\FileExport\DownloadableFileInterface;
+use App\Services\OOXml\Preview\Generator;
+use Aspose\Slides\Cloud\Sdk\Model\ExportFormat;
+use DOMDocument;
+use DOMXPath;
+
+class PreviewGenerator implements Generator\PowerPointGeneratorInterface
+{
+    public function __construct(
+        private readonly Client $generator,
+        private readonly ZipFileArchive\ZipFileArchiveFactory $fileArchiveFactory
+    ) {
+    }
+
+    public function generate(
+        Generator\HtmlConvertibleOOXmlFileInterface $ooXmlFileForImageOutput,
+        Generator\HtmlConvertibleOOXmlFileInterface $ooXmlFileForTextOutput
+    ): DownloadableFileInterface {
+        $fileContents = $this->removeEffectTags($ooXmlFileForTextOutput)->fileContents();
+        $result = $this->generator->convertPptx($fileContents, ExportFormat::HTML);
+        return new HtmlPreview($result->fread($result->getSize()));
+    }
+
+
+    private function removeEffectTags(
+        Generator\HtmlConvertibleOOXmlFileInterface $file
+    ): ZipFileArchive\ZipFileArchive {
+        $zipFile = $this->fileArchiveFactory->zipFileArchiveFromFileContents(
+            $file->fileContents()
+        );
+        foreach ($file->getDocumentNames() as $documentName) {
+            $content = $zipFile->getFromName($documentName);
+            $document = new DOMDocument();
+            $document->loadXML($content);
+
+            $entries = [];
+            $xpath = new DOMXPath($document);
+            preg_match('/xmlns:a="(.*?)"/', $content, $nameSpace);
+
+            if (!empty($nameSpace)) {
+                $xpath->registerNamespace('a', $nameSpace[1]);
+                $entries = $xpath->evaluate('//a:effectLst');
+            }
+
+            foreach ($entries as $entry) {
+                $entry->parentNode->removeChild($entry);
+            }
+
+            $contents = $document->saveXML();
+            $zipFile->addFromString($documentName, $contents);
+        }
+        return $zipFile;
+    }
+}
diff --git a/app/Services/Config/Aspose.php b/app/Services/Config/Aspose.php
new file mode 100644
index 00000000000..13e8c1927ca
--- /dev/null
+++ b/app/Services/Config/Aspose.php
@@ -0,0 +1,26 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\Config;
+
+use Config;
+
+class Aspose
+{
+    public static function getClientId(): ?string
+    {
+        return Config::get('aspose.clientId');
+    }
+
+    public static function getClientSecret(): ?string
+    {
+        return Config::get('aspose.clientSecret');
+    }
+
+    public static function isEnabled(): bool
+    {
+        return Aspose::getClientId() !== null
+            && Aspose::getClientSecret() !== null;
+    }
+}
diff --git a/app/Services/File/ZipFileArchive/ZipFileArchive.php b/app/Services/File/ZipFileArchive/ZipFileArchive.php
index fa93211dedf..0c440367d1d 100644
--- a/app/Services/File/ZipFileArchive/ZipFileArchive.php
+++ b/app/Services/File/ZipFileArchive/ZipFileArchive.php
@@ -44,6 +44,11 @@ public function fileContents(): string
         return $this->localFile->get();
     }
 
+    public function getFromName(string $name): string|bool
+    {
+        return $this->openArchive()->getFromName($name);
+    }
+
     /**
      * @throws Exception\ZipFileArchiveException
      */
diff --git a/app/Services/OOXml/Export/OOXmlWithReplacedText.php b/app/Services/OOXml/Export/OOXmlWithReplacedText.php
index 08b4a3a3ec9..067d805e40d 100644
--- a/app/Services/OOXml/Export/OOXmlWithReplacedText.php
+++ b/app/Services/OOXml/Export/OOXmlWithReplacedText.php
@@ -1,30 +1,23 @@
-<?php namespace App\Services\OOXml\Export;
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\OOXml\Export;
 
 use App\DBModels;
 use App\Services\FileExport;
 use App\Services\OOXml;
 use DOMDocument;
-use DOMXPath;
 
 class OOXmlWithReplacedText implements
     PreviewableExportFileIntersection
 {
-    /** @var FileExport\ExportFileFormatInterface */
-    private $fileFormat;
-
-    /** @var Filesystem\ExportOOXmlZipInterface|null */
-    private $replacedZipFile;
-
-    /** @var TextReplacement\OOXmlXPathsSegmentMap */
-    private $segmentMap;
-
-    /** @var DBModels\Language */
-    private $targetLanguage;
-
+    private FileExport\ExportFileFormatInterface $fileFormat;
+    private ?Filesystem\ExportOOXmlZipInterface $replacedZipFile = null;
+    private TextReplacement\OOXmlXPathsSegmentMap $segmentMap;
+    private DBModels\Language $targetLanguage;
     private OOXml\XmlFileLoading\XmlFileLoader $xmlFileLoader;
-
-    /** @var Filesystem\ExportOOXmlZipInterface */
-    private $zipFile;
+    private Filesystem\ExportOOXmlZipInterface $zipFile;
 
     public function __construct(
         TextReplacement\OOXmlXPathsSegmentMap $segmentMap,
@@ -41,7 +34,6 @@ public function __construct(
     }
 
     /**
-     * @return string
      * @throws FileExport\Exception\ExportFileContentsExceptionInterface
      */
     public function fileContents(): string
@@ -49,16 +41,12 @@ public function fileContents(): string
         return $this->replacedFile()->fileContents();
     }
 
-    /**
-     * @return FileExport\ExportFileFormatInterface
-     */
     public function fileFormat(): FileExport\ExportFileFormatInterface
     {
         return $this->fileFormat;
     }
 
     /**
-     * @return string
      * @throws FileExport\Exception\ExportFileContentsExceptionInterface
      */
     public function getLocalPath(): string
@@ -72,10 +60,17 @@ public function textLanguage(): DBModels\Language
     }
 
     /**
-     * @return Filesystem\ExportOOXmlZipInterface
+     * @return string[]
+     */
+    public function getDocumentNames(): array
+    {
+        return $this->segmentMap->getDocumentsNames();
+    }
+
+    /**
      * @throws FileExport\Exception\ExportFileContentsExceptionInterface
      */
-    private function replacedFile()
+    private function replacedFile(): Filesystem\ExportOOXmlZipInterface
     {
         if ($this->replacedZipFile !== null) {
             return $this->replacedZipFile;
@@ -103,7 +98,6 @@ private function replacedFile()
         }
 
         $this->replacedZipFile = $this->zipFile;
-
         return $this->replacedZipFile;
     }
 
@@ -128,11 +122,7 @@ private function replaceAtPathsInDom(
         return $textReplacer->saveDomXPathXml();
     }
 
-    /**
-     * @param string $text
-     * @return string
-     */
-    private function escapeText($text)
+    private function escapeText(string $text): string
     {
         $doc = new DOMDocument('1.0', 'utf-8');
         $root = $doc->createTextNode($text);
diff --git a/app/Services/OOXml/Preview/Generator/PowerPointGeneratorInterface.php b/app/Services/OOXml/Preview/Generator/PowerPointGeneratorInterface.php
new file mode 100644
index 00000000000..7a1d1e2398e
--- /dev/null
+++ b/app/Services/OOXml/Preview/Generator/PowerPointGeneratorInterface.php
@@ -0,0 +1,15 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\OOXml\Preview\Generator;
+
+use App\Services\FileExport\DownloadableFileInterface;
+
+interface PowerPointGeneratorInterface
+{
+    public function generate(
+        HtmlConvertibleOOXmlFileInterface $ooXmlFileForImageOutput,
+        HtmlConvertibleOOXmlFileInterface $ooXmlFileForTextOutput
+    ): DownloadableFileInterface;
+}
diff --git a/app/Services/OOXml/Preview/OOXmlPreviewFactory.php b/app/Services/OOXml/Preview/OOXmlPreviewFactory.php
index cebe392ce6d..414283b49e1 100644
--- a/app/Services/OOXml/Preview/OOXmlPreviewFactory.php
+++ b/app/Services/OOXml/Preview/OOXmlPreviewFactory.php
@@ -1,16 +1,19 @@
-<?php namespace App\Services\OOXml\Preview;
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\OOXml\Preview;
 
 use App\Services\Document;
+use App\Services\FileExport\DownloadableFileInterface;
 use App\Services\OOXml;
 
 class OOXmlPreviewFactory extends OOXml\Export\OOXmlExportFactory implements
     Document\Export\Preview\PreviewGeneration\PreviewGeneratorInterface
 {
-    /** @var Generator\PreviewGeneratorInterface */
-    private $previewGenerator;
-
-    /** @var TextFormatting\OOXmlPreviewSegmentsFormatsInterface */
-    private $previewSegmentsFormats;
+    private Generator\PreviewGeneratorInterface $previewGenerator;
+    private Generator\PowerPointGeneratorInterface $powerPointPreviewGenerator;
+    private TextFormatting\OOXmlPreviewSegmentsFormatsInterface $previewSegmentsFormats;
 
     public function __construct(
         OOXml\XmlFileLoading\XmlFileLoader $xmlFileLoader,
@@ -18,10 +21,12 @@ public function __construct(
         OOXml\Export\Filesystem\ExportOOXmlZipCreatorInterface $fileSystem,
         OOXml\FileFormats\OOXmlFileFormats $ooXmlFileFormats,
         OOXml\Export\TranslatedFileFormatterInterface $translatedFileFormatter,
-        Generator\PreviewGeneratorInterface $previewGenerator
+        Generator\PreviewGeneratorInterface $previewGenerator,
+        Generator\PowerPointGeneratorInterface $powerPreviewPointGenerator
     ) {
         $this->previewSegmentsFormats = $previewSegmentsFormats;
         $this->previewGenerator = $previewGenerator;
+        $this->powerPointPreviewGenerator = $powerPreviewPointGenerator;
 
         parent::__construct(
             $xmlFileLoader,
@@ -32,13 +37,9 @@ public function __construct(
         );
     }
 
-    /**
-     * @param Document\Export\SourceFiles\TextSourceInterface $documentTextSource
-     * @return \App\Services\FileExport\DownloadableFileInterface|null
-     */
     public function translatedPreview(
         Document\Export\SourceFiles\TextSourceInterface $documentTextSource
-    ) {
+    ): ?TextFormatting\PlaceholderReplacer {
         if ($this->isTextSourcePptx($documentTextSource)) {
             $this->loadSegmentTranslations($documentTextSource);
             return $this->translatedPptxPreview($documentTextSource);
@@ -80,13 +81,9 @@ private function loadSegmentTranslations(
         }
     }
 
-    /**
-     * @param Document\Export\SourceFiles\SourceFilesInterface $documentTextSource
-     * @return \App\Services\FileExport\DownloadableFileInterface|null
-     */
     public function sourcePreview(
         Document\Export\SourceFiles\SourceFilesInterface $documentTextSource
-    ) {
+    ): ?DownloadableFileInterface {
         if ($this->isTextSourcePptx($documentTextSource)) {
             return $this->sourcePreviewPptx($documentTextSource);
         }
@@ -104,25 +101,17 @@ public function sourcePreview(
         return null;
     }
 
-    /**
-     * @param Document\Export\SourceFiles\TextSourceInterface $documentTextSource
-     * @return bool
-     */
     private function isTextSourcePptx(
         Document\Export\SourceFiles\TextSourceInterface $documentTextSource
-    ) {
+    ): bool {
         return $documentTextSource->textSourceFileFormat()->extensionIsSame(
             $this->ooXmlFileFormats->pptx()
         );
     }
 
-    /**
-     * @param Document\Export\SourceFiles\TextSourceInterface $documentTextSource
-     * @return TextFormatting\PlaceholderReplacer
-     */
     private function translatedPptxPreview(
         Document\Export\SourceFiles\TextSourceInterface $documentTextSource
-    ) {
+    ): TextFormatting\PlaceholderReplacer {
         $baseForImageOutput = $this->translateFile($documentTextSource);
 
         $previewTextFormat = $this->previewSegmentsFormats
@@ -137,7 +126,7 @@ private function translatedPptxPreview(
             $placeholderMap
         );
 
-        $previewHtml = $this->previewGenerator->createMergedPreviewForPowerPoints(
+        $previewHtml = $this->powerPointPreviewGenerator->generate(
             $baseForImageOutput,
             $baseForTextOutput
         );
@@ -148,13 +137,9 @@ private function translatedPptxPreview(
         );
     }
 
-    /**
-     * @param Document\Export\SourceFiles\TextSourceInterface $documentTextSource
-     * @return \App\Services\FileExport\DownloadableFileInterface
-     */
     private function sourcePreviewPptx(
         Document\Export\SourceFiles\TextSourceInterface $documentTextSource
-    ) {
+    ): DownloadableFileInterface {
         $baseForImageOutput = $this->htmlConvertibleTextSource(
             $documentTextSource
         );
@@ -169,13 +154,9 @@ private function sourcePreviewPptx(
         );
     }
 
-    /**
-     * @param Document\Export\SourceFiles\TextSourceInterface $documentTextSource
-     * @return HtmlConvertibleTextSource
-     */
     private function htmlConvertibleTextSource(
         Document\Export\SourceFiles\TextSourceInterface $documentTextSource
-    ) {
+    ): HtmlConvertibleTextSource {
         $ooXmlZip = $this->fileSystem->zipArchiveFromTextSource(
             $documentTextSource
         );
diff --git a/app/Services/Segment/TextFormat/Attribute/HtmlWrapper.php b/app/Services/Segment/TextFormat/Attribute/HtmlWrapper.php
index 7ff2cf44c90..5c72034b19e 100644
--- a/app/Services/Segment/TextFormat/Attribute/HtmlWrapper.php
+++ b/app/Services/Segment/TextFormat/Attribute/HtmlWrapper.php
@@ -10,8 +10,8 @@ class HtmlWrapper extends HtmlText
 {
     public function format(DBModels\Segment $segment): string
     {
-        return '<span data-segment-id="' . $segment->id . '">'
+        return '<tspan data-segment-id="' . $segment->id . '">'
             . parent::format($segment)
-            . '</span>';
+            . '</tspan>';
     }
 }
diff --git a/app/Services/Unoconv/OOXmlToHtml/PowerPoint/PreviewGenerator.php b/app/Services/Unoconv/OOXmlToHtml/PowerPoint/PreviewGenerator.php
new file mode 100644
index 00000000000..44e0c8889e1
--- /dev/null
+++ b/app/Services/Unoconv/OOXmlToHtml/PowerPoint/PreviewGenerator.php
@@ -0,0 +1,24 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\Unoconv\OOXmlToHtml\PowerPoint;
+
+use App\Services\FileExport\DownloadableFileInterface;
+use App\Services\OOXml\Preview\Generator;
+use App\Services\Unoconv\OOXmlToHtml\OOXmlToHtmlFactory;
+
+class PreviewGenerator implements Generator\PowerPointGeneratorInterface
+{
+    public function __construct(
+        private readonly OOXmlToHtmlFactory $generator
+    ) {
+    }
+
+    public function generate(
+        Generator\HtmlConvertibleOOXmlFileInterface $ooXmlFileForImageOutput,
+        Generator\HtmlConvertibleOOXmlFileInterface $ooXmlFileForTextOutput
+    ): DownloadableFileInterface {
+        return $this->generator->createMergedPreviewForPowerPoints($ooXmlFileForImageOutput, $ooXmlFileForTextOutput);
+    }
+}
diff --git a/composer.json b/composer.json
index 6891b7cfc99..7a82494bb4a 100644
--- a/composer.json
+++ b/composer.json
@@ -23,6 +23,7 @@
     "ext-xsl": "*",
     "ext-zend-opcache": "*",
     "ext-zip": "*",
+    "aspose/slides-sdk-php": "^23.1",
     "aws/aws-sdk-php-laravel": "^3.5.0",
     "beyondcode/laravel-websockets": "^1.13",
     "cviebrock/laravel-elasticsearch": "^9.0",
diff --git a/composer.lock b/composer.lock
index b817b78296f..eeebd3d9fda 100644
--- a/composer.lock
+++ b/composer.lock
@@ -6,6 +6,60 @@
     ],
     "content-hash": "3fe7b4db9933e2c968394c6f27710e1c",
     "packages": [
+        {
+            "name": "aspose/slides-sdk-php",
+            "version": "23.1",
+            "source": {
+                "type": "git",
+                "url": "https://github.com/aspose-slides-cloud/aspose-slides-cloud-php.git",
+                "reference": "f5cb68c1855da0278036caae912b1a5bfec82f91"
+            },
+            "dist": {
+                "type": "zip",
+                "url": "https://api.github.com/repos/aspose-slides-cloud/aspose-slides-cloud-php/zipball/f5cb68c1855da0278036caae912b1a5bfec82f91",
+                "reference": "f5cb68c1855da0278036caae912b1a5bfec82f91",
+                "shasum": ""
+            },
+            "require": {
+                "ext-curl": "*",
+                "ext-json": "*",
+                "ext-mbstring": "*",
+                "guzzlehttp/guzzle": "^7.4",
+                "monolog/monolog": "*",
+                "php": ">=5.5"
+            },
+            "require-dev": {
+                "phpunit/phpunit": "^4.8"
+            },
+            "type": "library",
+            "autoload": {
+                "psr-4": {
+                    "Aspose\\Slides\\Cloud\\Sdk\\": "sdk/",
+                    "Aspose\\Slides\\Cloud\\Sdk\\Api\\": "sdk/api/",
+                    "Aspose\\Slides\\Cloud\\Sdk\\Model\\": "sdk/model/",
+                    "Aspose\\Slides\\Cloud\\Sdk\\Tests\\": "tests/",
+                    "Aspose\\Slides\\Cloud\\Sdk\\Tests\\Api\\": "tests/api/",
+                    "Aspose\\Slides\\Cloud\\Sdk\\Tests\\Utils\\": "tests/utils/",
+                    "Aspose\\Slides\\Cloud\\Sdk\\Tests\\UseCases\\": "tests/usecases/"
+                }
+            },
+            "notification-url": "https://packagist.org/downloads/",
+            "license": [
+                "MIT"
+            ],
+            "description": "This repository contains Aspose Cloud SDK for PHP source code. Aspose Cloud SDK for PHP lets PHP developers convert and process a variety of file formats in the cloud quickly and easily.",
+            "homepage": "https://github.com/aspose-slides-cloud/aspose-slides-cloud-php",
+            "keywords": [
+                "aspose",
+                "aspose cloud",
+                "php"
+            ],
+            "support": {
+                "issues": "https://github.com/aspose-slides-cloud/aspose-slides-cloud-php/issues",
+                "source": "https://github.com/aspose-slides-cloud/aspose-slides-cloud-php/tree/23.1"
+            },
+            "time": "2023-02-03T08:58:36+00:00"
+        },
         {
             "name": "aws/aws-crt-php",
             "version": "v1.0.2",
diff --git a/config/aspose.php b/config/aspose.php
new file mode 100644
index 00000000000..8c7cf4fcdba
--- /dev/null
+++ b/config/aspose.php
@@ -0,0 +1,6 @@
+<?php
+
+return [
+    'clientId' => env('SERVICES_ASPOSE_CLIENT_ID'),
+    'clientSecret' => env('SERVICES_ASPOSE_CLIENT_SECRET')
+];
diff --git a/public/js/app/document/components/previewView/Segment.tsx b/public/js/app/document/components/previewView/Segment.tsx
index 60a58afa55a..3d404f5eb60 100644
--- a/public/js/app/document/components/previewView/Segment.tsx
+++ b/public/js/app/document/components/previewView/Segment.tsx
@@ -127,7 +127,7 @@ export class Segment extends React.Component<AllPropsType, StateType> {
       show={this.state.editPopupVisible}
       trigger="click"
     >
-      <span className={elementClasses}>
+      <tspan className={elementClasses}>
         {segment.translation.text
           ? segment.translation.text
           : segment.source.text}
@@ -135,13 +135,13 @@ export class Segment extends React.Component<AllPropsType, StateType> {
         && <Tooltip container={this.props.htmlDocument.body}
           id={\`preview-checked-icon-\${segment.id}\`}
           text={Translator.getTranslation('messages', 'Checked')} >
-          <span className="yicon yicon-checkbox-checked preview-checked-icon">
+          <tspan className="yicon yicon-checkbox-checked preview-checked-icon">
             <Icon className="path1" type={IconType.checkPart1} />
             <Icon className="path2" type={IconType.checkPart2} />
             <Icon className="path3" type={IconType.checkPart3} />
-          </span>
+          </tspan>
         </Tooltip>}
-      </span>
+      </tspan>
     </OverlayTrigger>;
   }
 
diff --git a/tests/Config/Aspose.php b/tests/Config/Aspose.php
new file mode 100644
index 00000000000..fd126d30fce
--- /dev/null
+++ b/tests/Config/Aspose.php
@@ -0,0 +1,26 @@
+<?php
+
+declare(strict_types=1);
+
+namespace Tests\Config;
+
+use Config;
+
+class Aspose
+{
+    public static function setClientId(string $id): void
+    {
+        Config::set('aspose.clientId', $id);
+    }
+
+    public static function setClientSecret(string $secret): void
+    {
+        Config::set('aspose.clientSecret', $secret);
+    }
+
+    public static function disable(): void
+    {
+        Config::set('aspose.clientId');
+        Config::set('aspose.clientSecret');
+    }
+}
diff --git a/tests/Integration/Document/Export/Preview/Controller/DocumentPreviewControllerTest.php b/tests/Integration/Document/Export/Preview/Controller/DocumentPreviewControllerTest.php
index ccf63e1ad58..3d6a1bb5b76 100644
--- a/tests/Integration/Document/Export/Preview/Controller/DocumentPreviewControllerTest.php
+++ b/tests/Integration/Document/Export/Preview/Controller/DocumentPreviewControllerTest.php
@@ -198,7 +198,7 @@ public function testMakeTargetPreviewRequestWithHtmlTags(): void
         ))->withSegments()->get();
 
         $segmentId = $document->segments()->first()->id;
-        $expected = "<span data-segment-id=\"{$segmentId}\">&lt;p&gt;Hello how are you.&lt;&#047;p&gt;&lt;div&gt;I hope you are fine&lt;&#047;div&gt;</span> ";
+        $expected = "<tspan data-segment-id=\"{$segmentId}\">&lt;p&gt;Hello how are you.&lt;&#047;p&gt;&lt;div&gt;I hope you are fine&lt;&#047;div&gt;</tspan> ";
 
         $response = $this->makePreviewRequest($document->id, 'target');
 
diff --git a/tests/Integration/OOXml/Preview/AsposeTest.php b/tests/Integration/OOXml/Preview/AsposeTest.php
new file mode 100644
index 00000000000..74bd37a2cee
--- /dev/null
+++ b/tests/Integration/OOXml/Preview/AsposeTest.php
@@ -0,0 +1,105 @@
+<?php
+
+declare(strict_types=1);
+
+namespace Tests\Integration\OOXml\Preview;
+
+use App\DBModels\Language;
+use App\DBModels\TextSourceFile;
+use App\Providers\OOXmlServiceProvider;
+use App\Services\Aspose\Client;
+use App\Services\Document;
+use App\Services\FileExport\DownloadableFileInterface;
+use App\Services\OOXml\FileFormats\OOXmlFileFormats;
+use App\Services\OOXml\Preview;
+use Mockery;
+use SplFileObject;
+use Tests\Config;
+use Tests\Integration\AbstractTestCase;
+use Tests\Integration\Fixtures\DBModels;
+
+/**
+ * @coversDefaultClass \App\Services\OOXml\Preview\OOXmlPreviewFactory
+ */
+class AsposeTest extends AbstractTestCase
+{
+    private Mockery\Mock|Document\Export\SourceFiles\TextSourceInterface $documentTextSourceMock;
+    private Preview\OOXmlPreviewFactory $factory;
+    private Mockery\Mock|Client $mockClient;
+    private OOXmlFileFormats $ooXmlFileFormats;
+    private SplFileObject $previewFile;
+    private Language $targetLanguage;
+    private TextSourceFile $textSourceFile;
+
+    public function setUp(): void
+    {
+        parent::setUp();
+
+        Config\Aspose::setClientId('id');
+        Config\Aspose::setClientSecret('secret');
+
+        $this->mockClient = $this->mock(Client::class);
+        $this->app->instance(Client::class, $this->mockClient);
+
+        $this->app->register(OOXmlServiceProvider::class);
+
+        $this->factory = $this->app->make(
+            Preview\OOXmlPreviewFactory::class
+        );
+
+        $this->documentTextSourceMock = Mockery::mock(
+            Document\Export\SourceFiles\TextSourceInterface::class
+        );
+
+        $this->ooXmlFileFormats = $this->app->make(
+            OOXmlFileFormats::class
+        );
+
+        $this->targetLanguage = DBModels\LanguageFixture::create('ja');
+        $this->textSourceFile = DBModels\TextSourceFileFixture::create();
+
+        $this->previewFile = new SplFileObject(
+            __DIR__ . '/../Export/Formatters/files/preview/PowerPoint-formatted.html'
+        );
+    }
+
+    /**
+     * @covers ::translatedPreview()
+     */
+    public function testTranslatedPreviewPowerPoint(): void
+    {
+        $this->documentTextSourceMock->shouldReceive('textSourceFileFormat')
+            ->atLeast()
+            ->once()
+            ->andReturn($this->ooXmlFileFormats->pptx());
+
+        $this->documentTextSourceMock->shouldReceive('translationLanguage')
+            ->atLeast()
+            ->once()
+            ->andReturn($this->targetLanguage);
+
+        $this->documentTextSourceMock->shouldReceive('textSourceFiles')
+            ->twice()
+            ->andReturn([$this->textSourceFile]);
+
+        $this->documentTextSourceMock->shouldReceive('textSourceContents')
+            ->once()
+            ->andReturn('string');
+
+        $this->mockClient->shouldReceive('convertPptx')->once()->andReturn($this->previewFile);
+
+        $previewHtml = $this->factory->translatedPreview(
+            $this->documentTextSourceMock
+        );
+
+        self::assertInstanceOf(
+            Preview\TextFormatting\PlaceholderReplacer::class,
+            $previewHtml
+        );
+
+        self::assertInstanceOf(
+            DownloadableFileInterface::class,
+            $previewHtml
+        );
+    }
+}
diff --git a/tests/Integration/OOXml/Preview/OOXmlPreviewFactoryTest.php b/tests/Integration/OOXml/Preview/OOXmlPreviewFactoryTest.php
index 4e0e489fd24..45df1f68b2d 100644
--- a/tests/Integration/OOXml/Preview/OOXmlPreviewFactoryTest.php
+++ b/tests/Integration/OOXml/Preview/OOXmlPreviewFactoryTest.php
@@ -1,6 +1,6 @@
 <?php namespace Tests\Integration\OOXml\Preview;
 
-use App\DBModels;
+use App\Providers\OOXmlServiceProvider;
 use App\Services\Document;
 use App\Services\FileExport;
 use App\Services\OOXml;
@@ -35,6 +35,9 @@ public function setUp(): void
     {
         parent::setUp();
 
+        Tests\Config\Aspose::disable();
+        $this->app->register(OOXmlServiceProvider::class);
+
         $this->factory = $this->app->make(
             OOXml\Preview\OOXmlPreviewFactory::class
         );
diff --git a/tests/Integration/Pdf/PdfExport/PdfExporterTest.php b/tests/Integration/Pdf/PdfExport/PdfExporterTest.php
index ea619ec7e31..d007ecce484 100644
--- a/tests/Integration/Pdf/PdfExport/PdfExporterTest.php
+++ b/tests/Integration/Pdf/PdfExport/PdfExporterTest.php
@@ -288,7 +288,7 @@ public function testGenerateTranslatedPreview()
 
         $expectedText = $document->segments->reduce(function ($text, DBModels\Segment $segment) {
             $segmentTranslation = HtmlEncoder::encode($segment->segmentTranslation->text);
-            $text .= "<span data-segment-id=\"{$segment->id}\">" . $segmentTranslation . '</span> ';
+            $text .= "<tspan data-segment-id=\"{$segment->id}\">" . $segmentTranslation . '</tspan> ';
             return $text;
         }, '');
 
diff --git a/tests/Integration/Segment/Export/TextDocument/TextDocumentPreviewFactoryTest.php b/tests/Integration/Segment/Export/TextDocument/TextDocumentPreviewFactoryTest.php
index fcd9e46fe12..f8c59eb5986 100644
--- a/tests/Integration/Segment/Export/TextDocument/TextDocumentPreviewFactoryTest.php
+++ b/tests/Integration/Segment/Export/TextDocument/TextDocumentPreviewFactoryTest.php
@@ -276,13 +276,13 @@ public function testGenerateTranslatedPreview()
 
         list($firstSegment, $secondSegment) = $segments;
 
-        $expectedPreviewResponse = "<span data-segment-id=\"{$firstSegment->id}\">"
+        $expectedPreviewResponse = "<tspan data-segment-id=\"{$firstSegment->id}\">"
             . "Translation{$firstSegment->id}"
-            . '</span> '
+            . '</tspan> '
             . '<br /><br /><br />'
-            . "<span data-segment-id=\"{$secondSegment->id}\">"
+            . "<tspan data-segment-id=\"{$secondSegment->id}\">"
             . "Translation{$secondSegment->id}"
-            . '</span> ';
+            . '</tspan> ';
 
         $documentTextSource = $this->app->make(
             File\TextSource\DocumentFileFactory::class
diff --git a/tests/Integration/Segment/TextFormat/Attribute/HtmlWrapperTest.php b/tests/Integration/Segment/TextFormat/Attribute/HtmlWrapperTest.php
index c36a3d6434b..c7435d81bfb 100644
--- a/tests/Integration/Segment/TextFormat/Attribute/HtmlWrapperTest.php
+++ b/tests/Integration/Segment/TextFormat/Attribute/HtmlWrapperTest.php
@@ -38,7 +38,7 @@ public function testFormat()
             ->andReturn($segment->text);
 
         self::assertEquals(
-            '<span data-segment-id="' . $segment->id . '">' . $segment->text . '</span>',
+            '<tspan data-segment-id="' . $segment->id . '">' . $segment->text . '</tspan>',
             $htmlWrapper->format($segment)
         );
     }`
