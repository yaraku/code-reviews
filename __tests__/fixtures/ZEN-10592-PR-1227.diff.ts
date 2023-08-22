export const diff = `diff --git a/app/Services/OOXml/Parsing/XmlFileExtractors/XmlFileExtractorXlsx.php b/app/Services/OOXml/Parsing/XmlFileExtractors/XmlFileExtractorXlsx.php
index 2c2489d5d85..695d30573f5 100755
--- a/app/Services/OOXml/Parsing/XmlFileExtractors/XmlFileExtractorXlsx.php
+++ b/app/Services/OOXml/Parsing/XmlFileExtractors/XmlFileExtractorXlsx.php
@@ -46,6 +46,10 @@ protected function domMapsForFilenamePatterns(): array
                 ->setTagWithText('a:t')
                 ->setTagToMerge('a:p')
                 ->setTagToSkip('m:t'),
+
+            TextNodeSearchers\TextNodeDOMMap::create('xl\/diagrams\/data.*\.xml', '//a:t')
+                ->setTagWithText('a:t')
+                ->setTagToMerge('a:p'),
         ];
     }
 
diff --git a/tests/Integration/OOXml/Parsing/TextNodeSearchers/TextNodeSearcherTest.php b/tests/Integration/OOXml/Parsing/TextNodeSearchers/TextNodeSearcherTest.php
index 19918e6d3d7..8f69ad9431a 100644
--- a/tests/Integration/OOXml/Parsing/TextNodeSearchers/TextNodeSearcherTest.php
+++ b/tests/Integration/OOXml/Parsing/TextNodeSearchers/TextNodeSearcherTest.php
@@ -407,4 +407,51 @@ public function testItProperlyFiltersOutAllNonStrings(): void
 
         $this->assertCount(5, $result);
     }
+
+
+    /**
+     * @covers \App\Services\OOXml\Parsing\TextNodeSearchers\TextNodeSearcher::findAndMergeNodes()
+     */
+    public function testThatItProperlyQueriesDiagramsForXlsx(): void
+    {
+        Event::fake();
+
+        $countAndDiagrams = [
+            14 => file_get_contents(__DIR__ . '/files/ZEN-10592/diagram1.xml'),
+            11 => file_get_contents(__DIR__ . '/files/ZEN-10592/diagram2.xml')
+        ];
+
+        foreach ($countAndDiagrams as $count => $xml) {
+            $domDocument = new DOMDocument();
+            $domDocument->loadXML($xml);
+
+            $textNodeSearcher = app(
+                TextNodeSearcher::class,
+                [
+                    'domXPath' => app(
+                        DOMXPathXmlFile::class,
+                        [
+                            'document' => $domDocument,
+                            'filename' => 'file',
+                            'rawFileContents' => $xml,
+                        ]
+                    ),
+                    'domMap' => app(
+                        TextNodeDOMMap::class,
+                        [
+                            'filenamePattern' => 'xl\/diagrams\/data.*\.xml',
+                            'query' => '//a:t'
+                        ]
+                    )->setTagWithText('a:t')
+                    ->setTagToMerge('a:p'),
+                ]
+            );
+
+            $result = $textNodeSearcher->findAndMergeNodes();
+
+            Event::assertNotDispatched(MessageLogged::class);
+
+            $this->assertCount($count, $result);
+        } 
+    }
 }
diff --git a/tests/Integration/OOXml/Parsing/TextNodeSearchers/files/ZEN-10592/diagram1.xml b/tests/Integration/OOXml/Parsing/TextNodeSearchers/files/ZEN-10592/diagram1.xml
new file mode 100644
index 00000000000..13ff8d485e6
--- /dev/null
+++ b/tests/Integration/OOXml/Parsing/TextNodeSearchers/files/ZEN-10592/diagram1.xml
@@ -0,0 +1,1547 @@
+<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
+<dgm:dataModel
+	xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram"
+	xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
+	<dgm:ptLst>
+		<dgm:pt modelId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" type="doc">
+			<dgm:prSet loTypeId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4" loCatId="process" qsTypeId="urn:microsoft.com/office/officeart/2005/8/quickstyle/simple1" qsCatId="simple" csTypeId="urn:microsoft.com/office/officeart/2005/8/colors/accent1_1" csCatId="accent1" phldr="1"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{BD926F5B-4D66-447F-A067-E91A8817C796}">
+			<dgm:prSet phldrT="[テキスト]" custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:schemeClr val="tx1"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1200">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>依頼内容確認</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{AA9D13AC-090B-4093-8717-FE6C9462178B}" type="parTrans" cxnId="{A909C90D-FE51-47F4-8B05-1F8EFC810B2B}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{E291F547-7332-4389-8C66-1E97C4762FDF}" type="sibTrans" cxnId="{A909C90D-FE51-47F4-8B05-1F8EFC810B2B}">
+			<dgm:prSet/>
+			<dgm:spPr>
+				<a:solidFill>
+					<a:srgbClr val="FFC000"/>
+				</a:solidFill>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{50587718-BD75-428B-BFA1-40E1BA16D780}">
+			<dgm:prSet phldrT="[テキスト]" custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:schemeClr val="tx1"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>種別確認</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{6D89F534-0135-4954-9AA0-72917672073D}" type="parTrans" cxnId="{E352720C-F7F6-45AB-A96D-C482C1B5E5BD}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{BB1A061F-77C3-4DC5-ACFE-B5B62BA9898F}" type="sibTrans" cxnId="{E352720C-F7F6-45AB-A96D-C482C1B5E5BD}">
+			<dgm:prSet/>
+			<dgm:spPr>
+				<a:solidFill>
+					<a:srgbClr val="FFC000"/>
+				</a:solidFill>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{8235391A-8F1E-46D7-8562-7DB9C9BEFE12}">
+			<dgm:prSet phldrT="[テキスト]" custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:schemeClr val="tx1"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>設定ファイルの準備</a:t>
+					</a:r>
+					<a:r>
+						<a:rPr kumimoji="1" lang="en-US" altLang="ja-JP" sz="1100">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>1</a:t>
+					</a:r>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{8EBF8377-0143-4F93-868B-103C78179789}" type="parTrans" cxnId="{ACF1A440-4F9F-4319-9971-0190FFDB441B}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{D0327035-3E7F-4B5B-B572-40547ED7A65F}" type="sibTrans" cxnId="{ACF1A440-4F9F-4319-9971-0190FFDB441B}">
+			<dgm:prSet/>
+			<dgm:spPr>
+				<a:solidFill>
+					<a:srgbClr val="FFC000"/>
+				</a:solidFill>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{5FBE329C-D302-404C-9C7D-2AF9B13CAF1E}">
+			<dgm:prSet phldrT="[テキスト]" custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:schemeClr val="tx1"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>設定ファイルの準備</a:t>
+					</a:r>
+					<a:r>
+						<a:rPr kumimoji="1" lang="en-US" altLang="ja-JP" sz="1100">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>2</a:t>
+					</a:r>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{339FF520-5C8F-4661-8BA9-224F92A1A077}" type="parTrans" cxnId="{65E3D50C-B42F-478C-A88E-8477DFC0C4EF}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{8FD358C1-173C-40B3-A5D1-C6B810BD8C0E}" type="sibTrans" cxnId="{65E3D50C-B42F-478C-A88E-8477DFC0C4EF}">
+			<dgm:prSet/>
+			<dgm:spPr>
+				<a:solidFill>
+					<a:srgbClr val="FFC000"/>
+				</a:solidFill>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{371605D8-A079-4545-8547-268AF9B8E211}">
+			<dgm:prSet phldrT="[テキスト]" custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:schemeClr val="tx1"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>プロジェクトの準備</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{A3DF0E36-13EF-4614-B876-F25553C5D745}" type="parTrans" cxnId="{649B45E2-39B1-478E-BB32-B655E6147FA3}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{078EF98A-B62E-4936-A932-08506187750F}" type="sibTrans" cxnId="{649B45E2-39B1-478E-BB32-B655E6147FA3}">
+			<dgm:prSet/>
+			<dgm:spPr>
+				<a:solidFill>
+					<a:srgbClr val="FFC000"/>
+				</a:solidFill>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{45814BDB-C890-4C15-8802-413319612073}">
+			<dgm:prSet phldrT="[テキスト]" custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:schemeClr val="tx1"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>指摘項目の確認</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{B0755CC2-1312-4206-AAD3-274E3ED0E079}" type="parTrans" cxnId="{5A2AD253-281E-4968-82EC-F3AC9BFEFBDF}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{90D5330A-7439-43DA-BBB5-CB48095C67BC}" type="sibTrans" cxnId="{5A2AD253-281E-4968-82EC-F3AC9BFEFBDF}">
+			<dgm:prSet/>
+			<dgm:spPr>
+				<a:solidFill>
+					<a:srgbClr val="FFC000"/>
+				</a:solidFill>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{32C88A1E-DEA9-432C-8145-52A30CB815D1}">
+			<dgm:prSet phldrT="[テキスト]" custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:schemeClr val="tx1"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>対応方法検討</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{D5CF9E5E-73CB-44D2-B103-DD303A98A264}" type="parTrans" cxnId="{D1BCFD77-F7D9-45F2-81CD-BD891EA5EC0C}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{C935FB5E-E8AE-41D6-9E0A-DAC886014869}" type="sibTrans" cxnId="{D1BCFD77-F7D9-45F2-81CD-BD891EA5EC0C}">
+			<dgm:prSet/>
+			<dgm:spPr>
+				<a:solidFill>
+					<a:srgbClr val="FFC000"/>
+				</a:solidFill>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{E0AB9C2D-7266-49CD-ABFE-4DCBFA815D82}">
+			<dgm:prSet phldrT="[テキスト]" custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:schemeClr val="tx1"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>チェック</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{F18C5297-5E44-4F4F-BB54-BFB99239FDAD}" type="parTrans" cxnId="{2BCB8F81-675B-49EC-BA30-05F9B61226E9}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{67A41452-FECB-42CD-A8CE-3114A6738106}" type="sibTrans" cxnId="{2BCB8F81-675B-49EC-BA30-05F9B61226E9}">
+			<dgm:prSet/>
+			<dgm:spPr>
+				<a:solidFill>
+					<a:srgbClr val="FFC000"/>
+				</a:solidFill>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{9E1C8057-F6E6-4512-8E08-310A13985A9B}">
+			<dgm:prSet phldrT="[テキスト]" custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:schemeClr val="tx1"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>実行</a:t>
+					</a:r>
+					<a:r>
+						<a:rPr kumimoji="1" lang="en-US" altLang="ja-JP" sz="1100">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>2</a:t>
+					</a:r>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{3B0E138F-088E-49F1-8A20-7AEA2EA20FA4}" type="parTrans" cxnId="{BC3285AE-E026-4F91-8CD4-E2958E7581AD}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{326A788F-D0AB-4659-936D-B0D12CD986B3}" type="sibTrans" cxnId="{BC3285AE-E026-4F91-8CD4-E2958E7581AD}">
+			<dgm:prSet/>
+			<dgm:spPr>
+				<a:solidFill>
+					<a:srgbClr val="FFC000"/>
+				</a:solidFill>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{97E0EC10-9BCB-41DE-AB6A-C4450D08647E}">
+			<dgm:prSet custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:schemeClr val="tx1"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1200">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>資料の作成</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{BE8B3E2F-F74E-4803-B888-9B37FAD1458D}" type="parTrans" cxnId="{9CDF35FC-A8B1-4158-B793-25716E9CD1BE}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{48D61A6A-CC0D-4156-8865-A3F2316D34FF}" type="sibTrans" cxnId="{9CDF35FC-A8B1-4158-B793-25716E9CD1BE}">
+			<dgm:prSet/>
+			<dgm:spPr>
+				<a:solidFill>
+					<a:srgbClr val="FFC000"/>
+				</a:solidFill>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{2BE00C27-BC4A-4C1E-AFFE-993190ADA8EF}">
+			<dgm:prSet custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:schemeClr val="tx1"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1200">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>納期設定</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{7CD0D05B-DA94-46B6-BA31-86A05D2AC453}" type="parTrans" cxnId="{BF1DCAB1-EB02-42EF-904C-0C0D6780DA9E}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{6E7A9F2E-9919-4C8E-89E0-2D647199B328}" type="sibTrans" cxnId="{BF1DCAB1-EB02-42EF-904C-0C0D6780DA9E}">
+			<dgm:prSet/>
+			<dgm:spPr>
+				<a:solidFill>
+					<a:srgbClr val="FFC000"/>
+				</a:solidFill>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1100">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{4C62C069-6F04-4845-A1B9-A2CE4F2B87E7}">
+			<dgm:prSet custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:schemeClr val="tx1"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1200">
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>対応確認</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{70688FC5-40F6-48BB-8377-F378E1C427D0}" type="parTrans" cxnId="{3DBA77FE-0FE3-49A1-88E3-C6E22C9D26C4}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1600">
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{608D3015-0F88-4C44-93FA-AD1F4B6F1C0D}" type="sibTrans" cxnId="{3DBA77FE-0FE3-49A1-88E3-C6E22C9D26C4}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1600">
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{0370B490-029F-4CFA-8081-EDD58797E3CA}">
+			<dgm:prSet custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1200">
+							<a:solidFill>
+								<a:sysClr val="windowText" lastClr="000000"/>
+							</a:solidFill>
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>実行</a:t>
+					</a:r>
+					<a:r>
+						<a:rPr kumimoji="1" lang="en-US" altLang="ja-JP" sz="1200">
+							<a:solidFill>
+								<a:sysClr val="windowText" lastClr="000000"/>
+							</a:solidFill>
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>1</a:t>
+					</a:r>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1200">
+						<a:solidFill>
+							<a:sysClr val="windowText" lastClr="000000"/>
+						</a:solidFill>
+						<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+					</a:endParaRPr>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{C3CA72D4-1C3C-4F0F-A14E-29E05EFC9324}" type="parTrans" cxnId="{8D3A08BE-2292-40C4-B108-2131B7AA668A}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{3C61BE48-1E86-438E-A9E0-B9E9BBD25CDF}" type="sibTrans" cxnId="{8D3A08BE-2292-40C4-B108-2131B7AA668A}">
+			<dgm:prSet/>
+			<dgm:spPr>
+				<a:solidFill>
+					<a:srgbClr val="FFC000"/>
+				</a:solidFill>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{8539618C-5F23-4983-951A-B18DCCA100BD}">
+			<dgm:prSet custT="1"/>
+			<dgm:spPr>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US" sz="1200">
+							<a:solidFill>
+								<a:sysClr val="windowText" lastClr="000000"/>
+							</a:solidFill>
+							<a:latin typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+							<a:ea typeface="Meiryo UI" panose="020B0604030504040204" pitchFamily="50" charset="-128"/>
+						</a:rPr>
+						<a:t>修正</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{96F3A179-E569-4EA3-970E-37C8F2505EF7}" type="parTrans" cxnId="{09BDCA13-819E-49AD-9014-398C018F84DE}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{0F3FE6A7-114D-4342-AB43-A62174EF1B51}" type="sibTrans" cxnId="{09BDCA13-819E-49AD-9014-398C018F84DE}">
+			<dgm:prSet/>
+			<dgm:spPr>
+				<a:solidFill>
+					<a:srgbClr val="FFC000"/>
+				</a:solidFill>
+				<a:ln>
+					<a:solidFill>
+						<a:sysClr val="windowText" lastClr="000000"/>
+					</a:solidFill>
+				</a:ln>
+			</dgm:spPr>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" type="pres">
+			<dgm:prSet presAssocID="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" presName="Name0" presStyleCnt="0">
+				<dgm:presLayoutVars>
+					<dgm:dir/>
+					<dgm:resizeHandles/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{8FE88156-4C26-446A-B765-D6A99AEE382B}" type="pres">
+			<dgm:prSet presAssocID="{BD926F5B-4D66-447F-A067-E91A8817C796}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{3EF5F561-C5FB-40FC-A1E2-AD4D56E37BA0}" type="pres">
+			<dgm:prSet presAssocID="{BD926F5B-4D66-447F-A067-E91A8817C796}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{7EBB6F00-F778-4D3B-93BC-B594E767B7E4}" type="pres">
+			<dgm:prSet presAssocID="{BD926F5B-4D66-447F-A067-E91A8817C796}" presName="node" presStyleLbl="node1" presStyleIdx="0" presStyleCnt="14">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{F1844C5A-2B3C-47DF-BFE0-77A8510841DB}" type="pres">
+			<dgm:prSet presAssocID="{E291F547-7332-4389-8C66-1E97C4762FDF}" presName="sibTrans" presStyleLbl="bgSibTrans2D1" presStyleIdx="0" presStyleCnt="13"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{898AE519-2A30-40A8-909F-AE1637AB0CB3}" type="pres">
+			<dgm:prSet presAssocID="{50587718-BD75-428B-BFA1-40E1BA16D780}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{5A8EBE3E-72A3-421E-897C-B0D3BFCC217E}" type="pres">
+			<dgm:prSet presAssocID="{50587718-BD75-428B-BFA1-40E1BA16D780}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{F5D793B6-95D4-4DEA-927E-7DFCC9767022}" type="pres">
+			<dgm:prSet presAssocID="{50587718-BD75-428B-BFA1-40E1BA16D780}" presName="node" presStyleLbl="node1" presStyleIdx="1" presStyleCnt="14">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{B84BDA16-CC4F-438C-837C-99F9BC9F52D7}" type="pres">
+			<dgm:prSet presAssocID="{BB1A061F-77C3-4DC5-ACFE-B5B62BA9898F}" presName="sibTrans" presStyleLbl="bgSibTrans2D1" presStyleIdx="1" presStyleCnt="13"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{F8599B6A-9CBC-4477-A496-7BFBA827525F}" type="pres">
+			<dgm:prSet presAssocID="{8235391A-8F1E-46D7-8562-7DB9C9BEFE12}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{321CEB1B-D84B-4B12-81EB-368D6637E720}" type="pres">
+			<dgm:prSet presAssocID="{8235391A-8F1E-46D7-8562-7DB9C9BEFE12}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{A09DAC49-5E36-4C8D-B148-8F88C29CFDE5}" type="pres">
+			<dgm:prSet presAssocID="{8235391A-8F1E-46D7-8562-7DB9C9BEFE12}" presName="node" presStyleLbl="node1" presStyleIdx="2" presStyleCnt="14">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{A347D07C-AB4A-4505-B3E9-1CE3C7E446CB}" type="pres">
+			<dgm:prSet presAssocID="{D0327035-3E7F-4B5B-B572-40547ED7A65F}" presName="sibTrans" presStyleLbl="bgSibTrans2D1" presStyleIdx="2" presStyleCnt="13"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{13F8ADA2-1B5E-47FD-A17F-7987D135003A}" type="pres">
+			<dgm:prSet presAssocID="{5FBE329C-D302-404C-9C7D-2AF9B13CAF1E}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{B8868634-8C76-4EA0-B11F-640FCE9F41B0}" type="pres">
+			<dgm:prSet presAssocID="{5FBE329C-D302-404C-9C7D-2AF9B13CAF1E}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{CD9B8652-C652-418C-B5F5-2CF9E2B7A24A}" type="pres">
+			<dgm:prSet presAssocID="{5FBE329C-D302-404C-9C7D-2AF9B13CAF1E}" presName="node" presStyleLbl="node1" presStyleIdx="3" presStyleCnt="14">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{BEAFB007-4BBE-46BD-ACCA-DD93AA3BF06A}" type="pres">
+			<dgm:prSet presAssocID="{8FD358C1-173C-40B3-A5D1-C6B810BD8C0E}" presName="sibTrans" presStyleLbl="bgSibTrans2D1" presStyleIdx="3" presStyleCnt="13"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{90CB49C5-FCB7-4E1C-AB24-EA38C80BC084}" type="pres">
+			<dgm:prSet presAssocID="{371605D8-A079-4545-8547-268AF9B8E211}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{6775491A-0675-4592-96DC-D8E3760AC7D2}" type="pres">
+			<dgm:prSet presAssocID="{371605D8-A079-4545-8547-268AF9B8E211}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{21DB1949-7554-4E80-8BF3-95C1692912B7}" type="pres">
+			<dgm:prSet presAssocID="{371605D8-A079-4545-8547-268AF9B8E211}" presName="node" presStyleLbl="node1" presStyleIdx="4" presStyleCnt="14">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{BB1848DA-77E1-4566-B124-63C028CBF042}" type="pres">
+			<dgm:prSet presAssocID="{078EF98A-B62E-4936-A932-08506187750F}" presName="sibTrans" presStyleLbl="bgSibTrans2D1" presStyleIdx="4" presStyleCnt="13"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{33B64AFF-3690-4469-B5CC-684A71882EB1}" type="pres">
+			<dgm:prSet presAssocID="{0370B490-029F-4CFA-8081-EDD58797E3CA}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{626B850A-861E-4DD6-A18E-1E8BB8435AE5}" type="pres">
+			<dgm:prSet presAssocID="{0370B490-029F-4CFA-8081-EDD58797E3CA}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{BAD1F073-C018-4C51-8464-14EE5A17C019}" type="pres">
+			<dgm:prSet presAssocID="{0370B490-029F-4CFA-8081-EDD58797E3CA}" presName="node" presStyleLbl="node1" presStyleIdx="5" presStyleCnt="14">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{838344C2-F490-4020-9EDE-FC7823F85376}" type="pres">
+			<dgm:prSet presAssocID="{3C61BE48-1E86-438E-A9E0-B9E9BBD25CDF}" presName="sibTrans" presStyleLbl="bgSibTrans2D1" presStyleIdx="5" presStyleCnt="13"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{0855ACCD-BC44-47F4-9F32-9018BB56B7F1}" type="pres">
+			<dgm:prSet presAssocID="{45814BDB-C890-4C15-8802-413319612073}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{1F2A9FBE-BC00-4224-823F-D5EE7C434979}" type="pres">
+			<dgm:prSet presAssocID="{45814BDB-C890-4C15-8802-413319612073}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{5FC17F62-57B4-4BF9-97C0-349CD082E4EF}" type="pres">
+			<dgm:prSet presAssocID="{45814BDB-C890-4C15-8802-413319612073}" presName="node" presStyleLbl="node1" presStyleIdx="6" presStyleCnt="14">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{A7FF0C97-474C-41EC-AAC9-E5E4C018F5AD}" type="pres">
+			<dgm:prSet presAssocID="{90D5330A-7439-43DA-BBB5-CB48095C67BC}" presName="sibTrans" presStyleLbl="bgSibTrans2D1" presStyleIdx="6" presStyleCnt="13"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{8F3E7561-6A80-4097-AAED-BCE4D4A0182F}" type="pres">
+			<dgm:prSet presAssocID="{32C88A1E-DEA9-432C-8145-52A30CB815D1}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{35C008B4-7CCC-4103-AD58-E94082CEE524}" type="pres">
+			<dgm:prSet presAssocID="{32C88A1E-DEA9-432C-8145-52A30CB815D1}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{2438C6BB-A383-491A-9B35-F4C68046FD41}" type="pres">
+			<dgm:prSet presAssocID="{32C88A1E-DEA9-432C-8145-52A30CB815D1}" presName="node" presStyleLbl="node1" presStyleIdx="7" presStyleCnt="14">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{FD20518A-20D7-4542-9C2B-0535C919AC8B}" type="pres">
+			<dgm:prSet presAssocID="{C935FB5E-E8AE-41D6-9E0A-DAC886014869}" presName="sibTrans" presStyleLbl="bgSibTrans2D1" presStyleIdx="7" presStyleCnt="13"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{5B56B780-063C-4EF4-BCE4-3CE19577F1A4}" type="pres">
+			<dgm:prSet presAssocID="{8539618C-5F23-4983-951A-B18DCCA100BD}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{8D071AE3-310B-4488-93F2-8D3F4B33D1A3}" type="pres">
+			<dgm:prSet presAssocID="{8539618C-5F23-4983-951A-B18DCCA100BD}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{FD468FD4-6782-40E7-83B5-EE4EE9E25C9A}" type="pres">
+			<dgm:prSet presAssocID="{8539618C-5F23-4983-951A-B18DCCA100BD}" presName="node" presStyleLbl="node1" presStyleIdx="8" presStyleCnt="14">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{308935A9-984F-4A53-99D6-436854026531}" type="pres">
+			<dgm:prSet presAssocID="{0F3FE6A7-114D-4342-AB43-A62174EF1B51}" presName="sibTrans" presStyleLbl="bgSibTrans2D1" presStyleIdx="8" presStyleCnt="13"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{60DD2D96-E277-4310-8671-3F451CC6414F}" type="pres">
+			<dgm:prSet presAssocID="{E0AB9C2D-7266-49CD-ABFE-4DCBFA815D82}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{F1F7C825-FA40-457D-B33E-AC75CE4B320A}" type="pres">
+			<dgm:prSet presAssocID="{E0AB9C2D-7266-49CD-ABFE-4DCBFA815D82}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{BC60EB40-B9A1-4BE4-8C71-759A83255BCA}" type="pres">
+			<dgm:prSet presAssocID="{E0AB9C2D-7266-49CD-ABFE-4DCBFA815D82}" presName="node" presStyleLbl="node1" presStyleIdx="9" presStyleCnt="14">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{C92A4B1E-9BFB-474A-AEB2-7ADB0C73080D}" type="pres">
+			<dgm:prSet presAssocID="{67A41452-FECB-42CD-A8CE-3114A6738106}" presName="sibTrans" presStyleLbl="bgSibTrans2D1" presStyleIdx="9" presStyleCnt="13"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{BF044522-48CE-4AF4-9220-43364B70BA64}" type="pres">
+			<dgm:prSet presAssocID="{9E1C8057-F6E6-4512-8E08-310A13985A9B}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{FCDF02E1-14D9-4566-8603-362CC30AC025}" type="pres">
+			<dgm:prSet presAssocID="{9E1C8057-F6E6-4512-8E08-310A13985A9B}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{586E90DB-5AD8-4C61-8142-408BAAFDD983}" type="pres">
+			<dgm:prSet presAssocID="{9E1C8057-F6E6-4512-8E08-310A13985A9B}" presName="node" presStyleLbl="node1" presStyleIdx="10" presStyleCnt="14" custLinFactNeighborX="-1457" custLinFactNeighborY="-147">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{7BB5B8EC-3C4C-4EB7-B500-6718DCF3A8D5}" type="pres">
+			<dgm:prSet presAssocID="{326A788F-D0AB-4659-936D-B0D12CD986B3}" presName="sibTrans" presStyleLbl="bgSibTrans2D1" presStyleIdx="10" presStyleCnt="13"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{70E4A7AE-F66D-4B3A-8BAC-18B00B97B5BF}" type="pres">
+			<dgm:prSet presAssocID="{97E0EC10-9BCB-41DE-AB6A-C4450D08647E}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{64739A94-F973-467D-8660-40AF8ED521DF}" type="pres">
+			<dgm:prSet presAssocID="{97E0EC10-9BCB-41DE-AB6A-C4450D08647E}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{69F87673-5874-4966-BE90-98D614A7FDFB}" type="pres">
+			<dgm:prSet presAssocID="{97E0EC10-9BCB-41DE-AB6A-C4450D08647E}" presName="node" presStyleLbl="node1" presStyleIdx="11" presStyleCnt="14">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{475760A5-1959-47C9-95A7-43DD963E71CA}" type="pres">
+			<dgm:prSet presAssocID="{48D61A6A-CC0D-4156-8865-A3F2316D34FF}" presName="sibTrans" presStyleLbl="bgSibTrans2D1" presStyleIdx="11" presStyleCnt="13"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{A1636299-5887-485A-948F-DA2BEC3FE399}" type="pres">
+			<dgm:prSet presAssocID="{2BE00C27-BC4A-4C1E-AFFE-993190ADA8EF}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{B39DD0DE-9EC8-443E-BC38-5B9CCCE97748}" type="pres">
+			<dgm:prSet presAssocID="{2BE00C27-BC4A-4C1E-AFFE-993190ADA8EF}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{D9FFA2FC-216F-4449-95C5-948D0556B542}" type="pres">
+			<dgm:prSet presAssocID="{2BE00C27-BC4A-4C1E-AFFE-993190ADA8EF}" presName="node" presStyleLbl="node1" presStyleIdx="12" presStyleCnt="14">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{ABA7F0D9-F4F8-4245-A8D6-5FD46AC1D41B}" type="pres">
+			<dgm:prSet presAssocID="{6E7A9F2E-9919-4C8E-89E0-2D647199B328}" presName="sibTrans" presStyleLbl="bgSibTrans2D1" presStyleIdx="12" presStyleCnt="13"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{DBAB2A36-4C62-4482-99EE-8D4B1917EC57}" type="pres">
+			<dgm:prSet presAssocID="{4C62C069-6F04-4845-A1B9-A2CE4F2B87E7}" presName="compNode" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{EB179D26-F4E0-4083-9B7D-A89AAC6F1FB6}" type="pres">
+			<dgm:prSet presAssocID="{4C62C069-6F04-4845-A1B9-A2CE4F2B87E7}" presName="dummyConnPt" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{C9A27D7E-3F13-4D84-A732-4ED6135DA994}" type="pres">
+			<dgm:prSet presAssocID="{4C62C069-6F04-4845-A1B9-A2CE4F2B87E7}" presName="node" presStyleLbl="node1" presStyleIdx="13" presStyleCnt="14">
+				<dgm:presLayoutVars>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+	</dgm:ptLst>
+	<dgm:cxnLst>
+		<dgm:cxn modelId="{A909C90D-FE51-47F4-8B05-1F8EFC810B2B}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{BD926F5B-4D66-447F-A067-E91A8817C796}" srcOrd="0" destOrd="0" parTransId="{AA9D13AC-090B-4093-8717-FE6C9462178B}" sibTransId="{E291F547-7332-4389-8C66-1E97C4762FDF}"/>
+		<dgm:cxn modelId="{D7342B40-BEE7-49AF-A696-E35D97E1E0F0}" type="presOf" srcId="{9E1C8057-F6E6-4512-8E08-310A13985A9B}" destId="{586E90DB-5AD8-4C61-8142-408BAAFDD983}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{C049DAE2-70CA-4ED0-B4AA-27552F58A3CA}" type="presOf" srcId="{0F3FE6A7-114D-4342-AB43-A62174EF1B51}" destId="{308935A9-984F-4A53-99D6-436854026531}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{80953652-EED0-469E-BB76-62318E3B891F}" type="presOf" srcId="{97E0EC10-9BCB-41DE-AB6A-C4450D08647E}" destId="{69F87673-5874-4966-BE90-98D614A7FDFB}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{EDBCBE84-48C5-4C7A-A627-4B83E0134940}" type="presOf" srcId="{371605D8-A079-4545-8547-268AF9B8E211}" destId="{21DB1949-7554-4E80-8BF3-95C1692912B7}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{E352720C-F7F6-45AB-A96D-C482C1B5E5BD}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{50587718-BD75-428B-BFA1-40E1BA16D780}" srcOrd="1" destOrd="0" parTransId="{6D89F534-0135-4954-9AA0-72917672073D}" sibTransId="{BB1A061F-77C3-4DC5-ACFE-B5B62BA9898F}"/>
+		<dgm:cxn modelId="{996ECB70-CF8E-470B-9BA8-95F0490166AB}" type="presOf" srcId="{4C62C069-6F04-4845-A1B9-A2CE4F2B87E7}" destId="{C9A27D7E-3F13-4D84-A732-4ED6135DA994}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{54B4E0B2-2F95-4BF7-AC45-9F10597B18F0}" type="presOf" srcId="{8FD358C1-173C-40B3-A5D1-C6B810BD8C0E}" destId="{BEAFB007-4BBE-46BD-ACCA-DD93AA3BF06A}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{271DC846-2BD7-47BC-9730-4582EA467661}" type="presOf" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{72BE2A97-CE94-445B-B33C-657D5888EE1E}" type="presOf" srcId="{C935FB5E-E8AE-41D6-9E0A-DAC886014869}" destId="{FD20518A-20D7-4542-9C2B-0535C919AC8B}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{5BB07892-3251-48EB-BF87-7261D6DE17AE}" type="presOf" srcId="{32C88A1E-DEA9-432C-8145-52A30CB815D1}" destId="{2438C6BB-A383-491A-9B35-F4C68046FD41}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{5A2AD253-281E-4968-82EC-F3AC9BFEFBDF}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{45814BDB-C890-4C15-8802-413319612073}" srcOrd="6" destOrd="0" parTransId="{B0755CC2-1312-4206-AAD3-274E3ED0E079}" sibTransId="{90D5330A-7439-43DA-BBB5-CB48095C67BC}"/>
+		<dgm:cxn modelId="{498307B9-5281-47DE-9B65-030B66D73E49}" type="presOf" srcId="{0370B490-029F-4CFA-8081-EDD58797E3CA}" destId="{BAD1F073-C018-4C51-8464-14EE5A17C019}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{08547998-4906-411F-93B7-E56B8D0E68E9}" type="presOf" srcId="{5FBE329C-D302-404C-9C7D-2AF9B13CAF1E}" destId="{CD9B8652-C652-418C-B5F5-2CF9E2B7A24A}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{FABE001C-AC09-4DDB-B5A5-B718A01BEA62}" type="presOf" srcId="{E0AB9C2D-7266-49CD-ABFE-4DCBFA815D82}" destId="{BC60EB40-B9A1-4BE4-8C71-759A83255BCA}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{8A01C386-70EE-4205-8CFD-E482BBBFF587}" type="presOf" srcId="{67A41452-FECB-42CD-A8CE-3114A6738106}" destId="{C92A4B1E-9BFB-474A-AEB2-7ADB0C73080D}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{8E3ECDEE-9FA1-4B8B-929E-3190F32750CB}" type="presOf" srcId="{45814BDB-C890-4C15-8802-413319612073}" destId="{5FC17F62-57B4-4BF9-97C0-349CD082E4EF}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{9CDF35FC-A8B1-4158-B793-25716E9CD1BE}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{97E0EC10-9BCB-41DE-AB6A-C4450D08647E}" srcOrd="11" destOrd="0" parTransId="{BE8B3E2F-F74E-4803-B888-9B37FAD1458D}" sibTransId="{48D61A6A-CC0D-4156-8865-A3F2316D34FF}"/>
+		<dgm:cxn modelId="{3FDD1CD6-1517-431C-9D27-D640FBDAE0AD}" type="presOf" srcId="{50587718-BD75-428B-BFA1-40E1BA16D780}" destId="{F5D793B6-95D4-4DEA-927E-7DFCC9767022}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{23EF9A53-422A-4CAE-8901-AAEBB28C1AED}" type="presOf" srcId="{6E7A9F2E-9919-4C8E-89E0-2D647199B328}" destId="{ABA7F0D9-F4F8-4245-A8D6-5FD46AC1D41B}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{AFBC1B88-BB48-43E5-AE5C-6C6FF03C7478}" type="presOf" srcId="{8235391A-8F1E-46D7-8562-7DB9C9BEFE12}" destId="{A09DAC49-5E36-4C8D-B148-8F88C29CFDE5}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{9BA5CC8F-E227-4524-BC9B-10268A3A5AAB}" type="presOf" srcId="{326A788F-D0AB-4659-936D-B0D12CD986B3}" destId="{7BB5B8EC-3C4C-4EB7-B500-6718DCF3A8D5}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{59A59175-FF6E-483F-8A00-03D366506048}" type="presOf" srcId="{078EF98A-B62E-4936-A932-08506187750F}" destId="{BB1848DA-77E1-4566-B124-63C028CBF042}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{649B45E2-39B1-478E-BB32-B655E6147FA3}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{371605D8-A079-4545-8547-268AF9B8E211}" srcOrd="4" destOrd="0" parTransId="{A3DF0E36-13EF-4614-B876-F25553C5D745}" sibTransId="{078EF98A-B62E-4936-A932-08506187750F}"/>
+		<dgm:cxn modelId="{09BDCA13-819E-49AD-9014-398C018F84DE}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{8539618C-5F23-4983-951A-B18DCCA100BD}" srcOrd="8" destOrd="0" parTransId="{96F3A179-E569-4EA3-970E-37C8F2505EF7}" sibTransId="{0F3FE6A7-114D-4342-AB43-A62174EF1B51}"/>
+		<dgm:cxn modelId="{BF1DCAB1-EB02-42EF-904C-0C0D6780DA9E}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{2BE00C27-BC4A-4C1E-AFFE-993190ADA8EF}" srcOrd="12" destOrd="0" parTransId="{7CD0D05B-DA94-46B6-BA31-86A05D2AC453}" sibTransId="{6E7A9F2E-9919-4C8E-89E0-2D647199B328}"/>
+		<dgm:cxn modelId="{70A1D7BE-2D94-432A-A2F6-B092C9E0913E}" type="presOf" srcId="{E291F547-7332-4389-8C66-1E97C4762FDF}" destId="{F1844C5A-2B3C-47DF-BFE0-77A8510841DB}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{65E3D50C-B42F-478C-A88E-8477DFC0C4EF}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{5FBE329C-D302-404C-9C7D-2AF9B13CAF1E}" srcOrd="3" destOrd="0" parTransId="{339FF520-5C8F-4661-8BA9-224F92A1A077}" sibTransId="{8FD358C1-173C-40B3-A5D1-C6B810BD8C0E}"/>
+		<dgm:cxn modelId="{8D3A08BE-2292-40C4-B108-2131B7AA668A}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{0370B490-029F-4CFA-8081-EDD58797E3CA}" srcOrd="5" destOrd="0" parTransId="{C3CA72D4-1C3C-4F0F-A14E-29E05EFC9324}" sibTransId="{3C61BE48-1E86-438E-A9E0-B9E9BBD25CDF}"/>
+		<dgm:cxn modelId="{3DBA77FE-0FE3-49A1-88E3-C6E22C9D26C4}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{4C62C069-6F04-4845-A1B9-A2CE4F2B87E7}" srcOrd="13" destOrd="0" parTransId="{70688FC5-40F6-48BB-8377-F378E1C427D0}" sibTransId="{608D3015-0F88-4C44-93FA-AD1F4B6F1C0D}"/>
+		<dgm:cxn modelId="{44A054F7-64CE-4794-8D28-132F149E4788}" type="presOf" srcId="{90D5330A-7439-43DA-BBB5-CB48095C67BC}" destId="{A7FF0C97-474C-41EC-AAC9-E5E4C018F5AD}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{1869768C-1BF0-4392-8D04-A357CA5A7A4D}" type="presOf" srcId="{BB1A061F-77C3-4DC5-ACFE-B5B62BA9898F}" destId="{B84BDA16-CC4F-438C-837C-99F9BC9F52D7}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{BC3285AE-E026-4F91-8CD4-E2958E7581AD}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{9E1C8057-F6E6-4512-8E08-310A13985A9B}" srcOrd="10" destOrd="0" parTransId="{3B0E138F-088E-49F1-8A20-7AEA2EA20FA4}" sibTransId="{326A788F-D0AB-4659-936D-B0D12CD986B3}"/>
+		<dgm:cxn modelId="{D3BE4F85-3BF1-4672-9A85-D22417A0327D}" type="presOf" srcId="{3C61BE48-1E86-438E-A9E0-B9E9BBD25CDF}" destId="{838344C2-F490-4020-9EDE-FC7823F85376}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{2BCB8F81-675B-49EC-BA30-05F9B61226E9}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{E0AB9C2D-7266-49CD-ABFE-4DCBFA815D82}" srcOrd="9" destOrd="0" parTransId="{F18C5297-5E44-4F4F-BB54-BFB99239FDAD}" sibTransId="{67A41452-FECB-42CD-A8CE-3114A6738106}"/>
+		<dgm:cxn modelId="{1C56C14F-C581-411E-A392-9344CFB282AE}" type="presOf" srcId="{BD926F5B-4D66-447F-A067-E91A8817C796}" destId="{7EBB6F00-F778-4D3B-93BC-B594E767B7E4}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{A304E583-C5A0-428C-A2D9-8476EC8EEDF7}" type="presOf" srcId="{2BE00C27-BC4A-4C1E-AFFE-993190ADA8EF}" destId="{D9FFA2FC-216F-4449-95C5-948D0556B542}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{6CD8671A-951D-4EB7-AD47-08707F38F861}" type="presOf" srcId="{8539618C-5F23-4983-951A-B18DCCA100BD}" destId="{FD468FD4-6782-40E7-83B5-EE4EE9E25C9A}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{ACF1A440-4F9F-4319-9971-0190FFDB441B}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{8235391A-8F1E-46D7-8562-7DB9C9BEFE12}" srcOrd="2" destOrd="0" parTransId="{8EBF8377-0143-4F93-868B-103C78179789}" sibTransId="{D0327035-3E7F-4B5B-B572-40547ED7A65F}"/>
+		<dgm:cxn modelId="{D1BCFD77-F7D9-45F2-81CD-BD891EA5EC0C}" srcId="{300E3592-FC3F-48A2-8B93-17DDECB392ED}" destId="{32C88A1E-DEA9-432C-8145-52A30CB815D1}" srcOrd="7" destOrd="0" parTransId="{D5CF9E5E-73CB-44D2-B103-DD303A98A264}" sibTransId="{C935FB5E-E8AE-41D6-9E0A-DAC886014869}"/>
+		<dgm:cxn modelId="{120D8528-0565-4217-92F7-9746168F2C55}" type="presOf" srcId="{48D61A6A-CC0D-4156-8865-A3F2316D34FF}" destId="{475760A5-1959-47C9-95A7-43DD963E71CA}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{76165B2F-54DA-402B-A455-33DAA9156889}" type="presOf" srcId="{D0327035-3E7F-4B5B-B572-40547ED7A65F}" destId="{A347D07C-AB4A-4505-B3E9-1CE3C7E446CB}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{D967487E-D6BC-466D-82FD-5F39F8476387}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{8FE88156-4C26-446A-B765-D6A99AEE382B}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{05662CB6-D801-4B84-848F-11068DB4F07D}" type="presParOf" srcId="{8FE88156-4C26-446A-B765-D6A99AEE382B}" destId="{3EF5F561-C5FB-40FC-A1E2-AD4D56E37BA0}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{3C1D11C5-C5F6-4E60-97FE-72464D9F314F}" type="presParOf" srcId="{8FE88156-4C26-446A-B765-D6A99AEE382B}" destId="{7EBB6F00-F778-4D3B-93BC-B594E767B7E4}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{E8658B4A-C82C-4335-A43C-FEFF74F86566}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{F1844C5A-2B3C-47DF-BFE0-77A8510841DB}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{E5B4AA27-8DF8-4AE9-AA75-A9D8E02D0B09}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{898AE519-2A30-40A8-909F-AE1637AB0CB3}" srcOrd="2" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{8D2A9B04-DCF0-4BF6-B128-659B43EAAD7B}" type="presParOf" srcId="{898AE519-2A30-40A8-909F-AE1637AB0CB3}" destId="{5A8EBE3E-72A3-421E-897C-B0D3BFCC217E}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{5CD13193-EF0E-46A3-84C7-AA3485A6BBA5}" type="presParOf" srcId="{898AE519-2A30-40A8-909F-AE1637AB0CB3}" destId="{F5D793B6-95D4-4DEA-927E-7DFCC9767022}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{A18E8B7F-CF0E-4B5E-8DAC-B0299CC63C29}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{B84BDA16-CC4F-438C-837C-99F9BC9F52D7}" srcOrd="3" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{08322B62-B6F6-4C80-B449-BCA6E4B68898}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{F8599B6A-9CBC-4477-A496-7BFBA827525F}" srcOrd="4" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{22A0CDC3-1980-4033-80D9-610919A69394}" type="presParOf" srcId="{F8599B6A-9CBC-4477-A496-7BFBA827525F}" destId="{321CEB1B-D84B-4B12-81EB-368D6637E720}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{4F770E68-B52C-4611-A676-1651F856E320}" type="presParOf" srcId="{F8599B6A-9CBC-4477-A496-7BFBA827525F}" destId="{A09DAC49-5E36-4C8D-B148-8F88C29CFDE5}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{E16C9C0F-B609-4D56-81AD-CE97C9BA5272}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{A347D07C-AB4A-4505-B3E9-1CE3C7E446CB}" srcOrd="5" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{1915EC42-3145-483B-83EB-56471C159E5D}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{13F8ADA2-1B5E-47FD-A17F-7987D135003A}" srcOrd="6" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{78CF31C9-855A-49F6-B129-8FF8718A4FFC}" type="presParOf" srcId="{13F8ADA2-1B5E-47FD-A17F-7987D135003A}" destId="{B8868634-8C76-4EA0-B11F-640FCE9F41B0}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{CB71BC29-AC41-4EFE-8F05-0DA48FD42521}" type="presParOf" srcId="{13F8ADA2-1B5E-47FD-A17F-7987D135003A}" destId="{CD9B8652-C652-418C-B5F5-2CF9E2B7A24A}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{97EAABDE-7856-4E18-8B4D-449495210145}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{BEAFB007-4BBE-46BD-ACCA-DD93AA3BF06A}" srcOrd="7" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{53BBE2C3-A076-4610-B11E-2F5E2F46E615}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{90CB49C5-FCB7-4E1C-AB24-EA38C80BC084}" srcOrd="8" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{01CAF4DD-23E2-4783-9ECE-6070EC44A788}" type="presParOf" srcId="{90CB49C5-FCB7-4E1C-AB24-EA38C80BC084}" destId="{6775491A-0675-4592-96DC-D8E3760AC7D2}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{88181528-49CB-4486-9A5B-D12CE76814A9}" type="presParOf" srcId="{90CB49C5-FCB7-4E1C-AB24-EA38C80BC084}" destId="{21DB1949-7554-4E80-8BF3-95C1692912B7}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{491C18E2-1680-4E59-914E-244F4F0283BA}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{BB1848DA-77E1-4566-B124-63C028CBF042}" srcOrd="9" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{E0B7CD6E-E026-4BFD-BF92-50866A6120D6}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{33B64AFF-3690-4469-B5CC-684A71882EB1}" srcOrd="10" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{C936844D-D881-4365-8152-A34473D18ED4}" type="presParOf" srcId="{33B64AFF-3690-4469-B5CC-684A71882EB1}" destId="{626B850A-861E-4DD6-A18E-1E8BB8435AE5}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{A4DF9F93-E322-4524-BA0F-8896DA6E0AD6}" type="presParOf" srcId="{33B64AFF-3690-4469-B5CC-684A71882EB1}" destId="{BAD1F073-C018-4C51-8464-14EE5A17C019}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{6A0CDCAB-8DB9-4815-9867-3F98F938495B}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{838344C2-F490-4020-9EDE-FC7823F85376}" srcOrd="11" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{6E2E99C2-D5D2-4BF4-B714-6B1FD908FF41}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{0855ACCD-BC44-47F4-9F32-9018BB56B7F1}" srcOrd="12" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{FB38CE32-ECEF-43B5-B941-BB824C658D50}" type="presParOf" srcId="{0855ACCD-BC44-47F4-9F32-9018BB56B7F1}" destId="{1F2A9FBE-BC00-4224-823F-D5EE7C434979}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{65B1ECED-26E2-4ED0-AE0D-BA750F335109}" type="presParOf" srcId="{0855ACCD-BC44-47F4-9F32-9018BB56B7F1}" destId="{5FC17F62-57B4-4BF9-97C0-349CD082E4EF}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{5E174685-0C0D-4A8E-B114-C8DBAAC1C643}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{A7FF0C97-474C-41EC-AAC9-E5E4C018F5AD}" srcOrd="13" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{5B2D9D6A-025D-426E-A7D9-4C6DC59293DD}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{8F3E7561-6A80-4097-AAED-BCE4D4A0182F}" srcOrd="14" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{1E4F9610-6AAE-4EDF-8770-F7E59B5DE8A4}" type="presParOf" srcId="{8F3E7561-6A80-4097-AAED-BCE4D4A0182F}" destId="{35C008B4-7CCC-4103-AD58-E94082CEE524}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{1B05425A-C3FF-4B21-A8C6-688C4A5E3077}" type="presParOf" srcId="{8F3E7561-6A80-4097-AAED-BCE4D4A0182F}" destId="{2438C6BB-A383-491A-9B35-F4C68046FD41}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{07770699-2F58-43A5-9747-5FDE81437AED}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{FD20518A-20D7-4542-9C2B-0535C919AC8B}" srcOrd="15" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{740F67E5-E10D-4BEB-B712-FFEBD0841AC6}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{5B56B780-063C-4EF4-BCE4-3CE19577F1A4}" srcOrd="16" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{761FFC5C-81FC-4AF1-A194-C1B18C323B88}" type="presParOf" srcId="{5B56B780-063C-4EF4-BCE4-3CE19577F1A4}" destId="{8D071AE3-310B-4488-93F2-8D3F4B33D1A3}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{D622C7FD-2A69-4E08-B04D-4ADF16F05BF4}" type="presParOf" srcId="{5B56B780-063C-4EF4-BCE4-3CE19577F1A4}" destId="{FD468FD4-6782-40E7-83B5-EE4EE9E25C9A}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{7E2DFE3D-C8D1-4EC9-90E4-C51123414CF4}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{308935A9-984F-4A53-99D6-436854026531}" srcOrd="17" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{06F96F7C-2D98-476B-9A4F-7DF9B78DE21E}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{60DD2D96-E277-4310-8671-3F451CC6414F}" srcOrd="18" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{2FA67087-FB84-4881-82B6-2B4168638C48}" type="presParOf" srcId="{60DD2D96-E277-4310-8671-3F451CC6414F}" destId="{F1F7C825-FA40-457D-B33E-AC75CE4B320A}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{4B911BF0-1D69-4F49-A40C-2D54E1A691BA}" type="presParOf" srcId="{60DD2D96-E277-4310-8671-3F451CC6414F}" destId="{BC60EB40-B9A1-4BE4-8C71-759A83255BCA}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{E167F4C5-04A3-46DE-8A65-9ADCFB3854D1}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{C92A4B1E-9BFB-474A-AEB2-7ADB0C73080D}" srcOrd="19" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{C356D478-0009-462D-B920-1F962C885427}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{BF044522-48CE-4AF4-9220-43364B70BA64}" srcOrd="20" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{758D5A68-A7A0-4834-AB82-A26BFF1A86A7}" type="presParOf" srcId="{BF044522-48CE-4AF4-9220-43364B70BA64}" destId="{FCDF02E1-14D9-4566-8603-362CC30AC025}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{A1388961-B8A1-41B7-87E4-6E83368FC370}" type="presParOf" srcId="{BF044522-48CE-4AF4-9220-43364B70BA64}" destId="{586E90DB-5AD8-4C61-8142-408BAAFDD983}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{67779DF2-57F6-4F96-B369-D67F5C8FA0FC}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{7BB5B8EC-3C4C-4EB7-B500-6718DCF3A8D5}" srcOrd="21" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{901B0792-AA48-4A66-8924-6C98C8EE86D7}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{70E4A7AE-F66D-4B3A-8BAC-18B00B97B5BF}" srcOrd="22" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{EE2B84FF-D755-451C-B442-867DA814AA00}" type="presParOf" srcId="{70E4A7AE-F66D-4B3A-8BAC-18B00B97B5BF}" destId="{64739A94-F973-467D-8660-40AF8ED521DF}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{6CCDD0B2-09F0-4CBF-99A2-DA73C3B09754}" type="presParOf" srcId="{70E4A7AE-F66D-4B3A-8BAC-18B00B97B5BF}" destId="{69F87673-5874-4966-BE90-98D614A7FDFB}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{F7AC2FE3-55AD-4631-85FB-D63032F30214}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{475760A5-1959-47C9-95A7-43DD963E71CA}" srcOrd="23" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{AB83E5C2-0C10-4C88-93A6-FFD4BD88B71C}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{A1636299-5887-485A-948F-DA2BEC3FE399}" srcOrd="24" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{AFC3B893-8D27-43F7-9FA6-8CB581EBC797}" type="presParOf" srcId="{A1636299-5887-485A-948F-DA2BEC3FE399}" destId="{B39DD0DE-9EC8-443E-BC38-5B9CCCE97748}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{067D01D1-36AA-49A6-810F-83EC9FE5E2E9}" type="presParOf" srcId="{A1636299-5887-485A-948F-DA2BEC3FE399}" destId="{D9FFA2FC-216F-4449-95C5-948D0556B542}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{326BA31C-62EE-4EEB-8610-3E70DEF79CCF}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{ABA7F0D9-F4F8-4245-A8D6-5FD46AC1D41B}" srcOrd="25" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{2529945F-31E4-4A84-9683-871C0419D776}" type="presParOf" srcId="{303E6C35-1F43-49CD-BB11-CDB18576E550}" destId="{DBAB2A36-4C62-4482-99EE-8D4B1917EC57}" srcOrd="26" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{B36DA2B0-7396-402B-BB3A-6F9031AE854D}" type="presParOf" srcId="{DBAB2A36-4C62-4482-99EE-8D4B1917EC57}" destId="{EB179D26-F4E0-4083-9B7D-A89AAC6F1FB6}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+		<dgm:cxn modelId="{44E2AAC5-743F-4D31-9B38-4AAFE0FF9C15}" type="presParOf" srcId="{DBAB2A36-4C62-4482-99EE-8D4B1917EC57}" destId="{C9A27D7E-3F13-4D84-A732-4ED6135DA994}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2005/8/layout/bProcess4"/>
+	</dgm:cxnLst>
+	<dgm:bg/>
+	<dgm:whole/>
+	<dgm:extLst>
+		<a:ext uri="http://schemas.microsoft.com/office/drawing/2008/diagram">
+			<dsp:dataModelExt
+				xmlns:dsp="http://schemas.microsoft.com/office/drawing/2008/diagram" relId="rId5" minVer="http://schemas.openxmlformats.org/drawingml/2006/diagram"/>
+			</a:ext>
+		</dgm:extLst>
+	</dgm:dataModel>
diff --git a/tests/Integration/OOXml/Parsing/TextNodeSearchers/files/ZEN-10592/diagram2.xml b/tests/Integration/OOXml/Parsing/TextNodeSearchers/files/ZEN-10592/diagram2.xml
new file mode 100644
index 00000000000..470d7b59935
--- /dev/null
+++ b/tests/Integration/OOXml/Parsing/TextNodeSearchers/files/ZEN-10592/diagram2.xml
@@ -0,0 +1,693 @@
+<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
+<dgm:dataModel
+	xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram"
+	xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
+	<dgm:ptLst>
+		<dgm:pt modelId="{D0EEB7BA-792C-E444-A9FB-D9ECF3535BE4}" type="doc">
+			<dgm:prSet loTypeId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons" loCatId="" qsTypeId="urn:microsoft.com/office/officeart/2005/8/quickstyle/simple1" qsCatId="simple" csTypeId="urn:microsoft.com/office/officeart/2005/8/colors/accent1_2" csCatId="accent1" phldr="1"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{4606616B-5314-CC4A-B97F-178244F95215}">
+			<dgm:prSet phldrT="[テキスト]"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+						<a:t>桃太郎</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{D1DC17BC-99FA-8D4F-919C-F16568F35D1C}" type="parTrans" cxnId="{BA5BB9FC-F634-C643-9CF1-6E579667BEFD}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{D869511B-4289-2F44-B86C-318C4E37E97C}" type="sibTrans" cxnId="{BA5BB9FC-F634-C643-9CF1-6E579667BEFD}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{E0BCC861-AB0E-F846-BBC8-F682DA4EB412}">
+			<dgm:prSet phldrT="[テキスト]"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+						<a:t>猿</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{79651E67-4F4E-484D-91E3-FA8F8D79C221}" type="parTrans" cxnId="{9F5FEC4E-B06D-064C-ADF4-A451509EEF99}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{DA591EAD-D93A-8B45-91A8-5FD828881541}" type="sibTrans" cxnId="{9F5FEC4E-B06D-064C-ADF4-A451509EEF99}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{A2580D6E-3FFC-D248-9B0A-C76B19EEF01F}">
+			<dgm:prSet phldrT="[テキスト]"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+						<a:t>犬</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{43634CB2-892F-DA4B-9A90-C8D387E9A892}" type="parTrans" cxnId="{ED4AD5A4-FA81-9248-8827-118A1A5BC2FD}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{B292140F-7002-0740-A4F1-AD71FFE007EE}" type="sibTrans" cxnId="{ED4AD5A4-FA81-9248-8827-118A1A5BC2FD}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{B16D5345-3BAC-7A4C-BA9C-3CB8C0C18E18}">
+			<dgm:prSet phldrT="[テキスト]"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+						<a:t>キジ</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{E60A81E0-4747-6648-A1F5-2E987F5DD436}" type="parTrans" cxnId="{34CFA57E-C5AF-8B44-BA06-E21641BADE24}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{E2A0280B-FB51-F84F-B47A-E93736CAAF24}" type="sibTrans" cxnId="{34CFA57E-C5AF-8B44-BA06-E21641BADE24}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{A54EF7EE-CF0A-1C40-A91F-BA1E339BCF65}">
+			<dgm:prSet phldrT="[テキスト]"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+						<a:t>林檎太郎</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{F4146A03-50CD-894C-8567-AAB5FD617C2B}" type="parTrans" cxnId="{CD1B0227-612B-4B4F-8E98-1FA3E3D18891}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{EF760722-F6AB-D84D-B031-AB2DC5140C5E}" type="sibTrans" cxnId="{CD1B0227-612B-4B4F-8E98-1FA3E3D18891}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{6EDCA81D-167B-C34C-BA61-A8610BDBD167}">
+			<dgm:prSet phldrT="[テキスト]"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+						<a:t>猪</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{C9867D30-54BC-7941-B838-4E8DD65A648F}" type="parTrans" cxnId="{E1C087FE-D54B-B745-8CC7-2F51996FB034}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{CE785A00-8B45-6C43-93AC-E365EFBB4E65}" type="sibTrans" cxnId="{E1C087FE-D54B-B745-8CC7-2F51996FB034}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{31EEF0E4-D111-E449-8707-B6B0952BDCD7}">
+			<dgm:prSet phldrT="[テキスト]"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+						<a:t>牛</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{53C9F869-1451-2F40-BDE5-C614BE62C2C2}" type="parTrans" cxnId="{1729CDE5-9E8A-184B-B1C9-3942A934F8E1}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{AFAD2DE3-DC39-874D-AABC-806D33466170}" type="sibTrans" cxnId="{1729CDE5-9E8A-184B-B1C9-3942A934F8E1}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{3701996D-BE92-3546-A23D-42057CA3F744}">
+			<dgm:prSet phldrT="[テキスト]"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+						<a:t>鼠</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{AC34AC58-4121-904B-BB74-EE96E6AD1678}" type="parTrans" cxnId="{14F8B362-7EFC-0D49-8431-979F834A18E2}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{0988B731-1774-5B43-8B61-2370476F4A9A}" type="sibTrans" cxnId="{14F8B362-7EFC-0D49-8431-979F834A18E2}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{3C28188F-952D-2B4C-B072-424EE5A1FF75}">
+			<dgm:prSet phldrT="[テキスト]"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+						<a:t>オレンジ太郎</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{185ED368-9158-4341-A1ED-BDC765EFEFB7}" type="parTrans" cxnId="{EEE4E292-F2C4-9040-AA54-DEE9FCD2FA05}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{28E9299C-9524-B64C-A0B9-97827D030BC6}" type="sibTrans" cxnId="{EEE4E292-F2C4-9040-AA54-DEE9FCD2FA05}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{B8821FF3-C026-8A40-80A6-A3D5496419A1}">
+			<dgm:prSet phldrT="[テキスト]"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+						<a:t>カキ太郎</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{A4F2A04A-5A02-1A49-B25C-852D313BF36F}" type="parTrans" cxnId="{CD76B09A-D542-F248-8996-01204C1887DB}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{C9961B82-214C-8A45-97A4-170C28B4885A}" type="sibTrans" cxnId="{CD76B09A-D542-F248-8996-01204C1887DB}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{31769A28-4B29-C24C-B986-22D5F8F79031}">
+			<dgm:prSet phldrT="[テキスト]"/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:r>
+						<a:rPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+						<a:t>葡萄太郎</a:t>
+					</a:r>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{E4054B10-297D-3C48-8E50-79C0ECE9419B}" type="parTrans" cxnId="{95019928-F76F-5A41-B481-E7C98AC2DF16}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{A71064BD-C5AF-0246-9A07-435C21C127B9}" type="sibTrans" cxnId="{95019928-F76F-5A41-B481-E7C98AC2DF16}">
+			<dgm:prSet/>
+			<dgm:spPr/>
+			<dgm:t>
+				<a:bodyPr/>
+				<a:lstStyle/>
+				<a:p>
+					<a:endParaRPr kumimoji="1" lang="ja-JP" altLang="en-US"/>
+				</a:p>
+			</dgm:t>
+		</dgm:pt>
+		<dgm:pt modelId="{8E921792-B87E-8749-A62F-8A0D55DE3C6C}" type="pres">
+			<dgm:prSet presAssocID="{D0EEB7BA-792C-E444-A9FB-D9ECF3535BE4}" presName="Name0" presStyleCnt="0">
+				<dgm:presLayoutVars>
+					<dgm:chMax/>
+					<dgm:chPref/>
+					<dgm:dir/>
+					<dgm:animLvl val="lvl"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{360EBB85-9130-EA4B-88F2-5494C49612C2}" type="pres">
+			<dgm:prSet presAssocID="{4606616B-5314-CC4A-B97F-178244F95215}" presName="composite" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{590F1164-77AB-3748-8F19-08D139C4446D}" type="pres">
+			<dgm:prSet presAssocID="{4606616B-5314-CC4A-B97F-178244F95215}" presName="Parent1" presStyleLbl="node1" presStyleIdx="0" presStyleCnt="10">
+				<dgm:presLayoutVars>
+					<dgm:chMax val="1"/>
+					<dgm:chPref val="1"/>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{7DA1D876-AA08-3B48-9046-13354C13026A}" type="pres">
+			<dgm:prSet presAssocID="{4606616B-5314-CC4A-B97F-178244F95215}" presName="Childtext1" presStyleLbl="revTx" presStyleIdx="0" presStyleCnt="5">
+				<dgm:presLayoutVars>
+					<dgm:chMax val="0"/>
+					<dgm:chPref val="0"/>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{BB377527-C159-D74B-8781-A8A602FFC5D8}" type="pres">
+			<dgm:prSet presAssocID="{4606616B-5314-CC4A-B97F-178244F95215}" presName="BalanceSpacing" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{3133795C-1E09-504F-8835-F3FA8E1B4FFF}" type="pres">
+			<dgm:prSet presAssocID="{4606616B-5314-CC4A-B97F-178244F95215}" presName="BalanceSpacing1" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{8DED0472-35A3-274B-A511-31F38F3E556E}" type="pres">
+			<dgm:prSet presAssocID="{D869511B-4289-2F44-B86C-318C4E37E97C}" presName="Accent1Text" presStyleLbl="node1" presStyleIdx="1" presStyleCnt="10"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{D67AF6EE-0D2C-264C-A2C6-BD8B4A9532DF}" type="pres">
+			<dgm:prSet presAssocID="{D869511B-4289-2F44-B86C-318C4E37E97C}" presName="spaceBetweenRectangles" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{87D15537-2C29-2947-888D-54FA485E2FF2}" type="pres">
+			<dgm:prSet presAssocID="{A54EF7EE-CF0A-1C40-A91F-BA1E339BCF65}" presName="composite" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{669DC0DD-4162-9F48-A99E-BEE01600E27D}" type="pres">
+			<dgm:prSet presAssocID="{A54EF7EE-CF0A-1C40-A91F-BA1E339BCF65}" presName="Parent1" presStyleLbl="node1" presStyleIdx="2" presStyleCnt="10">
+				<dgm:presLayoutVars>
+					<dgm:chMax val="1"/>
+					<dgm:chPref val="1"/>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{1E3D2FCF-91B3-1A43-A2F9-E7609869DCE6}" type="pres">
+			<dgm:prSet presAssocID="{A54EF7EE-CF0A-1C40-A91F-BA1E339BCF65}" presName="Childtext1" presStyleLbl="revTx" presStyleIdx="1" presStyleCnt="5">
+				<dgm:presLayoutVars>
+					<dgm:chMax val="0"/>
+					<dgm:chPref val="0"/>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{28DA0766-B86F-994C-9AD0-5B6F167687AD}" type="pres">
+			<dgm:prSet presAssocID="{A54EF7EE-CF0A-1C40-A91F-BA1E339BCF65}" presName="BalanceSpacing" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{13E7999F-956A-4C45-98F4-5E896BEEFF4A}" type="pres">
+			<dgm:prSet presAssocID="{A54EF7EE-CF0A-1C40-A91F-BA1E339BCF65}" presName="BalanceSpacing1" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{CA5C698A-2C28-1844-927F-9C9ACC7AEA96}" type="pres">
+			<dgm:prSet presAssocID="{EF760722-F6AB-D84D-B031-AB2DC5140C5E}" presName="Accent1Text" presStyleLbl="node1" presStyleIdx="3" presStyleCnt="10"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{E876880C-424A-E949-A80F-7BAE1B040770}" type="pres">
+			<dgm:prSet presAssocID="{EF760722-F6AB-D84D-B031-AB2DC5140C5E}" presName="spaceBetweenRectangles" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{964D45AC-A7F0-C040-BD61-CD08C0F9E212}" type="pres">
+			<dgm:prSet presAssocID="{3C28188F-952D-2B4C-B072-424EE5A1FF75}" presName="composite" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{A8CD633F-926A-CD40-90D7-E26ECC0B4EA9}" type="pres">
+			<dgm:prSet presAssocID="{3C28188F-952D-2B4C-B072-424EE5A1FF75}" presName="Parent1" presStyleLbl="node1" presStyleIdx="4" presStyleCnt="10">
+				<dgm:presLayoutVars>
+					<dgm:chMax val="1"/>
+					<dgm:chPref val="1"/>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{81412B54-BE0C-4C47-903E-F6D12DC241FE}" type="pres">
+			<dgm:prSet presAssocID="{3C28188F-952D-2B4C-B072-424EE5A1FF75}" presName="Childtext1" presStyleLbl="revTx" presStyleIdx="2" presStyleCnt="5">
+				<dgm:presLayoutVars>
+					<dgm:chMax val="0"/>
+					<dgm:chPref val="0"/>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{B46562BB-1212-5149-8C2E-EAA7E904EAF4}" type="pres">
+			<dgm:prSet presAssocID="{3C28188F-952D-2B4C-B072-424EE5A1FF75}" presName="BalanceSpacing" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{3235968B-9B04-FF4A-B68D-EC30FB7E9709}" type="pres">
+			<dgm:prSet presAssocID="{3C28188F-952D-2B4C-B072-424EE5A1FF75}" presName="BalanceSpacing1" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{313CAC41-5916-BB4C-AFF1-F3F15AE1D47E}" type="pres">
+			<dgm:prSet presAssocID="{28E9299C-9524-B64C-A0B9-97827D030BC6}" presName="Accent1Text" presStyleLbl="node1" presStyleIdx="5" presStyleCnt="10"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{7D224F4A-138B-4D4F-B484-D7B322A9A604}" type="pres">
+			<dgm:prSet presAssocID="{28E9299C-9524-B64C-A0B9-97827D030BC6}" presName="spaceBetweenRectangles" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{ACD84836-85BD-5048-AE6D-B1BF448209F2}" type="pres">
+			<dgm:prSet presAssocID="{B8821FF3-C026-8A40-80A6-A3D5496419A1}" presName="composite" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{41223FBE-F6A5-EF43-BD39-FFEAECCDE070}" type="pres">
+			<dgm:prSet presAssocID="{B8821FF3-C026-8A40-80A6-A3D5496419A1}" presName="Parent1" presStyleLbl="node1" presStyleIdx="6" presStyleCnt="10">
+				<dgm:presLayoutVars>
+					<dgm:chMax val="1"/>
+					<dgm:chPref val="1"/>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{44A8D2FF-F87F-8C4B-AFD4-E2C822EC1907}" type="pres">
+			<dgm:prSet presAssocID="{B8821FF3-C026-8A40-80A6-A3D5496419A1}" presName="Childtext1" presStyleLbl="revTx" presStyleIdx="3" presStyleCnt="5">
+				<dgm:presLayoutVars>
+					<dgm:chMax val="0"/>
+					<dgm:chPref val="0"/>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{ADB861EE-DB81-6B40-BEF7-E7109D869CFC}" type="pres">
+			<dgm:prSet presAssocID="{B8821FF3-C026-8A40-80A6-A3D5496419A1}" presName="BalanceSpacing" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{86630BB5-5951-C34D-B664-F0D5DBE99E72}" type="pres">
+			<dgm:prSet presAssocID="{B8821FF3-C026-8A40-80A6-A3D5496419A1}" presName="BalanceSpacing1" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{5CC130A2-5FBB-364A-98D8-B8B61F731179}" type="pres">
+			<dgm:prSet presAssocID="{C9961B82-214C-8A45-97A4-170C28B4885A}" presName="Accent1Text" presStyleLbl="node1" presStyleIdx="7" presStyleCnt="10"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{E4E72A7B-A67D-1B4A-BE81-8D51219ACA8D}" type="pres">
+			<dgm:prSet presAssocID="{C9961B82-214C-8A45-97A4-170C28B4885A}" presName="spaceBetweenRectangles" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{338F2420-4B72-5A4D-8587-2583309792C0}" type="pres">
+			<dgm:prSet presAssocID="{31769A28-4B29-C24C-B986-22D5F8F79031}" presName="composite" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{19239B96-9D22-4C4C-845F-ABEC5F545EED}" type="pres">
+			<dgm:prSet presAssocID="{31769A28-4B29-C24C-B986-22D5F8F79031}" presName="Parent1" presStyleLbl="node1" presStyleIdx="8" presStyleCnt="10">
+				<dgm:presLayoutVars>
+					<dgm:chMax val="1"/>
+					<dgm:chPref val="1"/>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{56131218-71E8-9D47-8490-36D4B5157D55}" type="pres">
+			<dgm:prSet presAssocID="{31769A28-4B29-C24C-B986-22D5F8F79031}" presName="Childtext1" presStyleLbl="revTx" presStyleIdx="4" presStyleCnt="5">
+				<dgm:presLayoutVars>
+					<dgm:chMax val="0"/>
+					<dgm:chPref val="0"/>
+					<dgm:bulletEnabled val="1"/>
+				</dgm:presLayoutVars>
+			</dgm:prSet>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{DC974711-3DD8-0F44-B259-317602A2E9D6}" type="pres">
+			<dgm:prSet presAssocID="{31769A28-4B29-C24C-B986-22D5F8F79031}" presName="BalanceSpacing" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{7603B77A-4B11-FB42-921E-169466AD2E19}" type="pres">
+			<dgm:prSet presAssocID="{31769A28-4B29-C24C-B986-22D5F8F79031}" presName="BalanceSpacing1" presStyleCnt="0"/>
+			<dgm:spPr/>
+		</dgm:pt>
+		<dgm:pt modelId="{6BEDBB85-DC41-1548-A57F-007AC258B669}" type="pres">
+			<dgm:prSet presAssocID="{A71064BD-C5AF-0246-9A07-435C21C127B9}" presName="Accent1Text" presStyleLbl="node1" presStyleIdx="9" presStyleCnt="10"/>
+			<dgm:spPr/>
+		</dgm:pt>
+	</dgm:ptLst>
+	<dgm:cxnLst>
+		<dgm:cxn modelId="{9DE9570E-1A17-3E4A-8E05-6EDFBFC04DF6}" type="presOf" srcId="{C9961B82-214C-8A45-97A4-170C28B4885A}" destId="{5CC130A2-5FBB-364A-98D8-B8B61F731179}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{6E5CF215-CCC9-9641-9F30-A554BDE108F5}" type="presOf" srcId="{A54EF7EE-CF0A-1C40-A91F-BA1E339BCF65}" destId="{669DC0DD-4162-9F48-A99E-BEE01600E27D}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{C24FF51C-DAA3-6347-81C3-F5332548C0B4}" type="presOf" srcId="{D0EEB7BA-792C-E444-A9FB-D9ECF3535BE4}" destId="{8E921792-B87E-8749-A62F-8A0D55DE3C6C}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{69D8301E-2E7A-F84A-A546-D0312EDF2A1C}" type="presOf" srcId="{3C28188F-952D-2B4C-B072-424EE5A1FF75}" destId="{A8CD633F-926A-CD40-90D7-E26ECC0B4EA9}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{FA39461E-51BA-9A44-B3D2-11007EA202EC}" type="presOf" srcId="{D869511B-4289-2F44-B86C-318C4E37E97C}" destId="{8DED0472-35A3-274B-A511-31F38F3E556E}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{CD1B0227-612B-4B4F-8E98-1FA3E3D18891}" srcId="{D0EEB7BA-792C-E444-A9FB-D9ECF3535BE4}" destId="{A54EF7EE-CF0A-1C40-A91F-BA1E339BCF65}" srcOrd="1" destOrd="0" parTransId="{F4146A03-50CD-894C-8567-AAB5FD617C2B}" sibTransId="{EF760722-F6AB-D84D-B031-AB2DC5140C5E}"/>
+		<dgm:cxn modelId="{95019928-F76F-5A41-B481-E7C98AC2DF16}" srcId="{D0EEB7BA-792C-E444-A9FB-D9ECF3535BE4}" destId="{31769A28-4B29-C24C-B986-22D5F8F79031}" srcOrd="4" destOrd="0" parTransId="{E4054B10-297D-3C48-8E50-79C0ECE9419B}" sibTransId="{A71064BD-C5AF-0246-9A07-435C21C127B9}"/>
+		<dgm:cxn modelId="{CD0C944B-6844-4D42-BDF0-EC853C723576}" type="presOf" srcId="{28E9299C-9524-B64C-A0B9-97827D030BC6}" destId="{313CAC41-5916-BB4C-AFF1-F3F15AE1D47E}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{9F5FEC4E-B06D-064C-ADF4-A451509EEF99}" srcId="{4606616B-5314-CC4A-B97F-178244F95215}" destId="{E0BCC861-AB0E-F846-BBC8-F682DA4EB412}" srcOrd="0" destOrd="0" parTransId="{79651E67-4F4E-484D-91E3-FA8F8D79C221}" sibTransId="{DA591EAD-D93A-8B45-91A8-5FD828881541}"/>
+		<dgm:cxn modelId="{51F21C53-4E5A-BC42-9515-5FDD74194411}" type="presOf" srcId="{6EDCA81D-167B-C34C-BA61-A8610BDBD167}" destId="{1E3D2FCF-91B3-1A43-A2F9-E7609869DCE6}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{C330C856-7668-C647-ADC0-A523C0340207}" type="presOf" srcId="{B16D5345-3BAC-7A4C-BA9C-3CB8C0C18E18}" destId="{7DA1D876-AA08-3B48-9046-13354C13026A}" srcOrd="0" destOrd="2" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{14F8B362-7EFC-0D49-8431-979F834A18E2}" srcId="{A54EF7EE-CF0A-1C40-A91F-BA1E339BCF65}" destId="{3701996D-BE92-3546-A23D-42057CA3F744}" srcOrd="2" destOrd="0" parTransId="{AC34AC58-4121-904B-BB74-EE96E6AD1678}" sibTransId="{0988B731-1774-5B43-8B61-2370476F4A9A}"/>
+		<dgm:cxn modelId="{56F1017D-552F-2543-A4B5-1E4D12860BC2}" type="presOf" srcId="{B8821FF3-C026-8A40-80A6-A3D5496419A1}" destId="{41223FBE-F6A5-EF43-BD39-FFEAECCDE070}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{34CFA57E-C5AF-8B44-BA06-E21641BADE24}" srcId="{4606616B-5314-CC4A-B97F-178244F95215}" destId="{B16D5345-3BAC-7A4C-BA9C-3CB8C0C18E18}" srcOrd="2" destOrd="0" parTransId="{E60A81E0-4747-6648-A1F5-2E987F5DD436}" sibTransId="{E2A0280B-FB51-F84F-B47A-E93736CAAF24}"/>
+		<dgm:cxn modelId="{1BCEA489-1C50-E747-9EA5-DCD2FAB8C53F}" type="presOf" srcId="{31EEF0E4-D111-E449-8707-B6B0952BDCD7}" destId="{1E3D2FCF-91B3-1A43-A2F9-E7609869DCE6}" srcOrd="0" destOrd="1" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{EEE4E292-F2C4-9040-AA54-DEE9FCD2FA05}" srcId="{D0EEB7BA-792C-E444-A9FB-D9ECF3535BE4}" destId="{3C28188F-952D-2B4C-B072-424EE5A1FF75}" srcOrd="2" destOrd="0" parTransId="{185ED368-9158-4341-A1ED-BDC765EFEFB7}" sibTransId="{28E9299C-9524-B64C-A0B9-97827D030BC6}"/>
+		<dgm:cxn modelId="{CD76B09A-D542-F248-8996-01204C1887DB}" srcId="{D0EEB7BA-792C-E444-A9FB-D9ECF3535BE4}" destId="{B8821FF3-C026-8A40-80A6-A3D5496419A1}" srcOrd="3" destOrd="0" parTransId="{A4F2A04A-5A02-1A49-B25C-852D313BF36F}" sibTransId="{C9961B82-214C-8A45-97A4-170C28B4885A}"/>
+		<dgm:cxn modelId="{ED4AD5A4-FA81-9248-8827-118A1A5BC2FD}" srcId="{4606616B-5314-CC4A-B97F-178244F95215}" destId="{A2580D6E-3FFC-D248-9B0A-C76B19EEF01F}" srcOrd="1" destOrd="0" parTransId="{43634CB2-892F-DA4B-9A90-C8D387E9A892}" sibTransId="{B292140F-7002-0740-A4F1-AD71FFE007EE}"/>
+		<dgm:cxn modelId="{7864DBB6-79DC-BD4E-8985-99C0432FB2E7}" type="presOf" srcId="{A2580D6E-3FFC-D248-9B0A-C76B19EEF01F}" destId="{7DA1D876-AA08-3B48-9046-13354C13026A}" srcOrd="0" destOrd="1" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{633E9CC9-35D2-E94A-B3ED-11984FCB3CEA}" type="presOf" srcId="{31769A28-4B29-C24C-B986-22D5F8F79031}" destId="{19239B96-9D22-4C4C-845F-ABEC5F545EED}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{CD2110DD-5ABC-5342-A9A7-0567FB906590}" type="presOf" srcId="{E0BCC861-AB0E-F846-BBC8-F682DA4EB412}" destId="{7DA1D876-AA08-3B48-9046-13354C13026A}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{25EE8EDF-8689-714E-AF67-4C3D2AC0C501}" type="presOf" srcId="{EF760722-F6AB-D84D-B031-AB2DC5140C5E}" destId="{CA5C698A-2C28-1844-927F-9C9ACC7AEA96}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{917B31E4-F2C9-2B47-AEE7-59E6FE655FED}" type="presOf" srcId="{3701996D-BE92-3546-A23D-42057CA3F744}" destId="{1E3D2FCF-91B3-1A43-A2F9-E7609869DCE6}" srcOrd="0" destOrd="2" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{1729CDE5-9E8A-184B-B1C9-3942A934F8E1}" srcId="{A54EF7EE-CF0A-1C40-A91F-BA1E339BCF65}" destId="{31EEF0E4-D111-E449-8707-B6B0952BDCD7}" srcOrd="1" destOrd="0" parTransId="{53C9F869-1451-2F40-BDE5-C614BE62C2C2}" sibTransId="{AFAD2DE3-DC39-874D-AABC-806D33466170}"/>
+		<dgm:cxn modelId="{7E6795EC-36E6-7F44-9EE7-BE64CA0CDF56}" type="presOf" srcId="{A71064BD-C5AF-0246-9A07-435C21C127B9}" destId="{6BEDBB85-DC41-1548-A57F-007AC258B669}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{E6DDA8F8-0E97-3C4A-A67A-DF303427B350}" type="presOf" srcId="{4606616B-5314-CC4A-B97F-178244F95215}" destId="{590F1164-77AB-3748-8F19-08D139C4446D}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{BA5BB9FC-F634-C643-9CF1-6E579667BEFD}" srcId="{D0EEB7BA-792C-E444-A9FB-D9ECF3535BE4}" destId="{4606616B-5314-CC4A-B97F-178244F95215}" srcOrd="0" destOrd="0" parTransId="{D1DC17BC-99FA-8D4F-919C-F16568F35D1C}" sibTransId="{D869511B-4289-2F44-B86C-318C4E37E97C}"/>
+		<dgm:cxn modelId="{E1C087FE-D54B-B745-8CC7-2F51996FB034}" srcId="{A54EF7EE-CF0A-1C40-A91F-BA1E339BCF65}" destId="{6EDCA81D-167B-C34C-BA61-A8610BDBD167}" srcOrd="0" destOrd="0" parTransId="{C9867D30-54BC-7941-B838-4E8DD65A648F}" sibTransId="{CE785A00-8B45-6C43-93AC-E365EFBB4E65}"/>
+		<dgm:cxn modelId="{C1E6F529-66FD-B04B-997A-C04D2C866420}" type="presParOf" srcId="{8E921792-B87E-8749-A62F-8A0D55DE3C6C}" destId="{360EBB85-9130-EA4B-88F2-5494C49612C2}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{6766C65A-8794-374C-97C4-9A076E7518FD}" type="presParOf" srcId="{360EBB85-9130-EA4B-88F2-5494C49612C2}" destId="{590F1164-77AB-3748-8F19-08D139C4446D}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{92AF757A-8172-8040-8369-24CBFB4F9CA9}" type="presParOf" srcId="{360EBB85-9130-EA4B-88F2-5494C49612C2}" destId="{7DA1D876-AA08-3B48-9046-13354C13026A}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{C8AD4D6A-8116-2640-AFB6-6413E10D1594}" type="presParOf" srcId="{360EBB85-9130-EA4B-88F2-5494C49612C2}" destId="{BB377527-C159-D74B-8781-A8A602FFC5D8}" srcOrd="2" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{C72A1F9D-438E-BC4E-911D-4B6CD90ABD10}" type="presParOf" srcId="{360EBB85-9130-EA4B-88F2-5494C49612C2}" destId="{3133795C-1E09-504F-8835-F3FA8E1B4FFF}" srcOrd="3" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{E49E8431-6EAE-EB40-B1CD-590B4635EBCE}" type="presParOf" srcId="{360EBB85-9130-EA4B-88F2-5494C49612C2}" destId="{8DED0472-35A3-274B-A511-31F38F3E556E}" srcOrd="4" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{8744FB0F-4491-1C4A-88F3-6764D752FBF6}" type="presParOf" srcId="{8E921792-B87E-8749-A62F-8A0D55DE3C6C}" destId="{D67AF6EE-0D2C-264C-A2C6-BD8B4A9532DF}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{46F60922-927F-AA4C-8475-2E177227E6BE}" type="presParOf" srcId="{8E921792-B87E-8749-A62F-8A0D55DE3C6C}" destId="{87D15537-2C29-2947-888D-54FA485E2FF2}" srcOrd="2" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{4D0478FB-2255-A84E-8578-C7EA3AAAB7F7}" type="presParOf" srcId="{87D15537-2C29-2947-888D-54FA485E2FF2}" destId="{669DC0DD-4162-9F48-A99E-BEE01600E27D}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{2D355D85-4AC8-1E4C-8F21-930C34A6102C}" type="presParOf" srcId="{87D15537-2C29-2947-888D-54FA485E2FF2}" destId="{1E3D2FCF-91B3-1A43-A2F9-E7609869DCE6}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{0B916289-C4C6-D449-A609-A11E13C85500}" type="presParOf" srcId="{87D15537-2C29-2947-888D-54FA485E2FF2}" destId="{28DA0766-B86F-994C-9AD0-5B6F167687AD}" srcOrd="2" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{006724E9-F8CB-684A-B9CA-8B22E205FC02}" type="presParOf" srcId="{87D15537-2C29-2947-888D-54FA485E2FF2}" destId="{13E7999F-956A-4C45-98F4-5E896BEEFF4A}" srcOrd="3" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{5CAFEC11-6B7B-3F49-BBAA-56733710AAD0}" type="presParOf" srcId="{87D15537-2C29-2947-888D-54FA485E2FF2}" destId="{CA5C698A-2C28-1844-927F-9C9ACC7AEA96}" srcOrd="4" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{D6219C35-D7A2-9B48-A690-EEBBD2597435}" type="presParOf" srcId="{8E921792-B87E-8749-A62F-8A0D55DE3C6C}" destId="{E876880C-424A-E949-A80F-7BAE1B040770}" srcOrd="3" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{B3649308-614B-734A-A5A5-9904C9723FE0}" type="presParOf" srcId="{8E921792-B87E-8749-A62F-8A0D55DE3C6C}" destId="{964D45AC-A7F0-C040-BD61-CD08C0F9E212}" srcOrd="4" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{81B84A91-FDB3-B845-BFA9-D08DD22FF3BF}" type="presParOf" srcId="{964D45AC-A7F0-C040-BD61-CD08C0F9E212}" destId="{A8CD633F-926A-CD40-90D7-E26ECC0B4EA9}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{FEDA3337-D6CF-204D-B68E-20A45F5426B2}" type="presParOf" srcId="{964D45AC-A7F0-C040-BD61-CD08C0F9E212}" destId="{81412B54-BE0C-4C47-903E-F6D12DC241FE}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{96826CA6-61B1-6941-BAA9-03E43521A5D8}" type="presParOf" srcId="{964D45AC-A7F0-C040-BD61-CD08C0F9E212}" destId="{B46562BB-1212-5149-8C2E-EAA7E904EAF4}" srcOrd="2" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{BC2FBF9D-1E59-524B-84B9-7CE5A5AFD764}" type="presParOf" srcId="{964D45AC-A7F0-C040-BD61-CD08C0F9E212}" destId="{3235968B-9B04-FF4A-B68D-EC30FB7E9709}" srcOrd="3" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{04B729FC-CC90-BD4B-AA04-0C85BAD8738D}" type="presParOf" srcId="{964D45AC-A7F0-C040-BD61-CD08C0F9E212}" destId="{313CAC41-5916-BB4C-AFF1-F3F15AE1D47E}" srcOrd="4" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{DBEE53CF-E9F2-D540-A155-300AD2A19232}" type="presParOf" srcId="{8E921792-B87E-8749-A62F-8A0D55DE3C6C}" destId="{7D224F4A-138B-4D4F-B484-D7B322A9A604}" srcOrd="5" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{42A27637-C7B2-A14A-8F2C-1A6CCF70AB8E}" type="presParOf" srcId="{8E921792-B87E-8749-A62F-8A0D55DE3C6C}" destId="{ACD84836-85BD-5048-AE6D-B1BF448209F2}" srcOrd="6" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{6F26F632-7A56-244D-8950-B545E1CA42BA}" type="presParOf" srcId="{ACD84836-85BD-5048-AE6D-B1BF448209F2}" destId="{41223FBE-F6A5-EF43-BD39-FFEAECCDE070}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{56B2BB97-15B3-5C40-9012-EE48A6547A03}" type="presParOf" srcId="{ACD84836-85BD-5048-AE6D-B1BF448209F2}" destId="{44A8D2FF-F87F-8C4B-AFD4-E2C822EC1907}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{E6D217BA-1323-DC43-A6E9-93D8536838CA}" type="presParOf" srcId="{ACD84836-85BD-5048-AE6D-B1BF448209F2}" destId="{ADB861EE-DB81-6B40-BEF7-E7109D869CFC}" srcOrd="2" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{189821D0-86B2-7D44-B2FC-CDE02C08D299}" type="presParOf" srcId="{ACD84836-85BD-5048-AE6D-B1BF448209F2}" destId="{86630BB5-5951-C34D-B664-F0D5DBE99E72}" srcOrd="3" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{35ACB04C-AB75-E94E-B2FD-323A50A8AE58}" type="presParOf" srcId="{ACD84836-85BD-5048-AE6D-B1BF448209F2}" destId="{5CC130A2-5FBB-364A-98D8-B8B61F731179}" srcOrd="4" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{2AF32D80-D934-E24D-9737-61503B7069E6}" type="presParOf" srcId="{8E921792-B87E-8749-A62F-8A0D55DE3C6C}" destId="{E4E72A7B-A67D-1B4A-BE81-8D51219ACA8D}" srcOrd="7" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{73AA7B69-2D56-8C43-A210-0A03E5FEBAAE}" type="presParOf" srcId="{8E921792-B87E-8749-A62F-8A0D55DE3C6C}" destId="{338F2420-4B72-5A4D-8587-2583309792C0}" srcOrd="8" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{1572DB9B-353A-BD43-A9B1-3FF1E27E399F}" type="presParOf" srcId="{338F2420-4B72-5A4D-8587-2583309792C0}" destId="{19239B96-9D22-4C4C-845F-ABEC5F545EED}" srcOrd="0" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{4D341C3C-BE80-904C-9E92-193DD3AB5454}" type="presParOf" srcId="{338F2420-4B72-5A4D-8587-2583309792C0}" destId="{56131218-71E8-9D47-8490-36D4B5157D55}" srcOrd="1" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{39148ACC-01BF-1B49-B8CE-0DDAC4A73432}" type="presParOf" srcId="{338F2420-4B72-5A4D-8587-2583309792C0}" destId="{DC974711-3DD8-0F44-B259-317602A2E9D6}" srcOrd="2" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{6B4331EE-A1FE-1D40-9217-EE9DFA0FB921}" type="presParOf" srcId="{338F2420-4B72-5A4D-8587-2583309792C0}" destId="{7603B77A-4B11-FB42-921E-169466AD2E19}" srcOrd="3" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+		<dgm:cxn modelId="{82C049C4-B2F4-824D-96BC-48A1D3C0817F}" type="presParOf" srcId="{338F2420-4B72-5A4D-8587-2583309792C0}" destId="{6BEDBB85-DC41-1548-A57F-007AC258B669}" srcOrd="4" destOrd="0" presId="urn:microsoft.com/office/officeart/2008/layout/AlternatingHexagons"/>
+	</dgm:cxnLst>
+	<dgm:bg/>
+	<dgm:whole/>
+	<dgm:extLst>
+		<a:ext uri="http://schemas.microsoft.com/office/drawing/2008/diagram">
+			<dsp:dataModelExt
+				xmlns:dsp="http://schemas.microsoft.com/office/drawing/2008/diagram" relId="rId5" minVer="http://schemas.openxmlformats.org/drawingml/2006/diagram"/>
+			</a:ext>
+		</dgm:extLst>
+	</dgm:dataModel>`
