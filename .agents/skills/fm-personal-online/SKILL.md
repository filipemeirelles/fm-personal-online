```markdown
# fm-personal-online Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `fm-personal-online` repository, a TypeScript project built with the Next.js framework. You will learn about file naming, import/export styles, commit message conventions, and how to write and organize tests. This guide also provides suggested commands for common workflows to streamline your development process.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.ts`, `dashboardPage.tsx`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```typescript
    import { getUserData } from '../utils/userHelpers';
    ```

### Export Style
- **Mixed export style** is used (both default and named exports).
  - Example (default export):
    ```typescript
    export default function HomePage() { ... }
    ```
  - Example (named export):
    ```typescript
    export const getServerSideProps = async () => { ... }
    ```

### Commit Message Convention
- Use **Conventional Commits** with the `chore` prefix.
  - Example:
    ```
    chore: update dependencies to latest versions
    ```
- Keep commit messages concise (average 67 characters).

## Workflows

_No automated workflows detected in this repository._

## Testing Patterns

- **Test Framework:** Unknown (not detected).
- **Test File Pattern:** All test files follow the pattern `*.test.*`.
  - Example: `userProfile.test.ts`, `apiHandler.test.tsx`
- Place test files alongside the modules they test or in a dedicated test directory as per the project's organization.

### Example Test File
```typescript
// userProfile.test.ts
import { render, screen } from '@testing-library/react';
import UserProfile from './userProfile';

test('renders user name', () => {
  render(<UserProfile name="Alice" />);
  expect(screen.getByText('Alice')).toBeInTheDocument();
});
```

## Commands

| Command      | Purpose                                                |
|--------------|--------------------------------------------------------|
| /test        | Run all test files matching `*.test.*`                 |
| /commit      | Create a commit message following the conventional pattern (e.g., `chore: ...`) |
| /lint        | Lint the codebase according to project standards       |
| /format      | Format files to match the project's code style         |

```