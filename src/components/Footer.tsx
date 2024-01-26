import bylogo from '../assets/image/logo30px.svg';

export function Footer() {
  return (
    <div className="z-10 mt-32 bg-ivao-blue text-center">
      <div className="flex items-center justify-center py-6 sm:flex-col">
        <img className="w-48" src={bylogo} alt="BY Logo" />
      </div>
    </div>
  );
}
