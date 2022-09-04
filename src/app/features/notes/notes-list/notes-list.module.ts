import { NgModule } from '@angular/core';
import {NotesListComponent} from "./notes-list.component";
import {CommonModule} from "@angular/common";
import {NoteListItemComponent} from "./components/note-list-item/note-list-item.component";
import {MatCardModule} from "@angular/material/card";
import {NoteDirective} from "./directives/note.directive";

@NgModule({
  declarations: [
    NotesListComponent,
    NoteListItemComponent,
    NoteDirective,
  ],
  imports: [
    CommonModule,
    MatCardModule,
  ],
  providers: [],
  exports: [
    NotesListComponent
  ]
})
export class NotesListModule { }
