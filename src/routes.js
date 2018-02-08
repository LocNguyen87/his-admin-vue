import DashView from './components/Dash.vue'
import LoginView from './components/Login.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import DashboardView from './components/views/Dashboard.vue'
import SettingView from './components/views/Setting.vue'
import AccessView from './components/views/Access.vue'
import ServerView from './components/views/Server.vue'
import RegistrationView from './components/views/Registration.vue'
import RegistrationDetailsView from './components/views/RegistrationDetails.vue'

// Routes
const routes = [{
  path: '/login',
  component: LoginView
}, {
  path: '/',
  component: DashView,
  children: [{
    path: 'dashboard',
    alias: '',
    component: DashboardView,
    name: 'Dashboard',
    meta: {
      description: 'Overview of environment',
      requiresAuth: true
    }
  }, {
    path: 'setting',
    component: SettingView,
    name: 'Settings',
    meta: {
      description: 'User settings page'
    }
  }, {
    path: 'access',
    component: AccessView,
    name: 'Access',
    meta: {
      description: 'Example of using maps'
    }
  }, {
    path: 'server',
    component: ServerView,
    name: 'Servers',
    meta: {
      description: 'List of our servers',
      requiresAuth: true
    }
  }, {
    path: 'registration',
    alias: '',
    component: RegistrationView,
    name: 'Registration',
    meta: {
      description: 'List of all registrations',
      requiresAuth: true
    }
  }, {
    path: 'registration/:id',
    alias: '',
    component: RegistrationDetailsView,
    name: 'details',
    meta: {
      description: 'Full details of registration',
      requiresAuth: true
    }
  }]
}, {
  // not found handler
  path: '*',
  component: NotFoundView
}]

export default routes
