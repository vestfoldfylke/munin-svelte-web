<script>
  import { openAiAssistant } from "$lib/services/openAiTools";
  import { models } from "$lib/data/models"; // Modellkonfigurasjon
  import ChatBlobs from "$lib/components/ChatBlobs.svelte"; // Komponent for å vise chatmeldinger
  import { onMount, tick } from "svelte";
  import { getHuginToken } from "$lib/useApi";
  import IconSpinner from "$lib/components/IconSpinner.svelte";
  import autosize from "svelte-autosize";
  import Modal from "$lib/components/Modal.svelte";
  import { checkRoles } from '$lib/helpers/checkRoles';
  import logoFarte from "$lib/images/logo_farte.png";

  // Init state - Modell-parametere og payload
  const userParams = $state({
    message: "",
    messageHistory: [],
    assistant_id: models.filter(model => model.metadata.tile === "fartebot")[0].params.assistant_id,
    new_thread: true,
    thread_id: '',
    tile: "fartebot",
  })

  // Variabler for håndtering av data og innhold i frontend
  let modelinfoModell = $state(null) // $state(modelinfo[userParams.valgtModell].navn)
  let modelinfoBeskrivelse = $state("") // $state(modelinfo[userParams.valgtModell].beskrivelse)
  let modelTampering = $state(false) // Viser modellinformasjon
  let token = $state(null)
  let chatWindow = $state()
  let isWaiting = $state(false) // Venter på svar fra modell
  let isError = $state(false)
  let showModal = $state(false)
  let errorMessage = $state("")
  let inputMessage = $state("")
  let viewportWidth = $state(window.innerWidth)
  const appName = import.meta.env.VITE_APP_NAME

    // Kjører ved oppstart for å sette opp initial state
    valgtModell({
      target: {
        value: models.filter(model => model.metadata.tile === "fartebot")[0].params.assistant_id
      }
    })

  // Starter med en velkomstmelding
  userParams.messageHistory.push({
    role: "assistant",
    content: `Hei! Jeg er din digitale reiseassistent for kollektivtransport. Jeg kan hjelpe deg med rutetider, billettprdiser, reiseruter og annen informasjon om buss, tog og andre transportmidler. Hva kan jeg hjelpe deg med i dag?`,
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


  // Logikk og funksjoner for håndtering av brukerinput og valg av modell

  // Håndterer valg av modell og oppdaterere modellinformasjon på siden
  function valgtModell(event) {
    userParams.new_thread = true
    userParams.assistant_id = event.target.value
    modelinfoModell = models.find(model => model.params.assistant_id === userParams.assistant_id).metadata.navn
    modelinfoBeskrivelse = models.find(model => model.params.assistant_id === userParams.assistant_id).metadata.description
    userParams.synligKontekst = models.find(model => model.params.assistant_id === userParams.assistant_id).metadata.synligKontekst
  }

  // Kaller på valgt modell med tilhørende parametre basert på brukerens valg 
  const brukervalg = async () => {
    isWaiting = true
    // Get the textarea and set the height -- Hvorfor er dette her?
    const textarea = document.querySelector("textarea")
    textarea.style.height = "60px"
    modelinfoModell = models.find(model => model.params.assistant_id === userParams.assistant_id).metadata.navn
    userParams.message = inputMessage
    inputMessage = ""
    userParams.messageHistory.push({
      role: "user",
      content: userParams.message,
      model: modelinfoModell
    })

    try {
      let response;
      response = await openAiAssistant(userParams);
      userParams.messageHistory.push({ role: "assistant", content: response[0].messages[0].content[0].text.value, model: modelinfoModell }); 
      userParams.new_thread = false
      userParams.thread_id = response[0].thread_id
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


  // Håndterer tastetrykk i textarea
  const onKeyPress = async (e, callback) => {
    if (e.charCode === 13 && !e.shiftKey) {
      e.preventDefault()
      callback()
    }
  }

</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</svelte:head>

<main>
  {#if !token}
    <div class="loading">
      <IconSpinner width={"32px"} />
    </div>
    {:else if !checkRoles(token, [`${appName.toLowerCase()}.admin`])}
    <p>Oi, du har ikke tilgang. Prøver du deg på noe lurt? 🤓</p>
  {:else}
    
    <div class="page-header">
      <div class="header-content">
        <div class="header-logo">
          <img src={logoFarte} alt="Farte.no logo" />
        </div>
        <div class="header-text">
          <h1>Kollektivinfo</h1>
          <p>Din digitale reiseassistent for offentlig transport</p>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <button class="quick-action-btn" onclick={() => inputMessage = "Hvor går neste buss fra Skien sentrum?"}>
        <span class="material-symbols-outlined">schedule</span>
        Rutetider
      </button>
      <button class="quick-action-btn" onclick={() => inputMessage = "Hvor mye koster en enkeltbillett?"}>
        <span class="material-symbols-outlined">payments</span>
        Billettpris
      </button>
      <button class="quick-action-btn" onclick={() => inputMessage = "Hvordan kommer jeg fra Porsgrunn til Skien?"}>
        <span class="material-symbols-outlined">directions</span>
        Reiserute
      </button>
      <button class="quick-action-btn" onclick={() => inputMessage = "Hvor kan jeg kjøpe billetter?"}>
        <span class="material-symbols-outlined">confirmation_number</span>
        Billetter
      </button>
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
        placeholder={`Spør om rutetider, billettpris eller reiseruter... (Shift + Enter for flere linjer)`} 
        bind:value={inputMessage}
        onkeypress={(e) => onKeyPress(e, brukervalg)}></textarea>

      {#if token.roles.some( (r) => [`${appName.toLowerCase()}.admin`].includes(r))}
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
          </Modal>
        {/if}
      {/if}
      <label for="sendButton"><span class="material-symbols-outlined inputButton">send</span>
        <input id="sendButton" type="button" onclick={brukervalg} value={`Spør ${appName}`} style="display: none;"/>
      </label>
    </div>
  {/if}
  {#if appName === 'Hugin'}
    {#if (viewportWidth < 768)}
    <p id="disclaimer">Husk at språkmodeller lager tekst som kan inneholde feil. <a href="https://telemarkfylke.no/no/veileder-for-kunstig-intelligens/">Les mer om bruk av {appName} her.</a></p>
    {:else}
      <p id="disclaimer">
        Husk at språkmodeller lager tekst som kan inneholde feil. Vurder alltid om bruken av språkteknologi passer med formålet ditt.<br> 
        Ikke send inn data som kan være sensitive eller inneholder informasjon som ikke kan deles offentlig. <a href="https://telemarkfylke.no/no/veileder-for-kunstig-intelligens/">Les mer om bruk av {appName} her.</a>
      </p>
    {/if}
  {/if}
  {#if appName === 'Munin'}
  {#if (viewportWidth < 768)}
  <p id="disclaimer">Husk at språkmodeller lager tekst som kan inneholde feil. <a href="https://www.vestfoldfylke.no/no/meny/tjenester/opplaring/digitale-laringsressurser-til-videregaende-opplaring/veileder-for-kunstig-intelligens/">Les mer om bruk av {appName} her.</a></p>
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
  justify-content: flex-start;
  align-items: center;
  height: calc(85vh);
  margin: 10px;
  gap: 15px;
}

.page-header {
  width: 100%;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 30px;
  color: #1f2937;
}

.header-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-logo img {
  height: 50px;
  width: auto;
  object-fit: contain;
  background: transparent;
  mix-blend-mode: darken;
}

.header-text h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.header-text p {
  margin: 5px 0 0 0;
  font-size: 1rem;
  opacity: 0.9;
}

.quick-actions-section {
  width: 100%;
  margin-bottom: 15px;
}

.quick-actions-title {
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  width: 100%;
  margin-bottom: 15px;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid #fbbf24;
  border-radius: 8px;
  background: #fef3c7;
  color: #92400e;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-action-btn:hover {
  border-color: #f59e0b;
  background: #fbbf24;
  color: #78350f;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quick-action-btn .material-symbols-outlined {
  font-size: 1.2rem;
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
    border: 1px solid #fde68a;
    border-radius: 12px;
    padding-left: 15px;
    background-color: white;
    position: relative;
    align-items: end;
    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.1);
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

  .material-symbols-outlined {
    font-size: 1.5rem;
  }

  label .material-symbols-outlined {
    cursor: pointer;
    background-color: #fbbf24;
    color: #1f2937;
    font-size: 1.8rem;
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
  }

  label .material-symbols-outlined:hover {
    background-color: #f59e0b;
  }

  .output {
    padding: 15px;
    border: 1px solid #fde68a;
    border-radius: 12px;
    margin-bottom: 10px;
    height: 100vw;
    max-height: 1440px;
    width: 100%;
    overflow-y: scroll;
    background: #fffbeb;
    box-shadow: inset 0 1px 3px rgba(251, 191, 36, 0.1);
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
      gap: 10px;
    }
    
    .page-header {
      padding: 15px;
      margin-bottom: 5px;
    }
    
    .header-content {
      gap: 10px;
    }
    
    .header-logo img {
      height: 40px;
    }
    
    .header-text h1 {
      font-size: 1.4rem;
    }
    
    .header-text p {
      font-size: 0.9rem;
    }
    
    .quick-actions-section {
      margin-bottom: 10px;
    }
    
    .quick-actions-title {
      font-size: 1rem;
      margin-bottom: 8px;
    }
    
    .quick-actions {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    
    .quick-action-btn {
      padding: 10px 12px;
      font-size: 0.8rem;
    }
    
    .quick-action-btn .material-symbols-outlined {
      font-size: 1rem;
    }
    
    #disclaimer {
      font-size: 12px;
    }
  }
</style>
