import { Input, Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
  // tslint:disable:max-line-length directive-selector
  selector: '[unique]',
  providers: [{ provide: NG_VALIDATORS, useExisting: UniqueValueDirective, multi: true }]
})
export class UniqueValueDirective implements Validator {
  @Input() unique: any[] = [];

  validate(c: FormControl): { [key: string]: any } | null {
    if (c === undefined || c === null) {
      return null;
    }

    if (c.value === null || c.value === undefined) {
      return null;
    }

    if (!this.unique) {
      return null;
    }

    // behavior for type string
    if (typeof c.value === 'string') {
      const valueString = c.value.toLowerCase().trim();
      const filteredString = this.unique.filter(v => v.toLowerCase() === valueString);
      if (filteredString.length !== 0) {
        return { unique: true };
      }
      return null;
    }

    // behavior for type any
    const filtered = this.unique.filter(v => v === c.value);
    if (filtered.length !== 0) {
      return { unique: true };
    }

    return null;
  }
}
