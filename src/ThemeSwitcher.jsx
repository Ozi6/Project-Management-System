import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function ThemeSwitcher() {
    const { t } = useTranslation(); // Call the useTranslation hook here inside the component
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const themes = ["light", "dark", "pink"];

    return (
        <div className="relative">
            <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="text-white text-xs lg:text-sm px-2 py-1 pr-8 rounded-md border border-solid border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)] transition-all duration-300 appearance-none"
                style={{backgroundColor: "var(--features-icon-color)"}}
            >
                {themes.map((themeKey) => (
                    <option key={themeKey} value={themeKey}>
                        {t(`theme.${themeKey}`).charAt(0).toUpperCase() + t(`theme.${themeKey}`).slice(1)}
                    </option>
                ))}
            </select>

            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
                &#9662; {/* Down Arrow */}
            </span>
        </div>
    );
}

export default ThemeSwitcher;
