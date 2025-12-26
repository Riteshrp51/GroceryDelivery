import multer from "multer";

export const upload = multer({
    storage: multer.diskStorage({})
})

export default upload;