# OpenClaw #147027: current-head native question proof

The maintained Gateway CLI and the actual ClickClack #258 candidate server completed all six native cases on OpenClaw head `9e901296221756a82a25949261c7708f91a38e72`, tree `d4584d9e8dd8d24398c449764a556147e460b746`. All users, conversations, questions, messages and credentials were freshly generated synthetic fixtures. This is local integration evidence; no production deployment or commercial action occurred.

| Case | Actual Gateway/owner result | Actual native card result |
| --- | --- | --- |
| Allowed answer | One successful original resolution; public readback and QuestionManager both answered; producer `agent.wait` returned `ok` | Answered |
| Allowed skip | One successful original cancellation; public readback and QuestionManager both cancelled; producer `agent.wait` returned `ok` | Cancelled |
| Finalization after the asking turn | Real producer `agent.wait=ok` at `1791921279003`; all held native card reads released later, at `1791921279017` | Independently read open version 1 after turn completion; answered version 2 at `1791921279127` |
| Revoke answer during awaited question read | Native `config.patch` publishes empty `allowFrom` before releasing the original pending read; public question and actual manager remain pending; zero resolution entries/effects | Reopened for an eligible responder |
| Revoke skip during awaited question read | Same native configuration/read ordering; public question and actual manager remain pending; zero cancellation entries/effects | Reopened for an eligible responder |
| Stop account during awaited question read | Actual public `channels.stop`; actual manager and independent public readback remain pending; zero resolution entries/effects | Still submitted version 2; no stopped-account finalization |

For both revocation cases, the actual account remained running with `restartPending=false` and the same non-null `lastStartAt=1791921253302`. The native registry remained generation 1. This proves a current sender-policy check in the same account lifetime. `reloadSettled=false` was recorded at observation time; the receipt does not claim every unrelated reload observer had settled. `deferredChannelReloads` was empty. Account-stop evidence separately records a real `lastStopAt=1791921306145`, after the stop request began at `1791921306122`.

## Repair exposed by the real proof

On previous head `28f913b1ba70bada6e2eebf1f35e86f01c5116be`, changing `allowFrom` requested a channel replacement. The native reload owner deferred publishing current policy while the asking turn and held read were active. The 30-second request timed out; its durable write was preserved without replay. Reload applied after releasing the read during cleanup. [Previous-head owner log](previous-head-reload-log.txt) preserves that observation.

The repair classifies only top-level and per-account ClickClack `allowFrom` edits as in-place policy changes and prepares admission from the current published configuration. It retains the running transport identity and credentials. Mixed transport changes and shared access-group changes still replace the channel. [Current-head owner log](gateway-reload-log.txt) shows actual `config.patch` writes limited to `channels.clickclack.allowFrom`.

## Proof boundary and runtime

- Gateway: the real source `runGatewayCommand`, including its managed restart/reload owner and native `runCliWithExitFinalization` lifecycle.
- Runtime: the repository-qualified Bun revision `1.4.3-canary.1+65d94e715`; executable SHA-256 `a74610af94648d54fa2312f319258a8821b509948d9dd9d6eb5f577e78a470e4`. This is explicitly Bun source-runtime evidence, not a primary Node package-build claim.
- ClickClack: real Go backend at `2eabd69dfd4b81ceef226409a3190f13782d7e49`, build metadata `vcs.modified=false`; binary SHA-256 `31aa5242df10110cecfa45a922626b2b0ed25ca0c08cf18d4144de2e43d66ed2`.
- Model: the repository's maintained local scripted Responses server. It received 11 actual model requests, and the real agent dispatched `ask_user` through `dispatch_action`. `agent.wait` used each actual ClickClack producer run ID, not a synthetic completion timer.
- Core diagnostic instrumentation, outside the plugin contract, observes the actual attached Gateway registry and delegates the original question handlers with their unchanged request options, context, client, metadata, scopes and authority. All 528 descriptor references were retained; registry metadata SHA-256 was `f5dee22aff99bfecd0ec8591d985876957d575b5b38d23e32fa563aa2e4c5ece`. No registration, re-admission or replacement question manager was used.
- During the race, the observer holds the unchanged original pending `question.get` response after recording real owner status. Resolution evidence records original handler entry, successful original response and actual owner terminal state. Zero-entry assertions are supported by positive cases reaching the same observer and independent public/manager readbacks.
- Post-turn instrumentation holds actual backend HTTP response bodies. The agent really finishes while the real stored card remains open, then the ordinary native finalizer updates that card after those reads are released.
- Gateway and backend exited normally with code 0; the local model process was joined after SIGTERM. All fixture processes were joined.

After each negative case's independent readbacks were recorded, the synthetic operator cancelled its own fixture question to close the run. Those management cancellations use a separate principal after the observed responder-effect window. The [core diagnostic entry](gateway-entry.mts) is published byte for byte, matching the executed entry hash in the frozen receipt.

[Structured receipt](receipt.json), [native transcript](transcript.txt) and [frozen fixture hashes](frozen-fixture.json) retain exact timing, real statuses and account lifetimes. Mock model/provider labels and synthetic session identifiers were removed from the public receipt. Runtime configuration, credentials, raw model requests, private endpoints and host paths are excluded.

## Focused validation and remaining decision

- [19 new policy/reload cases passed](new-policy-tests.txt) through the maintained native Bun test owner. This includes grants and revocations for default policy, inherited named-account policy and named-account overrides in groups and direct messages, plus mixed transport and shared-group reload controls.
- [61 affected existing access/inbound/mention cases passed](affected-tests.txt) using the maintained Vitest source selector with the qualified Bun engine. Existing mocks and assertions were preserved.
- [Negative control](policy-negative-control.txt): reverting only the four product-repair files caused nine real failures with the same tests: six newly granted sender cases and three in-place reload cases. Ten controls passed; source hashes were then restored.
- Focused formatting and source lint passed. [Fresh full-candidate canonical review](canonical-review.txt) completed with [scoped-clean status](canonical-review-status.json) and no P0–P2 findings. Its execution limits and point-in-time pending integration/CI note remain visible; the six-case receipt above was completed afterward.
- Previous exact-head PR CI was green on `28f913b1ba70bada6e2eebf1f35e86f01c5116be`. New-head CI was not yet collected when this proof bundle was produced; it is a separate publication check, not inferred from the prior head.
- SDK/security owner acceptance of `getQuestion`, whole-map `resolveAnswers`, and `cancelQuestion`, coordinated with the ClickClack #258 lifecycle contract, remains a maintainer decision. Native proof does not substitute for that acceptance.

Every public file is covered by [the SHA-256 manifest](sha256.json). Earlier raw receipts and unsuccessful bounded attempts were preserved privately.
