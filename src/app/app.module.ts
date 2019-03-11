import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule ,DeepLinkConfig} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import { LocationStrategy,PathLocationStrategy} from '@angular/common';

import { Interceptor} from "../providers/http-interceptor/http-interceptor";
import { NotifyModule } from 'ngx-notify';

import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { PageErrorPage} from "../pages/page-error/page-error";
import { IntelligentGuidancePage } from "../pages/intelligent-guidance/intelligent-guidance";


//默认配置文件
import { ConstantProvider } from '../providers/constant/constant';

//以前写的有问题，应该在这里增加子页面的module
import {PageErrorPageModule} from "../pages/page-error/page-error.module";
import {IntelligentGuidancePageModule} from "../pages/intelligent-guidance/intelligent-guidance.module";
import { ChatBotProvider } from '../providers/chat-bot/chat-bot';
import {IntelligentSearchPage} from "../pages/intelligent-search/intelligent-search";
import {IntelligentSearchPageModule} from "../pages/intelligent-search/intelligent-search.module";

//这里配置的是需要对外暴露url访问模式的地方


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      menuType: 'push',
      iconMode: 'ios',//安卓icon强制使用ios的icon以及样式
      mode: 'ios',//样式强制使用ios样式
    }),
    NotifyModule.forRoot({
      options: { },
      notify: {
        progress: true
      }
    }),
    HttpClientModule,
    PageErrorPageModule,
    IntelligentGuidancePageModule,
    IntelligentSearchPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    PageErrorPage,
    IntelligentGuidancePage,
    IntelligentSearchPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true},
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    ConstantProvider,
    ChatBotProvider
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {

}
