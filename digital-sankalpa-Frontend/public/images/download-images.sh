#!/bin/bash

# Create images directory if it doesn't exist
mkdir -p /Users/muraripathak/Desktop/Digital-Sankalpa-FYP/digital-sankalpa-Frontend/public/images

# Download sample images
curl -o hero-printer-1.jpg "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80"
curl -o hero-printer-2.jpg "https://images.unsplash.com/photo-1585298723682-7115561c51b7?auto=format&fit=crop&w=800&q=80"
curl -o hero-ink.jpg "https://images.unsplash.com/photo-1563199284-752b7b17578a?auto=format&fit=crop&w=800&q=80"
curl -o hero-accessories.jpg "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80"
curl -o category-printers.jpg "https://images.unsplash.com/photo-1607478900766-efe13248b125?auto=format&fit=crop&w=800&q=80"
curl -o category-accessories.jpg "https://images.unsplash.com/photo-1586074299757-dc655f18518c?auto=format&fit=crop&w=800&q=80"
curl -o category-ink.jpg "https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=800&q=80"
