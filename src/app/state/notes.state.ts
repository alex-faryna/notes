import {createAction, createReducer, createSelector, on, props} from "@ngrx/store";
import {NotesState, NoteStates} from "../shared/models/note.model";
import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {delay, EMPTY, of, tap} from "rxjs";
import {catchError, map, mergeMap} from 'rxjs/operators';

export const COLUMN_WIDTH = 250;
export const GRID_PADDING = 10;

export interface GridParams {
  cols: number;
  pos: number;
}

export interface AppState {
  notes: NotesState;
}

export const addNote = createAction("Create new empty note", props<{ color: string }>());
export const deleteNote = createAction("Delete note by id", props<{ id: number }>());
export const widthChanged = createAction("Width changed", props<{ width: number }>());
export const loadNotes = createAction("Load notes");

// lock states when doing animations, so they don't interfere with each other

export const selectNotesState = (state: AppState) => state.notes;
export const notesSelector = createSelector(
  selectNotesState,
  state => state.notes,
);
export const notesLengthSelector = createSelector(
  notesSelector,
  notes => notes.length || 0,
)
export const widthSelector = createSelector(
  selectNotesState,
  state => state.width
);
export const colsSelector = createSelector(
  notesLengthSelector,
  widthSelector,
  (length, width) =>
    Math.min(Math.floor(width / COLUMN_WIDTH) || 1, length),
);
export const posSelector = createSelector(
  widthSelector,
  colsSelector,
  (width, cols) =>
    Math.max(Math.floor((width - (GRID_PADDING + cols * COLUMN_WIDTH)) / 2), 0)
)

const initialNotesState: NotesState = {
  notes: [],
  width: 0,
}

export const notesReducer = createReducer(
  initialNotesState,
  on(widthChanged, (state, {width}) => {
    // console.log(state);
    return {...state, width};
  }),
  on(addNote, (state, {color}) => {
    const note = {
      id: state.notes.length, // 0 or -1 which later changes to id from server and that's it
      title: "New title " + state.notes.length,
      content: "New content",
      state: color === "!!!" ? NoteStates.VIEW : NoteStates.EDIT,
      color
    }
    if (color === "!!!") {
      return {
        ...state,
        notes: [...state.notes, note]
      }
    }
    return {
      ...state,
      notes: [note, ...state.notes]
    };
  }),
  on(deleteNote, (state, {id}) => ({
    ...state,
    notes: state.notes.filter(note => note.id !== id),
  })),
);

@Injectable()
export class NotesEffects {
  loadMovies$ = createEffect(() => this.actions$.pipe(
      ofType(loadNotes),
      mergeMap(() => of([]).pipe(
        tap(() => console.log("effct something")),
        delay(3000),
        tap(() => console.log("loaded something")),
        //map(movies => ({type: '[Movies API] Movies Loaded Success', payload: movies})),
        // catchError(() => EMPTY)
      ))
    ), {dispatch: false}
  );

  constructor(
    private actions$: Actions,
  ) {
  }
}
