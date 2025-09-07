
interface PageTitleProps {
    title: string
}

const PageTitle = ({title}: PageTitleProps) => {

    return (
        <div className="mb-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">{title}</h2>
            <div className="h-1 w-16 bg-blue-500 rounded mt-2"></div>
        </div>
    );
}

export default PageTitle;