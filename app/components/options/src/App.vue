<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
    <div>
      <button class="ui twitter button">
        <i class="twitter icon"></i>
        Twitter
      </button>
    </div>
  </div>
</template>

<style lang="scss">
  @import "./styles/main.scss";
  @import "./vendor/fomantic/semantic.css";
</style>
