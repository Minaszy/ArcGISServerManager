import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/waterfaceAnimation' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'water', loadChildren: () => import('./pages/water-face/water-face.module').then(m => m.WaterFaceModule) },
  { path: 'waterfaceAnimation', loadChildren: () => import('./pages/waterface-animation/waterface-animation.module').then(m => m.WaterfaceAnimationModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
