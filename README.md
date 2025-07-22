# NgRx Signal Store Example

This repository is an example Angular application demonstrating the use of [NgRx Signal Store](https://ngrx.io/guide/signal-store) to manage state reactively in Angular.

## Features
- **Reactive State Management:** Uses NgRx Signal Store for local state with computed properties, reducers, and effects.
- **Todo CRUD:** Add, update, and delete todos.
- **Filtering:** View all, pending, or completed todos.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Angular CLI](https://angular.io/cli)

### Running the App
```bash
ng serve
```

## Nix Flakes Support

### Quick Start

```bash
# Serve the app (installs dependencies and starts dev server)
nix run

# Enter development environment
nix develop

# Inside the dev shell, use normal Angular commands
ng serve
ng build
ng test
```

### Requirements

- Nix with flakes enabled
- Add to your `~/.config/nix/nix.conf`:
  ```
  experimental-features = nix-command flakes
  ```

### How it works

The `flake.nix` provides:
- **Development shell**: Node.js 20 + Angular CLI
- **Default app**: Runs `npm install && ng serve` automatically

No need to install Node.js or Angular CLI globally - everything is isolated and reproducible.
