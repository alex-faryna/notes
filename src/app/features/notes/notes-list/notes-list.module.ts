import { NgModule } from '@angular/core';
import {NotesListComponent} from "./notes-list.component";
import {CommonModule} from "@angular/common";
import {NoteListItemComponent} from "./note-list-item/note-list-item.component";
import {MatCardModule} from "@angular/material/card";

@NgModule({
  declarations: [
    NotesListComponent,
    NoteListItemComponent,
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
