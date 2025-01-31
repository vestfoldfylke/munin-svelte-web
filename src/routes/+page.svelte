<script>
    import InfoBox from '$lib/components/InfoBox.svelte'
    import chat from '$lib/images/chat.png'
    import doc from '$lib/images/doc.png'
    import eksperiment from '$lib/images/eksperiment.png'
    import ravner from '$lib/images/ravner.jpg'
    import CardButton from '$lib/components/CardButton.svelte'
    import IconSpinner from '../lib/components/IconSpinner.svelte';
    import { getHuginToken } from '../lib/useApi';
    import { onMount } from 'svelte';
    
    let token = $state(null)
    const appName = import.meta.env.VITE_APP_NAME

    onMount(async () => {
        if(import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === 'true'){
            // Pretend to wait for api call
            spinner = true
            await new Promise(resolve => setTimeout(resolve, 2000))
        }
        token = await getHuginToken(true)
    })
  </script>
  
  <main>
    {#if !token}
      <div class="loading">
        <IconSpinner width={"32px"} />
      </div> 
    {:else}
      <div class="centerstuff">
        <!-- <CardButton header={'Om tjenesten'} imgPath={ravner} imgAlt={'Bilde av Hugin og Munin'} gotoPath={'/about'} paragraph={''} boolValue={true}><span class="material-symbols-outlined">raven</span></CardButton> -->
        <CardButton header={'KI-modeller'} imgPath={chat} imgAlt={'Ikon bilde av en snakkebobble'} gotoPath={'/KI-modeller'} paragraph={''} boolValue={true}><span class="material-symbols-outlined">chat</span></CardButton>
        {#if token.roles.includes(`${appName.toLowerCase()}.admin`)}
          <!-- <CardButton header={'Dokumentspørring'} imgPath={doc} imgAlt={'Ikon bilde av et dokument'} gotoPath={'/docQuery'} paragraph={'Trykk her hvis du vil bruke KI til spørre og jobbe med egne dokumenter.'} boolValue={true}><span class="material-symbols-outlined">find_in_page</span></CardButton> -->
          <CardButton header={'Transkripsjon'} imgPath={doc} imgAlt={'Ikon bilde av et dokument'} gotoPath={'/transcript'} paragraph={''} boolValue={true}><span class="material-symbols-outlined">interpreter_mode</span></CardButton>
        {/if}
        {#if token.roles.includes(`${appName.toLowerCase()}.labs`) || token.roles.includes(`${appName.toLowerCase()}.admin`)}
          <CardButton header={'Pilot'} imgPath={eksperiment} imgAlt={'Ikon bilde av et reagensrør'} gotoPath={'/labs'} paragraph={''} boolValue={true}><span class="material-symbols-outlined">experiment</span></CardButton>
        {/if}
      </div>
      <h2>{appName} - En <a target="_blank" href="https://www.vestfoldfylke.no/no/meny/tjenester/opplaring/digitale-laringsressurser-til-videregaende-opplaring/munin/"> KI-tjeneste </a> for {import.meta.env.VITE_COUNTY} fylkeskommune</h2>
    {/if}
  </main>
  
  
  <style>
  * {
    /* user-select:none; */
    }
    main {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 40px;
    }
    .centerstuff {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
    .material-symbols-outlined {
        font-size: 7.5rem;
        font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 100
    }
    h1 {
      padding-top: 40px;
    }
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
    }   
    @media only screen and (max-width: 768px) {
      h1 {
        font-size: 1.5rem;
      }
    }

    @media only screen and (max-width: 588px) {
      h1 {
        font-size: 1.2rem;
      }
    }
  </style>