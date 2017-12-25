import {UiTableModule} from './table/table.module';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CameraComponent} from './camera/camera.component';
import {CalendarModule, FileUploadModule, AutoCompleteModule, DropdownModule} from 'primeng/primeng';
import {CameraUploadComponent} from './camera/camera-upload.component';
import {CalendarComponent} from './calendar/calendar.component';
import {AutoinputComponent} from './autoinput/autoinput.component';
import { ValidErrorComponent } from './valid-error/valid-error.component';
import {CommonModule} from '@angular/common';
import { CodeitemDroplistComponent } from './codeitem-droplist/codeitem-droplist.component';
import { DroplistComponent } from './droplist/droplist.component';

const COMPONENTS = [
  CameraComponent,
  CameraUploadComponent,
  CalendarComponent,
  AutoinputComponent,
  ValidErrorComponent,
  CodeitemDroplistComponent,
  DroplistComponent,
];

@NgModule({
entryComponents: [],
  exports: [
    ...COMPONENTS,
    UiTableModule,
  ],
  imports: [
    CommonModule,
    FormsModule,
    UiTableModule,
    RouterModule,
    FileUploadModule,
    CalendarModule,
    AutoCompleteModule,
    DropdownModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
})
export class UiModule {
}
