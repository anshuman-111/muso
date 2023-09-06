

import AWS from "aws-sdk";
const handleFileUploadToS3 = async (files, rentalId, type) => {

    try{

        
        const S3ServiceObj = new AWS.S3()
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
        
        await S3ServiceObj.headObject({Bucket: import.meta.env.VITE_AWS_S3_BUCKET, Key: foldername}).promise().catch(async (err) => {
            if(err.code==="Not Found") {
                await S3ServiceObj.putObject({Bucket: import.meta.env.VITE_AWS_S3_BUCKET, Key: foldername}).promise()
            }
        })


        files.forEach( file => {
            if(file && file.name!==undefined && file.name.length > 0){
                const path = foldername + file.name
            console.log(path)
            S3ServiceObj.upload({ Bucket: import.meta.env.VITE_AWS_S3_BUCKET, Key: path, Body: file}).promise().catch(async (err) => {
                console.log(err)
            })
            }
            
        });
        console.log("created")
   

    }catch(err){
        console.log(err)

    }
}


export default handleFileUploadToS3;