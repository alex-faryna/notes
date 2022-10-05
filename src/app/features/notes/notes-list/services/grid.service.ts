import {Injectable, QueryList} from '@angular/core';
import {NoteListItemComponent} from "../components/note-list-item/note-list-item.component";

const MAX_COLS = 10;
const GRID_PADDING = 10;
export const NOTE_WIDTH = 250;

export type Position = [number, number];
export type Layout = Position[];
type AllLayouts = Layout[];
type ColumnsHeight = number[];

// if we see performance drop make with interval heights and steps
// for now: just relayout everything when notes change (load or action)
@Injectable({
  providedIn: "root"
})
export class GridService {
  public pos = 0;

  public cols = 1;
  private layouts: AllLayouts = [];
  private columnHeights: ColumnsHeight[] = [];

  public get layout(): Layout {
    return this.layouts[this.cols - 1];
  }

  public gridChanged(width: number): void {
    this.cols = Math.min(Math.max(Math.floor(width / NOTE_WIDTH), 1), MAX_COLS);
    this.pos = Math.max(Math.floor((width - (GRID_PADDING + this.cols * NOTE_WIDTH)) / 2), 0);
  }

  // for now from top to bottom relayout

  public relayout3(notes: QueryList<NoteListItemComponent>, dragging?: [number, number]): void {
    const len = notes.length;
    for (let i = 0;i < 10;i++) {
      this.columnHeights[i] = [...Array(i + 1)].map(() => 100);
      const res: Layout = [];
      const colHeights = this.columnHeights[i];
      for (let n = 0;n < len;n++) {
        const min = Math.min(...colHeights);
        const idx = colHeights.indexOf(min);
        res.push([idx * NOTE_WIDTH, min]);
        colHeights[idx] += notes.get(this.replace(n, dragging))!.elem.clientHeight;
      }
      this.layouts[i] = res;
    }
  }

  public relayout(notes: QueryList<NoteListItemComponent>, dragging?: [number, number]): void {
    const len = notes.length;
    for (let i = 0;i < 10;i++) {
      this.columnHeights[i] = [...Array(i + 1)].map(() => 100);
      const res: Layout = [];
      const colHeights = this.columnHeights[i];

      if (dragging) {
        for (let n = 0; n < dragging[0];n++) {
          const min = Math.min(...colHeights);
          const idx = colHeights.indexOf(min);
          res.push([idx * NOTE_WIDTH, min]);
          colHeights[idx] += notes.get(n)!.elem.clientHeight;
        }
        for(let n = dragging[0] + 1;n <= dragging[1];n++) {
          const min = Math.min(...colHeights);
          const idx = colHeights.indexOf(min);
          res.push([idx * NOTE_WIDTH, min]);
          colHeights[idx] += notes.get(n)!.elem.clientHeight;
        }
        // dragging[0]
        {
          const min = Math.min(...colHeights);
          const idx = colHeights.indexOf(min);
          res.push([idx * NOTE_WIDTH, min]);
          colHeights[idx] += notes.get(dragging[0])!.elem.clientHeight;
        }
        for(let n = dragging[1] + 1;n < len;n++) {
          const min = Math.min(...colHeights);
          const idx = colHeights.indexOf(min);
          res.push([idx * NOTE_WIDTH, min]);
          colHeights[idx] += notes.get(n)!.elem.clientHeight;
        }
      } else {
        for (let n = 0; n < len; n++) {
          const min = Math.min(...colHeights);
          const idx = colHeights.indexOf(min);
          res.push([idx * NOTE_WIDTH, min]);
          colHeights[idx] += notes.get(n)!.elem.clientHeight;
        }
      }
      this.layouts[i] = res;
    }
  }

  // make 3 loops:
  // from 0 to option[0]
  // option[1]
  // options[0] to options[1]
  // options[0]
  // options[1] to end

  // works but optimize
  private replace(curr: number, options?: [number, number]): number {
    if (curr === options?.[0]) {
      return options[1];
    } else if (curr === options?.[1]) {
      return options[0];
    }
    return curr;
  }
}
