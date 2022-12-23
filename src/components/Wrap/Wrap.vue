<template>
    <div class="wrap">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "Wrap",
};
</script>

<style lang="scss" scoped>
.wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
