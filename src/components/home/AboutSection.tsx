"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Lightbulb, Shield, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Description animation with stagger
      gsap.fromTo(
        ".description-text",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 75%",
            end: "bottom 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Values cards animation
      gsap.fromTo(
        ".value-card",
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 70%",
            end: "bottom 40%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Background elements animation
      gsap.fromTo(
        ".bg-element",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 40%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Counter animation
      gsap.fromTo(
        ".counter",
        { textContent: 0 },
        {
          textContent: 2007,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: ".counter",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const values = [
    {
      icon: Users,
      title: "Partnership",
      description:
        "Building lasting relationships with clients and suppliers across Morocco",
    },
    {
      icon: Lightbulb,
      title: "Creativity",
      description:
        "Innovative solutions for every building challenge and requirement",
    },
    {
      icon: Shield,
      title: "Ethics",
      description:
        "Transparent business practices and unwavering commitment to quality",
    },
    {
      icon: Heart,
      title: "Team Spirit",
      description: "Collaborative approach driving excellence in every project",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="bg-element absolute top-20 right-10 w-64 h-64 bg-[#911828]/5 rounded-full blur-3xl"></div>
        <div className="bg-element absolute bottom-20 left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl"></div>
        <div className="bg-element absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#911828]/3 to-blue-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            About{" "}
            <span className="text-[#911828] relative">
              HAVA HARD TRADE
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#911828]/50 rounded-full"></div>
            </span>
          </h2>
        </div>

        {/* Description */}
        <div ref={descriptionRef} className="max-w-5xl mx-auto mb-20">
          <div className="text-center space-y-6">
            <p className="description-text text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
              From classic locks to fire doors and connected products, HAVA HARD
              TRADE has established itself as a{" "}
              <span className="font-semibold text-[#911828]">key player</span>{" "}
              in Morocco&apos;s building market since{" "}
              <span className="counter font-bold text-[#911828] text-2xl">
                2007
              </span>
              .
            </p>

            <p className="description-text text-lg md:text-xl text-gray-600 leading-relaxed">
              We represent a dozen international brands across{" "}
              <span className="font-medium text-gray-800">modern retail</span>,{" "}
              <span className="font-medium text-gray-800">
                traditional hardware
              </span>
              , <span className="font-medium text-gray-800">e-commerce</span>,
              and{" "}
              <span className="font-medium text-gray-800">
                large-scale projects
              </span>{" "}
              like hospitals and hotels.
            </p>

            <div className="description-text flex justify-center pt-6">
              <div className="inline-flex items-center px-6 py-3 bg-[#911828]/10 rounded-full">
                <span className="text-[#911828] font-semibold text-lg">
                  18 International Brands
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Values
          </h3>
          <p className="text-lg text-gray-600">
            The principles that guide our mission
          </p>
        </div>

        <div
          ref={valuesRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {values.map((value, index) => (
            <div
              key={index}
              className="value-card group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#911828]/20"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#911828]/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#911828] transition-colors duration-300">
                  <value.icon className="w-8 h-8 text-[#911828] group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#911828] transition-colors duration-300">
                  {value.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="description-text">
            <div className="text-4xl md:text-5xl font-bold text-[#911828] mb-2">
              18+
            </div>
            <div className="text-gray-600 text-lg">International Brands</div>
          </div>
          <div className="description-text">
            <div className="text-4xl md:text-5xl font-bold text-[#911828] mb-2">
              17+
            </div>
            <div className="text-gray-600 text-lg">Years of Experience</div>
          </div>
          <div className="description-text">
            <div className="text-4xl md:text-5xl font-bold text-[#911828] mb-2">
              1000+
            </div>
            <div className="text-gray-600 text-lg">Projects Completed</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
