import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DjformComponent } from './djform/djform.component';
import { MainviewComponent } from './mainview/mainview.component';

const routes: Routes = [
  { path: '', component: MainviewComponent },
  { path: 'admin', component: DjformComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
