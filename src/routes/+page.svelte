<script>
    import InfoBox from '$lib/components/InfoBox.svelte'
    import chat from '$lib/images/chat.png'
    import doc from '$lib/images/doc.png'
    import ravner from '$lib/images/ravner.jpg'
    import CardButton from '$lib/components/CardButton.svelte'
  </script>
  
  <main>
      <div class="centerstuff">
          <h1>Hugin og Munin - En KI-tjeneste for Vestfold og Telemark fylkeskommune</h1>
      </div>
      <div class="centerstuff">
        <CardButton header={'Om tjenesten'} imgPath={ravner} imgAlt={'Bilde av Hugin og Munin'} gotoPath={'/about'} paragraph={'Trykk her for å lese mer om tjenesten'} boolValue={true}/>
        <CardButton header={'Chat'} imgPath={chat} imgAlt={'Ikon bilde av en snakkebobble'} gotoPath={'/homeSchool'} paragraph={'Trykk her for chatbotter'} boolValue={true}/>
        <CardButton header={'Dokumentspørring'} imgPath={doc} imgAlt={'Ikon bilde av et dokument'} gotoPath={'/docQuery'} paragraph={'Trykk her hvis du vil bruke KI til spørre og jobbe med egne dokumenter.'} boolValue={true}/>
    </div>
  </main>
  
  
  <style>
     .centerstuff {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
      }
  </style>