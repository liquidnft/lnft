<script>
  export let primary = false;
  export let secondary = false;
  export let ghost = false;
  export let ghostWhite = false;
  export let hover = false;
  export let disabled = false;
  export let type = 'button';
</script>

<style lang="scss">
    @import "../theme.scss";

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

    .ghostWhite-hover {
        border: $button--ghost-white--hover--border;
    }

    .ghostWhite-disabled {
        color: $button--ghost-white--disabled--color;
    }

    .ghostWhite-disabled-hover {
        color: $button--ghost-white--disabled--hover--color;
    }


    .ghostWhite {
        transition: $button--ghost-white--transition--time;
        color: $button--ghost-white--color;
        font-weight: $button--ghost-white--font-weight;
        background: $button--ghost-white--background;
        border: $button--ghost-white--border;
        &:hover, &.hover {
            @extend .ghostWhite-hover;
        }
        &:disabled, &.disabled {
            @extend .ghostWhite-disabled;
            cursor: $button--ghost-white--disabled--cursor;
            border-color: $button--ghost-white--disabled--border-color;
            &:hover {
                @extend .ghostWhite-disabled-hover;
                color: $button--ghost-white--disabled--hover--color;
                border-color: $button--ghost-white--disabled--hover--border-color;
            }
        }
    }
</style>

<button {type} {disabled} on:click class:ghostWhite class:primary class:hover class="w-auto h-12 px-8 rounded-3xl button flex justify-center items-center {$$props.class || ''}"><slot/></button>

