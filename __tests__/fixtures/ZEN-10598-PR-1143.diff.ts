export const diff = `diff --git a/app/Services/MachineTranslation/Engine/Provider/Yaraku/Client/Client.php b/app/Services/MachineTranslation/Engine/Provider/Yaraku/Client/Client.php
index 231d2ac7b69..2d5953c5ed6 100644
--- a/app/Services/MachineTranslation/Engine/Provider/Yaraku/Client/Client.php
+++ b/app/Services/MachineTranslation/Engine/Provider/Yaraku/Client/Client.php
@@ -181,7 +181,7 @@ private function isSkippableError(string $error): bool
 
     private function logSkippableError(string $error, string $message): void
     {
-        Log::warning(
+        Log::debug(
             'A Yaraku translation engine error occurred. We were able to continue gracefully.',
             [
                 'error' => $error,`
