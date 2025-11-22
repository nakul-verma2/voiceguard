# send_sos.py
import logging
import sys
import requests

# It's good practice to get keys from environment variables, but for this example, we keep it here.
API_URL = "https://api.smsmobileapi.com/sendsms/"
API_KEY = "4129d81e09f0b1aa9679f76627ef9d1f22f7b042f7e0c2de"

# Setup logger once
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

def sos(phone):
    """
    Sends an SOS SMS to the given phone number.
    Returns True for success, False for failure.
    """
    try:
        if not phone:
            logging.error("Phone number is required for SOS.")
            return False

        # Customize your SOS message here
        message = "SOS from VoiceGuard: An urgent alert has been triggered. Please check on the user immediately. This is a potential emergency."

        params = {
            "recipients": phone,
            "message": message,
            "apikey": API_KEY,
        }

        logging.info(f"Sending SOS SMS to {phone}")
        resp = requests.get(API_URL, params=params, timeout=15)
        logging.info(f"SMS API Response - Status: {resp.status_code}, URL: {resp.url}")

        try:
            logging.info(f"Response JSON: {resp.json()}")
        except requests.exceptions.JSONDecodeError:
            logging.info(f"Response Text: {resp.text[:500]}")

        if resp.ok:
            logging.info("SMS request sent successfully.")
            return True
        else:
            logging.warning("SMS request failed. Check API response above.")
            return False

    except requests.RequestException as e:
        logging.error(f"Network/Request error while sending SMS: {e}")
        return False
