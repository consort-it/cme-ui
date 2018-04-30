import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MicroserviceDragAndDropControllerDirective } from './microservice-drag-and-drop-controller.directive';
import { MicroserviceDragAndDropDirective } from './microservice-drag-and-drop.directive';
import { DragAndDropService } from './microservice-drag-and-drop.service';
import { PhaseDragAndDropControllerDirective } from './phase-drag-and-drop-controller.directive';
import { PhaseDragAndDropDirective } from './phase-drag-and-drop.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    MicroserviceDragAndDropControllerDirective,
    MicroserviceDragAndDropDirective,
    PhaseDragAndDropControllerDirective,
    PhaseDragAndDropDirective
  ],
  exports: [
    MicroserviceDragAndDropControllerDirective,
    MicroserviceDragAndDropDirective,
    PhaseDragAndDropControllerDirective,
    PhaseDragAndDropDirective
  ],
  providers: [DragAndDropService]
})
export class DragAndDropModule {}
