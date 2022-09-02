import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Observable,
  startWith,
  tap,
  throttleTime
} from "rxjs";
import {wrapGrid} from "animate-css-grid";
import {rxsize} from "./shared/utils/rxsizable.utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = '2';

  public cols = 1;
  public arr(n: number): number[] {
    return [...Array(n).keys()];
  }

  private resizing = false;
  private resize$ = rxsize(this.ref.nativeElement).pipe(
    throttleTime(25),
    filter(arr => !this.resizing && !!arr?.length),
    tap(() => resizeAllGridItems()),
    map(([rect]) => Math.floor(rect.contentRect.width / 300) || 1),
    distinctUntilChanged(),
  );

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef) {
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
        this.cols = val;
        this.cdr.detectChanges();
        console.log("animate");
        animate();
      });
    })
  }
}
// this way we only need one ngfor,thus improvimg performance because can re-use the items unsing trackby,
// when resizing with strict width on the notes, we don't need to recalculate anything, grid will do for us, we only need to recalculate
// if the width changes or the content of the note (width does not so we good)
// can create directive which will set the necessary amount of rowspan
// or optimize this a bit (rowgap set to 0 rowheight is known etc)
//he needs resize, but we may not need it if we have the width of the note the same thus saving a lot!
// think about how to make animation and also check because i think the prev version was kinda smoother?
function resizeAllGridItems(){
  console.log("resize all");
  const allItems = document.getElementsByClassName("bl") as unknown as HTMLElement[];
  const grid = document.getElementsByClassName("main")[0] as HTMLElement;

  const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  for(let x=0;x<allItems.length;x++){
    resizeGridItem(grid, rowHeight, allItems[x]);
  }
}

function resizeGridItem(grid:HTMLElement, rowHeight: number, item: HTMLElement){
  const rowSpan = Math.ceil((item.firstElementChild!.clientHeight + 10) / rowHeight);
  item.style.gridRowEnd = `span ${rowSpan}`;
}
