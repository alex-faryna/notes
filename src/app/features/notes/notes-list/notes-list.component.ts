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

  private gridOffset = 0;
  private gridAnimation = false;
  private grid$ = rxsize(this.ref.nativeElement).pipe(
    tap(() => {
      if (!this.gridOffset) {
        this.gridOffset = this.grid.nativeElement.offsetLeft;
        this.grid.nativeElement.style.left = this.gridOffset + "px";
      }
    }),
    debounceTime(200),
    filter(arr => !this.gridAnimation && !!arr?.length),
    map(([rect]) => rect.contentRect.width),
    distinctUntilChanged(),
  );

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef,
              private notesService: NotesService) {
  }

  public ngOnInit(): void {
    this.cols = this.getColumns(this.ref.nativeElement.clientWidth);
    const animate = wrapGrid(this.grid.nativeElement, {
      duration: 250,
      stagger: 5,
      onStart: () => this.gridAnimation = true,
      onEnd: () => this.gridAnimation = false,
    }).forceGridAnimation;
    this.grid$.subscribe(width => {
      this.cols = this.getColumns(width);
      this.gridOffset = 0;
      this.cdr.detectChanges();
      this.grid.nativeElement.style.left = Math.floor((this.ref.nativeElement.clientWidth - this.grid.nativeElement.clientWidth) / 2) + "px";
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
