import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CostViewComponent } from './cost-view.component';

const routes: Routes = [
  {
    path: '',
    component: CostViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostViewRoutingModule {}
