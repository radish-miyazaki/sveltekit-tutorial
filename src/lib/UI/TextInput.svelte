<script lang="ts">
  export let id: string;
  export let label: string;
  export let value: string;
  // OptionalProps
  export let controlType: string = null;
  export let rows: number = null;
  export let type: string = 'text';
  export let valid: boolean = true;
  export let validityMessage: string = "";

  let touched = false;
</script>

<style>
  input,
  textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: none;
    border-bottom: 2px solid #ccc;
    border-radius: 3px 3px 0 0;
    background: white;
    padding: 0.15rem 0.25rem;
    transition: border-color 0.1s ease-out;
  }

  input:focus,
  textarea:focus {
    border-color: #e40763;
    outline: none;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    width: 100%;
  }

  .form-control {
    padding: 0.5rem 0;
    width: 100%;
    margin: 0.25rem 0;
  }

  .invalid {
    border-color: red;
    background: #fde3e3;
  }

  .error-message {
    color: red;
    margin: 0.25rem 0;
  }

</style>

<div class="form-control">
  <label for={id}>{label}</label>
  {#if controlType === 'textarea'}
    <!-- textareaは必ずvalueが存在するため、bind:valueを用いることが出来る -->
    <textarea class:invalid={!valid && touched} {id} {rows} bind:value on:blur={() => touched = true}></textarea>
  {:else}
    <!-- inputはtypeによっては値を管理するのがvalueとは限らないので、bind:valueを用いることが出来ない -->
    <input class:invalid={!valid && touched} {type} {id} {value} on:input on:blur={() => touched = true} />
  {/if}
  {#if validityMessage && !valid && touched}
    <p class="error-message">{validityMessage}</p>
  {/if}
</div>