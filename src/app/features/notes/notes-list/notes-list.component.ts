import {
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
  @ViewChild("notesContainer", {static: true}) public notesContainer!: ElementRef;
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

  public ngOnInit(): void {
    const notesContainer = this.notesContainer.nativeElement;
    this.cols = this.getColumns(notesContainer.clientWidth);
    const animate = wrapGrid(notesContainer, {
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
    // i guess that when data changes we need to resize them all and also when resize is small need to resize too
  }

  public trackByMethod(index: number, el: Note): number {
    return el.id;
  }

  private resizeAllGridItems(): void {
    // console.log("resize all");
    // console.log(this.notes);
    // this.notes.forEach(note => console.log(note.nativeElement));
    // this.notes.forEach(note => note.style.gridRowEnd = `span ${note.firstElementChild!.clientHeight + 10}`);
    const allItems: unknown = document.getElementsByTagName("app-note-list-item");
    Array.from(allItems as HTMLElement[]).forEach(item => {
      item.style.gridRowEnd = `span ${item.firstElementChild!.clientHeight + 10}`;
    })
  }

  private getColumns(parent: number): number {
    return Math.floor(parent / this.columnWidth) || 1;
  }
}
