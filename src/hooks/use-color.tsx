import { useEffect, useState } from "react";

type Color = 'default' | 'red' | 'blue' | 'green' | 'orange';

const useColor = () => {
    const [_color, _setColor] = useState<Color>('default');

    function setColor(colorName: Color) {
        document.body.classList.remove('theme-red', 'theme-red', 'theme-blue', 'theme-green', 'theme-orange');
        if (colorName !== 'default') {
            document.body.classList.add(`theme-${colorName}`, 'dark');
        }

        // Save the selected theme in local storage
        localStorage.setItem('color', colorName);
        _setColor(colorName);
    }

    useEffect(() => {
        function loadColor() {
            const savedTheme = localStorage.getItem('color') || 'default';
            setColor(savedTheme as Color);
        }
        loadColor();
    }, []);

    return { setColor, color: _color };
};

export default useColor;
