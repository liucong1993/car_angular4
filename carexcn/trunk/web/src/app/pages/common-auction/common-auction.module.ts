import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {CommonAuctionRoutingModule, routedComponents} from './common-auction-routing.module';
import {ThemeModule} from '../../@theme/theme.module';
import {RouterModule} from '@angular/router';
import {UiTableModule} from '../../@core/ui/table/table.module';
import {HttpModule} from '@angular/http';
import {UiModule} from '../../@core/ui/ui.module';

@NgModule({
  imports: [
    ThemeModule,  /*标签*/
    CommonModule,
    CommonAuctionRoutingModule,
    UiTableModule,
    HttpModule,
    RouterModule,
    UiModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class CommonAuctionModule { }
