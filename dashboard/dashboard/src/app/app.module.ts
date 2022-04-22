import { NgModule , LOCALE_ID} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DjsComponent } from './djs/djs.component';
import { CustomerComponent } from './customer/customer.component';
import { ClockComponent } from './clock/clock.component';
import { BannerComponent } from './banner/banner.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { OkdialogComponent } from './okdialog/okdialog.component';
import { CostsComponent } from './costs/costs.component';

@NgModule({
  declarations: [
    AppComponent,
    DjsComponent,
    CustomerComponent,
    ClockComponent,
    BannerComponent,
    IntroductionComponent,
    OkdialogComponent,
    CostsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'de'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
