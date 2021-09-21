<script>
  export let primary = false;
  export let secondary = false;
  export let ghost = false;
  export let hover = false;
</script>

<style lang="scss">
    @import "../theme.scss";

    .button {
        width: 100%;
    }

    .primary-hover {
        box-shadow: $button--primary--hover--box-shadow;
    }

    .primary {
        transition: $button--primary--transition--time;
        color: $button--primary--color;
        font-weight: $button--primary--font-weight;
        background: $button--primary--background--gradient-1;
        background: $button--primary--background--gradient-2;
        &:hover, &.hover {
            @extend .primary-hover;
        }
    }
</style>

<button on:click class:primary class:hover class="h-12 px-8 rounded-3xl button flex justify-center items-center {$$props.class || ''}"><slot/></button>

