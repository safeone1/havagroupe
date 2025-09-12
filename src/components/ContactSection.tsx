"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

      // Form animation
      gsap.fromTo(
        ".form-element",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 75%",
            end: "bottom 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Contact info animation
      gsap.fromTo(
        ".contact-info-item",
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contactInfoRef.current,
            start: "top 75%",
            end: "bottom 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Background elements
      gsap.fromTo(
        ".contact-bg-element",
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

      // Floating animation for decorative elements
      gsap.to(".floating-contact", {
        y: -15,
        duration: 4,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });

    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "contact@havagroup.ma",
      description: "Get in touch via email",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+212 5XX XXX XXX",
      description: "Mon-Fri 9AM-6PM",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Casablanca, Morocco",
      description: "Our main office location",
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="contact-bg-element floating-contact absolute top-20 right-10 w-64 h-64 bg-[#911828]/5 rounded-full blur-3xl"></div>
        <div className="contact-bg-element floating-contact absolute bottom-20 left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl"></div>
        <div className="contact-bg-element absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#911828]/3 to-blue-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Get In{" "}
            <span className="text-[#911828] relative">
              Touch
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#911828]/50 rounded-full"></div>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to discuss your building solutions needs? Contact us today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="relative">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              <div className="form-element">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:border-[#911828] focus:ring-2 focus:ring-[#911828]/20 transition-all duration-300 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-element">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:border-[#911828] focus:ring-2 focus:ring-[#911828]/20 transition-all duration-300 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-element">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:border-[#911828] focus:ring-2 focus:ring-[#911828]/20 transition-all duration-300 resize-none text-gray-900 placeholder-gray-400"
                  placeholder="Tell us about your project requirements..."
                />
              </div>

              <div className="form-element">
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="w-full bg-[#911828] text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-[#7a1422] transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div ref={contactInfoRef} className="space-y-8">
            <div className="contact-info-item">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our team is ready to help you find the perfect building
                solutions for your project. Reach out through any of the
                channels below.
              </p>
            </div>

            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="contact-info-item group flex items-start space-x-4 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:bg-white/70 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#911828]/10 rounded-xl flex items-center justify-center group-hover:bg-[#911828] transition-colors duration-300">
                  <info.icon className="w-6 h-6 text-[#911828] group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {info.title}
                  </h4>
                  <p className="text-[#911828] font-medium mb-1">
                    {info.value}
                  </p>
                  <p className="text-gray-500 text-sm">{info.description}</p>
                </div>
              </div>
            ))}

            <div className="contact-info-item mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Business Hours
              </h4>
              <div className="space-y-2 text-gray-600">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
