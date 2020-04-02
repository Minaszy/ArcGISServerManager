import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WaterFaceRoutingModule } from './water-face-routing.module';

import { WaterFaceComponent } from './water-face.component';


@NgModule({
  imports: [
    CommonModule, WaterFaceRoutingModule, NgZorroAntdModule, FormsModule, ReactiveFormsModule],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  declarations: [WaterFaceComponent],
  exports: [WaterFaceComponent]
})
export class WaterFaceModule { }
