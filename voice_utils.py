import speech_recognition as sr
import pyttsx3
from gtts import gTTS
import os
from deep_translator import GoogleTranslator
from internship_advisor import recommend_internship
from internship_advisor import get_internship_companies


# 🌐 Supported languages
LANGUAGES = {
    "english": "en",
    "hindi": "hi",
    "tamil": "ta",
    "telugu": "te",
    "kannada": "kn",
    "malayalam": "ml",
    "bengali": "bn"
}


def speech_to_text(lang="en-IN"):
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print(f"🎧 Adjusting for background noise... Please wait.")
        recognizer.adjust_for_ambient_noise(source, duration=1)
        print(f"🎤 Listening now ({lang})... Speak clearly.")
        try:
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=7)
            print("✅ Audio captured, sending to Google API...")
        except sr.WaitTimeoutError:
            print("⏱️ Timeout: No speech detected.")
            return ""

    try:
        text = recognizer.recognize_google(audio, language=lang)
        print(f"📝 You said: {text}")
        return text
    except sr.UnknownValueError:
        print("⚠️ Could not understand audio, please try again.")
        return ""
    except sr.RequestError as e:
        print(f"🌐 Network error: Could not reach Google API. Error: {e}")
        return ""


def text_to_speech(text, lang="en"):
    """Convert text to speech (gTTS → pyttsx3 fallback)."""
    try:
        tts = gTTS(text=text, lang=lang)
        filename = "temp_voice.mp3"
        tts.save(filename)
        os.system(f"start {filename}")  # Windows playback
    except Exception:
        engine = pyttsx3.init()
        engine.say(text)
        engine.runAndWait()


def log_conversation(user_input, recognized_en, answer_en, translated_answer, lang_choice):
    """Save conversations into a log file."""
    with open("conversation_log.txt", "a", encoding="utf-8") as f:
        f.write("User (" + lang_choice.title() + "): " + user_input + "\n")
        f.write("Recognized (English): " + recognized_en + "\n")
        f.write("Answer (English): " + answer_en + "\n")
        if translated_answer != answer_en:
            f.write("Answer (" + lang_choice.title() + "): " + translated_answer + "\n")
        f.write("-" * 50 + "\n")


def speech_to_text(lang="en-IN"):
    """
    Convert speech to text using microphone input.
    lang: language code (e.g., 'en-IN' for English India, 'hi-IN' for Hindi India)
    """
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print(f"🎧 Adjusting for background noise... Please wait.")
        recognizer.adjust_for_ambient_noise(source, duration=1)
        print(f"🎤 Listening now ({lang})... Speak clearly.")
        audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)

    print("✅ Audio captured, sending to Google API...")

    try:
        text = recognizer.recognize_google(audio, language=lang)
        print(f"📝 Google recognized: {text}")
        return text
    except sr.UnknownValueError:
        print("⚠️ Google Speech could not understand audio (maybe unclear or wrong language).")
        return ""
    except sr.RequestError as e:
        print(f"⚠️ Could not request results from Google Speech service: {e}")
        return ""
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return ""


if __name__ == "__main__":
    # 🔹 Step 1: Select language
    print("Choose a language:")
    for i, lang in enumerate(LANGUAGES.keys(), 1):
        print(f"{i}. {lang.title()}")

    choice_num = int(input("Enter your choice: "))
    choice = list(LANGUAGES.keys())[choice_num - 1]
    short_lang = LANGUAGES[choice]

    print(f"✅ You selected: {choice.title()}")

    # 🔹 Step 2: Listen to user
    query = speech_to_text(f"{short_lang}-IN" if short_lang != "en" else "en-IN")

    if query:
        # Translate query → English
        recognized_en = (
            GoogleTranslator(source=short_lang, target="en").translate(query)
            if short_lang != "en"
            else query
        )

        print(f"DEBUG - Recognized query in English: {recognized_en}")

        # Get internship answer in English
        answer_en = recommend_internship(recognized_en)

        # Translate back → user language
        translated_answer = (
            GoogleTranslator(source="en", target=short_lang).translate(answer_en)
            if short_lang != "en"
            else answer_en
        )

        # Show both
        print(f"Answer (EN): {answer_en}")
        if short_lang != "en":
            print(f"Answer ({choice.title()}): {translated_answer}")

        # Save log
        log_conversation(query, recognized_en, answer_en, translated_answer, choice)

        # Speak response
        text_to_speech(translated_answer, lang=short_lang)

        
