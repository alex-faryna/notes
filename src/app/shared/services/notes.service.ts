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
        title: "Note 1",
        content: "Content 1",
      },
      {
        title: "Note 2",
        content: "Content 2",
      },
      {
        title: "Note 3",
        content: "Content 1",
        test: "2",
      },
      {
        title: "Note 4",
        content: "Content 2",
        test: "2",
      },
      {
        title: "Note 5",
        content: "Content 1",
      },
      {
        title: "Note 6",
        content: "Content 2",
        test: "2",
      },
      {
        title: "Note 7",
        content: "Content 1",
        test: "2",
      },
      {
        title: "Note 8",
        content: "Content 2",
      },
      {
        title: "Note 9",
        content: "Content 2",
      },
      {
        title: "Note 10",
        content: "Content 2",
      },
      {
        title: "Note 11",
        content: "Content 2",
        test: "3"
      },
      {
        title: "Note 9",
        content: "Content 2",
      },
      {
        title: "Note 10",
        content: "Content 2",
      },
      {
        title: "Note 11",
        content: "Content 2",
        test: "3"
      }
    ]).pipe(delay(1300));
  }
}
