import axiosInstance from "../../axios"

export async function PlayResumeStreaming(accessToken: string, context_uri?: string, track_uris?: string[] ){
    if(context_uri && track_uris) {
        return axiosInstance.put("/me/player/play", {
            context_uri: context_uri,
            uris: track_uris
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": 'application/json'
            }
        })
    
    }    
    else if(context_uri){
            return axiosInstance.put("/me/player/play", {
                context_uri: context_uri
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": 'application/json'
                }
            })
        }
        else if(track_uris){
            return axiosInstance.put("/me/player/play", {
                uris: track_uris
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": 'application/json'
                }
            })
        }else{
            return axiosInstance.put("/me/player/play", {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
        }
   
}

export default PlayResumeStreaming