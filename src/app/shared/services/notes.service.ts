import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";
import {Note} from "../models/note.model";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  constructor(private http: HttpClient) {
  }

  public getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>("http://localhost:3000/notes/all");
  }
}
