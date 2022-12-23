<template>
    <div class="main">
        <slot />
    </div>
</template>

<script>
export default {
    name: "Main",
};
</script>

<style lang="scss" scoped>
.main {
    overflow: auto;
    width: 100%;
    height: 100%;
}
</style>
