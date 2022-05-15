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
import { HttpClientModule } from '@angular/common/http';
import { DjformComponent } from './djform/djform.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { MainviewComponent } from './mainview/mainview.component';

@NgModule({
  declarations: [
    AppComponent,
    DjsComponent,
    CustomerComponent,
    MainviewComponent,
    ClockComponent,
    BannerComponent,
    IntroductionComponent,
    OkdialogComponent,
    CostsComponent,
    DjformComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'de'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
