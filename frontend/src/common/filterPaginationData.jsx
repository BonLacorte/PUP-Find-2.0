import axios from "axios"
import { server } from "../server"

export const filterPaginationData = async ({ create_new_arr = false, state, data, page, countRoute, data_to_send = { } }) => {

    let obj

    if(state != null && !create_new_arr) {
        obj = { ...state, results: [ ...state.results, ...data ], page: page }
    } else {

        await axios.post(`${server}` + countRoute, data_to_send)
        .then(({ data: { totalDocs } }) => {
            // console.log(`filter.data: `, data)
            obj = { results: data, page: 1, totalDocs }
        })
        .catch(err => {
            // console.log(err)
        })

    }

    return obj
}