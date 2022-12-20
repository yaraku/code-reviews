export const diff = `diff --git a/app/Http/Controllers/UserController.php b/app/Http/Controllers/UserController.php
index ea8600b4b3b..4c2cbfaa929 100755
--- a/app/Http/Controllers/UserController.php
+++ b/app/Http/Controllers/UserController.php
@@ -234,8 +234,6 @@ public function signIn(Http\Request $request): JsonResponse
         $user->ip = Request::ip();
         $user->timeZoneOffset = $timeZoneOffset;
 
-        $this->setLastVisitDateForUser($user);
-
         if ($user->locale === null) {
             $user->locale = Lang::getLocale();
         }
@@ -266,6 +264,7 @@ public function signIn(Http\Request $request): JsonResponse
             return $this->handleOrderShareException($e, $user->toArray(), $shareCodeParams);
         }
 
+        $this->setLastVisitDateForUser($user);
         Auth::login($user, $rememberMe);
         $this->setLastLoginDate($user);
         $user->save();
diff --git a/tests/Integration/Users/UserControllerTest.php b/tests/Integration/Users/UserControllerTest.php
index 55d96c6b6b4..14ec81e7fb5 100644
--- a/tests/Integration/Users/UserControllerTest.php
+++ b/tests/Integration/Users/UserControllerTest.php
@@ -321,16 +321,20 @@ public function testSignInWhenUserHasNoLocale(): void
     public function testSignIn(): void
     {
         $this->prepareUser();
+        $userLastVisited = $this->user->lastVisit;
 
         $requestData = $this->prepareSignInData();
         $response = $this->xmlCallPostWithContent('/user/signIn', json_encode($requestData));
         $responseContent = json_decode($response->getContent(), true)['result'];
+
+        $this->user->refresh();
         static::assertTrue($response->isOk());
         static::assertSame($this->user->id, $responseContent['id']);
         static::assertEquals($requestData['email'], $responseContent['email']);
         static::assertEquals(HtmlEncoder::encode($this->user->fullName), $responseContent['fullName']);
         static::assertEquals($this->user->wallet->id, $responseContent['walletId']);
         static::assertTrue(auth()->check());
+        static::assertNotEquals($userLastVisited, $this->user->lastVisit);
     }
 
     /**
@@ -652,6 +656,7 @@ public function testSignInDeactivatedUserWithFreeSignUpDisabled(): void
     public function testSignInWhichFailsBecauseOfRestrictedIPAddress(): void
     {
         $this->prepareUser();
+        $userLastVisitDate = $this->user->lastVisit;
 
         $iPAddressData = [
             [
@@ -669,9 +674,11 @@ public function testSignInWhichFailsBecauseOfRestrictedIPAddress(): void
         $response = $this->xmlCallPostWithContent('/user/signIn', json_encode($requestData));
         $responseData = json_decode($response->getContent(), true);
 
+        $this->user->refresh();
         static::assertFalse($response->isOk());
         static::assertFalse(Auth::check());
         static::assertEquals('iPAddressNotAllowed', $responseData['errors'][0]['code']);
+        static::assertEquals($userLastVisitDate, $this->user->lastVisit);
     }
 
     /*`
