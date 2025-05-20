// Bibliotek for å håndtere API-kall til AZF-funksjoner
import axios from 'axios'
import { models } from '$lib/data/models'
import { getHuginToken } from '../useApi'
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { jwtDecode } from "jwt-decode";

// Importere skjemaer fra eget bibliotek etterhvert
const Superheltinfo = z.object({
  navn: z.string(),
  superkraft: z.string(),
  kjønn: z.string(),
  god: z.boolean(),
});

const MatteInfo = z.object({
  tema: z.string(),
  forklaring: z.string(),
  nøkkelord: z.string(),
});

// Testfunksjon for å sjekke at skjemaene fungerer
export const testStructured = async (userParams) => {
  console.log(zodResponseFormat(Superheltinfo), "event")
   // Template API-call
   const payload = { ...models[12].params }  // Using model with id='12' for structured responses
   payload.message = userParams.message
   payload.messageHistory = userParams.messageHistory
   payload.kontekst = userParams.kontekst
   payload.temperatur = userParams.temperatur
   payload.bilde_base64String = userParams.base64String
   payload.response_format = zodResponseFormat(Superheltinfo, "SuperInfo")
   payload.model = "gpt-4o-2024-08-06"

   const accessToken = await getHuginToken()
   // Call AZF-funksjon with payload
   const response = await axios.post(`${import.meta.env.VITE_AI_API_URI}/structuredOpenAi`, payload, {
     headers: {
       authorization: `Bearer ${accessToken}`
     }
   })
   return response
}

export const nbTranscript = async (filliste, metadata) => {
  const accessToken = await getHuginToken()
  const user_upn = jwtDecode(accessToken).upn

  const datapakken = new FormData()
  datapakken.append('filer', filliste)
  datapakken.append('filnavn', metadata.filnavn)
  datapakken.append('spraak', metadata.spraak)
  datapakken.append('format', metadata.format)
  datapakken.append('upn', user_upn);
  const r = await axios.post(`${import.meta.env.VITE_AI_API_URI}/nbTranscript`, datapakken, {
    method: 'post',
    data: datapakken,
    headers: {
      'Content-Type': 'multipart/form-data',
      authorization: `Bearer ${accessToken}`
    }
  })
  console.log("Venter på transcript: ")
  return JSON.stringify(r.data.data.text)
}