import { Component, Input } from '@angular/core';
import { PropertyInfo } from '@cme2/connector-domain-model';

@Component({
  selector: 'cme-model-property',
  templateUrl: './model-property.component.html',
  styleUrls: ['./model-property.component.scss']
})
export class ModelPropertyComponent {
  @Input() property: PropertyInfo | undefined;
}
