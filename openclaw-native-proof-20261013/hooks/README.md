# OpenClaw #124557: native causal hook evidence

Candidate: `fa1ebae0029a8770f538a19ca75a61ec29b5706c` ([commit](https://github.com/sercada/openclaw/commit/fa1ebae0029a8770f538a19ca75a61ec29b5706c)).

The real Gateway loads a synthetic channel plugin through the public registration API. Native ingress resolves the sender, native context construction admits the input, and the ordinary reply producer reaches the embedded model or CLI backend. Passive `before_agent_run` and `before_prompt_build` callbacks record the fields. They never handle or replace the turn.

The native source entry is `bun --no-install --tsconfig-override tsconfig.json scripts/dev/tui-questions-proof.ts --gateway-child <isolated-loopback-port>`. Bun is the source-owned pin `1.4.3-canary.1+65d94e715`, executable SHA256 `a74610af94648d54fa2312f319258a8821b509948d9dd9d6eb5f577e78a470e4`; the source manifest pin was verified before launch.

All 12 cases passed: owner, non-owner, unresolved sender, distinct-source batch, repeated one-source batch and internal-system input for each of embedded and CLI. Both recorded hooks preserve the inbound ID separately from `threads/<case>/reply`, preserve ownership as true/false/absent, and omit ambiguous or synthetic causality. Every case delivered `NATIVE_CAUSAL_FINAL`. The maintained loopback server counted 6 model requests; the task-owned CLI executable wrote 6 completed spawn records. The Gateway closed with exit 0; a request lacking the fixture token returned 401.

## Receipts

- [12 real Gateway cases and actual callback output](native-gateway-12-cases.json).
- [Original embedded producer failure](before-embedded-projection.json): auxiliary pre-reply metadata existed, but the real embedded attempt omitted the causal ID.
- [Subsequent CLI prompt producer failure](before-cli-prompt-context.json): embedded cases passed, the real CLI process completed, and its prompt hook still omitted both fields.
- [Source and fixture binding to the published commit](runtime-input-binding.json): all 18 production/native-entry Git blobs and all 5 native fixture SHA256 values match the passing replay. The runtime itself ran on f8 plus its recorded diff; a required context label in a unit assertion was corrected afterward. That test is not loaded by the native fixture. The changed production and native fixture bytes stayed identical, so the proof was bound to the new commit without replaying identical code solely to change HEAD.
- [Registered-plugin regression](registered-regression-3.json): 3/3 owner-state cases passed in 128.31 seconds through production projection and real callback dispatch; its committed test blob matches.
- [Canonical P2 review](canonical-p2-review.json): full candidate scoped-clean with no actionable findings. Independent owner peer review also accepted the narrow repairs.
- [Remaining CI/build/type/lint/producer and maintainer gates](remaining-checks.json).

Formatting of the five changed files and `git diff --check` passed. Earlier receipts are retained; historical f8 helper/queue checks are not relabeled as new-head checks. Whole-core typecheck, type-aware lint, build artifact and remaining producer tests are pending where bounded local checks did not complete. The PR remains draft until its remaining proof and owner gates are satisfied.

`senderIsOwner` is the host-resolved admission observation. These receipts do not grant live action or approval authority and do not constitute SDK/security maintainer acceptance. The evidence uses task-owned synthetic state and loopback fixtures; it involved no production or business writes/messages.

Only explicit, synthetic callback data and source/proof hashes are included. Raw runtime logs, state/config files, tokens, account paths and provider sessions are excluded.
