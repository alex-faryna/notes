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
  @ViewChild("grid", {static: true}) public gridRef!: ElementRef;
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
      onEnd: () => this.gridAnimation = false,
    }).forceGridAnimation;
    this.grid$.subscribe(() => {
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
