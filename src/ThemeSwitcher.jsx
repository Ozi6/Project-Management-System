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
                        className={`theme-icon theme-${themeKey}`}
                        style={{ "--theme-color": getThemeColor(themeKey) }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 24 24">
                            {/* Heart for Pink theme */}
                            {themeKey === "pink" && (
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            )}
                            {/* Moon for Dark theme */}
                            {themeKey === "dark" && (
                                <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"/>
                            )}
                            {/* Star for Light/Default theme */}
                            {(themeKey === "light" || themeKey === "default") && (
                                <>
                                    <path d="M12 3V2M12 22V21M21 12H22M2 12H3M18.5 5.5L20 4M4 20L5.5 18.5M4 4L5.5 5.5M18.5 18.5L20 20" stroke="#888888" strokeWidth="2" strokeLinecap="round"/>
                                    <circle cx="12" cy="12" r="5" />
                                </>
                            )}

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
