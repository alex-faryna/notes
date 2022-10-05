import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {debounceTime, delay, filter, Observable, of, Subject, take, tap} from "rxjs";
import {Note, NoteStates} from "../../../shared/models/note.model";
import {Store} from "@ngrx/store";
import {addNoteAnimation, AppState, loadNotesAnimation, notesSelector} from "../../../state/notes.state";
import {ResizeService} from "../../../shared/services/resize.service";
import {GridService, Position} from "./services/grid.service";
import {NoteListItemComponent} from "./components/note-list-item/note-list-item.component";
import {MatDialog} from "@angular/material/dialog";
import {NoteDialogComponent} from "./components/note-dialog/note-dialog.component";
import {CdkDragMove} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResizeService],
})
export class NotesListComponent implements OnInit {
  @ViewChildren("note") public notes!: QueryList<NoteListItemComponent>;
  public notes$: Observable<Note[]> = of([]);

  private readonly createAnimation = [
    {
      scale: 0.01,
      opacity: 1,
    },
    {
      opacity: 1,
      scale: 1,
    }
  ];
  private readonly childCreateAnimation = [
    {
      color: "rgba(0, 0, 0, 0.0)",
    },
    {
      color: "rgba(0, 0, 0, 0.0)",
      offset: 0.85,
    },
  ];
  public dragging$ = new Subject<CdkDragMove>();
  private notesData: Note[] = [];

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef,
              private resize$: ResizeService,
              private gridService: GridService,
              private dialog: MatDialog,
              private store: Store<AppState>) {
    this.dragging$.pipe(
      debounceTime(200),
    ).subscribe(dragging => {

      const from = this.getIdInDataset(dragging.source.element.nativeElement);
      const target = this.getIdInDataset((dragging.event.target as HTMLElement).parentElement!.parentElement!);
      console.log(from);
      console.log(target);
      this.gridService.relayout(this.notes, [from, target]);
      this.layoutAnimation(this.notesData);
      // awesome but optimize
      console.log(this.gridService.layout);
      // this.layoutAnimation(notes);

      // recalculate layout with that one note overflowing
      // and trigger animations basically without that one(so it is but not forced to place in the grid)!!!
    });
  }

  public ngOnInit(): void {
    const gridSize$ = this.resize$.observe(this.ref.nativeElement);
    gridSize$.pipe(take(1))
      .subscribe(width => {
        this.gridService.gridChanged(width);
        this.initNotes();
        this.cdr.detectChanges();
      });
    gridSize$.pipe(
      debounceTime(100),
      delay(50)
    ).subscribe(width => {
      this.gridService.gridChanged(width);
      this.layoutAnimation();
    });
  }

  public dragStarted(idx: number): void {
    // this.store.dispatch(dragStarted({idx}));
  }

  public openNote(idx: number, note: Note): void {
    this.dialog.open(NoteDialogComponent, {
      width: "500px",
      panelClass: "dialog-container",
      data: {
        idx,
        note,
      },
      autoFocus: "dialog",
    });
  }

  public layoutAnimation(notes: Note[] = []): void {
    const layout = this.gridService.layout;
    const len = this.notes.length;
    const loadedIdx: number[] = [];
    for (let i = 0; i < len; i++) {
      /*const noteElem = this.notes.get(i)!.elem;
      const note = notes[i];
      if (note?.state === NoteStates.LOADING) {
        loadedIdx.push(i);
        noteElem.style.transform = this.getNotePos(layout[i]);
        noteElem.animate(this.getLoadAnimation(layout[i]), {
          duration: 250,
          delay: i * 15,
        }).onfinish = () => {
          this.noteStylesAfterAnimation(noteElem, i * 5);
          if (note?.loadingLast) {
            console.log("Loaded idx");
            console.log(loadedIdx);
            this.store.dispatch(loadNotesAnimation({ids: loadedIdx}));
          }
        }
      } else if (note?.state === NoteStates.CREATING) {
        const duration = 250;
        const delay = 200;
        noteElem.style.transform = `translate(${layout[i][0] + this.gridService.pos}px, ${layout[i][1]}px)`;
        noteElem.firstElementChild!.firstElementChild!.animate(this.childCreateAnimation, {duration: 250, delay: 200});
        noteElem.animate(this.createAnimation, {duration: 250, delay: 200}).onfinish = () => {
          this.store.dispatch(addNoteAnimation({id: i}));
          this.noteStylesAfterAnimation(noteElem);
        };
      } else if(note?.state !== NoteStates.DRAGGING) {
        // no need to animate all of them, only a portion, others go directly
        noteElem.style.transform = this.getNotePos(layout[i]);
      }*/
      this.noteAnimation(i, layout[i], loadedIdx, notes[i]);
    }
  }

  public id(index: number, el: Note): number {
    return el.id;
  }

  private noteAnimation(i: number, pos: Position, loadedIdx: number[], note?: Note): void {
    const noteElem = this.notes.get(i)!.elem;
    if (note?.state === NoteStates.LOADING) {
      loadedIdx.push(i);
      noteElem.style.transform = this.getNotePos(pos);
      noteElem.animate(this.getLoadAnimation(pos), {
        duration: 250,
        delay: i * 15,
      }).onfinish = () => {
        this.noteStylesAfterAnimation(noteElem, i * 5);
        if (note?.loadingLast) {
          console.log("Loaded idx");
          console.log(loadedIdx);
          this.store.dispatch(loadNotesAnimation({ids: loadedIdx}));
        }
      }
    } else if (note?.state === NoteStates.CREATING) {
      const duration = 250;
      const delay = 200;
      noteElem.style.transform = `translate(${pos[0] + this.gridService.pos}px, ${pos[1]}px)`;
      noteElem.firstElementChild!.firstElementChild!.animate(this.childCreateAnimation, {duration: 250, delay: 200});
      noteElem.animate(this.createAnimation, {duration: 250, delay: 200}).onfinish = () => {
        this.store.dispatch(addNoteAnimation({id: i}));
        this.noteStylesAfterAnimation(noteElem);
      };
    } else if(note?.state !== NoteStates.DRAGGING) {
      // no need to animate all of them, only a portion, others go directly
      noteElem.style.transform = this.getNotePos(pos);
    }
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

  private getNotePos(position: Position, offset = 0): string {
    return `translate(${position[0] + this.gridService.pos}px, ${position[1] + offset}px)`
  }

  private noteStylesAfterAnimation(note: HTMLElement, delay = 0): void {
    note.style.opacity = "1";
    note.style.transitionDelay = `${delay}ms`;
  }

  private initNotes(): void {
    this.notes$ = this.store.select(notesSelector).pipe(
      filter(notes => notes?.length > 0),
      tap(notes => setTimeout(() => {
        this.gridService.relayout(this.notes);
        this.layoutAnimation(notes);
        this.notesData = notes;
      })),
    );
  }

  private getIdInDataset(elem: HTMLElement): number {
    return +elem.dataset["idx"]!;
  }
}
