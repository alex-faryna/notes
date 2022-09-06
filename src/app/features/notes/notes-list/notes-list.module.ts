import { NgModule } from '@angular/core';
import {NotesListComponent} from "./notes-list.component";
import {CommonModule} from "@angular/common";
import {NoteListItemComponent} from "./components/note-list-item/note-list-item.component";
import {MatCardModule} from "@angular/material/card";
import {NoteDirective} from "./directives/note.directive";
import {HeroBubbleComponent} from "./components/hero-bubble/hero-bubble.component";

@NgModule({
  declarations: [
    NotesListComponent,
    NoteListItemComponent,
    NoteDirective,
    HeroBubbleComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
  ],
  providers: [],
  exports: [
    NotesListComponent,
    HeroBubbleComponent,
  ]
})
export class NotesListModule { }
