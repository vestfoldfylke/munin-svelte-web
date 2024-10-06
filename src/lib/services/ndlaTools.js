import axios from 'axios'

export const getArticlesFromNDLA = async (searchString) => {
    const params = {
        "query": searchString,
        "page": 1,
        "page-size": 10,
        "language": "nb",
        "grep-codes": ["KE234","KE235","KM2652","KM2651","KM2627","KM2649","KM2648","KM2647","KM2646","KM2645"],
        "resource-type": "urn:resourcetype:academicArticle"
    }
    console.log(params)
    const response = await axios.get(`https://api.ndla.no/search-api/v1/search`, {
        params: params
    })
    return [response.data.results[0], response.data.results[1], response.data.results[2]]
    }