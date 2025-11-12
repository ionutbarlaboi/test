"use client";
import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.async = true;
    document.body.appendChild(addScript);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "ro", // limba originală
          layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL, // bara standard
        },
        "google_translate_element"
      );
    };
  }, []);

  return <div id="google_translate_element"></div>; // bara vizibilă
}
