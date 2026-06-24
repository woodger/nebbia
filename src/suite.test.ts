import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';
import { describe, test } from 'node:test';
import {
  collectTestFiles,
  removeCompiledTestsWithoutSource
} from './suite';

type TempProject = {
  projectDir: string;
  sourceDir: string;
  distDir: string;
};

async function withTempProject(fn: (project: TempProject) => Promise<void>): Promise<void> {
  const projectDir = await mkdtemp(join(tmpdir(), 'suite-runner-'));
  const sourceDir = join(projectDir, 'src');
  const distDir = join(projectDir, 'dist');

  try {
    await mkdir(sourceDir, { recursive: true });
    await mkdir(distDir, { recursive: true });
    await fn({
      projectDir,
      sourceDir,
      distDir
    });
  }
  finally {
    await rm(projectDir, { recursive: true, force: true });
  }
}

async function touch(file: string): Promise<void> {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, '');
}

function projectPath(root: string, file: string): string {
  return relative(root, file).split(sep).join('/');
}

describe('suite runner helpers', () => {
  describe('collectTestFiles', () => {
    test('returns matching test files from nested directories', async () => {
      await withTempProject(async ({ distDir }) => {
        await touch(join(distDir, 'a.test.js'));
        await touch(join(distDir, 'nested', 'b.test.js'));
        await touch(join(distDir, 'nested', 'c.test.ts'));
        await touch(join(distDir, 'regular.js'));

        const files = collectTestFiles(distDir, '.test.js')
          .map((file) => projectPath(distDir, file))
          .sort();

        assert.deepStrictEqual(files, [
          'a.test.js',
          'nested/b.test.js'
        ]);
      });
    });
  });

  describe('removeCompiledTestsWithoutSource', () => {
    test('deletes stale compiled tests and keeps runnable tests', async () => {
      await withTempProject(async ({ projectDir, sourceDir, distDir }) => {
        const runnableCompiled = join(distDir, 'feature', 'active.test.js');
        const staleCompiled = join(distDir, 'feature', 'stale.test.js');
        const runnableSource = join(sourceDir, 'feature', 'active.test.ts');
        const logs: string[] = [];

        await touch(runnableCompiled);
        await touch(staleCompiled);
        await touch(runnableSource);
        await utimes(runnableSource, new Date('2024-01-01T00:00:00Z'), new Date('2024-01-01T00:00:00Z'));
        await utimes(runnableCompiled, new Date('2024-01-02T00:00:00Z'), new Date('2024-01-02T00:00:00Z'));

        const runnableFiles = removeCompiledTestsWithoutSource(
          [
            staleCompiled,
            runnableCompiled
          ],
          {
            distDir,
            sourceDir,
            projectDir,
            log: (message) => logs.push(message)
          }
        );

        assert.deepStrictEqual(runnableFiles, [runnableCompiled]);
        assert.strictEqual(existsSync(runnableCompiled), true);
        assert.strictEqual(existsSync(staleCompiled), false);
        assert.deepStrictEqual(logs, [
          [
            'Removed stale compiled tests without source:',
            '- dist/feature/stale.test.js'
          ].join('\n')
        ]);
      });
    });

    test('does not rewrite runnable compiled tests', async () => {
      await withTempProject(async ({ projectDir, sourceDir, distDir }) => {
        const runnableCompiled = join(distDir, 'feature', 'active.test.js');
        const runnableSource = join(sourceDir, 'feature', 'active.test.ts');
        const logs: string[] = [];

        await touch(runnableSource);
        await mkdir(dirname(runnableCompiled), { recursive: true });
        await writeFile(runnableCompiled, 'compiled test');

        const runnableFiles = removeCompiledTestsWithoutSource(
          [runnableCompiled],
          {
            distDir,
            sourceDir,
            projectDir,
            log: (message) => logs.push(message)
          }
        );

        assert.deepStrictEqual(runnableFiles, [runnableCompiled]);
        assert.strictEqual(await readFile(runnableCompiled, 'utf8'), 'compiled test');
        assert.deepStrictEqual(logs, []);
      });
    });

    test('throws when compiled test is older than source test', async () => {
      await withTempProject(async ({ projectDir, sourceDir, distDir }) => {
        const staleCompiled = join(distDir, 'feature', 'stale-content.test.js');
        const freshSource = join(sourceDir, 'feature', 'stale-content.test.ts');

        await touch(staleCompiled);
        await touch(freshSource);
        await utimes(staleCompiled, new Date('2024-01-01T00:00:00Z'), new Date('2024-01-01T00:00:00Z'));
        await utimes(freshSource, new Date('2024-01-02T00:00:00Z'), new Date('2024-01-02T00:00:00Z'));

        assert.throws(
          () => removeCompiledTestsWithoutSource(
            [staleCompiled],
            {
              distDir,
              sourceDir,
              projectDir
            }
          ),
          {
            message: [
              'Compiled tests are older than source tests.',
              '',
              'Rebuild before npm test:',
              '- dist/feature/stale-content.test.js (source: src/feature/stale-content.test.ts)'
            ].join('\n')
          }
        );
        assert.strictEqual(existsSync(staleCompiled), true);
      });
    });
  });
});
