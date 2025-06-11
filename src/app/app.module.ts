import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { evalFunctions } from './evalFunctions';
import { MessageComponent } from './message/message.component';

@NgModule({
  declarations: [					
      AppComponent,
      MessageComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent],
  providers: [
    evalFunctions
  ]
})
export class AppModule { }
