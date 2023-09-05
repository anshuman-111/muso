# FETCH IMAGES FROM S3 FOR MATCHING

import boto3
import os
from dotenv import load_dotenv
import numpy as np
import cv2
from io import BytesIO
from .matcher import match_images
load_dotenv()
aws_access_key_id = os.getenv("AWS_S3_ACCKEY")
aws_secret_key = os.getenv("AWS_S3_SECRET")
bucket = os.getenv("AWS_S3_BUCKET")
s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_key)


def renter_folder_exists(rental_id):
    renter_res = s3.list_objects_v2(Bucket=bucket, Prefix=f'{rental_id}/renter')
    owner_res = s3.list_objects_v2(Bucket=bucket, Prefix=f'{rental_id}/owner')
    
    if(renter_res.get('Contents') and owner_res.get('Contents')):
        return (True, renter_res.get('Contents', []), owner_res.get('Contents', []))
    return False


def fetch_from_s3(rental_id):
    try:
        exists, renter_image_paths, owner_image_paths = renter_folder_exists(rental_id)
    except TypeError:
        print("Owner or Renter not found")
        return False
    aligned = {
        'owner' : {
            'front': '',
            'back' : '',
            'left' : '',
            'right' : ''
            }, 
        'renter' : {
            'front': '',
            'back' : '',
            'left' : '',
            'right' : ''
            }
               
        }

    
    # Remove -1 for production
    if(exists and len(renter_image_paths)==len(owner_image_paths)):
        for image in renter_image_paths:
            label = image['Key'].split('/')[-1].split('.')[0]
            if(label in aligned['renter']):    
                renter_image_res = s3.get_object(Bucket=bucket, Key=image['Key'])
                image = renter_image_res['Body'].read()
                aligned['renter'][label] = convert_to_bytes(image)
                
            
        for image in owner_image_paths:
            label = image['Key'].split('/')[-1].split('.')[0]
            if(label in aligned['owner']):    
                owner_image_res = s3.get_object(Bucket=bucket, Key=image['Key'])
                image = owner_image_res['Body'].read()
                aligned['owner'][label] = convert_to_bytes(image)
            
        return aligned
    return False  


def display_image(img):
        cv2.imshow('Image', img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

def convert_to_bytes(image):
    img_arr = np.asarray(bytearray(image), dtype=np.uint8)
    bytes_img = cv2.imdecode(img_arr, cv2.IMREAD_GRAYSCALE)
    return bytes_img
    

def resize_images(aligned):
    
    for key in aligned['owner']:
        
        target = aligned['renter'][key]
        ref = aligned['owner'][key]
        aligned['renter'][key] = cv2.resize(target, (ref.shape[1], ref.shape[0]))

    return aligned


def run_matching(rental_id):
    try:
        aligned = fetch_from_s3(rental_id)
        resized = resize_images(aligned)

        ssim_scoresheet = {
            'front': 0,
            'back' : 0,
            'left' : 0,
            'left2right': 0,
            'right2left' : 0,
            'right' : 0
        }
        for label in resized['owner']:
            if label=='left':
                ssim_scoresheet['left2right'] = match_images(resized['owner']['left'], resized['renter']['right'])
            if label=='right':
                ssim_scoresheet['right2left'] = match_images(resized['owner']['right'], resized['renter']['left'])
            ssim_scoresheet[label] = match_images(resized['owner'][label], resized['renter'][label])
        return ssim_scoresheet
    except:
        raise TypeError("Matching could not be performed")