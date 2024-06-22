<script>
    import { multimodalOpenAi, noraChat, openAiAssistant } from '$lib/services/openAiTools';
    import { modelinfo } from '$lib/data/modelinfo'; // Tekstbeskrivelser om valgt modell
    import ChatBlobs from '$lib/components/ChatBlobs.svelte'; // Komponent for å vise chatmeldinger
    // import ChatMessage from '../../lib/components/ChatMessage.svelte'; // Komponent for å vise chatmeldinger alt 2
    // import InputElement from '$lib/components/InputElement.svelte';
    import '@material/web/button/elevated-button';
    // import '@material/web/textfield/filled-text-field';
    import { onMount, afterUpdate } from 'svelte';

    // Modell-parametere og payload
    const userParams = {
        "message": "",
        "assistant_id": "",
        "messageHistory": [],
        "kontekst": "",
        "valgtModell": "option1", // Default modell GPT-4o
        "base64String": "",
        "temperatur": 0.7 // Default temperatur
    }

    // Variabler for håndtering av data og innhold
    let outputElement;
    let tekstFraPdf = ""; // Brukes ikke....
    let selectedFiles = [];
    let respons = "Velkommen til Hugin! Hva kan jeg hjelpe deg med i dag?";
    let infoBox = modelinfo[userParams.valgtModell].description;

    // Fester scroll til bunnen av chatvinduet
    function scrollToBottom() {
        outputElement.scrollTop = outputElement.scrollHeight;
    }

    // Håndterer valg av modell og oppdaterere modellinformasjon på siden
    function valgtModell(event) {
        userParams.valgtModell = event.target.value;
        infoBox = modelinfo[userParams.valgtModell].description;
    }

    // Kaller på riktig modell basert på brukerens valg
    async function brukervalg() {
        if (userParams.valgtModell === "option1") {
            userParams.messageHistory.push({"role": "user", "content": userParams.message});
            userParams.message = ""; // Nullstiller inputfeltet
            respons = await multimodalOpenAi(userParams);
            userParams.messageHistory.push( {"role": "assistant", "content": respons});
            userParams.message = ""; // Trenger denne for å oppdatere feltet etter respons?? Sjekk denne
        } else if (userParams.valgtModell === "option2") {
            console.log(userParams);
            let r = await noraChat(userParams);
            respons = r;
        } else if (userParams.valgtModell === "option3") {
            userParams.messageHistory.push({"role": "user", "content": userParams.message});
            userParams.base64String = ""; // Nullstiller inputfeltet
            respons = await openAiAssistant(userParams);
            userParams.messageHistory.push( {"role": "assistant", "content": respons});
            userParams.message = ""; // Trenger denne for å oppdatere feltet etter respons?? Sjekk denne
          }
        }

    // Konverterer opplastet fil til base64
    function handleFileSelect() {
        const file = selectedFiles[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result.startsWith("data:image")){
                console.log("Bilde");
                userParams.base64String = reader.result;
            } else if (reader.result.startsWith("data:application/pdf")){
                console.log("pdf");
                console.log(tekstFraPdf);
                console.log(askPdf(userParams.base64String));
            } else {
                console.log("Noe andre greier");
                userParams.base64String = "";
            }
            // userParams.base64String = reader.result;
            // console.log(reader.result);
        };
        reader.readAsDataURL(file);
        }
    }

    // Sørger for at chatvinduet scroller til bunnen ved oppdatering
    // onMount(scrollToBottom);
    afterUpdate(scrollToBottom);

</script>

<div class="right">
  <select class="modellSelect" on:change={valgtModell}>
    <option value="option1" default>GPT-4o</option>
    <option value="option2">Nora</option>
    <option value="option3">Matematikkens byggesteiner</option>
  </select>

  <!-- Her kan vi legge til en kontekstvelger for brukeren
  <select class="kontekstSelect" on:change={}>
    <option value="option1" default>Ingen kontekst</option>
    <option value="option2">Pythoneksperten</option>
    <option value="option3">Norsklæreren</option>
  </select>
  -->

  <div class="boxy" id="testBox">
    <h3>Informasjon om KI-modellen</h3>
    <p class="infoBoxText">{infoBox}</p>

    <textarea placeholder="Her kan du legge inn kontekst til språkmodellen." bind:value={ userParams.kontekst } rows="4" cols="auto" ></textarea>
  </div>
  <label for="temperatur">Temperatur: </label>
  <input type="range" id="temperatur" name="temperatur" min="0" max="2" step="0.1" bind:value={userParams.temperatur} />
  {userParams.temperatur}
</div>

<div class="container center">
  
  <div class="output" bind:this={outputElement}>
    {#await respons}
      <p>Laster...</p>
    {:then resultat}
      <img src={userParams.base64String} class="uploadedImage" alt="" />
      {#each userParams.messageHistory as chatMessage}
        <ChatBlobs role={chatMessage.role} content={chatMessage.content} />
      {/each}
    {:catch error}
      <p>{error.message}</p>
    {/await}
  </div>

  <input name="askHugin" type="text" autocomplete="off" placeholder="Spør Hugin" size="50" bind:value={userParams.message} />
  <input class="sendButton" type="button" on:click={brukervalg} value="Spør Hugin" />
  <input type="file" bind:files={selectedFiles} on:change={handleFileSelect} accept=".jpg, .jpeg, .png, .bmp"/>
</div>



<style>
  textarea {
    padding: 10px;
    display: block;
    width: 100%;
    overflow: hidden;
    resize: both;
    min-height: 40px;
    line-height: 20px;
  }

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

  .infoBoxText {
    padding: auto;
  }

  .center {
    float: left;
    width: 60%;
    margin-left: 50px;
  }

  .output {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    height: 600px;
    overflow-y: scroll;
  }

  .right {
    float: right;
    width: 30%;
    padding: 10px;
    margin-right: 80px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  .sendButton {
    padding: 10px;
    margin-top: 10px;
    background-color: var(--gress-10);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: black;

  }

</style>
