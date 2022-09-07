import {Component} from '@angular/core';
import {ColorBubble} from "./shared/models/color.model";
import {NotesService} from "./shared/services/notes.service";
import {BehaviorSubject} from "rxjs";
import {Note, NoteStates} from "./shared/models/note.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public selectedBubble: ColorBubble | null = null;
  public notes$ = new BehaviorSubject<Note[]>([]);

  constructor(private notesService: NotesService) {
    this.notesService.getNotesList()
      .subscribe(val => this.notes$.next(val));
  }

  public addNote(val: ColorBubble): void {
    this.selectedBubble = val;
    this.notes$.next([{
      id: 10,
      title: "New title",
      content: "New content",
      state: NoteStates.CREATE,
    }, ...this.notes$.value]);

    setTimeout(() => {
      this.notes$.next([{
        id: 10,
        title: "New title",
        content: "New content",
        state: NoteStates.EDIT,
        color: val.color.color,
      }, ...this.notes$.value.slice(1)]);
    }, 3000);
  }
}
