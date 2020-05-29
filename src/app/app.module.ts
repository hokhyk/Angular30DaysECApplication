import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ErrorHandler } from './error-handler';
import { ErrorLogHandler } from './error-log-handler';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {provide: ErrorHandler, useClass: ErrorLogHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
