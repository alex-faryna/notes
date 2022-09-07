import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, map, Subject} from "rxjs";
import {rxsize} from "../../../shared/utils/rxsizable.utils";
import {Note, NoteStates} from "../../../shared/models/note.model";
import {GridParams, NotesService} from "../../../shared/services/notes.service";
import {wrapGrid} from "animate-css-grid";

// TODO: angular animation for ngFor elements
@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesListComponent implements OnInit, AfterViewInit {
  public readonly noteStates = NoteStates;
  @ViewChildren("grid") public gridRef!: QueryList<ElementRef>;

  @Input() set notes(value: Note[]) {
    this._notes = value;
    // this.updateGrid(); // hmm
    // maybe try to optimize stuff in that function of grid items animation
    // but still good that it's decomposed from animation now

    //BUG: if we have 3 elemets but width for 4 then it says 4 cols
    // console.log(this.cols);
    //if (value?.length) {
    //this.noteStorage.gridResized(Math.min(value.length, this.cols));
    //this.noteStorage.gridResized(this.width);
    //}
    this.noteStorage.valueLength(value?.length || 0);
  }

  public _notes: Note[] = [];

  /*@ViewChild("newNote") public newNoteRef!: ElementRef;
  //@ViewChild("hero") public heroRef!: ElementRef;
  @Input()
  public set newNote(value: ColorBubble | null) {
    // animate when we change the color too
    console.log(value);
    if (value) {
      const prevColumns = this.cols;
      // get prev columns
      // becuase animation occurs only after we add new elements or number of cols change
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
      const animation = this.heroRef.nativeElement.animate([
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
      animation.finished.then((res: any) => {

        // hack but we only need it if it is already in edit mode
        if (prevColumns === this.cols) {
          this._newNoteState = NoteCreationState.INPUT; // remove form here as it is not the place
          // after animation too i guess
          this.cdr.detectChanges();

          // feat(new note while editing this note bug)
          // actually when editing we need to cover it only if we don't have written anything there
          // if we have already type something then it must add as a new one
        }
        // works i guess :))
        //setTimeout(() => {
          // this.notesService.upd();
          //this._newNote = null;
          //this.cdr.detectChanges();
          // think about the logic when we add it and etcetera
         // console.log(res);
        //}, 1000);
      });
    }
  }*/

  // refactor
  /*public _newNoteState = NoteCreationState.NONE;
  public readonly noteCreationState = NoteCreationState;
  public _newNote: Color | null = null;*/


  // componentstore here because many thinfs here are relate just to the current component
  //think about animation when data changes i guess
  //public cols = 1; // obs$ to store
  /*private gridOffset = 0;
  private gridAnimation = false; // as behaviorsubject
  private grid$ = rxsize(this.ref.nativeElement).pipe(
    tap(val => {
      this.noteStorage.gridResized(val);
      if (!this.gridOffset) {
        console.log(val);
        this.gridOffset = this.grid.offsetLeft;
        this.grid.style.left = `${this.gridOffset}px`;
      }
    }),
    debounceTime(250),
    filter(arr => !this.gridAnimation && !!arr?.length), // double check these things if they are really needed
    map(([rect]) => rect.contentRect.width),
    distinctUntilChanged(),
  );*/

  // when we resize, notify the service that we resized with the new values
  // of this component, the grid, and their widths

  // when notes change also compute those values too

  // the number of cols provided view input
  // the let of the grid can be provided via input too (or the service)
  //
  public data$: Subject<GridParams> = new Subject<GridParams>();

  private animate?: () => void;
  /*public gridData$ = this.noteStorage.gridData$.pipe(
    tap(console.log),
    tap(() => this.cdr.detectChanges())
  );*/

  /*public cols$ = this.noteStorage.cols$.pipe(tap(() => this.cdr.detectChanges()));
  public gridPos$ = this.noteStorage.gridPos$.pipe(tap(() => this.cdr.detectChanges()));
*/

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef,
              private noteStorage: NotesService) {
  }

  // we know the width, so we can move the resize away from here maybe?
  // and calculate those vaule in the store !!x
  // the resize still here but sends value to the store which says how many columns what position etc

  // maybe just send the grid to the storage as an argument and it will eep track of it

  // ngfor animation make when adding elements (but not when creating manually)
  public ngOnInit(): void {
    // this.updateGrid(); // when data changes update
    // this thing makes smoth grid animation
    // reverse nginee  r it and look
    // it works sometimes by itself sometimes it needs to be called
    // call animate only on resize i guess
    // when adding items it does automatically or what
    /*const animate = wrapGrid(this.grid, {
      duration: 250,
      stagger: 5,
      onStart: () => this.gridAnimation = true,
      onEnd: () => {
        this.gridAnimation = false;
        / *console.log("end");
        console.log("---");
        console.log(this._newNote);
        console.log("---");
        if (this._newNote) {
          this.updateGrid();
          this._newNoteState = NoteCreationState.INPUT; // remove form here as it is not the place
          // after animation too i guess
          this.cdr.detectChanges();
        }* /
      },
    }).forceGridAnimation;
    this.grid$.subscribe(() => {
      console.log("grid size changed by resize");
      //this.updateGrid();
      //animate(); // not delete
      ///
    });*/
    rxsize(this.ref.nativeElement)
      .pipe(debounceTime(250)) //remove for some interesting real-time effects
      .subscribe(([val]) => this.noteStorage.gridResized(val.contentRect.width));

    this.noteStorage.gridData$.subscribe(val => {
      this.data$.next(val);
      this.cdr.detectChanges();
    });

    this.noteStorage.gridData$.pipe(
      filter(() => !!this.animate),
      map(({cols}) => cols),
      distinctUntilChanged()
    ).subscribe(() => this.animate!());
  }

  public ngAfterViewInit(): void {
    this.gridRef.changes.subscribe(({first}) => {
      this.animate = wrapGrid(first.nativeElement, {
        duration: 250,
        stagger: 5,


      }).forceGridAnimation;
    });
  }

  public trackByMethod(index: number, el: Note): number {
    return el.id;
  }

  /*private updateGrid(): void {
    this.cols = Math.floor(this.width / this.columnWidth) || 1
    this.gridOffset = 0;
    this.cdr.detectChanges();
    this.gridRef.nativeElement.style.left = `${Math.floor((this.width - this.grid.clientWidth) / 2)}px`;
  }*/

  private get width() {
    return this.ref.nativeElement.clientWidth;
  }

  private get x() {
    return this.ref.nativeElement.offsetLeft;
  }

  private get grid() {
    return this.gridRef; //.nativeElement;
  }
}
