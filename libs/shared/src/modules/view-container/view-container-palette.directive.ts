import { Directive } from '@angular/core';

@Directive({
  selector: '[cmeViewContainerPalette]'
})
export class ViewContainerPaletteDirective {
  // marker directive to be queryable via ContentChild in ViewContainerComponent
}
