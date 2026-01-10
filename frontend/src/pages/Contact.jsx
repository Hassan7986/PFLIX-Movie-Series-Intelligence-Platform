export default function Contact() {
  return (
    <div className="min-h-screen bg-dark-950 pt-24">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-6">Contact Us</h1>
        
        <div className="card p-8 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Get in Touch</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Have questions, suggestions, or feedback? We'd love to hear from you! 
            Feel free to reach out to us through any of the following channels.
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-600 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Email</h3>
                <p className="text-gray-400">support@pflix.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-600 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Location</h3>
                <p className="text-gray-400">123 Movie Street, Cinema City, CC 12345</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-600 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Phone</h3>
                <p className="text-gray-400">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Send us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
              <input
                type="text"
                className="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
              <input
                type="text"
                className="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea
                rows="5"
                className="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Your message..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn-primary w-full py-3"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            We typically respond within 24-48 hours during business days
          </p>
        </div>
      </div>
    </div>
  );
}
