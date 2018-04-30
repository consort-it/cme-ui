import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

import { DragAndDropService } from './microservice-drag-and-drop.service';
import { PHASE_DRAG_AND_DROP } from './shared';

@Directive({
  selector: '[cmePhaseDragAndDrop]'
})
export class PhaseDragAndDropDirective {
  @HostListener('dragstart', ['$event'])
  onDragstart(event: DragEvent) {
    this.dragAndDropService.dragstart(event.target as HTMLElement);
  }

  @HostListener('dragend', ['$event'])
  onDragend(event: DragEvent) {
    this.dragAndDropService.dragend(event.target as HTMLElement);
  }

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private dragAndDropService: DragAndDropService
  ) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'draggable', 'true');
    this.renderer.setAttribute(this.elementRef.nativeElement, PHASE_DRAG_AND_DROP, 'true');

    this.dragAndDropService.dragstart$.subscribe(element => {
      if (element.getAttribute(PHASE_DRAG_AND_DROP) === 'true') {
        this.mutePointerEvents();
      }
    });

    this.dragAndDropService.dragend$.subscribe(element => {
      if (element.getAttribute(PHASE_DRAG_AND_DROP) === 'true') {
        this.unmutePointerEvents();
      }
    });
  }

  private mutePointerEvents() {
    this.setPointerEvents('none');
  }

  private unmutePointerEvents() {
    this.setPointerEvents('');
  }

  private setPointerEvents(value: string) {
    const a = Array.from((this.elementRef.nativeElement as HTMLElement).children);
    a.forEach(e => {
      (e as HTMLElement).style.pointerEvents = value;
    });
  }
}
