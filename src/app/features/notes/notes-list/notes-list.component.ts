import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, HostBinding,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {debounceTime, delay, filter, Observable, of, Subject, take, tap} from "rxjs";
import {Note, NoteStates} from "../../../shared/models/note.model";
import {Store} from "@ngrx/store";
import {addNoteAnimation, AppState, dragStep, loadNotesAnimation, notesSelector} from "../../../state/notes.state";
import {ResizeService} from "../../../shared/services/resize.service";
import {GridService, Position} from "./services/grid.service";
import {NoteListItemComponent} from "./components/note-list-item/note-list-item.component";
import {MatDialog} from "@angular/material/dialog";
import {NoteDialogComponent} from "./components/note-dialog/note-dialog.component";
import {CdkDragMove, CdkDragStart} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResizeService],
})
export class NotesListComponent implements OnInit {
  @HostBinding('attr.data-notes-list') notesListAttr = true;
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
  public dragOptions?: {
    pos: Position,
    size: [number, number],
  };
  public dragging$ = new Subject<CdkDragMove>();
  private tempFrom?: number;
  private notesData: Note[] = [];

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef,
              private resize$: ResizeService,
              public gridService: GridService,
              private dialog: MatDialog,
              private store: Store<AppState>) {
    this.dragging$.pipe(
      debounceTime(100),
    ).subscribe(dragging => {

      const fromElem = dragging.source.element.nativeElement;
      const {width, height} = fromElem.getBoundingClientRect();
      const from = this.getIdInDataset(fromElem);
      const targetElem = dragging.event.target as HTMLElement;
      if (targetElem.dataset["outline"]) {
        return;
      } else if (targetElem.dataset["notes-list"]) {
        console.log("notes list")
        // then set to last
        return;
      }
      const target = this.getIdInDataset(targetElem.parentElement!.parentElement!);
      console.log(`temp from: ${this.tempFrom}`);
      console.log(`from: ${from}`);
      console.log(`target: ${target}`);

      this.store.dispatch(dragStep({from, target}));

      // just call the store thing sand that's it

      // this.gridService.relayout(this.notes, [from, target]);
      //this.layoutAnimation(this.notesData, [from, target]);

      //this.gridService.relayout(this.notes, [from, target]);
      //this.layoutAnimation(this.notesData, [from, target]);
      /*this.dragOptions = {
        pos: this.gridService.layout[target],
        size: [width, height],
      }
      this.cdr.markForCheck();*/
      this.tempFrom = target;
      // awesome but optimize
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

  public dragStarted(idx: number, event: CdkDragStart): void {
    const {width, height} = event.source.element.nativeElement.getBoundingClientRect();
    this.dragOptions = {
      pos: this.gridService.layout[idx],
      size: [width, height],
    }
    this.tempFrom = idx;
    this.cdr.markForCheck();
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

  public layoutAnimation(notes: Note[] = [], dragging?: [number, number]): void {
    const layout = this.gridService.layout;
    // console.log(layout);
    const len = this.notes.length;
    const loadedIdx: number[] = [];

    if (dragging) {

      if (dragging[1] > dragging[0]) {
        for (let i = 0; i < dragging[0];i++) {
          this.noteAnimation(i, layout[i], loadedIdx, notes[i]);
        }
        for (let i = dragging[0] + 1; i <= dragging[1];i++) {
          this.noteAnimation(i, layout[i - 1], loadedIdx, notes[i]);
        }
        // this.dragOptions = [layout[dragging[1]], notes[dragging[0]]];
        // console.log(this.dragOptions);
        // this.cdr.detectChanges();
        // this.noteAnimation(dragging[0], layout[dragging[0]], loadedIdx, notes[dragging[0]]);
        for (let i = dragging[1] + 1; i < len;i++) {
          this.noteAnimation(i, layout[i], loadedIdx, notes[i]);
        }
      } else if(dragging[0] > dragging[1]) {
        for (let i = 0; i < dragging[1];i++) {
          this.noteAnimation(i, layout[i], loadedIdx, notes[i]);
        }
        //dragging [0]
        for (let i = dragging[1]; i < dragging[0];i++) {
          this.noteAnimation(i, layout[i + 1], loadedIdx, notes[i]);
        }

        for (let i = dragging[0] + 1; i < len;i++) {
          this.noteAnimation(i, layout[i], loadedIdx, notes[i]);
        }

      }
    } else {
      for (let i = 0; i < len; i++) {
        this.noteAnimation(i, layout[i], loadedIdx, notes[i]);
      }
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
          this.store.dispatch(loadNotesAnimation({ids: loadedIdx}));
        }
      }
    } else if (note?.state === NoteStates.CREATING) {
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
  // delete animation too

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
        console.log(notes);
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
