
import os
import cloudinary
import cloudinary.uploader
import logging
from dotenv import load_dotenv

class CloudUploader:
    def __init__(self):
        """
        Initializes the Cloudinary Uploader.
        It configures the cloudinary client using environment variables.
        """
        try:
            load_dotenv()
            self.cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
            self.api_key = os.getenv("CLOUDINARY_API_KEY")
            self.api_secret = os.getenv("CLOUDINARY_API_SECRET")

            if not all([self.cloud_name, self.api_key, self.api_secret]):
                logging.warning("CLOUDUPLOADER-WARN: Cloudinary credentials not fully set in .env file. Uploads will be skipped.")
                self.configured = False
            else:
                cloudinary.config(
                    cloud_name=self.cloud_name,
                    api_key=self.api_key,
                    api_secret=self.api_secret
                )
                self.configured = True
                logging.info("CLOUDUPLOADER: Cloudinary uploader configured successfully.")

        except Exception as e:
            logging.error(f"CLOUDUPLOADER-ERROR: Failed to initialize Cloudinary config: {e}")
            self.configured = False

    def upload_evidence(self, file_path, public_id):
        """
        Uploads an audio file to a specific folder in Cloudinary.

        Args:
            file_path (str): The local path to the audio file.
            public_id (str): The desired unique ID for the file in Cloudinary.

        Returns:
            str: The secure URL of the uploaded file, or None if the upload fails.
        """
        if not self.configured:
            logging.warning("CLOUDUPLOADER-WARN: Skipping upload because Cloudinary is not configured.")
            return None
        
        if not os.path.exists(file_path):
            logging.error(f"CLOUDUPLOADER-ERROR: File not found for upload: {file_path}")
            return None

        try:
            logging.info(f"CLOUDUPLOADER: Uploading {public_id} to Cloudinary folder 'locker'...")
            # For audio/video files, resource_type should be 'video'
            upload_result = cloudinary.uploader.upload(
                file_path,
                public_id=public_id,
                folder="locker",
                resource_type="video" 
            )
            
            secure_url = upload_result.get("secure_url")
            if secure_url:
                logging.info(f"CLOUDUPLOADER: Upload successful. URL: {secure_url}")
                return secure_url
            else:
                logging.error(f"CLOUDUPLOADER-ERROR: Upload failed. No secure_url in result: {upload_result}")
                return None

        except Exception as e:
            logging.error(f"CLOUDUPLOADER-ERROR: An exception occurred during upload: {e}")
            return None

