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
        box-shadow: 0 0 0 5px #e74a8e25;
        color: #fff;
    }

    .primary {
        transition: .15s;
        border-radius: 30px;
        height: 48px;
        padding: 0 30px !important;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-weight: bold;
        background: rgb(143, 238, 245);
        background: linear-gradient(90deg,  #fa7900 0%, #df36b4 43%, #0063ea 77%, #00eaaf 100%);
        &:hover, &.hover {
            @extend .primary-hover;
        }
    }
</style>

<button class:primary class:hover class="{$$props.class} button"><slot/></button>

