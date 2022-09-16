import {createAction, createReducer, createSelector, on, props} from "@ngrx/store";
import {Note, NotesState, NoteStates} from "../shared/models/note.model";
import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {delay, NEVER, of, tap} from "rxjs";
import {catchError, map, mergeMap} from 'rxjs/operators';
import {NotesService} from "../shared/services/notes.service";

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
export const loadNotes = createAction("Load notes", props<{ from: number, count: number }>());
export const loadSuccess = createAction("Load success", props<{ notes: Note[], loaded: number }>());

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
export const maxColsSelector = createSelector(
  widthSelector,
  width => Math.floor(width / COLUMN_WIDTH)
);

export const posSelector = createSelector(
  widthSelector,
  maxColsSelector,
  (width, cols) =>
    Math.max(Math.floor((width - (GRID_PADDING + cols * COLUMN_WIDTH)) / 2), 0)
)

const initialNotesState: NotesState = {
  notes: [],
  width: 0,
  loaded: 0,
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
  on(loadSuccess, (state, val) => {
    console.log(state);

    return ({
      ...state,
      loaded: val.loaded,
      notes: [...state.notes, ...val.notes],
    });
  })
);

// we have 2 notes and space for more, it loads in the second row instead of the first (guess we need the max columns or smth like this)

// but then test if we add many items how it behaves there too

// maybe for maximum coolness we need to store the values in the store (and when we add new items or smth we forcibly recalculate them in the store directly?
// or what because we trigger cdr before those things but on the other size
// everything is synchronous here so hmm


// we have problem:
// we load these notes, but when displaying it either displays already in 3 columns but no animation in ng for
// or it displays as one column and only then animation
// if we have here delay then it loads all and no animation then it just slides (and lags a lot bro)
@Injectable()
export class NotesEffects {
  loadNotes = createEffect(() => this.actions$.pipe(
      ofType(loadNotes),
      mergeMap(() => this.notesService.getAllNotes().pipe(
        tap(console.log),
        tap(() => console.log("effect something")),
        // delay(1100),
        map(notes => loadSuccess({notes, loaded: 1})),
        catchError(() => NEVER) // just show something or smth alert or similar
      ))
    )
  );

  // success add note event:
  // do nothing

  // error add note event:
  // add to failed events in state, that's it
  // failed events can be create edit delete
  // basically a map
  // when interacting with server then use one action but maybe with bulk actions: add and edit in one request

  // then new effect which checks each 3 seconds or when manual trigger then retry saving, if success then success add not event

  // send request to server, if ok then success add note event
  // if not ok then error add note event


  addNote = createEffect(() => this.actions$.pipe(
      ofType(addNote),
      mergeMap(val => of(val)),
      tap(() => console.log('custom effect')),
    ), {dispatch: false}
  );

  constructor(
    private actions$: Actions,
    private notesService: NotesService,
  ) {
  }
}
