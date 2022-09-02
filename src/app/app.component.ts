import {AfterViewInit, Component} from '@angular/core';
import {startWith} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'notes';

  public arr(n: number): number[] {
    return [...Array(n).keys()];
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      resizeAllGridItems();
    })
  }
}
// this way we only need one ngfor,thus improvimg performance because can re-use the items unsing trackby,
// when resizing with strict width on the notes, we don't need to recalculate anything, grid will do for us, we only need to recalculate
// if the width changes or the content of the note (width does not so we good)
// can create directive which will set the necessary amount of rowspan
// or optimize this a bit (rowgap set to 0 rowheight is known etc)
//he needs resize, but we may not need it if we have the width of the note the same thus saving a lot!
function resizeAllGridItems(){
  console.log("?");
  let allItems = document.getElementsByClassName("bl") as unknown as HTMLElement[];
  for(let x=0;x<allItems.length;x++){
    resizeGridItem(allItems[x]);
  }
}

function resizeGridItem(item: HTMLElement){
  console.log(item.querySelector('.content')!.getBoundingClientRect().height);
  let grid = document.getElementsByClassName("main")[0];
  let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
  let rowSpan = Math.ceil((item.querySelector('.content')!.getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
  item.style.gridRowEnd = "span "+rowSpan;
}
