import { Router } from '@vaadin/router';

const routes = [
  {
    path: '/',
    component: 'home-page',
    action: async () => await import('../pages/home.js'),
  },
  {
    path: '/add',
    component: 'add-page',
    action: async () => await import('../pages/add.js'),
  },
  {
    path: '/edit/:id',
    component: 'edit-page',
    action: async () => await import('../pages/edit.js'),
  },
];

export const initRouter = () => {
  const outlet = document.querySelector('main');
  const router = new Router(outlet);
  router.setRoutes(routes);
  return router;
};
