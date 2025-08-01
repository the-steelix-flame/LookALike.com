from http.server import BaseHTTPRequestHandler
import json
from deepface import DeepFace
import base64
import numpy as np
import cv2

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)

            image_base64 = data.get('image_base64')
            if not image_base64:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'No image_base64 provided'}).encode('utf-8'))
                return

            if ',' in image_base64:
                image_base64 = image_base64.split(',')[1]

            img_bytes = base64.b64decode(image_base64)
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # FIX: We will now handle the face detection error gracefully.
            # We set enforce_detection to False.
            embedding_objs = DeepFace.represent(
                img_path=img, 
                model_name='ArcFace',
                detector_backend='retinaface',
                enforce_detection=False # This will now return an empty list instead of crashing.
            )
            
            # Check if a face was actually detected and an embedding was created.
            if not embedding_objs or 'embedding' not in embedding_objs[0]:
                # If no face is found, we send a specific error message back.
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Face could not be detected in the image.'}).encode('utf-8'))
                return

            embedding = embedding_objs[0]['embedding']

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'embedding': embedding}).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            # Provide a more detailed error for debugging
            self.wfile.write(json.dumps({'error': f"An unexpected error occurred in the AI service: {str(e)}"}).encode('utf-8'))
