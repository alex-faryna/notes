import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from "rxjs";
import {Note} from "../models/note.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  constructor(private http: HttpClient) {
  }

  private getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>("http://localhost:3000/notes/all");
  }

  public loadNotes(lastId: number | false, count = 10): Observable<Note[]> {
    return this.http.get<Note[]>(`http://localhost:3000/notes?start=${lastId}&count=${count}`);
  }

  public createNote(color: string): Observable<number> {
    return this.http.put("http://localhost:3000/notes", {color}) as Observable<number>;
  }

  public editNote(note: Partial<Note>): Observable<unknown> {
    return this.http.post<Note[]>(`http://localhost:3000/notes`, {note});
  }
}
