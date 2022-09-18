import {Injectable} from '@angular/core';

const NOTE_WIDTH = 250;
const GRID_PADDING = 10;

export type Position = [number, number];
export type Layout = [number, number][];

@Injectable()
export class GridService {
  public pos = 0;
  private cols = 1;

  public layouts: Layout[] = [];

  public get layout(): Layout {
    console.log(this.layouts[this.cols - 1])
    return this.layouts[this.cols - 1];
  }

  public gridChanged(width: number): void {
    this.cols = Math.max(Math.floor(width / NOTE_WIDTH), 1);
    this.pos = Math.max(Math.floor((width - (GRID_PADDING + this.cols * NOTE_WIDTH)) / 2), 0);
  }

  // optimize later so only those that change update
  public relayout(heights: number[]): void {
    for (let i = 0;i < 10;i++) {
      const colHeights = [...Array(i + 1)].map(() => 0);
      const res = heights.slice(0, i + 1).map((height, i) => {
        colHeights[i] = height;
        return [i * NOTE_WIDTH, 0] as Position;
      });
      heights.slice(i + 1).forEach(height => {
        const min = Math.min(...colHeights);
        const idx = colHeights.indexOf(min);
        res.push([idx * NOTE_WIDTH, min]);
        colHeights[idx] = colHeights[idx] + height;
      })
      this.layouts[i] = res;
    }
  }
}
