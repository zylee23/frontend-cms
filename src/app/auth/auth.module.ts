import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthPage } from './auth.page';
import { authReducer } from './store/auth.reducers';
import { AuthEffects } from './store/auth.effects';

const routes: Routes = [
  {
    path: '',
    component: AuthPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    // StoreModule.forFeature('auth', authReducer),
    // EffectsModule.forFeature([AuthEffects])
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {}