import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from "./app.routes";

//componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  declarations: [
  ],
  imports: [
    AppComponent,
    BrowserModule,
    RegisterComponent,
    LoginComponent,
    AppRoutingModule,
  ],
  providers:[],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: []
})

export class AppModule {}
