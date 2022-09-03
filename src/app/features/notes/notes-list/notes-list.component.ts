import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, map, tap} from "rxjs";
import {rxsize} from "../../../shared/utils/rxsizable.utils";
import {wrapGrid} from "animate-css-grid";
import {NotesService} from "../../../shared/services/notes.service";
import {Note} from "../../../shared/models/note.model";

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesListComponent implements OnInit {
  @ViewChild("grid", {static: true}) public grid!: ElementRef;
  private readonly columnWidth = 250;
  public cols = 1;
  public notes$ = this.notesService.getNotesList();

  private offset = 0;
  private data = {

  };

  private resizing = false;
  private colNum$ = rxsize(this.ref.nativeElement).pipe(
    tap(([rect]) => {

      // this.grid.nativeElement.style.position = "absolute";
      // console.log(rect.contentRect.width)
      if (!this.offset) {
        this.offset = this.grid.nativeElement.offsetLeft;
        this.grid.nativeElement.style.position = "absolute";
        this.grid.nativeElement.style.left = `${this.offset}px`;

        this.data = {
          flexWidth: this.ref.nativeElement.clientWidth,
          gridLeft: this.grid.nativeElement.offsetLeft,
          gridWidth: this.grid.nativeElement.clientWidth,
        };

        // this.resizeWidth = this.cont.nativeElement.clientWidth; //rect.contentRect.width;
      }

      /*else {
        this.grid.nativeElement.style.position = "absolute";
        this.grid.nativeElement.style.left = `${this.offset}px`;

        // this.cont.nativeElement.style.minWidth = this.resizeWidth;
        // this.cdr.detectChanges();
        // console.log(this.resizeWidth);
      }*/
    }),
    debounceTime(200),
    filter(arr => !this.resizing && !!arr?.length),
    map(([rect]) => [rect.contentRect.width, this.getColumns(rect.contentRect.width)]),
    distinctUntilChanged(),
  );

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef,
              private notesService: NotesService) {
  }

  // when resizing we need to make the grid absolute positioned mayeb not him but it's parent
  // and then we make position absolute for the grid while it transitions
  //if it works wery well can deo own omplementation for grid animations and optimize it quite a lot

  // we can develop a system similar like in iOS
  // when user scrolls or resizes the window all other big tasks should stop (except for http calls I guess)
  // or mb I am just dumb and something like this is already done with the help of the microtasks
  public ngOnInit(): void {
    // this.cols = this.getColumns(this.ref.nativeElement.clientWidth);
    this.cols = this.getColumns(this.grid.nativeElement.parentElement.clientWidth);
    const animate = wrapGrid(this.grid.nativeElement, {
      duration: 250,
      stagger: 5,
      onStart: () => this.resizing = true,
      onEnd: () => this.resizing = false,
    }).forceGridAnimation;
    this.colNum$.subscribe(([width, columns]) => {
      console.log(`small [${width}]`);
      this.cols = columns;
      this.cdr.detectChanges();

      //
      console.log("initial:");
      console.dir(this.data);

      this.data = {
        flexWidth: this.ref.nativeElement.clientWidth,
        gridLeft: this.grid.nativeElement.offsetLeft,
        gridWidth: this.grid.nativeElement.clientWidth,
      };

      console.dir(this.data);
      this.offset = 0;
      // this.grid.nativeElement.style.position = "relative";
      //this.grid.nativeElement.style.left = null;
      this.grid.nativeElement.style.left = `${Math.floor((this.ref.nativeElement.clientWidth - this.grid.nativeElement.clientWidth) / 2)}px`;

      animate();
    });
  }

  public trackByMethod(index: number, el: Note): number {
    return el.id;
  }

  private getColumns(parent: number): number {
    return Math.floor(parent / this.columnWidth) || 1;
  }
}
