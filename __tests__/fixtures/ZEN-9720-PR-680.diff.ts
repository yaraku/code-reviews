export const diff = `diff --git a/app/Services/User/UserDeleterService.php b/app/Services/User/UserDeleterService.php
index 8b7df63612..c8c393e66e 100644
--- a/app/Services/User/UserDeleterService.php
+++ b/app/Services/User/UserDeleterService.php
@@ -118,13 +118,13 @@ private function deleteUserRelationalData(RequestWithUser $request, DBModels\Use
             try {
                 $targetUser->loadMissing('wallet');
 
-                if ($targetUser->wallet->stripe_id !== null) {
+                if ($targetUser->wallet?->stripe_id !== null) {
                     Cashier::stripe()->customers->delete($targetUser->wallet->stripe_id);
                 }
             } catch (Exception $e) {
                 Log::error('Unable to delete stripe customer', [
                     'e' => $e,
-                    'stripe_id' => $targetUser->wallet->stripe_id,
+                    'stripe_id' => $targetUser->wallet?->stripe_id,
                 ]);
             }
 
diff --git a/tests/Integration/Stripe/StripeApiTestCase.php b/tests/Integration/Stripe/StripeApiTestCase.php
index d2fe6ee4c4..6e37e3672e 100644
--- a/tests/Integration/Stripe/StripeApiTestCase.php
+++ b/tests/Integration/Stripe/StripeApiTestCase.php
@@ -46,7 +46,7 @@ public function setUp(): void
         $this->setHttpClient();
     }
 
-    private function setupJsonStubs(): void
+    private function setUpJsonStubs(): void
     {
         $now = now();
         $nextYear = $now->addYear()->year;
@@ -103,7 +103,7 @@ private function setupJsonStubs(): void
 JSON;
     }
 
-    private function setupHttp(): void
+    private function setUpHttp(): void
     {
         Http::preventStrayRequests();
 
@@ -139,7 +139,7 @@ private function setupHttp(): void
 
             $code = 200;
 
-            if (str_contains($json, 'error')) {
+            if (array_key_exists('error', json_decode($json, true))) {
                 $code = 404;
             }
 
diff --git a/workbench/yaraku/admin/tests/User/Controller/DeleteUserAndDataStripeTest.php b/workbench/yaraku/admin/tests/User/Controller/DeleteUserAndDataStripeTest.php
index ee7d061bc2..bbed2ce366 100644
--- a/workbench/yaraku/admin/tests/User/Controller/DeleteUserAndDataStripeTest.php
+++ b/workbench/yaraku/admin/tests/User/Controller/DeleteUserAndDataStripeTest.php
@@ -44,7 +44,8 @@ public function testDeleteUserRemovesSavedPaymentCards(): void
 
         $wallet->newSubscription(
             'premium',
-            config('stripe.subscriptionPlans.premium.prices.monthly.stripeId'),
+            config('stripe.subscriptionPlans.premium.prices.monthly.stripeId')
+                ?? 'price_1LYibuF5IfL0eXz9otT6VcII',
         )->create('pm_card_visa');
 
         Elasticsearch::shouldReceive('deleteByQuery')`
