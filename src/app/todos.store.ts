import {
  signalStore,
  withComputed,
  withMethods,
  withState,
  patchState,
  type,
} from '@ngrx/signals';
import { CreateTodo, Todo, TodosService } from './todos.service';
import { computed, effect, inject } from '@angular/core';
import {
  eventGroup,
  Events,
  on,
  withEffects,
  withReducer,
} from '@ngrx/signals/events';
import { event } from '@ngrx/signals/events';
import { filter, switchMap, tap } from 'rxjs';
import { mapResponse, tapResponse } from '@ngrx/operators';

export type TodosFilter = 'all' | 'pending' | 'completed';

interface TodoState {
  todos: Todo[];
  filter: TodosFilter;
  isLoading: boolean;
}

const initialState: TodoState = {
  todos: [],
  filter: 'all',
  isLoading: false,
};

export const todosLoaded = event('[Todos API] Todos loaded', type<void>());
export const todoAdded = event('[Todos API] Todo added', type<CreateTodo>());
export const todoDeleted = event('[Todos API] Todo removed', type<string>());
export const todoUpdated = event(
  '[Todos API] Todo removed',
  type<[string, boolean]>(),
);
export const todosFiltered = event(
  '[Todos API] Todos filtered',
  type<TodosFilter>(),
);

export const todosLoadedSuccess = event(
  '[Todos API] Todos loaded success',
  type<Todo[]>(),
);
export const todoAddedSuccess = event(
  '[Todos API] Todo added success',
  type<Todo>(),
);
export const todoDeletedSuccess = event(
  '[Todos API] Todo removed success',
  type<string>(),
);
export const todoUpdatedSuccess = event(
  '[Todos API] Todo updated success',
  type<[string, boolean]>(),
);

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ todos }) => ({
    todosCount: computed(() => todos().length),
  })),
  withReducer(
    on(todosLoaded, () => ({
      isLoading: true,
    })),
    on(todosLoadedSuccess, ({ payload: todos }) => ({
      todos,
      isLoading: false,
    })),
    on(todoAdded, () => ({
      isLoading: true,
    })),
    on(todoAddedSuccess, (event, state) => ({
      todos: [...state.todos, event.payload],
      isLoading: false,
    })),
    on(todoDeleted, () => ({
      isLoading: true,
    })),
    on(todoDeletedSuccess, (event, state) => ({
      todos: state.todos.filter((todo) => todo.id !== event.payload),
      isLoading: false,
    })),
    on(todoUpdated, () => ({
      isLoading: true,
    })),
    on(todoUpdatedSuccess, ({ payload: [id, completed] }, state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo,
      ),
      isLoading: false,
    })),
    on(todosFiltered, ({ payload: filter }) => ({
      filter,
    })),
  ),
  withComputed((state) => ({
    filteredTodos: computed(() => {
      switch (state.filter()) {
        case 'all':
          return state.todos();
        case 'pending':
          return state.todos().filter((todo) => !todo.completed);
        case 'completed':
          return state.todos().filter((todo) => todo.completed);
      }
    }),
  })),
  withEffects(
    (store, events = inject(Events), todosService = inject(TodosService)) => ({
      loadTodos$: events.on(todosLoaded).pipe(
        switchMap(() =>
          todosService.getTodos().pipe(
            mapResponse({
              next: todosLoadedSuccess,
              error: (error: any) => {
                throw Error(error);
              },
            }),
          ),
        ),
      ),
      addTodo$: events.on(todoAdded).pipe(
        switchMap((event) =>
          todosService.addTodo(event.payload).pipe(
            mapResponse({
              next: todoAddedSuccess,
              error: (error: any) => {
                throw Error(error);
              },
            }),
          ),
        ),
      ),
      removeTodo$: events.on(todoDeleted).pipe(
        switchMap((event) =>
          todosService.removeTodo(event.payload).pipe(
            mapResponse({
              next: todoDeletedSuccess,
              error: (error: any) => {
                throw Error(error);
              },
            }),
          ),
        ),
      ),

      updateTodo$: events.on(todoUpdated).pipe(
        switchMap((event) =>
          todosService.updateTodo(event.payload).pipe(
            mapResponse({
              next: todoUpdatedSuccess,
              error: (error: any) => {
                throw Error(error);
              },
            }),
          ),
        ),
      ),
    }),
  ),
);
