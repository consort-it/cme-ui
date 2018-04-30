import { Component, Input } from '@angular/core';

@Component({
  selector: 'cme-quality-card',
  templateUrl: './quality-card.component.html',
  styleUrls: ['./quality-card.component.scss']
})
export class QualityCardComponent {
  @Input() title: string | undefined;

  @Input() description: string | undefined;
}
