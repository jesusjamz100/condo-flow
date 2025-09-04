
const NotFoundPage = () => {

    return (
        <div className="not-found">
            <p className="text-2xl">Página no encontrada</p>
            <div className="flex gap-5">
                <p><a href="/" className="hover:cursor-pointer">Volver al inicio</a></p>
            </div>
        </div>
    );
};

export default NotFoundPage;