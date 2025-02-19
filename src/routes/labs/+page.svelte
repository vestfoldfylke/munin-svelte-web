<script>
  import { docQueryOpenAi } from "$lib/services/openAiTools"
  import { multimodalOpenAi, noraChat, openAiAssistant } from "../../lib/services/openAiTools"
  import { multimodalMistral } from "$lib/services/mistralTools"
  import { modelinfo } from "../../lib/data/modelinfo" // Tekstbeskrivelser om valgt modell
  import ChatBlobs from "$lib/components/ChatBlobs.svelte" // Komponent for å vise chatmeldinger
  // import ModelInfo from "../../lib/components/ModelInfo.svelte"
  import "@material/web/button/elevated-button"
  import { onMount, tick } from "svelte"
  import { getHuginToken } from "../../lib/useApi"
  import IconSpinner from "../../lib/components/IconSpinner.svelte"
  import autosize from 'svelte-autosize';
  import Modal from "../../lib/components/Modal.svelte"
  import { getArticlesFromNDLA, structureResponse } from "$lib/services/kildekallTools"

  // Modell-parametere og payload
  const userParams = $state({
    message: "",
    assistant_id: "",
    newThread: true,
    threadId: "",
    messageHistory: [],
    kontekst: "",
    valgtModell: "option10", // Default modell Mistral
    base64String: "",
    temperatur: 0.7, // Default temperatur
    synligKontekst: true,  
    assistant: "Mistral",
    newThread: true,
    threadId: "",
    vectorStoreId: "",      
    fil: "Fil ikke valgt",
    filArray: "",
  })

  // Variabler for håndtering av data og innhold i frontend
  let files = $state();
  let svar;
  let showModal = $state(false)
  let selectedFiles = $state(null)
  let respons = $state()
  let modelinfoModell = $state(modelinfo[userParams.valgtModell].navn)
  let modelinfoBeskrivelse = $state(modelinfo[userParams.valgtModell].description)
  let modelTampering = $state(false) // Viser modellinformasjon
  let token = $state(null)
  let chatWindow = $state()
  let isWaiting = $state(false) // Venter på svar fra modell
  let isError = $state(false)
  let errorMessage = $state("")
  let inputMessage = $state("")
  let viewportWidth = $state(window.innerWidth)
  const appName = import.meta.env.VITE_APP_NAME

  // Starter med en velkomstmelding
  userParams.messageHistory.push({
    role: "assistant",
    content: `Velkommen til ${appName}! Hva kan jeg hjelpe deg med i dag?`,
    model: `${appName}`
  })

  onMount(async () => {
    if ( import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === "true" ) {
      // Pretend to wait for api call
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
    token = await getHuginToken(true)
  })

  // Fester scroll til bunnen av chatvinduet
  const scrollToBottom = async (node) => {
    if (!node) return;
    tick().then(() => {
      node.scroll({ top: node.scrollHeight, behavior: "smooth" })
    })
  }

  // Dette fikser scroll for brukerinput og AI output og "AI tenker"-chatboble
  //TODO: Uten if...else scroller chatbobler bare delvis og jeg skjønner ikke hvorfor....
  //TODO: Bilder scroller bare delvis, så ligger egen scrollToBottom i HandleFileSelect

  $effect(() => scrollToBottom(chatWindow));

  $effect(() => {
    if (isWaiting) {
      scrollToBottom(chatWindow);
    } else {
      scrollToBottom(chatWindow);
    }
  })

  $effect(() => {
  const updateWidth = () => {
      viewportWidth = window.innerWidth;
    };

    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  });

// Custom functions
// Henter artikler fra NDLA basert på tekstuttrekk fra responsen ttil språkmodellen
async function handleNDLARequest() {
    try {
      // Strukturerer responsen fra Hugin
      const structTest = await structureResponse(userParams);
      structTest.nøkkelord += "  og Helsefremmende arbeid (HS-HSF vg1)"; // Legger til nøkkelord for søk på NDLA

      // Søker etter artikler på NDLA basert på nøkkelord fra responsen til Hugin
      const ndla = await getArticlesFromNDLA(structTest.nøkkelord);
      console.log("Søk: ", structTest.nøkkelord); // Log the search term
      console.log("NDLA: ", ndla); // Logger responsen fra NDLA

      // Lager en ny systemmelding med lenker til artiklene fra NDLA
      userParams.messageHistory.push({
        role: "assistant",
        content: `Les mer om dette på NDLA-sidene: <br> <a target="_blank" href="https://ndla.no/article-iframe/nb/article/${ndla[0].id}">${ndla[0].title.title}</a> og <a target="_blank" href="https://ndla.no/article-iframe/nb/article/${ndla[1].id}">${ndla[1].title.title}</a> eller på <a target="_blank" href="https://ndla.no/article-iframe/nb/article/${ndla[2].id}">${ndla[2].title.title}</a><br>`,
        model: "NDLA"
      });
    } catch (error) {
      console.error("Error fetching articles from NDLA:", error);
    }
  }

   // Henter nøkkelord til søk på Lovdata basert på tekstuttrekk fra responsen ttil språkmodellen
   async function handleLovverkRequest() {
    try {
      // Strukturerer responsen fra Hugin
      const structTest = await structureResponse(userParams);
      console.log("structTest", structTest)
      // Lager en ny systemmelding med lenker søk på Lovdata basert på nøkkelord fra responsen til Hugin
      userParams.messageHistory.push({
        role: "assistant",
        content: "Les mer om: " + structTest.nøkkelord + " på: <a target='_blank' href='https://lovdata.no/sok?q=" + structTest.nøkkelord + "'>Lovdata</a>",
        model: "Lovdata"
      });
    } catch (error) {
      console.error("Error fetching articles from Lovverket:", error);
    }
  }



  // Håndterer valg av modell og oppdaterere modellinformasjon på siden
  function valgtModell(event) {
    userParams.valgtModell = event.target.value
    modelinfoModell = modelinfo[userParams.valgtModell].navn
    modelinfoBeskrivelse = modelinfo[userParams.valgtModell].description
    userParams.synligKontekst = modelinfo[userParams.valgtModell].synligKontekst
  }

   // Kaller på valgt modell med tilhørende parametre basert på brukerens valg
   const brukervalg = async () => {
    isWaiting = true

    // Get the textarea and set the height
    const textarea = document.querySelector("textarea")
    textarea.style.height = "60px"
    userParams.message = inputMessage
    inputMessage = ""
    userParams.messageHistory.push({
      role: "user",
      content: userParams.message,
      model: modelinfoModell
    })

    try {
      let response;
      console.log("userParams.valgtModell", userParams.valgtModell)
      if (userParams.valgtModell === "option10" || userParams.valgtModell === "option11") {
        console.log(userParams.valgtModell)
        respons = await openAiAssistant(userParams)
        console.log("respons", respons)
        const vasketRespons = respons.messages[0].content[0].text.value.replace(/【\d+:\d+†source】/g, ''); // Pynter på responsen
        userParams.messageHistory.push({ role: "assistant", content: vasketRespons, model: modelinfoModell })
        userParams.newThread = false
        userParams.threadId = respons.thread_id
        await handleNDLARequest(); // Kildekall: Henter relevante artikler fra NDLA
        scrollToBottom(chatWindow)
      } else if (userParams.valgtModell === "option14" || userParams.valgtModell === "option15" || userParams.valgtModell === "option16") {
        console.log(userParams.valgtModell)
        respons = await openAiAssistant(userParams)
        console.log("respons", respons)
        userParams.messageHistory.push({ role: "assistant", content: respons.messages[0].content[0].text.value, model: modelinfoModell })
        userParams.newThread = false
        userParams.threadId = respons.thread_id
        if (userParams.valgtModell === "option14") { await handleLovverkRequest(); } // Kildekall: Henter relevante artikler fra Lovdata
      } else {
        throw new Error("Ugyldig modellvalg");
      }
    } catch (error) {
      isError = true;
      errorMessage = error;
      userParams.messageHistory.push({
      role: "assistant",
      content: "Noe gikk galt. Prøv igjen.",
      model: modelinfoModell
      });
    } finally {
      isWaiting = false;
    }
  }

  // Justerer størrelsen på opplastede bilder
const resizeBase64Image = (base64, width, height) => {
    // Opprett et canvas-element
    const canvas = document.createElement('canvas');
    // Opprett et bilde-element fra base64-strengen
    const image = new Image();
    image.src = base64;
    // Returner en Promise som løses når bildet er lastet
    return new Promise((resolve, reject) => {
        image.onload = () => {
            // Beregn bildets aspektforhold
            const aspectRatio = image.width / image.height;
            // Beregn beste passform-dimensjoner for canvas
            if (width / height > aspectRatio) {
                canvas.width = height * aspectRatio;
                canvas.height = height;
            } else {
                canvas.width = width;
                canvas.height = width / aspectRatio;
            }
            // Tegn bildet på canvas
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
            }
            // Løs Promisen med det skalerte bildet som en base64-streng
            resolve(canvas.toDataURL('image/jpeg'));
        };
        image.onerror = reject;
    });
};

  // Konverterer opplastet fil til base64
  const handleFileSelect = async (event) => {
    selectedFiles = event.target.files
    const file = selectedFiles[0]

    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          userParams.messageHistory.push({
            role: "user",
            content: await resizeBase64Image(reader.result, 400, 400),
          })
          userParams.base64String = reader.result
          scrollToBottom(chatWindow)
        } catch (error) {
          console.log("Noe gikk galt", error)
        }
      }
      reader.readAsDataURL(file) // This method reads the file as a base64 string
    }
  }

  const onKeyPress = async (e, callback) => {
    if (e.charCode === 13 && !e.shiftKey) {
      e.preventDefault()
      callback()
    }
  }

  let isBeta = false;
  if (window.location.search.includes('?beta')) {
  isBeta = true;
  }

  async function sporDokument() {
    userParams.fil = files ? files[0].name : "Ingen fil valgt"
    isWaiting = true
    userParams.message = inputMessage
    inputMessage = ""
    userParams.messageHistory.push({
          role: "user",
          content: userParams.message
        })
    try {
      respons = await docQueryOpenAi(files, userParams).then((response) => {
        const l = JSON.parse(response).data.messages.length;
        svar = JSON.parse(response).data.messages[l - 1].content[0].text.value;
        // Get last message from data.messages
        userParams.newThread = false;
        userParams.vectorStoreId = JSON.parse(response).data.vectorStore_id;
        userParams.threadId = JSON.parse(response).data.thread_id;
        userParams.fil = files[0].name;
      });
      userParams.messageHistory.push({ role: "assistant", content: svar, model: modelinfoModell });
      isWaiting = false
    } catch (e) {
      console.log("Oj, noe gikk galt!", e);
    }
  }

  $inspect(userParams.messageHistory)
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</svelte:head>

<main>
  {#if !token}
    <div class="loading">
      <IconSpinner width={"32px"} />
    </div>
  {:else if !token.roles.some( (r) => [`${appName.toLowerCase()}.basic`, `${appName.toLowerCase()}.admin`].includes(r) )}
    <p>Oi, du har ikke tilgang. Prøver du deg på noe lurt? 🤓</p>
  {:else}
    <div class="modelTampering">
      <h2>Modellvelger</h2>
      <div class="boxyHeader">
        <select class="modellSelect" onchange={valgtModell}>
          <option value="option10" default selected>Labs Skogmo Praterobot - Helsefremmende arbeid</option>
          <option value="option11">Labs Skogmo Planleggingshjelper - Helsefremmende arbeid</option>
          <option value="option14">Labs Skogmo Lovverkhjelpen</option>
          <!-- <option value="option12">Test - Enkel strukturert respons</option> -->
          <option value="option15">Test - Plan og Bygg</option>
          <option value="option16">Test - Pythonhjelpen</option>
        </select>
        <button id="modelinfoButton" class="link" onclick={() => { modelTampering = !modelTampering; showModal = true }}>
          <span class="button-text">Innstillinger</span>
        </button>
      </div>
    </div>

    <div class="output" bind:this={chatWindow}>
      {#if userParams.messageHistory.length === 1}
        <ChatBlobs
          role="assistant"
          content={userParams.messageHistory[0].content}
          assistant={`${appName}`}  />
      {:else if isWaiting}
        {#each userParams.messageHistory as chatMessage}
          <ChatBlobs role={chatMessage.role} content={chatMessage.content} {...(chatMessage.role === "assistant" ? { assistant: chatMessage.model } : {})} />
        {/each}
        <ChatBlobs role={"assistant"} content={"..."} />
      {:else}
        {#each userParams.messageHistory as chatMessage}
          {#if typeof chatMessage.content === "string"}
            <ChatBlobs 
              role={chatMessage.role} 
              content={chatMessage.content} 
              {...(chatMessage.role === "assistant" ? { assistant: chatMessage.model } : {})}
              />
          {/if}
        {/each}
      {/if}
    </div>
    
    <div class="brukerInputWrapper">
      <textarea 
        id="brukerInput" 
        use:autosize 
        name="askHugin" 
        autocomplete="off" 
        placeholder={`Skriv inn ledetekst (Shift + Enter for flere linjer)`} 
        bind:value={inputMessage}
        onkeypress={(e) => onKeyPress(e, files && files.length > 0 ? sporDokument : brukervalg)}></textarea>

      {#if token.roles.some( (r) => [`${appName.toLowerCase()}.admin`].includes(r) )}
        {#if userParams.valgtModell === "option1" || userParams.valgtModell === "option13"}
          <label for="fileButton"><span class="material-symbols-outlined inputButton">cloud_upload</span>
            <input style="display:none;" bind:files={files} id="fileButton" multiple type="file" accept=".xls, .xlsx, .docx, .pdf, .txt, .json, .md, .pptx" />
          </label>
          {#if files && files.length > 0}
            <div class="fileName flash">
              {files[0].name}
              <button 
                class="removeFile" 
                onclick={() => { files = null; selectedFiles = []; document.getElementById('fileButton').value = '';}} 
                aria-label="Remove file">X</button>
            </div>
          {/if}
        {/if}
        {#if userParams.valgtModell === "option1" || userParams.valgtModell === "option13"}
          <label for="imageButton"><span class="material-symbols-outlined inputButton">add_photo_alternate</span>
          <input id="imageButton" type="file" bind:files={selectedFiles} onchange={handleFileSelect} accept="image/*" style="display: none;"/></label>
        {/if}
        {#if isError}
          <Modal bind:showModal>
            {#snippet header()}
              <h2>Error</h2>
            {/snippet}
            <h3>Noe gikk galt ⛔</h3>
            <div class="centerstuff">
              <p>
                {JSON.stringify(
                  errorMessage.response?.data ||
                    errorMessage.stack ||
                    errorMessage.message
                )}
              </p>
            </div>
            <div class="errorMsg">{JSON.stringify(errorMessage)}</div>
          </Modal>
        {/if}
      {/if}
      <label for="sendButton"><span class="material-symbols-outlined inputButton">send</span>
        <input 
          id="sendButton" 
          type="button" 
          onclick={files && files.length > 0 ? sporDokument : brukervalg}
          value={`Spør ${appName}`} 
          style="display: none;"/>
      </label>
    </div>
  {/if}
  {#if appName === 'Hugin'}
    {#if (viewportWidth < 768)}
    <p id="disclaimer">Husk at språkmodeller lager tekst som kan inneholde feil. <a href="https://telemarkfylke.no/no/veileder-for-kunstig-intelligens/">Les mer om bruk av {appName} her.</p>
    {:else}
      <p id="disclaimer">
        Husk at språkmodeller lager tekst som kan inneholde feil. Vurder alltid om bruken av språkteknologi passer med formålet ditt.<br> 
        Ikke send inn data som kan være sensitive eller inneholder informasjon som ikke kan deles offentlig. <a href="https://telemarkfylke.no/no/veileder-for-kunstig-intelligens/">Les mer om bruk av {appName} her.</a>
      </p>
    {/if}
  {/if}
  {#if appName === 'Munin'}
  {#if (viewportWidth < 768)}
  <p id="disclaimer">Husk at språkmodeller lager tekst som kan inneholde feil. <a href="https://www.vestfoldfylke.no/no/meny/tjenester/opplaring/digitale-laringsressurser-til-videregaende-opplaring/veileder-for-kunstig-intelligens/">Les mer om bruk av {appName} her.</p>
  {:else}
    <p id="disclaimer">
      Husk at språkmodeller lager tekst som kan inneholde feil. Vurder alltid om bruken av språkteknologi passer med formålet ditt.<br> 
      Ikke send inn data som kan være sensitive eller inneholder informasjon som ikke kan deles offentlig. <a href="https://www.vestfoldfylke.no/no/meny/tjenester/opplaring/digitale-laringsressurser-til-videregaende-opplaring/veileder-for-kunstig-intelligens/">Les mer om bruk av {appName} her.</a>
    </p>
  {/if}
{/if}
  <Modal bind:showModal buttonText="Lagre">
    {#snippet header()}
        <h2 >{modelinfoModell}</h2>
      {/snippet}
    {#snippet mainContent()}
        <p >{@html modelinfoBeskrivelse}</p>
      {/snippet}
    {#if userParams.synligKontekst}
    <textarea 
      use:autosize
      id="inputKontekst" 
      placeholder="Her kan du legge inn kontekst til språkmodellen." 
      bind:value={userParams.kontekst} 
      rows="4" 
      cols="auto">
    </textarea>
    <label for="temperatur">Temperatur: </label>
      <input type="range" id="temperatur" name="temperatur" min="0" max="2" step="0.1" bind:value={userParams.temperatur}/>
    {userParams.temperatur}
    {/if}
  </Modal>
</main>

<style>

main {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  height: calc(85vh);
  margin: 10px;
}

#modelinfoButton {
  border: 1px solid #ccc;
  padding: 3px 10px 3px 10px;
  background-color: #f5f5f5;
  border-radius: 1rem;
  text-decoration: none;
}

textarea {
    display: block;
    width: 100%;
    overflow-y: scroll;
    resize: none;
    min-height: 40px;
    max-height: 200px;
    line-height: 20px;
  }
  
  .brukerInputWrapper {
    display: flex;
    width: 100%;
    border: 1px solid #ccc;
    padding-left: 10px;
    background-color: #fffafa;
    position: relative;
    align-items: end;
  }

  #brukerInput {
    border: none;
    outline: none;
    background: none;
    flex-grow: 1;
    padding-top: 15px;
    padding-bottom: 5px;
  }

  #brukerInput::placeholder {
    padding-top: 5px;
  }

  #brukerInput:focus::placeholder {
  color: transparent;
  }

  .boxyHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 5px 10px 10px 8px;
  }

  .material-symbols-outlined {
    font-size: 1.5rem;
  }

  label .material-symbols-outlined {
    cursor: pointer;
    background-color: var(--gress-10);
    font-size: 1.8rem;
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
  }

  label .material-symbols-outlined:hover {
    background-color: var(--gress-50);
  }

  .output {
    padding-top: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    height: 100vw;
    max-height: 1440px;
    width: 100%;
    overflow-y: scroll;
  }

  .modelTampering {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    margin-bottom: 10px;
    width: 100%;
  }

  .fileName {
    display: inline-block;
    position: relative;
    padding-right: 20px;
    margin-bottom: 15px;
  }

  @keyframes flash {
    0% {
      background-color: transparent;
    } 
    50% {
      background-color: #f1f59f;
    }
    100% {
      background-color: transparent;
    }
  }

  .flash {
  animation: flash 2s ease-in-out;
  }

  .removeFile {
    position: absolute;
    top: -5px;
    right: 0px;
    background: darkgreen;
    color: white;
    border-radius: 50%;
    width: 12px !important;
    height: 12px !important;
    display: flex;
    justify-content: center;
    cursor: pointer;
    border: 1px solid lightgreen;
    font-size: 0.6rem;
  }

  .modellSelect {
    padding: 10px;
    border-radius: 1rem;
    border: 1px solid #ccc;
    background-color: #f5f5f5;
    width: 26rem;
  }

  textarea#inputKontekst {
    padding: 10px;
    margin-top: 30px;
    margin-bottom: 10px;
    font-size: 16px;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .inputButton {
    margin-bottom: 10px !important;
  }

  #disclaimer {
    font-size: 14px;
    color: rgb(92, 92, 92);
    padding-top: 10px;
  }

  @media only screen and (max-width: 768px) {
    main {
      height: 100%; /*calc(80vh - 100px);*/
      margin: 2px;
      margin-bottom: 0; /* reduce bottom whitespace */
    }
    
    #disclaimer {
      font-size: 12px;
    }

    .modellSelect {
      width: 320px;
      margin-right: 5px;
    }

    .modelTampering > h2 {
      font-size: 1rem;
    }

    .button-text {
      display: none;
    }

    #modelinfoButton {
      padding: 5px 9px 0px 9px;
    }
    #modelinfoButton::before {
      content: "\e8b8"; /* Unicode for cog wheel icon */
      font-family: 'Material Icons';
      font-size: 1.5rem;
    }
  }
</style>
