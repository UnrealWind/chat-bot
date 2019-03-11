import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntelligentGuidancePage } from './intelligent-guidance';
import { ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    IntelligentGuidancePage,
  ],
  imports: [
    IonicPageModule.forChild(IntelligentGuidancePage),
    ComponentsModule
  ]
})
export class IntelligentGuidancePageModule {}
