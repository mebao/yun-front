import { BrowserModule }                  from '@angular/platform-browser';
// import { BrowserAnimationsModule }         from '@angular/platform-browser/animations';
import { NgModule }                       from '@angular/core';
import { FormsModule }                    from '@angular/forms';
import { HttpModule }                     from '@angular/http';

import { AppComponent }                   from './app.component';

import { AppRoutingModule }               from './app-routing.module';
import { AdminModule }                    from './admin/admin.module';
import { AuthGuard }                      from './auth-guard.service';
import { AuthService }                    from './auth.service';

import { LoginRoutingModule }             from './admin/login/login-routing.module';
import { LoginComponent }                 from './admin/login/login.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
	],
	imports: [
		BrowserModule,
		// BrowserAnimationsModule,
		FormsModule,
		HttpModule,
		AppRoutingModule,
		AdminModule,
		LoginRoutingModule,
	],
	providers: [
		AuthGuard,
		AuthService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
