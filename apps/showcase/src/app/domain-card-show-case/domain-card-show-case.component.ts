import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { LogService } from '@cme2/logging';

export interface PropertyInfoMock {
  name: string;
  type: string;
  isArray: boolean;
  isRequired: boolean;
}

@Component({
  selector: 'cme-domain-card-show-case',
  templateUrl: './domain-card-show-case.component.html',
  styleUrls: ['./domain-card-show-case.component.scss']
})
export class DomainCardShowCaseComponent {
  public nameList: string[] = [
    'lorem_ipsum',
    'dolor_sit_amet',
    'consetetur_sadipscing',
    'elitr_sed',
    'diam_nonumy',
    'stet',
    'clita_kasd',
    'gubergren',
    'no_sea'
  ];
  public iconList: string[] = ['book', 'favorite', 'android', 'drafts', 'cloud'];
  public colorList: string[] = ['blue', 'red', 'yellow', 'grey'];
  public booleanList: boolean[] = [true, false];
  public counterList: number[] = [3, 4, 5, 6, 7, 8];

  public properties: PropertyInfoMock[] = [];

  public domainModel = {
    id: '1',
    name: this.getRandomFromArray(this.nameList),
    serviceName: this.getRandomFromArray(this.nameList),
    iconName: this.getRandomFromArray(this.iconList),
    headerColor: this.getRandomFromArray(this.colorList),
    properties: this.properties
  };

  constructor(private logger: LogService) {
    for (let count = 0; count < this.getRandomFromArray(this.counterList); count++) {
      this.properties.push({
        name: this.getRandomFromArray(this.nameList),
        type: this.getRandomFromArray(this.nameList),
        isArray: this.getRandomFromArray(this.booleanList),
        isRequired: this.getRandomFromArray(this.booleanList)
      });
    }
  }

  getRandomFromArray(arr: any[]): any {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
