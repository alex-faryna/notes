import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  constructor(private http: HttpClient) {
  }

  public getAllNotes(): Observable<unknown[]> {
    return this.http.get<unknown[]>("http://localhost:3000/notes/all");
  }
}
