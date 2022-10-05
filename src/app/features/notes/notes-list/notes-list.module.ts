import {NgModule} from '@angular/core';
import {NotesListComponent} from "./notes-list.component";
import {CommonModule} from "@angular/common";
import {NoteListItemComponent} from "./components/note-list-item/note-list-item.component";
import {MatCardModule} from "@angular/material/card";
import {NoteDialogComponent} from "./components/note-dialog/note-dialog.component";
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {DragDropModule} from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    NotesListComponent,
    NoteListItemComponent,
    NoteDialogComponent,
  ],
    imports: [
        CommonModule,
        MatCardModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        DragDropModule,
    ],
  providers: [],
  exports: [
    NotesListComponent,
  ]
})
export class NotesListModule {
}
