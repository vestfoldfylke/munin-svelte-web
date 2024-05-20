<script>
    import { multimodalOpenAi, noraChat, openAiAssistant, visionOpenAi } from '$lib/services/openAiTools';
    import SvelteMarkdown from 'svelte-markdown'
    import '@material/web/button/elevated-button';
    import '@material/web/textfield/filled-text-field';

    
    let selectedFiles = [];
    let respons = "Her kommer svaret fra Hugin...";
  
    const userParams = {
        "message": "",
        "messageHistory": [],
        "kontekst": "",
        "valgtModell": "option1", // Settes til default
        "base64String": ""
    }

    function valgtModell(event) {
        userParams.valgtModell = event.target.value;
        console.log("Hællæ");
    }

    // Kaller på riktig modell basert på brukerens valg
    async function brukervalg() {
        if (userParams.valgtModell === "option1") {
            userParams.messageHistory.push({"role": "user", "content": userParams.message});
            let r = await multimodalOpenAi(userParams);
            userParams.messageHistory.push( {"role": "assistant", "content": r});
            console.log(userParams);
            respons = r;
        } else if (userParams.valgtModell === "option2") {
            console.log(userParams);
            let r = await noraChat(userParams);
            respons = r;
        } else if (userParams.valgtModell === "option3") {
            console.log(userParams);
            let r = await openAiAssistant(userParams);
            respons = r;
        } else if (userParams.valgtModell === "option4") {
            console.log(userParams);
            let r = await visionOpenAi(userParams);
            respons = r;
        }
    }

    // Konverterer opplastet fil til base64
    function handleFileSelect() {
        console.log("Hællææææææ");
        const file = selectedFiles[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if ( reader.result.startsWith("data:image")){
                console.log("Bilde");
                userParams.base64String = reader.result;
            } else if ( reader.result.startsWith("data:application/pdf")){
                console.log("pdf");
            } else {
                console.log("Noe andre greier");
                userParams.base64String = "";
            }
            // userParams.base64String = reader.result;
            console.log(reader.result);
        };
        reader.readAsDataURL(file);
        }
    }
</script>

<div class="right">
    <select on:change={ valgtModell }>
        <option value="option1" default>GPT-4o</option>
        <option value="option2">Nora</option>
        <option value="option3">Matematikkens byggesteiner</option>
        <option value="option4">Vision</option>
    </select>

    <div class="boxy">
        <textarea placeholder="Her kan du skrive innhold som er relevant for modellen. F.eks. kontekt eller url."  bind:value={userParams.kontekst} rows="4" cols="50"></textarea>
    </div>
</div>

<div class="container center">
    <div class="output">
        <img class="uploadedImage" src={ userParams.base64String } alt="">
        <br>
            <SvelteMarkdown source={ respons } />
    </div>

    <input name="askHugin" type="text" autocomplete="off" placeholder="Spør Hugin" size="50" bind:value={ userParams.message }/>
    <input type="button" on:click={ brukervalg } value="Spør Hugin" />
    <input type="file" bind:files={ selectedFiles } on:change={ handleFileSelect } />
</div>


<style>

.uploadedImage {
    width: 400px;
    height: auto;
}

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


