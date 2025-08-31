import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import GoogleAd from "@/components/GoogleAd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error submitting contact form:', error);
      }
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header Section */}
      <div className="bg-blue-600 text-white py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 border-4 border-white bg-yellow-400 text-black px-8 py-4 inline-block transform -rotate-2 shadow-[8px_8px_0px_0px_#000]">
            CONTACT US
          </h1>
          <p className="text-xl md:text-2xl font-bold max-w-3xl mx-auto mt-8">
            Get in touch with the Cars History Check team for support, inquiries, or feedback
          </p>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-black mb-8 border-4 border-black bg-yellow-400 px-6 py-3 inline-block transform -rotate-1">
              GET IN TOUCH
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 p-3 border-2 border-black">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Email Support</h3>
                    <p className="text-gray-600">info@carshistorycheck.com</p>
                    <p className="text-sm text-gray-500">We respond within 2 hours</p>
                  </div>
                </div>
              </div>

              

              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-600 p-3 border-2 border-black">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Office Location</h3>
                    <p className="text-gray-600">19th Floor, Binary By Omniyat, Dubai, United Arab Emirates</p>
                    <p className="text-sm text-gray-500">Serving the Enitire Middle East, Europe & Africa</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 p-3 border-2 border-black">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Business Hours</h3>
                    <p className="text-gray-600">Sunday - Thursday: 9:00 AM - 6:00 PM</p>
                    <p className="text-sm text-gray-500">Friday - Saturday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-black mb-8 border-4 border-black bg-green-400 px-6 py-3 inline-block transform rotate-1">
              SEND MESSAGE
            </h2>

            <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000]">
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-100 border-4 border-green-600 p-4 mb-6 shadow-[4px_4px_0px_0px_#000]">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-black text-green-800">Message Sent Successfully!</p>
                      <p className="text-green-700 text-sm">We'll get back to you within 2 hours.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-100 border-4 border-red-600 p-4 mb-6 shadow-[4px_4px_0px_0px_#000]">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-black text-red-800">Failed to Send Message</p>
                      <p className="text-red-700 text-sm">Please try again or email us directly at info@carshistorycheck.com</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black mb-2 uppercase">Full Name *</label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="border-2 border-black text-lg p-3"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase">Email Address *</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="border-2 border-black text-lg p-3"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase">Subject *</label>
                  <Input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="border-2 border-black text-lg p-3"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase">Message *</label>
                  <Textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="border-2 border-black text-lg p-3"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-4 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transform hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                </Button>

                {submitStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-100 border-2 border-green-500 text-green-700 font-bold">
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mt-4 p-4 bg-red-100 border-2 border-red-500 text-red-700 font-bold">
                    Sorry, there was an error sending your message. Please try again or contact us directly at info@carshistorycheck.com.
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-black mb-8 text-center border-4 border-black bg-yellow-400 px-6 py-3 inline-block">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-black text-lg mb-3">How do I get a refund?</h3>
              <p className="text-gray-600">We offer a 7-day refund policy. Contact us within 7 days of purchase for a full refund.</p>
            </div>
            
            <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-black text-lg mb-3">How accurate are your reports?</h3>
              <p className="text-gray-600">Our reports use official databases and auction records to provide the most accurate vehicle history available.</p>
            </div>
            
            <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-black text-lg mb-3">Do you cover all UAE vehicles?</h3>
              <p className="text-gray-600">Yes, we provide comprehensive coverage for vehicles list for Sale or Auction anywhere in the world.</p>
            </div>
            
            <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_#000]">
              <h3 className="font-black text-lg mb-3">How long does it take to get a report?</h3>
              <p className="text-gray-600">Most reports are generated instantly. Complex cases may take up to few hours.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Google Ad */}
      <GoogleAd />
    </div>
  );
}