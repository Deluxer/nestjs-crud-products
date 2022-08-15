export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    
    if(!file) return callback( new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtension = ['jpg', 'png', 'gif', 'jpeg'];
    if(validExtension.includes(fileExtension)){
        callback(null, true);
    }
    
    callback(null, false);
}