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
    
    img_diff = cv2.absdiff(proc_owner_image, proc_renter_image)
    noise_suppressed = cv2.GaussianBlur(img_diff, (5,5), 0)
    
    edges = cv2.Canny(noise_suppressed, threshold1=30, threshold2=70)
    edge_mask = np.where(edges > 0, 255, 0).astype(np.uint8)
    score = score_calculator(proc_owner_image, proc_renter_image)

    return score
    
def score_calculator(owner_img, renter_img):
    '''
    Calculate and store match score
    '''

    similarity_score = metrics.structural_similarity(owner_img, renter_img) * 100
    rounded = "{:.3f}".format(similarity_score)
    return float(rounded)

def remove_background(img):
    #grayscale = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY)
    _, thresholded = cv2.threshold(img, 100, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresholded, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    mask = np.zeros_like(img)
    cv2.drawContours(mask, contours, -1, (255, 255, 255), thickness=cv2.FILLED)
    result = cv2.bitwise_and(img, mask)
    return result
# DETERMINE MATCH SCORE AND STORE IT IN DATABASE FOR PARTICULAR RENTAL