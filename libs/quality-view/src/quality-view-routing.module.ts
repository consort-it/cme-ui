import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QualityViewComponent } from './quality-view.component';

const routes: Routes = [
  {
    path: '',
    component: QualityViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityViewRoutingModule {}
