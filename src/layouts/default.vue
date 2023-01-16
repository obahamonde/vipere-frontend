<template>
  <VApp app>
    <VAppBar app clipped-left color="primary" dark>
      <VToolbarTitle
        text-amber
        cp
        font-script
        text-2xl
        mx-4
        @click.stop="$router.push('/')"
        >Vipère</VToolbarTitle
      >
    </VAppBar>
    <VMain>
      <SideBar />
      <RouterView ml-20 />
      <Auth />
    </VMain>
  </VApp>
</template>
