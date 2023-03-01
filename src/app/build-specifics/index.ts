import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

export const buildSpecificModules = [
  StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
];