import os
import sys
import django
import traceback

# Set up Django environment
sys.path.append('/Users/muraripathak/Desktop/Digital-Sankalpa-FYP/digital-sankalpa-Backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DS.settings')
django.setup()

from orders.models import Order
from orders.utils import send_order_receipt
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_receipt_for_order(order_id):
    try:
        # Get the order
        order = Order.objects.get(id=order_id)
        print(f"Found order #{order.uuid} for user {order.user.email}")
        
        # Send receipt
        print(f"Attempting to send receipt to {order.user.email}...")
        send_order_receipt(order)
        print(f"Receipt sent successfully to {order.user.email}!")
        
        return True
    except Order.DoesNotExist:
        print(f"Error: Order with ID {order_id} not found.")
        return False
    except Exception as e:
        print(f"Error sending receipt: {str(e)}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python send_test_receipt.py <order_id>")
        sys.exit(1)
    
    try:
        order_id = int(sys.argv[1])
    except ValueError:
        print("Error: order_id must be an integer")
        sys.exit(1)
    
    success = send_receipt_for_order(order_id)
    if success:
        print("Receipt sent successfully!")
    else:
        print("Failed to send receipt.")
