"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectTestFiles = collectTestFiles;
exports.removeCompiledTestsWithoutSource = removeCompiledTestsWithoutSource;
exports.runSuite = runSuite;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_test_1 = require("node:test");
const reporters_1 = require("node:test/reporters");
function collectTestFiles(dir, extension) {
    let files = [];
    for (const entry of node_fs_1.default.readdirSync(dir)) {
        const fullPath = node_path_1.default.join(dir, entry);
        const stat = node_fs_1.default.statSync(fullPath);
        if (stat.isDirectory()) {
            files = files.concat(collectTestFiles(fullPath, extension));
        }
        else if (entry.endsWith(extension)) {
            files.push(fullPath);
        }
    }
    return files;
}
function toProjectPath(file, projectDir) {
    return node_path_1.default
        .relative(projectDir, file)
        .split(node_path_1.default.sep)
        .join('/');
}
function toSourceTestPath(compiledFile, distDir, sourceDir) {
    const relativeCompiledPath = node_path_1.default.relative(distDir, compiledFile);
    const relativeSourcePath = relativeCompiledPath.replace(/\.js$/, '.ts');
    return node_path_1.default.join(sourceDir, relativeSourcePath);
}
function removeCompiledTestsWithoutSource(testFiles, options) {
    const runnableFiles = [];
    const removedFiles = [];
    const outdatedFiles = [];
    const log = options.log ?? ((message) => console.warn(message));
    for (const file of testFiles) {
        const sourceFile = toSourceTestPath(file, options.distDir, options.sourceDir);
        if (node_fs_1.default.existsSync(sourceFile)) {
            runnableFiles.push(file);
            if (node_fs_1.default.statSync(sourceFile).mtimeMs > node_fs_1.default.statSync(file).mtimeMs) {
                outdatedFiles.push({
                    compiled: toProjectPath(file, options.projectDir),
                    source: toProjectPath(sourceFile, options.projectDir)
                });
            }
        }
        else {
            node_fs_1.default.unlinkSync(file);
            removedFiles.push(toProjectPath(file, options.projectDir));
        }
    }
    if (removedFiles.length) {
        log([
            'Removed stale compiled tests without source:',
            ...removedFiles.sort().map((file) => `- ${file}`)
        ].join('\n'));
    }
    if (outdatedFiles.length) {
        throw new Error([
            'Compiled tests are older than source tests.',
            '',
            'Rebuild before npm test:',
            ...outdatedFiles
                .sort((left, right) => left.compiled.localeCompare(right.compiled))
                .map(({ compiled, source }) => `- ${compiled} (source: ${source})`)
        ].join('\n'));
    }
    return runnableFiles;
}
function runSuite(options = {}) {
    const distDir = options.distDir ?? node_path_1.default.resolve(__dirname);
    const projectDir = options.projectDir ?? node_path_1.default.resolve(distDir, '..');
    const sourceDir = options.sourceDir ?? node_path_1.default.join(projectDir, 'src');
    const runnerFile = options.runnerFile ?? __filename;
    const testFiles = removeCompiledTestsWithoutSource(collectTestFiles(distDir, '.test.js')
        .filter((file) => node_path_1.default.resolve(file) !== node_path_1.default.resolve(runnerFile)), {
        distDir,
        sourceDir,
        projectDir,
        log: options.log
    });
    if (!testFiles.length) {
        console.warn('No test files found in dist/');
        process.exit(1);
    }
    (0, node_test_1.run)({
        files: testFiles,
        concurrency: true,
        isolation: 'process'
    })
        .on('test:fail', () => {
        process.exitCode = 1;
    })
        .compose(reporters_1.spec)
        .pipe(process.stdout);
}
if (process.argv[1] !== undefined && node_path_1.default.resolve(process.argv[1]) === node_path_1.default.resolve(__filename)) {
    runSuite();
}
//# sourceMappingURL=suite.js.map