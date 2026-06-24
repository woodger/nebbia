import fs from 'node:fs';
import path from 'node:path';
import { run } from 'node:test';
import { spec } from 'node:test/reporters';

type TestExtension = '.test.js' | '.test.ts';

type CompiledTestCleanupOptions = {
  distDir: string;
  sourceDir: string;
  projectDir: string;
  log?: (message: string) => void;
};

type SuiteRunnerOptions = Partial<CompiledTestCleanupOptions> & {
  runnerFile?: string;
};

export function collectTestFiles(dir: string, extension: TestExtension): string[] {
  let files: string[] = [];

  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(
        collectTestFiles(fullPath, extension)
      );
    }
    else if (entry.endsWith(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

function toProjectPath(file: string, projectDir: string): string {
  return path
    .relative(projectDir, file)
    .split(path.sep)
    .join('/');
}

function toSourceTestPath(
  compiledFile: string,
  distDir: string,
  sourceDir: string
): string {
  const relativeCompiledPath = path.relative(distDir, compiledFile);
  const relativeSourcePath = relativeCompiledPath.replace(/\.js$/, '.ts');

  return path.join(sourceDir, relativeSourcePath);
}

export function removeCompiledTestsWithoutSource(
  testFiles: string[],
  options: CompiledTestCleanupOptions
): string[] {
  const runnableFiles: string[] = [];
  const removedFiles: string[] = [];
  const outdatedFiles: Array<{
    compiled: string;
    source: string;
  }> = [];
  const log = options.log ?? ((message: string) => console.warn(message));

  for (const file of testFiles) {
    const sourceFile = toSourceTestPath(
      file,
      options.distDir,
      options.sourceDir
    );

    if (fs.existsSync(sourceFile)) {
      runnableFiles.push(file);

      if (fs.statSync(sourceFile).mtimeMs > fs.statSync(file).mtimeMs) {
        outdatedFiles.push({
          compiled: toProjectPath(file, options.projectDir),
          source: toProjectPath(sourceFile, options.projectDir)
        });
      }
    }
    else {
      fs.unlinkSync(file);
      removedFiles.push(toProjectPath(file, options.projectDir));
    }
  }

  if (removedFiles.length) {
    log(
      [
        'Removed stale compiled tests without source:',
        ...removedFiles.sort().map((file) => `- ${file}`)
      ].join('\n')
    );
  }

  if (outdatedFiles.length) {
    throw new Error(
      [
        'Compiled tests are older than source tests.',
        '',
        'Rebuild before npm test:',
        ...outdatedFiles
          .sort((left, right) => left.compiled.localeCompare(right.compiled))
          .map(({ compiled, source }) => `- ${compiled} (source: ${source})`)
      ].join('\n')
    );
  }

  return runnableFiles;
}

export function runSuite(options: SuiteRunnerOptions = {}): void {
  const distDir = options.distDir ?? path.resolve(__dirname);
  const projectDir = options.projectDir ?? path.resolve(distDir, '..');
  const sourceDir = options.sourceDir ?? path.join(projectDir, 'src');
  const runnerFile = options.runnerFile ?? __filename;

  const testFiles = removeCompiledTestsWithoutSource(
    collectTestFiles(distDir, '.test.js')
      .filter((file) => path.resolve(file) !== path.resolve(runnerFile)),
    {
      distDir,
      sourceDir,
      projectDir,
      log: options.log
    }
  );

  if (!testFiles.length) {
    console.warn('No test files found in dist/');
    process.exit(1);
  }

  run({
    files: testFiles,
    concurrency: true,
    isolation: 'process'
  })
    .on('test:fail', () => {
      process.exitCode = 1;
    })
    .compose(spec)
    .pipe(process.stdout);
}

if (process.argv[1] !== undefined && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  runSuite();
}
