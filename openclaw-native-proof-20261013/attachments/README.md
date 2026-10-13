# OpenClaw #141457 native attachment proof

Candidate `3fd161fbc74912345a874baa7852e955a2ba3581`; production is unchanged from `68d716b92f270521bc416c0a0ac9546ae9711ebe`. Native ClickClack candidate `2eabd69dfd4b81ceef226409a3190f13782d7e49`; its Go build metadata is clean. All inputs, credentials, state, ports, and services are synthetic and local to this task.

The runtime used the repository-pinned OpenClaw Bun fork `1.4.3-canary.1+65d94e715`. The source Gateway used the production CLI `runGatewayLoop`, its real managed process/recovery owner, `startGatewayServer`, and `prepareHostConfigSnapshot`. The provider is the repository synthetic HTTP provider; HTTP and WebSocket traffic reaches actual running Gateway and native ClickClack processes.

| Contract | Observed result | Source proof |
| --- | --- | --- |
| Admitted image | Native GET 200; all 68 PNG bytes retained; one real provider `input_image`; one persisted success reply | `68d` production, identical blobs on `3fd` |
| Unadmitted human | Authoritative native message lookup; zero upload GET, new files, or provider calls | `3fd` |
| Account retirement during stream | Physical 512-byte temporary PDF observed; native `channels.stop`; zero final files, provider calls, or replies | `3fd` |
| Account retirement during awaited DM preparation | Native DM preparation 201 held; native `channels.stop`; zero final notice POST, provider calls, files, or replies | `3fd` |
| Terminal missing upload | Native filesystem-backed 404; one re-upload notice; subsequent message processed by the provider and replied to | `3fd` |
| Transient failure | One named proxy 503; native backlog retry GET 200; 68-byte image reaches provider; one durable reply; native socket reconnect observed | `3fd` |

[Runtime receipts](runtime-receipts.json), [transport audit](network-audit.json), [real provider input facts](provider-input-facts.json), [Node build/types and lint repair](quality-receipt.json), [six-brace repair diff](lint-repair.diff). The two retired synthetic inputs were deleted through the native API only after the stopped-owner assertions, with before/tombstone readbacks retained, so deliberate new-owner replay does not contaminate later phases.

The admitted-image run completed both positive checks before its subsequent config mutation fixture failed; only the completed checks are reused. Denial and retirement/retry runs completed and joined all owned services without cleanup errors.

Account retirement proves the existing abort/lifecycle contract with `allowFrom` unchanged. Saved `allowFrom` writes whose reload was deferred are not asserted as active policy revocation. The existing connector regressions separately prove caller policy revocation with the actual inbound, sender, and media owner.

The exact production-head Node build, production types, all five core test-type stripes, and extension test types passed in native fork CI. That CI found six test `curly` errors, repaired in `3fd` with focused lint, format, native hooks, peer review, and canonical P2 review. Production blobs are byte-identical. No complete-suite CI success or running Node Gateway proof is claimed. SDK owners still decide acceptance of the optional media callback before merge.
