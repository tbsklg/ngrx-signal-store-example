import { Injectable, signal } from '@angular/core';
import { delay, EMPTY, Observable, of } from 'rxjs';

export type CreateTodo = {
  title: string;
  completed: boolean;
};

export type Todo = CreateTodo & {
  id: string;
};

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  readonly remoteStore = signal<Todo[]>([
    { id: this.generateId(), title: 'abc', completed: false },
  ]);

  getTodos(): Observable<Todo[]> {
    return of(this.remoteStore()).pipe(delay(500));
  }

  addTodo(todo: CreateTodo): Observable<Todo> {
    const newTodo: Todo = {
      id: this.generateId(),
      ...todo,
    };
    this.remoteStore.update((store) => [...store, newTodo]);
    return of(newTodo);
  }

  removeTodo(todoId: string): Observable<string> {
    this.remoteStore.update((store) =>
      store.filter((todo) => todo.id !== todoId),
    );
    return of(todoId);
  }

  updateTodo([id, completed]: [string, boolean]): Observable<[string, boolean]> {
    this.remoteStore.update((store) =>
      store.map(todo => todo.id === id ? { ... todo, completed } : todo)
    )

    return of([id, completed]);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
