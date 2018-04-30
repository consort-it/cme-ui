import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';

import { DragAndDropService } from './microservice-drag-and-drop.service';
import {
  DRAG_AND_DROP_KEY,
  DRAG_AND_DROP_PHASE,
  MICROSERVICE_DRAG_AND_DROP,
  USE_PLACEHOLDER_ON_DRAGOVER
} from './shared';

@Directive({
  selector: '[cmeMicroserviceDragAndDrop]'
})
export class MicroserviceDragAndDropDirective implements OnInit {
  @Input() draggable = true;
  @Input() usePlaceholderOnDragover = true;
  @Input() dragAndDropKey = '';
  @Input() dragAndDropPhase = '';

  @Output() cmeDragstart = new EventEmitter<any>();
  @Output() cmeDragend = new EventEmitter<any>();

  @HostListener('dragstart', ['$event'])
  onDragstart(event: DragEvent) {
    this.dragAndDropService.dragstart(event.target as HTMLElement);
    this.cmeDragstart.emit();
  }

  @HostListener('dragend', ['$event'])
  onDragend(event: DragEvent) {
    this.dragAndDropService.dragend(event.target as HTMLElement);
    this.cmeDragend.emit();
  }

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private dragAndDropService: DragAndDropService
  ) {
    this.dragAndDropService.dragstart$.subscribe(element => {
      if (element.getAttribute(MICROSERVICE_DRAG_AND_DROP) === 'true') {
        this.mutePointerEvents();
      }
    });

    this.dragAndDropService.dragend$.subscribe(element => {
      if (element.getAttribute(MICROSERVICE_DRAG_AND_DROP) === 'true') {
        this.unmutePointerEvents();
      }
    });
  }

  ngOnInit() {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'draggable', this.draggable ? 'true' : 'false');
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      USE_PLACEHOLDER_ON_DRAGOVER,
      this.usePlaceholderOnDragover ? 'true' : 'false'
    );
    this.renderer.setAttribute(this.elementRef.nativeElement, MICROSERVICE_DRAG_AND_DROP, 'true');
    this.renderer.setAttribute(this.elementRef.nativeElement, DRAG_AND_DROP_KEY, this.dragAndDropKey);
    this.renderer.setAttribute(this.elementRef.nativeElement, DRAG_AND_DROP_PHASE, this.dragAndDropPhase);
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
