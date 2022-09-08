import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ColorBubble} from "./shared/models/color.model";
import {Store} from "@ngrx/store";
import {addNote, AppState, deleteNote, loadNotes} from "./state/notes.state";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public selectedBubble: ColorBubble | null = null;
  public from!: { x: number, y: number };
  public to!: { x: number, y: number };

  constructor(private store: Store<AppState>) {
    setTimeout(() => {
      // this.store.dispatch(deleteNote({id: 3}));
      //
      this.store.dispatch(addNote({color: "!!!"}));
    }, 6000);


    this.store.dispatch(loadNotes());
  }

  public addNote(val: ColorBubble): void {
    // change to store mechanism so we don't explicitly wait
    // this.selectedBubble = val;

    this.store.dispatch(addNote({color: val.color.color}));


    /*const target = (val.event.target as HTMLElement).getBoundingClientRect();
    this.from = {
      x: target.left,
      y: target.top,
    }*/
    /*this.notes$.next([{
      id: 10, // + this.notes$.value.length,
      title: "New title",
      content: "New content",
      state: NoteStates.CREATE,
    }, ...this.notes$.value]);*/
    // this.notesService.valueLength(this.notes$.value.length); // remove when store


    /*setTimeout(() => {
      this.notes$.next([{
        id: 10,
        title: "New title",
        content: "New content",
        state: NoteStates.EDIT,
        color: val.color.color,
      }, ...this.notes$.value.slice(1)]);
    }, 3000);*/
  }
}
