import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

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
    }, [language]);

    const themes = ["light", "dark", "pink"];
    const languages = [
        { code: "en", label: "English" },
        { code: "tr", label: "Türkçe" }
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng); // This will update the language globally
        localStorage.setItem("language", lng); // Store it so it persists
      };

    return (
        <div className="relative flex gap-4">
            {/* Theme Selection */}
            <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="text-white text-xs lg:text-sm px-2 py-1 pr-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)] transition-all duration-300 appearance-none"
                style={{backgroundColor: "var(--features-icon-color)"}}
            >
                {themes.map((themeKey) => (
                    <option key={themeKey} value={themeKey}>
                        {t(`theme.${themeKey}`)}
                    </option>
                ))}
            </select>

            {/* Language Selection */}
            <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="text-white text-xs lg:text-sm px-2 py-1 pr-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)] transition-all duration-300 appearance-none"
                style={{backgroundColor: "var(--features-icon-color)"}}
            >
                {languages.map(({ code, label }) => (
                    <option key={code} value={code}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ThemeSwitcher;
