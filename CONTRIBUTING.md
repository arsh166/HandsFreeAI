# Contributing to HandsFreeAI

## Commit message format
```
type(scope): short description

Examples:
feat(voice): add multi-language support
fix(email): correct schedule parsing for Monday
docs(ui): update electron setup instructions
test(voice): add silence detector unit tests
```

Types: `feat` `fix` `docs` `test` `refactor` `chore`
Scopes: `voice` `email` `ui`

## Branch naming
```
voice/feature-name
email/feature-name
ui/feature-name
```

## Pull request checklist
- [ ] Tests pass (`npm test`)
- [ ] No lint errors (`npm run lint`)
- [ ] PR targets `dev` branch (never `main` directly)
- [ ] At least 1 team member reviewed

## Code style
- Use ES modules (`import/export`)
- JSDoc comments on all exported functions
- No `console.log` left in production code — use the action log system
