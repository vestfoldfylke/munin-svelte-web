// Bibliotek for å håndtere API-kall til AZF-funksjoner
import axios from 'axios'
import { models } from "$lib/data/models"; // Modellkonfigurasjon
import { getHuginToken } from '../useApi'

export const multimodalMistral = async (userParams) => {
    const modelIndex = models.findIndex((model) => model.metadata.navn === 'Mistral')
    const payload = models[modelIndex].params

    payload.message = userParams.message
    payload.messageHistory = userParams.messageHistory
    payload.kontekst = userParams.kontekst
    payload.temperatur = userParams.temperatur
    payload.bilde_base64String = userParams.imageB64

    const accessToken = await getHuginToken()

    const response = await axios.post(`${import.meta.env.VITE_AI_API_URI}/multimodalMistral`, payload, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }