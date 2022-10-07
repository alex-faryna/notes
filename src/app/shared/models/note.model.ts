import {ColorBubble} from "./color.model";

export enum NoteStates {
  VIEW,
  LOADING,
  CREATING,
  DRAGGING
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
  createEvent?: Event;
}

export interface NotesState {
  notes: Note[];
  draggingNoteIdx?: number;
}
