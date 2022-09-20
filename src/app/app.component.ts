import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ColorBubble} from "./shared/models/color.model";
import {Store} from "@ngrx/store";
import {addNote, AppState, loadNotes, maxColsSelector, posSelector} from "./state/notes.state";
import {map} from "rxjs/operators";
import {GridService} from "./features/notes/notes-list/services/grid.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GridService],
})
export class AppComponent {
  public selectedBubble: ColorBubble | null = null;
  public from!: { x: number, y: number };
  public to!: { x: number, y: number };

  public to$ = this.store.select(posSelector).pipe(map(pos => ({x: pos + 72, y: 10})));

  constructor(private store: Store<AppState>,
              private grid: GridService) {


    // this.store.select(maxColsSelector).subscribe(val => console.log(`max cols: ${val}`));
    // this.store.select(posSelector).subscribe(val => console.log(`pos: ${val}`));

    /*setTimeout(() => {
      this.store.dispatch(addNote({color: "!!!"}));
      this.store.dispatch(addNote({color: "!!!"}));
      this.store.dispatch(addNote({color: "!!!"}));
      this.store.dispatch(addNote({color: "!!!"}));
      this.store.dispatch(addNote({color: "!!!"}));
      this.store.dispatch(addNote({color: "!!!"}));
    }, 6000);*/
    // this.store.dispatch(loadNotes({from: 0, count: 10}));


    // this.grid.
  }

  public addNote(val: ColorBubble): void {
    // change to store mechanism so we don't explicitly wait

    this.grid.appendLayout([Math.floor(Math.random() * 100 + 50), Math.floor(Math.random() * 100 + 50)])

    // this.store.dispatch(addNote({color: val.color.color}));

    const target = (val.event.target as HTMLElement).getBoundingClientRect();
    this.from = {
      x: target.left,
      y: target.top,
    }
    this.selectedBubble = val;


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
