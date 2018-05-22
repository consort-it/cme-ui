import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { materialIcons } from './icon-names';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'cme-icon-name',
  templateUrl: './icon-name.component.html',
  styleUrls: ['./icon-name.component.scss']
})
export class IconNameComponent implements OnInit, OnDestroy {
  readonly iconNames: string[] = materialIcons;

  private _currentIconName: string | undefined;

  private _iconSelected$$ = new Subject<string>();

  private _subscription = Subscription.EMPTY;

  @Input()
  set currentIconName(value: string | undefined) {
    this._currentIconName = value;
    this.iconNameControl.setValue(this.currentIconName);
  }

  get currentIconName(): string | undefined {
    return this._currentIconName;
  }

  @Output() selectIconName = new EventEmitter<string>();

  iconNameControl = new FormControl('', this.validateIconName.bind(this));

  filteredIconNames: Observable<string[]> = of(this.iconNames);

  ngOnInit() {
    this.filteredIconNames = this.iconNameControl.valueChanges.pipe(
      startWith(''),
      map(val => this.filterIconName(val))
    );
    this._subscription = this._iconSelected$$
      .pipe(debounceTime(10))
      .subscribe(iconName => this.selectIconName.emit(iconName));
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  onOptionSelected(value: MatAutocompleteSelectedEvent) {
    this._iconSelected$$.next(value.option.value);
  }

  onBlur(value: string | undefined) {
    this._iconSelected$$.next(value);
  }

  private filterIconName(val: string | undefined): string[] {
    if (!val) {
      return this.iconNames;
    }
    return this.iconNames.filter(name => name.toLowerCase().includes(val.toLowerCase()));
  }

  private validateIconName(c: AbstractControl): ValidationErrors | null {
    const iconNames = this.iconNames || [];
    if (c.value === '' || c.value === undefined || c.value === null || iconNames.includes(c.value)) {
      return null;
    }
    return { invalidIconName: { value: c.value } };
  }
}
