import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NB_AUTH_TOKEN_WRAPPER_TOKEN, NbAuthModule, NbEmailPassAuthProvider} from '@nebular/auth';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { DataModule } from './data/data.module';
import { AnalyticsService } from './utils/analytics.service';
import { MessageService } from './utils/message.service';
import { DeviceModule } from './device/device.module';
import {UtilsModule} from './utils/utils.module';
import {PagerService} from './data/pager.service';
import {UiModule} from './ui/ui.module';
import {AuthSessionToken} from './data/security/auth-session-token';
import {CacheModule} from './cache/cache.module';

const NB_CORE_PROVIDERS = [
  ...DataModule.forRoot().providers,
  ...DeviceModule.forRoot().providers,
  ...UtilsModule.forRoot().providers,
  ...CacheModule.forRoot().providers,
  ...NbAuthModule.forRoot({
    providers: {
        email: {
          service: NbEmailPassAuthProvider,
          config: {
            login: {
              endpoint: '/rest/market/staff/login',
              redirect: {
                success: '/',
                failure: null,
              },
            },
            logout: {
              alwaysFail: false,
              endpoint: '/rest/logout',
              method: 'get',
              redirect: {
                success: '/',
                failure: null,
              },
              defaultErrors: ['Something went wrong, please try again.'],
              defaultMessages: ['You have been successfully logged out.'],
            },
            token: {
              getter(module, res) {
                return JSON.stringify(res.body);
              },
            },
          },
        },
    },
  }).providers,
  {provide: NB_AUTH_TOKEN_WRAPPER_TOKEN, useClass: AuthSessionToken},
  AnalyticsService,
  MessageService,
  PagerService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    UiModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
