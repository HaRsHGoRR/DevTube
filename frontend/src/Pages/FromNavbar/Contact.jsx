import React from 'react';

const Contact = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full mx-5 my-5">
        <div className="max-w-md w-full" style={{ backgroundColor: 'rgba(0, 162, 255, 0.1)', padding: '20px', border: '1px solid #000', borderRadius: '10px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 className="text-xl font-semibold mb-6">Contact Us</h2>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block mb-1" htmlFor="name">Name</label>
              <input
                className="w-full border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-400"
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                required
                style={{ color: 'black' }}
              />
            </div>
            <div>
              <label className="block mb-1" htmlFor="email">Email</label>
              <input
                className="w-full border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-400"
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                required
                style={{ color: 'black' }}
              />
            </div>
            <div>
              <label className="block mb-1" htmlFor="message">Message</label>
              <textarea
                className="w-full border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-400"
                id="message"
                name="message"
                rows="4"
                placeholder="Your Message"
                required
                style={{ color: 'black' }}
              ></textarea>
            </div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-bold" // Added font-bold style
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
