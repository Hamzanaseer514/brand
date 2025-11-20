'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { BASE_URL } from '@/lib/config';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const apiUrl = BASE_URL ? `${BASE_URL}/api/contact` : `/api/contact`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({ type: 'success', message: data.message || 'Thank you for your message! We will get back to you soon.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus({ type: 'error', message: 'Connection error. Please check your internet connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'info@luxeittar.com',
      link: 'mailto:info@luxeittar.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+92 347 4566501',
      link: 'tel:+923474566501',
    },
    {
      icon: MapPin,
      title: 'Address',
      content: '123 Perfume Street, Luxury District, Dubai, UAE',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-luxury-black pt-24 md:pt-28 pb-12 md:pb-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 mt-8"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-luxury-ivory">
            Get in Touch
          </h1>
          <p className="text-xl text-luxury-ivory/60 max-w-2xl mx-auto">
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as
            possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-2xl border border-luxury-gold/20"
          >
            <h2 className="text-3xl font-serif font-bold text-luxury-ivory mb-8">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-ivory/70 mb-2">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory resize-none"
                />
              </div>
              {submitStatus.type && (
                <div
                  className={`p-4 rounded-lg ${
                    submitStatus.type === 'success'
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                      : 'bg-red-500/20 border border-red-500/50 text-red-400'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                className="w-full px-6 py-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold rounded-lg hover:shadow-luxury-lg transition-all gold-glow flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={20} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={info.title}
                  href={info.link}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-6 glass p-6 rounded-2xl border border-luxury-gold/20 hover:border-luxury-gold transition-all group"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-luxury-gold/10 rounded-xl flex items-center justify-center group-hover:bg-luxury-gold/20 transition-colors border border-luxury-gold/30">
                    <Icon size={28} className="text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-luxury-ivory mb-2">
                      {info.title}
                    </h3>
                    <p className="text-luxury-ivory/70">{info.content}</p>
                  </div>
                </motion.a>
              );
            })}

            {/* Google Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl border border-luxury-gold/20 overflow-hidden h-64"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1985099926!2d55.2708!3d25.1972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDExJzQ5LjkiTiA1NcKwMTYnMTQuOSJF!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
