import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {QueryCountRoutingModule, routedComponents} from './query-count-routing.module';
import {ThemeModule} from '../../@theme/theme.module';
import {RouterModule} from '@angular/router';
import {UiTableModule} from '../../@core/ui/table/table.module';
import {HttpModule} from '@angular/http';
import {UiModule} from '../../@core/ui/ui.module';
import {SystemModule as CoreSystemModule} from '../../@core/data/system/system.module';


@NgModule({
  imports: [
    ThemeModule,  /*标签*/
    CommonModule,
    QueryCountRoutingModule,
    UiTableModule,
    HttpModule,
    RouterModule,
    UiModule, /*日历*/
    CoreSystemModule,
  ],
  declarations: [...routedComponents],
})
export class QueryCountModule { }
