export function button(text, url) {
    if (!url) {
        return '';
    }
    
    const style =
        'background-color: #4f2d7f;' + 
        'color: white;' +
        'padding: 0.5rem;' +
        'border: 0.1rem solid black;' +
        'border-radius: 0.5rem;' +
        'font-size: 1.2rem;';

    return `<a href=${url} style="${style}">${text}</a>`;
}
