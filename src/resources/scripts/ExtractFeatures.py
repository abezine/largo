from PIL import Image
from torch import device, no_grad
from torch.cuda import is_available as cuda_is_available
from torch.hub import load as hub_load
import csv
import json
import sys
import torchvision.transforms as T

# input_json = {
#     cached_filename: {
#         annotation_model_id: [left, top, right, bottom],
#     },
# }

with open(sys.argv[1], 'r') as f:
    input_json = json.load(f)

dinov2_vits14 = hub_load('facebookresearch/dinov2', 'dinov2_vits14')

if cuda_is_available():
    device = device('cuda')
    dinov2_vits14 = dinov2_vits14.cuda()
else:
    device = device('cpu')

dinov2_vits14.to(device)

transform = T.Compose([
    T.Resize((224, 224), interpolation=T.InterpolationMode.BICUBIC),
    T.ToTensor(),
    T.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
])

def normalize_image_mode(image):

    if image.mode == 'RGBA' or image.mode == 'L' or image.mode == 'P':
        image = image.convert('RGB')

    if image.mode =='I':
        import numpy as np
        # I images (32 bit signed integer) need to be rescaled manually before converting.
        image = Image.fromarray(((np.array(image)/(2**16))*2**8).astype(np.uint8)).convert('RGB')

    return image

with open(sys.argv[2], 'w') as f:
    writer = csv.writer(f)
    with no_grad():
        for image_path, annotations in input_json.items():
            image = Image.open(image_path)
            image = normalize_image_mode(image)
            for model_id, box in annotations.items():
                image_crop = image.crop(box)
                image_crop_t = transform(image_crop).unsqueeze(0).to(device)
                features = dinov2_vits14(image_crop_t)
                writer.writerow([model_id, json.dumps(features[0].tolist())])
