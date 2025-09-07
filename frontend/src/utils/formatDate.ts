

export default function formatDate(dateStr: string) {

    const dateObj = new Date(dateStr);

    return new Intl.DateTimeFormat('es-VE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(dateObj);
}