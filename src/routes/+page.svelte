<script>
    import InfoBox from '$lib/components/InfoBox.svelte'
    import chat from '$lib/images/chat.png'
    import doc from '$lib/images/doc.png'
    import ravner from '$lib/images/ravner.jpg'
    import CardButton from '$lib/components/CardButton.svelte'
    import IconSpinner from '../lib/components/IconSpinner.svelte';
    import { getHuginToken } from '../lib/useApi';
  </script>
  
  <main>
    {#await getHuginToken(true)}
      <div class="loading">
        <IconSpinner width={"32px"} />
      </div> 
    {:then token}
      <div class="centerstuff">
          <h1>{import.meta.env.VITE_APP_NAME} - En KI-tjeneste for {import.meta.env.VITE_COUNTY} fylkeskommune</h1>
      </div>
      <div class="centerstuff">
        <CardButton header={'Om tjenesten'} imgPath={ravner} imgAlt={'Bilde av Hugin og Munin'} gotoPath={'/about'} paragraph={'Trykk her for å lese mer om tjenesten'} boolValue={true}><span class="material-symbols-outlined">raven</span></CardButton>
        <CardButton header={'Chat'} imgPath={chat} imgAlt={'Ikon bilde av en snakkebobble'} gotoPath={'/homeSchool'} paragraph={'Trykk her for chatbotter'} boolValue={true}><span class="material-symbols-outlined">chat</span></CardButton>
        {#if token.roles.includes('App.Admin')}
          <CardButton header={'Dokumentspørring'} imgPath={doc} imgAlt={'Ikon bilde av et dokument'} gotoPath={'/docQuery'} paragraph={'Trykk her hvis du vil bruke KI til spørre og jobbe med egne dokumenter.'} boolValue={true}><span class="material-symbols-outlined">find_in_page</span></CardButton>
        {/if}
      </div>
    {/await}
  </main>
  
  
  <style>
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
      
  </style>