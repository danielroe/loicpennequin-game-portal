/**
 * ---------------------
 * 🚗🚦 Generated by nuxt-typed-router. Do not modify !
 * ---------------------
 * */

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(nuxtApp => {
  const routesList = {
    authCallback: 'auth-callback',
    gameId: 'game-id',
    games: 'games',
    index: 'index',
    login: 'login'
  };

  return {
    provide: {
      typedRouter: nuxtApp.$router,
      routesList
    }
  };
});
