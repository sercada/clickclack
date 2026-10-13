# OpenClaw #147027: responder authority at the native question commit

The actual managed Gateway CLI and ClickClack candidate server passed all four commit-boundary cases on OpenClaw head `b468995c4a46354c8c48e907aa1fe78559125fd4`, tree `f544fca959fc85297ac8e63ef139c6ba23305c7d`. The same frozen observer first reproduced the reported P1 on previous head `9e901296221756a82a25949261c7708f91a38e72`. All state, users, conversations, credentials and model requests were isolated synthetic fixtures; no production or commercial action occurred.

| Case | Before repair: real Gateway/manager | Fixed: real Gateway/manager | Fixed native card |
| --- | --- | --- | --- |
| Allowed answer | Answered; one actual manager effect; producer `agent.wait=ok` | Answered; one actual manager effect; producer `agent.wait=ok` | Answered |
| Allowed skip | Cancelled; one actual manager effect; producer `agent.wait=ok` | Cancelled; one actual manager effect; producer `agent.wait=ok` | Cancelled |
| Revoke responder after admission, before answer commit | Wrongly answered; one actual manager effect | Pending; one resolution-handler entry, zero actual manager effects | Reopened |
| Revoke responder after admission, before skip commit | Wrongly cancelled; one actual manager effect | Pending; one resolution-handler entry, zero actual manager effects | Reopened |

The original resolution handler is entered in both negative cases. The fixed receipt records the carried guard and `QuestionResolutionDeniedError`; it does **not** claim zero RPC calls or zero handler entries. Independent public `question.get` and actual owner observations both confirm pending state before management cleanup. Native `config.patch`, with explicit `replacePaths`, publishes empty `allowFrom` before the held resolution is released. The real account remains running with `restartPending=false`, unchanged non-null `lastStartAt=1791927272123`, and native registry generation 1. No account replacement accounts for the denial.

After each negative window was recorded, the synthetic operator restored its own sender policy and separately cancelled its own pending question. The resulting `agent.wait=ok` belongs to that management cleanup; it is not evidence that the denied responder completed the asking turn. The two allowed controls independently prove actual producer completion without that cleanup.

## Repair and contract

The new whole-map answer and cancellation helpers require asynchronous admission preparation that returns a synchronous live `isCurrent` assertion, or `null` to deny. The host carries this assertion through its existing `sessionMutationCommitGuard` authority to the original question owner's synchronous check before `QuestionManager.resolve` or `cancel`. `resolvedBy` remains identity metadata, not permission. No manager, principal, registry, scope or dispatcher was added or replaced.

The guarded writes refuse explicit remote and standalone routing, since the assertion cannot travel over transport. They use the existing binder's accepted-write outcome semantics. Reads and the legacy single-choice operation retain their existing completion revalidation and callback/transport behavior. The proposed whole-map operations remain unshipped contracts requiring SDK/security owner acceptance.

## Instrumentation and exact identity

- Gateway entry: maintained source `runGatewayCommand`, with its actual process/reload owner and `runCliWithExitFinalization` cleanup.
- Runtime: repository-qualified Bun `1.4.3-canary.1+65d94e715`, executable SHA-256 `a74610af94648d54fa2312f319258a8821b509948d9dd9d6eb5f577e78a470e4`. This is Bun source-runtime proof; it does not claim a primary Node package build.
- ClickClack: actual Go candidate `2eabd69dfd4b81ceef226409a3190f13782d7e49`, `vcs.modified=false`, executable SHA-256 `31aa5242df10110cecfa45a922626b2b0ed25ca0c08cf18d4144de2e43d66ed2`.
- Model: repository-maintained local scripted Responses server, with eight real model requests per run. The actual agent calls `dispatch_action` with `ask_user`; completion uses the real ClickClack producer run IDs.
- This core diagnostic fixture is outside the plugin SDK contract. It preserves the **same original handler-options object and native mutation-authority WeakMap**, temporarily decorates `respond`, and restores it after calling the original handler. The controlled pause is before delegation to the real question owner; owner preparation, assertions and manager commits remain intact.
- Manager observation synchronously delegates the original `resolve`/`cancel` methods and records effective owner outcomes. It supplies no replacement records, successful responses or equivalent manager.
- All 528 descriptor references, metadata, scopes, classification and owner admission remain intact. Metadata SHA-256 is `f5dee22aff99bfecd0ec8591d985876957d575b5b38d23e32fa563aa2e4c5ece`. The fixture neither registers methods nor re-admits authority.
- Both runs use byte-identical entry `07ff2bde6213a93baacff7d833ea4062778df5d68a94e3dae37b5a4b09267701` and driver `1e0aee2b5c23751fdb73edd4544997ef78884cd53b542a5b82612229f7e898f1`. The driver's expected-outcome selector does not enter the Gateway child environment.
- Gateway and backend exit with code 0; the model is joined after SIGTERM. No owned process remains. Process identities and private configuration are excluded from public evidence.

The [before-repair receipt](before-repair-receipt.json) and [fixed receipt](fixed-receipt.json) retain exact ordering, real statuses and effective manager counts. The [before transcript](before-repair-transcript.txt), [fixed transcript](fixed-transcript.txt), and byte-identical [core diagnostic entry](gateway-entry.mts) make the contrast reviewable. Raw credentials, configuration, provider/model identities, session identifiers, requests, endpoints and host paths remain private.

## Focused proof and remaining decisions

- [14 actual-owner cases passed](actual-owner-tests.txt), using the real QuestionManager, original question handlers, native dispatcher and existing classified core test registry. They protect answer/skip admission, responder/account closure across an await, accepted outcomes after caller closure, read completion revalidation, untyped boolean-authorizer rejection, native answer validation, secret rejection, terminal records and remote/standalone refusal. No module mocks or fabricated final mutation outcomes are used.
- [Negative control](negative-control.txt): removing only the explicit `sessionMutationCommitGuard` transfer makes the two late-denial tests fail with actual answered/cancelled outcomes; the other 12 controls pass. The exact original source hash is restored, as recorded in [the receipt](owner-negative-control.json).
- [10 legacy/read cases](legacy-read-tests.txt) and [42 card/access cases](cards-access-tests.txt) pass through the maintained Vitest source selector with qualified Bun. Existing assertions remain; only the prepared-authorizer fixture shape changes. The former whole-map/cancel final-write mocks and redundant doubly mocked inbound-delivery test are removed.
- Focused source lint and formatting pass. A fresh [full-candidate canonical review](canonical-review.txt) against the verified merge base completed [scoped-clean](canonical-review-status.json), with no P0–P2 findings. Its point-in-time pending runtime/CI note is preserved; this real four-case replay finished afterward. The [independent frozen source/fixture peer](root-peer-frozen-source.json) verifies the same eight-path tree, and the [native-proof peer](root-peer-native-fixed.json) independently verifies both runs and effective outcomes.
- [Frozen source](frozen-source.json) and [clean candidate head](frozen-after-repair.json) record preparation-time identity. Runtime conclusions come from the fixed receipt, not from those earlier pending-state fields. New exact-head Node CI is a separate publication gate; previous-head checks are not attributed to this repair.
- SDK/security acceptance of the proposed operations and the companion [ClickClack #258 lifecycle](https://github.com/openclaw/clickclack/pull/258) remains a maintainer decision. Integration proof cannot grant it.

The [earlier six-case v9 artifact](https://github.com/sercada/clickclack/blob/6a9b390df3617f3b67685db2c26e5780e7b70ef2/openclaw-native-proof-20261013/questions/README.md) remains immutable historical evidence for its stated `9e` question-read/account-stop/post-turn scenarios. Its diagnostic observer cloned handler options with a spread; it must not be used to assert retention of the native per-request WeakMap. This new baseline/fixed observer retains exact options identity and proves the additional resolution-commit window. No historical receipt was rewritten or relabelled as current-head execution.

Every public file is covered by [the SHA-256 manifest](sha256.json). Earlier raw receipts and bounded unsuccessful tooling attempts are retained privately.
