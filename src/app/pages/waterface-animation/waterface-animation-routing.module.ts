import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaterfaceAnimationComponent } from './waterface-animation.component';

const routes: Routes = [
  { path: '', component: WaterfaceAnimationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaterfaceAnimationRoutingModule { }
