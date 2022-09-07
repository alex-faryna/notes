import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[note]'
})
export class NoteDirective implements AfterViewInit {
  @Input() gap = 10;

  constructor(private ref: ElementRef) {}

  public ngAfterViewInit(): void {
    // console.log("note");
    const note = this.ref.nativeElement;
    note.parentElement.style.gridRowEnd = `span ${note.clientHeight + this.gap}`;
  }
}
