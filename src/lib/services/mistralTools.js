// Bibliotek for å håndtere API-kall til AZF-funksjoner
import axios from 'axios'
import { models } from '$lib/data/models' // Modellkonfigurasjon
import { getHuginToken } from '../useApi'

const { VITE_AI_API_URI: aiApiUri } = import.meta.env

export const multimodalMistral = async (userParams) => {
  // Henter basis-konfigurasjon fra models.js og supplerer med brukerens parametre
  console.log('multimodalMistral', userParams.model)
  let modelIndex
  if (userParams.model == 'pixtral-large-latest') {
    modelIndex = models.findIndex((model) => model.id === '13')
  } else if (userParams.model == 'magistral-medium-2506') {
    modelIndex = models.findIndex((model) => model.id === '20')
  }
  console.log('modelIndex', modelIndex)
  const payload = models[modelIndex].params
  payload.message = userParams.message
  payload.messageHistory = userParams.messageHistory
  payload.kontekst = userParams.kontekst
  payload.temperatur = userParams.temperatur
  payload.bilde_base64String = userParams.imageB64

  const accessToken = await getHuginToken()

  const response = await axios.post(`${aiApiUri}/multimodalMistral`, payload, {
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  })
  return response.data
}
