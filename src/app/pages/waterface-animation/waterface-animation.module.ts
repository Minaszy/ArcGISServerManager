import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WaterfaceAnimationRoutingModule } from './waterface-animation-routing.module';

import { WaterfaceAnimationComponent } from './waterface-animation.component';


@NgModule({
  imports: [
    CommonModule, WaterfaceAnimationRoutingModule, NgZorroAntdModule, FormsModule, ReactiveFormsModule],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  declarations: [WaterfaceAnimationComponent],
  exports: [WaterfaceAnimationComponent]
})
export class WaterfaceAnimationModule { }
