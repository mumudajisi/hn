<template>
    <div class="col">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "Col",
};
</script>

<style lang="scss" scoped>
.col {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
</style>
