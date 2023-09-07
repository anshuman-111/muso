# MATCH FETCHED IMAGES USING CANNY EDGE AND ABSOLUTE PIXEL DIFFERENCE
import cv2
import numpy as np
from skimage import metrics

def match_images(owner_img, renter_img):
    '''
    Match aligned images
    '''
    proc_owner_image = remove_background(owner_img)
    proc_renter_image = remove_background(renter_img)
    
    # Reduce noise using gaussian blur 5x5 convMatrix
    noise_suppressed_owner = cv2.GaussianBlur(proc_owner_image, (5,5), 0)
    noise_suppressed_owner = cv2.GaussianBlur(proc_renter_image, (5,5), 0)
    
    # Canny Edge detection
    edges_owner = cv2.Canny(noise_suppressed_owner, threshold1=100, threshold2=200)
    edges_renter = cv2.Canny(noise_suppressed_owner, threshold1=100, threshold2=200)
    
    # Absolute pixel difference between edges
    diff = np.abs(edges_owner.astype(float) - edges_renter.astype(float))
    
    # Structural Similarity calculator
    ssim = ssim_calc(proc_owner_image, proc_renter_image)
    
    # Combining score to get a more accurate match percentage
    combined_score = (np.mean(diff) + ssim)
  
    return combined_score
    
def ssim_calc(owner_img, renter_img):
    '''
    Calculate and store match score
    '''

    similarity_score = metrics.structural_similarity(owner_img, renter_img) * 100
    rounded = "{:.3f}".format(similarity_score)
    return float(rounded)

def remove_background(img):
   
    _, thresholded = cv2.threshold(img, 100, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresholded, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Creating a black mask of the recognized object
    mask = np.zeros_like(img)
    
    # Fill contours with white
    cv2.drawContours(mask, contours, -1, (255, 255, 255), thickness=cv2.FILLED)
    
    # Subtracting background
    result = cv2.bitwise_and(img, mask)
    return result
