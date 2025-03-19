# Digital Sankalpa

## How to Start the Server

Follow these steps to start the server for the Digital Sankalpa project:

### Prerequisites

Make sure you have the following installed:
- Python (v3.8 or higher)
- pip (v20 or higher)
- Django (v3.1 or higher)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/hehenischal/digital-sankalpa.git
    ```
2. Navigate to the project directory:
    ```sh
    cd digital-sankalpa
    ```
3. Create a virtual environment:
    ```sh
    python -m venv env
    ```
4. Activate the virtual environment:
    - On Windows:
        ```sh
        .\env\Scripts\activate
        ```
    - On macOS/Linux:
        ```sh
        source env/bin/activate
        ```
5. Install the dependencies:
    ```sh
    pip install -r requirements.txt
    ```

### Starting the Server
1. Setup Database in `settings.py` file
    ```py 
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': <database_name>,
            'USER': <database_user>,
            'PASSWORD': <database_password>,
            'HOST': <database_url>,
            'PORT': <port number>,
        }
    }
    ```

2. Apply the migrations:
    ```sh
    python manage.py migrate
    ```
3. Create Superuser:
    ```sh
    python manage.py createsuperuser
    ```
4. Start the server:
    ```sh
    python manage.py runserver
    ```
5. Open your browser and navigate to `http://localhost:8000/admin` to see the admin Panel.

### DOCUMENTATION FOR API ENDPOINTS
- Look for Documentation.md inside orders/ , products/ , accounts/ 

### Troubleshooting

- If you encounter any issues, check the console for error messages.
- Ensure all dependencies are installed correctly by running `pip install -r requirements.txt` again.

