// Bibliotek for å håndtere API-kall til AZF-funksjoner
import axios from 'axios'
import { models } from '$lib/data/models' // Modellkonfigurasjon
import { getHuginToken } from '../useApi'

const { VITE_AI_API_URI: aiApiUri } = import.meta.env

export const noraChat = async (userParams) => {
  // Sjekker om det er hverdag mellom 08:00 og 16:00
  const isWeekday = (date = new Date()) => date.getDay() % 6 !== 0
  const isDaytime = (date = new Date()) => date.getHours() >= 8 && date.getHours() < 16

  if (!isWeekday() || !isDaytime()) {
    return 'Nora er tilgjengelig på hverdager mellom 08:00 og 16:00. Prøv igjen senere.'
  }
  const modelIndex = models.findIndex((model) => model.metadata.navn === 'NoraLLM - 🇳🇴')
  const payload = models[modelIndex].params
  payload.question = userParams.message
  const accessToken = await getHuginToken()
  const response = await axios.post(`${aiApiUri}/noraChat`, payload, {
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  })

  return response.data
}
