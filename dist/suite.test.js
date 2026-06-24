"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_os_1 = require("node:os");
const node_path_1 = require("node:path");
const node_test_1 = require("node:test");
const suite_1 = require("./suite");
async function withTempProject(fn) {
    const projectDir = await (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'suite-runner-'));
    const sourceDir = (0, node_path_1.join)(projectDir, 'src');
    const distDir = (0, node_path_1.join)(projectDir, 'dist');
    try {
        await (0, promises_1.mkdir)(sourceDir, { recursive: true });
        await (0, promises_1.mkdir)(distDir, { recursive: true });
        await fn({
            projectDir,
            sourceDir,
            distDir
        });
    }
    finally {
        await (0, promises_1.rm)(projectDir, { recursive: true, force: true });
    }
}
async function touch(file) {
    await (0, promises_1.mkdir)((0, node_path_1.dirname)(file), { recursive: true });
    await (0, promises_1.writeFile)(file, '');
}
function projectPath(root, file) {
    return (0, node_path_1.relative)(root, file).split(node_path_1.sep).join('/');
}
(0, node_test_1.describe)('suite runner helpers', () => {
    (0, node_test_1.describe)('collectTestFiles', () => {
        (0, node_test_1.test)('returns matching test files from nested directories', async () => {
            await withTempProject(async ({ distDir }) => {
                await touch((0, node_path_1.join)(distDir, 'a.test.js'));
                await touch((0, node_path_1.join)(distDir, 'nested', 'b.test.js'));
                await touch((0, node_path_1.join)(distDir, 'nested', 'c.test.ts'));
                await touch((0, node_path_1.join)(distDir, 'regular.js'));
                const files = (0, suite_1.collectTestFiles)(distDir, '.test.js')
                    .map((file) => projectPath(distDir, file))
                    .sort();
                strict_1.default.deepStrictEqual(files, [
                    'a.test.js',
                    'nested/b.test.js'
                ]);
            });
        });
    });
    (0, node_test_1.describe)('removeCompiledTestsWithoutSource', () => {
        (0, node_test_1.test)('deletes stale compiled tests and keeps runnable tests', async () => {
            await withTempProject(async ({ projectDir, sourceDir, distDir }) => {
                const runnableCompiled = (0, node_path_1.join)(distDir, 'feature', 'active.test.js');
                const staleCompiled = (0, node_path_1.join)(distDir, 'feature', 'stale.test.js');
                const runnableSource = (0, node_path_1.join)(sourceDir, 'feature', 'active.test.ts');
                const logs = [];
                await touch(runnableCompiled);
                await touch(staleCompiled);
                await touch(runnableSource);
                await (0, promises_1.utimes)(runnableSource, new Date('2024-01-01T00:00:00Z'), new Date('2024-01-01T00:00:00Z'));
                await (0, promises_1.utimes)(runnableCompiled, new Date('2024-01-02T00:00:00Z'), new Date('2024-01-02T00:00:00Z'));
                const runnableFiles = (0, suite_1.removeCompiledTestsWithoutSource)([
                    staleCompiled,
                    runnableCompiled
                ], {
                    distDir,
                    sourceDir,
                    projectDir,
                    log: (message) => logs.push(message)
                });
                strict_1.default.deepStrictEqual(runnableFiles, [runnableCompiled]);
                strict_1.default.strictEqual((0, node_fs_1.existsSync)(runnableCompiled), true);
                strict_1.default.strictEqual((0, node_fs_1.existsSync)(staleCompiled), false);
                strict_1.default.deepStrictEqual(logs, [
                    [
                        'Removed stale compiled tests without source:',
                        '- dist/feature/stale.test.js'
                    ].join('\n')
                ]);
            });
        });
        (0, node_test_1.test)('does not rewrite runnable compiled tests', async () => {
            await withTempProject(async ({ projectDir, sourceDir, distDir }) => {
                const runnableCompiled = (0, node_path_1.join)(distDir, 'feature', 'active.test.js');
                const runnableSource = (0, node_path_1.join)(sourceDir, 'feature', 'active.test.ts');
                const logs = [];
                await touch(runnableSource);
                await (0, promises_1.mkdir)((0, node_path_1.dirname)(runnableCompiled), { recursive: true });
                await (0, promises_1.writeFile)(runnableCompiled, 'compiled test');
                const runnableFiles = (0, suite_1.removeCompiledTestsWithoutSource)([runnableCompiled], {
                    distDir,
                    sourceDir,
                    projectDir,
                    log: (message) => logs.push(message)
                });
                strict_1.default.deepStrictEqual(runnableFiles, [runnableCompiled]);
                strict_1.default.strictEqual(await (0, promises_1.readFile)(runnableCompiled, 'utf8'), 'compiled test');
                strict_1.default.deepStrictEqual(logs, []);
            });
        });
        (0, node_test_1.test)('throws when compiled test is older than source test', async () => {
            await withTempProject(async ({ projectDir, sourceDir, distDir }) => {
                const staleCompiled = (0, node_path_1.join)(distDir, 'feature', 'stale-content.test.js');
                const freshSource = (0, node_path_1.join)(sourceDir, 'feature', 'stale-content.test.ts');
                await touch(staleCompiled);
                await touch(freshSource);
                await (0, promises_1.utimes)(staleCompiled, new Date('2024-01-01T00:00:00Z'), new Date('2024-01-01T00:00:00Z'));
                await (0, promises_1.utimes)(freshSource, new Date('2024-01-02T00:00:00Z'), new Date('2024-01-02T00:00:00Z'));
                strict_1.default.throws(() => (0, suite_1.removeCompiledTestsWithoutSource)([staleCompiled], {
                    distDir,
                    sourceDir,
                    projectDir
                }), {
                    message: [
                        'Compiled tests are older than source tests.',
                        '',
                        'Rebuild before npm test:',
                        '- dist/feature/stale-content.test.js (source: src/feature/stale-content.test.ts)'
                    ].join('\n')
                });
                strict_1.default.strictEqual((0, node_fs_1.existsSync)(staleCompiled), true);
            });
        });
    });
});
//# sourceMappingURL=suite.test.js.map