import AWS from 'aws-sdk'


export const handleFileDownloadFromS3 = async (rentalId, type) => {
    
    const S3ServiceObj = new AWS.S3()
    var foldername = rentalId.toString()
    const filesObj = {}
    if(type==="creation"){
        foldername = rentalId.toString()+"/owner/"
    }else if(type==="completion"){
        foldername = rentalId.toString()+"/renter/"
    }else{
        throw new Error("Error occured! Tried to fetch from folder without type.")
    }
    const images = await S3ServiceObj.listObjectsV2({ Bucket: import.meta.env.VITE_AWS_S3_BUCKET, Prefix: foldername }).promise()
    images.Contents.forEach((file)=> {
        const key = file.Key.split('/').pop().split('.')[0]
        filesObj[key] = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
            import.meta.env.VITE_AWS_S3_REGION
        }.amazonaws.com/${file.Key}`
    })
    return filesObj
}