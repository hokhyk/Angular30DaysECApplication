import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ErrorHandler } from './error-handler';
import { ErrorLogHandler } from './error-log-handler';

import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';


export function initData(httpClient: HttpClient) {
  // 假設有個 API 包含了基本的設定
  return () => httpClient.get('https://jsonplaceholder.typicode.com/todos/').toPromise();
}

import { InjectionToken } from '@angular/core';
export interface Config {
  LogLevel: string
}

// 替 interface 產生一個 token
// 參數的字串只是一個描述
export const CONFIG_TOKEN = new InjectionToken<Config>('config token');
// 基礎型別也不是問題
export const NAME_TOKEN = new InjectionToken<string>('name token');

const NEW_CONFIG_TOKEN = new InjectionToken<Config>('config token',
  {
    providedIn: 'root',
    factory: () => ({
      LogLevel: 'Error'
    })
  }
);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorLogHandler
    },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initData,
    //   deps: [HttpClient],
    //   multi: true
    // },
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => () => configService.initData(),
      deps: [ConfigService],
      multi: true
    },
    {
      provide: CONFIG_TOKEN,
      useValue: { LogLevel: 'Error' }
    },
    {
      provide: NAME_TOKEN,
      useValue: 'Mike'
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
