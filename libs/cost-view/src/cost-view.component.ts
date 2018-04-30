import { Component } from '@angular/core';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'cme-cost-view',
  templateUrl: './cost-view.component.html',
  styleUrls: ['./cost-view.component.scss']
})
export class CostViewComponent {
  public readonly cost$ = timer(0, 50);
}
