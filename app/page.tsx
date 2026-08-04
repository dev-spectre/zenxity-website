"use client";

import { Button } from "@/components/ui/button";
import {
  Leaf,
  Clock,
  TrendingUp,
  Award,
  ArrowRight,
  Play,
  Sprout,
  BarChart3,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Banknote,
  CheckCircle,
  Shield,
  Truck,
  LandPlot,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    district: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url =
        "https://docs.google.com/forms/d/e/1FAIpQLSd-wb5wl3no9om4Eqva2-2Dux6fgS3YBVzVa8nF4c9SlGJq6g/formResponse";
      const formDataParams = new URLSearchParams();
      formDataParams.append("entry.2005620554", formData.name);
      formDataParams.append("entry.1065046570", formData.district);
      formDataParams.append("entry.1166974658", formData.phone);
      formDataParams.append("entry.839337160", formData.message);

      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formDataParams.toString(),
      });

      toast({
        title: "Message Sent!",
        description: "We'll get back to you soon.",
      });

      setFormData({ name: "", phone: "", district: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lightweight lazy YouTube embed to avoid loading iframe on mobile until user interacts
  function LazyYouTube({ videoId, title }: { videoId: string; title: string }) {
    const [play, setPlay] = useState(false);
    const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    return (
      <div className="w-full h-full relative bg-gray-100">
        {!play ? (
          <button
            onClick={() => setPlay(true)}
            className="w-full h-full flex items-center justify-center relative"
            aria-label={`Play ${title}`}
          >
            <img
              src={thumb}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 rounded-full p-3">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 5v14l11-7L8 5z" fill="#111827" />
                </svg>
              </div>
            </div>
          </button>
        ) : (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>
    );
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-0 md:min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/hero-farm.jpg"
            alt="Lush green farmland"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
        </div>

        <div className="container relative z-10 py-12 md:py-32 mx-auto px-4 md:px-8">
          <div className="max-w-2xl space-y-6 md:space-y-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-600/30 text-white text-sm font-medium border border-green-500/30 md:backdrop-blur-sm">
              {mounted ? t("🌾 Managed Farmland Platform") : ""}
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-sm">
              {mounted
                ? t("Your land can earn money, even while you rest.")
                : ""}
            </h1>

            <p className="text-lg md:text-xl text-gray-200 max-w-lg">
              {mounted
                ? t(
                    "We find the farmers. We manage the work. You get paid every season. Simple.",
                  )
                : ""}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={isLoggedIn ? "/dashboard/land" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20"
              >
                {mounted ? t("Register Your Land Free") : ""}{" "}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="#about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold rounded-xl border-2 border-white/30 text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                <Play size={18} /> {mounted ? t("Watch How It Works") : ""}
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
              <span>{mounted ? t("✓ Free to join") : ""}</span>
              <span>{mounted ? t("✓ No paperwork hassle") : ""}</span>
              <span>{mounted ? t("✓ Tamil support") : ""}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground tracking-tight leading-tight">
              {mounted ? t("Why Choose Zenxity?") : ""}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 p-4 lg:p-0">
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 to-green-light p-8 border border-border/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <h3 className="text-2xl font-bold text-foreground mb-4 transition-colors">
                {mounted ? t("Easy to Get Started") : ""}
              </h3>
              <p className="text-muted-foreground leading-relaxed transition-colors">
                {mounted
                  ? t(
                      "Share your land details and our team takes care of the rest.",
                    )
                  : ""}
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/5 to-primary/5 p-8 border border-border/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10">
              <div className="absolute inset-0 bg-gradient-to-t from-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <h3 className="text-2xl font-bold text-foreground mb-4 transition-colors">
                {mounted ? t("Complete Transparency") : ""}
              </h3>
              <p className="text-muted-foreground leading-relaxed transition-colors">
                {mounted
                  ? t(
                      "Track farming activities through real-time updates, photos, and reports.",
                    )
                  : ""}
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 p-8 border border-border/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/10">
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <h3 className="text-2xl font-bold text-foreground mb-4 transition-colors">
                {mounted ? t("Professional Management") : ""}
              </h3>
              <p className="text-muted-foreground leading-relaxed transition-colors">
                {mounted
                  ? t(
                      "Experienced teams handle all farming operations efficiently.",
                    )
                  : ""}
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/5 to-green-light p-8 border border-border/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <h3 className="text-2xl font-bold text-foreground mb-4 transition-colors">
                {mounted ? t("Better Use of Your Land") : ""}
              </h3>
              <p className="text-muted-foreground leading-relaxed transition-colors">
                {mounted
                  ? t("Convert unused land into productive farmland.")
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground tracking-tight leading-tight">
              {mounted ? t("Three steps. That's it.") : ""}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {mounted
                ? t("No complicated process. No technical knowledge needed.")
                : ""}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                num: "01",
                icon: MapPin,
                title: mounted ? t("Register Your Land") : "",
                desc: mounted
                  ? t(
                      "Just your name, land location, and a photo. Our team will call you within 24 hours to verify.",
                    )
                  : "",
              },
              {
                num: "02",
                icon: Sprout,
                title: mounted ? t("We Manage Everything") : "",
                desc: mounted
                  ? t(
                      "Our expert team takes full charge — from land prep and planting to monitoring and harvest. You get photo updates every week.",
                    )
                  : "",
              },
              {
                num: "03",
                icon: Banknote,
                title: mounted ? t("Receive Your Returns") : "",
                desc: mounted
                  ? t(
                      "After every harvest, money goes directly to your bank account. Track every rupee on your phone.",
                    )
                  : "",
              },
            ].map((s, i) => (
              <div
                key={s.num}
                className="group relative rounded-3xl p-6 sm:p-10 bg-white border border-gray-100 shadow-2xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300"
              >
                {/* Number badge */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-2xl border-4 border-white text-white font-black text-2xl drop-shadow-lg z-20">
                  {s.num}
                </div>

                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-xl relative z-10">
                  <s.icon size={36} className="text-white drop-shadow-lg" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center leading-tight relative z-10">
                  {s.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed text-center opacity-95 relative z-10">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Generation Section */}
      <section id="partner" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground tracking-tight leading-tight">
                  {mounted ? t("Partner With Us Today") : ""}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                  {mounted
                    ? t(
                        "If you own agricultural land but cannot actively manage it, Zenxity can help you generate income while ensuring modern, sustainable farming practices.",
                      )
                    : ""}
                </p>
              </div>

              <ul className="space-y-6">
                {[
                  mounted
                    ? t(
                        "Maximize your land's potential with professional management",
                      )
                    : "",
                  mounted
                    ? t("Receive regular updates directly on your device")
                    : "",
                  mounted
                    ? t("Completely hands-off experience for landowners")
                    : "",
                  mounted ? t("Sustainable and modern farming practices") : "",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <div className="flex-shrink-0 bg-gray-50 text-green-600 rounded-2xl p-4 inline-flex items-center justify-center transition-all duration-300 group-hover:bg-green-600 group-hover:text-white shadow-sm border border-gray-100 group-hover:-translate-y-1">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78748L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative lg:ml-auto w-full max-w-2xl">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden aspect-video">
                <LazyYouTube
                  videoId="6bC1KxqYACY"
                  title="Your Farmland Is Sitting Idle? Let It Work For You 🌱"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-left max-w-3xl mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground tracking-tight leading-tight">
              {mounted ? t("About Zenxity") : ""}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {mounted
                ? t(
                    "We help landowners turn unused or underutilized agricultural land into productive farmland, managing the entire process with complete transparency.",
                  )
                : ""}
            </p>
          </div>

          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground tracking-tight leading-tight">
                {mounted ? t("Our Mission") : ""}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {mounted
                ? t(
                    "We use tech and expert farm management to help landowners generate sustainable, transparent income.",
                  )
                : ""}
            </p>
          </div>

          <div className="space-y-8 max-w-4xl">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-2xl font-bold text-foreground">
                  {mounted ? t("Our Services Include") : ""}
                </h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                {[
                  mounted ? t("Contract farming management") : "",
                  mounted ? t("Land preparation & soil treatment") : "",
                  mounted ? t("Seeding & planting services") : "",
                  mounted ? t("Crop monitoring & maintenance") : "",
                  mounted ? t("Harvesting & post-harvest management") : "",
                  mounted ? t("Real-time updates & reports") : "",
                ].map((service, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <div className="mt-1 bg-green-100 rounded-full p-1 text-green-600 flex-shrink-0">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78748L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-sm leading-tight">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-green-900/20">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="/plowing.jpg"
                alt="Farming CTA Background"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/70 to-emerald-900/80 mix-blend-multiply" />
            </div>

            <div className="relative z-10 px-8 py-16 md:py-20 md:px-16 text-center text-white">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 drop-shadow-sm">
                {mounted ? t("Start Earning From Your Land Today") : ""}
              </h2>
              <p className="text-lg hidden md:block md:text-xl mb-10 max-w-2xl mx-auto text-green-50 drop-shadow">
                {mounted
                  ? t(
                      "Submit your land details and let our farming experts handle the rest. Sit back, relax, and watch your unused land turn into a steady source of income.",
                    )
                  : ""}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href={isLoggedIn ? "/dashboard" : "/login"}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-green-700 hover:bg-gray-50 px-6 py-5 sm:px-8 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-xl transition-transform hover:-translate-y-1"
                  >
                    {mounted ? t("Get Started Now") : ""}{" "}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground tracking-tight leading-tight">
                  {mounted ? t("Have a question? Talk to us.") : ""}
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100 group-hover:-translate-y-1 transition-transform">
                    <Phone size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {mounted ? t("Phone") : ""}
                    </p>
                    <p className="font-semibold text-foreground text-lg">
                      +91 90423 59210
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100 group-hover:-translate-y-1 transition-transform">
                    <Mail size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {mounted ? t("Email") : ""}
                    </p>
                    <a
                      href="mailto:zenxity.in@gmail.com"
                      className="font-semibold text-foreground text-lg hover:text-green-600 transition-colors"
                    >
                      zenxity.in@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/919042359210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20bd5a] transition-colors shadow-md shadow-green-900/10 hover:-translate-y-0.5 transform"
              >
                <MessageCircle size={20} />{" "}
                {mounted ? t("Chat on WhatsApp") : ""}
              </a>
            </div>

            {/* Right - Form */}
            <div className="relative lg:ml-auto w-full max-w-lg">
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                <form className="space-y-5" onSubmit={handleContactSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {mounted ? t("Name") : ""}
                    </label>
                    <input
                      required
                      type="text"
                      placeholder={mounted ? (t("Your name") as string) : ""}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 text-base transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {mounted ? t("Phone Number") : ""}
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 text-base transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {mounted ? t("Your District") : ""}
                    </label>
                    <input
                      required
                      type="text"
                      placeholder={
                        mounted ? (t("e.g. Coimbatore") as string) : ""
                      }
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 text-base transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {mounted ? t("Message") : ""}
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={
                        mounted
                          ? (t("Tell us about your land...") as string)
                          : ""
                      }
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 text-base resize-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-green-600 text-white font-semibold text-base hover:bg-green-700 transition-colors shadow-md shadow-green-600/20 disabled:opacity-70"
                  >
                    {mounted
                      ? isSubmitting
                        ? t("Sending...")
                        : t("Send Message")
                      : ""}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-gray-300 py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/logo-transparent.png"
                  alt="Zenxity Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 drop-shadow-md"
                />
                <span className="text-2xl font-bold text-white tracking-tight">
                  Zenxity
                </span>
              </div>
              <p className="text-zinc-400 leading-relaxed pr-4">
                {mounted ? t("Let Your Land Work for You.") : ""}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white text-lg mb-6">
                {mounted ? t("Services") : ""}
              </h4>
              <ul className="space-y-3 text-zinc-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    {mounted ? t("Land Preparation") : ""}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    {mounted ? t("Seeding") : ""}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    {mounted ? t("Crop Management") : ""}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    {mounted ? t("Harvesting") : ""}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-lg mb-6">
                {mounted ? t("Support") : ""}
              </h4>
              <ul className="space-y-3 text-zinc-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    {mounted ? t("Help Center") : ""}
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-green-400 transition-colors"
                  >
                    {mounted ? t("Contact Us") : ""}
                  </a>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-green-400 transition-colors"
                  >
                    {mounted ? t("Privacy Policy") : ""}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-green-400 transition-colors"
                  >
                    {mounted ? t("Terms of Service") : ""}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-lg mb-6">
                {mounted ? t("Contact Us") : ""}
              </h4>
              <ul className="space-y-4 text-zinc-400">
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-green-600" />
                  <span>+91 90423 59210</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-green-600" />
                  <a
                    href="mailto:zenxity.in@gmail.com"
                    className="hover:text-green-400 transition-colors"
                  >
                    zenxity.in@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800/80 pt-8 text-center text-zinc-500">
            <p>&copy; 2026 Zenxity. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
