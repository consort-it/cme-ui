import { Directive } from '@angular/core';

@Directive({
  selector: '[cmeViewContainerContent]'
})
export class ViewContainerContentDirective {
  // marker directive to be queryable via ContentChild in ViewContainerComponent
}
