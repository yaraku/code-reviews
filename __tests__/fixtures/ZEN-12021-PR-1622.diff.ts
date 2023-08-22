export const diff = `diff --git a/app/Exceptions/Handler.php b/app/Exceptions/Handler.php
index 7f5ea513e85..b8042501317 100644
--- a/app/Exceptions/Handler.php
+++ b/app/Exceptions/Handler.php
@@ -34,10 +34,8 @@ class Handler extends Foundation\Exceptions\Handler
     /** @var string */
     public const METRICS_NAME = 'uncaught_exceptions_total';
 
-    private Reporters\DatabaseExceptionReporterInterface $databaseExceptionReporter;
-
     public function __construct(
-        Reporters\DatabaseExceptionReporterInterface $databaseExceptionReporter
+        private readonly Reporters\DatabaseExceptionReporterInterface $databaseExceptionReporter
     ) {
         $this->dontReport = [
             AuthorizationException::class,
@@ -46,9 +44,6 @@ public function __construct(
             Session\TokenMismatchException::class,
             ValidationException::class
         ];
-
-        $this->databaseExceptionReporter = $databaseExceptionReporter;
-
         parent::__construct(app());
     }
 
diff --git a/app/Exceptions/TimezoneInvalidException.php b/app/Exceptions/TimezoneInvalidException.php
new file mode 100644
index 00000000000..bbd522c9db6
--- /dev/null
+++ b/app/Exceptions/TimezoneInvalidException.php
@@ -0,0 +1,15 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Exceptions;
+
+use Exception;
+
+class TimezoneInvalidException extends Exception
+{
+    public function __construct(string $timezone)
+    {
+        parent::__construct('Timezone entered (' . $timezone . ') is invalid');
+    }
+}
diff --git a/app/Exceptions/UserIPAddressNotAllowedException.php b/app/Exceptions/UserIPAddressNotAllowedException.php
index 13cbb300a51..a81f1624dcc 100644
--- a/app/Exceptions/UserIPAddressNotAllowedException.php
+++ b/app/Exceptions/UserIPAddressNotAllowedException.php
@@ -21,6 +21,11 @@ public function __construct(string $ipAddress)
 
     }
 
+    public function getIpAddress(): string
+    {
+        return $this->ipAddress;
+    }
+
     public function getSignInExceptionCode(): string
     {
         return 'ip-disallowed';
diff --git a/app/Http/Controllers/Scim/CreateMemberController.php b/app/Http/Controllers/Scim/CreateMemberController.php
new file mode 100644
index 00000000000..1cf2a865669
--- /dev/null
+++ b/app/Http/Controllers/Scim/CreateMemberController.php
@@ -0,0 +1,67 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Http\Controllers\Scim;
+
+use App\Exceptions\TimezoneInvalidException;
+use App\Exceptions\UserIPAddressNotAllowedException;
+use App\Http\Requests\Scim\CreateMemberRequest;
+use App\Services\Company\Exceptions\CompanyDeactivatedException;
+use App\Services\Scim\Transformers\ScimCompanyMemberTransformer;
+use App\Services\Scim\MemberCreatorFactory;
+use App\Services\Scim\ErrorResponseFactory;
+use App\Services\Transformer\Serializer\ArraySerializer;
+use App\Services\User\Exceptions\MaxMembersLimitReachedException;
+use Exception;
+use Illuminate\Database\Eloquent\ModelNotFoundException;
+use Illuminate\Http\JsonResponse;
+use League\Fractal;
+
+class CreateMemberController extends ScimController
+{
+    public function __construct(
+        private readonly ErrorResponseFactory $errorResponseFactory,
+        private readonly MemberCreatorFactory $memberCreatorFactory,
+        private readonly Fractal\Manager $transformerManager,
+        private readonly ScimCompanyMemberTransformer $memberTransformer
+    ) {
+    }
+
+    public function createUser(
+        CreateMemberRequest $request,
+    ): JsonResponse {
+        try {
+            $member = $this->memberCreatorFactory->createCompanyUser($request);
+        } catch (Exception $e) {
+            return $this->handleExceptions($e);
+        }
+        $resource = new Fractal\Resource\Item(
+            $member,
+            $this->memberTransformer
+        );
+        $data = $this->transformerManager
+            ->setSerializer(new ArraySerializer())
+            ->parseIncludes($request->getAttributes())
+            ->createData($resource);
+
+        return $this->parseScimMemberResponse($data->toArray());
+    }
+
+    private function handleExceptions(Exception $e): JsonResponse
+    {
+        return match (true) {
+            $e instanceof ModelNotFoundException => $this->errorResponseFactory->companyDoesNotExist(),
+            $e instanceof TimezoneInvalidException => $this->errorResponseFactory->error(
+                $e->getMessage(),
+                400
+            ),
+            $e instanceof UserIPAddressNotAllowedException => $this->errorResponseFactory->error(
+                'Sign up is not allowed from ip address: ' . $e->getIpAddress(),
+                401
+            ),
+            $e instanceof CompanyDeactivatedException => $this->errorResponseFactory->companyDeactivated(),
+            $e instanceof MaxMembersLimitReachedException => $this->errorResponseFactory->memberLimitReached()
+        };
+    }
+}
diff --git a/app/Http/Controllers/Scim/GetMembersController.php b/app/Http/Controllers/Scim/GetMembersController.php
new file mode 100644
index 00000000000..574e5ae237d
--- /dev/null
+++ b/app/Http/Controllers/Scim/GetMembersController.php
@@ -0,0 +1,80 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Http\Controllers\Scim;
+
+use App\DBModels\User;
+use App\Http\Requests\Scim\MembersAttributeRequest;
+use App\Services\Scim\Transformers\ScimCompanyMemberTransformer;
+use App\Services\Scim\ErrorResponseFactory;
+use App\Services\Transformer\Serializer\ArraySerializer;
+use Illuminate\Database\Eloquent\ModelNotFoundException;
+use Illuminate\Http\JsonResponse;
+use League\Fractal;
+
+class GetMembersController extends ScimController
+{
+    public function __construct(
+        private readonly ErrorResponseFactory $errorResponseFactory,
+        private readonly Fractal\Manager $transformerManager,
+        private readonly ScimCompanyMemberTransformer $memberTransformer
+    ) {
+        $this->transformerManager->setSerializer(new ArraySerializer());
+    }
+
+    public function getMembers(
+        MembersAttributeRequest $request
+    ): JsonResponse {
+        try {
+            $company = $request->getCompanyFromAuthCode();
+        } catch (ModelNotFoundException) {
+            return $this->errorResponseFactory->companyDoesNotExist();
+        }
+
+        if ($request->hasFilters()) {
+            $userName = $request->getUserNameFromFilter();
+            $members = $company->users()
+                ->where('email', '=', $userName)
+                ->get();
+        } else {
+            $members = $company->users()->whereNot('fullName', '(Deleted User)')->get();
+        }
+
+        if (count($members) === 0) {
+           return $this->parseEmptyScimListResponse();
+        }
+
+        $resource = new Fractal\Resource\Collection(
+            $members,
+            $this->memberTransformer
+        );
+
+        $data = $this->transformerManager
+            ->parseIncludes($request->getAttributes())
+            ->createData($resource);
+
+        return $this->parseScimMembersListResponse($data->toArray());
+    }
+
+    public function getMember(
+        string $id,
+        MembersAttributeRequest $request
+    ): JsonResponse {
+        /** @var User $member */
+        $member = User::find($id);
+        if (!$member) {
+            return $this->errorResponseFactory->companyMemberNotFound();
+        }
+
+        $resource = new Fractal\Resource\Item(
+            $member,
+            $this->memberTransformer
+        );
+        $data = $this->transformerManager
+            ->parseIncludes($request->getAttributes())
+            ->createData($resource);
+
+        return $this->parseScimMemberResponse($data->toArray());
+    }
+}
diff --git a/app/Http/Controllers/Scim/RemoveMemberController.php b/app/Http/Controllers/Scim/RemoveMemberController.php
new file mode 100644
index 00000000000..cc4d07c5ab2
--- /dev/null
+++ b/app/Http/Controllers/Scim/RemoveMemberController.php
@@ -0,0 +1,49 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Http\Controllers\Scim;
+
+use App\Http\Requests\Scim\MembersAttributeRequest;
+use App\Repositories\UserRepository;
+use App\Services\Company\Exceptions\FailedToDisconnectUserFromCompanyException;
+use App\Services\Company\User\Disconnector;
+use App\Services\Exceptions\Company\UserNotInCompanyException;
+use App\Services\Scim\ErrorResponseFactory;
+use App\Services\User\UserService;
+use Illuminate\Http\JsonResponse;
+
+class RemoveMemberController extends ScimController
+{
+    public function __construct(
+        private readonly Disconnector $disconnector,
+        private readonly ErrorResponseFactory $errorResponseFactory,
+        private readonly UserRepository  $userRepository,
+        private readonly UserService $userService
+    ) {
+    }
+
+    function deactivateUser(
+        int $id,
+        MembersAttributeRequest $request
+    ): JsonResponse {
+        $company = $request->getCompanyFromAuthCode();
+        $targetUser = $this->userRepository->findById($id);
+
+        if ($targetUser) {
+            try {
+                $this->disconnector->disconnectUserFromCompany($targetUser, $company);
+            } catch (UserNotInCompanyException) {
+                return $this->errorResponseFactory->companyMemberNotFound();
+            } catch (FailedToDisconnectUserFromCompanyException) {
+                return $this->errorResponseFactory->error('Failed to disconnect member', 404);
+            }
+        }
+
+        if (!$targetUser->active) {
+            return $this->errorResponseFactory->companyMemberDeactivated();
+        }
+        $this->userService->deactivateUser($targetUser);
+        return response()->json([]);
+    }
+}
diff --git a/app/Http/Controllers/Scim/ScimController.php b/app/Http/Controllers/Scim/ScimController.php
new file mode 100644
index 00000000000..7dbf6dc0f0e
--- /dev/null
+++ b/app/Http/Controllers/Scim/ScimController.php
@@ -0,0 +1,37 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Http\Controllers\Scim;
+
+use App\Http\Controllers\Controller;
+use Illuminate\Http\JsonResponse;
+use Response;
+
+abstract class ScimController extends Controller
+{
+    protected function parseScimMemberResponse(array $member): JsonResponse
+    {
+        return Response::Json($member);
+    }
+
+    protected function parseScimMembersListResponse(array $members): JsonResponse
+    {
+        return Response::json([
+            'schemas' => ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
+            'totalResults' => count($members),
+            'Resources' => $members
+        ]);
+    }
+
+    protected function parseEmptyScimListResponse(): JsonResponse
+    {
+        return Response::json([
+                'schemas' => ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
+                'totalResults' => 0,
+                "startIndex" => 1,
+                "itemsPerPage" => 0,
+                'Resources' => [],
+            ]);
+    }
+}
diff --git a/app/Http/Controllers/Scim/ServiceProviderConfig.php b/app/Http/Controllers/Scim/ServiceProviderConfig.php
new file mode 100644
index 00000000000..b52f0d9387a
--- /dev/null
+++ b/app/Http/Controllers/Scim/ServiceProviderConfig.php
@@ -0,0 +1,33 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Http\Controllers\Scim;
+
+use Illuminate\Http\JsonResponse;
+use Response;
+
+class ServiceProviderConfig
+{
+    public function getConfig(): JsonResponse
+    {
+        return Response::json([
+            'schemas' => ['urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig'],
+            'patch' => [
+                'supported' => true
+            ],
+            'filter' => [
+                'supported' => false
+            ],
+            'changePassword' => [
+                'supported' => false
+            ],
+            'sort' => [
+                'supported' => false
+            ],
+            'etag' => [
+                'supported' => false
+            ]
+        ]);
+    }
+}
diff --git a/app/Http/Controllers/Scim/UpdateMemberAttributesController.php b/app/Http/Controllers/Scim/UpdateMemberAttributesController.php
new file mode 100644
index 00000000000..3b1a4c793c2
--- /dev/null
+++ b/app/Http/Controllers/Scim/UpdateMemberAttributesController.php
@@ -0,0 +1,70 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Http\Controllers\Scim;
+
+use App\DBModels\User;
+use App\Exceptions\TimezoneInvalidException;
+use App\Http\Requests\Scim\UpdateMemberAttributeRequest;
+use App\Services\Company\Exceptions\FailedToDisconnectUserFromCompanyException;
+use App\Services\Exceptions\Company\UserNotInCompanyException;
+use App\Services\Scim;
+use App\Services\Transformer\Serializer\ArraySerializer;
+use Illuminate\Database\Eloquent\ModelNotFoundException;
+use Illuminate\Http\JsonResponse;
+use League\Fractal;
+
+class UpdateMemberAttributesController extends ScimController
+{
+    public function __construct(
+        private readonly Scim\ErrorResponseFactory $errorResponseFactory,
+        private readonly Scim\CompanyMemberUpdater $memberUpdateService,
+        private readonly Fractal\Manager $transformerManager,
+        private readonly Scim\Transformers\ScimCompanyMemberTransformer $memberTransformer
+    ) {
+    }
+
+    function updateMemberAttributes(
+        int $id,
+        UpdateMemberAttributeRequest $request
+    ): JsonResponse {
+        /** @var User $memberToUpdate */
+        $memberToUpdate = $request->getCompanyFromAuthCode()->users()->find($id);
+        if (!$memberToUpdate) {
+            try {
+                $memberToUpdate = User::findOrFail($id);
+            } catch (ModelNotFoundException) {
+                return $this->errorResponseFactory->companyMemberNotFound();
+            }
+            //TODO ZEN-12341 When user is not part of company send CompanyMemberInvite then return companyMemberNotFound error
+        }
+
+        try {
+            $updatedMember = $this->memberUpdateService->updateMemberAttributes($request, $memberToUpdate);
+        } catch (TimezoneInvalidException $e) {
+            return $this->errorResponseFactory->error(
+                $e->getMessage(),
+                400
+            );
+        } catch (UserNotInCompanyException) {
+            return $this->errorResponseFactory->companyMemberNotFound();
+        } catch (FailedToDisconnectUserFromCompanyException) {
+            return $this->errorResponseFactory->error(
+                'Failed to disconnect from company',
+                404
+            );
+        }
+
+        $resource = new Fractal\Resource\Item(
+            $updatedMember,
+            $this->memberTransformer
+        );
+        $data = $this->transformerManager
+            ->setSerializer(new ArraySerializer())
+            ->parseIncludes($request->getAttributes())
+            ->createData($resource);
+
+        return $this->parseScimMemberResponse($data->toArray());
+    }
+}
diff --git a/app/Http/Controllers/Scim/UpdateMemberController.php b/app/Http/Controllers/Scim/UpdateMemberController.php
new file mode 100644
index 00000000000..e41fd0b8893
--- /dev/null
+++ b/app/Http/Controllers/Scim/UpdateMemberController.php
@@ -0,0 +1,64 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Http\Controllers\Scim;
+
+use App\DBModels\User;
+use App\Exceptions\TimezoneInvalidException;
+use App\Http\Requests\Scim\UpdateMemberRequest;
+use App\Services\Scim\Transformers\ScimCompanyMemberTransformer;
+use App\Services\Scim\CompanyMemberUpdater;
+use App\Services\Scim\ErrorResponseFactory;
+use App\Services\Transformer\Serializer\ArraySerializer;
+use Illuminate\Database\Eloquent\ModelNotFoundException;
+use Illuminate\Http\JsonResponse;
+use League\Fractal;
+
+class UpdateMemberController extends ScimController
+{
+    public function __construct(
+        private readonly ErrorResponseFactory $errorResponseFactory,
+        private readonly CompanyMemberUpdater $memberUpdateService,
+        private readonly Fractal\Manager $transformerManager,
+        private readonly ScimCompanyMemberTransformer $memberTransformer
+    ) {
+    }
+
+    function updateMember(
+        int $id,
+        UpdateMemberRequest $request
+    ): JsonResponse {
+        try {
+            $company = $request->getCompanyFromAuthCode();
+        } catch (ModelNotFoundException) {
+            return $this->errorResponseFactory->companyDoesNotExist();
+        }
+
+        /** @var User $memberToUpdate */
+        $memberToUpdate = $company->users()->find($id);
+        if (!$memberToUpdate) {
+            return $this->errorResponseFactory->companyMemberNotFound();
+        }
+
+        try {
+            $updatedMember = $this->memberUpdateService->updateMember($request, $memberToUpdate);
+        } catch (TimezoneInvalidException $e) {
+            return $this->errorResponseFactory->error(
+                $e->getMessage(),
+                400
+            );
+        }
+
+        $resource = new Fractal\Resource\Item(
+            $updatedMember,
+            $this->memberTransformer
+        );
+        $data = $this->transformerManager
+            ->setSerializer(new ArraySerializer())
+            ->parseIncludes($request->getAttributes())
+            ->createData($resource);
+
+        return $this->parseScimMemberResponse($data->toArray());
+    }
+}
diff --git a/app/Http/Middleware/VerifyCsrfToken.php b/app/Http/Middleware/VerifyCsrfToken.php
index 1c7cb9be1c0..f78c62ede08 100644
--- a/app/Http/Middleware/VerifyCsrfToken.php
+++ b/app/Http/Middleware/VerifyCsrfToken.php
@@ -23,6 +23,7 @@ public function __construct(Application $application, Encrypter $encrypter)
             'oauth/*',
             'oldDocuments',
             'payment/callback/*',
+            'scim/*',
             'saml2/*',
             'stripe/*',
             'system/deploy*',
diff --git a/app/Http/Requests/Scim/CreateMemberRequest.php b/app/Http/Requests/Scim/CreateMemberRequest.php
new file mode 100644
index 00000000000..c153b570f4b
--- /dev/null
+++ b/app/Http/Requests/Scim/CreateMemberRequest.php
@@ -0,0 +1,55 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Http\Requests\Scim;
+
+use App\Exceptions\TimezoneInvalidException;
+use DateTime;
+use DateTimeZone;
+use Exception;
+
+class CreateMemberRequest extends MembersAttributeRequest
+{
+    public function rules(): array
+    {
+        return array_merge(parent::rules(), [
+            'displayName' => 'Required|String',
+            'locale' => 'Required|LocaleSupported',
+            'timezone' => 'Required|timezone',
+            'userName' => 'Required|Email|Unique:users,email'
+        ]);
+    }
+
+    public function getLocale(): string
+    {
+        return $this->get('locale');
+    }
+
+    public function getUserName(): string
+    {
+        return $this->get('userName');
+    }
+
+    public function getDisplayName(): ?string
+    {
+        return $this->get('displayName');
+    }
+
+    public function getTimeZone(): string
+    {
+        return $this->get('timezone');
+    }
+
+    /**
+     * @throws TimezoneInvalidException
+     */
+    public function getTimeZoneOffset(): int
+    {
+        try {
+            return (new DateTime('now', new DateTimeZone($this->getTimeZone())))->getOffset();
+        } catch (Exception) {
+            throw new TimezoneInvalidException($this->getTimeZone());
+        }
+    }
+}
diff --git a/app/Http/Requests/Scim/MembersAttributeRequest.php b/app/Http/Requests/Scim/MembersAttributeRequest.php
new file mode 100644
index 00000000000..7e9a5db8a00
--- /dev/null
+++ b/app/Http/Requests/Scim/MembersAttributeRequest.php
@@ -0,0 +1,63 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Http\Requests\Scim;
+
+use App\Services\Scim\Transformers\ScimCompanyMemberTransformer;
+
+class MembersAttributeRequest extends Request
+{
+    public function rules(): array
+    {
+        return array_merge(parent::rules(), [
+            'attributes' => 'Array|in:' . implode(',', ScimCompanyMemberTransformer::SCIM_FILTERS),
+            'filter' => 'string'
+        ]);
+    }
+
+    protected function prepareForValidation(): void
+    {
+        if ($this->has('attributes')) {
+            $this->merge([
+                'attributes' => explode(',', $this->get('attributes'))
+            ]);
+        }
+    }
+
+    public function hasFilters(): bool
+    {
+        return $this->has('filter');
+    }
+
+    /**
+     * @return string[]
+     */
+    public function getAttributes(): array
+    {
+        if ($this->shouldFilterAttributes()) {
+            return $this->get('attributes');
+        }
+        return $this->getAllAttributes();
+    }
+
+    public function getUserNameFromFilter(): ?string
+    {
+        $username = null;
+        if (preg_match(
+            '/userName eq \"([a-z0-9_.\-@]*)\"/i', $this->get('filter'), $matches) === 1) {
+            $username = $matches[1];
+        }
+        return $username;
+    }
+
+    private function shouldFilterAttributes(): bool
+    {
+        return $this->has('attributes');
+    }
+
+    private function getAllAttributes(): array
+    {
+        return ScimCompanyMemberTransformer::SCIM_FILTERS;
+    }
+}
diff --git a/app/Http/Requests/Scim/Request.php b/app/Http/Requests/Scim/Request.php
new file mode 100644
index 00000000000..5343f84515e
--- /dev/null
+++ b/app/Http/Requests/Scim/Request.php
@@ -0,0 +1,43 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Http\Requests\Scim;
+
+use App\DBModels;
+use App\Http\Requests;
+use App\Services\Scim\ErrorResponseFactory;
+use Illuminate\Contracts\Validation\Validator;
+use Illuminate\Database\Eloquent\ModelNotFoundException;
+use Illuminate\Validation\ValidationException;
+
+abstract class Request extends Requests\Request
+{
+    public function rules(): array
+    {
+        return [];
+    }
+
+    public function authorize(): bool
+    {
+        return true;
+    }
+
+    // TODO ZEN-12022 Use Laravel Passport to get company ID from auth token
+    /**
+     * @throws ModelNotFoundException
+     */
+    public function getCompanyFromAuthCode(): DBModels\Company
+    {
+        return DBModels\Company::findOrFail(3);
+    }
+
+    /**
+     * @throws ValidationException
+     */
+    protected function failedValidation(Validator $validator): void
+    {
+        $errorFactory = new ErrorResponseFactory();
+        throw new ValidationException($validator, $errorFactory->validationError($validator));
+    }
+}
diff --git a/app/Http/Requests/Scim/UpdateMemberAttributeRequest.php b/app/Http/Requests/Scim/UpdateMemberAttributeRequest.php
new file mode 100644
index 00000000000..a5ad1f7e6f3
--- /dev/null
+++ b/app/Http/Requests/Scim/UpdateMemberAttributeRequest.php
@@ -0,0 +1,52 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Http\Requests\Scim;
+
+use App\Services\Scim\Operation;
+
+class UpdateMemberAttributeRequest extends MembersAttributeRequest
+{
+    public function rules(): array
+    {
+        return array_merge(parent::rules(), [
+            'Operations' => 'Required|array',
+            'Operations.*.path' => 'in:displayName,active,timezone,userName,locale'
+        ]);
+    }
+
+    public function prepareForValidation(): void
+    {
+        $this->merge([
+            'Operations' => $this->formattedOperations()
+        ]);
+    }
+
+    /**
+     * @return Operation[]
+     */
+    public function getOperations(): array
+    {
+        return array_map(
+            static fn($operation) => new Operation(
+                $operation['path'],
+                $operation['value']
+            ),
+            $this->formattedOperations()
+        );
+    }
+
+    private function formattedOperations(): array
+    {
+        $formattedOperations = [];
+        foreach ($this->get('Operations') as $operation) {
+            $formattedOperations[] =  [
+                'op' => $operation['op'],
+                'path' => $operation['path'],
+                'value' => strval($operation['value'])
+            ];
+        }
+        return $formattedOperations;
+    }
+}
diff --git a/app/Http/Requests/Scim/UpdateMemberRequest.php b/app/Http/Requests/Scim/UpdateMemberRequest.php
new file mode 100644
index 00000000000..b24c5ba9ee0
--- /dev/null
+++ b/app/Http/Requests/Scim/UpdateMemberRequest.php
@@ -0,0 +1,58 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Http\Requests\Scim;
+
+use App\Exceptions\TimezoneInvalidException;
+use DateTime;
+use DateTimeZone;
+use Exception;
+
+class UpdateMemberRequest extends MembersAttributeRequest
+{
+    public function rules(): array
+    {
+        return array_merge(parent::rules(), [
+            'displayName' => 'String',
+            'locale' => 'LocaleSupported',
+            'timezone' => 'timezone',
+            'userName' => 'Email|Unique:users,email'
+        ]);
+    }
+
+    public function getLocaleAttribute(): ?string
+    {
+        return $this->get('locale');
+    }
+
+    public function getUserName(): ?string
+    {
+        return $this->get('userName');
+    }
+
+    public function getDisplayName(): ?string
+    {
+        return $this->get('displayName');
+    }
+
+    public function getTimeZone(): ?string
+    {
+        return $this->get('timezone');
+    }
+
+    /**
+     * @throws TimezoneInvalidException
+     */
+    public function getTimeZoneOffset(): ?int
+    {
+        if (!$this->getTimeZone()) {
+            return null;
+        }
+        try {
+            return (new DateTime('now', new DateTimeZone($this->getTimeZone())))->getOffset();
+        } catch (Exception) {
+            throw new TimezoneInvalidException($this->getTimeZone());
+        }
+    }
+}
diff --git a/app/Providers/RouteServiceProvider.php b/app/Providers/RouteServiceProvider.php
index 9ba03ec6791..9aa23c7f8ac 100644
--- a/app/Providers/RouteServiceProvider.php
+++ b/app/Providers/RouteServiceProvider.php
@@ -42,6 +42,9 @@ public function boot()
                     ->group(base_path("routes/web/{$fileName}.php"));
             }
 
+            Route::middleware([])
+                ->group(base_path('routes/scim.php'));
+
             Route::middleware('api')
                 ->group(base_path('routes/api.php'));
         });
diff --git a/app/Services/Scim/CompanyMemberUpdater.php b/app/Services/Scim/CompanyMemberUpdater.php
new file mode 100644
index 00000000000..9a09391b8cf
--- /dev/null
+++ b/app/Services/Scim/CompanyMemberUpdater.php
@@ -0,0 +1,102 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\Scim;
+
+use App\DBModels\Company;
+use App\DBModels\User;
+use App\Exceptions\TimezoneInvalidException;
+use App\Http\Requests\Scim\UpdateMemberAttributeRequest;
+use App\Http\Requests\Scim\UpdateMemberRequest;
+use App\Services\Company\Exceptions\FailedToDisconnectUserFromCompanyException;
+use App\Services\Company\User\Disconnector;
+use App\Services\Exceptions\Company\UserNotInCompanyException;
+use App\Services\User\UserService;
+use DateTime;
+use DateTimeZone;
+use Exception;
+
+class CompanyMemberUpdater
+{
+    public function __construct(
+        private readonly Disconnector $disconnector,
+        private readonly UserService $userService
+    ) {
+    }
+
+    /**
+     * @throws TimezoneInvalidException
+     */
+    public function updateMember(UpdateMemberRequest $request, User $user): User
+    {
+        $user->update([
+            'email' => $request->getUserName() ?? $user->email,
+            'fullName' => $request->getDisplayName() ?? $user->fullName,
+            'locale' => $request->getLocaleAttribute() ?? $user->locale,
+            'timeZoneOffset' => $request->getTimeZoneOffset() ?? $user->timeZoneOffset
+        ]);
+        return $user;
+    }
+
+    /**
+     * @throws TimezoneInvalidException
+     * @throws UserNotInCompanyException
+     * @throws FailedToDisconnectUserFromCompanyException
+     */
+    public function updateMemberAttributes(
+        UpdateMemberAttributeRequest $request,
+        User $user
+    ): User {
+        foreach ($request->getOperations() as $operation) {
+            switch ($operation->getAttributeName()) {
+                case 'active':
+                    $this->changeActiveAndCompanyConnection($user,
+                        $request->getCompanyFromAuthCode(),
+                        filter_var(
+                            $operation->getValue(),
+                            FILTER_VALIDATE_BOOLEAN,
+                            FILTER_NULL_ON_FAILURE
+                        ));
+                    break;
+                case 'timezone':
+                    $this->updateTimezone($user, $operation->getValue());
+                    break;
+                default:
+                    $user[$operation->getAttributeName()] = $operation->getValue();
+            }
+        }
+        $user->save();
+        return $user;
+    }
+
+    /**
+     * @throws UserNotInCompanyException
+     * @throws FailedToDisconnectUserFromCompanyException
+     */
+    private function changeActiveAndCompanyConnection(
+        User $user,
+        Company $company,
+        ?bool $isActive
+    ): void {
+        if ($isActive) {
+            $this->userService->activateUser($user);
+        } else if ($isActive !== null) {
+            $this->disconnector->disconnectUserFromCompany($user, $company);
+            $this->userService->deactivateUser($user);
+        }
+    }
+
+    /**
+     * @throws TimezoneInvalidException
+     */
+    private function updateTimezone(User $user, string $timeZone): void
+    {
+        try {
+            $offset = (new DateTime('now', new DateTimeZone($timeZone)))->getOffset();
+            $user->timeZoneOffset = $offset;
+        } catch (Exception) {
+            throw new TimezoneInvalidException($timeZone);
+        }
+    }
+}
diff --git a/app/Services/Scim/ErrorResponseFactory.php b/app/Services/Scim/ErrorResponseFactory.php
new file mode 100644
index 00000000000..82f7258595c
--- /dev/null
+++ b/app/Services/Scim/ErrorResponseFactory.php
@@ -0,0 +1,53 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\Scim;
+
+use Illuminate\Contracts\Validation\Validator;
+use Illuminate\Http\JsonResponse;
+use Log;
+use Response;
+
+class ErrorResponseFactory
+{
+    public function companyDoesNotExist(): JsonResponse
+    {
+        return $this->error('Company does not exist', 404);
+    }
+
+    public function companyDeactivated(): JsonResponse
+    {
+        return $this->error('Company is deactivated', 400);
+    }
+
+    public function memberLimitReached(): JsonResponse
+    {
+        return $this->error('Company member limit reached', 400);
+    }
+
+    public function companyMemberNotFound(): JsonResponse
+    {
+        return $this->error('Company member not found', 404);
+    }
+
+    public function companyMemberDeactivated(): JsonResponse
+    {
+        return $this->error('Company member is already deactivated', 404);
+    }
+    public function validationError(Validator $validator): JsonResponse
+    {
+        return $this->error($validator->errors()->first(), 400);
+    }
+
+    public function error(string $details, int $status): JsonResponse
+    {
+        Log::warning('Error:');
+        Log::warning($details);
+        return Response::json([
+            'schemas' => ['urn:ietf:params:scim:api:messages:2.0:Error'],
+            'detail' => $details,
+            'status' => $status
+        ]);
+    }
+}
diff --git a/app/Services/Scim/MemberCreatorFactory.php b/app/Services/Scim/MemberCreatorFactory.php
new file mode 100644
index 00000000000..8fc24d16c6f
--- /dev/null
+++ b/app/Services/Scim/MemberCreatorFactory.php
@@ -0,0 +1,63 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\Scim;
+
+use App\DBModels\User;
+use App\Exceptions\TimezoneInvalidException;
+use App\Exceptions\UserIPAddressNotAllowedException;
+use App\Http\Requests\Scim\CreateMemberRequest;
+use App\Services;
+use App\Services\User\Creator\CompanyUser;
+use Hash;
+use Illuminate\Database\Eloquent\ModelNotFoundException;
+
+class MemberCreatorFactory
+{
+    public function __construct(
+        private readonly Services\User\DateTimeFormatter $dateTimeFormatter,
+        private readonly Services\User\Password\ValidatorFactory $validatorFactory,
+        private readonly Services\Company\CompanyManager $companyManager,
+        private readonly Services\Company\CompanyIPAddressValidationService $ipAddressValidationService,
+        private readonly Services\Company\CompanyDeactivatedValidationService $companyDeactivatedValidationService,
+        private readonly Services\User\Password\Generator $passwordGenerator
+    ) {
+    }
+
+    /**
+     * @throws Services\Company\Exceptions\CompanyDeactivatedException
+     * @throws Services\User\Exceptions\MaxMembersLimitReachedException
+     * @throws ModelNotFoundException
+     * @throws UserIPAddressNotAllowedException
+     * @throws TimezoneInvalidException
+     */
+    public function createCompanyUser(CreateMemberRequest $request): User
+    {
+        $creator = new CompanyUser(
+            $this->getUser($request),
+            $this->validatorFactory->defaultValidator(),
+            $request->getCompanyFromAuthCode(),
+            $this->companyManager,
+            $this->ipAddressValidationService,
+            $this->companyDeactivatedValidationService
+        );
+        $creator->setPassword(Hash::make($this->passwordGenerator->generatePassword()));
+        return $creator->saveUser();
+    }
+
+    /**
+     * @throws TimezoneInvalidException
+     */
+    private function getUser(CreateMemberRequest $request): User
+    {
+        $user = new User();
+        $user->email = $request->getUserName();
+        $user->fullName = $request->getDisplayName();
+        $user->locale = $request->getLocale();
+        $user->timeZoneOffset = $request->getTimeZoneOffset();
+        $user->ip = $request->ip();
+        $user->passwordChangeDate = $this->dateTimeFormatter->microtime();
+        return $user;
+    }
+}
diff --git a/app/Services/Scim/Operation.php b/app/Services/Scim/Operation.php
new file mode 100644
index 00000000000..d2d1c2a41f4
--- /dev/null
+++ b/app/Services/Scim/Operation.php
@@ -0,0 +1,33 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\Scim;
+
+class Operation
+{
+    /** @var string[] */
+    private const SCIM_ATTRIBUTE_MAP = [
+        'userName' => 'email',
+        'displayName' => 'fullName',
+        'active' => 'active',
+        'timezone' => 'timezone',
+        'locale' => 'locale'
+    ];
+
+    public function __construct(
+        private readonly string $path,
+        private readonly string $value
+    ) {
+    }
+
+    public function getAttributeName(): string
+    {
+        return self::SCIM_ATTRIBUTE_MAP[$this->path];
+    }
+
+    public function getValue(): string
+    {
+        return $this->value;
+    }
+}
diff --git a/app/Services/Scim/Transformers/ScimCompanyMemberTransformer.php b/app/Services/Scim/Transformers/ScimCompanyMemberTransformer.php
new file mode 100644
index 00000000000..9649315474d
--- /dev/null
+++ b/app/Services/Scim/Transformers/ScimCompanyMemberTransformer.php
@@ -0,0 +1,55 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\Scim\Transformers;
+
+use App\DBModels\User;
+use League\Fractal\Resource\Primitive;
+use League\Fractal\TransformerAbstract;
+
+class ScimCompanyMemberTransformer extends TransformerAbstract
+{
+    public const SCIM_FILTERS = [
+        'schemas',
+        'userName',
+        'active',
+        'displayName',
+        'locale'
+    ];
+
+    public function __construct()
+    {
+        $this->availableIncludes = self::SCIM_FILTERS;
+    }
+
+    public function transform(User $member): array {
+        return [
+            'id' => $member->id,
+        ];
+    }
+
+    public function includeSchemas(): Primitive {
+        return $this->primitive(['urn:ietf:params:scim:schemas:extension:enterprise:2.0:User']);
+    }
+
+    public function includeUserName(User $member): Primitive
+    {
+        return $this->primitive($member->email);
+    }
+
+    public function includeActive(User $member): Primitive
+    {
+        return $this->primitive($member->active);
+    }
+
+    public function includeDisplayName(User $member): Primitive
+    {
+        return $this->primitive($member->fullName);
+    }
+
+    public function includeLocale(User $member): Primitive
+    {
+        return $this->primitive($member->locale);
+    }
+}
diff --git a/app/Services/User/Creator/CompanyInvitedUser.php b/app/Services/User/Creator/CompanyInvitedUser.php
new file mode 100644
index 00000000000..ea7727a3c71
--- /dev/null
+++ b/app/Services/User/Creator/CompanyInvitedUser.php
@@ -0,0 +1,65 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\User\Creator;
+
+use App\DBModels;
+use App\Exceptions\UserIPAddressNotAllowedException;
+use App\Services\Company;
+use App\Services\User;
+
+class CompanyInvitedUser extends CompanyUser
+{
+    private DBModels\UserInvitation $userInvitation;
+
+    public function __construct(
+        DBModels\User $user,
+        User\Password\Validator $passwordValidator,
+        DBModels\UserInvitation $userInvitation,
+        Company\CompanyManager $companyManager,
+        Company\CompanyIPAddressValidationService $ipAddressValidationService,
+        Company\CompanyDeactivatedValidationService $companyDeactivatedValidationService
+    ) {
+        $this->userInvitation = $userInvitation;
+        parent::__construct(
+            $user,
+            $passwordValidator,
+            $this->companyFromInvitation(),
+            $companyManager,
+            $ipAddressValidationService,
+            $companyDeactivatedValidationService
+        );
+    }
+
+    /**
+     * @throws User\Exceptions\InvitationEmailNotMatchedException
+     * @throws UserIPAddressNotAllowedException
+     * @throws Company\Exceptions\CompanyDeactivatedException
+     * @throws User\Exceptions\MaxMembersLimitReachedException
+     */
+    public function saveUser(): DBModels\User
+    {
+        $this->validateInvitation();
+        $createdUser = parent::saveUser();
+
+        $this->userInvitation->user_id = $createdUser->id;
+        $this->userInvitation->save();
+        return $createdUser;
+    }
+
+    private function companyFromInvitation(): DBModels\Company
+    {
+        return $this->userInvitation->company;
+    }
+
+    /**
+     * @throws User\Exceptions\InvitationEmailNotMatchedException
+     */
+    private function validateInvitation(): void
+    {
+        if ($this->userInvitation->email !== $this->user->email) {
+            throw new User\Exceptions\InvitationEmailNotMatchedException();
+        }
+    }
+}
diff --git a/app/Services/User/Creator/CompanyUser.php b/app/Services/User/Creator/CompanyUser.php
index 87b9d1d9455..46bb01c055b 100644
--- a/app/Services/User/Creator/CompanyUser.php
+++ b/app/Services/User/Creator/CompanyUser.php
@@ -1,44 +1,30 @@
-<?php namespace App\Services\User\Creator;
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\User\Creator;
 
 use App\DBModels;
+use App\Exceptions\UserIPAddressNotAllowedException;
 use App\Services\Company;
 use App\Services\User;
 
 class CompanyUser extends PlainUser
 {
-    /** @var DBModels\UserInvitation */
-    private $userInvitation;
-
-    /** @var Company\CompanyManager */
-    private $companyManager;
-
-    /** @var Company\CompanyIPAddressValidationService */
-    private $ipAddressValidationService;
+    private DBModels\Company $company;
+    private Company\CompanyDeactivatedValidationService $companyDeactivatedValidationService;
+    private Company\CompanyManager $companyManager;
+    private Company\CompanyIPAddressValidationService $ipAddressValidationService;
 
-    /** @var Company\CompanyDeactivatedValidationService */
-    private $companyDeactivatedValidationService;
-
-    /** @var DBModels\Company */
-    private $company;
-
-    /**
-     * CompanyUser constructor.
-     * @param DBModels\User $user
-     * @param User\Password\Validator $passwordValidator
-     * @param DBModels\UserInvitation $userInvitation
-     * @param Company\CompanyManager $companyManager
-     * @param Company\CompanyIPAddressValidationService $ipAddressValidationService
-     * @param Company\CompanyDeactivatedValidationService $companyDeactivatedValidationService
-     */
     public function __construct(
         DBModels\User $user,
         User\Password\Validator $passwordValidator,
-        DBModels\UserInvitation $userInvitation,
+        DBModels\Company $company,
         Company\CompanyManager $companyManager,
         Company\CompanyIPAddressValidationService $ipAddressValidationService,
         Company\CompanyDeactivatedValidationService $companyDeactivatedValidationService
     ) {
-        $this->userInvitation = $userInvitation;
+        $this->company = $company;
         $this->companyManager = $companyManager;
         $this->ipAddressValidationService = $ipAddressValidationService;
         $this->companyDeactivatedValidationService = $companyDeactivatedValidationService;
@@ -47,24 +33,9 @@ public function __construct(
     }
 
     /**
-     * @throws Company\Exceptions\CompanyCreationFailedException
      * @throws Company\Exceptions\CompanyDeactivatedException
-     * @throws User\Exceptions\InvitationEmailNotMatchedException
      * @throws User\Exceptions\MaxMembersLimitReachedException
-     * @throws \App\Exceptions\UserIPAddressNotAllowedException
-     * @throws \App\Services\Accounting\Exceptions\ChargeableAlreadyHasWalletException
-     * @throws \App\Services\Accounting\Exceptions\InvalidAmount
-     * @throws \App\Services\Accounting\Exceptions\UnsupportedCurrencyException
-     * @throws \App\Services\Acl\Exceptions\AclRoleNotFound
-     * @throws \App\Services\Api\Exceptions\FailedToGenerateApiKeyException
-     * @throws \App\Services\Exceptions\Company\UserBelongsToCompanyException
-     * @throws \App\Services\Exceptions\SubscriptionPlan\AlreadySubscribedException
-     * @throws \App\Services\Exceptions\SubscriptionPlan\InvalidPlanFrequency
-     * @throws \App\Services\Exceptions\SubscriptionPlan\SubscriptionPlanNotFoundException
-     * @throws \App\Services\Exceptions\SubscriptionPlan\SubscriptionPlanPriceNotFoundException
-     * @throws \App\Services\Exceptions\SubscriptionPlan\SubscriptionRenewalFrequencyNotFoundException
-     * @throws \App\Services\Exceptions\UserDoesNotExistException
-     * @throws \App\Services\Exceptions\User\CampaignCodeInvalidException
+     * @throws UserIPAddressNotAllowedException
      */
     public function saveUser(): DBModels\User
     {
@@ -73,77 +44,48 @@ public function saveUser(): DBModels\User
         $this->user->confirmed = true;
         $createdUser = parent::saveUser();
 
-        $this->userInvitation->user_id = $createdUser->id;
-        $this->userInvitation->save();
-        
-        $this->companyManager->addUserToCompany($createdUser, $this->companyFromInvitation());
+        $this->companyManager->addUserToCompany($createdUser, $this->company);
 
         return $createdUser;
     }
 
     /**
-     * @throws \App\Exceptions\UserIPAddressNotAllowedException
-     * @throws \App\Services\User\Exceptions\InvitationEmailNotMatchedException
-     * @throws \App\Services\Company\Exceptions\CompanyDeactivatedException
-     * @throws \App\Services\User\Exceptions\MaxMembersLimitReachedException
+     * @throws UserIPAddressNotAllowedException
+     * @throws Company\Exceptions\CompanyDeactivatedException
+     * @throws User\Exceptions\MaxMembersLimitReachedException
      */
     private function validateCompanyRelatedSettings(): void
     {
-        $this->validateInvitation();
         $this->validateCompany();
         $this->validateIpAddress();
         $this->validateMembersLimitsCount();
     }
 
     /**
-     * @return DBModels\Company
-     */
-    private function companyFromInvitation()
-    {
-        if ($this->company === null) {
-            $this->company = $this->userInvitation->company;
-        }
-
-        return $this->company;
-    }
-
-    /**
-     * @throws \App\Exceptions\UserIPAddressNotAllowedException
+     * @throws UserIPAddressNotAllowedException
      */
     private function validateIpAddress()
     {
         $this->ipAddressValidationService->validateWithCompany(
-            $this->companyFromInvitation(),
+            $this->company,
             $this->user->ip
         );
     }
 
     /**
-     * @throws \App\Services\User\Exceptions\InvitationEmailNotMatchedException
-     */
-    private function validateInvitation()
-    {
-        if ($this->userInvitation->email !== $this->user->email) {
-            throw new User\Exceptions\InvitationEmailNotMatchedException();
-        }
-    }
-
-    /**
-     * @throws \App\Services\Company\Exceptions\CompanyDeactivatedException
+     * @throws Company\Exceptions\CompanyDeactivatedException
      */
     private function validateCompany()
     {
-        $this->companyDeactivatedValidationService->validateWithCompany($this->companyFromInvitation());
+        $this->companyDeactivatedValidationService->validateWithCompany($this->company);
     }
 
     /**
-     * @throws \App\Services\User\Exceptions\MaxMembersLimitReachedException
+     * @throws User\Exceptions\MaxMembersLimitReachedException
      */
     private function validateMembersLimitsCount(): void
     {
-        $company = $this->companyFromInvitation();
-
-        if ($company->users()->count() >= $company->membersLimit) {
+        if ($this->company->users()->count() >= $this->company->membersLimit) {
             throw new User\Exceptions\MaxMembersLimitReachedException();
         }
     }
diff --git a/app/Services/User/Creator/PlainUser.php b/app/Services/User/Creator/PlainUser.php
index 326439072ef..6ba83295cdc 100644
--- a/app/Services/User/Creator/PlainUser.php
+++ b/app/Services/User/Creator/PlainUser.php
@@ -1,28 +1,19 @@
-<?php namespace App\Services\User\Creator;
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\User\Creator;
 
 use App\DBModels;
-use App\Services\User;
+use App\Services\User\Password\Validator;
 use Illuminate\Support;
 
 class PlainUser implements UserCreatorInterface
 {
-    /** @var DBModels\User */
-    protected $user;
-
-    /** @var User\Password\Validator */
-    protected $passwordValidator;
-
-    /**
-     * PlainUser constructor.
-     * @param DBModels\User $user
-     * @param User\Password\Validator $passwordValidator
-     */
     public function __construct(
-        DBModels\User $user,
-        User\Password\Validator $passwordValidator
+        protected DBModels\User $user,
+        protected Validator $passwordValidator
     ) {
-        $this->user = $user;
-        $this->passwordValidator = $passwordValidator;
     }
 
     public function saveUser(): DBModels\User
@@ -57,10 +48,7 @@ private function createTranslationMemoryForUser()
         $this->user->translationMemory()->associate($translationMemory);
     }
 
-    /**
-     * @return string
-     */
-    private function generateConfirmationCode()
+    private function generateConfirmationCode(): string
     {
         return hash(
             'sha256',
diff --git a/app/Services/User/Password/Generator.php b/app/Services/User/Password/Generator.php
new file mode 100644
index 00000000000..a39e3e9e2c9
--- /dev/null
+++ b/app/Services/User/Password/Generator.php
@@ -0,0 +1,24 @@
+<?php
+
+declare(strict_types=1);
+
+namespace App\Services\User\Password;
+
+class Generator
+{
+    public function generatePassword(): string
+    {
+        $digits = array_flip(range('0', '9'));
+        $lowercase = array_flip(range('a', 'z'));
+        $uppercase = array_flip(range('A', 'Z'));
+        $special = array_flip(str_split('!@#$%^&*()_+=-}{[}]\|;:<>?/'));
+        $combined = array_merge($digits, $lowercase, $uppercase, $special);
+
+        return str_shuffle(array_rand($digits) .
+            array_rand($lowercase) .
+            array_rand($uppercase) .
+            array_rand($special) .
+            implode(array_rand($combined, rand(10, 20)))
+        );
+    }
+}
diff --git a/app/Services/User/UserCreatorFactory.php b/app/Services/User/UserCreatorFactory.php
index f0e7456314e..18cae3c1570 100644
--- a/app/Services/User/UserCreatorFactory.php
+++ b/app/Services/User/UserCreatorFactory.php
@@ -9,6 +9,7 @@
 use App\Services\Exceptions;
 use App\Services\Subscription;
 use App\Services\TranslationProject;
+use App\Services\User\Creator\CompanyInvitedUser;
 use App\Services\User\Creator\TrialCompanyOwner;
 use Config;
 
@@ -296,7 +297,7 @@ private function userWithInvitationCodeCreator()
             return $this->companyOwnerCreator();
         }
 
-        return $this->companyUserCreator();
+        return $this->companyInvitedUserCreator();
     }
 
     /**
@@ -377,12 +378,11 @@ private function wordpressUserCreator()
     }
 
     /**
-     * @return Creator\CompanyUser
      * @throws \App\Services\Exceptions\User\InvitationCodeNotFoundException
      */
-    private function companyUserCreator()
+    private function companyInvitedUserCreator(): CompanyInvitedUser
     {
-        return new Creator\CompanyUser(
+        return new Creator\CompanyInvitedUser(
             $this->getUser(),
             $this->validatorFactory->companyValidator(
                 $this->getUserInvitationCode()->company,
diff --git a/routes/scim.php b/routes/scim.php
new file mode 100644
index 00000000000..c1d224ba0a7
--- /dev/null
+++ b/routes/scim.php
@@ -0,0 +1,17 @@
+<?php
+
+declare(strict_types=1);
+
+use App\Http\Controllers\Scim;
+
+Route::group(['prefix' => 'scim/v2'], function () {
+    Route::get('/ServiceProviderConfig', [Scim\ServiceProviderConfig::class, 'getConfig']);
+    Route::group(['prefix' => '/Users'], function () {
+        Route::post('/', [Scim\CreateMemberController::class, 'createUser']);
+        Route::get('/', [Scim\GetMembersController::class, 'getMembers']);
+        Route::get('/{id}', [Scim\GetMembersController::class, 'getMember']);
+        Route::delete('/{id}', [Scim\RemoveMemberController::class, 'deactivateUser']);
+        Route::patch('/{id}', [Scim\UpdateMemberAttributesController::class, 'updateMemberAttributes']);
+        Route::put('/{id}', [Scim\UpdateMemberController::class, 'updateMember']);
+    });
+});
diff --git a/tests/Integration/Users/UserController/Creator/UserFactoryCreatorTest.php b/tests/Integration/Users/UserController/Creator/UserFactoryCreatorTest.php
index 8f6037a76de..5bb0d7630b6 100644
--- a/tests/Integration/Users/UserController/Creator/UserFactoryCreatorTest.php
+++ b/tests/Integration/Users/UserController/Creator/UserFactoryCreatorTest.php
@@ -36,7 +36,7 @@ public function testCreatorMethodWithInvitationCodeForCompanyUsers(): void
             ])
         );
 
-        static::assertInstanceOf(User\Creator\CompanyUser::class, $creatorMethod);
+        static::assertInstanceOf(User\Creator\CompanyInvitedUser::class, $creatorMethod);
     }
 
     /**`
