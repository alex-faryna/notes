import {Component} from '@angular/core';
import {ColorBubble} from "./shared/models/color.model";
import {NotesService} from "./shared/services/notes.service";
import {BehaviorSubject, map, tap} from "rxjs";
import {Note, NoteStates} from "./shared/models/note.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public selectedBubble: ColorBubble | null = null;
  public from!: {x: number, y: number};
  public to!: {x: number, y: number};

  public notes$ = new BehaviorSubject<Note[]>([]);

  constructor(private notesService: NotesService) {
    this.notesService.getNotesList()
      .subscribe(val => this.notes$.next(val));
  }

  public addNote(val: ColorBubble): void {
    // change to store mechanism so we don't explicitly wait
    this.selectedBubble = val;

    const target = (val.event.target as HTMLElement).getBoundingClientRect();
    this.from = {
      x: target.left,
      y: target.top,
    }
    this.notes$.next([{
      id: 10,
      title: "New title",
      content: "New content",
      state: NoteStates.CREATE,
    }, ...this.notes$.value]);
    this.notesService.valueLength(this.notes$.value.length); // remove when store

    this.to = {
      x: this.notesService.gridPos(),
      y: 10,
    };

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
