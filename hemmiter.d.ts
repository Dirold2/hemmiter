/**
 * @ru Тип обработчика события с типизированными аргументами.
 * @en Event listener type with typed arguments.
 * @template Args Event argument tuple.
 */
export type EventListener<Args extends readonly unknown[]> = (...args: Args) => void;
/**
 * @ru Минимальный типобезопасный emitter событий.
 * @en Minimal type-safe event emitter.
 * @template Events Event map where each value is an argument tuple.
 */
export declare class MiniEmitter<Events extends {
    [K in keyof Events]: readonly unknown[];
}> {
    private listenerMap?;
    /**
     * @ru Зарегистрировать обработчик события.
     * @en Register an event listener.
     * @param event Event name.
     * @param listener Event listener.
     * @returns This emitter instance.
     */
    on<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): this;
    /**
     * @ru Зарегистрировать обработчик события.
     * @en Register an event listener.
     * @param event Event name.
     * @param listener Event listener.
     * @returns This emitter instance.
     */
    addListener<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): this;
    /**
     * @ru Снять одну регистрацию обработчика события.
     * @en Remove one registration of an event listener.
     * @param event Event name.
     * @param listener Event listener to remove.
     * @returns This emitter instance.
     */
    off<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): this;
    /**
     * @ru Снять одну регистрацию обработчика события.
     * @en Remove one registration of an event listener.
     * @param event Event name.
     * @param listener Event listener to remove.
     * @returns This emitter instance.
     */
    removeListener<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): this;
    /**
     * @ru Зарегистрировать обработчик, который сработает один раз.
     * @en Register a listener that runs once.
     * @param event Event name.
     * @param listener Event listener.
     * @returns This emitter instance.
     */
    once<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): this;
    /**
     * @ru Удалить обработчики одного события или всех событий.
     * @en Remove listeners for one event or for all events.
     * @param event Optional event name.
     * @returns This emitter instance.
     */
    removeAllListeners<K extends keyof Events>(event?: K): this;
    /**
     * @ru Получить копию обработчиков события.
     * @en Get a snapshot of the listeners for an event.
     * @param event Event name.
     * @returns A new array containing the registered listeners.
     */
    listeners<K extends keyof Events>(event: K): EventListener<Events[K]>[];
    listenerCount<K extends keyof Events>(event: K): number;
    /**
     * @ru Вызвать обработчики события.
     * @en Dispatch an event to its listeners.
     * @param event Event name.
     * @param args Event arguments.
     */
    protected emit<K extends keyof Events>(event: K, ...args: Events[K]): void;
}
//# sourceMappingURL=hemmiter.d.ts.map