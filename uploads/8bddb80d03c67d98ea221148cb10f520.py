import os
import glob
import time
from SimpleCV import *

print __doc__

#Settings
my_images_path = "/home/encima/PhD/images/100RECNX/" #put your image path here if you want to override current directory
extension = "*.JPG"


path = my_images_path

imgs = list() #load up an image list
directory = os.path.join(path, extension)
files = glob.glob(directory)
files.sort()
# print files
# for file in files:
print files[0]
new_img = Image(files[0])
img2 = Image(files[0])
img3 = Image(files[3])
# total = img1 + img2 + img3
# total.show()
# time.sleep(2)
# animal = img3 - img1
# animal.show()
# time.sleep(2)
width = new_img.size()[0]
height = new_img.size()[1]

# Crop image to remove bars at top and bottom
new_img = new_img.crop(0, 30, width, (height-60))
blobs = new_img.findBlobs()


if blobs:
	map( lambda b:b.draw(), filter( lambda b: b.area() > 150, blobs ) )
	new_img.show()
	time.sleep(5)