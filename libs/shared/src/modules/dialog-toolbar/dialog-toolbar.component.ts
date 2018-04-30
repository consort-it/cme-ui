import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cme-dialog-toolbar',
  templateUrl: './dialog-toolbar.component.html',
  styleUrls: ['./dialog-toolbar.component.scss']
})
export class DialogToolbarComponent implements OnInit {
  @Input() title = '';
  @Input() errorMessage = '';

  constructor() {}

  ngOnInit() {}
}
