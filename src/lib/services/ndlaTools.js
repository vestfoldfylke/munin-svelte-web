import axios from 'axios'

export const getArticlesFromNDLA = async (searchString) => {

    const params = {
        query: searchString,
        page: 1,
        "page-size": 10,
        articleType: "standard"
    }
    console.log(params)
    const response = await axios.get(`https://api.ndla.no/article-api/v2/articles/?query=${searchString}&page=1&pageSize=3&articleType=standard`)
    return [response.data.results[0], response.data.results[1], response.data.results[2]]
    }