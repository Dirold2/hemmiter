/**
 * @ru Тип обработчика события с типизированными аргументами.
 * @en Event listener type with typed arguments.
 * @template Args Event argument tuple.
 */
export type EventListener<Args extends readonly unknown[]> = (...args: Args) => void;

type AnyEventListener = (...args: readonly unknown[]) => void;
const onceOriginal = Symbol("hemmiter.onceOriginal");
type OnceListener = AnyEventListener & { [onceOriginal]: AnyEventListener };

/**
 * @ru Минимальный типобезопасный emitter событий.
 * @en Minimal type-safe event emitter.
 * @template Events Event map where each value is an argument tuple.
 */
export class MiniEmitter<Events extends { [K in keyof Events]: readonly unknown[] }> {
  private listenerMap?: Map<keyof Events, AnyEventListener[]>;

  /**
   * @ru Зарегистрировать обработчик события.
   * @en Register an event listener.
   * @param event Event name.
   * @param listener Event listener.
   * @returns This emitter instance.
   */
  on<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): this {
    const target = listener as AnyEventListener;
    const listeners = (this.listenerMap ??= new Map());
    const list = listeners.get(event);
    if (list) list.push(target);
    else listeners.set(event, [target]);
    return this;
  }

  /**
   * @ru Зарегистрировать обработчик события.
   * @en Register an event listener.
   * @param event Event name.
   * @param listener Event listener.
   * @returns This emitter instance.
   */
  addListener<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): this {
    return this.on(event, listener);
  }

  /**
   * @ru Снять одну регистрацию обработчика события.
   * @en Remove one registration of an event listener.
   * @param event Event name.
   * @param listener Event listener to remove.
   * @returns This emitter instance.
   */
  off<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): this {
    const list = this.listenerMap?.get(event);
    if (!list) return this;

    const target = listener as AnyEventListener;
    let index = -1;
    for (let i = 0; i < list.length; i++) {
      const registered = list[i];
      if (
        registered &&
        (registered === target || (registered as OnceListener)[onceOriginal] === target)
      ) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      list.splice(index, 1);
      if (list.length === 0) this.listenerMap?.delete(event);
    }

    return this;
  }

  /**
   * @ru Снять одну регистрацию обработчика события.
   * @en Remove one registration of an event listener.
   * @param event Event name.
   * @param listener Event listener to remove.
   * @returns This emitter instance.
   */
  removeListener<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): this {
    return this.off(event, listener);
  }

  /**
   * @ru Зарегистрировать обработчик, который сработает один раз.
   * @en Register a listener that runs once.
   * @param event Event name.
   * @param listener Event listener.
   * @returns This emitter instance.
   */
  once<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): this {
    const target = listener as AnyEventListener;
    const wrapper = ((...args: Events[K]) => {
      this.off(event, wrapper);
      listener(...args);
    }) as OnceListener;
    wrapper[onceOriginal] = target;
    return this.on(event, wrapper);
  }

  /**
   * @ru Удалить обработчики одного события или всех событий.
   * @en Remove listeners for one event or for all events.
   * @param event Optional event name.
   * @returns This emitter instance.
   */
  removeAllListeners<K extends keyof Events>(event?: K): this {
    if (event === undefined) {
      this.listenerMap?.clear();
    } else {
      this.listenerMap?.delete(event);
    }

    return this;
  }

  /**
   * @ru Получить копию обработчиков события.
   * @en Get a snapshot of the listeners for an event.
   * @param event Event name.
   * @returns A new array containing the registered listeners.
   */
  listeners<K extends keyof Events>(event: K): EventListener<Events[K]>[] {
    const list = this.listenerMap?.get(event);
    if (!list) return [];

    const result = list.slice();
    for (let i = 0; i < list.length; i++) {
      const listener = list[i];
      result[i] = (listener as OnceListener)[onceOriginal] ?? listener;
    }
    return result as EventListener<Events[K]>[];
  }

  listenerCount<K extends keyof Events>(event: K): number {
    return this.listenerMap?.get(event)?.length ?? 0;
  }

  /**
   * @ru Вызвать обработчики события.
   * @en Dispatch an event to its listeners.
   * @param event Event name.
   * @param args Event arguments.
   */
  protected emit<K extends keyof Events>(event: K, ...args: Events[K]): void {
    const listeners = this.listenerMap;
    if (!listeners) return;

    const list = listeners.get(event);
    if (!list) return;

    if (list.length === 1) {
      list[0]!(...args);
      return;
    }

    const targets = list.slice();
    for (const listener of targets) {
      listener(...args);
    }
  }
}
