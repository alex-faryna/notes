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

  // maybe divide into data transfer object and view objects
  state?: NoteStates;
}
