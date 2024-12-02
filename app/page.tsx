"use client";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="absolute inset-0">
        <img
          src="/home.jpg"
          alt="FitFrenzy Community"
          className="object-cover w-full h-full filter grayscale"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 py-10 md:px-12 font-bold">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Welcome to FitFrenzy!
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Join our vibrant community dedicated to helping you achieve your
          fitness goals. Whether you're just starting your journey or are a
          seasoned fitness enthusiast, FitFrenzy has something for you!
        </p>
        <a
          href="/register"
          className="px-6 py-3 bg-neutral-500 text-white text-lg rounded-full shadow-lg hover:bg-neutral-600 transition duration-300"
        >
          Join Our Community
        </a>
      </div>
      <footer className="absolute bottom-0 w-full bg-black text-white py-4 text-center">
        <p>&copy; 2024 FitFrenzy. All rights reserved.</p>
      </footer>
    </div>
  );
}
