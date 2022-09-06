import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, map, tap} from "rxjs";
import {rxsize} from "../../../shared/utils/rxsizable.utils";
import {wrapGrid} from "animate-css-grid";
import {NotesService} from "../../../shared/services/notes.service";
import {Note} from "../../../shared/models/note.model";
import {Color, ColorBubble} from "../../../shared/models/color.model";

enum NoteCreationState {
  NONE,
  ANIMATION,
  INPUT
}

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesListComponent implements OnInit {
  public readonly noteCreationState = NoteCreationState;
  @ViewChild("grid", {static: true}) public gridRef!: ElementRef;
  @ViewChild("newNote") public newNoteRef!: ElementRef;
  @ViewChild("hero") public heroRef!: ElementRef;

  @Input()
  public set newNote(value: ColorBubble | null) {
    // animate when we change the color too
    console.log(value);
    if (value) {
      this._newNote = (value as ColorBubble).color;
      this.updateGrid();
      this.cdr.detectChanges();
      const x = this.x + 10 + Math.floor((this.width - this.grid.clientWidth) / 2);
      this._newNoteState = NoteCreationState.ANIMATION;
      this.cdr.detectChanges();

      // maybe animation here flying
      // or maybe something like jumping??
      const {left, top} = (value.event.target as HTMLElement).getBoundingClientRect();
      const {y, width, height} = this.newNoteRef.nativeElement.getBoundingClientRect();
      this.heroRef.nativeElement.animate([
        {top, left},
        // make maybe weird shape
        //{ top: (top + y) / 2, left: (left + x) / 2, width: width / 2, height: height / 2,
         // borderRadius: '5px', padding: '10px'},
        {
          top: y, left: x, width: width - 10, height: height - 10,
          borderRadius: '5px', padding: '10px',
        },
      ], {
        duration: 250,
        fill: "both",
      });
      // do we really need this?
      /*animation.finished.then((res: any) => {


        // works i guess :))
        setTimeout(() => {
          // this.notesService.upd();
          //this._newNote = null;
          //this.cdr.detectChanges();
          // think about the logic when we add it and etcetera
          console.log(res);
        }, 1000);
      });*/
    }
  }

  // refactor
  public _newNoteState = NoteCreationState.NONE;
  public _newNote: Color | null = null;

  public notes$ = this.notesService.getNotesList();
  public cols = 1; // obs$

  private readonly columnWidth = 250;
  private gridOffset = 0;
  private gridAnimation = false; // as behaviorsubject
  private grid$ = rxsize(this.ref.nativeElement).pipe(
    tap(() => {
      if (!this.gridOffset) {
        this.gridOffset = this.grid.offsetLeft;
        this.grid.style.left = `${this.gridOffset}px`;
      }
    }),
    debounceTime(250),
    filter(arr => !this.gridAnimation && !!arr?.length), // double check these things if they are really needed
    map(([rect]) => rect.contentRect.width),
    distinctUntilChanged(),
  );

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef,
              private notesService: NotesService) {
  }

  public ngOnInit(): void {
    this.updateGrid();
    const animate = wrapGrid(this.grid, {
      duration: 250,
      stagger: 5,
      onStart: () => this.gridAnimation = true,
      onEnd: () => {
        this.gridAnimation = false;
        console.log("end");
        console.log("---");
        console.log(this._newNote);
        console.log("---");
        if (this._newNote) {
          this.updateGrid();
          this._newNoteState = NoteCreationState.INPUT; // remove form here as it is not the place
          // after animation too i guess
          this.cdr.detectChanges();
        }
      },
    }).forceGridAnimation;
    this.grid$.subscribe(() => {
      console.log("grid");
      this.updateGrid();
      animate();
    });
  }

  public trackByMethod(index: number, el: Note): number {
    return el.id;
  }

  private updateGrid(): void {
    this.cols = Math.floor(this.width / this.columnWidth) || 1
    this.gridOffset = 0;
    this.cdr.detectChanges();
    this.gridRef.nativeElement.style.left = `${Math.floor((this.width - this.grid.clientWidth) / 2)}px`;
  }

  private get width() {
    return this.ref.nativeElement.clientWidth;
  }

  private get x() {
    return this.ref.nativeElement.offsetLeft;
  }

  private get grid() {
    return this.gridRef.nativeElement;
  }
}
