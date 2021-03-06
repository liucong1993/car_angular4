import {Component, NgModule, Pipe} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeModule} from '../../@theme/theme.module';
import {IcCardComponent} from './ic-card.component';
import { IcCardRoutingModule } from './ic-card-routing.module';
import {RechargeKeepComponent} from './recharge-keep/recharge-keep.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {TransferAccountsComponent} from './transfer-accounts/transfer-accounts.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import {CardManageComponent} from './card-manage/card-manage.component';
import {HttpModule} from '@angular/http';
import {UiTableModule} from '../../@core/ui/table/table.module';
import {RouterModule} from '@angular/router';
import { RefundComponent } from './refund/refund.component';
import { RechargeRecordComponent } from './recharge-record/recharge-record.component';
import {UiModule} from '../../@core/ui/ui.module';
import { RechargeCancelComponent } from './recharge-cancel/recharge-cancel.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
// import Direction = L.Direction;

export const components = [
  IcCardComponent,
  RechargeKeepComponent,
  RechargeRecordComponent,
  RechargeCancelComponent,
  PasswordResetComponent,
  TransferAccountsComponent,
  RefundComponent,
  CardManageComponent,
];
@NgModule({
  imports: [
    ThemeModule,
    IcCardRoutingModule,
    HttpModule,
    CommonModule,
    UiTableModule,
    RouterModule,
    UiModule,
  ],
  declarations: [
    ...components,
    PasswordResetComponent,
    TransferAccountsComponent,
    PrintInvoiceComponent,
    CardManageComponent,
    RefundComponent,
    RechargeRecordComponent,
    RechargeCancelComponent,
    PasswordChangeComponent,
  ],
})
export class IcCardModule { }
