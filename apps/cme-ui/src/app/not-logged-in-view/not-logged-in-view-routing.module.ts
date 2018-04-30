import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotLoggedInViewComponent } from './not-logged-in-view.component';

const routes: Routes = [{ path: '', component: NotLoggedInViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotLoggedInViewRoutingModule {}
