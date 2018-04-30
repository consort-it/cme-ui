import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainAreaComponent } from './main-area.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavigationModule } from './navigation/navigation.module';
import { MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, MatSidenavModule, NavigationModule, MatButtonModule, MatIconModule],
  declarations: [MainAreaComponent],
  exports: [MainAreaComponent]
})
export class MainAreaModule {}
