<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
<script>
  import { openAiAssistant } from "$lib/services/openAiTools"
  import { testStructured } from "../../lib/services/openaiToolsLabs"
  import { getArticlesFromNDLA, structureResponse } from "$lib/services/kildekallTools"
  import { modelinfo } from "$lib/data/modelinfo" // Tekstbeskrivelser om valgt modell
  import ChatBlobs from "$lib/components/ChatBlobs.svelte" // Komponent for å vise chatmeldinger
  import ModelInfo from "../../lib/components/ModelInfo.svelte"
  import "@material/web/button/elevated-button"
  import { onMount, afterUpdate } from "svelte"
  import { getHuginToken } from "../../lib/useApi"
  import IconSpinner from "../../lib/components/IconSpinner.svelte"
  import Modal from "../../lib/components/Modal.svelte"

  // Modell-parametere og payload
  const userParams = {
    message: "",
    assistant_id: "",
    newThread: true,
    threadId: "",
    messageHistory: [],
    kontekst: "",
    valgtModell: "option10", // Default modell Labs Skogmo elever - Helsefremmende arbeid
    base64String: "",
    temperatur: 0.2, // Default temperatur
    synligKontekst: true
  }

  // Variabler for håndtering av data og innhold i frontend
  let outputElement
  let tekstFraPdf = "" // Brukes ikke....Ennå
  let selectedFiles = []
  let respons
  let modelinfoModell = modelinfo[userParams.valgtModell].navn
  let modelinfoBeskrivelse = modelinfo[userParams.valgtModell].description
  let illustrasjonsbilde = modelinfo[userParams.valgtModell].illustrasjonsbilde
  let modelTampering = false // Viser modellinformasjon
  let advancedInteractions = false
  let token = null
  let chatWindow
  let isWaiting = false
  let isError = false
  let errorMessage = ""
  let showModal = false
  const appName = import.meta.env.VITE_APP_NAME

  // Starter med en velkomstmelding
  userParams.messageHistory.push({
    role: "assistant",
    content: `Velkommen til ${appName} og Fag-botten! Hva kan jeg hjelpe deg med i dag?`,
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
    node.scroll({ top: node.scrollHeight, behavior: "smooth" })
  }

  // Håndterer valg av modell og oppdaterere modellinformasjon på siden
  function valgtModell(event) {
    userParams.valgtModell = event.target.value
    modelinfoModell = modelinfo[userParams.valgtModell].navn
    modelinfoBeskrivelse = modelinfo[userParams.valgtModell].description
    modelinfo[userParams.valgtModell].synligKontekst
  }

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
      });
    } catch (error) {
      console.error("Error fetching articles from Lovverket:", error);
    }
  }


  // Kaller på valgt modell med tilhørende parametre basert på brukerens valg
  const brukervalg = async () => {
    isWaiting = true
    try {
      // Fagbotter
      if (userParams.valgtModell === "option10" || userParams.valgtModell === "option11") {
        userParams.messageHistory.push({
          role: "user",
          content: userParams.message,
        })
        userParams.message = ""
        respons = await openAiAssistant(userParams)
        const vasketRespons = respons.messages[0].content[0].text.value.replace(/【\d+:\d+†source】/g, ''); // Pynter på responsen
        userParams.messageHistory.push({ role: "assistant", content: vasketRespons, assistant: "HO-Botten" })
        userParams.newThread = false
        userParams.threadId = respons.thread_id
        await handleNDLARequest(); // Kildekall: Henter relevante artikler fra NDLA
        scrollToBottom(chatWindow)
        isWaiting = false
      } else if (userParams.valgtModell === "option14" || userParams.valgtModell === "option15" || userParams.valgtModell === "option16") {
          userParams.messageHistory.push({
          role: "user",
          content: userParams.message,
        })
        userParams.message = ""
        respons = await openAiAssistant(userParams)
        const vasketRespons = respons.messages[0].content[0].text.value.replace(/【\d+:\d+†source】/g, ''); // Pynter på responsen
        userParams.messageHistory.push({ role: "assistant", content: vasketRespons, assistant: "RegelverksBotten" })
        userParams.newThread = false
        userParams.threadId = respons.thread_id
        if (userParams.valgtModell === "option14") { await handleLovverkRequest(); } // Kildekall: Henter relevante artikler fra Lovdata
        scrollToBottom(chatWindow)
        isWaiting = false
      }
      // Strukturert respons
      else if (userParams.valgtModell === "option12") {
        userParams.messageHistory.push({
          role: "user",
          content: userParams.message,
        })
        userParams.message = ""
        respons = await testStructured(userParams)
        console.log("respons", respons.data.choices[0].message.parsed.superkraft)
        userParams.messageHistory.push({ role: "assistant", content: JSON.stringify(respons.data.choices[0].message.parsed) })
        scrollToBottom(chatWindow)
        isWaiting = false
      }
    } catch (error) {
      isError = true
      errorMessage = error
      isWaiting = false
      userParams.messageHistory.push({
        role: "assistant",
        content: "Noe gikk galt. Prøv igjen.",
      })
      openModal()
    }
  }

  const openModal = () => {
    // Disable scrolling when modal is open
    document.body.style.overflow = "auto"
    document.body.style.height = "100%"
    showModal = true
  }

  // Justerer størrelsen på opplastede bilder
  const resizeBase64Image = (base64, width, height) => {
  // Create a canvas element
  const canvas = document.createElement('canvas')
  // Create an image element from the base64 string
  const image = new Image();
  image.src = base64;

  // Return a Promise that resolves when the image has loaded
  return new Promise((resolve, reject) => {
    image.onload = () => {
      // Calculate the aspect ratio of the image
      const aspectRatio = image.width / image.height;

      // Calculate the best fit dimensions for the canvas
      if (width / height > aspectRatio) {
        canvas.width = height * aspectRatio;
        canvas.height = height;
      } else {
        canvas.width = width;
        canvas.height = width / aspectRatio;
      }

      // Draw the image to the canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      }

      // Resolve the Promise with the resized image as a base64 string
      resolve(canvas.toDataURL());
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
          // console.log("base64String", userParams.base64String)
        } catch (error) {
          console.log("Noe gikk galt", error)
        }
      }
      reader.readAsDataURL(file) // This method reads the file as a base64 string
    }
  }

  $: if (respons && chatWindow) {
    scrollToBottom(chatWindow)
  }

  const onKeyPress = async (e) => {
    if (e.charCode === 13) {
      // isEnterPressed = true
      scrollToBottom(chatWindow)
      brukervalg()
    }
  }

  // Fester scroll til bunnen av chatvinduet etter oppdatering av chatvinduet
  afterUpdate(() => {
    if (respons && chatWindow && userParams.message.length === 0) {
      scrollToBottom(chatWindow)
    }
  })
</script>

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
        <select class="modellSelect" on:change={valgtModell} >
          <option value="option10" default selected>Labs Skogmo Praterobot - Helsefremmende arbeid</option>
          <option value="option11">Labs Skogmo Planleggingshjelper - Helsefremmende arbeid</option>
          <option value="option14">Labs Skogmo Lovverkhjelpen</option>
          <!-- <option value="option12">Test - Enkel strukturert respons</option> -->
          <option value="option15">Test - Plan og Bygg</option>
          <option value="option16">Test - Pythonhjelpen</option>
        </select>
        <div class="showNhideBtns">
          {#if modelTampering}
            <button class="link" on:click={() => { modelTampering = !modelTampering }}>
              Trykk her for å lukke<span class="material-symbols-outlined">keyboard_arrow_up</span>
            </button>
          {:else}
            <button class="link" on:click={() => { modelTampering = !modelTampering }}>
              Trykk her for å lese mer om modellen<span class="material-symbols-outlined">keyboard_arrow_down</span>
            </button>
          {/if}
        </div>
      </div>

      {#if modelTampering}
        <div class="boxy" id="testBox">
          <ModelInfo
            modelinfo={modelinfoModell}
            infoText={modelinfoBeskrivelse}
          />
          {#key userParams.synligKontekst}
            {#if userParams.synligKontekst}
              <textarea
                placeholder="Her kan du legge inn kontekst til språkmodellen."
                bind:value={userParams.kontekst}
                rows="4"
                cols="auto"
              ></textarea>
              <label for="temperatur">Temperatur: </label>
              <input
                type="range"
                id="temperatur"
                name="temperatur"
                min="0"
                max="2"
                step="0.1"
                bind:value={userParams.temperatur}
              />
              {userParams.temperatur}
            {/if}
          {/key}
        </div>
      {/if}
    </div>
    <div class="output" bind:this={chatWindow}>
      {#if userParams.messageHistory.length === 1}
        <ChatBlobs
          role="assistant"
          content={userParams.messageHistory[0].content}
        />
      {:else if isWaiting}
        {#each userParams.messageHistory as chatMessage}
          <ChatBlobs role={chatMessage.role} content={chatMessage.content} assistant={"Fag-botten"} />
        {/each}
        <ChatBlobs role={"assistant"} content={"..."} assistant={"Fag-botten"}/>
      {:else}
        {#each userParams.messageHistory as chatMessage}
          <ChatBlobs role={chatMessage.role} content={chatMessage.content} assistant={"Fag-botten"} />
        {/each}
      {/if}
    </div>
    <div class="userInteractionField">
      <input
        name="askHugin"
        type="text"
        autocomplete="off"
        placeholder={`Spør ${appName}`}
        size="50"
        bind:value={userParams.message}
        on:keypress={onKeyPress}
      />
      
      <input class="sendButton" type="button" on:click={brukervalg} on:keypress={onKeyPress} value={`Spør Fag-botten`} />
    </div>
    {#if isError}
      <Modal bind:showModal>
        <h2 slot="header">Error</h2>
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
  <br><p>Husk at språkmodeller lager tekst som kan inneholde feil. Sjekk alltid flere kilder og bruk sunn fornuft når du bruker KI-tjenester.<br> Ikke send inn data som kan være sensitive eller inneholder informasjon som ikke kan deles offentlig</p><br>
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
  textarea {
    padding: 10px;
    margin-bottom: 20px;
    display: block;
    width: 100%;
    overflow: hidden;
    resize: both;
    min-height: 40px;
    line-height: 20px;
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
    transition: transform 0.7s ease-in-out;
  }
  .userInteractionField button:hover {
    transform: rotate(360deg);
  }

  input[type="text"] {
    all: unset;
    width: 80%;
    padding: 15px 20px;
    margin: 8px 5px;
    border-right: 1px solid #ccc;
  }

  input[type="file"] {
    display: none;
  }

  .output {
    padding: 1px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    height: 100vw;
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
    width: 32rem;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .errorMsg {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    justify-content: center;
    width: 97%;
    height: 20vh;
    overflow: auto;
  }

  .centerstuff {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    padding: 5px;
  }

  @media only screen and (max-width: 768px) {
    main {
      height: calc(80vh - 100px);
      margin: 2px;
    }

    .output {
      padding: 1px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-bottom: 10px;
      height: 100vw;
      max-height: 1440px;
      width: 100%;
      overflow-y: scroll;
    }
  }
</style>
