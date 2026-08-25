# hemmiter

A small, type-safe, low-overhead event emitter for TypeScript.

> English | [Русский](https://github.com/dirold2/hemmiter/tree/main/lang/ru)

[![npm version](https://img.shields.io/npm/v/hemmiter)](https://www.npmjs.com/package/hemmiter)
[![npm downloads](https://img.shields.io/npm/dm/hemmiter)](https://www.npmjs.com/package/hemmiter)
[![license](https://img.shields.io/npm/l/hemmiter)](./LICENSE)
[![typescript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)

## Installation

```bash
npm install hemmiter
```

## Usage

```ts
import { MiniEmitter } from "hemmiter";

type Events = {
  data: [value: Uint8Array];
  close: [];
};

class StreamEvents extends MiniEmitter<Events> {
  push(value: Uint8Array): void {
    this.emit("data", value);
  }

  close(): void {
    this.emit("close");
  }
}

const events = new StreamEvents();

events.on("data", (value) => {
  console.log(value.length);
});

events.once("close", () => {
  console.log("closed");
});

events.push(new Uint8Array([1, 2, 3]));
events.close();
```

Event names and listener arguments are inferred and checked from the `Events` type.

## API

- `on(event, listener)` / `addListener(event, listener)` — register a listener.
- `off(event, listener)` / `removeListener(event, listener)` — remove one listener registration.
- `once(event, listener)` — register a listener that runs once. It can be removed using the original listener.
- `listeners(event)` — get a snapshot of the listeners registered for an event.
- `listenerCount(event)` — get the number of listeners registered for an event.
- `removeAllListeners(event?)` — remove listeners for one event or all events.
- `emit(event, ...args)` — dispatch an event. `emit` is `protected`, allowing subclasses to control event emission.

## Type-safe events

Events are defined as a map from event names to argument tuples:

```ts
type Events = {
  data: [value: Uint8Array];
  error: [error: Error];
  close: [];
};

class Example extends MiniEmitter<Events> {
  emitData(value: Uint8Array): void {
    this.emit("data", value);
  }
}
```

TypeScript validates both the event name and its arguments:

```ts
emitter.on("data", (value) => {
  // value: Uint8Array
});

emitter.on("missing", () => {});
//                 ^ TypeScript error

emitter.emit("data", "invalid");
//                  ^ TypeScript error
```

## Design

`hemmiter` is intentionally small and focused on low-overhead event dispatch.

It provides:

- strongly typed event names and arguments;
- `on`, `off`, `once`, and listener aliases;
- listener snapshots during dispatch;
- lazy internal allocation;
- a fast path for single-listener events;
- no runtime dependencies.

## License

MIT
