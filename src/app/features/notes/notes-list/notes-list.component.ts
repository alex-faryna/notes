import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit, Query, QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
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

  private resizing = false;
  private colNum$ = rxsize(this.ref.nativeElement).pipe(
    debounceTime(200),
    filter(arr => !this.resizing && !!arr?.length),
    map(([rect]) => this.getColumns(rect.contentRect.width)),
    distinctUntilChanged(),
  );

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef,
              private notesService: NotesService) {
  }

  // we can develop a system similar like in iOS
  // when user scrolls or resizes the window all other big tasks should stop (except for http calls I guess)
  // or mb I am just dumb and something like this is already done with the help of the microtasks
  public ngOnInit(): void {
    this.cols = this.getColumns(this.ref.nativeElement.clientWidth);
    const animate = wrapGrid(this.grid.nativeElement, {
      duration: 250,
      stagger: 5,
      onStart: () => this.resizing = true,
      onEnd: () => this.resizing = false,
    }).forceGridAnimation;
    this.colNum$.subscribe(val => {
      this.cols = val;
      this.cdr.detectChanges();
      animate();
    });
    // when resizing the window, if we detect that the new val of cols is smaller trigger it immediately
    // i guess that when data changes we need to resize them all and also when resize is small need to resize too
  }

  public trackByMethod(index: number, el: Note): number {
    return el.id;
  }

  private getColumns(parent: number): number {
    return Math.floor(parent / this.columnWidth) || 1;
  }
}
