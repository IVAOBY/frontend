import bylogo from "../assets/image/logo30px.svg";

export function Footer() {
    return (
        <div className="mt-32 bg-ivao-blue text-center z-10">
            <div className="py-6 flex items-center justify-center sm:flex-col">
                <img className="w-48" src={bylogo} alt="BY Logo" />
            </div>
        </div>
    );
}
