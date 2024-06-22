import { useEffect, useState } from "react";

type Color = 'default' | 'red' | 'blue' | 'green' | 'orange';
type Theme = 'system' | 'light' | 'dark';

const useColor = () => {
    const [_color, _setColor] = useState<Color>('default');
    const [_theme, _setTheme] = useState<Theme>('system');

    function setColor(colorName: Color) {
        document.body.classList.remove('theme-red', 'theme-red', 'theme-blue', 'theme-green', 'theme-orange');
        if (colorName !== 'default') {
            document.body.classList.add(`theme-${colorName}`);
        }

        // Save the selected theme in local storage
        localStorage.setItem('color', colorName);
        _setColor(colorName);
    }

    function setTheme(themeName: Theme) {
        document.body.classList.remove('dark', 'light');
        if (themeName !== 'system') {
            document.body.classList.add(themeName);
        }
        // Save the selected theme in local storage
        localStorage.setItem('theme', themeName);
        _setTheme(themeName);
    }

    useEffect(() => {
        function loadColor() {
            const savedTheme = localStorage.getItem('color') || 'default';
            setColor(savedTheme as Color);
        }

        function loadTheme() {
            const savedTheme = localStorage.getItem('theme') || 'system';
            setTheme(savedTheme as Theme);
        }
        loadColor();
        loadTheme();
    }, []);

    return { color: _color, setColor, theme: _theme, setTheme };
};

export default useColor;
