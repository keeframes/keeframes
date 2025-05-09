from PIL import Image # pillow === PIL
import numpy as np
from sklearn.cluster import KMeans
from flask import send_file
import io

# TODO: NEED TO FINISH THE COMPRESSION FOR IMGs and VIDEOS
def img_compression(image, name):
    # opens and processes the image
    im = Image.open(image)
    im = im.convert('RGB') # conv image to RGB mode
    im_ar = np.array(im)
    height, width, _ = im_ar.shape # dynamically get the dimensions -> numpy (height, width, 3(RGB))

    # this reshapes the image into a 2D array
    pixels = im_ar.reshape(height * width, 3) # 3 ===> the 3 RGB colour channels

    # KMeans clustering for the compression alg
    KM = KMeans(n_clusters=16, max_iter=300000) # this is a kmeans cluster which includes 16 colours and a high max iteration limit
    KM.fit(pixels) # fits the KMean compression model to fit the pixels of the image

    # indexes the pixel data and RGB values
    pixel_centroid = KM.labels_ 
    cluster_centers = KM.cluster_centers_
            
    # Create a new image from cluster centers
    final = np.zeros_like(pixels) # empty array to store new pixel values
    for i in range(16): 
        final[pixel_centroid == i] = cluster_centers[i] # replaces each pixel with the cluster's 
                
    compressed_im = final.reshape(height, width, 3)
    compressed_image = Image.fromarray(np.uint8(compressed_im))
            
    # Save the compressed image to a buffer
    buffer = io.BytesIO()
    compressed_image.save(buffer, format="PNG")
    buffer.seek(0)
            
    # return as a the buffer instance ready for s3 
    return buffer 


