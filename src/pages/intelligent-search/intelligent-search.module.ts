import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntelligentSearchPage } from './intelligent-search';

@NgModule({
  declarations: [
    IntelligentSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(IntelligentSearchPage),
  ],
})
export class IntelligentSearchPageModule {}
