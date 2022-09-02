import { NgModule } from '@angular/core';
import {NotesListComponent} from "./notes-list.component";
import {CommonModule} from "@angular/common";
import {NoteListItemComponent} from "./note-list-item/note-list-item.component";
import {MatCardModule} from "@angular/material/card";
import {
  NotesColumn,
  NotesContainer,
  NotesFor
} from "../../../shared/directives/notes-for.directive";

@NgModule({
  declarations: [
    NotesListComponent,
    NoteListItemComponent,
    NotesContainer,
    NotesFor,
    NotesColumn,
  ],
  imports: [
    CommonModule,
    MatCardModule,
  ],
  providers: [],
  exports: [
    NotesListComponent,
    NotesContainer,
    NotesFor,
    NotesColumn
  ]
})
export class NotesListModule { }
