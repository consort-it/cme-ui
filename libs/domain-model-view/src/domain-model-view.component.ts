import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomainModel } from '@cme2/connector-domain-model';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { DomainModelPaletteService } from './domain-model-palette/services/domain-model-palette.service';
import { DomainModelService } from './services/domain-model.service';

@Component({
  selector: 'cme-domain-model-view',
  templateUrl: './domain-model-view.component.html',
  styleUrls: ['./domain-model-view.component.scss']
})
export class DomainModelViewComponent implements OnInit, OnDestroy {
  private itemWidth = 300;
  private itemGap = 20;
  private currentX = 0;
  private currentY = 0;

  domainModelSubscription: Subscription = Subscription.EMPTY;
  disableUserSelection = false;

  savePosition($event: { x: number; y: number }, model: DomainModel) {
    model.positionX = $event.x;
    model.positionY = $event.y;
    this.domainModelService.updateModel(model);
  }

  constructor(public domainModelService: DomainModelService, public paletteService: DomainModelPaletteService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.domainModelSubscription.unsubscribe();
  }
  onDragAndDropStart(model: DomainModel) {
    this.disableUserSelection = true;

    let highestZIndex = 0;
    this.domainModelService.domainModels.forEach(m => {
      highestZIndex = (m.zIndex || 0) > highestZIndex ? m.zIndex || 0 : highestZIndex;
    });

    model.zIndex = highestZIndex + 1;
  }

  onDragAndDropEnd(model: DomainModel) {
    this.disableUserSelection = false;
    this.domainModelService.updateModel(model);
  }

  onPaletteVisibleChange(visible: boolean) {
    if (!visible) {
      this.paletteService.close();
    }
  }
}
