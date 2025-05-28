// Bibliotek for å håndtere API-kall til AZF-funksjoner
import axios from 'axios'
import { models } from '$lib/data/models' // Modellkonfigurasjon
import { getHuginToken } from '../useApi'

export const noraChat = async (userParams) => {
  // Sjekker om det er hverdag mellom 08:00 og 16:00
  const isWeekday = (date = new Date()) => date.getDay() % 6 !== 0
  const isDaytime = (date = new Date()) => date.getHours() >= 8 && date.getHours() < 16

  const modelIndex = models.findIndex((model) => model.metadata.navn === 'NoraLLM')

  const payload = models[modelIndex].params
  payload.question = userParams.message

  const accessToken = await getHuginToken()
  if (isWeekday() && isDaytime()) {
    const response = await axios.post(`${import.meta.env.VITE_AI_API_URI}/noraChat`, payload, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  } else {
    return 'Nora er tilgjengelig på hverdager mellom 08:00 og 16:00. Prøv igjen senere.'
  }
}
