# Question lifecycle native proof

Source candidate: 2eabd69dfd4b81ceef226409a3190f13782d7e49. The last change is only the friendly SDK input: allow_skip is optional on QuestionSpec while MessageQuestion and generated response schemas remain required. SDK build/typecheck pass; restoring the original alias fails the two public omission assertions. Independent manual and canonical commit reviews of that delta found no actionable P0-P2 issue. Earlier full-feature helper runs failed before a complete verdict; this does not assert a complete-feature clean review or maintainer acceptance.

Official latest stable release v0.7.1 was published 2026-10-11T23:48:33Z. The downloaded clickclack_0.7.1_linux_amd64.tar.gz was checked against the release sha256sums.txt: 6ecc69824770d6b1527d3674ffb64aea9a6422faa433100eea0fa5a223bfd713. The new Go server was built from the candidate; no server code changed in the SDK correction.

Both transcripts are actual harness output from populated v0.7.1 databases reopened through the candidate serve entry point. They check row counts; exact profile/appearance settings and workspace metadata; stable credential fields and authentication with the original token; nonce replay to the same pre-upgrade message; pre-existing authors/bodies/thread/search and exact file bytes. They then create questions with allow_skip omitted and false, verify the persisted boolean, accepted or forbidden human skip, unchanged entire question/events after forbidden skip, and the original bot's final outcome.

- [SQLite upgrade and input defaults](upgrade-v071-sqlite.txt)
- [PostgreSQL upgrade and input defaults](upgrade-v071-postgres.txt)
- [Earlier real serve moderation final effects](moderation-serve.txt)

The fixture uses only synthetic identities and local task databases. Public output contains no token values, credential hashes, cookies, Authorization headers, private endpoints, or database contents. Private server/PostgreSQL processes were stopped after the runs; synthetic data remains local. No production deployment occurred.
