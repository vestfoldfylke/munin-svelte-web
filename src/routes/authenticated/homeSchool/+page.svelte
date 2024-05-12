<script>
    import Testcomp from '$lib/components/Testcomp.svelte'; 
    import { openAiSimpleChat, openAiAssistant, noraChat, visionOpenAi } from '$lib/services/openAiTools';

    const params = {
        "message": "",
        "kontekst": "",
        "valgtModell": "option1"
    }

    let respons = "Her kommer svaret fra Hugin...";


    function modellValg(event) {
        params.valgtModell = event.target.value;
        console.log("Hællæ");
    }

    async function minFunksjon() {
        if (params.valgtModell === "option1") {
            let r = await openAiSimpleChat(params);
            respons = r;
        } else if (params.valgtModell === "option2") {
            console.log(params);
            let r = await openAiSimpleChat(params);
            respons = r;
        } else if (params.valgtModell === "option3") {
            console.log(params);
            let r = await noraChat(params);
            respons = r;
        } else if (params.valgtModell === "option4") {
            console.log(params);
            let r = await openAiAssistant(params);
            respons = r;
        } else if (params.valgtModell === "option5") {
            console.log(params);
            let r = await visionOpenAi(params);
            respons = r;
        }
    }
</script>
<div class="right">
    <select on:change={modellValg}>
        <option value="option1" default>GPT 3.5</option>
        <option value="option2">GPT4</option>
        <option value="option3">Nora</option>
        <option value="option4">Matematikkens byggesteiner</option>
        <option value="option5">Vision</option>
    </select>

    <div class="boxy">
        <textarea placeholder="Her kan du skrive innhold som er relevant for modellen. F.eks. kontekt eller url."  bind:value={params.kontekst} rows="4" cols="50"></textarea>
    </div>
</div>


<div class="container center">
    <div class="output">
        { respons }

    </div>
    <form role="search">
        <input name="askHugin" type="text" autocomplete="off" placeholder="Spør Hugin" bind:value={ params.message }/>
        <input type="submit" on:click={minFunksjon} value="Spør Hugin" />
    </form>
</div>



<style>

.boxy {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
}

.center {
    float: left;
    width: 50%;
    margin-left: 100px;
}

.output {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    height: auto;
}

.right {
    float: right;
    width: 30%;
    padding: 10px;
    margin-right: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
}

</style>


