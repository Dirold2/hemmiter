# hemmiter

Небольшой типобезопасный event emitter для TypeScript с минимальными накладными расходами.

> [English](https://github.com/dirold2/hemmiter) | Русский

[![npm version](https://img.shields.io/npm/v/hemmiter)](https://www.npmjs.com/package/hemmiter)
[![npm downloads](https://img.shields.io/npm/dm/hemmiter)](https://www.npmjs.com/package/hemmiter)
[![license](https://img.shields.io/npm/l/hemmiter)](../../LICENSE)
[![typescript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)

## Установка

```bash
npm install hemmiter
```

## Использование

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

Имена событий и аргументы обработчиков выводятся и проверяются TypeScript на основе типа `Events`.

## API

- `on(event, listener)` / `addListener(event, listener)` — зарегистрировать обработчик.
- `off(event, listener)` / `removeListener(event, listener)` — удалить одну регистрацию обработчика.
- `once(event, listener)` — зарегистрировать обработчик, который сработает один раз. Его можно удалить через исходный обработчик.
- `listeners(event)` — получить snapshot зарегистрированных обработчиков события.
- `listenerCount(event)` — получить количество зарегистрированных обработчиков события.
- `removeAllListeners(event?)` — удалить обработчики одного события или всех событий.
- `emit(event, ...args)` — вызвать событие. Метод `protected`, поэтому подкласс сам контролирует отправку событий.

## Типобезопасные события

События описываются как map, где каждому имени соответствует tuple аргументов:

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

TypeScript проверяет имена событий и их аргументы:

```ts
emitter.on("data", (value) => {
  // value: Uint8Array
});

emitter.on("missing", () => {});
//                 ^ Ошибка TypeScript

emitter.emit("data", "invalid");
//                  ^ Ошибка TypeScript
```

## Дизайн

`hemmiter` намеренно остаётся небольшим и сфокусированным на эффективной отправке событий.

Библиотека предоставляет:

- строгую типизацию имён событий и их аргументов;
- `on`, `off`, `once` и соответствующие aliases;
- snapshot обработчиков во время отправки события;
- ленивое выделение внутренних структур;
- быстрый путь для событий с одним обработчиком;
- отсутствие runtime-зависимостей.

## Лицензия

MIT
