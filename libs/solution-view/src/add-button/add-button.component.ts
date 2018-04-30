import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cme-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent {
  @Input() tooltip = '';
}
