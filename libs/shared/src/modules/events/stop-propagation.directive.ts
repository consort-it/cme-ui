import { Directive, HostListener, Input, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[cmeStopPropagation]'
})
export class StopPropagationDirective implements OnInit, OnDestroy {
  @Input() cmeStopPropagation = 'click';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.addEventListener(this.cmeStopPropagation, this.onEvent);
  }

  ngOnDestroy() {
    this.el.nativeElement.removeEventListener(this.cmeStopPropagation, this.onEvent);
  }

  private onEvent(event: any): void {
    event.stopPropagation();
  }
}
