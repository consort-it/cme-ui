import { Component, OnInit } from '@angular/core';
import { MetadataProject } from '@cme2/core-services';

@Component({
  selector: 'cme-person-edit-show-case',
  templateUrl: './person-edit-show-case.component.html',
  styleUrls: ['./person-edit-show-case.component.scss']
})
export class PersonEditShowCaseComponent implements OnInit {
  public project: MetadataProject = {
    phases: [],
    name: 'project',
    id: 'foo',
    team: [
      { name: 'maec', email: 'a@b.de', roles: ['Developer', 'Operations'] },
      { name: 'rahu', email: 'a@b.de', roles: ['Product Owner'] }
    ]
  };
  public roles: string[] = ['Developer', 'Product Owner'];
  public name = 'John Doe';
  public email = 'John@doe.com';
  constructor() {}

  ngOnInit() {}
}
