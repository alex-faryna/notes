export enum NoteStates {
  VIEW,
  CREATE,
  EDIT
}

export interface Note {
  id: number;
  title: string;
  content: string;

  // remove
  test?: string;
  test2?: string;

  color?: string;

  // maybe divide into data transfer object and view objects
  state?: NoteStates;
}

export interface NotesState {
  notes: Note[];
  width: number;
  loaded: number;
}
