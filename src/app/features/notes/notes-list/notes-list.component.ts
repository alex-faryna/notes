import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {distinctUntilChanged, filter, map, tap, throttleTime} from "rxjs";
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
  public cols = 1;

  public arr(n: number): number[] {
    return [...Array(n).keys()];
  }
  public notes$ = this.notesService.getNotesList();

  private resizing = false;
  private resize$ = rxsize(this.ref.nativeElement).pipe(
    throttleTime(25),
    filter(arr => !this.resizing && !!arr?.length),
    map(([rect]) => Math.floor(rect.contentRect.width / 250) || 1),
    distinctUntilChanged(),
  );

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef,
              private notesService: NotesService) {
  }

  public ngOnInit() {
    setTimeout(() => {
      const grid = document.getElementsByClassName("main")[0] as HTMLElement;
      const animate = wrapGrid(grid, {
        duration: 250,
        stagger: 5,
        onStart: () => this.resizing = true,
        onEnd: () => this.resizing = false,
      }).forceGridAnimation;
      this.resize$.subscribe(val => {
        resizeAllGridItems();
        this.cols = val;
        this.cdr.detectChanges();
        console.log("animate");
        animate();
      });
    })
  }

  public trackByMethod(index: number, el: Note): number {
    return el.id;
  }
}

function resizeAllGridItems() {
  console.log("resize all");
  const allItems = document.getElementsByClassName("bl") as unknown as HTMLElement[];
  const grid = document.getElementsByClassName("main")[0] as HTMLElement;

  const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  for (let x = 0; x < allItems.length; x++) {
    resizeGridItem(grid, rowHeight, allItems[x]);
  }
}

function resizeGridItem(grid: HTMLElement, rowHeight: number, item: HTMLElement) {
  const rowSpan = Math.ceil((item.firstElementChild!.clientHeight + 10) / rowHeight);
  item.style.gridRowEnd = `span ${rowSpan}`;
}
