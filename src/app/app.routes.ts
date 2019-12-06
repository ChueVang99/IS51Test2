import { Routes, RouterModule } from '@angular/router';
import { TestScoreComponent } from './test-score/test-score.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  {
    path: '',
    component: TestScoreComponent
  }, {
    path: 'home',
    component: HomeComponent
  }, {
    path: 'my-tests',
    component: TestScoreComponent
  }, {
    path: '**',
    component: TestScoreComponent
  }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
