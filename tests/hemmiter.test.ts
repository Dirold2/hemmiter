import { describe, expect, it } from "vitest";
import { MiniEmitter } from "../src/index.js";

type Events = {
  value: [value: number];
  done: [];
};

class TestEmitter extends MiniEmitter<Events> {
  publishValue(value: number): this {
    this.emit("value", value);
    return this;
  }

  publishDone(): this {
    this.emit("done");
    return this;
  }
}

describe("MiniEmitter", () => {
  it("dispatches typed events and supports aliases", () => {
    const emitter = new TestEmitter();
    const values: number[] = [];
    const listener = (value: number) => values.push(value);

    emitter.addListener("value", listener).publishValue(1);
    emitter.removeListener("value", listener).publishValue(2);

    expect(values).toEqual([1]);
  });

  it("removes one registration with off", () => {
    const emitter = new TestEmitter();
    let calls = 0;
    const listener = () => calls++;

    emitter.on("done", listener).on("done", listener);
    emitter.off("done", listener).publishDone();

    expect(calls).toBe(1);
    expect(emitter.listenerCount("done")).toBe(1);
  });

  it("supports once and removes it through the original listener", () => {
    const emitter = new TestEmitter();
    let calls = 0;
    const listener = () => calls++;

    emitter.once("done", listener).publishDone().publishDone();
    expect(calls).toBe(1);

    emitter.once("done", listener).off("done", listener).publishDone();
    expect(calls).toBe(1);
  });

  it("snapshots listeners before dispatch", () => {
    const emitter = new TestEmitter();
    const calls: string[] = [];
    const second = () => calls.push("second");

    emitter.on("done", () => {
      calls.push("first");
      emitter.off("done", second);
    });
    emitter.on("done", second);
    emitter.publishDone();

    expect(calls).toEqual(["first", "second"]);
  });

  it("removes listeners by event or entirely", () => {
    const emitter = new TestEmitter();
    const listener = () => {};

    emitter.on("value", listener).on("done", listener);
    emitter.removeAllListeners("value");
    expect(emitter.listenerCount("value")).toBe(0);
    expect(emitter.listenerCount("done")).toBe(1);

    emitter.removeAllListeners();
    expect(emitter.listenerCount("done")).toBe(0);
  });

  it("handles missing listeners and empty events", () => {
    const emitter = new TestEmitter();
    const listener = () => {};

    expect(emitter.listeners("done")).toEqual([]);
    expect(emitter.listenerCount("done")).toBe(0);
    expect(emitter.off("done", listener)).toBe(emitter);
    expect(emitter.removeAllListeners("done")).toBe(emitter);
    expect(emitter.publishDone()).toBe(emitter);
  });

  it("returns a listener snapshot and original once listeners", () => {
    const emitter = new TestEmitter();
    const regular = () => {};
    const oneTime = () => {};

    emitter.on("done", regular).once("done", oneTime);
    const snapshot = emitter.listeners("done");

    expect(snapshot).toEqual([regular, oneTime]);
    expect(snapshot).not.toBe(emitter.listeners("done"));
    snapshot.pop();
    expect(emitter.listenerCount("done")).toBe(2);
  });

  it("does not remove an unregistered listener", () => {
    const emitter = new TestEmitter();
    const registered = () => {};
    const missing = () => {};

    emitter.on("done", registered).off("done", missing);
    expect(emitter.listenerCount("done")).toBe(1);
  });
});
