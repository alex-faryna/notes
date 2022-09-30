import {createAction, createReducer, createSelector, on, props, Store} from "@ngrx/store";
import {Note, NotesState, NoteStates} from "../shared/models/note.model";
import {Injectable} from "@angular/core";
import {Actions, concatLatestFrom, createEffect, ofType} from "@ngrx/effects";
import {NEVER, of, tap, withLatestFrom} from "rxjs";
import {catchError, map, mergeMap} from 'rxjs/operators';
import {NotesService} from "../shared/services/notes.service";
import {immerOn} from "ngrx-immer/store";
import {ColorBubble} from "../shared/models/color.model";


export interface AppState {
  notes: NotesState;
}

export const addNote = createAction("Create new empty note", props<{ bubble: ColorBubble }>());
export const addNoteAnimation = createAction("Created note animation done", props<{ id: number }>());

export const addNoteUpdateId = createAction("Update id of created note", props<{id: number}>());

export const deleteNote = createAction("Delete note by id", props<{ id: number }>());
export const loadNotes = createAction("Load notes", props<{ from: number, count: number }>());
export const loadSuccess = createAction("Load success", props<{ notes: Note[] }>());
export const loadNotesAnimation = createAction("Notes loaded animation done", props<{ ids: number[] }>());
// lock states when doing animations or actions, so they don't interfere with each other

export const selectNotesState = (state: AppState) => state.notes;
export const notesSelector = createSelector(selectNotesState, state => state.notes);

const initialNotesState: NotesState = {
  notes: [],
}

export const notesReducer = createReducer(
  initialNotesState,
  /*on(addNote, (state, {color}) => {
    const note = {
      id: 1000 + state.notes.length, // 0 or -1 which later changes to id from server and that's it
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
  }),*/
  immerOn(addNote, (state, {bubble}) => {
    state.notes.unshift({
      id: 1000 + state.notes.length, // 0 or -1 which later changes to id from server and that's it
      title: "New title " + state.notes.length,
      content: "New content",
      state: NoteStates.CREATING,
      color: bubble.color.color,
      createEvent: bubble.event,
    });
  }),
  on(deleteNote, (state, {id}) => ({
    ...state,
    notes: state.notes.filter(note => note.id !== id),
  })),
  on(loadSuccess, (state, val) => {
    console.log(state);

    return ({
      ...state,
      notes: [...state.notes, ...val.notes],
    });
  }),
  immerOn(addNoteAnimation, (state, {id}) => {
    state.notes[id].state = NoteStates.VIEW;
  }),
  immerOn(loadNotesAnimation, (state, {ids}) => {
    if (state.notes.length) {
      for (const id of ids) {
        state.notes[id].state = NoteStates.VIEW;
        state.notes[id].loadingLast = false;
      }
    }
  }),
  immerOn(addNoteUpdateId, (state, {id}) => {
    state.notes[0].id = id;
  })
);


let i = 1000;
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
      // concatLatestFrom(() => this.store.select(notesSelector)),
      tap(console.log),
      mergeMap(() => this.notesService.getAllNotes().pipe(
        map((notes: Note[]) => notes.map(note => ({...note, state: NoteStates.LOADING}))),
        map((notes: Note[]) => {
          const last = notes.pop();
          return [
            ...notes,
            {
              ...last,
              loadingLast: true,
            }] as Note[]
        }),
        map(notes => loadSuccess({notes})),
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
      tap(v => console.log(v)),
      mergeMap(val => of(i)),
      tap(() => {
        console.log('custom effect');
        i++;
      }),
      map(id => addNoteUpdateId({id})),
      catchError(() => NEVER)
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private notesService: NotesService,
  ) {}
}
