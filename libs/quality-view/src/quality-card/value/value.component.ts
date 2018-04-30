import { Component, Input } from '@angular/core';

@Component({
  selector: 'cme-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss']
})
export class ValueComponent {
  @Input() value: string | undefined | null;
  @Input() unit = '%';
}
