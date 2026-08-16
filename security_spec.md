# Security Specification & Threat Model

## Data Invariants
1. **Public Read Access**: Any visitor can read `siteProfile`, `projects`, `projectImages`, `timeline`, and `skills` collections to view the portfolio.
2. **Strict Admin Write Access**: Only the verified administrator (`jimmybaijun@gmail.com`) can create, update, or delete profile info, projects, timeline items, and skills.
3. **Payload Boundaries**: All strings have explicit size limits (e.g. text <= 10000 chars, image strings <= 2MB).
4. **Relational Consistency**: Project images must reference a valid `projectId`.

## Dirty Dozen Payloads Handled
1. Unauthenticated write to `/siteProfile/main` -> Rejected
2. Authenticated non-admin (e.g., `attacker@example.com`) write to `/projects/p1` -> Rejected
3. Unverified email write -> Rejected
4. Oversized string payload exceeding max length -> Rejected
5. Malicious document ID containing invalid characters -> Rejected
6. Shadow fields injection -> Rejected
7. Corrupted image document missing `projectId` -> Rejected
8. Non-numeric order field in timeline item -> Rejected
9. Blanket write to unauthorized collection -> Rejected
10. Attempt to spoof admin email without verification -> Rejected
11. Attempt to delete site profile by unauthenticated user -> Rejected
12. Attempt to create project with empty title -> Rejected
