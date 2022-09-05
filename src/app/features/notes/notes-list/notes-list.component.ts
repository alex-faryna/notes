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

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesListComponent implements OnInit {
  @ViewChild("grid", {static: true}) public gridRef!: ElementRef;
  @ViewChild("newNote") public newNoteRef!: ElementRef;
  @ViewChild("hero") public heroRef!: ElementRef;

  @Input()
  public set newNote(value: ColorBubble | null) {
    // animate when we change the color too
    if (value) {
      this._newNote = (value as ColorBubble).color;
      this.cdr.detectChanges();
      // maybe animation here flying
      // or maybe something like jumping??
      const {left, top} = (value.event.target as HTMLElement).getBoundingClientRect();
      const {x, y, width, height} = this.newNoteRef.nativeElement.getBoundingClientRect();
      const heroEl = this.heroRef.nativeElement;
      const animation = heroEl.animate([
        {top, left},
        // make maybe weird shape
        { top: (top + y) / 2, left: (left + x) / 2, width: width / 2, height: height / 2,
          borderRadius: '5px', padding: '10px'},
        {
          top: y, left: x + 5, width: width - 10, height: height - 10,
          borderRadius: '5px', padding: '10px',
        },
      ], {
        duration: 250,
        fill: "both",
      });
      animation.finished.then((res: any) => {
        // works i guess :))
        setTimeout(() => {
          // this.notesService.upd();
          this._newNote = null;
          this.cdr.detectChanges();
          // think about the logic when we add it and etcetera
          console.log(res);
        }, 1000);
      });
    }
  }

  public _newNote: Color | null = null;

  public notes$ = this.notesService.getNotesList();
  public cols = 1;

  private readonly columnWidth = 250;
  private gridOffset = 0;
  private gridAnimation = false;
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
        if (this._newNote) {
          this.updateGrid();
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

  private get grid() {
    return this.gridRef.nativeElement;
  }
}
