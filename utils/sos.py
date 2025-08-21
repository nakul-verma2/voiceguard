# send_sos.py
import logging
import sys
import requests

API_URL = "https://api.smsmobileapi.com/sendsms/"
API_KEY = "9128ffa5c5e683d5b606630ff6f59d72541984b3a009865d"  # <-- set this

def setup_logger():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )

def sos(phone):
    setup_logger()

    try:
        if not phone:
            print("Phone number is required.")
            sys.exit(2)

        # Short SOS message (customize if you want)
        message = "SOS: I need help. Please call me back."

        params = {
            "recipients": phone,
            "message": message,
            "apikey": API_KEY,
        }

        logging.info(f"Sending SOS SMS to {phone}")
        resp = requests.get(API_URL, params=params, timeout=15)
        logging.info(f"HTTP {resp.status_code}")
        logging.info(f"URL: {resp.url}")

        try:
            logging.info(f"Response JSON: {resp.json()}")
        except Exception:
            logging.info(f"Response Text: {resp.text[:500]}")

        if resp.ok:
            print("SMS request sent.")
            sys.exit(0)
        else:
            print("SMS request failed. Check logs above.")
            sys.exit(1)

    except requests.RequestException as e:
        logging.error(f"Network/Request error: {e}")
        sys.exit(3)
