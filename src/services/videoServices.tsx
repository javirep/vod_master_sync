import { VideoModel } from "../models/VideoModel";
import { ApiResponseType } from "./servicesTypes";


export const saveVideos = async (videos: VideoModel[]) => {
    try {
        const response = await fetch('/api/videos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( videos )
        })
        const responseJson: ApiResponseType = await response.json()

        if (responseJson.success) {
            //const { data } : { data: VideoModel[] } = responseJson
            return true
        }
        else return false
    }
    catch (error) {
        console.error('Error saving videos', error)
        return false
    }
}
