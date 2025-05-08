from PIL import Image # pillow === PIL
import numpy as np
from sklearn.cluster import KMeans
from flask import send_file

# TODO: NEED TO FINISH THE COMPRESSION FOR IMGs and VIDEOS
def img_compression(image, name):
    # opens and processes the image
    im = Image.open(image)
    im = im.convert('RGB') # conv image to RGB mode
    im_ar = np.array(im)
    height, width = im_ar.shape # dynamically get the dimensions

    # this reshapes the image into a 2D array
    pixels = im_ar.reshape(height * width, 3)

    # KMeans clustering for the compression alg
    KM = KMeans(n_clusters=16, max_iter=300000)
    KM.fit(pixels)
    pixel_centroid = KM.labels_
    cluster_centers = KM.cluster_centers_
            
    # Create a new image from cluster centers
    final = np.zeros_like(pixels)
    for i in range(16):
        final[pixel_centroid == i] = cluster_centers[i]
                
    compressed_im = final.reshape(height, width, 3)
    compressed_image = Image.fromarray(np.uint8(compressed_im))
            
    # Save the compressed image to a buffer
    buffer = io.BytesIO()
    compressed_image.save(buffer, format="PNG")
    buffer.seek(0)
            
    # Return the compressed image as a downloadable file
    return send_file(buffer, as_attachment=True, download_name=name, mimetype='image/png')


