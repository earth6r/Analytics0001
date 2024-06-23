import { useEffect, useState } from "react";

type Color = 'default' | 'red' | 'blue' | 'green' | 'orange';
type Theme = 'system' | 'light' | 'dark';

const pieColors = {
    "blue": [
        "rgba(25, 25, 112, 1)", // midnight blue
        "rgba(0, 0, 255, 1)", // blue
        "rgba(70, 130, 180, 1)", // steel blue
        "rgba(135, 206, 235, 1)", // sky blue
        "rgba(240, 248, 255, 1)", // alice blue
        "rgba(70, 130, 180, 1)", // steel blue
    ],
    "red": [
        "rgba(139, 0, 0, 1)", // dark red
        "rgba(255, 0, 0, 1)", // red
        "rgba(220, 20, 60, 1)", // crimson
        "rgba(178, 34, 34, 1)", // fire brick
        "rgba(255, 69, 0, 1)", // red orange
        "rgba(255, 99, 71, 1)", // tomato
    ],
    "green": [
        "rgba(0, 128, 0, 1)", // green
        "rgba(0, 255, 0, 1)", // lime
        "rgba(0, 255, 127, 1)", // spring green
        "rgba(173, 255, 47, 1)", // green yellow
        "rgba(152, 251, 152, 1)", // pale green
        "rgba(143, 188, 143, 1)", // dark sea green
    ],
    "orange": [
        "rgba(255, 165, 0, 1)", // orange
        "rgba(255, 140, 0, 1)", // dark orange
        "rgba(255, 127, 80, 1)", // coral
        "rgba(255, 99, 71, 1)", // tomato
        "rgba(255, 69, 0, 1)", // red orange
        "rgba(255, 0, 0, 1)", // red
    ],
    "black": [
        "rgba(0, 0, 0, 1)", // black
        "rgba(105, 105, 105, 1)", // dim gray
        "rgba(128, 128, 128, 1)", // gray
        "rgba(169, 169, 169, 1)", // dark gray
        "rgba(192, 192, 192, 1)", // silver
        "rgba(211, 211, 211, 1)", // light gray
    ],
    "white": [
        "rgba(255, 255, 255, 1)", // white
        "rgba(245, 245, 245, 1)", // white smoke
        "rgba(220, 220, 220, 1)", // gainsboro
        "rgba(211, 211, 211, 1)", // light gray
        "rgba(192, 192, 192, 1)", // silver
        "rgba(169, 169, 169, 1)", // dark gray
    ],
}

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

    return {
        color: _color, setColor, theme: _theme, setTheme, chartColor: _color === 'default' ? (_theme === "dark" ? "white" : "dark") : _color, pieColors: _color === 'default' ? pieColors[
            _theme === 'dark' ? 'white' : 'black'
        ] : pieColors[_color]
    };
};

export default useColor;
