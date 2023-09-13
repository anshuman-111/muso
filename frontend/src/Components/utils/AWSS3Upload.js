
import { S3Client, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

const handleFileUploadToS3 = async (files, rentalId, type) => {

    try{

        
        const S3ServiceObj = new S3Client({
            credentials: {
                accessKeyId: import.meta.env.VITE_AWS_S3_ACCKEY,
			secretAccessKey: import.meta.env.VITE_AWS_S3_SECRET,
            },
			
			region: import.meta.env.VITE_AWS_S3_REGION,
		},);

        var foldername = rentalId.toString()
        if(type==='display'){
            foldername = rentalId.toString()+"/display/"
        }else if(type==="creation"){
            foldername = rentalId.toString()+"/owner/"
        }else if(type==="completion"){
            foldername = rentalId.toString()+"/renter/"
        }else{
            throw new Error("Error occured! Tried to create folder without type.")
        }
        
        const headObject = new HeadObjectCommand({Bucket: import.meta.env.VITE_AWS_S3_BUCKET, Key: foldername})
        const putObject = new PutObjectCommand({Bucket: import.meta.env.VITE_AWS_S3_BUCKET, Key: foldername})
        await S3ServiceObj.send(headObject).catch(async (err) => {
            if(err.name==="NotFound") {
                await S3ServiceObj.send(putObject)
            }
        })

        files.forEach( file => {
            if(file && file.name!==undefined && file.name.length > 0){
                const path = foldername + file.name
                const putFile = new PutObjectCommand({Bucket: import.meta.env.VITE_AWS_S3_BUCKET, Key: path, Body: file})
            
            S3ServiceObj.send(putFile).catch(async (err) => {
                console.log(err)
            })
            }
            
        });
      
   

    }catch(err){
        console.log(err)

    }
}


export default handleFileUploadToS3;