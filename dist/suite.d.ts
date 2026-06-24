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
export declare function collectTestFiles(dir: string, extension: TestExtension): string[];
export declare function removeCompiledTestsWithoutSource(testFiles: string[], options: CompiledTestCleanupOptions): string[];
export declare function runSuite(options?: SuiteRunnerOptions): void;
export {};
