import axios from "axios";
import { server } from "../server"

export const uploadImage = async (img) => {

    let imgUrl = null;

    const formData = new FormData();
    formData.append("img", img);

    await axios.post(`${server}`+ "/upload" , formData).
    then(({ data }) => {
        console.log(`value of data`, data)
        console.log(`value of data.img`, data.img)
        imgUrl = data.img
        console.log(`value of imgUrl`, imgUrl)
    }).catch(({ response }) => {
        // toast.error(response.data.error)
        console.log(`value of response.data.error`, response.data.error)
    })

    return imgUrl;
}

