<template>
  <RouterView />
</template>
<style global>
body::-webkit-scrollbar {
  width: 12px; /* width of the entire scrollbar */
}

body::-webkit-scrollbar-track {
  background: #ffbf00; /* color of the tracking area */
}

body::-webkit-scrollbar-thumb {
  background-color: purple; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
  border: 3px solid darkviolet; /* creates padding around scroll thumb */
}
.router-link-exact-active {
  color: #ffbf00 !important;
  border-bottom: 2px solid #ffbf00;
  @apply shadow-lg;
}
</style>
