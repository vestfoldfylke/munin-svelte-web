<script>
    import { multimodalOpenAi, noraChat, openAiAssistant } from '$lib/services/openAiTools';
    import { modelinfo } from '$lib/data/modelinfo'; // Tekstbeskrivelser om valgt modell
    import ChatBlobs from '$lib/components/ChatBlobs.svelte'; // Komponent for å vise chatmeldinger
    // import GPT4o from '$lib/images/GPT4o.png'; // Bilde av valgt modell
    import ModelInfo from '../../lib/components/ModelInfo.svelte';
    import '@material/web/button/elevated-button';
    import { onMount, afterUpdate } from 'svelte';
    import { getHuginToken } from '../../lib/useApi';
    import IconSpinner from '../../lib/components/IconSpinner.svelte';

    // Modell-parametere og payload
    const userParams = {
        "message": "",
        "assistant_id": "",
        "messageHistory": [],
        "kontekst": "",
        "valgtModell": "option1", // Default modell GPT-4o
        "base64String": "",
        "temperatur": 0.7, // Default temperatur
        "synligKontekst": true,
    }

    // Variabler for håndtering av data og innhold i frontend
    let outputElement;
    let tekstFraPdf = ""; // Brukes ikke....
    let selectedFiles = [];
    let respons = `Velkommen til ${import.meta.env.VITE_APP_NAME}! Hva kan jeg hjelpe deg med i dag?`;
    let modelinfoModell = modelinfo[userParams.valgtModell].navn;
    let modelinfoBeskrivelse = modelinfo[userParams.valgtModell].description;
    let illustrasjonsbilde = modelinfo[userParams.valgtModell].illustrasjonsbilde;
    let modelTampering = false
    let advancedInteractions = false


    // Fester scroll til bunnen av chatvinduet
    function scrollToBottom() {
        outputElement.scrollTop = outputElement.scrollHeight;
    }

    // Håndterer valg av modell og oppdaterere modellinformasjon på siden
    function valgtModell(event) {
        userParams.valgtModell = event.target.value;
        modelinfoModell = modelinfo[userParams.valgtModell].navn;
        modelinfoBeskrivelse = modelinfo[userParams.valgtModell].description;
        userParams.synligKontekst = modelinfo[userParams.valgtModell].synligKontekst;

    }

    // Kaller på valgt modell med tilhørende parametre basert på brukerens valg
    async function brukervalg() {
        if (userParams.valgtModell === "option1") {
            userParams.messageHistory.push({"role": "user", "content": userParams.message});
            userParams.message = ""; // Nullstiller inputfeltet
            respons = await multimodalOpenAi(userParams);
            userParams.messageHistory.push( {"role": "assistant", "content": respons});
            userParams.message = ""; // Trenger denne for å oppdatere feltet etter respons?? Sjekk denne
        } else if (userParams.valgtModell === "option2") {
            console.log(userParams);
            userParams.synligKontekst = false;
            let r = await noraChat(userParams);
            respons = r;
        } else if (userParams.valgtModell === "option3") {
            userParams.messageHistory.push({"role": "user", "content": userParams.message});
            userParams.base64String = ""; // Nullstiller inputfeltet
            respons = await openAiAssistant(userParams);
            userParams.messageHistory.push( {"role": "assistant", "content": respons});
            userParams.message = ""; // Trenger denne for å oppdatere feltet etter respons?? Sjekk denne
          } else if (userParams.valgtModell === "option4") {
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

    const onKeyPress = async e => {
      if (e.charCode === 13) {
          // isEnterPressed = true
          scrollToBottom()
          brukervalg()
      }
    }

    // Sørger for at chatvinduet scroller til bunnen ved oppdatering
    // onMount(scrollToBottom);
    afterUpdate(scrollToBottom);

</script>

<main>
  {#await getHuginToken(true)}
    <div class="loading">
      <IconSpinner width={"32px"} />
    </div> 
  {:then token} 
  <!-- {console.log(token)} -->
    <div class="modelTampering">
      <div class="boxyHeader">
        <select class="modellSelect" on:change={valgtModell}>
          <option value="option1" default>GPT-4o</option>
          <option value="option2">Nora</option>
          <option value="option3">Matematikkens byggesteiner</option>
          <option value="option4">NDLA Religion</option>
        </select>
        
        <div class="showNhideBtns">
          {#if modelTampering}
            <button class="link" on:click={() => {modelTampering = !modelTampering}}><span class="material-symbols-outlined">keyboard_arrow_up</span></button>
          {:else}
            <button class="link" on:click={() => {modelTampering = !modelTampering}}><span class="material-symbols-outlined">keyboard_arrow_down</span></button>
          {/if}
        </div>
      </div>

      {#if modelTampering}
      <div class="boxy" id="testBox">
        <ModelInfo modelinfo={modelinfoModell} infoText={modelinfoBeskrivelse} />
        {#key userParams.synligKontekst}
        {#if userParams.synligKontekst}
          <textarea placeholder="Her kan du legge inn kontekst til språkmodellen." bind:value={ userParams.kontekst } rows="4" cols="auto"></textarea>
          <label for="temperatur">Temperatur: </label>
          <input type="range" id="temperatur" name="temperatur" min="0" max="2" step="0.1" bind:value={userParams.temperatur} />
          {userParams.temperatur}
        {/if}
        {/key}
      </div>
      {/if}
    </div>
    <div class="output" bind:this={outputElement}>
      {#await respons}
        <p>Laster...</p>
      {:then}
        <img src={userParams.base64String} class="uploadedImage" alt="" />
        {#each userParams.messageHistory as chatMessage}
          <ChatBlobs role={chatMessage.role} content={chatMessage.content} />
        {/each}
      {:catch error}
        <p>{error.message}</p>
      {/await}
    </div>
    {#if token.roles.includes("App.Admin")}
      {#if advancedInteractions}
        <div class="advancedInteractions">
          <label for="file-upload"><span class="material-symbols-outlined">upload_file</span></label>
          <input type="file" id="file-upload" bind:files={selectedFiles} on:change={handleFileSelect} accept=".jpg, .jpeg, .png, .bmp"/>
        </div>
      {/if}
    {/if}
    <div class="userInteractionField">
      <input name="askHugin" type="text" autocomplete="off" placeholder="Spør Hugin" size="50" bind:value={userParams.message} on:keypress={onKeyPress} />
      {#if token.roles.includes("App.Admin")}
        <button class="link" on:click={() => {advancedInteractions = !advancedInteractions}}><span class="material-symbols-outlined">settings</span></button>
      {/if}
      <input class="sendButton" type="button" on:click={brukervalg} on:keypress={onKeyPress} value="Spør Hugin" />
    </div>
  {/await}
</main>


<style>
  main {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    margin: 20px;
  }
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

  .boxyHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .boxy {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .material-symbols-outlined {
    font-size: 1.5rem;
  }

  label .material-symbols-outlined {
    cursor: pointer;
    background-color: var(--gress-10);
    font-size: 1.8rem;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
  }

  label .material-symbols-outlined:hover {
    background-color: var(--gress-50);
  }


  .userInteractionField {
    display: flex;
    width: 100%;
    border: 1px solid #ccc;
  }
  .userInteractionField button {
    transition: transform .7s ease-in-out;
  }
  .userInteractionField button:hover {
    transform: rotate(360deg);
  }

  input[type=text] {
    all: unset;
    width: 80%;
    padding: 15px 20px;
    margin: 8px 5px;
    border-right: 1px solid #ccc;
  }

  input[type=file] {
    display: none;
  }


  .output {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    height: 55vw;
    max-height: 1440px;
    width: 100%;
    overflow-y: scroll;
  }

  /* .right {
    float: right;
    width: 30%;
    padding: 10px;
    margin-right: 80px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
  } */

  .modelTampering {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    margin-bottom: 10px;
    width: 100%;
  }

  .sendButton {
    padding: 15px;
    margin: 8px;
    background-color: var(--gress-10);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: black;
  }

  .sendButton:hover {
    background-color: var(--gress-50);
  }

  .modellSelect {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #f5f5f5;
    width: 10rem;
    }

</style>
