<script>
  export let primary;
  export let secondary;
  export let ghost;
  export let hover;
</script>

<style lang="scss">
    @import "../theme.scss";

    .hover {
        color: rgb(84, 110, 157);
    }

    .button {
        width: 100%;
        &:hover {
            @extend .hover;
        }
    }

    .primary-hover {
        color: red;
    }

    .primary {
        border-radius: 30px;
        height: 48px;
        padding: 0 30px !important;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #444444;
        font-weight: bold;
        background: rgb(143, 238, 245);
        background: linear-gradient(
                90deg,
                rgba(143, 238, 245, 1) 0%,
                rgba(127, 228, 235, 1) 50%,
                rgba(110, 216, 224, 1) 100%
        );
        &:hover, &.hover {
            @extend .primary-hover;
        }
    }
</style>

<button class:primary class:hover class="button"><slot/></button>

