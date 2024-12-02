"use client";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background Image with Black & White Effect */}
      <div className="absolute inset-0">
        <img
          src="/home.jpg" // Assuming home.jpg is in the public folder
          alt="FitFrenzy Community"
          className="object-cover w-full h-full filter grayscale"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 py-10 md:px-12 font-bold">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Welcome to FitFrenzy!
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Join our vibrant community dedicated to helping you achieve your
          fitness goals. Whether you're just starting your journey or are a
          seasoned fitness enthusiast, FitFrenzy has something for you!
        </p>

        {/* About FitFrenzy */}
        <div className="mb-8 max-w-2xl mx-auto">
          <p className="text-lg md:text-xl mb-4">
            At FitFrenzy, we believe that true fitness is a balance between
            exercise and nutrition. Our community provides expert guidance and
            resources for both. Create workout plans, whether you're aiming to
            build strength, increase endurance, or just stay healthy.
          </p>
          <p className="text-lg md:text-xl mb-4">
            We also offer nutrition advice and meal plans that help you fuel
            your body for optimal performance. Whether you're looking to lose
            weight, build muscle, or maintain a balanced diet, we've got you
            covered!
          </p>
          <p className="text-lg md:text-xl mb-4">
            Our mission is to make fitness accessible and enjoyable for
            everyone. We want to inspire you to push your limits, challenge
            yourself, and become the best version of you. Remember, every small
            step counts. It’s not about perfection; it’s about progress.
          </p>
        </div>

        {/* Join Call to Action */}
        <a
          href="/register"
          className="px-6 py-3 bg-neutral-500 text-white text-lg rounded-full shadow-lg hover:bg-neutral-600 transition duration-300"
        >
          Join Our Community
        </a>
      </div>

      {/* Optional: Footer Section */}
      <footer className="absolute bottom-0 w-full bg-black text-white py-4 text-center">
        <p>&copy; 2024 FitFrenzy. All rights reserved.</p>
      </footer>
    </div>
  );
}
