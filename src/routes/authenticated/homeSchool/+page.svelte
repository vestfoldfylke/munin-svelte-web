<script>
    import { openAiSimpleChat } from '$lib/services/openAiTools';
    let spm = "";
    let respons = "Her kommer det svar fra Hugin";

    async function minFunksjon() {
        respons = await openAiSimpleChat(spm);
        return await openAiSimpleChat(spm);
    }
</script>

<div class="container center">
    <div class="output">
        { respons }

    </div>
    <form role="search">
        <input name="askHugin" type="text" placeholder="Spør Hugin" bind:value={spm}/>
        <input type="submit" on:click={ minFunksjon } value="Spør Hugin" />
    </form>
</div>


<style>

.center {
  /* padding: 200px 10px; */
}

.output {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

</style>


