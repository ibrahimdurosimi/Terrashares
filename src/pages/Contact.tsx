import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-10 pt-40 pb-20 overflow-hidden bg-gradient-to-b from-[#FAF8F5] to-white">
        <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none">
          <MessageCircle className="w-[500px] h-[500px]" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#9B8924] text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-6"
          >
            Contact Us
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-[#0A0A0A] mb-8 leading-[1.1]" 
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Let's build your <span className="text-[#9B8924] italic">portfolio.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#0A0A0A]/60 max-w-2xl mx-auto leading-relaxed"
          >
            Whether you're ready to invest, have a question about our properties, or need technical support, our team is here to help.
          </motion.p>
        </div>
      </section>

      {/* 2. Contact Content */}
      <section className="px-4 sm:px-6 lg:px-10 py-12 md:py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-3xl text-[#0A0A0A] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                Get in touch
              </h2>
              <p className="text-[#0A0A0A]/60 leading-relaxed mb-10 max-w-sm">
                We'd love to hear from you. Our friendly team is always here to chat.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#FAF8F5] rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-[#9B8924]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0A0A0A] text-lg mb-1">Email us</h3>
                  <p className="text-[#0A0A0A]/60 mb-2 text-sm">Our friendly team is here to help.</p>
                  <a href="mailto:hello@terrashare.ng" className="text-[#9B8924] font-bold hover:underline">hello@terrashare.ng</a>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#FAF8F5] rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-[#9B8924]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0A0A0A] text-lg mb-1">Visit us</h3>
                  <p className="text-[#0A0A0A]/60 mb-2 text-sm">Come say hello at our office HQ.</p>
                  <p className="text-[#0A0A0A] font-medium leading-relaxed mt-2">
                    14 Admiralty Way,<br/>
                    Lekki Phase 1,<br/>
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-[#FAF8F5] rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-[#9B8924]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0A0A0A] text-lg mb-1">Call us</h3>
                  <p className="text-[#0A0A0A]/60 mb-2 text-sm">Mon-Fri from 8am to 5pm.</p>
                  <a href="tel:+2348056599547" className="text-[#0A0A0A] font-bold hover:text-[#9B8924] transition-colors">+234 805 659 9547</a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/[0.04]">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-[#9B8924]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10 text-[#9B8924]" />
                  </div>
                  <h3 className="text-3xl text-[#0A0A0A] mb-4" style={{ fontFamily: 'Georgia, serif' }}>Message Sent!</h3>
                  <p className="text-[#0A0A0A]/60 leading-relaxed max-w-sm mx-auto">
                    Thanks for reaching out. A member of our team will get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-bold text-[#0A0A0A]/70 uppercase tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full h-14 bg-[#FAF8F5] border border-black/5 rounded-xl px-4 focus:outline-none focus:border-[#9B8924] transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-bold text-[#0A0A0A]/70 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full h-14 bg-[#FAF8F5] border border-black/5 rounded-xl px-4 focus:outline-none focus:border-[#9B8924] transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-bold text-[#0A0A0A]/70 uppercase tracking-wider">Subject</label>
                    <input 
                      type="text" 
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full h-14 bg-[#FAF8F5] border border-black/5 rounded-xl px-4 focus:outline-none focus:border-[#9B8924] transition-colors"
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-bold text-[#0A0A0A]/70 uppercase tracking-wider">Message</label>
                    <textarea 
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-[#FAF8F5] border border-black/5 rounded-xl p-4 focus:outline-none focus:border-[#9B8924] transition-colors resize-none"
                      placeholder="Tell us a little more about your inquiry..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#0A0A0A] text-white rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* 3. FAQ Link Section */}
      <section className="px-4 sm:px-6 lg:px-10 py-24 bg-[#0A0A0A] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>Got a quick question?</h2>
          <p className="text-white/70 mb-10 leading-relaxed">
            We might have already answered it. Check out our Frequently Asked Questions for quick answers on investments, returns, and security.
          </p>
          <Link 
            to="/" 
            className="inline-flex h-12 items-center justify-center rounded-full bg-transparent border border-white/20 px-8 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#0A0A0A]"
          >
            Visit FAQ Section
          </Link>
        </div>
      </section>
    </div>
  );
}
