import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import './styles/LanguageSwitcher.css';
import './styles/ThemeSwitcher.css';
import britishFlag from './assets/flags/british-flag.png';
import turkishFlag from './assets/flags/turkish-flag.png';

function ThemeSwitcher() {
    const { t, i18n } = useTranslation();
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        i18n.changeLanguage(language);
        localStorage.setItem("language", language);
    }, [language, i18n]);

    // Define themes in specific order: light (blue), dark, pink
    const themes = ["light", "dark", "pink"];
    const languages = [
        { code: "en", label: "English" },
        { code: "tr", label: "Türkçe" }
    ];

    const handleLanguageChange = (e) => {
        const newLang = e.target.checked ? "tr" : "en";
        setLanguage(newLang);
    };

    const handleThemeChange = (themeName) => {
        setTheme(themeName);
        
        // Dispatch a custom event for theme changes
        const themeChangeEvent = new CustomEvent('themeChanged', {
            detail: { theme: themeName }
        });
        window.dispatchEvent(themeChangeEvent);
    };

    // Get theme-specific color for each heart
    const getThemeColor = (themeKey) => {
        switch(themeKey) {
            case "light": return "#2563eb"; // Blue
            case "dark": return "#BB86FC"; // Purple - dark theme icon color
            case "pink": return "#d81b60"; // Pink
            default: return "#666";
        }
    };

    return (
        <div className="relative flex gap-4 justify-center items-center">
            {/* Theme Selection with Hearts */}
            <div className="radio">
                {themes.map((themeKey) => (
                    <input
                        key={themeKey}
                        type="radio"
                        name="theme"
                        id={`theme-${themeKey}`}
                        value={themeKey}
                        checked={theme === themeKey}
                        onChange={() => handleThemeChange(themeKey)}
                    />
                ))}
                {themes.map((themeKey) => (
                    <label 
                        key={themeKey} 
                        htmlFor={`theme-${themeKey}`} 
                        title={t(`theme.${themeKey}`)}
                        className={`theme-star theme-${themeKey}`}
                        style={{ "--theme-color": getThemeColor(themeKey) }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                            <path d="M256 448l-30.164-27.211C118.718 322.442 48 258.61 48 179.095 48 114.221 97.918 64 162.4 64c36.399 0 70.717 16.742 93.6 43.947C278.882 80.742 313.199 64 349.6 64 414.082 64 464 114.221 464 179.095c0 79.516-70.719 143.348-177.836 241.694L256 448z"/>
                        </svg>
                    </label>
                ))}
            </div>

            {/* Language Selection with Flag Toggle */}
            <label className="switch">
                <input 
                    id="input" 
                    type="checkbox" 
                    checked={language === "tr"}
                    onChange={handleLanguageChange}
                />
                <div className="slider round">
                    <div className="flag-container">
                        <img 
                            src={britishFlag} 
                            alt="English" 
                            className="flag flag-en"
                        />
                        <img 
                            src={turkishFlag} 
                            alt="Türkçe" 
                            className="flag flag-tr"
                        />
                    </div>
                </div>
            </label>
        </div>
    );
}

export default ThemeSwitcher;
