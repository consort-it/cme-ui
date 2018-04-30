import { ChangeDetectorRef } from '@angular/core';

export class ChangeDetectorRefDouble implements ChangeDetectorRef {
  markForCheck(): void {}
  detach(): void {}
  detectChanges(): void {}
  checkNoChanges(): void {}
  reattach(): void {}
}
