import { Injectable } from '@angular/core';
import {delay, Observable, of} from "rxjs";
import {Note} from "../models/note.model";

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor() { }

  public getNotesList(): Observable<Note[]> {
    return of([
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
    ].slice(0, 7));
  }
}
