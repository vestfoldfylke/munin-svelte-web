// Dette er informasjon som brukes i for å vise informasjon om modellene som er tilgjengelige og hvilke felt som skal vises i frontend.
export const modelinfo = {
  option1: {
    navn: 'GPT-4o',
    description: 'Denne modellen bruker GPT-4o til å generere tekst basert på en gitt kontekst og melding. GPT-4o er den nyeste versjonen av GPT-4, og er trent på en stor mengde data fra internett. Modellen er trent på å generere tekst som ligner på menneskelig skrevet tekst, og kan brukes til en rekke oppgaver som tekstgenerering, oversettelse og spørsmål-svar. Du må selv legge inn kontektst og temperatur slik at modellen får de egenskapene du ønsker. Denne har også mulighet for bildeanalyse. Trykk på tannhjulet og last opp et bilde. Modellen vil analysere bildet og generere tekst basert på dette.',
    synligKontekst: true,
    illustrasjon: 'GPT4o.png'
  },
  option2: {
    navn: 'NoraLLM',
    description: 'NoraLLM er en norsk språmodell som er basert på Mistral',
    synligKontekst: false,
    illustrasjon: 'nora.png'
  },
  option3: {
    navn: 'Matematikkens byggesteiner',
    description: 'Matematikkens byggesteiner er en lærebok som dekker de fleste temaer i matematikk fra grunnskolen til og med 1P/2P på videregående. Denne assistenten er svarer på spørsmål om matematikk basert på innholdet i denne boken. I tillegg er læreplanene i matematikk 1P og 2P lagt til som kontekst. Alle responser er basert på innholdet i boken, og assistenten er instruert til kun å gi svar som er relevante for matematikk. Læreboken er skrevet av Sindre Sogge Heggen og publisert på https://sindrsh.github.io/openmathbooks/ under en Creative Commons-lisens. CC BY-NC-SA 4.0',
    synligKontekst: false,
    illustrasjon: 'matematikk.png'
  },
  option4: {
    navn: 'NDLA Religion - eksperimentell assistent',
    description: 'NDLA Religion er en eksperimentell assistent som forholder seg NDLA sine ressurser om religion. Alle responser er basert på innholdet i disse ressursene. I tillegg til læringsressursene fra NDLA, er assistenten instruert til å respondere i henhold til læreplanen i faget. (REL01-02)',
    synligKontekst: false,
    illustrasjon: 'NDLA.png'

  }
}
