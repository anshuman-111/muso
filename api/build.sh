set -o errexit  # exit on error

pip install -r requirements.txt

python MusoAPI/manage.py makemigrations
python MusoAPI/manage.py migrate