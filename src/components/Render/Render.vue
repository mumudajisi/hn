<script>
export default {
    name: "Render",
    props: {
        h: {
            type: [Function, Object],
            default: void 0
        },
        data: {
            type: Array,
            default: () => [],
        },
    },
    render(h) {
        return typeof this.h === "function" ? this.h(h, ...this.data) : this.h;
    },
};
</script>
