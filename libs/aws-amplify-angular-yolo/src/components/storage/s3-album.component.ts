import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AmplifyService } from '../../providers';

const template = `
<div class="amplify-album-container">
  <amplify-s3-image
    class="amplify-image-container"
    *ngFor="let item of list"
    path="{{item.path}}"
    (selected)="onImageSelected($event)"
  ></amplify-s3-image>
</div>
`;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'amplify-s3-album',
  template: template
})
export class S3AlbumComponent {
  list: Array<Object>;

  amplifyService: AmplifyService;

  @Output() selected: EventEmitter<string> = new EventEmitter<string>();

  constructor(amplifyService: AmplifyService) {
    this.amplifyService = amplifyService;
  }

  onImageSelected(event: any) {
    this.selected.emit(event);
  }

  @Input()
  set path(path: string) {
    if (!path) {
      return;
    }
    const that = this;
    this.amplifyService
      .storage()
      .list(path)
      .then(data => {
        that.list = data.map((item: any) => {
          return { path: item.key };
        });
      })
      .catch(err => console.error(err));
  }
}
