export const diff = `diff --git a/tests/Integration/Stripe/Concerns/FakeStripeHttpClient.php b/tests/Integration/Stripe/Concerns/FakeStripeHttpClient.php
index 8642eacfe4e..4b59fa341a6 100644
--- a/tests/Integration/Stripe/Concerns/FakeStripeHttpClient.php
+++ b/tests/Integration/Stripe/Concerns/FakeStripeHttpClient.php
@@ -20,8 +20,7 @@ public function request($method, $absUrl, $headers, $params, $hasFile)
         });
     }
 
-    private function resetHttpClient(): void
-    {
+    private function resetHttpClient(): void {
         ApiRequestor::setHttpClient(CurlClient::instance());
     }
 }`;