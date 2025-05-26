import nltk
import shutil
shutil.rmtree("C:/Users/LENOVO/AppData/Roaming/nltk_data/tokenizers/punkt", ignore_errors=True)

nltk.download('punkt', download_dir="C:/Users/LENOVO/AppData/Roaming/nltk_data/tokenizers/punkt")
nltk.data.path.append("C:/Users/LENOVO/AppData/Roaming/nltk_data/tokenizers/punkt")