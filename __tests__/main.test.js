"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const json = __importStar(require("./fixtures/ZEN-10221.json"));
const getComments_1 = require("../src/getComments");
const transformOutputToFeedback_1 = require("../src/transformOutputToFeedback");
(0, globals_1.test)('It transforms JSON output to feedback', () => {
    const files = (0, transformOutputToFeedback_1.transformOutputToFeedback)(json.files);
    (0, globals_1.expect)(files).toEqual([
        {
            path: 'app/Services/Language/Rules/LanguageMapper.php',
            feedback: [
                {
                    file_path: 'app/Services/Language/Rules/LanguageMapper.php',
                    line: 61,
                    message: 'Line exceeds maximum limit of 100 characters; contains 101 characters',
                    source_class: 'PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\Files\\LineLengthSniff.MaxExceeded'
                }
            ]
        },
        {
            path: 'config/locales.php',
            feedback: [
                {
                    file_path: 'config/locales.php',
                    line: 1,
                    message: 'Missing required strict_types declaration',
                    source_class: 'PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\PHP\\RequireStrictTypesSniff.MissingDeclaration'
                }
            ]
        }
    ]);
});
(0, globals_1.test)('It extracts comments from ZEN-10221', () => {
    const output = Object.entries(json.files)
        .filter((file) => {
        return Object.keys(file[1]).includes('errors');
    })
        .map((file) => {
        const [path, feedback] = [file[0], file[1]];
        const result = {
            path,
            feedback: feedback.errors
        };
        return result;
    });
    const comments = (0, getComments_1.getComments)(output);
    (0, globals_1.expect)(comments).toEqual([
        {
            path: 'app/Services/Language/Rules/LanguageMapper.php',
            body: 'Line exceeds maximum limit of 100 characters; contains 101 characters\n' +
                '\n' +
                'Source: PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\Files\\LineLengthSniff.MaxExceeded',
            side: 'RIGHT',
            start_side: 'RIGHT',
            line: 61
        },
        {
            path: 'config/locales.php',
            body: 'Missing required strict_types declaration\n' +
                '\n' +
                'Source: PHP_CodeSniffer\\Standards\\Generic\\Sniffs\\PHP\\RequireStrictTypesSniff.MissingDeclaration',
            side: 'RIGHT',
            start_side: 'RIGHT',
            line: 1
        }
    ]);
});
(0, globals_1.test)('it handles empty JSON', () => {
    const feedback = (0, transformOutputToFeedback_1.transformOutputToFeedback)([]);
    const comments = (0, getComments_1.getComments)(feedback);
    (0, globals_1.expect)(comments).toEqual([]);
});
