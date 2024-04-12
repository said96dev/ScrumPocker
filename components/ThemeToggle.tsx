'use client';
import { useState } from 'react';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';

const themes = {
    garden: 'garden',
    forest: 'forest',
};

const ThemeToggle = () => {
    const [theme, setTheme] = useState(themes.garden);

    const toggleTheme = () => {
        const newTheme = theme === themes.garden ? themes.forest : themes.garden;
        document.documentElement.setAttribute('data-theme', newTheme);
        setTheme(newTheme);
    };
    return (
        <button onClick={toggleTheme} className='btn btn-ghost btn-circle'>
            {theme === 'garden' ? (
                <BsMoonFill className='h-4 w-4' />
            ) : (
                <BsSunFill className='h-4 w-4' />
            )}
        </button>
    );
};
export default ThemeToggle;