import {Injectable} from '@angular/core';

const MAX_COLS = 10;
const NOTE_WIDTH = 250;
const GRID_PADDING = 10;

export type Position = [number, number];
export type Layout = Position[];
type AllLayouts = Layout[];
type ColumnsHeight = number[];

// if we see performance drop make with interval heights and steps
// for now: just relayout everything when notes change (load or action)
@Injectable()
export class GridService {
  public pos = 0;

  private cols = 1;
  private layouts: AllLayouts = [];
  private columnHeights: ColumnsHeight[] = [];

  public get layout(): Layout {
    return this.layouts[this.cols - 1];
  }

  public gridChanged(width: number): void {
    this.cols = Math.min(Math.max(Math.floor(width / NOTE_WIDTH), 1), MAX_COLS);
    this.pos = Math.max(Math.floor((width - (GRID_PADDING + this.cols * NOTE_WIDTH)) / 2), 0);
  }

  public relayout(noteHeights: number[]): void {
    console.log("big relayout");
    const len = noteHeights.length;
    for (let i = 0;i < 10;i++) {
      this.columnHeights[i] = [...Array(i + 1)].map(() => 0);
      const res: Layout = [];
      const colHeights = this.columnHeights[i];
      for (let n = 0;n < len;n++) {
        const min = Math.min(...colHeights);
        const idx = colHeights.indexOf(min);
        res.push([idx * NOTE_WIDTH, min]);
        colHeights[idx] = colHeights[idx] + noteHeights[n] + GRID_PADDING;
      }
      this.layouts[i] = res;
    }
  }
}
