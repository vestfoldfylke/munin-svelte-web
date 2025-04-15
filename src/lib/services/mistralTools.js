// Bibliotek for å håndtere API-kall til AZF-funksjoner
import axios from 'axios'
import { models } from "$lib/data/models"; // Modellkonfigurasjon
import { getHuginToken } from '../useApi'

export const multimodalMistral = async (userParams) => {
    // Template API-call
    console.log('multimodalMistrallll: ', models)
    console.log('multimodalMistral userParams: ', userParams.valgtModell)
    const m_params = models[1].params;
    console.log('multimodalMistral m_params: ', m_params)

    const payload = models[1].params

    payload.message = userParams.message
    payload.messageHistory = userParams.messageHistory
    payload.kontekst = userParams.kontekst
    payload.temperatur = userParams.temperatur
    payload.bilde_base64String = userParams.imageB64

    console.log('multimodalMistral', payload)

    const accessToken = await getHuginToken()
    // Call AZF-funksjon with payload
    const response = await axios.post(`${import.meta.env.VITE_AI_API_URI}/multimodalMistral`, payload, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }