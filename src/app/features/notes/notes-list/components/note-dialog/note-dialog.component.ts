import {AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Note} from "../../../../../shared/models/note.model";
import {getContrastColor} from "../../../../../shared/models/color.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {debounceTime, startWith, tap} from "rxjs";
import {AppState, editNote} from "../../../../../state/notes.state";
import {Store} from "@ngrx/store";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.scss']
})
export class NoteDialogComponent implements AfterViewInit {
  @ViewChild("content", {static: true}) public contentInput!: ElementRef<HTMLElement>;
  public form = this.fb.group({
    title: this.data.note?.title || "",
    content: this.data.note?.content || "",
  });

  // change i guess
  public set color(val: string | undefined) {
    this._color = val ? val : this._color;
    this.textColor = getContrastColor(this._color);
  };

  public _color = "#424242";
  public textColor = "#ffffff";

  constructor(@Inject(MAT_DIALOG_DATA) public data: {idx: number, note: Note},
              private store: Store<AppState>,
              private fb: FormBuilder) {
    console.log(data.idx);
    this.color = data?.note?.color!;
  }

  public ngAfterViewInit() {
    this.setCaret();
    this.form.valueChanges.pipe(
      debounceTime(700),
      map(value => ({
        ...this.data.note,
        title: this.trim(value.title ?? ""),
        content: this.trim(value.content ?? ""),
      }) as Note),
      tap(console.log),
    ).subscribe(note => this.store.dispatch(editNote({idx: this.data.idx, note})));
  }

  public input(key: "title" | "content", value: string): void {
    console.log(value);
    this.form.patchValue({[key]: value});
  }

  private trim(val: string): string {
    return val.replace(/[\n\r\s]+$/, '');
  }

  private setCaret(): void {
    const input = this.contentInput.nativeElement;
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(input);
    range.collapse(false);
    sel!.removeAllRanges();
    sel!.addRange(range);
    input.focus();
    range.detach();
    input.scrollTop = input.scrollHeight;
  }
}
