#!/usr/bin/env python3
import os
import sys

# Add the directory containing your app to the Python path
sys.path.insert(0, "/var/www/app")

# Import your app as application
from backend import app as application
