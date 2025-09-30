"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSupabaseVideos } from "@/hooks/useSupabase";
import { VideoRecord } from "@/lib/supabase";

export default function About() {
  const [portfolioVideos, setPortfolioVideos] = useState<VideoRecord[]>([]);
  const { getVideos } = useSupabaseVideos();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const portfolioData = await getVideos("portfolio");
      setPortfolioVideos(portfolioData);
    } catch (error) {
      console.error("Error loading videos:", error);
    }
  };

  const timelineSteps = [
    {
      time: "Getting Ready",
      title: "The Anticipation Begins",
      description:
        "We capture the intimate moments of preparation - the nervous excitement, the helping hands of loved ones, and those quiet moments of reflection before the big day unfolds.",
      icon: "💄",
      color: "from-pink-400 to-rose-400",
    },
    {
      time: "First Look",
      title: "That Magic Moment",
      description:
        "The emotional first glimpse between partners. We position ourselves to capture every tear, every smile, and every heartbeat of this deeply personal moment.",
      icon: "👀",
      color: "from-purple-400 to-pink-400",
    },
    {
      time: "Ceremony",
      title: "Saying 'I Do'",
      description:
        "The heart of your wedding day. We document every vow, every kiss, and every joyful tear as you commit to your forever love story.",
      icon: "💒",
      color: "from-blue-400 to-purple-400",
    },
    {
      time: "Portraits",
      title: "Capturing Your Glow",
      description:
        "With the ceremony complete, we create stunning portraits that showcase your happiness and the beauty of your new union against breathtaking backdrops.",
      icon: "📸",
      color: "from-green-400 to-blue-400",
    },
    {
      time: "Reception",
      title: "Celebration & Dancing",
      description:
        "The party begins! We capture the laughter, the speeches, the first dance, and all the joyful chaos that makes your reception uniquely yours.",
      icon: "🎉",
      color: "from-yellow-400 to-green-400",
    },
    {
      time: "Golden Hour",
      title: "Magic Hour Romance",
      description:
        "As the sun sets, we steal you away for intimate golden hour shots that will take your breath away and become some of your most treasured images.",
      icon: "🌅",
      color: "from-orange-400 to-yellow-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6 tracking-wide">
                ABOUT US
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
                We dont just film weddings – we capture the soul of your love
                story
              </p>
              <div className="prose prose-lg text-gray-300">
                <p className="mb-6">
                  At Films by Wadson, we believe every love story deserves to be
                  told with passion, artistry, and authenticity. Founded on the
                  principle that your wedding day is more than just an event –
                  its the beginning of your greatest adventure.
                </p>
                <p>
                  Our cinematic approach combines documentary-style storytelling
                  with breathtaking visuals, ensuring that every laugh, every
                  tear, and every heartfelt moment is preserved for generations
                  to come.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl overflow-hidden shadow-2xl">
                {portfolioVideos.length > 0 ? (
                  <video
                    src={portfolioVideos[0].file_path}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🎬</div>
                      <p className="text-xl font-light">Our Story in Motion</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-6 tracking-wide">
              OUR PHILOSOPHY
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Every wedding is unique, and every couple has a story that
              deserves to be told beautifully
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎥</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Cinematic Excellence
              </h3>
              <p className="text-gray-300">
                We use professional-grade equipment and techniques to create
                films that rival Hollywood productions, ensuring your wedding
                looks like a masterpiece.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Authentic Emotion
              </h3>
              <p className="text-gray-300">
                We capture genuine moments and real emotions, creating films
                that transport you back to exactly how you felt on your special
                day.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Timeless Artistry
              </h3>
              <p className="text-gray-300">
                Our films are crafted to be treasured for decades, using classic
                techniques and modern technology to create something truly
                timeless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Day Timeline */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-6 tracking-wide">
              YOUR WEDDING DAY JOURNEY
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From the first nervous butterflies to the last dance, were there
              to capture every precious moment
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-400 via-purple-400 to-blue-400 hidden md:block"></div>

            <div className="space-y-12">
              {timelineSteps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-4 h-4 bg-white rounded-full border-4 border-slate-900 hidden md:block"></div>

                  <div className="md:ml-20">
                    <div
                      className={`bg-gradient-to-r ${step.color} p-0.5 rounded-2xl mb-6`}
                    >
                      <div className="bg-slate-800 rounded-2xl p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                          <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                            <div className="flex items-center mb-4">
                              <span className="text-3xl mr-4">{step.icon}</span>
                              <div>
                                <span className="text-sm font-medium text-purple-300 uppercase tracking-wider">
                                  {step.time}
                                </span>
                                <h3 className="text-2xl font-semibold text-white">
                                  {step.title}
                                </h3>
                              </div>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed">
                              {step.description}
                            </p>
                          </div>

                          <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                            <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl overflow-hidden">
                              {portfolioVideos[index] ? (
                                <video
                                  src={portfolioVideos[index].file_path}
                                  className="w-full h-full object-cover"
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="text-center text-gray-400">
                                    <div className="text-4xl mb-2">
                                      {step.icon}
                                    </div>
                                    <p className="text-sm">
                                      Sample footage coming soon
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Behind the Scenes */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-6 tracking-wide">
              BEHIND THE MAGIC
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Meet the passion and artistry that goes into every frame
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl overflow-hidden mb-8">
                {portfolioVideos.length > 1 ? (
                  <video
                    src={portfolioVideos[1].file_path}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🎬</div>
                      <p className="text-xl font-light">Behind the Scenes</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">
                Our Approach
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Pre-Wedding Consultation
                    </h4>
                    <p className="text-gray-300">
                      We get to know you as a couple, understanding your vision
                      and planning every detail.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Unobtrusive Documentation
                    </h4>
                    <p className="text-gray-300">
                      We blend into your day, capturing authentic moments
                      without interrupting the flow.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">
                      Cinematic Post-Production
                    </h4>
                    <p className="text-gray-300">
                      Every frame is carefully crafted with professional color
                      grading and sound design.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-6">
            Ready to Tell Your Story?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Lets create something beautiful together. Your love story deserves
            to be told with the artistry and passion it deserves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Get In Touch
            </Link>
            <Link
              href="/portfolio"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-300"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-xl font-light mb-2 tracking-wide">
                FILMS BY WADSON
              </h3>
              <p className="text-gray-400">
                Creating beautiful wedding memories
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Footer />
    </div>
  );
}
