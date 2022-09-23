export enum NoteStates {
  VIEW,
  LOADING,
  CREATING,
  EDIT,
  DELETING
}

export interface Note {
  id: number;
  title: string;
  content: string;

  color?: string;
  // remove
  test?: string;
  test2?: string;

  state?: NoteStates;
  loadingLast?: boolean;
}

export interface NotesState {
  notes: Note[];
}
