import { PHASE_DRAG_AND_DROP } from './shared';
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[cmePhaseDragAndDropController]'
})
export class PhaseDragAndDropControllerDirective {
  private _nativeElement: HTMLElement;
  private _draggedElement: HTMLElement | undefined;
  private _data: any[] = [];

  @Output() phaseDragAndDropDone = new EventEmitter<any[]>();

  @Input()
  set phaseDragAndDropData(data: any[]) {
    this._data = [...data];
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    const target: HTMLElement = event.target as HTMLElement;

    if (this.hasPhaseDragAndDropAttribute(target) === false) {
      return;
    }

    this._draggedElement = target;
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    const target = event.target as HTMLElement;

    if (this.hasPhaseDragAndDropAttribute(target) === false) {
      return;
    }

    if (this._draggedElement === undefined || target === this._draggedElement) {
      return;
    }

    this.switchElements(this._draggedElement, target);
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    const target = event.target as HTMLElement;

    if (this.hasPhaseDragAndDropAttribute(target) === false) {
      return;
    }

    this._draggedElement = undefined;
    this.phaseDragAndDropDone.emit(this._data);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this._nativeElement = this.el.nativeElement;
  }

  getPositionWithinParent(childNode: HTMLElement): number {
    const children = Array.from(this._nativeElement.children).filter(e => {
      const el = e as HTMLElement;
      return !!el.draggable;
    });
    return children.findIndex(child => child === childNode);
  }

  switchElements(elementDragged: HTMLElement, elementTarget: HTMLElement) {
    const positionDraggedElement = this.getPositionWithinParent(elementDragged);
    const positionElementTarget = this.getPositionWithinParent(elementTarget);

    if (positionDraggedElement < positionElementTarget) {
      this.renderer.insertBefore(this._nativeElement, elementTarget, elementDragged);
    } else {
      this.renderer.insertBefore(this._nativeElement, elementDragged, elementTarget);
    }

    const refElementDragged = this._data[positionDraggedElement];
    this._data[positionDraggedElement] = this._data[positionElementTarget];
    this._data[positionElementTarget] = refElementDragged;
  }

  private hasPhaseDragAndDropAttribute(element: HTMLElement): boolean {
    const attr = element.getAttribute(PHASE_DRAG_AND_DROP);
    return attr === 'true';
  }
}
