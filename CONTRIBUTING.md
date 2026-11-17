# Contributing to IVAO Belarus Frontend

Thanks for your interest in improving the IVAO Belarus website! This guide explains how to set up the project and submit changes.

## Before You Start

- This repository contains the **frontend only**. The backend API is closed-source, so you don't need access to it: the project ships with a mock mode.
- **Security issues:** please do not open a public issue. See [SECURITY.md](SECURITY.md).
- For larger changes (new pages, refactors, new dependencies), please open an issue first so we can agree on the approach before you invest time.

## Ways to Contribute

- Fix bugs and UI issues
- Improve accessibility, performance, and responsiveness
- Add or fix translations
- Improve documentation
- Review open pull requests

## Development Setup

Requirements: Node.js (LTS) and yarn.

```
git clone https://github.com/IVAOBY/frontend.git
cd frontend
yarn
yarn dev:mock
```

`dev:mock` starts the Vite dev server with MSW intercepting API requests, so everything works offline with fictional data.

Mock handlers live in `src/mocks/handlers.ts`. If you add or change a frontend feature that calls a new endpoint, add a matching handler (including error cases such as 401 and 500, and empty lists).

## Important Rules

- **Never commit secrets:** no API keys, tokens, `.env` files, or `client_secret` values.
- **Use fictional data only** in mocks, tests, and screenshots. Do not include real VIDs, names, emails, or any other member data.
- **Do not call the production API** from your local setup or tests.
- Follow [IVAO's rules](https://www.ivao.aero) and branding guidelines. Logos and brand assets are not covered by the project license (see the license section of the README).

## Workflow

1. **Fork** the repository and create a branch from `dev`:
   ```
   git checkout -b feature/short-description
   ```
2. Make your changes in small, focused commits.
3. Run the checks locally (adjust to the scripts in `package.json`):
   ```
   yarn lint && yarn build
   ```
4. Push your branch and open a **pull request** against `dev`.

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add METAR widget to airport page
fix: correct timezone in event list
docs: update contributing guide
```

## Pull Request Guidelines

- Keep PRs focused: one logical change per PR.
- Describe **what** changed and **why**. Link related issues (`Closes #123`).
- Include screenshots or a short recording for UI changes (with fictional data).
- Make sure lint, type checks, and the build pass.
- Update documentation and mock handlers if behavior changes.
- Be ready to discuss and revise: review feedback is part of the process.

## Code Style

- TypeScript with strict typing; avoid `any` where possible.
- Follow the existing project structure and naming conventions.
- Formatting and linting are enforced by the project's ESLint/Prettier config. Please don't reformat unrelated code.
- Don't add new dependencies without a good reason. Mention it in the PR if you do.

## Reporting Bugs

Open an issue with:

- what you expected and what happened instead;
- steps to reproduce;
- browser, OS, and screen size;
- screenshots or console errors, if relevant (without personal data).

## Code of Conduct

Be respectful and constructive. Harassment, discrimination, and personal attacks are not tolerated. Contributors are also expected to follow the IVAO Code of Conduct.

## License

By contributing, you agree that your contributions will be licensed under the same license as this project (see [LICENSE](LICENSE)).
