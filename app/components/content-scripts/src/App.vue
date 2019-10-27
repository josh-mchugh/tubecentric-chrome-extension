<template>
  <div id="tc-app">
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

<style scoped lang="scss">
  @import url("./styles/main.scss");
  @import url('~fomantic/semantic.min.css');
</style>