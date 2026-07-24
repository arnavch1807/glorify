# Chotify Contribution & Git Guidelines
**Version:** 1.0.0  
**Status:** Developer Contribution Blueprint  

---

## 1. Branch Naming Standards
We follow a structured branch naming convention to link code changes to issue trackers:

*   **Features:** `feature/<issue-id>-description-slug` (e.g. `feature/CH-104-composer-console-ui`)
*   **Bug Fixes:** `bugfix/<issue-id>-description-slug` (e.g. `bugfix/CH-88-timeline-buffer-pauses`)
*   **Hotfixes:** `hotfix/description-slug` (emergency patches to main branches)
*   **Documentation:** `docs/description-slug`

---

## 2. Commit Message Conventions
Commits must conform to the **Conventional Commits** specification:

`<type>(<scope>): <short description>`

*   **`feat`:** A new feature (e.g. `feat(studio): add remix deck style selectors`).
*   **`fix`:** A bug fix (e.g. `fix(player): resolve howler instance leak on track unload`).
*   **`docs`:** Documentation changes only (e.g. `docs(api): document rate limit headers`).
*   **`refactor`:** Code changes that neither fix a bug nor add a feature (e.g. `refactor(ui): extract card variables`).
*   **`test`:** Adding missing tests or correcting existing tests.

---

## 3. Pull Request Template Specifications
Every pull request description must cover:

```markdown
### Description
[Brief summary of what this PR accomplishes and why]

### Verification Logs
- [ ] Automated tests run locally and pass
- [ ] Visual verification checks completed (Screenshots/recordings of UI elements)

### Design & Access Audit
- [ ] Complies with the 1px grid layout system defined in docs/03
- [ ] Meets contrast ratios and focus ring settings specified in docs/09
```

---

## 4. Code Review Checklist
Reviewers must audit incoming PRs against this checklist:

*   **Standards Check:** Does the code conform to [docs/21-Coding-Standards.md](file:///c:/Users/Arnav/.antigravity-ide/projects/chotify/docs/21-Coding-Standards.md)?
*   **Verification:** Have automated test suites been run and passed?
*   **Visual Check:** Does the styling match Design Tokens and component library regulations?
*   **Accessibility:** Are touch target thresholds ($\ge$44px mobile) and ARIA attributes present?
