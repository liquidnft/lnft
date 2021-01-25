<script>
  import Step1 from "./step1";
  import Step2 from "./step2";

  let step = 1;
  let next = () => step++;
</script>

{#if step === 1}
  <Step1 {next} />
{:else}
  <Step2 />
{/if}
