# Changelog

## [0.1.1]

### Fixed

- Corrected the CommonJS entry point in `package.json`: `dist/index.cjs` now uses the Latin letter `c` in its extension.

### Added

- Regression tests for recursive dispatch and listener exceptions, and compile-time event type checks.
- Documentation of synchronous listener exception handling.

## [0.1.0]

### Added

- Initial release of the type-safe TypeScript event emitter, with ESM and CommonJS builds.
