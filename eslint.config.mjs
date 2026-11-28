import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

/*
  ESLint flat config.

  The repo had a `lint` script and no config behind it, so `npm run lint` had
  never actually checked anything. `eslint-config-next` was already a
  devDependency; this is what makes it apply.

  It ships eslintrc-style, so FlatCompat bridges it into ESLint 9's flat
  format — the same shape `create-next-app` generates. `next lint` is
  deprecated in Next 15 and gone in 16, so the script calls `eslint` directly.
*/
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      // Playwright's own output, written on every run.
      "playwright-report/**",
      "test-results/**",
      /*
        Scratch worktrees the Agent tool creates for parallel work. Each
        is a full checkout of this repo, so without this `eslint .` lints
        the project N+1 times over, and worse: those checkouts are built
        while the lint runs, so it crawls a `.next` whose files appear
        and vanish underneath it and dies with ENOENT on a build
        manifest. Not a lint failure, a crash, exit code 2, no rule
        named. Measured once at 1,404 errors that were all other
        branches' code.
      */
      ".claude/worktrees/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;
