import { Component, effect, inject, OnInit, viewChild } from '@angular/core';
import {
  todoAdded,
  todoDeleted,
  todosFiltered,
  todosLoaded,
  TodoStore,
  todoUpdated,
} from '../todos.store';
import { JsonPipe, NgStyle } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dispatcher } from '@ngrx/signals/events';
import { CreateTodo, Todo } from '../todos.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-todos',
  imports: [
    NgStyle,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
  ],
  template: `
    <h1>NgRx Singal Store Todo App Example</h1>

    <mat-form-field class="todo-input">
      <mat-label>Enter a Todo and press Enter</mat-label>
      <input matInput #input (keyup.enter)="onAddTodo(input.value)" />
      <mat-icon matSuffix>edit</mat-icon>
    </mat-form-field>

    <mat-button-toggle-group #filter (change)="onFilterTodos($event)">
      <mat-button-toggle value="all">All</mat-button-toggle>
      <mat-button-toggle value="pending">Pending</mat-button-toggle>
      <mat-button-toggle value="completed">Completed</mat-button-toggle>
    </mat-button-toggle-group>

    <mat-selection-list class="todos-list">
      @for (todo of store.filteredTodos(); track todo.id; let index = $index) {
        <mat-list-option
          [selected]="todo.completed"
          (selectedChange)="onUpdateTodo(todo.id, $event)"
        >
          <div class="todo-item">
            <mat-icon
              class="delete-todo"
              (click)="onDeleteTodo(todo.id, $event)"
              >delete</mat-icon
            >
            <span
              [ngStyle]="{
                'text-decoration': todo.completed ? 'line-through' : 'none',
              }"
              >{{ todo.title }}</span
            >
          </div>
        </mat-list-option>
      }
    </mat-selection-list>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .todos-list,
    .todo-input {
      width: 100%;
    }

    .todo-item {
      display: flex;
      align-items: center;
    }

    .delete-todo {
      margin-right: 10px;
      cursor: pointer;
    }
  `,
})
export class TodosComponent {
  readonly store = inject(TodoStore);
  readonly dispatcher = inject(Dispatcher);
  readonly filter = viewChild.required(MatButtonToggleGroup);

  constructor() {
    effect(() => {
      this.filter().value = this.store.filter();
    });
  }

  onAddTodo(title: string) {
    this.dispatcher.dispatch(todoAdded({ title, completed: false }));
  }

  onDeleteTodo(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.dispatcher.dispatch(todoDeleted(id));
  }

  onUpdateTodo(id: string, completed: boolean) {
    this.dispatcher.dispatch(todoUpdated([id, completed]));
  }

  onFilterTodos(event: MatButtonToggleChange) {
    this.dispatcher.dispatch(todosFiltered(event.value));
  }
}
