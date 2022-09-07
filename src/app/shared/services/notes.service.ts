import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, shareReplay} from "rxjs";
import {Note} from "../models/note.model";

// maybe we can make a service ONLY for the grid
export const COLUMN_WIDTH = 250;
export const GRID_PADDING = 10;

export interface GridParams {
  cols: number;
  pos: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  // use ase storage for now, then move to store

  // sets grid to keep track of
  // myabe really move the resize to service
  // width of whole notes list component

  // the store would take this automatically
  public valueLength(val: number): void {
    this.dataLength.next(val);
  }

  public gridResized(val: number): void {
    this.gridWidth.next(val);
  }

  public gridPos(): number {
    return this.savedPos;
  }

  private gridWidth = new BehaviorSubject<number>(0);
  private dataLength = new BehaviorSubject<number>(0);
  private savedPos = 0;

  public gridData$ = combineLatest([
    this.gridWidth.pipe(distinctUntilChanged()),
    this.dataLength.pipe(distinctUntilChanged()),
  ]).pipe(map(([width, length]) => {
    const cols = Math.min(Math.floor(width / COLUMN_WIDTH) || 1, length);
    this.savedPos = Math.floor((width - (GRID_PADDING + cols * COLUMN_WIDTH)) / 2);
    return {cols, pos: this.savedPos};
  }));

  // also when notes list changes (just the quantity< and if it's smaler then current col num)

  // getter below, storage above

  public getNotesList(): Observable<Note[]> {
    return this.obs.asObservable();
  }

  private obs = new BehaviorSubject<Note[]>([
    {
      id: 0,
      title: "Note 1",
      content: "Content 1",
    },
    {
      id: 1,
      title: "Note 2",
      content: "Content 2",
      test: "2",
      test2: "2",
    },
    {
      id: 2,
      title: "Note 3",
      content: "Content 1",
    },
    {
      id: 3,
      title: "Note 4",
      content: "Content 2",
      test: "2",
      test2: "2",
    },
    {
      id: 4,
      title: "Note 5",
      content: "Content 1",
      test: "2",
      test2: "2",
    },
    {
      id: 5,
      title: "Note 6",
      content: "Content 2",
      test: "2",
    },
    {
      id: 6,
      title: "Note 7",
      content: "Content 1",
      test: "2",
    },
    {
      id: 7,
      title: "Note 8",
      content: "Content 2",
    },
  ].slice(0, 3));

  private cc() {
    setTimeout(() => {
      this.obs.next([
        {
          id: 0,
          title: "Note 1",
          content: "Content 1",
        },
        {
          id: 1,
          title: "Note 2",
          content: "Content 2",
          test: "2",
          test2: "2",
        },
        {
          id: 2,
          title: "Note 3",
          content: "Content 1",
        },
        {
          id: 3,
          title: "Note 4",
          content: "Content 2",
          test: "2",
          test2: "2",
        },
        {
          id: 4,
          title: "Note 5",
          content: "Content 1",
          test: "2",
          test2: "2",
        },
        {
          id: 5,
          title: "Note 6",
          content: "Content 2",
          test: "2",
        },
        {
          id: 6,
          title: "Note 7",
          content: "Content 1",
          test: "2",
        },
        {
          id: 7,
          title: "Note 8",
          content: "Content 2",
        },
        {
          id: 8,
          title: "Note 9",
          content: "Content 2",
        },
        {
          id: 9,
          title: "Note 10",
          content: "Content 2",
        },
        {
          id: 10,
          title: "Note 11",
          content: "Content 2",
          test: "3"
        },
        {
          id: 11,
          title: "Note 12",
          content: "Content 2",
        },
        {
          id: 12,
          title: "Note 13",
          content: "Content 2",
        },
        {
          id: 13,
          title: "Note 14",
          content: "Content 2",
          test: "3"
        }
      ])
    }, 5500);
  }
}
