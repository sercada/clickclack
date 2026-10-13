# Permanent channel deletion visual proof

Synthetic local ClickClack serve, captured through the repository Chromium Playwright tests on 2026-10-13. Source candidate: 0c3cadcc59745a141194815c99bf7b4f495a0111. No production deployment or customer data. T3 preview_status and preview_open explicitly returned unavailable; no browser automation host was connected, so the repository test runner supplied the actual UI proof.

The owner reviews deletion, types the exact name, and moves to general with the original notice. The already-open channel and thread embeds contain root/reply history and a composer before deletion; both become terminal Channel deleted views with no retained message rows or textarea afterward.

The source commit contains the implementation and regressions. This evidence branch contains only inspected captures.

## Files

- `channel-embed-after.png` sha256 `607f6e2c7884bb1eca380f8373040be5c45c0f04d7e6972c66d6bf847c1ba3d7`
- `channel-embed-before.png` sha256 `d14c20bd888c47121034e4e557dcaac909674437347c90f90342dd9587385f33`
- `delete-confirmation-before.png` sha256 `d3510c2814bac97ba290f8c4607e4b3bdaf78c9ca0b23d9ae59e62cc03a1d063`
- `delete-owner-after.png` sha256 `231b6e980fe859a8d079ce79abefde9c84d81c4e1ea0c0b56074b9b0477858fa`
- `thread-embed-after.png` sha256 `c0a16fb54be9863976d9aa2339790e08f3a932b03f1417f6ce653df594a97200`
- `thread-embed-before.png` sha256 `ede0bd45e108dced92d34f727c31f612d8aaa592bb25cd1ea9360a6875b731c3`

## Native stable upgrade proof

The verified official v0.7.0 release binary populated independent SQLite and PostgreSQL fixtures. The candidate reopened those same databases using the shipped serve entry point. The two attached transcripts contain the actual sanitized harness output: retained roots/threads/search/file bytes, moderator and former-owner 403 with no row/file/cleanup/event changes, then current-owner 204 with exclusive data removed and retained channel/file/search and event cursor preserved. These backend runs used the candidate's Go implementation before the final client-only echo repair; that Go implementation is unchanged in the linked source commit. No production data or runtime was used.

- [SQLite transcript](upgrade-sqlite.txt)
- [PostgreSQL transcript](upgrade-postgres.txt)
