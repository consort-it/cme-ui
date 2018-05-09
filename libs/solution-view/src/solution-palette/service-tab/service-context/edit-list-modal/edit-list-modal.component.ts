import { Component, OnInit, Inject } from '@angular/core';
import { MatChipInputEvent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'cme-edit-list-modal',
  templateUrl: './edit-list-modal.component.html',
  styleUrls: ['./edit-list-modal.component.scss']
})
export class EditListModalComponent implements OnInit {
  readonly visible: boolean = true;
  readonly selectable: boolean = true;
  readonly removable: boolean = true;
  readonly addOnBlur: boolean = true;
  readonly separatorKeysCodes = [ENTER, COMMA];

  readonly values: string[] = [];

  constructor(private dialogRef: MatDialogRef<EditListModalComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    if (data.initialValues && data.initialValues.length > 0) {
      this.values.push(...data.initialValues);
    }
  }

  get titleKey(): string {
    return this.data.titleKey || '';
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.values.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(value: string): void {
    const index = this.values.indexOf(value);

    if (index >= 0) {
      this.values.splice(index, 1);
    }
  }

  onSave() {
    this.dialogRef.close(this.values.join(','));
  }

  onCancel() {
    this.dialogRef.close();
  }

  ngOnInit() {}
}
