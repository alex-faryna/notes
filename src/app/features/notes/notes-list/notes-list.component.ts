import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {debounceTime, delay, filter, take, tap} from "rxjs";
import {Note, NoteStates} from "../../../shared/models/note.model";
import {Store} from "@ngrx/store";
import {addNoteAnimation, AppState, loadNotesAnimation, notesSelector} from "../../../state/notes.state";
import {ResizeService} from "../../../shared/services/resize.service";
import {GridService, Position} from "./services/grid.service";
import {NoteListItemComponent} from "./components/note-list-item/note-list-item.component";

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResizeService],
})
export class NotesListComponent implements OnInit {
  public readonly noteStates = NoteStates;

  @ViewChildren("note") public notes!: QueryList<NoteListItemComponent>;

  public notes$ = this.store.select(notesSelector).pipe(
    filter(notes => notes?.length > 0),
    tap(notes => setTimeout(() => {
      console.log("notes change");
      this.gridService.relayout(this.notes);
      this.layoutAnimation(notes);
    })),
  );

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef,
              private resize$: ResizeService,
              private gridService: GridService,
              private store: Store<AppState>) {
  }

  public ngOnInit(): void {
    const gridSize$ = this.resize$.observe(this.ref.nativeElement);
    gridSize$.pipe(take(1))
      .subscribe(width => this.gridService.gridChanged(width));
    gridSize$.pipe(
      debounceTime(100),
      delay(50)
    ).subscribe(width => {
      this.gridService.gridChanged(width)
      this.layoutAnimation();
    });
  }

  public layoutAnimation(notes: Note[] = []): void {
    const layout = this.gridService.layout;
    console.log(layout);
    const len = this.notes.length;
    const loadedIdx: number[] = [];
    for (let i = 0; i < len; i++) {
      const noteElem = this.notes.get(i)!.elem;
      const note = notes[i];
      if (note?.state === NoteStates.LOADING) {
        loadedIdx.push(i);
        const anim = noteElem.animate(this.getLoadAnimation(layout[i]), {
          duration: 250,
          delay: i * 15,
        });
        anim.onfinish = () => {
          this.noteStylesAfterAnimation(noteElem, i * 5);
          if (note?.loadingLast) {
            this.store.dispatch(loadNotesAnimation({ids: loadedIdx}));
          }
        }
      } else if (note?.state === NoteStates.CREATING) {
        const duration = 250 * 10;
        console.log(`${layout[i][0]}px ${layout[i][1]}px`);
        noteElem.style.transformOrigin = `${100}% ${100}%`;


        // set background
        // noteElem.style.color = 'red';
        // what if you make the bubble here????saves a lot actually
        noteElem.style.transformOrigin = `${layout[i][0] + this.gridService.pos}px ${layout[i][1]}px`;
        //noteElem.style.transformOrigin = `${layout[i][0] + this.gridService.pos + 20}px ${layout[i][1] + 20}px`;
        // noteElem.style.transformOrigin = `350px 180px`;
        noteElem.style.transform = `translate(${layout[i][0] + this.gridService.pos}px, ${layout[i][1]}px)`;
        const anim = noteElem.animate(this.getCreateAnimation(layout[i]), {duration});
        anim.onfinish = () => {
          this.store.dispatch(addNoteAnimation({id: i}));
          this.noteStylesAfterAnimation(noteElem);
        };
        noteElem.firstElementChild!.firstElementChild!.animate([
          {
            color: "rgba(0, 0, 0, 0.0)",
          },
          {
            color: "rgba(0, 0, 0, 0.0)",
            offset: 0.85,
          },
        ], {duration});
      } else {
        // no need to animate all of them, only a portion, others go directly
        noteElem.style.transform = this.getNotePos(layout[i]);
      }
    }
  }

  public id(index: number, el: Note): number {
    return el.id;
  }

  // need add item aniamtion too
  // delete maybe too

  private getLoadAnimation(position: Position): Keyframe[] {
    return [
      {
        opacity: 0,
        transform: this.getNotePos(position, 25),
      },
      {
        opacity: 1,
        transform: this.getNotePos(position),
      }
    ];
  }

  private getCreateAnimation(position: Position): Keyframe[] {
    return [
      {
        opacity: 1,
        scale: 0.1,
      },
      {
        opacity: 1,
        scale: 1,
      }
    ];
  }

  private getNotePos(position: Position, offset = 0): string {
    return `translate(${position[0] + this.gridService.pos}px, ${position[1] + offset}px)`
  }

  // run this after creating manually a note too
  private noteStylesAfterAnimation(note: HTMLElement, delay = 0): void {
    note.style.opacity = "1";
    note.style.transitionDelay = `${delay}ms`;
  }
}

/*const duration = 250 * 10;
        console.log(`${layout[i][0]}px ${layout[i][1]}px`);
        noteElem.style.transformOrigin = `${100}% ${100}%`;


        // set background
        // noteElem.style.color = 'red';
        // what if you make the bubble here????saves a lot actually
        //noteElem.style.transformOrigin = `${layout[i][0] + this.gridService.pos}px ${layout[i][1]}px`;
        //noteElem.style.transformOrigin = `${layout[i][0] + this.gridService.pos + 20}px ${layout[i][1] + 20}px`;
        // noteElem.style.transformOrigin = `350px 180px`;
        noteElem.style.transform = `translate(${layout[i][0] + this.gridService.pos}px, ${layout[i][1]}px)`;
        const anim = noteElem.animate(this.getCreateAnimation(layout[i]), {duration});
        anim.onfinish = () => {
          this.store.dispatch(addNoteAnimation({id: i}));
          this.noteStylesAfterAnimation(noteElem);
        };*/

// animate child (make it opacity etc) after 80% of animation is done
/*noteElem.firstElementChild!.animate([
          {
            opacity: 0.01,
          },
          {
            opacity: 1,
          }
        ], {duration: duration / 4, delay: duration / 4 * 3, fill: "both"});*/
