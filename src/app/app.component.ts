import { Component, inject, OnInit } from '@angular/core';
import { TodosComponent } from './todos/todos.component';
import { todosLoaded, TodoStore } from './todos.store';
import { MatSpinner } from '@angular/material/progress-spinner';
import { Dispatcher } from '@ngrx/signals/events';

@Component({
  selector: 'app-root',
  imports: [TodosComponent, MatSpinner],
  template: `
    <div class="app">
      @if (!store.isLoading()) {
        <app-todos />
      } @else {
        <mat-spinner />
      }
    </div>
  `,
  styles: `
    .app {
      display: flex;
      justify-content: center;
    }
  `,
})
export class AppComponent implements OnInit {
  readonly store = inject(TodoStore);
  readonly dispatcher = inject(Dispatcher);

  ngOnInit(): void {
    this.dispatcher.dispatch(todosLoaded());
  }
}
