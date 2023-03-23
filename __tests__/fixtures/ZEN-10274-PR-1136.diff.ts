export const diff = `diff --git a/composer.json b/composer.json
index 6891b7cfc9..ec20a92fad 100644
--- a/composer.json
+++ b/composer.json
@@ -65,6 +65,7 @@
     "barryvdh/laravel-ide-helper": "^2.6.0",
     "filp/whoops": "~2.0",
     "itsgoingd/clockwork": "^5.0",
+    "laravel/pint": "^1.6",
     "laravel/tinker": "^2.7",
     "mockery/mockery": "^1.2.2",
     "orchestra/testbench": "^7.0",
diff --git a/composer.lock b/composer.lock
index b817b78296..2e7ed73670 100644
--- a/composer.lock
+++ b/composer.lock
@@ -4,7 +4,7 @@
         "Read more about it at https://getcomposer.org/doc/01-basic-usage.md#installing-dependencies",
         "This file is @generated automatically"
     ],
-    "content-hash": "3fe7b4db9933e2c968394c6f27710e1c",
+    "content-hash": "aa767f43f7ba5eb250d271ad03551ad3",
     "packages": [
         {
             "name": "aws/aws-crt-php",
@@ -13380,6 +13380,72 @@
             ],
             "time": "2022-11-02T21:11:04+00:00"
         },
+        {
+            "name": "laravel/pint",
+            "version": "v1.6.0",
+            "source": {
+                "type": "git",
+                "url": "https://github.com/laravel/pint.git",
+                "reference": "e48e3fadd7863d6b7d03464f5c4f211a828b890f"
+            },
+            "dist": {
+                "type": "zip",
+                "url": "https://api.github.com/repos/laravel/pint/zipball/e48e3fadd7863d6b7d03464f5c4f211a828b890f",
+                "reference": "e48e3fadd7863d6b7d03464f5c4f211a828b890f",
+                "shasum": ""
+            },
+            "require": {
+                "ext-json": "*",
+                "ext-mbstring": "*",
+                "ext-tokenizer": "*",
+                "ext-xml": "*",
+                "php": "^8.1.0"
+            },
+            "require-dev": {
+                "friendsofphp/php-cs-fixer": "^3.14.4",
+                "illuminate/view": "^10.0.0",
+                "laravel-zero/framework": "^10.0.0",
+                "mockery/mockery": "^1.5.1",
+                "nunomaduro/larastan": "^2.4.0",
+                "nunomaduro/termwind": "^1.15.1",
+                "pestphp/pest": "^1.22.4"
+            },
+            "bin": [
+                "builds/pint"
+            ],
+            "type": "project",
+            "autoload": {
+                "psr-4": {
+                    "App\\": "app/",
+                    "Database\\Seeders\\": "database/seeders/",
+                    "Database\\Factories\\": "database/factories/"
+                }
+            },
+            "notification-url": "https://packagist.org/downloads/",
+            "license": [
+                "MIT"
+            ],
+            "authors": [
+                {
+                    "name": "Nuno Maduro",
+                    "email": "enunomaduro@gmail.com"
+                }
+            ],
+            "description": "An opinionated code formatter for PHP.",
+            "homepage": "https://laravel.com",
+            "keywords": [
+                "format",
+                "formatter",
+                "lint",
+                "linter",
+                "php"
+            ],
+            "support": {
+                "issues": "https://github.com/laravel/pint/issues",
+                "source": "https://github.com/laravel/pint"
+            },
+            "time": "2023-02-21T15:44:57+00:00"
+        },
         {
             "name": "laravel/tinker",
             "version": "v2.7.3",
diff --git a/ecs-test-file.php b/ecs-test-file.php
index 3f29d9628d..b01d117f6b 100644
--- a/ecs-test-file.php
+++ b/ecs-test-file.php
@@ -15,16 +15,5 @@ function _myFunc (
         int $arg = 0,
         $arg2,
     ): ? bool{
-        if (true) {
-            return true;
-        } else if {
-            return false;
-        } else {
-            return true;
-        }
-
-        for ($i=0;$i<10;$i++){ echo $i; }
-
-        return false;
     }
 }
diff --git a/ecs.php b/ecs.php
deleted file mode 100644
index d2c96a357e..0000000000
--- a/ecs.php
+++ /dev/null
@@ -1,63 +0,0 @@
-<?php
-
-declare(strict_types=1);
-
-use PHP_CodeSniffer\Standards;
-use Symplify\EasyCodingStandard\Config\ECSConfig;
-use Symplify\EasyCodingStandard\ValueObject\Set\SetList;
-
-return static function (ECSConfig $ecsConfig): void {
-    $ecsConfig->rules([
-        Standards\Generic\Sniffs\PHP\RequireStrictTypesSniff::class, // Always add declare(strict_types=1); to all new classes.
-
-        // TODO: You can add some breathing space to code by adding linebreaks. Never add more than one linebreak in the same place though.
-        Standards\Squiz\Sniffs\Operators\ComparisonOperatorUsageSniff::class, // Always use === for comparison
-        Standards\Generic\Sniffs\Arrays\DisallowLongArraySyntaxSniff::class, // Always use [] to declare arrays, not array()
-        // Fixer\ArrayNotation\NoTrailingCommaInSinglelineArrayFixer::class, // Trailing comma is optional, but don’t use it for single line arrays.
-        // TODO: Don’t use associative arrays for passing data to or from functions.
-        // TODO: When your if contains more than one && or ||, extract the check into private method.
-        // TODO: Don’t compare variables with booleans in your ifs, unless variables can take other, non-boolean values.
-        // Fixer\ControlStructure\SimplifiedIfReturnFixer::class, // Don’t use if/else if you just return true/false
-        // TODO: Prefer foreach over for loops for iterating over arrays.
-        // TODO: Prefer array_map, array_reduce over for or foreach, when applicable.
-        // Fixer\StringNotation\SingleQuoteFixer::class, // Prefer single quotes over double quotes, unless the string contains variables that need to be expanded with {}.
-        // TODO: Avoid using flag-like or optional arguments.
-        // TODO: Write short methods. Shorter methods are easier to maintain and read. There is no limit on how long your method can be, but try to keep it around 15-20 lines.
-        // TODO: Don’t catch an exception just to throw it again. For example:
-        // TODO: Throw early, catch late
-        // TODO: Group identical exception handlers.
-        // TODO: Don’t wrap your code into catch-all blocks, especially when some parts of the code don’t throw.
-        // TODO: Be explicit about what method does. Avoid abstract names like process, prepare and so on, since they can mean many things.
-        // TODO: Don’t include full namespace in the class name.
-        // TODO: When naming classes or interfaces, it’s better to be too specific than too general.
-        // TODO: Don’t use one-letter variables. i and j are exceptions.
-        // TODO: If you import multiple classes from the same namespace, import the common part of the name.
-        // TODO: If name of the class is not unique enough (for example, there are more than one “Exception” classes), then import the unique part of the namespace. For example:
-        // TODO: Avoid using comments that describe what method is doing or what variable is for. Almost any comment can be replaced with good method or variable name.
-        Standards\Squiz\Sniffs\PHP\CommentedOutCodeSniff::class, // TODO: Don’t comment out code that is not used anymore. Just delete it.
-        // TODO: You can always replace a comment with a private method call. This makes code more readable and maintainable.
-        Standards\Generic\Sniffs\Commenting\TodoSniff::class, // If you need to leave a @TODO, always create a ticket for it and add it to the comment. If you don’t, you might as well remove it.
-        // TODO: Decorate class properties with one-line PHPDoc comments only when they cannot be described with PHP type annotations.
-        // TODO: Add PHPDoc only for method arguments or return types that cannot be described with PHP type annotations.
-        Standards\Squiz\Sniffs\Commenting\FunctionCommentThrowTagSniff::class, // Always add @throws annotations for any unhandled exceptions. For example:
-        // TODO: Don’t use class-level declarations, unless you need to add @mixin or “magic” properties for Eloquent Models.
-        // TODO: Use dependency injection instead of App::make.
-        // TODO: Split long translation strings.
-
-        // Fixer\Comment\NoEmptyCommentFixer::class, // No empty comments
-        // Fixer\Phpdoc\NoEmptyPhpdocFixer::class, // No empty Phpdocs
-        // Fixer\Semicolon\NoEmptyStatementFixer::class, // No useless semicolons
-        Standards\Generic\Sniffs\Arrays\ArrayIndentSniff::class, // Indent array elements
-
-        Standards\Generic\Sniffs\Files\LineLengthSniff::class, // Break lines longer than 120 characters.
-    ]);
-
-    // Use === null instead of is_null
-    $ecsConfig->ruleWithConfiguration(Standards\Generic\Sniffs\PHP\ForbiddenFunctionsSniff::class, [
-        'forbiddenFunctions' => [
-            'is_null' => null,
-        ],
-    ]);
-
-    $ecsConfig->sets([SetList::PSR_12]);
-};
diff --git a/pint.json b/pint.json
new file mode 100644
index 0000000000..03f08e0cf7
--- /dev/null
+++ b/pint.json
@@ -0,0 +1,4 @@
+{
+  "preset": "psr12",
+  "format": "json"
+}`
