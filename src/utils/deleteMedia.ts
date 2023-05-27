const path = require('path')
const fs = require('fs')
export default async function deleteMedia(mediaSrc: string | undefined, pathSrc: "talks" | 'userPhotos') {
    let myPathSrc
    switch (pathSrc) {
        case "talks":
            myPathSrc = "/src/assets/talks/"
            break
        case "userPhotos":
            myPathSrc = "/src/assets/users/profilePics/"
    }
    if (mediaSrc != undefined) {
        let mediaPath = path.join(process.cwd(), myPathSrc + mediaSrc)
        await fs.unlink(mediaPath, () => {
            return
        });
    }
}