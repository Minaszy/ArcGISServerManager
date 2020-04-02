import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaterFaceComponent } from './water-face.component';

const routes: Routes = [
  { path: '', component: WaterFaceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaterFaceRoutingModule { }
