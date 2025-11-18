import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },

  // === PÁGINAS PÚBLICAS (Pantalla Completa) ===
  {
    path: 'landing',
    loadComponent: () => import('./pages/public/landing/landing.page').then( m => m.LandingPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'guest-catalog', // <--- NUEVA RUTA PÚBLICA
    loadComponent: () => import('./pages/user/home/home.page').then( m => m.HomePage)
  },
  {
    // Detalle del plan (fuera de tabs para que ocupe toda la pantalla)
    path: 'plan-detail/:id',
    loadComponent: () => import('./pages/public/plan-detail/plan-detail.page').then( m => m.PlanDetailPage)
  },

  // === RUTAS CON TABS (Menú Inferior) ===
  // Todas las páginas que quieres que muestren la barra inferior van AQUÍ DENTRO
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then( m => m.TabsPage),
    canActivate: [AuthGuard], // Protege el acceso a todo el bloque de tabs
    children: [
      // --- TABS DE USUARIO ---
      {
        path: 'home',
        loadComponent: () => import('./pages/user/home/home.page').then( m => m.HomePage)
      },
      {
        path: 'my-plans',
        loadComponent: () => import('./pages/user/my-plans/my-plans.page').then( m => m.MyPlansPage)
      },
      {
        path: 'chat-user',
        loadComponent: () => import('./pages/user/chat-user/chat-user.page').then( m => m.ChatUserPage)
      },
      
      // --- TABS DE ASESOR ---
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.page').then( m => m.DashboardPage),
        canActivate: [RoleGuard]
      },
      {
        path: 'requests',
        loadComponent: () => import('./pages/admin/requests/requests.page').then( m => m.RequestsPage),
        canActivate: [RoleGuard]
      },
      {
        path: 'chat-list',
        loadComponent: () => import('./pages/admin/chat-list/chat-list.page').then( m => m.ChatListPage),
        canActivate: [RoleGuard]
      },
      
      // --- TAB COMÚN ---
      {
        path: 'profile',
        loadComponent: () => import('./pages/common/profile/profile.page').then( m => m.ProfilePage)
      },
      
      // Redirección por defecto dentro de /tabs/
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },

  // === PÁGINAS AUXILIARES DE ADMIN (Pantalla Completa) ===
  // Estas no necesitan la barra de tabs, así que van fuera
  {
    path: 'manage-plan',
    loadComponent: () => import('./pages/admin/manage-plan/manage-plan.page').then( m => m.ManagePlanPage),
    canActivate: [AuthGuard, RoleGuard]
  },
  {
    path: 'chat-admin/:id',
    loadComponent: () => import('./pages/admin/chat-admin/chat-admin.page').then( m => m.ChatAdminPage),
    canActivate: [AuthGuard, RoleGuard]
  },
];