/// <reference types="vite/client" />

declare module 'vite-plugin-eslint' {
  import { Plugin } from 'vite';
  import { ESLint } from 'eslint';

  export interface Options extends ESLint.Options {
    cache?: boolean;
    cacheLocation?: string;
    include?: string | string[];
    exclude?: string | string[];
    eslintPath?: string;
    formatter?: string | ((results: ESLint.LintResult[]) => string);
    lintOnStart?: boolean;
    emitError?: boolean;
    emitWarning?: boolean;
    failOnError?: boolean;
    failOnWarning?: boolean;
  }

  export default function eslintPlugin(options?: Options): Plugin;
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
