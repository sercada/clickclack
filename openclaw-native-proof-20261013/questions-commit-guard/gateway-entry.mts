// Source-only diagnostic core fixture, outside the plugin SDK contract.
// Observe an authenticated native config.get to obtain this real Gateway's
// request context. Decorate the attached registry's lookup only; retain every
// descriptor, scope, exposure, owner, guard and admission established by core.
// All question requests and responses delegate to their original owner handler.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

const [repo, port] = process.argv.slice(2);
const { coreGatewayHandlers } = await import(pathToFileURL(`${repo}/src/gateway/server-methods.ts`).href);
const configOriginal = coreGatewayHandlers["config.get"];
const reads = [];
const writes = [];
const registries = [];
const effects = [];
const instrumentedManagers = new WeakSet();
const instrumentedRegistries = new WeakMap();
const instrumentedContexts = new WeakSet();
let hold;
let resolveHold;
let observedContext;
function emit(value) { process.send?.(value); }
function metadata(registry) {
  return JSON.stringify(registry.descriptors().map(({ handler, ...descriptor }) => descriptor));
}
function digest(value) { return createHash("sha256").update(value).digest("hex"); }

function decorateRegistry(registry) {
  if (!registry || instrumentedRegistries.has(registry)) return registry;
  assert.equal(Object.isFrozen(registry), false, "native diagnostic registry must be mutable");
  const descriptors = registry.descriptors();
  const before = metadata(registry);
  const getHandlerOriginal = registry.getHandler;
  const generation = registries.length + 1;
  const row = { generation, observedAt: Date.now(), descriptorCount: descriptors.length, metadataSha256: digest(before), descriptorReferencesRetained: false };
  const wrappers = new Map();
  for (const method of ["question.get", "question.resolve"]) {
    const original = getHandlerOriginal.call(registry, method);
    assert.equal(typeof original, "function", `actual attached ${method} handler exists`);
    const descriptor = descriptors.find(item => item.name === method);
    assert.equal(descriptor.handler, original, "lookup must match original native descriptor");
    if (method === "question.get") {
      wrappers.set(method, async (options) => {
        observeContext(options.context);
        const thisHold = hold?.id === options.params.id && !hold.entered ? hold : undefined;
        const read = { id: options.params.id, generation, enteredAt: Date.now(), held: Boolean(thisHold) };
        reads.push(read);
        let response;
        const nativeRespond = options.respond;
        options.respond = (...args) => {
          response = args;
          read.ok = args[0];
          read.status = args[1]?.question?.status;
          read.ownerStatus = options.context.questionManager.get(options.params.id)?.status;
          read.ownerResponseAt = Date.now();
          if (!thisHold) nativeRespond(...args);
        };
        try { await original(options); } finally { options.respond = nativeRespond; }
        if (!thisHold) return;
        assert(response, "real question.get must produce its owner response");
        if (!response[0]) { options.respond(...response); return; }
        thisHold.entered = true;
        read.heldAt = Date.now();
        emit({ event: "get-held", id: options.params.id, generation, status: read.status, ownerStatus: read.ownerStatus, heldAt: read.heldAt });
        await thisHold.promise;
        read.releasedAt = Date.now();
        options.respond(...response);
      });
    } else {
      wrappers.set(method, async (options) => {
        observeContext(options.context);
        const entry = { id: options.params.id, generation, cancel: options.params.cancel === true, resolvedBy: options.params.resolvedBy, enteredAt: Date.now(), ownerBefore: options.context.questionManager.get(options.params.id)?.status };
        writes.push(entry);
        const thisHold = resolveHold?.id === options.params.id && !resolveHold.entered ? resolveHold : undefined;
        if (thisHold) {
          thisHold.entered = true;
          entry.heldAt = Date.now();
          entry.requestGuardPresent = typeof options.sessionMutationCommitGuard === "function";
          emit({ event: "resolve-held", id: entry.id, generation, ownerStatus: entry.ownerBefore, heldAt: entry.heldAt, requestGuardPresent: entry.requestGuardPresent });
          await thisHold.promise;
          entry.releasedAt = Date.now();
        }
        // Preserve the actual handler-options object and its host WeakMap
        // mutation authority. Observe only respond, and restore it after delegation.
        const nativeRespond = options.respond;
        options.respond = (...args) => {
          entry.ok = args[0];
          entry.status = args[1]?.status;
          const actual = options.context.questionManager.get(options.params.id);
          entry.ownerStatus = actual?.status;
          entry.ownerResolvedBy = actual?.resolvedBy;
          entry.completedAt = Date.now();
          nativeRespond(...args);
        };
        try { await original(options); }
        catch (error) {
          entry.errorName = error.name;
          entry.ownerStatus = options.context.questionManager.get(options.params.id)?.status;
          entry.completedAt = Date.now();
          throw error;
        } finally { options.respond = nativeRespond; }

      });
    }
  }
  // No registration, registry rebuild, authority re-admission or descriptor edit.
  // The real dispatcher still authorizes against this original registry object.
  registry.getHandler = function (name) { return wrappers.get(name) ?? getHandlerOriginal.call(this, name); };
  assert.equal(metadata(registry), before, "all native method metadata must remain unchanged");
  assert.equal(registry.descriptors(), descriptors);
  for (const descriptor of descriptors) assert.equal(registry.descriptors().find(item => item.name === descriptor.name), descriptor);
  row.descriptorReferencesRetained = true;
  registries.push(row);
  instrumentedRegistries.set(registry, row);
  emit({ event: "registry-observed", ...row });
  return registry;
}

function observeContext(context) {
  observedContext = context;
  const manager = context.questionManager;
  if (manager && !instrumentedManagers.has(manager)) {
    for (const name of ["resolve", "cancel"]) {
      const native = manager[name];
      assert.equal(typeof native, "function");
      manager[name] = function (...args) {
        const effect = { method: name, id: args[0], enteredAt: Date.now(), beforeStatus: this.get(args[0])?.status };
        effects.push(effect);
        try {
          const result = native.apply(this, args);
          effect.ok = true;
          effect.ownerStatus = this.get(args[0])?.status;
          effect.completedAt = Date.now();
          return result;
        } catch (error) { effect.ok = false; effect.errorName = error.name; throw error; }
      };
    }
    instrumentedManagers.add(manager);
  }
  if (!instrumentedContexts.has(context)) {
    const originalGetter = context.getGatewayMethodRegistry;
    assert.equal(typeof originalGetter, "function");
    context.getGatewayMethodRegistry = function () { return decorateRegistry(originalGetter.call(this)); };
    instrumentedContexts.add(context);
  }
  // Observe each new native registry after a legitimate owner reload, without
  // capturing a former generation or minting its authority anew.
  context.getGatewayMethodRegistry();
}
coreGatewayHandlers["config.get"] = async (options) => {
  observeContext(options.context);
  return await configOriginal(options);
};

process.on("message", async (message) => {
  try {
    if (message.command === "arm-resolve") {
      assert(observedContext, "actual request context must have been observed");
      let release;
      const promise = new Promise(resolve => { release = resolve; });
      resolveHold = { id: message.id, entered: false, promise, release };
      emit({ reply: message.sequence, armed: true });
    } else if (message.command === "release-resolve") {
      resolveHold?.release();
      resolveHold = undefined;
      emit({ reply: message.sequence, released: true });
    } else if (message.command === "arm-get") {
      assert(observedContext, "actual request context must have been observed");
      let release;
      const promise = new Promise(resolve => { release = resolve; });
      hold = { id: message.id, entered: false, promise, release };
      emit({ reply: message.sequence, armed: true });
    } else if (message.command === "release-get") {
      hold?.release();
      hold = undefined;
      emit({ reply: message.sequence, released: true });
    } else if (message.command === "status") {
      observedContext?.getGatewayMethodRegistry();
      const record = observedContext?.questionManager.get(message.id);
      emit({ reply: message.sequence, contextObserved: Boolean(observedContext), registries,
        question: record ? { status: record.status, resolvedBy: record.resolvedBy, answers: record.answers } : null,
        writes: writes.filter(row => row.id === message.id), effects: effects.filter(row => row.id === message.id), reads: reads.filter(row => row.id === message.id),
        currentAllowFrom: observedContext?.getRuntimeConfig().channels?.clickclack?.allowFrom,
        reloadSettled: observedContext?.isConfigReloadSettled?.(),
        deferredChannelReloads: observedContext?.getDeferredChannelReloads?.(),
        channels: observedContext?.getRuntimeSnapshot({ channelId: "clickclack", inspectAccounts: false }),
      });
    } else if (message.command === "stop-account") {
      assert(observedContext, "actual request context must have been observed");
      await observedContext.stopChannel("clickclack", "default");
      emit({ reply: message.sequence, stopped: true });
    }
  } catch (error) { emit({ reply: message.sequence, error: String(error) }); }
});
// The actual foreground CLI owner supplies process lifecycle and hot-reload
// recovery to startGatewayServer. The fixture does not fabricate that owner.
// Diagnostic signal listeners only release held reads; the native CLI closes
// the real Gateway, drains its resources and selects its exit result.
process.once("SIGINT", () => { hold?.release(); resolveHold?.release(); });
process.once("SIGTERM", () => { hold?.release(); resolveHold?.release(); });
const { runGatewayCommand } = await import(pathToFileURL(`${repo}/src/cli/gateway-cli/run.ts`).href);
const { runCliWithExitFinalization } = await import(pathToFileURL(`${repo}/src/cli/one-shot-exit.ts`).href);
await runCliWithExitFinalization({
  run: () => runGatewayCommand({ port: String(port), bind: "loopback" }, {
    onProcessResourcesSettled: outcome => emit({ event: "gateway-resources-settled", outcome }),
  }),
  onError: error => process.stderr.write(`${error.stack ?? error}\n`),
  finalize: async () => { process.disconnect?.(); },
});
