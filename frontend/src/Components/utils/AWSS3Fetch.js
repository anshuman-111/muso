import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'


export const handleFileDownloadFromS3 = async (rentalId, type) => {
    
    const S3ServiceObj = new S3Client({
        credentials: {
            accessKeyId: import.meta.env.VITE_AWS_S3_ACCKEY,
        secretAccessKey: import.meta.env.VITE_AWS_S3_SECRET,
        },
        
        region: import.meta.env.VITE_AWS_S3_REGION,
    },);
    var foldername = rentalId.toString()
    const filesObj = {}
    if(type==="creation"){
        foldername = rentalId.toString()+"/owner/"
    }else if(type==="completion"){
        foldername = rentalId.toString()+"/renter/"
    }else{
        throw new Error("Error occured! Tried to fetch from folder without type.")
    }
    const listObjects = new ListObjectsV2Command({ Bucket: import.meta.env.VITE_AWS_S3_BUCKET, Prefix: foldername })
    await S3ServiceObj.send(listObjects).then((data)=>{
        data.Contents.forEach((file)=> {
            const key = file.Key.split('/').pop().split('.')[0]
            if(key.length > 0){
                filesObj[key] = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
                import.meta.env.VITE_AWS_S3_REGION
            }.amazonaws.com/${file.Key}`
            }
        })
    }).catch((err) => console.log(err))
   
    return filesObj
}