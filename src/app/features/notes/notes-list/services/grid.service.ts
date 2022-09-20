import {Injectable} from '@angular/core';

const CHECKPOINT_HEIGHT_ROWS = 10;
const MAX_COLS = 10;
const NOTE_WIDTH = 250;
const GRID_PADDING = 10;

export type Position = [number, number];
export type Layout = Position[];
export type AllLayouts = Layout[];
export type ColumnsHeight = number[];
export type ColumnsHeightHistory = ColumnsHeight[];
export type AllColumnsHeightHistory = ColumnsHeightHistory[];

// for each column number, we have many iterations of the layout's height

@Injectable()
export class GridService {
  public pos = 0;

  private cols = 1;
  private layouts: AllLayouts = [...Array(10).keys()].map(() => []);
  private columnHeights: ColumnsHeight[] = [...Array(10).keys()]
    .map(i => [...Array(i + 1).keys()].map(() => 0));
  private layoutsHeightHistory: AllColumnsHeightHistory = [...Array(10).keys()].map(() => []);
  // need column height for 4 columns but for each 5 rows too

  public get layout(): Layout {
    return this.layouts[this.cols - 1];
  }

  public gridChanged(width: number): void {
    this.cols = Math.min(Math.max(Math.floor(width / NOTE_WIDTH), 1), MAX_COLS);
    this.pos = Math.max(Math.floor((width - (GRID_PADDING + this.cols * NOTE_WIDTH)) / 2), 0);
  }

  // bro maybe just leave it as is?
  // i dunno if we are going to get a super huge boost in performance
  // ( and if you plan on having 1000+ notes then when going down so much you clearly need to


  // we have answer:
  // when we add/edit/remove we keep everything up, modify note and (cols * 10) notes, and other notes are stored in cache (in the store)
  // the layout keeps the same + the recalculation, and the other notes are removed from the layout
  // then when we scroll we add them from the cache and not from the backend (quantity problem here:
  // suppose we store 105 notes in the cache, then load from cache 20 notes at a time, then the cache has only 5 notes?
  // then in the next load, make api call, where the last is the last in the cache and add those 5 at the start of the response
  // i suppose these could be different from the store and be stored in a service? or no i think in the store would be better

  // maybe move these things (this service to the store?) although we would need subject sto retrieve data from storage
  // maybe decouple and make so that the component and storage take care of the grid service (this gri service is dumb, just give him commands)
  // and maybe later wire them to obs$

  // basically make function editlayout, where we tell how much of layout to keep, how to modify and how much to throw (the notes(the data) is stored
  // in the storage and will be store in cache there
  // this grid service takes only care of input heights of the notes and calculates those things (basically can be just util functions with storage)

  // addToLayout

  // editLayout

  // deleteLayout

  // cols * 500 i guess, i dont think there will be more notes or smth
  /*public deleteFromLayout(idx: number): void {
    for (let i = 0;i < 10;i++) {
      noteHeights.forEach(height => {
        const min = Math.min(...this.columnHeights[i]);
        const idx = this.columnHeights[i].indexOf(min);
        this.layouts[i].push([idx * NOTE_WIDTH, min]);
        this.columnHeights[i][idx] = this.columnHeights[i][idx] + height;
      })
    }
  }*/

  // would be cool if we could have smth like this 4 cols: [ [0] [1] [2] [3] ]
  // and if we add something in one of these cols, we just need to modify the corresponding array to the bottom and that's it

  // public editLayout(noteHeights: number[], )

  // methods:
  // append at the end (no delete or anything)
  // add at index (+ 100):
  // edit at index (+ 100)
  // delete at index (+ 100)

  // helper function: clear at index


  public appendLayout(noteHeights: number[]) : void {
    const length = noteHeights.length;
    const initLength = this.layouts[0].length;
    for (let col = 0;col < 10;col++) {
      for (let n = 0; n < length;n++) {
        const min = Math.min(...this.columnHeights[col]);
        const idx = this.columnHeights[col].indexOf(min);
        this.layouts[col].push([idx * NOTE_WIDTH, min]);
        this.columnHeights[col][idx] = this.columnHeights[col][idx] + noteHeights[n];
        if ((initLength + n) % ((col + 1) * 10)/* * 10*/ === 0) {
          this.layoutsHeightHistory[col].push([...this.columnHeights[col]]);
        }
      }
    }
    console.log("-------------------");
    console.dir(this.layouts);
    console.dir(this.layoutsHeightHistory);
  }

  // i guess it will not be here as we would only appendLayouts and modify it
  // optimize later so only those that change update
  /*public relayout(noteHeights: number[]): void {
    for (let i = 0;i < 10;i++) {
      this.columnHeights[i] = [...Array(i + 1)].map(() => 0);
      const res = noteHeights.slice(0, i + 1).map((height, idx) => {
        this.columnHeights[i][idx] = height;
        return [idx * NOTE_WIDTH, 0] as Position;
      });
      noteHeights.slice(i + 1).forEach(height => {
        const min = Math.min(...this.columnHeights[i]);
        const idx = this.columnHeights[i].indexOf(min);
        res.push([idx * NOTE_WIDTH, min]);
        this.columnHeights[i][idx] = this.columnHeights[i][idx] + height;
      })
      this.layouts[i] = res;
    }
  }*/
}
