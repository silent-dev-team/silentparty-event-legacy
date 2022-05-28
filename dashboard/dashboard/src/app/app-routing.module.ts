import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerformComponent } from './bannerform/bannerform.component';
import { DjformComponent } from './djform/djform.component';
import { MainviewComponent } from './mainview/mainview.component';
import { BarComponent } from './bar/bar.component';
import { IntroComponent } from './intro/intro.component';


const routes: Routes = [
  { path: '', component: MainviewComponent },
  { path: 'djs', component: DjformComponent },
  { path: 'banner', component: BannerformComponent },
{ path: 'bar', component: BarComponent },
{ path: 'intro', component: IntroComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
